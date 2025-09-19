-- Fix RLS policies for admin access to all tables
-- Update room_types policies to allow admin access
DROP POLICY IF EXISTS "room_types_admin_manage" ON room_types;
DROP POLICY IF EXISTS "room_types_public_read" ON room_types;

CREATE POLICY "room_types_admin_full_access" ON room_types
FOR ALL USING (
  get_user_role() IN ('admin', 'staff') OR auth.role() = 'service_role'
) WITH CHECK (
  get_user_role() IN ('admin', 'staff') OR auth.role() = 'service_role'
);

CREATE POLICY "room_types_public_read_only" ON room_types
FOR SELECT USING (true);

-- Update room_inventory policies
DROP POLICY IF EXISTS "room_inventory_admin_manage" ON room_inventory;
DROP POLICY IF EXISTS "room_inventory_public_read" ON room_inventory;

CREATE POLICY "room_inventory_admin_full_access" ON room_inventory
FOR ALL USING (
  get_user_role() IN ('admin', 'staff') OR auth.role() = 'service_role'
) WITH CHECK (
  get_user_role() IN ('admin', 'staff') OR auth.role() = 'service_role'
);

CREATE POLICY "room_inventory_public_read_only" ON room_inventory
FOR SELECT USING (true);

-- Update bookings policies for admin access
DROP POLICY IF EXISTS "bookings_admin_select_only" ON bookings;

CREATE POLICY "bookings_admin_full_access" ON bookings
FOR ALL USING (
  get_user_role() IN ('admin', 'staff') OR auth.role() = 'service_role'
) WITH CHECK (
  get_user_role() IN ('admin', 'staff') OR auth.role() = 'service_role'
);

-- Update blocked_dates policies
DROP POLICY IF EXISTS "admin_can_manage_blocked_dates" ON blocked_dates;
DROP POLICY IF EXISTS "service_role_manage_blocked_dates" ON blocked_dates;
DROP POLICY IF EXISTS "authenticated_can_read_blocked_dates" ON blocked_dates;

CREATE POLICY "blocked_dates_admin_full_access" ON blocked_dates
FOR ALL USING (
  get_user_role() IN ('admin', 'staff') OR auth.role() = 'service_role'
) WITH CHECK (
  get_user_role() IN ('admin', 'staff') OR auth.role() = 'service_role'
);

CREATE POLICY "blocked_dates_public_read_only" ON blocked_dates
FOR SELECT USING (true);

-- Update all room types to have 6 beds capacity
UPDATE room_types 
SET total_units = 6 
WHERE id IN (
  'xtsy-270',
  '4-bed-female-only-dorm',
  '4-bed-mixed-female-dorm', 
  '6-bed-mixed-female-dorm',
  '6-bed-mixed-dorm',
  'king-double-room',
  'king-triple-room',
  '6-bed-mixed-economy-dorm',
  '8-bed-mixed-economy-dorm'
);

-- Update room inventory to have 6 beds available for all dates
UPDATE room_inventory 
SET available_count = 6
WHERE date >= CURRENT_DATE;