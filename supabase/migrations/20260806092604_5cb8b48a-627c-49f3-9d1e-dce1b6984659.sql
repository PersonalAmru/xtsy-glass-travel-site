-- Remove ambiguous/conflicting permissive deny-insert policy
DROP POLICY IF EXISTS "reviews_deny_insert_public" ON public.reviews;
DROP POLICY IF EXISTS "Guests can create reviews for their bookings" ON public.reviews;

-- Only authenticated guests may insert, and only for their OWN confirmed booking
CREATE POLICY "reviews_insert_own_booking"
ON public.reviews
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.bookings b
    WHERE b.id = reviews.booking_id
      AND b.booking_status = 'confirmed'
      AND (
        b.user_id = auth.uid()
        OR (public.get_jwt_email() IS NOT NULL AND b.email = public.get_jwt_email())
      )
  )
);

-- Explicitly ensure anonymous visitors cannot insert reviews
REVOKE INSERT ON public.reviews FROM anon;