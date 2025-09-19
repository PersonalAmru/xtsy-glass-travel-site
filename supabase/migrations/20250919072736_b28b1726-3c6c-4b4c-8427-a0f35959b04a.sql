-- Update room types with new capacities
UPDATE public.room_types 
SET total_units = 24 
WHERE name = '6 BED MIXED DORM (Female Friendly)';

-- Update room types for consistency (these should already exist but let's ensure proper data)
UPDATE public.room_types 
SET total_units = 6 
WHERE name = '6 BED MIXED ECONOMY DORM';

UPDATE public.room_types 
SET total_units = 8 
WHERE name = '8 BED MIXED ECONOMY DORM';

-- Clear existing room inventory to reset with new capacities
DELETE FROM public.room_inventory;

-- Function to populate room inventory for the next 365 days with full availability
DO $$
DECLARE
    room_type_rec RECORD;
    current_date_iter DATE;
BEGIN
    -- Loop through all active room types
    FOR room_type_rec IN 
        SELECT id, total_units FROM public.room_types WHERE is_active = true
    LOOP
        -- Set availability for next 365 days
        current_date_iter := CURRENT_DATE;
        FOR i IN 0..365 LOOP
            INSERT INTO public.room_inventory (room_type_id, date, available_count)
            VALUES (room_type_rec.id, current_date_iter + i, room_type_rec.total_units)
            ON CONFLICT (room_type_id, date) 
            DO UPDATE SET available_count = room_type_rec.total_units;
        END LOOP;
    END LOOP;
END $$;