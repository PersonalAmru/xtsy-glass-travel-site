-- Re-secure RLS policies by removing permissive ones and restoring secure access
-- Blocked dates
DROP POLICY IF EXISTS "blocked_dates_admin_and_public_access" ON public.blocked_dates;
CREATE POLICY "blocked_dates_admin_full_access" ON public.blocked_dates
FOR ALL USING (((get_user_role() = ANY (ARRAY['admin','staff'])) OR (auth.role() = 'service_role')))
WITH CHECK (((get_user_role() = ANY (ARRAY['admin','staff'])) OR (auth.role() = 'service_role')));
-- Ensure public read-only exists
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='blocked_dates' AND policyname='blocked_dates_public_read_only'
  ) THEN
    CREATE POLICY "blocked_dates_public_read_only" ON public.blocked_dates FOR SELECT USING (true);
  END IF;
END $$;

-- Room types
DROP POLICY IF EXISTS "room_types_admin_and_public_access" ON public.room_types;
CREATE POLICY "room_types_admin_full_access" ON public.room_types
FOR ALL USING (((get_user_role() = ANY (ARRAY['admin','staff'])) OR (auth.role() = 'service_role')))
WITH CHECK (((get_user_role() = ANY (ARRAY['admin','staff'])) OR (auth.role() = 'service_role')));
-- public read-only already present by schema

-- Room inventory
DROP POLICY IF EXISTS "room_inventory_admin_and_public_access" ON public.room_inventory;
CREATE POLICY "room_inventory_admin_full_access" ON public.room_inventory
FOR ALL USING (((get_user_role() = ANY (ARRAY['admin','staff'])) OR (auth.role() = 'service_role')))
WITH CHECK (((get_user_role() = ANY (ARRAY['admin','staff'])) OR (auth.role() = 'service_role')));
-- public read-only already present by schema

-- Bookings
DROP POLICY IF EXISTS "bookings_admin_and_public_access" ON public.bookings;
DROP POLICY IF EXISTS "bookings_admin_update_access" ON public.bookings;
DROP POLICY IF EXISTS "bookings_admin_delete_access" ON public.bookings;
CREATE POLICY "bookings_admin_full_access" ON public.bookings
FOR ALL USING (((get_user_role() = ANY (ARRAY['admin','staff'])) OR (auth.role() = 'service_role')))
WITH CHECK (((get_user_role() = ANY (ARRAY['admin','staff'])) OR (auth.role() = 'service_role')));