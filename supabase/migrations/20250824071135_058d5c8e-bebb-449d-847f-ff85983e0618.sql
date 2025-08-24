-- Fix function search path security issue
CREATE OR REPLACE FUNCTION public.sanitize_and_validate_booking_data()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
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

-- Fix cleanup function search path
CREATE OR REPLACE FUNCTION public.cleanup_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  DELETE FROM public.booking_rate_limits 
  WHERE updated_at < now() - INTERVAL '24 hours'
    AND is_blocked = false;
    
  DELETE FROM public.booking_rate_limits
  WHERE blocked_until < now();
END;
$$;