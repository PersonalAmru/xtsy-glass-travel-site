-- Add weekday and weekend pricing columns to room_types
ALTER TABLE room_types 
ADD COLUMN weekday_price integer,
ADD COLUMN weekend_price integer;

-- Update XTSY Luxury Room (270° Panorama Glass Ensuite) with differential pricing
UPDATE room_types 
SET 
  weekday_price = 7999,
  weekend_price = 9999,
  updated_at = now()
WHERE name = '270° Panorama Glass Ensuite' OR id = 'xtsy-270' OR id = 'signature-270-glass-suite';