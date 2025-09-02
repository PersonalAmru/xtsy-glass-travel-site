-- Fix remaining security issues: search_path for functions
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
BEGIN
  -- Return the user role from user_metadata safely
  RETURN COALESCE(
    (auth.jwt() -> 'user_metadata' ->> 'role')::text,
    'guest'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

CREATE OR REPLACE FUNCTION public.is_admin_or_staff()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN get_user_role() IN ('admin', 'staff');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;