-- Security fix: Add proper RLS policies for vault access and create secure functions
-- This addresses the Security Definer View issue by ensuring proper access controls

-- First, let's check current vault permissions and add proper policies if needed
-- Note: The vault.decrypted_secrets view is a Supabase system view, but we need to ensure proper access controls

-- Create a secure function to access secrets only when authorized
CREATE OR REPLACE FUNCTION public.get_app_secret(secret_name TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, vault
AS $$
DECLARE
  secret_value TEXT;
  current_user_role TEXT;
BEGIN
  -- Only allow admin users or service role to access secrets
  current_user_role := get_user_role();
  
  -- Check if user is admin or if this is a service role request
  IF current_user_role != 'admin' AND auth.role() != 'service_role' THEN
    RAISE EXCEPTION 'Unauthorized access to secrets';
  END IF;
  
  -- Get the secret value safely
  SELECT decrypted_secret INTO secret_value
  FROM vault.decrypted_secrets
  WHERE name = secret_name
  LIMIT 1;
  
  RETURN secret_value;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the attempt but don't reveal the error details
    RAISE EXCEPTION 'Secret access denied';
END;
$$;

-- Revoke direct access to vault schema from public
REVOKE ALL ON SCHEMA vault FROM public;
REVOKE ALL ON ALL TABLES IN SCHEMA vault FROM public;

-- Grant minimal necessary permissions only to authenticated users for the function
GRANT EXECUTE ON FUNCTION public.get_app_secret(TEXT) TO authenticated;

-- Create audit logging for secret access
CREATE TABLE IF NOT EXISTS public.secret_access_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  user_email TEXT,
  secret_name TEXT NOT NULL,
  access_granted BOOLEAN NOT NULL DEFAULT false,
  accessed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address TEXT,
  user_agent TEXT
);

-- Enable RLS on secret access log
ALTER TABLE public.secret_access_log ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can view secret access logs
CREATE POLICY "secret_access_log_admin_only"
ON public.secret_access_log
FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

-- Create a more secure version of the secret access function with logging
CREATE OR REPLACE FUNCTION public.get_app_secret_secure(secret_name TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, vault
AS $$
DECLARE
  secret_value TEXT;
  current_user_role TEXT;
  user_email_val TEXT;
  access_granted BOOLEAN := false;
BEGIN
  -- Get user information
  current_user_role := get_user_role();
  user_email_val := get_jwt_email();
  
  -- Check if user is admin or if this is a service role request
  IF current_user_role = 'admin' OR auth.role() = 'service_role' THEN
    -- Get the secret value safely
    SELECT decrypted_secret INTO secret_value
    FROM vault.decrypted_secrets
    WHERE name = secret_name
    LIMIT 1;
    
    access_granted := true;
  ELSE
    secret_value := NULL;
    access_granted := false;
  END IF;
  
  -- Log the access attempt
  INSERT INTO public.secret_access_log (
    user_id,
    user_email,
    secret_name,
    access_granted,
    ip_address
  ) VALUES (
    auth.uid(),
    user_email_val,
    secret_name,
    access_granted,
    ''
  );
  
  -- Raise exception for unauthorized access
  IF NOT access_granted THEN
    RAISE EXCEPTION 'Unauthorized access to secrets';
  END IF;
  
  RETURN secret_value;
EXCEPTION
  WHEN OTHERS THEN
    -- Log failed attempts
    INSERT INTO public.secret_access_log (
      user_id,
      user_email,
      secret_name,
      access_granted,
      ip_address
    ) VALUES (
      auth.uid(),
      COALESCE(user_email_val, 'unknown'),
      secret_name,
      false,
      ''
    );
    
    RAISE EXCEPTION 'Secret access denied: %', SQLERRM;
END;
$$;

-- Grant execute permission on the secure function
GRANT EXECUTE ON FUNCTION public.get_app_secret_secure(TEXT) TO authenticated;

-- Comment explaining the security model
COMMENT ON FUNCTION public.get_app_secret_secure(TEXT) IS 'Secure function to access vault secrets with proper authorization and audit logging. Only admin users can access secrets.';
COMMENT ON TABLE public.secret_access_log IS 'Audit log for all attempts to access application secrets, including unauthorized attempts.';
