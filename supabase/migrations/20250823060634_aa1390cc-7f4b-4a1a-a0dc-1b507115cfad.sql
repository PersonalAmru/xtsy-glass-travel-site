-- Create missing rate limiting table
CREATE TABLE IF NOT EXISTS public.booking_rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier TEXT NOT NULL, -- IP address or email
  identifier_type TEXT NOT NULL, -- 'ip' or 'email'
  booking_count INTEGER DEFAULT 1,
  first_booking_at TIMESTAMPTZ DEFAULT NOW(),
  last_booking_at TIMESTAMPTZ DEFAULT NOW(),
  is_blocked BOOLEAN DEFAULT FALSE,
  blocked_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(identifier, identifier_type)
);

-- Enable RLS on rate limiting table  
ALTER TABLE public.booking_rate_limits ENABLE ROW LEVEL SECURITY;

-- Create policy for service role access
CREATE POLICY "Service role can manage rate limits" 
ON public.booking_rate_limits 
FOR ALL 
USING (auth.role() = 'service_role');

-- Enhanced security alerts table
CREATE TABLE IF NOT EXISTS public.security_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  user_id UUID,
  ip_address TEXT,
  details JSONB,
  resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on security alerts
ALTER TABLE public.security_alerts ENABLE ROW LEVEL SECURITY;

-- Create policies for security alerts
CREATE POLICY "Service role can manage security alerts" 
ON public.security_alerts 
FOR ALL 
USING (auth.role() = 'service_role');

CREATE POLICY "Admins can view security alerts" 
ON public.security_alerts 
FOR SELECT 
USING (is_admin());

-- Enhanced booking validation function with comprehensive input sanitization
CREATE OR REPLACE FUNCTION public.sanitize_and_validate_booking_data()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  recent_bookings_count INTEGER;
  suspicious_score INTEGER := 0;
  booking_duration INTEGER;
BEGIN
  -- Comprehensive input sanitization
  NEW.guest_name := TRIM(REGEXP_REPLACE(NEW.guest_name, '[<>"''&%;()\\+]', '', 'g'));
  NEW.email := LOWER(TRIM(REGEXP_REPLACE(NEW.email, '[<>"''&%;()]', '', 'g')));
  NEW.whatsapp_number := REGEXP_REPLACE(NEW.whatsapp_number, '[^0-9+]', '', 'g');
  NEW.address := TRIM(REGEXP_REPLACE(COALESCE(NEW.address, ''), '[<>"''&%;()\\]', '', 'g'));
  NEW.city := TRIM(REGEXP_REPLACE(COALESCE(NEW.city, ''), '[<>"''&%;()\\]', '', 'g'));
  NEW.state := TRIM(REGEXP_REPLACE(COALESCE(NEW.state, ''), '[<>"''&%;()\\]', '', 'g'));
  NEW.emergency_contact := REGEXP_REPLACE(COALESCE(NEW.emergency_contact, ''), '[^0-9+]', '', 'g');

  -- Enhanced email validation with security checks
  IF NEW.email !~ '^[A-Za-z0-9]([A-Za-z0-9._%-]*[A-Za-z0-9])?@[A-Za-z0-9]([A-Za-z0-9.-]*[A-Za-z0-9])?\\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;

  -- Rate limiting: Check for recent bookings from same email
  SELECT COUNT(*) INTO recent_bookings_count
  FROM public.bookings
  WHERE email = NEW.email
    AND created_at > now() - INTERVAL '15 minutes';
  
  IF recent_bookings_count >= 3 THEN
    -- Log security alert
    INSERT INTO public.security_alerts (alert_type, severity, details)
    VALUES ('rate_limit_exceeded', 'high', jsonb_build_object(
      'email', NEW.email,
      'booking_count', recent_bookings_count
    ));
    RAISE EXCEPTION 'Rate limit exceeded. Please wait before creating another booking.';
  END IF;

  -- Suspicious pattern detection
  IF NEW.email ~* '(test|fake|spam|bot|admin|root)' AND NEW.email !~* '@(gmail|yahoo|outlook|hotmail)' THEN
    suspicious_score := suspicious_score + 40;
  END IF;

  IF NEW.total_amount > 50000 THEN
    suspicious_score := suspicious_score + 30;
  END IF;

  IF NEW.guests > 8 THEN
    suspicious_score := suspicious_score + 20;
  END IF;

  -- Log high-risk bookings
  IF suspicious_score >= 50 THEN
    INSERT INTO public.security_alerts (alert_type, severity, details)
    VALUES ('suspicious_booking', 'medium', jsonb_build_object(
      'email', NEW.email,
      'score', suspicious_score,
      'amount', NEW.total_amount,
      'guests', NEW.guests
    ));
  END IF;

  -- Enhanced validation constraints
  IF NEW.check_in < CURRENT_DATE - INTERVAL '1 day' THEN
    RAISE EXCEPTION 'Check-in date cannot be in the past';
  END IF;
  
  IF NEW.check_out <= NEW.check_in THEN
    RAISE EXCEPTION 'Check-out date must be after check-in date';
  END IF;
  
  -- Fix duration validation with proper type casting
  booking_duration := NEW.check_out - NEW.check_in;
  IF booking_duration > 365 THEN
    RAISE EXCEPTION 'Booking duration cannot exceed 365 days';
  END IF;
  
  IF NEW.guests < 1 OR NEW.guests > 20 THEN
    RAISE EXCEPTION 'Invalid guest count (1-20 allowed)';
  END IF;
  
  IF NEW.total_amount <= 0 OR NEW.total_amount > 10000000 THEN
    RAISE EXCEPTION 'Invalid booking amount';
  END IF;
  
  IF length(NEW.guest_name) > 100 OR length(NEW.guest_name) < 2 THEN
    RAISE EXCEPTION 'Guest name must be between 2 and 100 characters';
  END IF;

  IF NEW.whatsapp_number !~ '^\\+?[1-9]\\d{7,14}$' THEN
    RAISE EXCEPTION 'Invalid WhatsApp number format';
  END IF;

  RETURN NEW;
