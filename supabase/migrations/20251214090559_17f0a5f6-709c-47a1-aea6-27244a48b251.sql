-- Fix bookings table RLS policies
-- Remove redundant overly permissive service role policies that duplicate admin access

-- Drop the redundant service_role policies (admin_full_access already covers service_role)
DROP POLICY IF EXISTS "bookings_service_role_full" ON public.bookings;
DROP POLICY IF EXISTS "bookings_service_role_select" ON public.bookings;

-- Fix profiles table RLS policies  
-- Update admin policy to use has_role() for consistency and better security

-- Drop the old admin policy that uses is_admin()
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Create new admin policy using has_role() for consistency
CREATE POLICY "profiles_admin_view_all" 
ON public.profiles 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add admin update capability using has_role()
CREATE POLICY "profiles_admin_update_all" 
ON public.profiles 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));