DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'analytics_pageviews','analytics_events','analytics_conversions','analytics_sessions',
    'analytics_realtime','analytics_geo_heatmap','traveller_events','traveller_profiles','traffic_sessions'
  ] LOOP
    EXECUTE format('GRANT ALL ON public.%I TO service_role', t);
  END LOOP;
END $$;