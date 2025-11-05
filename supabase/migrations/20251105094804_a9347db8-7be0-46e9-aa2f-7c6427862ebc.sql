-- Phase 1: Create User Roles System
-- This prevents privilege escalation attacks by storing roles in a separate table

-- 1. Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'staff', 'guest');

-- 2. Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role public.app_role NOT NULL DEFAULT 'guest',
    assigned_by UUID REFERENCES auth.users(id),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (user_id, role)
);

-- 3. Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 4. Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 5. Create helper function to check if user is admin or staff
CREATE OR REPLACE FUNCTION public.is_admin_or_staff_secure()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role IN ('admin', 'staff')
  )
$$;

-- 6. RLS Policies for user_roles table
CREATE POLICY "user_roles_admin_full_access"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "user_roles_users_view_own"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "user_roles_service_role_full"
ON public.user_roles
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- 7. Create audit log for role assignments
CREATE TABLE public.role_assignment_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    role public.app_role NOT NULL,
    action TEXT NOT NULL CHECK (action IN ('assigned', 'revoked')),
    assigned_by UUID,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    notes TEXT
);

ALTER TABLE public.role_assignment_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "role_assignment_log_admin_only"
ON public.role_assignment_log
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 8. Create function to safely assign roles with audit logging
CREATE OR REPLACE FUNCTION public.assign_user_role(
    target_user_id UUID,
    new_role public.app_role,
    assignment_notes TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    result JSONB;
BEGIN
    -- Only admins can assign roles
    IF NOT public.has_role(auth.uid(), 'admin') THEN
        RAISE EXCEPTION 'Only administrators can assign roles';
    END IF;

    -- Insert role assignment
    INSERT INTO public.user_roles (user_id, role, assigned_by)
    VALUES (target_user_id, new_role, auth.uid())
    ON CONFLICT (user_id, role) DO NOTHING;

    -- Log the assignment
    INSERT INTO public.role_assignment_log (user_id, role, action, assigned_by, notes)
    VALUES (target_user_id, new_role, 'assigned', auth.uid(), assignment_notes);

    result := jsonb_build_object(
        'success', true,
        'user_id', target_user_id,
        'role', new_role,
        'assigned_by', auth.uid()
    );

    RETURN result;
END;
$$;

COMMENT ON FUNCTION public.assign_user_role IS 'Securely assign roles to users with audit logging. Only accessible to admins.';