-- Drop and recreate the public read policy with explicit anon role
DROP POLICY IF EXISTS "room_types_public_read_only" ON public.room_types;

CREATE POLICY "room_types_anon_read" 
ON public.room_types 
FOR SELECT 
TO anon, authenticated
USING (true);