-- Migration 4: Fix Security Issues in Content Tables (Simplified)
BEGIN;

-- 1) Fix destinations table - restrict write access to admin/service only
DROP POLICY IF EXISTS "Only service role can manage destinations" ON public.destinations;
DROP POLICY IF EXISTS "Destinations are viewable by everyone" ON public.destinations;

-- Destinations: Public READ, Admin/Service WRITE
CREATE POLICY "Destinations public read access"
ON public.destinations FOR SELECT
USING (true);

CREATE POLICY "Destinations admin manage access"
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

CREATE POLICY "Itineraries admin manage access"
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

-- 3) Fix reviews table - restrict write access to authenticated users and admins
DROP POLICY IF EXISTS "Service role can manage all reviews" ON public.reviews;
DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON public.reviews;

-- Reviews: Public READ, Authenticated users can CREATE (with validation), Admins manage all
CREATE POLICY "Reviews public read access"
ON public.reviews FOR SELECT
USING (true);

-- Authenticated users can create reviews
CREATE POLICY "Authenticated users can create reviews"
ON public.reviews FOR INSERT TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

-- Users can update their own reviews (based on the booking they made)
CREATE POLICY "Users can update their own reviews"
ON public.reviews FOR UPDATE TO authenticated
USING (
  booking_id IS NOT NULL AND EXISTS (
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

-- 4) Add basic validation triggers
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
  
  -- Basic sanitization
  NEW.review_text := TRIM(COALESCE(NEW.review_text, ''));
  NEW.guest_name := TRIM(REGEXP_REPLACE(NEW.guest_name, '[<>"''&%;()\\]', '', 'g'));
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS validate_review_data_trigger ON public.reviews;
CREATE TRIGGER validate_review_data_trigger
  BEFORE INSERT OR UPDATE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_review_data();

COMMIT;