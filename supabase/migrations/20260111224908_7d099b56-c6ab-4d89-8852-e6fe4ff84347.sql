-- ============================================
-- OTP Password Reset Engine (2-min expiry)
-- ============================================

-- Table for storing OTP tokens
CREATE TABLE IF NOT EXISTS public.password_reset_otp (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  otp_code text NOT NULL,
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '2 minutes'),
  used boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.password_reset_otp ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read own OTP" ON public.password_reset_otp;
DROP POLICY IF EXISTS "Anyone can request OTP" ON public.password_reset_otp;
DROP POLICY IF EXISTS "Cleanup expired OTP" ON public.password_reset_otp;

-- Policy: Users can only read their own OTP entries (for verification)
CREATE POLICY "Users can read own OTP"
ON public.password_reset_otp
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy: Allow anon to insert (for requesting OTP)
CREATE POLICY "Anyone can request OTP"
ON public.password_reset_otp
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Policy: Allow deletion of expired entries
CREATE POLICY "Cleanup expired OTP"
ON public.password_reset_otp
FOR DELETE
TO anon, authenticated
USING (expires_at < now());

-- Index for fast lookups (drop first if exists)
DROP INDEX IF EXISTS idx_otp_email_expires;
DROP INDEX IF EXISTS idx_otp_code_lookup;
CREATE INDEX idx_otp_email_expires ON public.password_reset_otp(email, expires_at) WHERE used = false;
CREATE INDEX idx_otp_code_lookup ON public.password_reset_otp(email, otp_code) WHERE used = false;

-- Function to generate and store OTP (called from edge function)
CREATE OR REPLACE FUNCTION public.generate_password_reset_otp(p_email text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_otp text;
  v_expires_at timestamptz;
BEGIN
  -- Find user by email
  SELECT id INTO v_user_id FROM auth.users WHERE email = p_email LIMIT 1;
  
  IF v_user_id IS NULL THEN
    -- Return success anyway to prevent email enumeration
    RETURN json_build_object('success', true, 'message', 'If the email exists, an OTP will be sent');
  END IF;
  
  -- Invalidate any existing OTPs for this email
  UPDATE public.password_reset_otp 
  SET used = true 
  WHERE email = p_email AND used = false;
  
  -- Generate 6-digit OTP
  v_otp := lpad(floor(random() * 1000000)::text, 6, '0');
  v_expires_at := now() + interval '2 minutes';
  
  -- Insert new OTP
  INSERT INTO public.password_reset_otp (user_id, email, otp_code, expires_at)
  VALUES (v_user_id, p_email, v_otp, v_expires_at);
  
  RETURN json_build_object(
    'success', true,
    'otp', v_otp,
    'expires_at', v_expires_at
  );
END;
$$;

-- Function to verify OTP
CREATE OR REPLACE FUNCTION public.verify_password_reset_otp(p_email text, p_otp text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_record record;
BEGIN
  -- Find matching OTP
  SELECT * INTO v_record 
  FROM public.password_reset_otp 
  WHERE email = p_email 
    AND otp_code = p_otp 
    AND used = false 
    AND expires_at > now()
  LIMIT 1;
  
  IF v_record IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Invalid or expired OTP'
    );
  END IF;
  
  -- Mark as used
  UPDATE public.password_reset_otp SET used = true WHERE id = v_record.id;
  
  RETURN json_build_object(
    'success', true,
    'user_id', v_record.user_id
  );
END;
$$;

-- Cleanup job for expired OTPs
CREATE OR REPLACE FUNCTION public.cleanup_expired_otp()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.password_reset_otp WHERE expires_at < now() - interval '1 hour';
END;
$$;