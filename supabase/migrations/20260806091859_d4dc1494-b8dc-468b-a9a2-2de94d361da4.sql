
DROP POLICY IF EXISTS "Reviews public read access" ON public.reviews;
DROP POLICY IF EXISTS "reviews_public_read" ON public.reviews;
DROP POLICY IF EXISTS "reviews_public_read_only" ON public.reviews;

CREATE POLICY "reviews_owner_or_staff_read"
ON public.reviews FOR SELECT TO authenticated
USING (
  public.is_admin_or_staff()
  OR EXISTS (
    SELECT 1 FROM public.bookings b
    WHERE b.id = reviews.booking_id
      AND b.email = public.get_jwt_email()
  )
);

CREATE OR REPLACE VIEW public.reviews_public
WITH (security_invoker = off) AS
SELECT id, guest_name, rating, review_text, photos, verified, created_at, property_id
FROM public.reviews;

GRANT SELECT ON public.reviews_public TO anon, authenticated;
