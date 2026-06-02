-- Restrict invoice_counter SELECT to admins only (was publicly readable)
DROP POLICY IF EXISTS "Invoice counter read for authenticated" ON public.invoice_counter;

CREATE POLICY "Invoice counter read for admins"
ON public.invoice_counter
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Explicitly restrict password_reset_otp INSERT to service_role only.
-- service_role bypasses RLS; this documents intent and ensures no authenticated/anon
-- user can inject OTP rows.
DROP POLICY IF EXISTS "Only service role can insert OTP" ON public.password_reset_otp;

CREATE POLICY "Only service role can insert OTP"
ON public.password_reset_otp
FOR INSERT
TO service_role
WITH CHECK (true);