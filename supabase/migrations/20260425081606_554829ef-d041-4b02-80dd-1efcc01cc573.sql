-- SEO redirect map (UI-managed 301s)
CREATE TABLE public.seo_redirects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source_path TEXT NOT NULL UNIQUE,
  target_path TEXT NOT NULL,
  status_code INTEGER NOT NULL DEFAULT 301,
  is_active BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  hit_count INTEGER NOT NULL DEFAULT 0,
  last_hit_at TIMESTAMPTZ,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT seo_redirects_status_check CHECK (status_code IN (301, 302, 307, 308, 410))
);

CREATE INDEX idx_seo_redirects_source ON public.seo_redirects(source_path) WHERE is_active = true;

ALTER TABLE public.seo_redirects ENABLE ROW LEVEL SECURITY;

-- Public can read active redirects (needed for SPA + edge function lookup)
CREATE POLICY "Active redirects are publicly readable"
  ON public.seo_redirects FOR SELECT
  USING (is_active = true);

-- Only admins can manage
CREATE POLICY "Admins manage redirects - insert"
  ON public.seo_redirects FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage redirects - update"
  ON public.seo_redirects FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage redirects - delete"
  ON public.seo_redirects FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins read all redirects"
  ON public.seo_redirects FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_seo_redirects_updated_at
  BEFORE UPDATE ON public.seo_redirects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Coverage tracking: GSC recovery URL status
CREATE TABLE public.seo_coverage_status (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  url_path TEXT NOT NULL UNIQUE,
  current_status TEXT NOT NULL DEFAULT 'unknown',
  http_status INTEGER,
  resolution_type TEXT,
  target_path TEXT,
  gsc_status TEXT,
  last_checked_at TIMESTAMPTZ,
  last_indexed_at TIMESTAMPTZ,
  last_crawl_requested_at TIMESTAMPTZ,
  crawl_request_count INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT seo_coverage_resolution_check CHECK (resolution_type IS NULL OR resolution_type IN ('live', 'redirect', 'place', 'route', 'gone', 'missing'))
);

CREATE INDEX idx_seo_coverage_status ON public.seo_coverage_status(current_status);

ALTER TABLE public.seo_coverage_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read coverage"
  ON public.seo_coverage_status FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins write coverage"
  ON public.seo_coverage_status FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_seo_coverage_updated_at
  BEFORE UPDATE ON public.seo_coverage_status
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Crawl request log (audit trail of IndexNow / GSC submissions)
CREATE TABLE public.seo_crawl_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  url_path TEXT NOT NULL,
  provider TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  response_code INTEGER,
  response_body TEXT,
  requested_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT seo_crawl_provider_check CHECK (provider IN ('indexnow', 'google_indexing_api', 'gsc_inspection_link', 'sitemap_ping'))
);

CREATE INDEX idx_seo_crawl_url ON public.seo_crawl_requests(url_path, created_at DESC);

ALTER TABLE public.seo_crawl_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read crawl log"
  ON public.seo_crawl_requests FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins insert crawl log"
  ON public.seo_crawl_requests FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));