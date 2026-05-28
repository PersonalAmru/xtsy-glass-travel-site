
-- 1. booking_invoices: remove email JWT fallback
DROP POLICY IF EXISTS "Guests view own invoices" ON public.booking_invoices;
CREATE POLICY "Guests view own invoices"
ON public.booking_invoices
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.bookings
    WHERE bookings.booking_id = booking_invoices.booking_id
      AND bookings.user_id = auth.uid()
  )
  OR public.has_role(auth.uid(), 'admin'::app_role)
);

-- 2. booking_messages: replace email JWT check with user_id join
DROP POLICY IF EXISTS "Admin or owner read booking messages" ON public.booking_messages;
CREATE POLICY "Admin or owner read booking messages"
ON public.booking_messages
FOR SELECT
TO authenticated
USING (
  public.is_admin_or_staff()
  OR EXISTS (
    SELECT 1 FROM public.bookings b
    WHERE (b.id)::text = booking_messages.booking_id
      AND b.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Admin or owner insert booking messages" ON public.booking_messages;
CREATE POLICY "Admin or owner insert booking messages"
ON public.booking_messages
FOR INSERT
TO authenticated
WITH CHECK (
  public.is_admin_or_staff()
  OR EXISTS (
    SELECT 1 FROM public.bookings b
    WHERE b.booking_id = booking_messages.booking_id
      AND b.user_id = auth.uid()
  )
);

-- 3. password_reset_otp: restrict expired cleanup to service_role
DROP POLICY IF EXISTS "Cleanup expired OTP" ON public.password_reset_otp;
CREATE POLICY "Cleanup expired OTP"
ON public.password_reset_otp
FOR DELETE
TO service_role
USING (true);
