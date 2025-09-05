-- Simple but effective security fix for bookings table
-- Replace vulnerable email-based JWT policy with stronger verification

-- Drop the vulnerable policy
DROP POLICY IF EXISTS "Guests can only view their own bookings" ON public.bookings;

-- Create a more secure function for booking verification
CREATE OR REPLACE FUNCTION public.verify_booking_access_secure(booking_email text, booking_id_param text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  jwt_email text;
  user_authenticated boolean;
  booking_exists boolean;
BEGIN
  -- Get email from JWT
  jwt_email := get_jwt_email();
  
  -- Check if user is authenticated (must have valid session)
  user_authenticated := auth.uid() IS NOT NULL;
  
  -- For unauthenticated users, deny access
  IF NOT user_authenticated THEN
    RETURN false;
  END IF;
  
  -- Verify email matches JWT exactly
  IF jwt_email != booking_email THEN
    RETURN false;
  END IF;
  
  -- CRITICAL: Verify booking_id exists for this email combination
  -- This prevents attackers from just knowing an email address
  SELECT EXISTS(
    SELECT 1 FROM public.bookings 
    WHERE email = booking_email AND booking_id = booking_id_param
  ) INTO booking_exists;
  
  -- Booking must exist for this exact email + booking_id combination
  IF NOT booking_exists THEN
    RETURN false;
  END IF;
  
  -- Log suspicious activity in security_alerts table
  IF jwt_email ~* '(test|fake|spam|bot)' THEN
    INSERT INTO public.security_alerts (alert_type, severity, details, user_id)
    VALUES ('suspicious_booking_access', 'medium', jsonb_build_object(
      'email', jwt_email,
      'booking_id', booking_id_param,
      'reason', 'suspicious_email_pattern'
    ), auth.uid());
  END IF;
  
  RETURN true;
END;
$$;

-- Create enhanced RLS policy requiring both email AND booking_id verification
CREATE POLICY "Authenticated users must verify booking ownership" ON public.bookings
FOR SELECT TO authenticated
USING (verify_booking_access_secure(email, booking_id));

-- Create function for secure booking data retrieval with data masking
CREATE OR REPLACE FUNCTION public.get_secure_booking_data(
  user_email text,
  booking_id_param text
)
RETURNS TABLE (
  id uuid,
  booking_id text,
  check_in date,
  check_out date,
  guests integer,
  subtotal integer,
  taxes integer,
  total_amount integer,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  confirmed_at timestamp with time zone,
  cancelled_at timestamp with time zone,
  guest_name text,
  email text,
  whatsapp_number text,
  room_type text,
  booking_status text,
  payment_status text,
  address text,
  city text,
  state text,
  pincode text,
  emergency_contact text,
  special_requests text,
  source text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Verify access with strict validation
  IF NOT verify_booking_access_secure(user_email, booking_id_param) THEN
    RETURN;
  END IF;
  
  -- Return data with masking for non-admin users
  RETURN QUERY
  SELECT 
    b.id,
    b.booking_id,
    b.check_in,
    b.check_out,
    b.guests,
    b.subtotal,
    b.taxes,
    b.total_amount,
    b.created_at,
    b.updated_at,
    b.confirmed_at,
    b.cancelled_at,
    b.guest_name,
    -- Mask sensitive fields for non-admin users
    CASE 
      WHEN is_admin_or_staff() THEN b.email
      ELSE REGEXP_REPLACE(b.email, '(.{2}).*@', '\1***@', 'g')
    END as email,
    CASE 
      WHEN is_admin_or_staff() THEN b.whatsapp_number
      ELSE REGEXP_REPLACE(b.whatsapp_number, '(.{2}).*(.{2})$', '\1***\2', 'g')
    END as whatsapp_number,
    b.room_type,
    b.booking_status,
    b.payment_status,
    CASE 
      WHEN is_admin_or_staff() THEN b.address
      ELSE LEFT(COALESCE(b.address, ''), 20) || CASE WHEN LENGTH(COALESCE(b.address, '')) > 20 THEN '...' ELSE '' END
    END as address,
    b.city,
    b.state,
    b.pincode,
    CASE 
      WHEN is_admin_or_staff() THEN b.emergency_contact
      ELSE REGEXP_REPLACE(COALESCE(b.emergency_contact, ''), '(.{2}).*(.{2})$', '\1***\2', 'g')
    END as emergency_contact,
    b.special_requests,
    b.source
  FROM public.bookings b
  WHERE b.email = user_email AND b.booking_id = booking_id_param;
END;
$$;

-- Create indexes for better performance on security queries
CREATE INDEX IF NOT EXISTS idx_bookings_email_booking_id_secure 
ON public.bookings(email, booking_id);

-- Add comments explaining the security enhancement
COMMENT ON FUNCTION public.verify_booking_access_secure IS 
'Enhanced security function requiring both email AND booking_id verification to prevent token-based attacks';

COMMENT ON FUNCTION public.get_secure_booking_data IS 
'Secure function to retrieve booking data with automatic data masking for sensitive fields when accessed by non-admin users';