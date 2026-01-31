-- Update prices for hostel rooms
UPDATE room_types SET base_price = 400 WHERE id = '4-bed-female-only-dorm';
UPDATE room_types SET base_price = 500 WHERE id = '4-bed-mixed-female-dorm';
UPDATE room_types SET base_price = 350 WHERE id = '6-bed-mixed-female-dorm';
UPDATE room_types SET base_price = 400 WHERE id = '6-bed-mixed-dorm';
UPDATE room_types SET base_price = 1800 WHERE id = 'king-double-room';

-- Convert 8-bed economy dorm to hostel 8-bed dorm with new id
UPDATE room_types 
SET id = '8-bed-mixed-dorm', 
    base_price = 300, 
    category = 'Hostel', 
    kind = 'hostel',
    name = 'Bed in 8-Bed Mixed Dormitory'
WHERE id = '8-bed-mixed-economy-dorm';

-- Delete obsolete room types
DELETE FROM room_types WHERE id IN ('6-bed-mixed-economy-dorm', 'king-triple-room');