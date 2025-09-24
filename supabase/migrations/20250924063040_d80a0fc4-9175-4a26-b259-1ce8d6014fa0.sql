-- Reset all room availability to default values
-- This will clear all admin blocks and inventory overrides

-- 1. Clear all blocked dates
DELETE FROM public.blocked_dates;

-- 2. Clear all room inventory overrides (availability will fall back to room_types.total_units)
DELETE FROM public.room_inventory;

-- 3. Reset room_types to consistent default values if needed
UPDATE public.room_types 
SET 
  total_units = CASE 
    WHEN name ILIKE '%8%bed%' THEN 8
    WHEN name ILIKE '%6%bed%' THEN 6  
    WHEN name ILIKE '%4%bed%' THEN 4
    WHEN name ILIKE '%270%' OR name ILIKE '%panorama%' THEN 1
    WHEN name ILIKE '%double%' THEN 2
    WHEN name ILIKE '%triple%' THEN 1
    ELSE 1
  END,
  is_active = true
WHERE id IS NOT NULL;