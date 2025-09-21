-- Fix email validation in booking triggers - the current regex is too strict
-- Drop existing validation triggers that are causing issues
DROP TRIGGER IF EXISTS validate_booking_data_trigger ON public.bookings;
DROP TRIGGER IF EXISTS sanitize_and_validate_booking_data_trigger ON public.bookings;

-- Create a new, more lenient validation trigger
CREATE OR REPLACE FUNCTION public.validate_booking_data_fixed()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  recent_bookings_count INTEGER;
BEGIN
  -- Basic input sanitization
  NEW.guest_name := TRIM(NEW.guest_name);
  NEW.email := LOWER(TRIM(NEW.email));
  NEW.whatsapp_number := REGEXP_REPLACE(NEW.whatsapp_number, '[^0-9+]', '', 'g');
  NEW.address := TRIM(COALESCE(NEW.address, ''));
  NEW.city := TRIM(COALESCE(NEW.city, ''));
  NEW.state := TRIM(COALESCE(NEW.state, ''));

  -- More lenient email validation - just check for basic @ and . structure
  IF NEW.email !~ '^[^@]+@[^@]+\.[^@]+$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;

  -- Rate limiting: Check for recent bookings from same email
  SELECT COUNT(*) INTO recent_bookings_count
  FROM public.bookings
  WHERE email = NEW.email
    AND created_at > now() - INTERVAL '15 minutes';
  
  IF recent_bookings_count >= 5 THEN
    RAISE EXCEPTION 'Rate limit exceeded. Please wait before creating another booking.';
  END IF;

  -- Basic validation constraints
  IF NEW.check_in < CURRENT_DATE - INTERVAL '1 day' THEN
    RAISE EXCEPTION 'Check-in date cannot be in the past';
  END IF;
  
  IF NEW.check_out <= NEW.check_in THEN
    RAISE EXCEPTION 'Check-out date must be after check-in date';
  END IF;
  
  IF NEW.guests < 1 OR NEW.guests > 50 THEN
    RAISE EXCEPTION 'Invalid guest count';
  END IF;
  
  IF NEW.total_amount <= 0 THEN
    RAISE EXCEPTION 'Invalid booking amount';
  END IF;

  RETURN NEW;
END;
$$;

-- Create the new trigger
CREATE TRIGGER validate_booking_data_fixed_trigger
  BEFORE INSERT OR UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_booking_data_fixed();