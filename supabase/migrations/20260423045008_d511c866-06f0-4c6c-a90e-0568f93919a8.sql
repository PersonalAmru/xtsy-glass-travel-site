-- Search analytics: capture on-site search queries from all pages
CREATE TABLE IF NOT EXISTS public.search_queries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  query TEXT NOT NULL,
  query_normalized TEXT GENERATED ALWAYS AS (lower(trim(query))) STORED,
  source TEXT,                          -- 'header_overlay' | 'hero_hint_bar' | 'mobile' | etc.
  page_path TEXT,                       -- where the search happened
  result_count INTEGER DEFAULT 0,
  zero_results BOOLEAN GENERATED ALWAYS AS (COALESCE(result_count,0) = 0) STORED,
  clicked_result_url TEXT,
  clicked_result_title TEXT,
  visitor_id TEXT,
  session_id TEXT,
  country_code TEXT,
  device_type TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for admin reporting
CREATE INDEX IF NOT EXISTS idx_search_queries_created_at ON public.search_queries (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_search_queries_normalized ON public.search_queries (query_normalized);
CREATE INDEX IF NOT EXISTS idx_search_queries_zero ON public.search_queries (zero_results) WHERE zero_results = true;
CREATE INDEX IF NOT EXISTS idx_search_queries_page_path ON public.search_queries (page_path);

-- Enable RLS
ALTER TABLE public.search_queries ENABLE ROW LEVEL SECURITY;

-- Anyone (including anon) can insert a search log
CREATE POLICY "Anyone can log a search query"
ON public.search_queries
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only admins can read
CREATE POLICY "Admins can read search queries"
ON public.search_queries
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Only admins can update
CREATE POLICY "Admins can update search queries"
ON public.search_queries
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete
CREATE POLICY "Admins can delete search queries"
ON public.search_queries
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));