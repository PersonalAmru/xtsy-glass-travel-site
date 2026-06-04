DROP POLICY IF EXISTS "xtsy bucket admin read" ON storage.objects;
DROP POLICY IF EXISTS "xtsy bucket admin insert" ON storage.objects;
DROP POLICY IF EXISTS "xtsy bucket admin update" ON storage.objects;
DROP POLICY IF EXISTS "xtsy bucket admin delete" ON storage.objects;
CREATE POLICY "xtsy bucket admin read" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'xtsy' AND public.is_admin());
CREATE POLICY "xtsy bucket admin insert" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'xtsy' AND public.is_admin());
CREATE POLICY "xtsy bucket admin update" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'xtsy' AND public.is_admin())
  WITH CHECK (bucket_id = 'xtsy' AND public.is_admin());
CREATE POLICY "xtsy bucket admin delete" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'xtsy' AND public.is_admin());