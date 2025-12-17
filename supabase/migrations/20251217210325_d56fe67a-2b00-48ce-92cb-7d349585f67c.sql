-- Remove unused booking-invoices storage bucket and its permissive policies
-- This bucket is not referenced anywhere in the application codebase

-- Drop permissive storage policies
DROP POLICY IF EXISTS "Anyone can upload booking invoices" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view booking invoices" ON storage.objects;

-- Delete the unused bucket
DELETE FROM storage.buckets WHERE id = 'booking-invoices';