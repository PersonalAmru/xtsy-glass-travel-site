-- Reviews are intentionally public testimonials. Remove the conflicting
-- owner/staff-only SELECT policy (it was fully masked by the permissive
-- public policy) and instead limit what anonymous visitors can read.
DROP POLICY IF EXISTS "reviews_owner_or_staff_read" ON public.reviews;

-- Keep the public policy but scope the exposed columns for anonymous users:
-- booking_id links a testimonial to a private booking record and must not leak.
REVOKE SELECT ON public.reviews FROM anon;
GRANT SELECT (id, guest_name, rating, review_text, photos, verified, created_at, property_id)
  ON public.reviews TO anon;