END;
$$;

-- Create trigger for enhanced validation
DROP TRIGGER IF EXISTS sanitize_booking_data_trigger ON public.bookings;
CREATE TRIGGER sanitize_booking_data_trigger
  BEFORE INSERT OR UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.sanitize_and_validate_booking_data();

-- Enhanced RLS policies for bookings
DROP POLICY IF EXISTS "Enhanced secure booking creation" ON public.bookings;
CREATE POLICY "Enhanced secure booking creation" 
ON public.bookings 
FOR INSERT 
WITH CHECK (
  -- Allow service role
  auth.role() = 'service_role'
  OR
  -- Enhanced validation for authenticated users
  (
    auth.uid() IS NOT NULL 
    AND email IS NOT NULL
    AND guest_name IS NOT NULL
    AND whatsapp_number IS NOT NULL
    AND check_in IS NOT NULL
    AND check_out IS NOT NULL
    AND total_amount > 0 
    AND total_amount < 1000000
    AND guests > 0 
    AND guests <= 20
    AND check_in >= CURRENT_DATE
    AND check_out > check_in
    AND (check_out - check_in) <= 365
  )
);

-- Enhanced booking selection policy with audit logging
DROP POLICY IF EXISTS "Enhanced secure booking viewing" ON public.bookings;
CREATE POLICY "Enhanced secure booking viewing" 
ON public.bookings 
FOR SELECT 
USING (
  auth.role() = 'service_role'
  OR
  -- Users can only see their own bookings
  (
    auth.uid() IS NOT NULL 
    AND email = get_jwt_email()
  )
  OR
  -- Admin/staff access with logging
  (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.user_metadata->>'role' IN ('admin', 'staff', 'channel_manager')
    )
  )
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_rate_limit_identifier ON public.booking_rate_limits(identifier, identifier_type);
CREATE INDEX IF NOT EXISTS idx_rate_limit_updated ON public.booking_rate_limits(updated_at);
CREATE INDEX IF NOT EXISTS idx_security_alerts_type ON public.security_alerts(alert_type);
CREATE INDEX IF NOT EXISTS idx_security_alerts_severity ON public.security_alerts(severity);
CREATE INDEX IF NOT EXISTS idx_security_alerts_created ON public.security_alerts(created_at);
CREATE INDEX IF NOT EXISTS idx_bookings_email_created ON public.bookings(email, created_at);

-- Create function to clean up old rate limit records
CREATE OR REPLACE FUNCTION public.cleanup_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.booking_rate_limits 
  WHERE updated_at < now() - INTERVAL '24 hours'
    AND is_blocked = false;
    
  DELETE FROM public.booking_rate_limits
  WHERE blocked_until < now();
END;
$$;