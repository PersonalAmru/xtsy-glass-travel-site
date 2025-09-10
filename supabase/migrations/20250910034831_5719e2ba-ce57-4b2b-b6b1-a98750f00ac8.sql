-- View Access Control and PII Protection Functions
BEGIN;

-- Simply revoke public access from views (RLS inherited from base tables)
REVOKE ALL ON public.bookings_masked FROM PUBLIC, anon;
REVOKE ALL ON public.security_alerts_masked FROM PUBLIC, anon;
REVOKE ALL ON public.transactions_admin_view FROM PUBLIC, anon;
REVOKE ALL ON public.newsletter_stats FROM PUBLIC, anon;

-- Grant minimal access - RLS policies on base tables will control actual access
GRANT SELECT ON public.bookings_masked TO authenticated;
GRANT SELECT ON public.security_alerts_masked TO authenticated;
GRANT SELECT ON public.transactions_admin_view TO authenticated;
GRANT SELECT ON public.newsletter_stats TO authenticated;

-- Handle secret access log view if it exists
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.views WHERE table_schema = 'public' AND table_name = 'secret_access_log_masked') THEN
    REVOKE ALL ON public.secret_access_log_masked FROM PUBLIC, anon;
    GRANT SELECT ON public.secret_access_log_masked TO authenticated;
  END IF;
END $$;

-- PII Protection: Functions for secure booking data access
CREATE OR REPLACE FUNCTION public.get_my_booking_pii(p_booking_id uuid)
RETURNS TABLE (id uuid, email text, whatsapp_number text, address text, emergency_contact text)
LANGUAGE plpgsql SECURITY INVOKER SET search_path = public AS $$
BEGIN
  -- Verify user owns this booking
  IF NOT EXISTS (SELECT 1 FROM public.bookings b WHERE b.id = p_booking_id AND b.user_id = auth.uid()) THEN
    RAISE EXCEPTION 'Not authorized to view this booking.';
  END IF;

  RETURN QUERY
  SELECT b.id, b.email, b.whatsapp_number, b.address, b.emergency_contact
  FROM public.bookings b WHERE b.id = p_booking_id;
END; $$;

-- Admin function: fetch full booking PII
CREATE OR REPLACE FUNCTION public.admin_get_booking_pii(p_booking_id uuid)
RETURNS TABLE (id uuid, email text, whatsapp_number text, address text, emergency_contact text, guest_name text, city text, state text, pincode text)
LANGUAGE plpgsql SECURITY INVOKER SET search_path = public AS $$
BEGIN
  IF NOT is_admin_or_staff() THEN 
    RAISE EXCEPTION 'Admin privileges required.'; 
  END IF;

  RETURN QUERY
  SELECT b.id, b.email, b.whatsapp_number, b.address, b.emergency_contact,
         b.guest_name, b.city, b.state, b.pincode
  FROM public.bookings b WHERE b.id = p_booking_id;
END; $$;

-- Block future PUBLIC grants on new tables/views in this schema
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM PUBLIC, anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON SEQUENCES FROM PUBLIC, anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON FUNCTIONS FROM PUBLIC, anon;

-- Grant only specific privileges to authenticated users for new objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO authenticated;

COMMIT;