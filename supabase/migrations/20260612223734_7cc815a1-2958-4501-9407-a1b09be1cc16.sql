GRANT ALL ON public.user_roles TO service_role;
GRANT ALL ON public.user_roles TO postgres;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_roles TO authenticated;