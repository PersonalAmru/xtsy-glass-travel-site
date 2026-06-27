CREATE TABLE public.seo_position_snapshots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  run_id UUID NOT NULL,
  captured_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  database TEXT NOT NULL DEFAULT 'in',
  keyword TEXT NOT NULL,
  position INTEGER NOT NULL,
  previous_position INTEGER,
  delta INTEGER,
  volume INTEGER,
  cpc NUMERIC,
  url TEXT,
  traffic_pct NUMERIC,
  is_programmatic BOOLEAN NOT NULL DEFAULT false,
  is_striking_distance BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX idx_seo_pos_snap_keyword ON public.seo_position_snapshots (keyword, captured_at DESC);
CREATE INDEX idx_seo_pos_snap_run ON public.seo_position_snapshots (run_id);
CREATE INDEX idx_seo_pos_snap_captured ON public.seo_position_snapshots (captured_at DESC);

GRANT SELECT ON public.seo_position_snapshots TO authenticated;
GRANT ALL ON public.seo_position_snapshots TO service_role;

ALTER TABLE public.seo_position_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read position snapshots"
ON public.seo_position_snapshots
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));