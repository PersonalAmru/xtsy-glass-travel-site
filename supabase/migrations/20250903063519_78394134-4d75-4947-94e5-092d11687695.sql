-- Critical Security Fix Migration - Part 2
-- Fix policy conflicts and create missing bookings table

-- Create the missing bookings table with comprehensive security
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id TEXT NOT NULL UNIQUE,
  guest_name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  emergency_contact TEXT,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests INTEGER NOT NULL DEFAULT 1,
  nights INTEGER NOT NULL,
  room_type TEXT NOT NULL DEFAULT 'standard',
  room_details JSONB DEFAULT '{}',
  subtotal INTEGER NOT NULL,
  gst_amount INTEGER DEFAULT 0,
  total_amount INTEGER NOT NULL,
  booking_status TEXT NOT NULL DEFAULT 'pending',
  payment_status TEXT DEFAULT 'pending',
  special_requests TEXT,
  source TEXT DEFAULT 'website',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Add security constraints
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9]([A-Za-z0-9._%-]*[A-Za-z0-9])?@[A-Za-z0-9]([A-Za-z0-9.-]*[A-Za-z0-9])?\.[A-Za-z]{2,}$'),
  CONSTRAINT valid_guest_count CHECK (guests >= 1 AND guests <= 20),
  CONSTRAINT valid_amount CHECK (total_amount > 0 AND total_amount <= 10000000),
  CONSTRAINT valid_dates CHECK (check_out > check_in),
  CONSTRAINT valid_nights CHECK (nights > 0 AND nights <= 365),
  CONSTRAINT valid_phone CHECK (whatsapp_number ~ '^\\+?[1-9]\\d{7,14}$')
);

-- Enable RLS on bookings table
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create comprehensive RLS policies for bookings table
DROP POLICY IF EXISTS "Admins and staff can view all bookings" ON public.bookings;
CREATE POLICY "Admins and staff can view all bookings" 
ON public.bookings 
FOR SELECT 
USING (is_admin_or_staff());

DROP POLICY IF EXISTS "Service role can manage all bookings" ON public.bookings;
CREATE POLICY "Service role can manage all bookings" 
ON public.bookings 
FOR ALL 
USING (auth.role() = 'service_role'::text)
WITH CHECK (auth.role() = 'service_role'::text);

DROP POLICY IF EXISTS "Guests can view their own bookings via email" ON public.bookings;
CREATE POLICY "Guests can view their own bookings via email" 
ON public.bookings 
FOR SELECT 
USING (email = get_jwt_email());

-- Add indexes for performance and security
CREATE INDEX IF NOT EXISTS idx_bookings_email ON public.bookings(email);
CREATE INDEX IF NOT EXISTS idx_bookings_booking_id ON public.bookings(booking_id);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON public.bookings(check_in, check_out);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(booking_status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON public.bookings(created_at);

-- Add triggers only if table was created
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'set_booking_id_trigger') THEN
        CREATE TRIGGER set_booking_id_trigger
          BEFORE INSERT ON public.bookings
          FOR EACH ROW
          EXECUTE FUNCTION public.set_booking_id();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'validate_booking_trigger') THEN
        CREATE TRIGGER validate_booking_trigger
          BEFORE INSERT OR UPDATE ON public.bookings
          FOR EACH ROW
          EXECUTE FUNCTION public.sanitize_and_validate_booking_data();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'log_booking_access_trigger') THEN
        CREATE TRIGGER log_booking_access_trigger
          AFTER INSERT OR UPDATE OR DELETE ON public.bookings
          FOR EACH ROW
          EXECUTE FUNCTION public.log_booking_access();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'update_bookings_updated_at') THEN
        CREATE TRIGGER update_bookings_updated_at
          BEFORE UPDATE ON public.bookings
          FOR EACH ROW
          EXECUTE FUNCTION public.update_updated_at_column();
    END IF;
END $$;

-- Fix RLS policies for backup tables
ALTER TABLE public.booking_rate_limits_backup ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_confirmations_backup ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies for backup tables
DROP POLICY IF EXISTS "Service role can manage rate limits backup" ON public.booking_rate_limits_backup;
CREATE POLICY "Service role can manage rate limits backup" 
ON public.booking_rate_limits_backup 
FOR ALL 
USING (auth.role() = 'service_role'::text)
WITH CHECK (auth.role() = 'service_role'::text);

DROP POLICY IF EXISTS "Admins can view rate limits backup" ON public.booking_rate_limits_backup;
CREATE POLICY "Admins can view rate limits backup" 
ON public.booking_rate_limits_backup 
FOR SELECT 
USING (is_admin());

DROP POLICY IF EXISTS "Service role can manage booking confirmations backup" ON public.booking_confirmations_backup;
CREATE POLICY "Service role can manage booking confirmations backup" 
ON public.booking_confirmations_backup 
FOR ALL 
USING (auth.role() = 'service_role'::text)
WITH CHECK (auth.role() = 'service_role'::text);

DROP POLICY IF EXISTS "Admins can view booking confirmations backup" ON public.booking_confirmations_backup;
CREATE POLICY "Admins can view booking confirmations backup" 
ON public.booking_confirmations_backup 
FOR SELECT 
USING (is_admin());

-- Fix newsletter subscribers policies (drop conflicting one and recreate)
DROP POLICY IF EXISTS "Admins can view newsletter subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Admins can view newsletter subscribers" 
ON public.newsletter_subscribers 
FOR SELECT 
USING (is_admin());

-- Create booking_rate_limits table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.booking_rate_limits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  identifier TEXT NOT NULL,
  identifier_type TEXT NOT NULL CHECK (identifier_type IN ('email', 'ip')),
  booking_count INTEGER NOT NULL DEFAULT 1,
  first_booking_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_booking_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_blocked BOOLEAN NOT NULL DEFAULT false,
  blocked_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(identifier, identifier_type)
);

-- Enable RLS on booking_rate_limits
ALTER TABLE public.booking_rate_limits ENABLE ROW LEVEL SECURITY;

-- Drop and recreate rate limits policies
DROP POLICY IF EXISTS "Service role can manage rate limits" ON public.booking_rate_limits;
CREATE POLICY "Service role can manage rate limits" 
ON public.booking_rate_limits 
FOR ALL 
USING (auth.role() = 'service_role'::text)
WITH CHECK (auth.role() = 'service_role'::text);

DROP POLICY IF EXISTS "Admins can view rate limits" ON public.booking_rate_limits;
CREATE POLICY "Admins can view rate limits" 
ON public.booking_rate_limits 
FOR SELECT 
USING (is_admin());

-- Add indexes for rate limiting performance
CREATE INDEX IF NOT EXISTS idx_booking_rate_limits_identifier ON public.booking_rate_limits(identifier, identifier_type);
CREATE INDEX IF NOT EXISTS idx_booking_rate_limits_blocked_until ON public.booking_rate_limits(blocked_until) WHERE blocked_until IS NOT NULL;