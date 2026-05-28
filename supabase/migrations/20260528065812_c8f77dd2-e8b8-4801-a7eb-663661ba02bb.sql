DROP POLICY IF EXISTS users_view_own_bookings ON public.bookings;
CREATE POLICY users_view_own_bookings ON public.bookings
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());