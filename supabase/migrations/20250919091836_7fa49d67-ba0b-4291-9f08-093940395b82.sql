-- Update room inventory to set 6 beds availability for the next 90 days for all room types
-- Clear existing inventory data
DELETE FROM public.room_inventory;

-- Insert 6 beds availability for each room type for the next 90 days
WITH date_series AS (
  SELECT generate_series(
    CURRENT_DATE, 
    CURRENT_DATE + INTERVAL '89 days', 
    '1 day'::interval
  )::date AS date
),
room_types_active AS (
  SELECT id FROM public.room_types WHERE is_active = true
)
INSERT INTO public.room_inventory (room_type_id, date, available_count, last_updated)
SELECT 
  rt.id,
  ds.date,
  6, -- Set 6 beds availability for all room types
  now()
FROM room_types_active rt
CROSS JOIN date_series ds;

-- Update room_types table to set total_units to 6 for dorm types
UPDATE public.room_types 
SET total_units = 6 
WHERE kind = 'dorm' OR category LIKE '%dorm%' OR name LIKE '%dorm%';

-- Update the specific room types mentioned in the booking flow
UPDATE public.room_types 
SET total_units = 6 
WHERE id IN (
  '4-bed-female-only-dorm',
  '4-bed-mixed-female-dorm', 
  '6-bed-mixed-female-dorm',
  '6-bed-mixed-dorm',
  '6-bed-mixed-economy-dorm',
  '8-bed-mixed-economy-dorm'
);