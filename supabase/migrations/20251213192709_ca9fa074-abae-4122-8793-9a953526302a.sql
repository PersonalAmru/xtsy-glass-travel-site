-- =====================================================
-- ADVANCED ANALYTICS SYSTEM - DATABASE SCHEMA
-- Google Analytics 360 + AdSense Intelligence Style
-- =====================================================

-- 1. Visitor Sessions (anonymous, GA360-like)
CREATE TABLE public.analytics_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL UNIQUE,
  visitor_id TEXT NOT NULL,
  country_code TEXT,
  region TEXT,
  city TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  device_type TEXT,
  browser TEXT,
  os TEXT,
  screen_width INTEGER,
  screen_height INTEGER,
  referrer_source TEXT,
  referrer_medium TEXT,
  referrer_url TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  landing_page TEXT,
  exit_page TEXT,
  started_at TIMESTAMPTZ DEFAULT now(),
  ended_at TIMESTAMPTZ,
  last_activity_at TIMESTAMPTZ DEFAULT now(),
  is_bounce BOOLEAN DEFAULT true,
  is_new_visitor BOOLEAN DEFAULT true,
  page_views INTEGER DEFAULT 0,
  events_count INTEGER DEFAULT 0,
  session_duration_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Page Views
CREATE TABLE public.analytics_pageviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  visitor_id TEXT NOT NULL,
  page_path TEXT NOT NULL,
  page_title TEXT,
  page_hash TEXT,
  referrer_path TEXT,
  time_on_page_seconds INTEGER DEFAULT 0,
  scroll_depth_percent INTEGER DEFAULT 0,
  is_entrance BOOLEAN DEFAULT false,
  is_exit BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. User Events (clicks, interactions)
CREATE TABLE public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  visitor_id TEXT NOT NULL,
  event_category TEXT NOT NULL,
  event_action TEXT NOT NULL,
  event_label TEXT,
  event_value NUMERIC,
  page_path TEXT,
  element_id TEXT,
  element_class TEXT,
  element_text TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Conversion Funnel Tracking
CREATE TABLE public.analytics_conversions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  visitor_id TEXT NOT NULL,
  funnel_name TEXT NOT NULL,
  funnel_step TEXT NOT NULL,
  step_order INTEGER DEFAULT 0,
  room_type TEXT,
  package_type TEXT,
  conversion_value NUMERIC DEFAULT 0,
  currency TEXT DEFAULT 'INR',
  is_completed BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Geographic Heatmap Data (aggregated daily)
CREATE TABLE public.analytics_geo_heatmap (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code TEXT NOT NULL,
  country_name TEXT,
  region TEXT,
  city TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  visitor_count INTEGER DEFAULT 0,
  session_count INTEGER DEFAULT 0,
  pageview_count INTEGER DEFAULT 0,
  booking_count INTEGER DEFAULT 0,
  revenue_total NUMERIC DEFAULT 0,
  avg_session_duration INTEGER DEFAULT 0,
  bounce_rate NUMERIC DEFAULT 0,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(country_code, region, city, date)
);

