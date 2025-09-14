-- Lock Down Supabase Security: Strict RLS + Anonymous Inserts Only
-- This migration addresses all public data exposure vulnerabilities

-- 1. REVOKE ALL PUBLIC ACCESS FROM SENSITIVE TABLES
REVOKE ALL ON public.bookings FROM PUBLIC, anon;
REVOKE ALL ON public.newsletter_subscribers FROM PUBLIC, anon;
REVOKE ALL ON public.transactions FROM PUBLIC, anon;
REVOKE ALL ON public.security_alerts FROM PUBLIC, anon;
REVOKE ALL ON public.secret_access_log FROM PUBLIC, anon;

-- 2. DROP ALL EXISTING PERMISSIVE POLICIES
DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON public.reviews;
DROP POLICY IF EXISTS "Service role can manage all reviews" ON public.reviews;
DROP POLICY IF EXISTS "Itineraries are viewable by everyone" ON public.itineraries;
DROP POLICY IF EXISTS "Only service role can manage itineraries" ON public.itineraries;
DROP POLICY IF EXISTS "newsletter_public_insert" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "newsletter_admin_full" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "newsletter_no_public" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "newsletter_service_full" ON public.newsletter_subscribers;

-- 3. BOOKINGS TABLE SECURITY
-- Drop all existing booking policies
DROP POLICY IF EXISTS "secure_booking_admin_select" ON public.bookings;
DROP POLICY IF EXISTS "secure_booking_service_role" ON public.bookings;
DROP POLICY IF EXISTS "secure_booking_authenticated_insert" ON public.bookings;
DROP POLICY IF EXISTS "secure_booking_owner_select_secure" ON public.bookings;
DROP POLICY IF EXISTS "secure_booking_owner_update" ON public.bookings;
DROP POLICY IF EXISTS "secure_booking_admin_emergency_select" ON public.bookings;
DROP POLICY IF EXISTS "block_public_booking_access" ON public.bookings;
DROP POLICY IF EXISTS "prevent_booking_delete" ON public.bookings;

-- Ensure RLS is enabled
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- BOOKINGS: Allow anonymous inserts for public booking form
CREATE POLICY "bookings_anonymous_insert" ON public.bookings
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- BOOKINGS: Only service_role and admin can SELECT
CREATE POLICY "bookings_admin_select_only" ON public.bookings
FOR SELECT 
TO authenticated
USING (is_admin_or_staff());

CREATE POLICY "bookings_service_role_full" ON public.bookings
FOR ALL 
TO service_role
USING (true)
WITH CHECK (true);

-- BOOKINGS: Authenticated users can update their own bookings
CREATE POLICY "bookings_owner_update" ON public.bookings
FOR UPDATE 
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- BOOKINGS: Deny all other access
CREATE POLICY "bookings_deny_all_else" ON public.bookings
FOR ALL 
TO anon, authenticated
USING (false)
WITH CHECK (false);

-- 4. NEWSLETTER SUBSCRIBERS SECURITY
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- NEWSLETTER: Allow anonymous inserts for newsletter signup
CREATE POLICY "newsletter_anonymous_insert" ON public.newsletter_subscribers
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- NEWSLETTER: Only admin and service_role can SELECT
CREATE POLICY "newsletter_admin_select_only" ON public.newsletter_subscribers
FOR SELECT 
TO authenticated
USING (is_admin());

CREATE POLICY "newsletter_service_role_full" ON public.newsletter_subscribers
FOR ALL 
TO service_role
USING (true)
WITH CHECK (true);

-- NEWSLETTER: Admin can manage all
CREATE POLICY "newsletter_admin_manage" ON public.newsletter_subscribers
FOR ALL 
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- NEWSLETTER: Deny all other access
CREATE POLICY "newsletter_deny_all_else" ON public.newsletter_subscribers
FOR ALL 
TO anon, authenticated
USING (false)
WITH CHECK (false);

-- 5. TRANSACTIONS COMPLETE LOCKDOWN
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Drop existing transaction policies
DROP POLICY IF EXISTS "transactions_admin_full" ON public.transactions;
DROP POLICY IF EXISTS "transactions_no_public" ON public.transactions;
DROP POLICY IF EXISTS "transactions_service_full" ON public.transactions;

-- TRANSACTIONS: Only service_role has full access
CREATE POLICY "transactions_service_role_only" ON public.transactions
FOR ALL 
TO service_role
USING (true)
WITH CHECK (true);

-- TRANSACTIONS: Admin can view (read-only)
CREATE POLICY "transactions_admin_read_only" ON public.transactions
FOR SELECT 
TO authenticated
USING (is_admin());

-- TRANSACTIONS: Deny everyone else
CREATE POLICY "transactions_deny_all_public" ON public.transactions
FOR ALL 
TO anon, authenticated
USING (false)
WITH CHECK (false);

-- 6. SECURITY ALERTS COMPLETE LOCKDOWN
ALTER TABLE public.security_alerts ENABLE ROW LEVEL SECURITY;

-- Drop existing security alert policies
DROP POLICY IF EXISTS "secalerts_admin_full" ON public.security_alerts;
DROP POLICY IF EXISTS "secalerts_no_public" ON public.security_alerts;
DROP POLICY IF EXISTS "secalerts_service_full" ON public.security_alerts;

-- SECURITY ALERTS: Only service_role and admin access
CREATE POLICY "security_alerts_service_role_only" ON public.security_alerts
FOR ALL 
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "security_alerts_admin_only" ON public.security_alerts
FOR ALL 
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- SECURITY ALERTS: Deny everyone else
CREATE POLICY "security_alerts_deny_all_public" ON public.security_alerts
FOR ALL 
TO anon, authenticated
USING (false)
WITH CHECK (false);

