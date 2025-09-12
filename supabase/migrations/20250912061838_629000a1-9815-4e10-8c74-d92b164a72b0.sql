-- CRITICAL Security Fix: Secure exposed masked views and administrative data
-- Priority 1: Fix Critical Data Exposure Issues

-- Step 1: Secure bookings_masked view - restrict to booking owners and admins only
DROP POLICY IF EXISTS "bookings_masked_admin_only" ON public.bookings_masked;
DROP POLICY IF EXISTS "bookings_masked_owner_only" ON public.bookings_masked;
DROP POLICY IF EXISTS "bookings_masked_no_public" ON public.bookings_masked;

-- Enable RLS on bookings_masked if not already enabled
ALTER TABLE public.bookings_masked ENABLE ROW LEVEL SECURITY;

-- Deny all public access by default
CREATE POLICY "bookings_masked_no_public" 
  ON public.bookings_masked FOR ALL TO public
  USING (false);

-- Allow admins to view all masked booking data
CREATE POLICY "bookings_masked_admin_only" 
  ON public.bookings_masked FOR SELECT TO authenticated
  USING (is_admin_or_staff());

-- Allow authenticated users to see only their own booking data (if user_id matches)
CREATE POLICY "bookings_masked_owner_only" 
  ON public.bookings_masked FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Service role unrestricted access
CREATE POLICY "bookings_masked_service_full" 
  ON public.bookings_masked FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- Step 2: Secure security_alerts_masked view - admin only
DROP POLICY IF EXISTS "security_alerts_masked_admin_only" ON public.security_alerts_masked;
DROP POLICY IF EXISTS "security_alerts_masked_no_public" ON public.security_alerts_masked;

-- Enable RLS on security_alerts_masked
ALTER TABLE public.security_alerts_masked ENABLE ROW LEVEL SECURITY;

-- Deny all public access
CREATE POLICY "security_alerts_masked_no_public" 
  ON public.security_alerts_masked FOR ALL TO public
  USING (false);

-- Only admins can view security alerts
CREATE POLICY "security_alerts_masked_admin_only" 
  ON public.security_alerts_masked FOR SELECT TO authenticated
  USING (is_admin());

-- Service role unrestricted access
CREATE POLICY "security_alerts_masked_service_full" 
  ON public.security_alerts_masked FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- Step 3: Secure secret_access_log_masked view - admin/security personnel only
DROP POLICY IF EXISTS "secret_access_log_masked_admin_only" ON public.secret_access_log_masked;
DROP POLICY IF EXISTS "secret_access_log_masked_no_public" ON public.secret_access_log_masked;

-- Enable RLS on secret_access_log_masked
ALTER TABLE public.secret_access_log_masked ENABLE ROW LEVEL SECURITY;

-- Deny all public access
CREATE POLICY "secret_access_log_masked_no_public" 
  ON public.secret_access_log_masked FOR ALL TO public
  USING (false);

-- Only admins can view secret access logs
CREATE POLICY "secret_access_log_masked_admin_only" 
  ON public.secret_access_log_masked FOR SELECT TO authenticated
  USING (is_admin());

-- Service role unrestricted access
CREATE POLICY "secret_access_log_masked_service_full" 
  ON public.secret_access_log_masked FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- Step 4: Secure transactions_admin_view - admin only
DROP POLICY IF EXISTS "transactions_admin_view_admin_only" ON public.transactions_admin_view;
DROP POLICY IF EXISTS "transactions_admin_view_no_public" ON public.transactions_admin_view;

-- Enable RLS on transactions_admin_view
ALTER TABLE public.transactions_admin_view ENABLE ROW LEVEL SECURITY;

-- Deny all public access
CREATE POLICY "transactions_admin_view_no_public" 
  ON public.transactions_admin_view FOR ALL TO public
  USING (false);

-- Only admins can view transaction admin data
CREATE POLICY "transactions_admin_view_admin_only" 
  ON public.transactions_admin_view FOR SELECT TO authenticated
  USING (is_admin_or_staff());

-- Service role unrestricted access
CREATE POLICY "transactions_admin_view_service_full" 
  ON public.transactions_admin_view FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- Step 5: Secure newsletter_stats view - admin only
DROP POLICY IF EXISTS "newsletter_stats_admin_only" ON public.newsletter_stats;
DROP POLICY IF EXISTS "newsletter_stats_no_public" ON public.newsletter_stats;

-- Enable RLS on newsletter_stats
ALTER TABLE public.newsletter_stats ENABLE ROW LEVEL SECURITY;

