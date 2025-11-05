-- ========================================
-- CRITICAL SECURITY FIX: Protect Profiles Role Column with Trigger
-- ========================================

-- 1. Drop unsafe UPDATE policies
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "profiles_users_update_own" ON public.profiles;

-- 2. Create basic UPDATE policy that allows users to update their profile
CREATE POLICY "profiles_users_can_update_own" ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- 3. Create trigger function to prevent role changes
CREATE OR REPLACE FUNCTION public.prevent_role_escalation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_admin_user BOOLEAN;
BEGIN
  -- Check if role is being changed
  IF OLD.role IS DISTINCT FROM NEW.role THEN
    -- Check if the user making the change is an admin
    SELECT EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role::TEXT = 'admin'
    ) INTO is_admin_user;
    
    -- If not admin, prevent the change
    IF NOT is_admin_user THEN
      RAISE EXCEPTION 'Only administrators can change user roles';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- 4. Attach trigger to profiles table
DROP TRIGGER IF EXISTS enforce_role_security ON public.profiles;
CREATE TRIGGER enforce_role_security
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_role_escalation();

-- 5. Add warning comment
COMMENT ON COLUMN public.profiles.role IS 'SECURITY: Protected by trigger. Only admins can modify roles.';

-- 6. Grant permissions for newsletter rate limiting
GRANT EXECUTE ON FUNCTION public.check_newsletter_rate_limit TO service_role;
GRANT EXECUTE ON FUNCTION public.check_newsletter_rate_limit TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_newsletter_rate_limit TO anon;