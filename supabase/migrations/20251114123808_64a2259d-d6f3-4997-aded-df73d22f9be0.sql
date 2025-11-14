-- Fix search_path security warning for cleanup_expired_cache function
CREATE OR REPLACE FUNCTION cleanup_expired_cache()
RETURNS INTEGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.edge_function_cache
  WHERE expires_at < NOW();
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;

COMMENT ON FUNCTION cleanup_expired_cache() IS 'Run periodically to clean up expired cache entries';