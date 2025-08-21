-- Enhanced Security for Bookings Table (Fixed)
-- 1. Add audit logging table for tracking access to sensitive data
CREATE TABLE IF NOT EXISTS public.booking_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id),
  action_type TEXT NOT NULL CHECK (action_type IN ('view', 'create', 'update', 'delete')),
  user_email TEXT,
  user_ip INET,
  user_agent TEXT,
  accessed_fields TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on audit log
ALTER TABLE public.booking_audit_log ENABLE ROW LEVEL SECURITY;

-- 2. Create security function to validate booking creation
CREATE OR REPLACE FUNCTION public.validate_secure_booking_creation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  recent_bookings_count INTEGER;
BEGIN
  -- Rate limiting: Check for recent bookings from same email
  SELECT COUNT(*) INTO recent_bookings_count
  FROM public.bookings
  WHERE email = NEW.email
    AND created_at > now() - INTERVAL '15 minutes';
  
  -- Block if too many recent bookings (rate limiting)
  IF recent_bookings_count >= 3 THEN
    RAISE EXCEPTION 'Rate limit exceeded. Please wait before creating another booking.';
  END IF;
  
  -- Additional validation for suspicious patterns
  IF length(NEW.email) > 254 THEN
    RAISE EXCEPTION 'Email address too long';
  END IF;
  
  IF length(NEW.guest_name) > 100 THEN
    RAISE EXCEPTION 'Guest name too long';
  END IF;
  
  IF length(NEW.whatsapp_number) > 20 THEN
    RAISE EXCEPTION 'WhatsApp number too long';
  END IF;
  
  -- Sanitize input data
  NEW.guest_name := TRIM(NEW.guest_name);
  NEW.email := LOWER(TRIM(NEW.email));
  NEW.whatsapp_number := REGEXP_REPLACE(NEW.whatsapp_number, '[^0-9+]', '', 'g');
  
  RETURN NEW;
END;
$$;

