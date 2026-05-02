
-- 1. Fix booking_messages INSERT policy bug (joined wrong columns)
DROP POLICY IF EXISTS "Admin or owner insert booking messages" ON public.booking_messages;
CREATE POLICY "Admin or owner insert booking messages"
ON public.booking_messages
FOR INSERT
TO authenticated
WITH CHECK (
  is_admin_or_staff()
  OR EXISTS (
    SELECT 1 FROM public.bookings b
    WHERE b.booking_id = booking_messages.booking_id
      AND b.email = (auth.jwt() ->> 'email')
  )
);

-- 2. Restrict traffic_sessions UPDATE: only admins/staff. Edge functions/server use service_role and bypass RLS anyway.
DROP POLICY IF EXISTS "Allow anonymous updates for tracking" ON public.traffic_sessions;
CREATE POLICY "Admins update traffic sessions"
ON public.traffic_sessions
FOR UPDATE
TO authenticated
USING (is_admin_or_staff())
WITH CHECK (is_admin_or_staff());

-- 3. Add admin/staff SELECT policy on tour_enquiries
DROP POLICY IF EXISTS "Admins can view tour enquiries" ON public.tour_enquiries;
CREATE POLICY "Admins can view tour enquiries"
ON public.tour_enquiries
FOR SELECT
TO authenticated
USING (is_admin_or_staff());

-- 4. Add anon INSERT policy on enquiries (public funnel) so direct inserts work for unauthenticated visitors
DROP POLICY IF EXISTS "Anon can insert enquiries" ON public.enquiries;
CREATE POLICY "Anon can insert enquiries"
ON public.enquiries
FOR INSERT
TO anon
WITH CHECK (true);

-- 5. Add DELETE policy for seo-heroes storage bucket (service_role only)
DROP POLICY IF EXISTS "Service role delete seo-heroes" ON storage.objects;
CREATE POLICY "Service role delete seo-heroes"
ON storage.objects
FOR DELETE
TO public
USING (bucket_id = 'seo-heroes' AND auth.role() = 'service_role');
