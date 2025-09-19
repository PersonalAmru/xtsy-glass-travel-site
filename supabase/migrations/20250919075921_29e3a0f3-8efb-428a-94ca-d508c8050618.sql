-- Update RLS policies to allow admin access to room_types and room_inventory

-- Grant admin access to room_types table
DROP POLICY IF EXISTS "room_types_admin_manage" ON public.room_types;
CREATE POLICY "room_types_admin_manage" 
ON public.room_types 
FOR ALL 
TO authenticated
USING (is_admin_or_staff())
WITH CHECK (is_admin_or_staff());

-- Grant admin access to room_inventory table  
DROP POLICY IF EXISTS "room_inventory_admin_manage" ON public.room_inventory;
CREATE POLICY "room_inventory_admin_manage" 
ON public.room_inventory 
FOR ALL 
TO authenticated
USING (is_admin_or_staff())
WITH CHECK (is_admin_or_staff());