-- ============================================================
-- MASTER RLS LOCKDOWN MIGRATION
-- ============================================================

-- 1. analytics_visitors_detailed
DROP POLICY IF EXISTS "Analytics data is admin only" ON public.analytics_visitors_detailed;
CREATE POLICY "Analytics data admin only"
  ON public.analytics_visitors_detailed FOR ALL TO authenticated
  USING (public.is_admin_or_staff());

-- 2. traffic_visitor_history
DROP POLICY IF EXISTS "Service role can manage visitor history" ON public.traffic_visitor_history;
CREATE POLICY "Service role manage visitor history"
  ON public.traffic_visitor_history FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- 3. admin_notifications
DROP POLICY IF EXISTS "Notifications insert for authenticated" ON public.admin_notifications;
DROP POLICY IF EXISTS "Notifications update for authenticated" ON public.admin_notifications;
CREATE POLICY "Admin staff insert notifications"
  ON public.admin_notifications FOR INSERT TO authenticated
  WITH CHECK (public.is_admin_or_staff());
CREATE POLICY "Admin staff update notifications"
  ON public.admin_notifications FOR UPDATE TO authenticated
  USING (public.is_admin_or_staff());

-- 4. admin_security_alerts
DROP POLICY IF EXISTS "System can insert security alerts" ON public.admin_security_alerts;
CREATE POLICY "Admin staff insert security alerts"
  ON public.admin_security_alerts FOR INSERT TO authenticated
  WITH CHECK (public.is_admin_or_staff());

-- 5. booking_invoices
DROP POLICY IF EXISTS "Invoices insert for authenticated" ON public.booking_invoices;
DROP POLICY IF EXISTS "Invoices update for authenticated" ON public.booking_invoices;
CREATE POLICY "Admin staff insert invoices"
  ON public.booking_invoices FOR INSERT TO authenticated
  WITH CHECK (public.is_admin_or_staff());
CREATE POLICY "Admin staff update invoices"
  ON public.booking_invoices FOR UPDATE TO authenticated
  USING (public.is_admin_or_staff());

-- 6. push_subscriptions (user_id is TEXT, cast auth.uid())
DROP POLICY IF EXISTS "Push subs insert for authenticated" ON public.push_subscriptions;
DROP POLICY IF EXISTS "Push subs update for authenticated" ON public.push_subscriptions;
DROP POLICY IF EXISTS "Push subs delete for authenticated" ON public.push_subscriptions;
DROP POLICY IF EXISTS "Push subs read for all" ON public.push_subscriptions;
CREATE POLICY "Users read own push subs"
  ON public.push_subscriptions FOR SELECT TO authenticated
  USING (auth.uid()::text = user_id);
CREATE POLICY "Users insert own push subs"
  ON public.push_subscriptions FOR INSERT TO authenticated
  WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users update own push subs"
  ON public.push_subscriptions FOR UPDATE TO authenticated
  USING (auth.uid()::text = user_id);
CREATE POLICY "Users delete own push subs"
  ON public.push_subscriptions FOR DELETE TO authenticated
  USING (auth.uid()::text = user_id);

-- 7. pricing_rules
DROP POLICY IF EXISTS "Admins can manage pricing_rules" ON public.pricing_rules;
CREATE POLICY "Admin staff manage pricing rules"
  ON public.pricing_rules FOR ALL TO authenticated
  USING (public.is_admin_or_staff()) WITH CHECK (public.is_admin_or_staff());
CREATE POLICY "Public can read pricing rules"
  ON public.pricing_rules FOR SELECT TO anon, authenticated
  USING (true);

-- 8. properties
DROP POLICY IF EXISTS "Admins can manage properties" ON public.properties;
CREATE POLICY "Admin staff manage properties"
  ON public.properties FOR ALL TO authenticated
  USING (public.is_admin_or_staff()) WITH CHECK (public.is_admin_or_staff());
CREATE POLICY "Public can read properties"
  ON public.properties FOR SELECT TO anon, authenticated
  USING (true);

-- 9. property_onboarding
DROP POLICY IF EXISTS "Admins can manage property_onboarding" ON public.property_onboarding;
CREATE POLICY "Admin staff manage property onboarding"
  ON public.property_onboarding FOR ALL TO authenticated
  USING (public.is_admin_or_staff()) WITH CHECK (public.is_admin_or_staff());

