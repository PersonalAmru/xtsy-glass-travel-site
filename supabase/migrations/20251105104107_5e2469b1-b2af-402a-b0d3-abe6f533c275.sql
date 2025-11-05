-- 1) Create roles enum
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'staff', 'user', 'guest');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 2) Create user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- 3) Role-check function (SECURITY DEFINER to avoid recursive RLS) - CREATE BEFORE POLICIES
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    WHERE ur.user_id = _user_id
      AND ur.role = _role
  );
$$;

-- 4) Enable RLS on user_roles table
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 5) Add RLS policies (after has_role function exists)
DO $$ BEGIN
  CREATE POLICY "user_roles_admin_manage_all"
  ON public.user_roles
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role) OR auth.role() = 'service_role')
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role) OR auth.role() = 'service_role');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "user_roles_users_can_read_own"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 6) Update helper functions to use has_role()
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin'::public.app_role);
$$;

CREATE OR REPLACE FUNCTION public.is_admin_or_staff()
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $fn$
BEGIN
  RETURN public.has_role(auth.uid(), 'admin'::public.app_role) OR public.has_role(auth.uid(), 'staff'::public.app_role);
END;
$fn$;

CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS text
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $fn$
BEGIN
  IF public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RETURN 'admin';
  ELSIF public.has_role(auth.uid(), 'staff'::public.app_role) THEN
    RETURN 'staff';
  ELSIF public.has_role(auth.uid(), 'user'::public.app_role) THEN
    RETURN 'user';
  ELSE
    RETURN 'guest';
  END IF;
END;
$fn$;

-- 7) Migrate existing roles from profiles.role into user_roles
INSERT INTO public.user_roles (user_id, role)
SELECT p.id,
  CASE 
    WHEN lower(p.role) IN ('admin','administrator') THEN 'admin'::public.app_role
    WHEN lower(p.role) IN ('staff','moderator') THEN 'staff'::public.app_role
    WHEN lower(p.role) = 'user' THEN 'user'::public.app_role
    ELSE NULL
  END AS role
FROM public.profiles p
WHERE p.role IS NOT NULL
  AND p.role <> ''
  AND (
    lower(p.role) IN ('admin','administrator','staff','moderator','user')
  )
ON CONFLICT DO NOTHING;

-- 8) Remove old trigger and role column from profiles to eliminate escalation vector
DO $$ BEGIN
  DROP TRIGGER IF EXISTS enforce_role_security ON public.profiles;
EXCEPTION WHEN undefined_object THEN NULL; END $$;

ALTER TABLE public.profiles DROP COLUMN IF EXISTS role;