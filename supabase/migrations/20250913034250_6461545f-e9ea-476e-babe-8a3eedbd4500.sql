-- Create secure access functions for sensitive views
-- Since views cannot have RLS policies, we create security definer functions to control access

-- Secure function for bookings_masked view
CREATE OR REPLACE FUNCTION public.get_bookings_masked_secure()
RETURNS TABLE(
  id uuid, booking_id text, guest_name text, email text, whatsapp_number text,
  check_in date, check_out date, guests integer, total_amount integer,
  room_type text, booking_status text, payment_status text, created_at timestamp with time zone,
  user_id uuid, address text, city text, state text, pincode text,
  emergency_contact text, special_requests text, source text,
  subtotal integer, taxes integer, updated_at timestamp with time zone,
  confirmed_at timestamp with time zone, cancelled_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
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

-- Secure function for newsletter_stats view
CREATE OR REPLACE FUNCTION public.get_newsletter_stats_secure()
RETURNS TABLE(
  total_subscribers bigint, active_subscribers bigint, inactive_subscribers bigint,
  new_this_week bigint, new_this_month bigint, unique_interest_combinations bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
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

-- Secure function for secret_access_log_masked view
CREATE OR REPLACE FUNCTION public.get_secret_access_log_masked_secure()
RETURNS TABLE(
  id uuid, event text, ip text, user_agent text, path_preview text, created_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
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

-- Secure function for security_alerts_masked view
CREATE OR REPLACE FUNCTION public.get_security_alerts_masked_secure()
RETURNS TABLE(
  id uuid, event_type text, severity text, ip text, user_agent text,
  created_at timestamp with time zone, resolved boolean, resolved_by uuid, details jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
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

-- Secure function for transactions_admin_view
CREATE OR REPLACE FUNCTION public.get_transactions_admin_view_secure()
RETURNS TABLE(
  id uuid, booking_id uuid, amount integer, currency text, 
  status text, gateway text, created_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
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