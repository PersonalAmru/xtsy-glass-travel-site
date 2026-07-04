GRANT sandbox_exec TO postgres;

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'analytics_pageviews','analytics_events','analytics_conversions','analytics_sessions',
    'analytics_realtime','analytics_geo_heatmap','traveller_events','traveller_profiles','traffic_sessions'
  ] LOOP
    EXECUTE format('ALTER TABLE public.%I OWNER TO postgres', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', t);
    EXECUTE format('GRANT ALL ON public.%I TO authenticated', t);
    EXECUTE format('GRANT SELECT, INSERT ON public.%I TO anon', t);
  END LOOP;
END $$;