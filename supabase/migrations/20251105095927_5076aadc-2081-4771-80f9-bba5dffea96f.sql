-- Clean up unused admin/auth infrastructure
-- Since no admin dashboard exists, remove all admin-related tables and functions

-- 1. Drop role assignment log table
DROP TABLE IF EXISTS public.role_assignment_log CASCADE;

-- 2. Drop user roles table
DROP TABLE IF EXISTS public.user_roles CASCADE;

-- 3. Drop app_role enum type
DROP TYPE IF EXISTS public.app_role CASCADE;

-- 4. Drop unused admin role functions
DROP FUNCTION IF EXISTS public.assign_user_role(UUID, public.app_role, TEXT) CASCADE;
DROP FUNCTION IF EXISTS public.has_role(UUID, public.app_role) CASCADE;
DROP FUNCTION IF EXISTS public.is_admin_or_staff_secure() CASCADE;

-- 5. Comment: Existing security functions like is_admin(), is_admin_or_staff(), 
--    and get_user_role() are kept because they're used in existing RLS policies
--    and may be needed for future admin functionality

COMMENT ON FUNCTION public.is_admin IS 'Reserved for future admin functionality';
COMMENT ON FUNCTION public.is_admin_or_staff IS 'Reserved for future admin functionality';
COMMENT ON FUNCTION public.get_user_role IS 'Reserved for future admin functionality';