-- Temporarily disable RLS to allow all operations
ALTER TABLE public.bookings DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Anyone can create bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can view bookings by email" ON public.bookings;
DROP POLICY IF EXISTS "Edge functions can update booking status" ON public.bookings;
DROP POLICY IF EXISTS "Service role can manage all bookings" ON public.bookings;

-- Create the simplest possible policies
CREATE POLICY "Allow all for anonymous" ON public.bookings FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for authenticated" ON public.bookings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for service_role" ON public.bookings FOR ALL TO service_role USING (true) WITH CHECK (true);