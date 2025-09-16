-- Fix newsletter stats security: Create secure function for admin access only
-- Since newsletter_stats is a view, we need to control access through a secure function

-- Create a secure function that only admins can access
CREATE OR REPLACE FUNCTION public.get_newsletter_stats_admin_secure()
RETURNS TABLE(
  total_subscribers bigint,
  active_subscribers bigint, 
  inactive_subscribers bigint,
  new_this_week bigint,
  new_this_month bigint,
  unique_interest_combinations bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- Only allow admin users to access newsletter statistics
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Admin privileges required to access newsletter statistics.';
  END IF;
  
  -- Return the newsletter stats data
  RETURN QUERY
  SELECT 
    ns.total_subscribers,
    ns.active_subscribers,
    ns.inactive_subscribers, 
    ns.new_this_week,
    ns.new_this_month,
    ns.unique_interest_combinations
  FROM public.newsletter_stats ns;
END;
$function$;

-- Grant execute permission to authenticated users (function will handle admin check)
GRANT EXECUTE ON FUNCTION public.get_newsletter_stats_admin_secure() TO authenticated;

-- Log this security enhancement
INSERT INTO public.security_alerts (alert_type, severity, details)
VALUES ('security_enhancement', 'low', jsonb_build_object(
  'enhancement', 'newsletter_stats_access_restricted',
  'description', 'Newsletter statistics access restricted to admin users only',
  'timestamp', now()
));