-- 7. SECRET ACCESS LOG COMPLETE LOCKDOWN
ALTER TABLE public.secret_access_log ENABLE ROW LEVEL SECURITY;

-- Drop existing secret access log policies
DROP POLICY IF EXISTS "secaccess_admin_full" ON public.secret_access_log;
DROP POLICY IF EXISTS "secaccess_no_public" ON public.secret_access_log;
DROP POLICY IF EXISTS "secaccess_service_full" ON public.secret_access_log;

-- SECRET ACCESS LOG: Only service_role and admin access
CREATE POLICY "secret_access_log_service_role_only" ON public.secret_access_log
FOR ALL 
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "secret_access_log_admin_only" ON public.secret_access_log
FOR ALL 
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- SECRET ACCESS LOG: Deny everyone else
CREATE POLICY "secret_access_log_deny_all_public" ON public.secret_access_log
FOR ALL 
TO anon, authenticated
USING (false)
WITH CHECK (false);

-- 8. REVIEWS AND ITINERARIES - Lock down but keep public read for website
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itineraries ENABLE ROW LEVEL SECURITY;

-- REVIEWS: Public can read (for website display)
CREATE POLICY "reviews_public_read_only" ON public.reviews
FOR SELECT 
TO anon, authenticated
USING (true);

-- REVIEWS: Only service_role can manage
CREATE POLICY "reviews_service_role_manage" ON public.reviews
FOR ALL 
TO service_role
USING (true)
WITH CHECK (true);

-- REVIEWS: Deny all other operations
CREATE POLICY "reviews_deny_write_public" ON public.reviews
FOR INSERT, UPDATE, DELETE
TO anon, authenticated
USING (false)
WITH CHECK (false);

-- ITINERARIES: Public can read (for website display)
CREATE POLICY "itineraries_public_read_only" ON public.itineraries
FOR SELECT 
TO anon, authenticated
USING (true);

-- ITINERARIES: Only service_role can manage
CREATE POLICY "itineraries_service_role_manage" ON public.itineraries
FOR ALL 
TO service_role
USING (true)
WITH CHECK (true);

-- ITINERARIES: Deny all other operations
CREATE POLICY "itineraries_deny_write_public" ON public.itineraries
FOR INSERT, UPDATE, DELETE
TO anon, authenticated
USING (false)
WITH CHECK (false);

-- 9. DESTINATIONS - Lock down but keep public read
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;

-- Drop existing destination policies that are too permissive
DROP POLICY IF EXISTS "Public can view destinations" ON public.destinations;
DROP POLICY IF EXISTS "Admins can delete destinations" ON public.destinations;
DROP POLICY IF EXISTS "Admins can insert destinations" ON public.destinations;
DROP POLICY IF EXISTS "Admins can update destinations" ON public.destinations;
DROP POLICY IF EXISTS "Block unauthorized destination modifications" ON public.destinations;
DROP POLICY IF EXISTS "Service role full destinations access" ON public.destinations;

-- DESTINATIONS: Public can read (for website display)
CREATE POLICY "destinations_public_read_only" ON public.destinations
FOR SELECT 
TO anon, authenticated
USING (true);

-- DESTINATIONS: Only service_role and admin can manage
CREATE POLICY "destinations_service_role_manage" ON public.destinations
FOR ALL 
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "destinations_admin_manage" ON public.destinations
FOR ALL 
TO authenticated
USING (is_admin_or_staff())
WITH CHECK (is_admin_or_staff());

-- DESTINATIONS: Deny all other operations
CREATE POLICY "destinations_deny_write_public" ON public.destinations
FOR INSERT, UPDATE, DELETE
TO anon, authenticated
USING (false)
WITH CHECK (false);

-- 10. PROFILES - Secure user profile access
-- Profiles policies already exist and are secure, but let's verify RLS is enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 11. METRICS - Keep public read but lock writes
ALTER TABLE public.metrics ENABLE ROW LEVEL SECURITY;

-- Drop existing metrics policies
DROP POLICY IF EXISTS "metrics_admin_update" ON public.metrics;
DROP POLICY IF EXISTS "metrics_admin_write" ON public.metrics;
DROP POLICY IF EXISTS "metrics_public_read" ON public.metrics;

-- METRICS: Public can read (for website stats)
CREATE POLICY "metrics_public_read_only" ON public.metrics
FOR SELECT 
TO anon, authenticated
USING (true);

-- METRICS: Only admin/staff and service_role can write
CREATE POLICY "metrics_admin_write" ON public.metrics
FOR INSERT, UPDATE
TO authenticated
USING (is_admin_or_staff())
WITH CHECK (is_admin_or_staff());

CREATE POLICY "metrics_service_role_manage" ON public.metrics
FOR ALL 
TO service_role
USING (true)
WITH CHECK (true);

-- METRICS: Deny delete and unauthorized writes
CREATE POLICY "metrics_deny_delete_public" ON public.metrics
FOR DELETE
TO anon, authenticated
USING (false);

-- 12. PREVENT FUTURE PUBLIC GRANTS
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM PUBLIC;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON FUNCTIONS FROM PUBLIC;

-- 13. Create secure trigger for booking user_id assignment
CREATE OR REPLACE FUNCTION public.assign_booking_user_id_secure()
RETURNS TRIGGER AS $$
BEGIN
  -- Only set user_id if user is authenticated, leave NULL for anonymous bookings
  IF auth.uid() IS NOT NULL THEN
    NEW.user_id := auth.uid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if exists and create new one
DROP TRIGGER IF EXISTS assign_booking_user_id_trigger ON public.bookings;
CREATE TRIGGER assign_booking_user_id_trigger
  BEFORE INSERT ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.assign_booking_user_id_secure();