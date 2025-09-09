-- Migration 4: Fix Security Issues in Content Tables (Fixed)
BEGIN;

-- 1) Fix destinations table - restrict write access to admin/service only
DROP POLICY IF EXISTS "Only service role can manage destinations" ON public.destinations;
DROP POLICY IF EXISTS "Destinations are viewable by everyone" ON public.destinations;

-- Destinations: Public READ, Admin/Service WRITE
CREATE POLICY "Destinations public read access"
ON public.destinations FOR SELECT
USING (true);

CREATE POLICY "Destinations admin write access"
ON public.destinations FOR INSERT TO authenticated
WITH CHECK (is_admin_or_staff());

CREATE POLICY "Destinations admin update access"
ON public.destinations FOR UPDATE TO authenticated
USING (is_admin_or_staff())
WITH CHECK (is_admin_or_staff());

CREATE POLICY "Destinations admin delete access"
ON public.destinations FOR DELETE TO authenticated
USING (is_admin_or_staff());

CREATE POLICY "Destinations service role full access"
ON public.destinations FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- 2) Fix itineraries table - restrict write access to admin/service only
DROP POLICY IF EXISTS "Only service role can manage itineraries" ON public.itineraries;
DROP POLICY IF EXISTS "Itineraries are viewable by everyone" ON public.itineraries;

-- Itineraries: Public READ, Admin/Service WRITE
CREATE POLICY "Itineraries public read access"
ON public.itineraries FOR SELECT
USING (true);

CREATE POLICY "Itineraries admin write access"
ON public.itineraries FOR INSERT TO authenticated
WITH CHECK (is_admin_or_staff());

CREATE POLICY "Itineraries admin update access"
ON public.itineraries FOR UPDATE TO authenticated
USING (is_admin_or_staff())
WITH CHECK (is_admin_or_staff());

CREATE POLICY "Itineraries admin delete access"
ON public.itineraries FOR DELETE TO authenticated
USING (is_admin_or_staff());

CREATE POLICY "Itineraries service role full access"
ON public.itineraries FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- 3) Fix reviews table - restrict write access to verified customers and admins
DROP POLICY IF EXISTS "Service role can manage all reviews" ON public.reviews;
DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON public.reviews;

-- Reviews: Public READ, Verified customers can CREATE, Admin can manage
CREATE POLICY "Reviews public read access"
ON public.reviews FOR SELECT
USING (true);

-- Only authenticated users with completed bookings can create reviews
CREATE POLICY "Verified customers can create reviews"
ON public.reviews FOR INSERT TO authenticated
WITH CHECK (
  booking_id IS NOT NULL AND
  EXISTS (
    SELECT 1 FROM public.bookings b
    WHERE b.user_id = auth.uid()
      AND b.booking_status = 'completed'
      AND b.id = booking_id
  )
);

-- Users can update their own reviews (within 30 days)
CREATE POLICY "Users can update own reviews"
ON public.reviews FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.bookings b
    WHERE b.user_id = auth.uid()
      AND b.id = booking_id
  )
  AND created_at > now() - INTERVAL '30 days'
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.bookings b
    WHERE b.user_id = auth.uid()
      AND b.id = booking_id
  )
);

-- Admins can manage all reviews
CREATE POLICY "Admins can manage all reviews"
ON public.reviews FOR ALL TO authenticated
USING (is_admin_or_staff())
WITH CHECK (is_admin_or_staff());

