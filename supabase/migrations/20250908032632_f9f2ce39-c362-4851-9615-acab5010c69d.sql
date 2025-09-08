-- Migration 3: EXPOSED_SENSITIVE_DATA (Bookings PII Shield)
BEGIN;

-- 1) Create strict self-access function for owners to retrieve their own PII for a single booking
CREATE OR REPLACE FUNCTION public.get_my_booking_pii(p_booking_id uuid)
RETURNS TABLE (
  id uuid,
  email text,
  whatsapp_number text,
  address text,
  emergency_contact text
) AS $$
BEGIN
  -- Verify user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required.';
  END IF;

  -- Verify ownership
  IF NOT EXISTS (
    SELECT 1 FROM public.bookings b
    WHERE b.id = p_booking_id AND b.user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Not authorized to view this booking.';
  END IF;

  RETURN QUERY
  SELECT b.id, b.email, b.whatsapp_number, b.address, b.emergency_contact
  FROM public.bookings b
  WHERE b.id = p_booking_id AND b.user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY INVOKER SET search_path = public;

-- 2) Admin-only function to fetch PII by booking id
CREATE OR REPLACE FUNCTION public.admin_get_booking_pii(p_booking_id uuid)
RETURNS TABLE (
  id uuid,
  email text,
  whatsapp_number text,
  address text,
  emergency_contact text,
  guest_name text,
  city text,
  state text,
  pincode text
) AS $$
BEGIN
  IF NOT is_admin_or_staff() THEN
    RAISE EXCEPTION 'Admin privileges required.';
  END IF;

  RETURN QUERY
  SELECT b.id, b.email, b.whatsapp_number, b.address, b.emergency_contact,
         b.guest_name, b.city, b.state, b.pincode
  FROM public.bookings b
  WHERE b.id = p_booking_id;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER SET search_path = public;

-- 3) Create secure booking search function for admins
CREATE OR REPLACE FUNCTION public.admin_search_bookings(
  p_email text DEFAULT NULL,
  p_booking_id text DEFAULT NULL,
  p_guest_name text DEFAULT NULL,
  p_limit integer DEFAULT 50
)
RETURNS TABLE (
  id uuid,
  booking_id text,
  guest_name text,
  email text,
  whatsapp_number text,
  check_in date,
  check_out date,
  guests integer,
  total_amount integer,
  booking_status text,
  payment_status text,
  created_at timestamptz
) AS $$
BEGIN
  IF NOT is_admin_or_staff() THEN
    RAISE EXCEPTION 'Admin privileges required.';
  END IF;

  RETURN QUERY
  SELECT 
    b.id, b.booking_id, b.guest_name, b.email, b.whatsapp_number,
    b.check_in, b.check_out, b.guests, b.total_amount,
    b.booking_status, b.payment_status, b.created_at
  FROM public.bookings b
  WHERE 
    (p_email IS NULL OR LOWER(b.email) LIKE LOWER('%' || p_email || '%'))
    AND (p_booking_id IS NULL OR b.booking_id ILIKE '%' || p_booking_id || '%')
    AND (p_guest_name IS NULL OR LOWER(b.guest_name) LIKE LOWER('%' || p_guest_name || '%'))
  ORDER BY b.created_at DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER SET search_path = public;

-- 4) Create user's own bookings function (masked for safety)
CREATE OR REPLACE FUNCTION public.get_my_bookings()
RETURNS TABLE (
  id uuid,
  booking_id text,
  guest_name text,
  email_masked text,
  whatsapp_masked text,
  check_in date,
  check_out date,
  guests integer,
  total_amount integer,
  room_type text,
  booking_status text,
  payment_status text,
  created_at timestamptz,
  address_masked text
) AS $$
BEGIN
  -- Verify user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required.';
  END IF;

  RETURN QUERY
  SELECT 
    b.id,
    b.booking_id,
    b.guest_name,
    -- Mask PII even for own bookings in list view
    REGEXP_REPLACE(b.email, '(.{2}).*(@.*)', '\1***\2') as email_masked,
    REGEXP_REPLACE(b.whatsapp_number, '(.{3}).*(.{2})$', '\1***\2') as whatsapp_masked,
    b.check_in,
    b.check_out,
    b.guests,
    b.total_amount,
    b.room_type,
    b.booking_status,
    b.payment_status,
    b.created_at,
    LEFT(COALESCE(b.address, ''), 20) || '...' as address_masked
  FROM public.bookings b
  WHERE b.user_id = auth.uid()
  ORDER BY b.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER SET search_path = public;

