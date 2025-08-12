-- Tighten security: harden get_jwt_email and restrict reviews INSERT to booking owners with confirmed status
BEGIN;

-- Ensure the helper uses a safe search_path
CREATE OR REPLACE FUNCTION public.get_jwt_email()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT NULLIF((current_setting('request.jwt.claims', true))::json ->> 'email', '')::text;
$$;

-- Ensure RLS is enabled on reviews
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Replace overly-permissive insert policy on reviews
DROP POLICY IF EXISTS "Guests can create reviews for their bookings" ON public.reviews;

CREATE POLICY "Guests can create reviews for their bookings"
ON public.reviews
FOR INSERT
WITH CHECK (
  public.get_jwt_email() IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM public.bookings b
    WHERE b.id = reviews.booking_id
      AND b.email = public.get_jwt_email()
      AND b.booking_status = 'confirmed'
  )
);

COMMIT;