-- Service role full access
CREATE POLICY "Reviews service role full access"
ON public.reviews FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- 4) Add validation trigger for reviews to prevent spam
CREATE OR REPLACE FUNCTION public.validate_review_data()
RETURNS TRIGGER AS $$
BEGIN
  -- Validate rating is between 1 and 5
  IF NEW.rating < 1 OR NEW.rating > 5 THEN
    RAISE EXCEPTION 'Rating must be between 1 and 5';
  END IF;
  
  -- Validate review text length
  IF NEW.review_text IS NOT NULL AND LENGTH(NEW.review_text) > 2000 THEN
    RAISE EXCEPTION 'Review text cannot exceed 2000 characters';
  END IF;
  
  -- Prevent duplicate reviews for same booking
  IF NEW.booking_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.reviews 
    WHERE booking_id = NEW.booking_id 
    AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
  ) THEN
    RAISE EXCEPTION 'A review already exists for this booking';
  END IF;
  
  -- Sanitize review text
  NEW.review_text := TRIM(REGEXP_REPLACE(COALESCE(NEW.review_text, ''), '[<>"''&%;()\\]', '', 'g'));
  NEW.guest_name := TRIM(REGEXP_REPLACE(NEW.guest_name, '[<>"''&%;()\\]', '', 'g'));
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS validate_review_data_trigger ON public.reviews;
CREATE TRIGGER validate_review_data_trigger
  BEFORE INSERT OR UPDATE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_review_data();

-- 5) Add content validation for destinations and itineraries
CREATE OR REPLACE FUNCTION public.validate_destination_data()
RETURNS TRIGGER AS $$
BEGIN
  -- Validate required fields
  IF LENGTH(TRIM(NEW.name)) < 2 THEN
    RAISE EXCEPTION 'Destination name must be at least 2 characters';
  END IF;
  
  IF LENGTH(TRIM(NEW.state)) < 2 THEN
    RAISE EXCEPTION 'Destination state must be at least 2 characters';
  END IF;
  
  -- Sanitize text fields
  NEW.name := TRIM(REGEXP_REPLACE(NEW.name, '[<>"''&%;()\\]', '', 'g'));
  NEW.state := TRIM(REGEXP_REPLACE(NEW.state, '[<>"''&%;()\\]', '', 'g'));
  NEW.description := TRIM(REGEXP_REPLACE(COALESCE(NEW.description, ''), '[<>"''&%;()\\]', '', 'g'));
  
  -- Validate coordinates if provided
  IF NEW.latitude IS NOT NULL AND (NEW.latitude < -90 OR NEW.latitude > 90) THEN
    RAISE EXCEPTION 'Latitude must be between -90 and 90';
  END IF;
  
  IF NEW.longitude IS NOT NULL AND (NEW.longitude < -180 OR NEW.longitude > 180) THEN
    RAISE EXCEPTION 'Longitude must be between -180 and 180';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS validate_destination_data_trigger ON public.destinations;
CREATE TRIGGER validate_destination_data_trigger
  BEFORE INSERT OR UPDATE ON public.destinations
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_destination_data();

CREATE OR REPLACE FUNCTION public.validate_itinerary_data()
RETURNS TRIGGER AS $$
BEGIN
  -- Validate required fields
  IF LENGTH(TRIM(NEW.title)) < 3 THEN
    RAISE EXCEPTION 'Itinerary title must be at least 3 characters';
  END IF;
  
  IF NEW.duration_days <= 0 OR NEW.duration_days > 365 THEN
    RAISE EXCEPTION 'Duration must be between 1 and 365 days';
  END IF;
  
  -- Validate estimated cost is reasonable
  IF NEW.estimated_cost IS NOT NULL AND (NEW.estimated_cost < 0 OR NEW.estimated_cost > 100000000) THEN
    RAISE EXCEPTION 'Estimated cost must be reasonable (0 to 1 crore)';
  END IF;
  
  -- Sanitize text fields
  NEW.title := TRIM(REGEXP_REPLACE(NEW.title, '[<>"''&%;()\\]', '', 'g'));
  NEW.description := TRIM(REGEXP_REPLACE(COALESCE(NEW.description, ''), '[<>"''&%;()\\]', '', 'g'));
  NEW.difficulty_level := TRIM(REGEXP_REPLACE(COALESCE(NEW.difficulty_level, ''), '[<>"''&%;()\\]', '', 'g'));
  NEW.best_season := TRIM(REGEXP_REPLACE(COALESCE(NEW.best_season, ''), '[<>"''&%;()\\]', '', 'g'));
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS validate_itinerary_data_trigger ON public.itineraries;
CREATE TRIGGER validate_itinerary_data_trigger
  BEFORE INSERT OR UPDATE ON public.itineraries
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_itinerary_data();

COMMIT;