-- 10. property_room_types
DROP POLICY IF EXISTS "Admins can manage property_room_types" ON public.property_room_types;
CREATE POLICY "Admin staff manage property room types"
  ON public.property_room_types FOR ALL TO authenticated
  USING (public.is_admin_or_staff()) WITH CHECK (public.is_admin_or_staff());
CREATE POLICY "Public can read property room types"
  ON public.property_room_types FOR SELECT TO anon, authenticated
  USING (true);

-- 11. property_inventory_settings
DROP POLICY IF EXISTS "Authenticated users can manage property inventory settings" ON public.property_inventory_settings;
CREATE POLICY "Admin staff manage inventory settings"
  ON public.property_inventory_settings FOR ALL TO authenticated
  USING (public.is_admin_or_staff()) WITH CHECK (public.is_admin_or_staff());

-- 12. inventory_bulk_operations
DROP POLICY IF EXISTS "Authenticated users can log bulk operations" ON public.inventory_bulk_operations;
DROP POLICY IF EXISTS "Authenticated users can view bulk operations" ON public.inventory_bulk_operations;
CREATE POLICY "Admin staff manage bulk operations"
  ON public.inventory_bulk_operations FOR ALL TO authenticated
  USING (public.is_admin_or_staff()) WITH CHECK (public.is_admin_or_staff());

-- 13. traffic_page_events
DROP POLICY IF EXISTS "Admin can view all page events" ON public.traffic_page_events;
DROP POLICY IF EXISTS "Allow anonymous updates for page events" ON public.traffic_page_events;
CREATE POLICY "Admin view page events"
  ON public.traffic_page_events FOR SELECT TO authenticated
  USING (public.is_admin_or_staff());

-- 14. traffic_interaction_events
DROP POLICY IF EXISTS "Admin can view all interactions" ON public.traffic_interaction_events;
CREATE POLICY "Admin view interaction events"
  ON public.traffic_interaction_events FOR SELECT TO authenticated
  USING (public.is_admin_or_staff());

-- 15. traffic_validated_events
DROP POLICY IF EXISTS "Admin can view all validated events" ON public.traffic_validated_events;
CREATE POLICY "Admin view validated events"
  ON public.traffic_validated_events FOR SELECT TO authenticated
  USING (public.is_admin_or_staff());

-- 16. traffic_lead_events
DROP POLICY IF EXISTS "Admin can view all leads" ON public.traffic_lead_events;
CREATE POLICY "Admin view lead events"
  ON public.traffic_lead_events FOR SELECT TO authenticated
  USING (public.is_admin_or_staff());

-- 17. bot_detection_logs
DROP POLICY IF EXISTS "Admin can view all bot logs" ON public.bot_detection_logs;
CREATE POLICY "Admin view bot logs"
  ON public.bot_detection_logs FOR SELECT TO authenticated
  USING (public.is_admin_or_staff());

-- 18. consent_records
DROP POLICY IF EXISTS "Admin can view all consent" ON public.consent_records;
CREATE POLICY "Admin view consent records"
  ON public.consent_records FOR SELECT TO authenticated
  USING (public.is_admin_or_staff());

-- 19. dpdp_consents
DROP POLICY IF EXISTS "Public can view own consents" ON public.dpdp_consents;
CREATE POLICY "Admin view dpdp consents"
  ON public.dpdp_consents FOR SELECT TO authenticated
  USING (public.is_admin_or_staff());

-- 20. enquiries
DROP POLICY IF EXISTS "Allow viewing enquiries" ON public.enquiries;
CREATE POLICY "Owner or admin view enquiries"
  ON public.enquiries FOR SELECT TO authenticated
  USING (
    public.is_admin_or_staff()
    OR (user_id IS NOT NULL AND auth.uid() = user_id)
  );

-- 21. traffic_sessions
DROP POLICY IF EXISTS "Admin can view all sessions" ON public.traffic_sessions;
CREATE POLICY "Admin view traffic sessions"
  ON public.traffic_sessions FOR SELECT TO authenticated
  USING (public.is_admin_or_staff());