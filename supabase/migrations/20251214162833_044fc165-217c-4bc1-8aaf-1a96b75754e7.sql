-- Add explicit deny policies for public/anonymous access to profiles table
-- This hardens security by making deny rules explicit rather than implicit

-- Deny anonymous INSERT 
DROP POLICY IF EXISTS "profiles_deny_anonymous_insert" ON public.profiles;
CREATE POLICY "profiles_deny_anonymous_insert"
ON public.profiles
FOR INSERT
TO anon
WITH CHECK (false);

-- Deny anonymous SELECT
DROP POLICY IF EXISTS "profiles_deny_anonymous_select" ON public.profiles;
CREATE POLICY "profiles_deny_anonymous_select"
ON public.profiles
FOR SELECT
TO anon
USING (false);

-- Deny anonymous UPDATE
DROP POLICY IF EXISTS "profiles_deny_anonymous_update" ON public.profiles;
CREATE POLICY "profiles_deny_anonymous_update"
ON public.profiles
FOR UPDATE
TO anon
USING (false);

-- Deny anonymous DELETE
DROP POLICY IF EXISTS "profiles_deny_anonymous_delete" ON public.profiles;
CREATE POLICY "profiles_deny_anonymous_delete"
ON public.profiles
FOR DELETE
TO anon
USING (false);

-- Add comment documenting security posture
COMMENT ON TABLE public.profiles IS 'User profiles with strict RLS: users access own profile only, admins via has_role(), explicit deny for anonymous. Email masking implemented in application logging layer.';