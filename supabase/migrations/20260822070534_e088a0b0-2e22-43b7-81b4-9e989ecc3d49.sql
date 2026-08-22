GRANT INSERT ON public.tour_enquiries TO anon, authenticated;
GRANT INSERT ON public.catering_enquiries TO anon, authenticated;
GRANT SELECT ON public.tour_enquiries TO authenticated;
GRANT SELECT ON public.catering_enquiries TO authenticated;
GRANT ALL ON public.tour_enquiries TO service_role;
GRANT ALL ON public.catering_enquiries TO service_role;