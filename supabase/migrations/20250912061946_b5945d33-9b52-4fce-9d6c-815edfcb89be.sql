-- CRITICAL Security Fix: Secure masked views using access functions
-- Since views cannot have RLS policies, we create secure access functions

-- Step 1: Create secure function to access bookings_masked data
CREATE OR REPLACE FUNCTION public.get_bookings_masked_secure()
RETURNS TABLE(
  id uuid, booking_id text, guest_name text, email text, whatsapp_number text,
  check_in date, check_out date, guests integer, total_amount integer,
  room_type text, booking_status text, payment_status text, created_at timestamptz,
  user_id uuid, address text, city text, state text, pincode text,
  emergency_contact text, special_requests text, source text,
  subtotal integer, taxes integer, updated_at timestamptz,
  confirmed_at timestamptz, cancelled_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  user_role TEXT;
  current_user_id UUID;
BEGIN
  -- Get current user info
  current_user_id := auth.uid();
  user_role := get_user_role();
  
  -- Only allow authenticated users
  IF current_user_id IS NULL THEN
    RETURN;
  END IF;
  
  -- Admin/staff can see all data, regular users only their own
  IF user_role IN ('admin', 'staff') THEN
    RETURN QUERY
    SELECT * FROM public.bookings_masked;
  ELSE
    RETURN QUERY
    SELECT * FROM public.bookings_masked bm 
    WHERE bm.user_id = current_user_id;
  END IF;
END;
$$;

-- Step 2: Create secure function to access security_alerts_masked (admin only)
CREATE OR REPLACE FUNCTION public.get_security_alerts_masked_secure()
RETURNS TABLE(
  id uuid, event_type text, severity text, ip text, user_agent text,
  created_at timestamptz, resolved boolean, resolved_by uuid, details jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  user_role TEXT;
BEGIN
  user_role := get_user_role();
  
  -- Only admins can access security alerts
  IF user_role != 'admin' THEN
    RETURN;
  END IF;
  
  RETURN QUERY
  SELECT * FROM public.security_alerts_masked;
END;
$$;

-- Step 3: Create secure function to access secret_access_log_masked (admin only)
CREATE OR REPLACE FUNCTION public.get_secret_access_log_masked_secure()
RETURNS TABLE(
  id uuid, event text, ip text, user_agent text, path_preview text, created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  user_role TEXT;
BEGIN
  user_role := get_user_role();
  
  -- Only admins can access secret access logs
  IF user_role != 'admin' THEN
    RETURN;
  END IF;
  
  RETURN QUERY
  SELECT * FROM public.secret_access_log_masked;
END;
$$;

-- Step 4: Create secure function to access transactions_admin_view (admin/staff only)
CREATE OR REPLACE FUNCTION public.get_transactions_admin_view_secure()
RETURNS TABLE(
  id uuid, booking_id uuid, amount integer, currency text, status text,
  gateway text, created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  user_role TEXT;
BEGIN
  user_role := get_user_role();
  
  -- Only admin/staff can access transaction admin view
  IF user_role NOT IN ('admin', 'staff') THEN
    RETURN;
  END IF;
  
  RETURN QUERY
  SELECT * FROM public.transactions_admin_view;
END;
$$;

-- Step 5: Create secure function to access newsletter_stats (admin only)
CREATE OR REPLACE FUNCTION public.get_newsletter_stats_secure()
RETURNS TABLE(
  total_subscribers bigint, active_subscribers bigint, inactive_subscribers bigint,
  new_this_week bigint, new_this_month bigint, unique_interest_combinations bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  user_role TEXT;
BEGIN
  user_role := get_user_role();
  
  -- Only admins can access newsletter statistics
  IF user_role != 'admin' THEN
    RETURN;
  END IF;
  
  RETURN QUERY
  SELECT * FROM public.newsletter_stats;
END;
$$;

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
  
  -- Check rate limiting
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

-- Step 8: Add audit logging for secure function access
CREATE OR REPLACE FUNCTION public.log_secure_access(function_name text, access_granted boolean DEFAULT true)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  user_email TEXT;
BEGIN
  user_email := get_jwt_email();
  
  INSERT INTO public.security_alerts (alert_type, severity, details, user_id)
  VALUES ('secure_function_access', 'low', jsonb_build_object(
    'function_name', function_name,
    'user_email', user_email,
    'access_granted', access_granted,
    'timestamp', now(),
    'user_role', get_user_role()
  ), auth.uid());
END;
$$;