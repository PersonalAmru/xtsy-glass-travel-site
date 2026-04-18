-- SEO heroes bucket: public, cached for 1 year, used by generate-seo-hero edge function
INSERT INTO storage.buckets (id, name, public)
VALUES ('seo-heroes', 'seo-heroes', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Public read for everyone (these are SEO hero images by design)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Public read seo-heroes'
  ) THEN
    CREATE POLICY "Public read seo-heroes"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'seo-heroes');
  END IF;
END$$;

-- Service role can write (only the edge function uses service role)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Service role write seo-heroes'
  ) THEN
    CREATE POLICY "Service role write seo-heroes"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'seo-heroes' AND auth.role() = 'service_role');
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Service role update seo-heroes'
  ) THEN
    CREATE POLICY "Service role update seo-heroes"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'seo-heroes' AND auth.role() = 'service_role');
  END IF;
END$$;