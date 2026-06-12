CREATE OR REPLACE FUNCTION public._tmp_grant_admin_amru()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES ('37859d34-f6e3-4ae5-afea-e85db65cbd8a'::uuid, 'admin'::public.app_role)
  ON CONFLICT (user_id, role) DO NOTHING;
END;
$$;