-- 3. Create audit logging function
CREATE OR REPLACE FUNCTION public.log_booking_access()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  user_email_val TEXT;
BEGIN
  -- Get user information
  user_email_val := get_jwt_email();
  
  -- Log the access (simplified for reliability)
  INSERT INTO public.booking_audit_log (
    booking_id,
    action_type,
    user_email,
    accessed_fields
  ) VALUES (
    COALESCE(NEW.id, OLD.id),
    CASE 
      WHEN TG_OP = 'INSERT' THEN 'create'
      WHEN TG_OP = 'UPDATE' THEN 'update'
      WHEN TG_OP = 'DELETE' THEN 'delete'
      ELSE 'view'
    END,
    user_email_val,
    ARRAY['email', 'whatsapp_number', 'address', 'emergency_contact']
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- 4. Enhanced booking data validation with security checks
CREATE OR REPLACE FUNCTION public.validate_booking_data()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Enhanced email validation with security checks
  IF NEW.email !~ '^[A-Za-z0-9]([A-Za-z0-9._%-]*[A-Za-z0-9])?@[A-Za-z0-9]([A-Za-z0-9.-]*[A-Za-z0-9])?\\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;
  
  -- Check for suspicious email patterns
  IF NEW.email ~* '(test|fake|spam|bot|admin|root)' AND NEW.email !~* '@(gmail|yahoo|outlook|hotmail)' THEN
    RAISE EXCEPTION 'Suspicious email detected';
  END IF;
  
  -- Validate check-in date is not in the past (with 1-day buffer for timezone issues)
  IF NEW.check_in < CURRENT_DATE - INTERVAL '1 day' THEN
    RAISE EXCEPTION 'Check-in date cannot be in the past';
  END IF;
  
  -- Validate check-out is after check-in
  IF NEW.check_out <= NEW.check_in THEN
    RAISE EXCEPTION 'Check-out date must be after check-in date';
  END IF;
  
  -- Validate booking duration (max 30 days for security)
  IF NEW.check_out - NEW.check_in > 30 THEN
    RAISE EXCEPTION 'Booking duration cannot exceed 30 days';
  END IF;
  
  -- Validate guest count with reasonable limits
  IF NEW.guests < 1 OR NEW.guests > 20 THEN
    RAISE EXCEPTION 'Invalid guest count (1-20 allowed)';
  END IF;
  
  -- Validate amounts are positive and reasonable
  IF NEW.total_amount <= 0 OR NEW.subtotal <= 0 THEN
    RAISE EXCEPTION 'Invalid booking amounts';
  END IF;
  
  -- Security check: amounts shouldn't be unreasonably high
  IF NEW.total_amount > 10000000 THEN -- 1 crore INR limit
    RAISE EXCEPTION 'Booking amount exceeds maximum limit';
  END IF;
  
  -- Validate WhatsApp number format
  IF NEW.whatsapp_number !~ '^\\+?[1-9]\\d{7,14}$' THEN
    RAISE EXCEPTION 'Invalid WhatsApp number format';
  END IF;
  
  -- Validate guest name contains no suspicious characters
  IF NEW.guest_name ~ '[<>"\\''%;()&+]' THEN
    RAISE EXCEPTION 'Guest name contains invalid characters';
  END IF;
  
  RETURN NEW;
END;
$$;

-- 5. Create triggers for security enhancements
DROP TRIGGER IF EXISTS validate_secure_booking_creation_trigger ON public.bookings;
CREATE TRIGGER validate_secure_booking_creation_trigger
  BEFORE INSERT ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION validate_secure_booking_creation();

DROP TRIGGER IF EXISTS log_booking_access_trigger ON public.bookings;
CREATE TRIGGER log_booking_access_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION log_booking_access();

-- 6. Drop all existing booking policies to recreate them securely
DROP POLICY IF EXISTS "Anyone can create a booking" ON public.bookings;
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Service role full access to bookings" ON public.bookings;
DROP POLICY IF EXISTS "Authenticated users can create bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can view their own bookings securely" ON public.bookings;
DROP POLICY IF EXISTS "Users can update their own booking details" ON public.bookings;

-- Create new secure policies
CREATE POLICY "Secure booking creation policy"
ON public.bookings
FOR INSERT
TO authenticated, anon
WITH CHECK (
  email IS NOT NULL AND 
  guest_name IS NOT NULL AND 
  whatsapp_number IS NOT NULL AND
  check_in IS NOT NULL AND
  check_out IS NOT NULL
);

CREATE POLICY "Secure booking viewing policy"
ON public.bookings
FOR SELECT
TO authenticated
USING (
  get_jwt_email() IS NOT NULL AND 
  email = get_jwt_email()
);

CREATE POLICY "Service role booking management"
ON public.bookings
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Secure booking update policy"
ON public.bookings
FOR UPDATE
TO authenticated
USING (get_jwt_email() IS NOT NULL AND email = get_jwt_email())
WITH CHECK (
  get_jwt_email() IS NOT NULL AND 
  email = get_jwt_email()
);

-- 7. RLS policies for audit log
CREATE POLICY "Service role audit log access"
ON public.booking_audit_log
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Users view own audit logs"
ON public.booking_audit_log
FOR SELECT
TO authenticated
USING (user_email = get_jwt_email());

-- 8. Create function to check for suspicious activity
CREATE OR REPLACE FUNCTION public.check_suspicious_booking_activity(
  email_param TEXT,
  time_window_hours INTEGER DEFAULT 24
)
RETURNS TABLE(
  suspicious_indicators TEXT[],
  risk_score INTEGER,
  recent_bookings_count INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  indicators TEXT[] := '{}';
  score INTEGER := 0;
  booking_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO booking_count
  FROM public.bookings
  WHERE email = email_param
    AND created_at > now() - (time_window_hours || ' hours')::INTERVAL;
  
  recent_bookings_count := booking_count;
  
  IF booking_count > 5 THEN
    indicators := array_append(indicators, 'High frequency bookings');
    score := score + 50;
  ELSIF booking_count > 3 THEN
    indicators := array_append(indicators, 'Frequent bookings');
    score := score + 25;
  END IF;
  
  IF email_param ~* '(test|fake|spam|bot|temp|disposable)' THEN
    indicators := array_append(indicators, 'Suspicious email pattern');
    score := score + 40;
  END IF;
  
  suspicious_indicators := indicators;
  risk_score := score;
  
  RETURN;
END;
$$;

-- 9. Create indexes for security and performance
CREATE INDEX IF NOT EXISTS idx_bookings_email_created ON public.bookings(email, created_at);
CREATE INDEX IF NOT EXISTS idx_bookings_security_check ON public.bookings(email, created_at, total_amount);
CREATE INDEX IF NOT EXISTS idx_audit_log_email_time ON public.booking_audit_log(user_email, created_at);
CREATE INDEX IF NOT EXISTS idx_audit_log_booking_action ON public.booking_audit_log(booking_id, action_type, created_at);