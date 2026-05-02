
-- 1. Fix booking_invoices service_role JWT spoofable check
DROP POLICY IF EXISTS "Admins can create invoices" ON public.booking_invoices;
CREATE POLICY "Admins can create invoices" ON public.booking_invoices
FOR INSERT
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role)
  OR auth.role() = 'service_role'
);

-- 2. Fix ota_availability_cache service_role JWT spoofable check
DROP POLICY IF EXISTS "Service role manages OTA cache" ON public.ota_availability_cache;
CREATE POLICY "Service role manages OTA cache" ON public.ota_availability_cache
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- 3. Restrict consent_records UPDATE to service_role only (header was spoofable)
DROP POLICY IF EXISTS "Visitors can update their own consent" ON public.consent_records;
CREATE POLICY "Service role manages consent updates" ON public.consent_records
FOR UPDATE
TO service_role
USING (true)
WITH CHECK (true);

-- 4. Realtime: restrict anon access entirely and tighten ELSE branch to deny by default
DROP POLICY IF EXISTS "realtime_sensitive_topic_select" ON realtime.messages;
DROP POLICY IF EXISTS "realtime_sensitive_topic_insert" ON realtime.messages;

-- Authenticated SELECT - explicit allowlist for public/sensitive topics
CREATE POLICY "realtime_authenticated_select" ON realtime.messages
FOR SELECT
TO authenticated
USING (
  CASE
    WHEN (realtime.topic() ~~ 'admin_notifications%'
       OR realtime.topic() ~~ 'admin_security_alerts%'
       OR realtime.topic() ~~ 'revenue_intelligence%'
       OR realtime.topic() ~~ 'traveller_profiles%'
       OR realtime.topic() ~~ 'bookings%'
       OR realtime.topic() ~~ 'booking_messages%')
      THEN (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'staff'::app_role))
    WHEN (realtime.topic() ~~ 'room_types%'
       OR realtime.topic() ~~ 'room_inventory%'
       OR realtime.topic() ~~ 'public:%'
       OR realtime.topic() ~~ 'presence:%')
      THEN true
    ELSE false
  END
);

CREATE POLICY "realtime_authenticated_insert" ON realtime.messages
FOR INSERT
TO authenticated
WITH CHECK (
  CASE
    WHEN (realtime.topic() ~~ 'admin_notifications%'
       OR realtime.topic() ~~ 'admin_security_alerts%'
       OR realtime.topic() ~~ 'revenue_intelligence%'
       OR realtime.topic() ~~ 'traveller_profiles%'
       OR realtime.topic() ~~ 'bookings%'
       OR realtime.topic() ~~ 'booking_messages%')
      THEN (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'staff'::app_role))
    WHEN (realtime.topic() ~~ 'room_types%'
       OR realtime.topic() ~~ 'room_inventory%'
       OR realtime.topic() ~~ 'public:%'
       OR realtime.topic() ~~ 'presence:%')
      THEN true
    ELSE false
  END
);

-- Anonymous users: deny all realtime access (no policies = denied with RLS on)
-- (no policies for anon role means anon cannot read/write realtime.messages)
