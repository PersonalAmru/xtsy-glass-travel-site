-- FIX 1: Add search_path to functions missing it

ALTER FUNCTION public.calculate_onboarding_readiness(jsonb) SET search_path = 'public';
ALTER FUNCTION public.categorize_intent(integer) SET search_path = 'public';
ALTER FUNCTION public.categorize_traffic_quality(integer, integer, boolean) SET search_path = 'public';
ALTER FUNCTION public.classify_traffic_session(integer, integer, integer, integer) SET search_path = 'public';
ALTER FUNCTION public.cleanup_expired_otp() SET search_path = 'public';
ALTER FUNCTION public.compute_intent_score(integer, integer, integer, integer, text, integer) SET search_path = 'public';
ALTER FUNCTION public.resolve_room_type_id(text) SET search_path = 'public';
ALTER FUNCTION public.update_readiness_score() SET search_path = 'public';

-- FIX 2: Tighten RLS policies - restrict admin/system tables to authenticated users

DROP POLICY IF EXISTS "Notifications insert for all" ON public.admin_notifications;
CREATE POLICY "Notifications insert for authenticated" ON public.admin_notifications FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Notifications update for all" ON public.admin_notifications;
CREATE POLICY "Notifications update for authenticated" ON public.admin_notifications FOR UPDATE TO authenticated USING (true);

DROP POLICY IF EXISTS "System can insert security alerts" ON public.admin_security_alerts;
CREATE POLICY "System can insert security alerts" ON public.admin_security_alerts FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Invoices insert for all" ON public.booking_invoices;
CREATE POLICY "Invoices insert for authenticated" ON public.booking_invoices FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Invoices update for all" ON public.booking_invoices;
CREATE POLICY "Invoices update for authenticated" ON public.booking_invoices FOR UPDATE TO authenticated USING (true);

DROP POLICY IF EXISTS "Messages insert for all" ON public.booking_messages;
CREATE POLICY "Messages insert for authenticated" ON public.booking_messages FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Messages update for all" ON public.booking_messages;
CREATE POLICY "Messages update for authenticated" ON public.booking_messages FOR UPDATE TO authenticated USING (true);

DROP POLICY IF EXISTS "Admins can insert enquiries" ON public.enquiries;
CREATE POLICY "Authenticated can insert enquiries" ON public.enquiries FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Push subs insert for all" ON public.push_subscriptions;
CREATE POLICY "Push subs insert for authenticated" ON public.push_subscriptions FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Push subs update for all" ON public.push_subscriptions;
CREATE POLICY "Push subs update for authenticated" ON public.push_subscriptions FOR UPDATE TO authenticated USING (true);

DROP POLICY IF EXISTS "Push subs delete for all" ON public.push_subscriptions;
CREATE POLICY "Push subs delete for authenticated" ON public.push_subscriptions FOR DELETE TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can log bulk operations" ON public.inventory_bulk_operations;
CREATE POLICY "Authenticated users can log bulk operations" ON public.inventory_bulk_operations FOR INSERT TO authenticated WITH CHECK (true);