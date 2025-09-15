-- Fix Function Search Path Mutable Linter Warning
-- All functions must have immutable search_path set for security

-- Update all existing functions to use secure search_path
CREATE OR REPLACE FUNCTION public.assign_booking_user_id_secure()
RETURNS TRIGGER AS $$
BEGIN
  -- Only set user_id if user is authenticated, leave NULL for anonymous bookings
  IF auth.uid() IS NOT NULL THEN
    NEW.user_id := auth.uid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Update other functions to have immutable search_path
CREATE OR REPLACE FUNCTION public.get_jwt_email()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT NULLIF((current_setting('request.jwt.claims', true))::json ->> 'email', '')::text;
$function$;

CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS text
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  user_role TEXT;
BEGIN
  -- First try to get role from profiles table
  SELECT role INTO user_role
  FROM public.profiles
  WHERE id = auth.uid();
  
  -- Fallback to user metadata if profile doesn't exist
  IF user_role IS NULL THEN
    user_role := COALESCE(
      (auth.jwt() -> 'user_metadata' ->> 'role')::text,
      'guest'
    );
  END IF;
  
  RETURN user_role;
END;
$function$;

CREATE OR REPLACE FUNCTION public.is_admin_or_staff()
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  RETURN get_user_role() IN ('admin', 'staff');
END;
$function$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SET search_path = public
AS $function$
  select coalesce( (auth.jwt() ->> 'app_role') = 'admin', false );
$function$;