-- Server-side rate limiting for public XTSY AI and trip-verification Edge Functions.
-- Raw IP addresses are never stored; Edge Functions send a salted SHA-256 hash.

CREATE TABLE IF NOT EXISTS public.xtsy_ai_rate_limits (
  key_hash TEXT PRIMARY KEY CHECK (key_hash ~ '^[0-9a-f]{64}$'),
  window_started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  request_count INTEGER NOT NULL DEFAULT 0 CHECK (request_count >= 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.xtsy_ai_rate_limits ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.xtsy_ai_rate_limits FROM PUBLIC, anon, authenticated;
GRANT ALL ON TABLE public.xtsy_ai_rate_limits TO service_role;

CREATE OR REPLACE FUNCTION public.consume_xtsy_ai_rate_limit(
  p_key_hash TEXT,
  p_limit INTEGER DEFAULT 30,
  p_window_seconds INTEGER DEFAULT 3600
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_allowed BOOLEAN;
  v_limit INTEGER := GREATEST(1, LEAST(COALESCE(p_limit, 30), 500));
  v_window_seconds INTEGER := GREATEST(60, LEAST(COALESCE(p_window_seconds, 3600), 86400));
BEGIN
  IF p_key_hash IS NULL OR p_key_hash !~ '^[0-9a-f]{64}$' THEN
    RETURN FALSE;
  END IF;

  INSERT INTO public.xtsy_ai_rate_limits (
    key_hash,
    window_started_at,
    request_count,
    updated_at
  )
  VALUES (p_key_hash, now(), 1, now())
  ON CONFLICT (key_hash) DO UPDATE
  SET
    window_started_at = CASE
      WHEN public.xtsy_ai_rate_limits.window_started_at
        + make_interval(secs => v_window_seconds) <= now()
      THEN now()
      ELSE public.xtsy_ai_rate_limits.window_started_at
    END,
    request_count = CASE
      WHEN public.xtsy_ai_rate_limits.window_started_at
        + make_interval(secs => v_window_seconds) <= now()
      THEN 1
      ELSE public.xtsy_ai_rate_limits.request_count + 1
    END,
    updated_at = now()
  RETURNING request_count <= v_limit INTO v_allowed;

  RETURN COALESCE(v_allowed, FALSE);
END;
$$;

REVOKE ALL ON FUNCTION public.consume_xtsy_ai_rate_limit(TEXT, INTEGER, INTEGER)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.consume_xtsy_ai_rate_limit(TEXT, INTEGER, INTEGER)
  TO service_role;

COMMENT ON TABLE public.xtsy_ai_rate_limits IS
  'Stores hashed, per-scope request counters for XTSY public AI endpoints; raw IPs are not stored.';
