-- Rename room type for 4-bed female dormitory to new label used across WhatsApp booking forms
UPDATE public.room_types
SET name = 'Bed in 4-Bed Female Dormitory'
WHERE name = 'Bed in 4-Bed Female Only Dormitory';