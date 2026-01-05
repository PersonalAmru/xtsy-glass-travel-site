-- Update the existing booking to link it to the user
UPDATE public.bookings 
SET user_id = (SELECT id FROM auth.users WHERE email = 'xtsy.social@gmail.com' LIMIT 1)
WHERE booking_id = 'XTH-INV-001' AND user_id IS NULL;

-- Also try to link by email for any other bookings
UPDATE public.bookings 
SET user_id = (SELECT id FROM auth.users WHERE auth.users.email = bookings.email LIMIT 1)
WHERE user_id IS NULL;