-- 5) Create audit log for PII access attempts
CREATE OR REPLACE FUNCTION public.log_pii_access(
  p_booking_id uuid,
  p_access_type text,  -- 'self_access', 'admin_access', 'unauthorized_attempt'
  p_success boolean DEFAULT true
)
RETURNS void AS $$
BEGIN
  INSERT INTO public.security_alerts (
    alert_type,
    severity,
    details,
    user_id,
    ip_address
  ) VALUES (
    'pii_access_log',
    CASE WHEN p_success THEN 'low' ELSE 'high' END,
    jsonb_build_object(
      'booking_id', p_booking_id,
      'access_type', p_access_type,
      'success', p_success,
      'timestamp', now(),
      'user_role', get_user_role()
    ),
    auth.uid(),
    ''  -- IP would be set by application layer
  );
END;
$$ LANGUAGE plpgsql SECURITY INVOKER SET search_path = public;

-- 6) Enhanced bookings_masked view with better security barriers
DROP VIEW IF EXISTS public.bookings_masked;
CREATE VIEW public.bookings_masked
WITH (security_invoker = true, security_barrier = true) AS
SELECT 
  id,
  booking_id,
  check_in,
  check_out,
  guests,
  subtotal,
  taxes,
  total_amount,
  created_at,
  updated_at,
  confirmed_at,
  cancelled_at,
  user_id,
  guest_name,
  -- Strictly mask all PII - even for owners in list views
  CASE 
    WHEN is_admin_or_staff() THEN email
    ELSE REGEXP_REPLACE(email, '(.{2}).*(@.*)', '\1***\2')
  END as email,
  CASE 
    WHEN is_admin_or_staff() THEN whatsapp_number
    ELSE REGEXP_REPLACE(whatsapp_number, '(.{3}).*(.{2})$', '\1***\2')
  END as whatsapp_number,
  room_type,
  booking_status,
  payment_status,
  CASE 
    WHEN is_admin_or_staff() THEN address
    ELSE LEFT(COALESCE(address, ''), 15) || '...'
  END as address,
  city,
  state,
  CASE 
    WHEN is_admin_or_staff() THEN pincode
    ELSE NULL
  END as pincode,
  CASE 
    WHEN is_admin_or_staff() THEN emergency_contact
    ELSE REGEXP_REPLACE(COALESCE(emergency_contact, ''), '(.{3}).*(.{2})$', '\1***\2')
  END as emergency_contact,
  -- Keep non-PII fields as-is
  special_requests,
  source
FROM public.bookings
WHERE 
  -- Users can only see their own bookings
  (user_id = auth.uid() OR is_admin_or_staff())
  -- Service role can see all
  OR auth.role() = 'service_role';

-- 7) Create GDPR data export function for users
CREATE OR REPLACE FUNCTION public.export_my_data()
RETURNS jsonb AS $$
DECLARE
  user_data jsonb;
BEGIN
  -- Verify user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required.';
  END IF;

  -- Collect all user data across tables
  SELECT jsonb_build_object(
    'user_id', auth.uid(),
    'export_timestamp', now(),
    'profile', (
      SELECT to_jsonb(p) FROM public.profiles p WHERE p.id = auth.uid()
    ),
    'bookings', (
      SELECT COALESCE(jsonb_agg(to_jsonb(b)), '[]'::jsonb)
      FROM public.bookings b 
      WHERE b.user_id = auth.uid()
    )
  ) INTO user_data;

  -- Log the export request
  PERFORM public.log_pii_access(null, 'gdpr_export', true);

  RETURN user_data;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER SET search_path = public;

-- 8) Create GDPR data deletion function for users
CREATE OR REPLACE FUNCTION public.delete_my_data()
RETURNS boolean AS $$
DECLARE
  booking_count integer;
BEGIN
  -- Verify user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required.';
  END IF;

  -- Check for active bookings
  SELECT COUNT(*) INTO booking_count
  FROM public.bookings
  WHERE user_id = auth.uid() 
    AND booking_status IN ('confirmed', 'pending')
    AND check_out >= CURRENT_DATE;

  IF booking_count > 0 THEN
    RAISE EXCEPTION 'Cannot delete data with active bookings. Please contact support.';
  END IF;

  -- Log the deletion request before actual deletion
  PERFORM public.log_pii_access(null, 'gdpr_deletion', true);

  -- Anonymize completed bookings instead of deleting (for business records)
  UPDATE public.bookings
  SET 
    email = 'deleted@privacy.local',
    whatsapp_number = 'DELETED',
    guest_name = 'DELETED USER',
    address = NULL,
    city = NULL,
    state = NULL,
    pincode = NULL,
    emergency_contact = NULL,
    special_requests = 'USER DATA DELETED FOR PRIVACY'
  WHERE user_id = auth.uid()
    AND booking_status = 'completed';

  -- Delete profile
  DELETE FROM public.profiles WHERE id = auth.uid();

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER SET search_path = public;

COMMIT;