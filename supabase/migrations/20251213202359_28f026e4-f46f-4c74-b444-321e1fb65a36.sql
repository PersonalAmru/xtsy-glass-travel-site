-- Add helper function for incrementing traveller stats
CREATE OR REPLACE FUNCTION public.increment_traveller_stats(
  p_visitor_id TEXT,
  p_is_new_session BOOLEAN DEFAULT FALSE
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE public.traveller_profiles
  SET 
    total_pageviews = COALESCE(total_pageviews, 0) + 1,
    total_sessions = CASE WHEN p_is_new_session THEN COALESCE(total_sessions, 0) + 1 ELSE total_sessions END,
    updated_at = now()
  WHERE visitor_id = p_visitor_id;
END;
$$;

-- Create index on traveller_events for faster queries
CREATE INDEX IF NOT EXISTS idx_traveller_events_visitor_created 
ON public.traveller_events(visitor_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_traveller_events_type_created 
ON public.traveller_events(event_type, created_at DESC);

-- Create index on traveller_profiles for high intent queries
CREATE INDEX IF NOT EXISTS idx_traveller_profiles_intent 
ON public.traveller_profiles(booking_intent_score DESC) 
WHERE booking_intent_score >= 30;

CREATE INDEX IF NOT EXISTS idx_traveller_profiles_last_seen 
ON public.traveller_profiles(last_seen_at DESC);

-- Ensure geo_heatmap has proper unique constraint
DO $$ 
BEGIN
  -- Drop existing constraint if it exists with wrong columns
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'analytics_geo_heatmap_country_code_region_city_date_key'
  ) THEN
    ALTER TABLE public.analytics_geo_heatmap 
    DROP CONSTRAINT analytics_geo_heatmap_country_code_region_city_date_key;
  END IF;
END $$;

-- Create proper unique constraint for upserts
CREATE UNIQUE INDEX IF NOT EXISTS idx_geo_heatmap_country_date 
ON public.analytics_geo_heatmap(country_code, date);
