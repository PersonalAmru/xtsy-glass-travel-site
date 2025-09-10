-- Security Hardening: RLS Base Policy Fixes (Fixed Syntax)
BEGIN;

-- BOOKINGS: add user_id, backfill, strict RLS
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS user_id uuid;

-- Add foreign key constraint (check if exists first)
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_bookings_user') THEN
    ALTER TABLE public.bookings
    ADD CONSTRAINT fk_bookings_user
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Backfill user_id from email matches
UPDATE public.bookings b
SET user_id = u.id
FROM auth.users u
WHERE b.user_id IS NULL AND u.email = b.email;

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Drop all existing booking policies
DO $$ DECLARE r record; BEGIN
  FOR r IN SELECT policyname FROM pg_policies
    WHERE schemaname='public' AND tablename='bookings'
  LOOP EXECUTE format('DROP POLICY IF EXISTS %I ON public.bookings', r.policyname); END LOOP;
END $$;

-- Create strict booking policies
CREATE POLICY "bookings_public_insert"
ON public.bookings FOR INSERT WITH CHECK (true);

CREATE POLICY "bookings_owner_select"
ON public.bookings FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "bookings_admin_read"
ON public.bookings FOR SELECT TO authenticated
USING (is_admin_or_staff());

CREATE POLICY "bookings_service_full"
ON public.bookings FOR ALL TO service_role
USING (true) WITH CHECK (true);

-- Auto-attach user_id trigger
CREATE OR REPLACE FUNCTION public.assign_booking_user_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.user_id IS NULL THEN NEW.user_id := auth.uid(); END IF;
  RETURN NEW;
END; $$ LANGUAGE plpgsql SECURITY INVOKER SET search_path = public;

DROP TRIGGER IF EXISTS assign_booking_user_id_trigger ON public.bookings;
CREATE TRIGGER assign_booking_user_id_trigger
  BEFORE INSERT ON public.bookings FOR EACH ROW
  EXECUTE FUNCTION public.assign_booking_user_id();

-- TRANSACTIONS: lock down completely
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
DO $$ DECLARE r record; BEGIN
  FOR r IN SELECT policyname FROM pg_policies
    WHERE schemaname='public' AND tablename='transactions'
  LOOP EXECUTE format('DROP POLICY IF EXISTS %I ON public.transactions', r.policyname); END LOOP;
END $$;

CREATE POLICY "transactions_no_public"
ON public.transactions FOR ALL TO public USING (false);

CREATE POLICY "transactions_service_full"
ON public.transactions FOR ALL TO service_role
USING (true) WITH CHECK (true);

CREATE POLICY "transactions_admin_full"
ON public.transactions FOR ALL TO authenticated
USING (is_admin_or_staff()) WITH CHECK (is_admin_or_staff());

-- NEWSLETTER_SUBSCRIBERS: public insert only
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
DO $$ DECLARE r record; BEGIN
  FOR r IN SELECT policyname FROM pg_policies
    WHERE schemaname='public' AND tablename='newsletter_subscribers'
  LOOP EXECUTE format('DROP POLICY IF EXISTS %I ON public.newsletter_subscribers', r.policyname); END LOOP;
END $$;

CREATE POLICY "newsletter_no_public"
ON public.newsletter_subscribers FOR ALL TO public USING (false);

CREATE POLICY "newsletter_public_insert"
ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);

CREATE POLICY "newsletter_service_full"
ON public.newsletter_subscribers FOR ALL TO service_role
USING (true) WITH CHECK (true);

CREATE POLICY "newsletter_admin_full"
ON public.newsletter_subscribers FOR ALL TO authenticated
USING (is_admin()) WITH CHECK (is_admin());

-- SECURITY_ALERTS: admin/service only
ALTER TABLE public.security_alerts ENABLE ROW LEVEL SECURITY;
DO $$ DECLARE r record; BEGIN
  FOR r IN SELECT policyname FROM pg_policies
    WHERE schemaname='public' AND tablename='security_alerts'
  LOOP EXECUTE format('DROP POLICY IF EXISTS %I ON public.security_alerts', r.policyname); END LOOP;
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