-- 6. Real-time Active Visitors (for live dashboard)
CREATE TABLE public.analytics_realtime (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL UNIQUE,
  visitor_id TEXT NOT NULL,
  page_path TEXT,
  country_code TEXT,
  device_type TEXT,
  last_seen_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Daily Aggregated Metrics (for trends)
CREATE TABLE public.analytics_daily_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL UNIQUE,
  total_visitors INTEGER DEFAULT 0,
  new_visitors INTEGER DEFAULT 0,
  returning_visitors INTEGER DEFAULT 0,
  total_sessions INTEGER DEFAULT 0,
  total_pageviews INTEGER DEFAULT 0,
  total_events INTEGER DEFAULT 0,
  total_conversions INTEGER DEFAULT 0,
  total_revenue NUMERIC DEFAULT 0,
  avg_session_duration INTEGER DEFAULT 0,
  bounce_rate NUMERIC DEFAULT 0,
  pages_per_session NUMERIC DEFAULT 0,
  top_pages JSONB DEFAULT '[]'::jsonb,
  top_referrers JSONB DEFAULT '[]'::jsonb,
  device_breakdown JSONB DEFAULT '{}'::jsonb,
  country_breakdown JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX idx_sessions_visitor_id ON public.analytics_sessions(visitor_id);
CREATE INDEX idx_sessions_started_at ON public.analytics_sessions(started_at DESC);
CREATE INDEX idx_sessions_country ON public.analytics_sessions(country_code);
CREATE INDEX idx_pageviews_session ON public.analytics_pageviews(session_id);
CREATE INDEX idx_pageviews_created ON public.analytics_pageviews(created_at DESC);
CREATE INDEX idx_pageviews_path ON public.analytics_pageviews(page_path);
CREATE INDEX idx_events_session ON public.analytics_events(session_id);
CREATE INDEX idx_events_category ON public.analytics_events(event_category);
CREATE INDEX idx_events_created ON public.analytics_events(created_at DESC);
CREATE INDEX idx_conversions_session ON public.analytics_conversions(session_id);
CREATE INDEX idx_conversions_funnel ON public.analytics_conversions(funnel_name, funnel_step);
CREATE INDEX idx_geo_heatmap_date ON public.analytics_geo_heatmap(date DESC);
CREATE INDEX idx_geo_heatmap_country ON public.analytics_geo_heatmap(country_code);
CREATE INDEX idx_realtime_last_seen ON public.analytics_realtime(last_seen_at DESC);
CREATE INDEX idx_daily_metrics_date ON public.analytics_daily_metrics(date DESC);

-- =====================================================
-- ENABLE ROW LEVEL SECURITY ON ALL TABLES
-- =====================================================

ALTER TABLE public.analytics_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_pageviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_geo_heatmap ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_realtime ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_daily_metrics ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- STRICT RLS POLICIES - SERVICE ROLE WRITE, ADMIN READ
-- =====================================================

-- Analytics Sessions
CREATE POLICY "analytics_sessions_service_role_all" ON public.analytics_sessions
  FOR ALL USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "analytics_sessions_admin_read" ON public.analytics_sessions
  FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "analytics_sessions_deny_public" ON public.analytics_sessions
  FOR ALL USING (false) WITH CHECK (false);

-- Analytics Pageviews
CREATE POLICY "analytics_pageviews_service_role_all" ON public.analytics_pageviews
  FOR ALL USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "analytics_pageviews_admin_read" ON public.analytics_pageviews
  FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "analytics_pageviews_deny_public" ON public.analytics_pageviews
  FOR ALL USING (false) WITH CHECK (false);

-- Analytics Events
CREATE POLICY "analytics_events_service_role_all" ON public.analytics_events
  FOR ALL USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "analytics_events_admin_read" ON public.analytics_events
  FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "analytics_events_deny_public" ON public.analytics_events
  FOR ALL USING (false) WITH CHECK (false);

-- Analytics Conversions
CREATE POLICY "analytics_conversions_service_role_all" ON public.analytics_conversions
  FOR ALL USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "analytics_conversions_admin_read" ON public.analytics_conversions
  FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "analytics_conversions_deny_public" ON public.analytics_conversions
  FOR ALL USING (false) WITH CHECK (false);

-- Analytics Geo Heatmap
CREATE POLICY "analytics_geo_heatmap_service_role_all" ON public.analytics_geo_heatmap
  FOR ALL USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "analytics_geo_heatmap_admin_read" ON public.analytics_geo_heatmap
  FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "analytics_geo_heatmap_deny_public" ON public.analytics_geo_heatmap
  FOR ALL USING (false) WITH CHECK (false);

-- Analytics Realtime
CREATE POLICY "analytics_realtime_service_role_all" ON public.analytics_realtime
  FOR ALL USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "analytics_realtime_admin_read" ON public.analytics_realtime
  FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "analytics_realtime_deny_public" ON public.analytics_realtime
  FOR ALL USING (false) WITH CHECK (false);

-- Analytics Daily Metrics
CREATE POLICY "analytics_daily_metrics_service_role_all" ON public.analytics_daily_metrics
  FOR ALL USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "analytics_daily_metrics_admin_read" ON public.analytics_daily_metrics
  FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "analytics_daily_metrics_deny_public" ON public.analytics_daily_metrics
  FOR ALL USING (false) WITH CHECK (false);

-- =====================================================
-- HELPER FUNCTIONS FOR ANALYTICS
-- =====================================================

-- Function to clean up old realtime entries (older than 5 minutes)
CREATE OR REPLACE FUNCTION public.cleanup_stale_realtime_visitors()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.analytics_realtime
  WHERE last_seen_at < NOW() - INTERVAL '5 minutes';
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;

-- Function to aggregate daily metrics
CREATE OR REPLACE FUNCTION public.aggregate_daily_analytics(target_date DATE DEFAULT CURRENT_DATE - 1)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  metrics RECORD;
BEGIN
  SELECT
    COUNT(DISTINCT visitor_id) as total_visitors,
    COUNT(DISTINCT CASE WHEN is_new_visitor THEN visitor_id END) as new_visitors,
    COUNT(DISTINCT CASE WHEN NOT is_new_visitor THEN visitor_id END) as returning_visitors,
    COUNT(*) as total_sessions,
    SUM(page_views) as total_pageviews,
    SUM(events_count) as total_events,
    AVG(session_duration_seconds)::INTEGER as avg_session_duration,
    (COUNT(CASE WHEN is_bounce THEN 1 END)::NUMERIC / NULLIF(COUNT(*), 0) * 100)::NUMERIC(5,2) as bounce_rate,
    (SUM(page_views)::NUMERIC / NULLIF(COUNT(*), 0))::NUMERIC(5,2) as pages_per_session
  INTO metrics
  FROM public.analytics_sessions
  WHERE DATE(started_at) = target_date;

  INSERT INTO public.analytics_daily_metrics (
    date, total_visitors, new_visitors, returning_visitors,
    total_sessions, total_pageviews, total_events,
    avg_session_duration, bounce_rate, pages_per_session
  ) VALUES (
    target_date, 
    COALESCE(metrics.total_visitors, 0),
    COALESCE(metrics.new_visitors, 0),
    COALESCE(metrics.returning_visitors, 0),
    COALESCE(metrics.total_sessions, 0),
    COALESCE(metrics.total_pageviews, 0),
    COALESCE(metrics.total_events, 0),
    COALESCE(metrics.avg_session_duration, 0),
    COALESCE(metrics.bounce_rate, 0),
    COALESCE(metrics.pages_per_session, 0)
  )
  ON CONFLICT (date) DO UPDATE SET
    total_visitors = EXCLUDED.total_visitors,
    new_visitors = EXCLUDED.new_visitors,
    returning_visitors = EXCLUDED.returning_visitors,
    total_sessions = EXCLUDED.total_sessions,
    total_pageviews = EXCLUDED.total_pageviews,
    total_events = EXCLUDED.total_events,
    avg_session_duration = EXCLUDED.avg_session_duration,
    bounce_rate = EXCLUDED.bounce_rate,
    pages_per_session = EXCLUDED.pages_per_session,
    updated_at = NOW();

  RETURN TRUE;
END;
$$;

-- Function to get analytics dashboard data (admin only)
CREATE OR REPLACE FUNCTION public.get_analytics_overview(days_back INTEGER DEFAULT 30)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSONB;
BEGIN
  -- Check admin access
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Admin access required';
  END IF;

  SELECT jsonb_build_object(
    'summary', (
      SELECT jsonb_build_object(
        'total_visitors', COUNT(DISTINCT visitor_id),
        'total_sessions', COUNT(*),
        'total_pageviews', SUM(page_views),
        'avg_session_duration', AVG(session_duration_seconds)::INTEGER,
        'bounce_rate', (COUNT(CASE WHEN is_bounce THEN 1 END)::NUMERIC / NULLIF(COUNT(*), 0) * 100)::NUMERIC(5,2),
        'new_visitor_rate', (COUNT(CASE WHEN is_new_visitor THEN 1 END)::NUMERIC / NULLIF(COUNT(*), 0) * 100)::NUMERIC(5,2)
      )
      FROM public.analytics_sessions
      WHERE started_at >= NOW() - (days_back || ' days')::INTERVAL
    ),
    'realtime', (
      SELECT jsonb_build_object(
        'active_visitors', COUNT(DISTINCT visitor_id)
      )
      FROM public.analytics_realtime
      WHERE last_seen_at >= NOW() - INTERVAL '5 minutes'
    ),
    'top_countries', (
      SELECT COALESCE(jsonb_agg(row_to_json(t)), '[]'::jsonb)
      FROM (
        SELECT country_code, COUNT(DISTINCT visitor_id) as visitors
        FROM public.analytics_sessions
        WHERE started_at >= NOW() - (days_back || ' days')::INTERVAL
          AND country_code IS NOT NULL
        GROUP BY country_code
        ORDER BY visitors DESC
        LIMIT 10
      ) t
    ),
    'top_pages', (
      SELECT COALESCE(jsonb_agg(row_to_json(t)), '[]'::jsonb)
      FROM (
        SELECT page_path, COUNT(*) as views
        FROM public.analytics_pageviews
        WHERE created_at >= NOW() - (days_back || ' days')::INTERVAL
        GROUP BY page_path
        ORDER BY views DESC
        LIMIT 10
      ) t
    ),
    'device_breakdown', (
      SELECT jsonb_build_object(
        'mobile', COUNT(CASE WHEN device_type = 'mobile' THEN 1 END),
        'desktop', COUNT(CASE WHEN device_type = 'desktop' THEN 1 END),
        'tablet', COUNT(CASE WHEN device_type = 'tablet' THEN 1 END)
      )
      FROM public.analytics_sessions
      WHERE started_at >= NOW() - (days_back || ' days')::INTERVAL
    )
  ) INTO result;

  RETURN result;
END;
$$;