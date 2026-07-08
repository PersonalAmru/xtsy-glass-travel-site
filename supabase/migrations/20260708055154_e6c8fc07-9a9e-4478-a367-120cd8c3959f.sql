-- 1. Drop the leftover test/probe table (resolves RLS-disabled findings)
DROP TABLE IF EXISTS public._grant_probe;

-- 2. Restrict property_inventory_settings reads to admin/staff only
DROP POLICY IF EXISTS "Authenticated users can view property inventory settings" ON public.property_inventory_settings;

CREATE POLICY "Admin staff can view property inventory settings"
ON public.property_inventory_settings
FOR SELECT
TO authenticated
USING (public.is_admin_or_staff());