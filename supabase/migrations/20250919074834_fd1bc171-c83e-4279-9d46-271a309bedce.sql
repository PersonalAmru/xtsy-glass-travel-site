-- Update room types with new capacities
UPDATE public.room_types 
SET total_units = 24, updated_at = now()
WHERE name = '6 BED MIXED FEMALE DORM';

UPDATE public.room_types 
SET total_units = 6, updated_at = now()
WHERE name = '6 BED MIXED ECONOMY DORM';

UPDATE public.room_types 
SET total_units = 8, updated_at = now()
WHERE name = '8 BED MIXED ECONOMY DORM';

-- Clear existing room inventory
DELETE FROM public.room_inventory;

-- Generate room inventory for the next 365 days with new capacities
INSERT INTO public.room_inventory (room_type_id, date, available_count, last_updated)
SELECT 
  rt.id,
  generate_series(CURRENT_DATE, CURRENT_DATE + INTERVAL '365 days', '1 day')::date as date,
  rt.total_units,
  now()
FROM public.room_types rt
WHERE rt.is_active = true;