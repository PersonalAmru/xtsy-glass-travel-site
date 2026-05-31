CREATE TABLE public.analytics_loader_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  tag text NOT NULL DEFAULT 'contentsquare',
  status text NOT NULL,
  block_reason text,
  consent_source text,
  analytics_consent boolean,
  attempts integer,
  duration_ms integer,
  source_url text,
  used_first_party boolean DEFAULT false,
  user_agent text,
  device_type text,
  browser text,
  online boolean,
  page_path text,
  error_message text
);

GRANT INSERT ON public.analytics_loader_events TO anon;
GRANT INSERT, SELECT ON public.analytics_loader_events TO authenticated;
GRANT ALL ON public.analytics_loader_events TO service_role;

ALTER TABLE public.analytics_loader_events ENABLE ROW LEVEL SECURITY;

-- Anyone may record a loader diagnostic event (insert-only, no read-back).
CREATE POLICY "Anyone can record loader events"
ON public.analytics_loader_events
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only admins can review recorded events.
CREATE POLICY "Admins can view loader events"
ON public.analytics_loader_events
FOR SELECT
TO authenticated
USING (public.is_admin());

CREATE INDEX idx_analytics_loader_events_created_at ON public.analytics_loader_events (created_at DESC);
CREATE INDEX idx_analytics_loader_events_status ON public.analytics_loader_events (status);