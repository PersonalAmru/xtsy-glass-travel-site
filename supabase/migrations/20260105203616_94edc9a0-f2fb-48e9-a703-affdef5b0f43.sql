-- =====================================================
-- COMPREHENSIVE RLS FIX FOR PAGE LOAD BLOCKING ISSUES
-- Fix all tables that need public anonymous read access
-- =====================================================

-- 1. ROOM_INVENTORY - Required for availability calendar
DROP POLICY IF EXISTS "room_inventory_anon_read" ON public.room_inventory;
DROP POLICY IF EXISTS "Allow authenticated users to read inventory" ON public.room_inventory;
DROP POLICY IF EXISTS "room_inventory_public_read" ON public.room_inventory;

CREATE POLICY "room_inventory_public_read" 
ON public.room_inventory 
FOR SELECT 
TO anon, authenticated
USING (true);

-- 2. REVIEWS - Required for HeroSection ratings
DROP POLICY IF EXISTS "reviews_anon_read" ON public.reviews;
DROP POLICY IF EXISTS "reviews_public_read" ON public.reviews;
DROP POLICY IF EXISTS "Public can view reviews" ON public.reviews;

CREATE POLICY "reviews_public_read" 
ON public.reviews 
FOR SELECT 
TO anon, authenticated
USING (true);

-- 3. METRICS - Required for happy guests counter
DROP POLICY IF EXISTS "metrics_anon_read" ON public.metrics;
DROP POLICY IF EXISTS "metrics_public_read" ON public.metrics;
DROP POLICY IF EXISTS "Public can view metrics" ON public.metrics;

CREATE POLICY "metrics_public_read" 
ON public.metrics 
FOR SELECT 
TO anon, authenticated
USING (true);

-- 4. PROPERTIES - May be needed for property info display
DROP POLICY IF EXISTS "properties_anon_read" ON public.properties;
DROP POLICY IF EXISTS "properties_public_read" ON public.properties;

CREATE POLICY "properties_public_read" 
ON public.properties 
FOR SELECT 
TO anon, authenticated
USING (true);

-- 5. Ensure room_types policy exists (already created but verify)
DROP POLICY IF EXISTS "room_types_anon_read" ON public.room_types;

CREATE POLICY "room_types_anon_read" 
ON public.room_types 
FOR SELECT 
TO anon, authenticated
USING (true);

-- 6. BLOCKED_DATES - Required for availability display
DROP POLICY IF EXISTS "blocked_dates_anon_read" ON public.blocked_dates;
DROP POLICY IF EXISTS "blocked_dates_public_read" ON public.blocked_dates;

CREATE POLICY "blocked_dates_public_read" 
ON public.blocked_dates 
FOR SELECT 
TO anon, authenticated
USING (true);

-- 7. ITINERARIES - For travel section
DROP POLICY IF EXISTS "itineraries_anon_read" ON public.itineraries;
DROP POLICY IF EXISTS "itineraries_public_read" ON public.itineraries;

CREATE POLICY "itineraries_public_read" 
ON public.itineraries 
FOR SELECT 
TO anon, authenticated
USING (true);

-- 8. DESTINATIONS - For travel section
DROP POLICY IF EXISTS "destinations_anon_read" ON public.destinations;

CREATE POLICY "destinations_anon_read" 
ON public.destinations 
FOR SELECT 
TO anon, authenticated
USING (true);