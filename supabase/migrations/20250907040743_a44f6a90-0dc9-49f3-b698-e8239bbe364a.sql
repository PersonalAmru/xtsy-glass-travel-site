-- Migration 1: RLS Hardening for Core Tables
BEGIN;

-- 1) Add user_id to bookings if not exists and backfill from auth.users via email
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'user_id') THEN
    ALTER TABLE public.bookings ADD COLUMN user_id uuid REFERENCES auth.users(id);
  END IF;
END $$;

-- Backfill user_id from existing auth.users based on email match
UPDATE public.bookings 
SET user_id = au.id 
FROM auth.users au 
WHERE public.bookings.email = au.email 
AND public.bookings.user_id IS NULL;

-- 2) Create trigger to auto-assign user_id on insert if user is authenticated
CREATE OR REPLACE FUNCTION public.assign_booking_user_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.user_id IS NULL AND auth.uid() IS NOT NULL THEN
    NEW.user_id := auth.uid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS assign_booking_user_id_trigger ON public.bookings;
CREATE TRIGGER assign_booking_user_id_trigger
  BEFORE INSERT ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.assign_booking_user_id();

-- 3) Drop existing policies and recreate with stricter access
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Anyone can create a booking" ON public.bookings;
DROP POLICY IF EXISTS "Service role full access to bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins and staff can view all bookings" ON public.bookings;

-- Bookings: Owner SELECT via user_id, service_role FULL, admin/staff SELECT ALL, anyone INSERT
CREATE POLICY "Booking owners can view their own bookings"
ON public.bookings FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Service role full access to bookings"
ON public.bookings FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Admins and staff can view all bookings"
ON public.bookings FOR SELECT TO authenticated
USING (is_admin_or_staff());

CREATE POLICY "Anyone can create bookings"
ON public.bookings FOR INSERT
WITH CHECK (true);

-- 4) Transactions: DENY ALL except service_role and admin/staff
DROP POLICY IF EXISTS "transactions_no_public" ON public.transactions;
DROP POLICY IF EXISTS "transactions_service_full" ON public.transactions;
DROP POLICY IF EXISTS "transactions_admin_full" ON public.transactions;

CREATE POLICY "transactions_no_public"
ON public.transactions FOR ALL
USING (false);

CREATE POLICY "transactions_service_full"
ON public.transactions FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "transactions_admin_full"
ON public.transactions FOR ALL TO authenticated
USING (is_admin_or_staff())
WITH CHECK (is_admin_or_staff());

-- 5) Newsletter subscribers: PUBLIC INSERT ONLY, service_role/admin manage
DROP POLICY IF EXISTS "newsletter_no_public" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "newsletter_public_insert" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "newsletter_service_full" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "newsletter_admin_full" ON public.newsletter_subscribers;

CREATE POLICY "newsletter_public_insert"
ON public.newsletter_subscribers FOR INSERT
WITH CHECK (true);

CREATE POLICY "newsletter_service_full"
ON public.newsletter_subscribers FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "newsletter_admin_manage"
ON public.newsletter_subscribers FOR ALL TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "newsletter_no_other_access"
ON public.newsletter_subscribers FOR SELECT
USING (false);

-- 6) Security alerts: service_role/admin only; admins can resolve
DROP POLICY IF EXISTS "secalerts_no_public" ON public.security_alerts;
DROP POLICY IF EXISTS "secalerts_service_full" ON public.security_alerts;
DROP POLICY IF EXISTS "secalerts_admin_full" ON public.security_alerts;

CREATE POLICY "secalerts_service_full"
ON public.security_alerts FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "secalerts_admin_read"
ON public.security_alerts FOR SELECT TO authenticated
USING (is_admin());

CREATE POLICY "secalerts_admin_update"
ON public.security_alerts FOR UPDATE TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "secalerts_no_other_access"
ON public.security_alerts FOR ALL
USING (false);

-- 7) Create bookings_masked view with PII masking
CREATE OR REPLACE VIEW public.bookings_masked AS
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
  -- Mask sensitive PII
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
    ELSE LEFT(COALESCE(address, ''), 20) || '...'
  END as address,
  city,
  state,
  pincode,
  CASE 
    WHEN is_admin_or_staff() THEN emergency_contact
    ELSE REGEXP_REPLACE(COALESCE(emergency_contact, ''), '(.{3}).*(.{2})$', '\1***\2')
  END as emergency_contact,
  special_requests,
  source
FROM public.bookings;

-- Set security properties on the view
ALTER VIEW public.bookings_masked SET (security_invoker = true);
ALTER VIEW public.bookings_masked SET (security_barrier = true);

-- Enable RLS on the masked view
ALTER VIEW public.bookings_masked ENABLE ROW LEVEL SECURITY;

-- Policies for masked view (mirror base table access patterns)
CREATE POLICY "Masked bookings user access"
ON public.bookings_masked FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Masked bookings admin access"
ON public.bookings_masked FOR SELECT TO authenticated
USING (is_admin_or_staff());

COMMIT;