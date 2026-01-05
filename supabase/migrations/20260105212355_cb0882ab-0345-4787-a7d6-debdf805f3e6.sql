-- Fix function search_path for is_admin_email
CREATE OR REPLACE FUNCTION public.is_admin_email(user_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  RETURN user_email = 'xtsy.social@gmail.com';
END;
$$;