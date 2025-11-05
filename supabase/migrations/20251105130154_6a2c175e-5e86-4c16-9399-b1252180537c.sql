-- Update King Double Room price to ₹2800
UPDATE room_types 
SET base_price = 2800, updated_at = now()
WHERE name = 'King Double Room';

-- Update King Triple Room price to ₹3200
UPDATE room_types 
SET base_price = 3200, updated_at = now()
WHERE name = 'King Triple Room';