-- Deny all public access
CREATE POLICY "newsletter_stats_no_public" 
  ON public.newsletter_stats FOR ALL TO public
  USING (false);

-- Only admins can view newsletter statistics
CREATE POLICY "newsletter_stats_admin_only" 
  ON public.newsletter_stats FOR SELECT TO authenticated
  USING (is_admin());

-- Service role unrestricted access
CREATE POLICY "newsletter_stats_service_full" 
  ON public.newsletter_stats FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- Step 6: Create newsletter signup rate limiting function
CREATE OR REPLACE FUNCTION public.check_newsletter_rate_limit(p_email text, p_ip_address text DEFAULT '')
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  recent_signups_email integer;
  recent_signups_ip integer;
BEGIN
  -- Check email-based rate limiting (max 3 signups per hour from same email)
  SELECT COUNT(*) INTO recent_signups_email
  FROM public.newsletter_subscribers
  WHERE email = p_email
    AND created_at > now() - INTERVAL '1 hour';
  
  IF recent_signups_email >= 3 THEN
    -- Log suspicious activity
    INSERT INTO public.security_alerts (alert_type, severity, details)
    VALUES ('newsletter_signup_rate_limit_email', 'medium', jsonb_build_object(
      'email', p_email,
      'signup_count_1h', recent_signups_email,
      'blocked_at', now()
    ));
    RETURN false;
  END IF;
  
  -- Check IP-based rate limiting if IP provided (max 10 signups per hour from same IP)
  IF p_ip_address != '' THEN
    SELECT COUNT(*) INTO recent_signups_ip
    FROM public.security_alerts
    WHERE alert_type = 'newsletter_signup_attempt'
      AND details->>'ip_address' = p_ip_address
      AND created_at > now() - INTERVAL '1 hour';
    
    IF recent_signups_ip >= 10 THEN
      -- Log suspicious activity
      INSERT INTO public.security_alerts (alert_type, severity, details)
      VALUES ('newsletter_signup_rate_limit_ip', 'high', jsonb_build_object(
        'ip_address', p_ip_address,
        'signup_count_1h', recent_signups_ip,
        'blocked_at', now()
      ));
      RETURN false;
    END IF;
  END IF;
  
  -- Log legitimate signup attempt
  INSERT INTO public.security_alerts (alert_type, severity, details)
  VALUES ('newsletter_signup_attempt', 'low', jsonb_build_object(
    'email', p_email,
    'ip_address', p_ip_address,
    'allowed', true,
    'timestamp', now()
  ));
  
  RETURN true;
END;
$$;

-- Step 7: Create enhanced newsletter signup validation trigger
CREATE OR REPLACE FUNCTION public.validate_newsletter_signup()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Input sanitization
  NEW.email := LOWER(TRIM(REGEXP_REPLACE(NEW.email, '[<>"''&%;()]', '', 'g')));
  NEW.full_name := TRIM(REGEXP_REPLACE(NEW.full_name, '[<>"''&%;()\\]', '', 'g'));
  
  -- Enhanced email validation
  IF NEW.email !~ '^[A-Za-z0-9]([A-Za-z0-9._%-]*[A-Za-z0-9])?@[A-Za-z0-9]([A-Za-z0-9.-]*[A-Za-z0-9])?\\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;
  
  -- Check for suspicious email patterns
  IF NEW.email ~* '(test|fake|spam|bot|admin|root)' AND NEW.email !~* '@(gmail|yahoo|outlook|hotmail)' THEN
    INSERT INTO public.security_alerts (alert_type, severity, details)
    VALUES ('suspicious_newsletter_signup', 'medium', jsonb_build_object(
      'email', NEW.email,
      'reason', 'suspicious_email_pattern'
    ));
    RAISE EXCEPTION 'Suspicious email detected';
  END IF;
  
  -- Validate name length and content
  IF length(NEW.full_name) < 2 OR length(NEW.full_name) > 100 THEN
    RAISE EXCEPTION 'Name must be between 2 and 100 characters';
  END IF;
  
  -- Check rate limiting (would be called from application layer with IP)
  IF NOT check_newsletter_rate_limit(NEW.email) THEN
    RAISE EXCEPTION 'Rate limit exceeded. Please try again later.';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Drop and recreate newsletter validation trigger
DROP TRIGGER IF EXISTS validate_newsletter_signup_trigger ON public.newsletter_subscribers;
CREATE TRIGGER validate_newsletter_signup_trigger
  BEFORE INSERT ON public.newsletter_subscribers
  FOR EACH ROW EXECUTE FUNCTION public.validate_newsletter_signup();