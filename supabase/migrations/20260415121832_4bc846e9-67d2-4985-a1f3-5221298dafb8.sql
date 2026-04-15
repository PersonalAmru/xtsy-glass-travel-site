
-- ============================================
-- P0: LOCK DOWN ota_connections
-- ============================================
DROP POLICY IF EXISTS "Admins can manage ota_connections" ON public.ota_connections;

CREATE POLICY "Admin read ota_connections"
  ON public.ota_connections FOR SELECT
  TO authenticated
  USING (public.is_admin_or_staff());

CREATE POLICY "Admin insert ota_connections"
  ON public.ota_connections FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin_or_staff());

CREATE POLICY "Admin update ota_connections"
  ON public.ota_connections FOR UPDATE
  TO authenticated
  USING (public.is_admin_or_staff());

CREATE POLICY "Admin delete ota_connections"
  ON public.ota_connections FOR DELETE
  TO authenticated
  USING (public.is_admin_or_staff());

-- ============================================
-- P0: LOCK DOWN traffic_defense_logs
-- ============================================
DROP POLICY IF EXISTS "Service role can manage defense logs" ON public.traffic_defense_logs;

CREATE POLICY "Service role select defense logs"
  ON public.traffic_defense_logs FOR SELECT
  TO service_role
  USING (true);

CREATE POLICY "Service role insert defense logs"
  ON public.traffic_defense_logs FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role update defense logs"
  ON public.traffic_defense_logs FOR UPDATE
  TO service_role
  USING (true);

CREATE POLICY "Service role delete defense logs"
  ON public.traffic_defense_logs FOR DELETE
  TO service_role
  USING (true);

-- ============================================
-- P0: LOCK DOWN booking_messages
-- ============================================
DROP POLICY IF EXISTS "Messages read for all" ON public.booking_messages;
DROP POLICY IF EXISTS "Messages insert for authenticated" ON public.booking_messages;
DROP POLICY IF EXISTS "Messages update for authenticated" ON public.booking_messages;

CREATE POLICY "Admin or owner read booking messages"
  ON public.booking_messages FOR SELECT
  TO authenticated
  USING (
    public.is_admin_or_staff()
    OR EXISTS (
      SELECT 1 FROM public.bookings b
      WHERE b.id::text = booking_messages.booking_id
        AND b.email = (auth.jwt() ->> 'email')
    )
  );

CREATE POLICY "Admin or owner insert booking messages"
  ON public.booking_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    public.is_admin_or_staff()
    OR EXISTS (
      SELECT 1 FROM public.bookings b
      WHERE b.id::text = booking_id
        AND b.email = (auth.jwt() ->> 'email')
    )
  );

CREATE POLICY "Admin update booking messages"
  ON public.booking_messages FOR UPDATE
  TO authenticated
  USING (public.is_admin_or_staff());

-- ============================================
-- P2: Rate limiting trigger on traffic_sessions
-- ============================================
CREATE OR REPLACE FUNCTION public.check_traffic_session_rate_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  recent_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO recent_count
  FROM public.traffic_sessions
  WHERE visitor_id = NEW.visitor_id
    AND created_at > NOW() - INTERVAL '1 minute';

  IF recent_count >= 10 THEN
    RAISE EXCEPTION 'Rate limit exceeded: max 10 sessions per minute per visitor';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS traffic_sessions_rate_limit ON public.traffic_sessions;
CREATE TRIGGER traffic_sessions_rate_limit
  BEFORE INSERT ON public.traffic_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.check_traffic_session_rate_limit();

-- ============================================
-- P2: Automated data retention cleanup function
-- ============================================
CREATE OR REPLACE FUNCTION public.cleanup_old_traffic_data()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  sessions_deleted INTEGER;
  page_events_deleted INTEGER;
  interaction_events_deleted INTEGER;
  bot_logs_deleted INTEGER;
BEGIN
  DELETE FROM public.traffic_sessions
  WHERE created_at < NOW() - INTERVAL '90 days';
  GET DIAGNOSTICS sessions_deleted = ROW_COUNT;

  DELETE FROM public.traffic_page_events
  WHERE created_at < NOW() - INTERVAL '90 days';
  GET DIAGNOSTICS page_events_deleted = ROW_COUNT;

  DELETE FROM public.traffic_interaction_events
  WHERE created_at < NOW() - INTERVAL '90 days';
  GET DIAGNOSTICS interaction_events_deleted = ROW_COUNT;

  DELETE FROM public.bot_detection_logs
  WHERE created_at < NOW() - INTERVAL '60 days';
  GET DIAGNOSTICS bot_logs_deleted = ROW_COUNT;

  RETURN jsonb_build_object(
    'sessions_deleted', sessions_deleted,
    'page_events_deleted', page_events_deleted,
    'interaction_events_deleted', interaction_events_deleted,
    'bot_logs_deleted', bot_logs_deleted,
    'cleaned_at', NOW()
  );
END;
$$;
