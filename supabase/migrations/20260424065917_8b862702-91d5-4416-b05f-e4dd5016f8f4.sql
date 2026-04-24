-- 1. Route performance metrics (RUM)
CREATE TABLE public.route_performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route TEXT NOT NULL,
  metric_date DATE NOT NULL DEFAULT CURRENT_DATE,
  lcp_ms INTEGER,
  inp_ms INTEGER,
  cls_score NUMERIC(5,3),
  ttfb_ms INTEGER,
  fcp_ms INTEGER,
  device_type TEXT,
  connection_type TEXT,
  deploy_version TEXT,
  skeleton_dismissed BOOLEAN,
  gtm_loaded BOOLEAN,
  seo_jsonld_size INTEGER,
  user_agent TEXT,
  visitor_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_route_perf_route_date ON public.route_performance_metrics(route, metric_date DESC);
CREATE INDEX idx_route_perf_created ON public.route_performance_metrics(created_at DESC);
CREATE INDEX idx_route_perf_deploy ON public.route_performance_metrics(deploy_version);

ALTER TABLE public.route_performance_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert RUM samples"
ON public.route_performance_metrics
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins/staff can view RUM data"
ON public.route_performance_metrics
FOR SELECT
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'));

-- 2. Sitemap health checks
CREATE TABLE public.sitemap_health_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sitemap_url TEXT NOT NULL,
  http_status INTEGER,
  response_time_ms INTEGER,
  url_count INTEGER,
  newest_lastmod DATE,
  oldest_lastmod DATE,
  is_valid_xml BOOLEAN,
  is_crawlable BOOLEAN,
  error_message TEXT,
  checked_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_sitemap_health_checked ON public.sitemap_health_checks(checked_at DESC);

ALTER TABLE public.sitemap_health_checks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins/staff can view sitemap health"
ON public.sitemap_health_checks
FOR SELECT
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'));

CREATE POLICY "Admins/staff can insert sitemap health"
ON public.sitemap_health_checks
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'));

-- 3. OTA availability cache
CREATE TABLE public.ota_availability_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_type_name TEXT NOT NULL,
  room_type_id UUID,
  cache_date DATE NOT NULL,
  available INTEGER NOT NULL DEFAULT 0,
  total INTEGER NOT NULL DEFAULT 0,
  is_sold_out BOOLEAN DEFAULT false,
  is_blocked BOOLEAN DEFAULT false,
  cached_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(room_type_name, cache_date)
);

CREATE INDEX idx_ota_cache_room_date ON public.ota_availability_cache(room_type_name, cache_date);
CREATE INDEX idx_ota_cache_cached_at ON public.ota_availability_cache(cached_at DESC);

ALTER TABLE public.ota_availability_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read OTA cache"
ON public.ota_availability_cache
FOR SELECT
USING (true);

CREATE POLICY "Service role manages OTA cache"
ON public.ota_availability_cache
FOR ALL
USING (auth.jwt() ->> 'role' = 'service_role')
WITH CHECK (auth.jwt() ->> 'role' = 'service_role');