-- Update room prices to match requirements
-- King Double Room: 2800 (already correct)
-- King Triple Room: 3200 -> 3500
-- XTSY 270: Remove weekend/weekday pricing, set flat 7999

UPDATE room_types 
SET base_price = 3500, updated_at = now()
WHERE id = 'king-triple-room';

UPDATE room_types 
SET 
  base_price = 7999,
  weekday_price = NULL,
  weekend_price = NULL,
  updated_at = now()
WHERE id = 'xtsy-270';