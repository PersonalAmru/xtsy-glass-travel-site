-- Fix RLS policies with security definer functions instead of direct user_metadata access

-- Drop the problematic policies
DROP POLICY IF EXISTS "bookings_admin_access" ON public.bookings;
DROP POLICY IF EXISTS "transactions_admin_access" ON public.transactions;
DROP POLICY IF EXISTS "metrics_admin_write" ON public.metrics;
DROP POLICY IF EXISTS "metrics_admin_update" ON public.metrics;

-- Create secure function to check user role
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
BEGIN
  -- Return the user role from user_metadata safely
  RETURN COALESCE(
    (auth.jwt() -> 'user_metadata' ->> 'role')::text,
    'guest'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Create function to check if user is admin/staff
CREATE OR REPLACE FUNCTION public.is_admin_or_staff()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN get_user_role() IN ('admin', 'staff');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Recreate policies with secure functions
CREATE POLICY "bookings_admin_access" ON public.bookings FOR ALL 
USING (is_admin_or_staff());

CREATE POLICY "transactions_admin_access" ON public.transactions FOR ALL 
USING (is_admin_or_staff());

CREATE POLICY "metrics_admin_write" ON public.metrics FOR INSERT 
WITH CHECK (is_admin_or_staff());

CREATE POLICY "metrics_admin_update" ON public.metrics FOR UPDATE 
USING (is_admin_or_staff());

-- Now properly drop the whatsapp_logs table (if it still exists)
DROP TABLE IF EXISTS public.whatsapp_logs CASCADE;