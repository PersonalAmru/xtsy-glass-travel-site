-- 1. traffic_sessions: allow anonymous/authenticated visitor telemetry
GRANT INSERT, UPDATE ON public.traffic_sessions TO anon, authenticated;
GRANT ALL ON public.traffic_sessions TO service_role;

DROP POLICY IF EXISTS "Visitors can update their recent session" ON public.traffic_sessions;
CREATE POLICY "Visitors can update their recent session"
ON public.traffic_sessions
FOR UPDATE
TO anon, authenticated
USING (created_at > now() - interval '24 hours')
WITH CHECK (created_at > now() - interval '24 hours');

-- 2. traffic_defense_logs: allow client-side defense logging
GRANT INSERT ON public.traffic_defense_logs TO anon, authenticated;
GRANT ALL ON public.traffic_defense_logs TO service_role;

DROP POLICY IF EXISTS "Visitors can insert defense logs" ON public.traffic_defense_logs;
CREATE POLICY "Visitors can insert defense logs"
ON public.traffic_defense_logs
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 3. traffic_visitor_history: keep table private, expose only the visit counter
GRANT ALL ON public.traffic_visitor_history TO service_role;

CREATE OR REPLACE FUNCTION public.get_visitor_session_count(_visitor_id text)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT total_sessions FROM public.traffic_visitor_history WHERE visitor_id = _visitor_id),
    0
  );
$$;

GRANT EXECUTE ON FUNCTION public.get_visitor_session_count(text) TO anon, authenticated, service_role;

-- 4. seo_redirects: public read of active redirects (policy already exists)
GRANT SELECT ON public.seo_redirects TO anon;
GRANT ALL ON public.seo_redirects TO service_role;