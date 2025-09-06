-- Migration: Harden database security for bookings, transactions, newsletter_subscribers, and security_alerts
BEGIN;

-- 1) BOOKINGS: add user_id + owner-only access
ALTER TABLE public.bookings 
  ADD COLUMN IF NOT EXISTS user_id UUID;

-- Add foreign key constraint if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_bookings_user' 
    AND table_name = 'bookings'
  ) THEN
    ALTER TABLE public.bookings 
    ADD CONSTRAINT fk_bookings_user
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Backfill user_id from email where possible
UPDATE public.bookings AS b
SET user_id = u.id
FROM auth.users AS u
WHERE b.user_id IS NULL AND u.email = b.email;

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Drop legacy/permissive/email-based policies
DROP POLICY IF EXISTS "Anyone can insert bookings" ON public.bookings;
DROP POLICY IF EXISTS "Anyone can view bookings" ON public.bookings;
DROP POLICY IF EXISTS "Anyone can update bookings" ON public.bookings;
DROP POLICY IF EXISTS "Authenticated users can create bookings" ON public.bookings;
DROP POLICY IF EXISTS "Anyone can create a booking" ON public.bookings;
DROP POLICY IF EXISTS "Guests can view their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Guests can only view their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Authenticated users can view their verified bookings" ON public.bookings;
DROP POLICY IF EXISTS "bookings_no_public" ON public.bookings;
DROP POLICY IF EXISTS "bookings_owner_select" ON public.bookings;
DROP POLICY IF EXISTS "bookings_owner_write" ON public.bookings;
DROP POLICY IF EXISTS "bookings_owner_delete" ON public.bookings;
DROP POLICY IF EXISTS "bookings_admin_full" ON public.bookings;
DROP POLICY IF EXISTS "bookings_admin_full_by_claim" ON public.bookings;
DROP POLICY IF EXISTS "Admins and staff can view all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Service role can manage all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Only booking owners can access their own bookings" ON public.bookings;

-- Allow anonymous + authenticated to INSERT (guest booking flow)
CREATE POLICY "Anyone can create a booking"
ON public.bookings
FOR INSERT
WITH CHECK (true);

-- Owners can SELECT their rows
CREATE POLICY "Users can view their own bookings"
ON public.bookings
FOR SELECT
USING (auth.uid() = user_id);

-- service_role full access
CREATE POLICY "Service role full access to bookings"
ON public.bookings
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- admins/staff can view all bookings
CREATE POLICY "Admins and staff can view all bookings"
ON public.bookings
FOR SELECT
USING (is_admin_or_staff());

-- Trigger to auto-set user_id for logged-in inserts
CREATE OR REPLACE FUNCTION public.assign_booking_user_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.user_id IS NULL THEN
    NEW.user_id := auth.uid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER SET search_path = public;

DROP TRIGGER IF EXISTS assign_booking_user_id_trigger ON public.bookings;
CREATE TRIGGER assign_booking_user_id_trigger
  BEFORE INSERT ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.assign_booking_user_id();

-- 2) TRANSACTIONS: restrict to service_role and admin/staff
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Remove all existing policies on transactions
DO $$ 
DECLARE r RECORD;
BEGIN
  FOR r IN
    SELECT policyname FROM pg_policies
    WHERE schemaname='public' AND tablename='transactions'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.transactions', r.policyname);
  END LOOP;
END $$;

-- Deny-by-default + narrow allow
CREATE POLICY "transactions_no_public"
ON public.transactions FOR ALL TO public USING (false);

CREATE POLICY "transactions_service_full"
ON public.transactions FOR ALL TO service_role
USING (true) WITH CHECK (true);

CREATE POLICY "transactions_admin_full"
ON public.transactions FOR ALL TO authenticated
USING (is_admin_or_staff()) WITH CHECK (is_admin_or_staff());

-- 3) NEWSLETTER_SUBSCRIBERS: open INSERT, admin/service manage
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Remove all existing policies on newsletter_subscribers
DO $$ 
DECLARE r RECORD;
BEGIN
  FOR r IN
    SELECT policyname FROM pg_policies
    WHERE schemaname='public' AND tablename='newsletter_subscribers'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.newsletter_subscribers', r.policyname);
  END LOOP;
END $$;

CREATE POLICY "newsletter_no_public"
ON public.newsletter_subscribers FOR ALL TO public USING (false);

CREATE POLICY "newsletter_public_insert"
ON public.newsletter_subscribers FOR INSERT
WITH CHECK (true);

CREATE POLICY "newsletter_service_full"
ON public.newsletter_subscribers FOR ALL TO service_role
USING (true) WITH CHECK (true);

CREATE POLICY "newsletter_admin_full"
ON public.newsletter_subscribers FOR ALL TO authenticated
USING (is_admin()) WITH CHECK (is_admin());

-- 4) SECURITY_ALERTS: service/admin only (admins may update/resolve)
ALTER TABLE public.security_alerts ENABLE ROW LEVEL SECURITY;

-- Remove all existing policies on security_alerts
DO $$ 
DECLARE r RECORD;
BEGIN
  FOR r IN
    SELECT policyname FROM pg_policies
    WHERE schemaname='public' AND tablename='security_alerts'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.security_alerts', r.policyname);
  END LOOP;
END $$;

CREATE POLICY "secalerts_no_public"
ON public.security_alerts FOR ALL TO public USING (false);

CREATE POLICY "secalerts_service_full"
ON public.security_alerts FOR ALL TO service_role
USING (true) WITH CHECK (true);

CREATE POLICY "secalerts_admin_full"
ON public.security_alerts FOR ALL TO authenticated
USING (is_admin()) WITH CHECK (is_admin());

COMMIT;