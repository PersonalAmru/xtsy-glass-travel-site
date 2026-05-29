-- Security fix: remove permissive anonymous INSERT on password_reset_otp.
-- OTP rows are created exclusively by the SECURITY DEFINER RPC
-- public.generate_password_reset_otp (which validates the email exists in
-- auth.users) invoked by the password-reset-otp edge function using
-- service_role. Direct anon/authenticated inserts are never needed and the
-- previous "WITH CHECK (true)" policy allowed OTP row flooding for arbitrary
-- emails.

DROP POLICY IF EXISTS "Anyone can request OTP" ON public.password_reset_otp;