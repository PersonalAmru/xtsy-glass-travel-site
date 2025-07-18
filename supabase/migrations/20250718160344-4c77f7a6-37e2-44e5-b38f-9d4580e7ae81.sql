
-- Fix database function security by setting proper search_path
CREATE OR REPLACE FUNCTION generate_booking_id()
RETURNS TEXT AS $$
DECLARE
  new_id TEXT;
  exists_check INTEGER;
BEGIN
  LOOP
    -- Generate booking ID in format: XTSY-YYYYMMDD-XXXX
    new_id := 'XTSY-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
    
    -- Check if this ID already exists
    SELECT COUNT(*) INTO exists_check FROM public.bookings WHERE booking_id = new_id;
    
    -- If it doesn't exist, use it
    IF exists_check = 0 THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN new_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION set_booking_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.booking_id IS NULL OR NEW.booking_id = '' THEN
    NEW.booking_id := generate_booking_id();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Update RLS policies to be more restrictive
-- First drop existing overly permissive policies
DROP POLICY IF EXISTS "Anyone can insert bookings" ON public.bookings;
DROP POLICY IF EXISTS "Anyone can view bookings" ON public.bookings;
DROP POLICY IF EXISTS "Anyone can update bookings" ON public.bookings;

DROP POLICY IF EXISTS "Anyone can insert transactions" ON public.transactions;
DROP POLICY IF EXISTS "Anyone can view transactions" ON public.transactions;
DROP POLICY IF EXISTS "Anyone can update transactions" ON public.transactions;

DROP POLICY IF EXISTS "Anyone can insert confirmations" ON public.booking_confirmations;
DROP POLICY IF EXISTS "Anyone can view confirmations" ON public.booking_confirmations;
DROP POLICY IF EXISTS "Anyone can update confirmations" ON public.booking_confirmations;

-- Create more secure policies for bookings table
CREATE POLICY "Authenticated users can create bookings" ON public.bookings
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Users can view bookings by email" ON public.bookings
  FOR SELECT TO authenticated USING (
    email = (current_setting('request.jwt.claims', true)::json->>'email')
    OR auth.uid() IN (
      SELECT id FROM auth.users WHERE email = 'admin@xtsy.one'
    )
  );

CREATE POLICY "Service role can manage all bookings" ON public.bookings
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Edge functions can update booking status" ON public.bookings
  FOR UPDATE TO service_role USING (true) WITH CHECK (true);

-- Create secure policies for transactions table
CREATE POLICY "Service role can manage transactions" ON public.transactions
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Users can view their booking transactions" ON public.transactions
  FOR SELECT TO authenticated USING (
    booking_id IN (
      SELECT id FROM public.bookings WHERE email = (current_setting('request.jwt.claims', true)::json->>'email')
    )
  );

-- Create secure policies for booking confirmations table
CREATE POLICY "Service role can manage confirmations" ON public.booking_confirmations
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Users can view their booking confirmations" ON public.booking_confirmations
  FOR SELECT TO authenticated USING (
    booking_id IN (
      SELECT id FROM public.bookings WHERE email = (current_setting('request.jwt.claims', true)::json->>'email')
    )
  );

-- Add email index for better performance with new policies
CREATE INDEX IF NOT EXISTS idx_bookings_email ON public.bookings(email);

-- Add booking validation function
CREATE OR REPLACE FUNCTION validate_booking_data()
RETURNS TRIGGER AS $$
BEGIN
  -- Validate email format
  IF NEW.email !~ '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;
  
  -- Validate check-in date is not in the past
  IF NEW.check_in < CURRENT_DATE THEN
    RAISE EXCEPTION 'Check-in date cannot be in the past';
  END IF;
  
  -- Validate check-out is after check-in
  IF NEW.check_out <= NEW.check_in THEN
    RAISE EXCEPTION 'Check-out date must be after check-in date';
  END IF;
  
  -- Validate guest count
  IF NEW.guests < 1 OR NEW.guests > 50 THEN
    RAISE EXCEPTION 'Invalid guest count';
  END IF;
  
  -- Validate amounts are positive
  IF NEW.total_amount <= 0 OR NEW.subtotal <= 0 THEN
    RAISE EXCEPTION 'Invalid booking amounts';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Add validation trigger
CREATE TRIGGER validate_booking_before_insert
  BEFORE INSERT ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION validate_booking_data();
