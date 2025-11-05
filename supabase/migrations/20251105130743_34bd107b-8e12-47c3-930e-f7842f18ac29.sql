-- Rename the 6-bed female dormitory room
UPDATE room_types 
SET name = 'Bed in 6-Bed Female Only Dormitory', updated_at = now()
WHERE name LIKE '%Female%' AND name LIKE '%Dorm%' AND capacity = 6;