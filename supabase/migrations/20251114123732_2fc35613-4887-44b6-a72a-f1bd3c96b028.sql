-- Create edge function cache table for persistent caching
CREATE TABLE IF NOT EXISTS public.edge_function_cache (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.edge_function_cache ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service role full access
CREATE POLICY "Service role can manage cache"
  ON public.edge_function_cache
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create index for faster expiration cleanup
CREATE INDEX IF NOT EXISTS idx_edge_cache_expires 
  ON public.edge_function_cache(expires_at);

-- Create function to auto-cleanup expired cache entries
CREATE OR REPLACE FUNCTION cleanup_expired_cache()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.edge_function_cache
  WHERE expires_at < NOW();
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Schedule cleanup (this would typically be done via pg_cron in production)
COMMENT ON FUNCTION cleanup_expired_cache() IS 'Run periodically to clean up expired cache entries';