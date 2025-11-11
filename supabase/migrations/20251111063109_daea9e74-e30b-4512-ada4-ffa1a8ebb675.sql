-- Update base price for Bed in 4-Bed Mixed Dormitory to 800
UPDATE room_types 
SET base_price = 800, updated_at = now()
WHERE id = '4-bed-mixed-female-dorm' AND name = 'Bed in 4-Bed Mixed Dormitory';