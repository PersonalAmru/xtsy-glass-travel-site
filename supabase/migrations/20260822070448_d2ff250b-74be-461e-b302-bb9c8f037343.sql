REVOKE ALL ON FUNCTION public.bind_enquiry_user() FROM anon, authenticated, public;
REVOKE ALL ON FUNCTION public.throttle_enquiry_inserts() FROM anon, authenticated, public;