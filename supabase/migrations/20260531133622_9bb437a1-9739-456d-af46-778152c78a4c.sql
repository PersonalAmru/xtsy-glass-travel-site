-- =============================================================
-- 1. SECURITY: enforce status = 'pending' on public enquiry inserts
--    Prevents anonymous callers from self-approving via status='approved'.
--    SECURITY DEFINER RPCs (create_enquiry) bypass RLS and are unaffected.
-- =============================================================
DROP POLICY IF EXISTS "Anon can insert enquiries" ON public.enquiries;
CREATE POLICY "Anon can insert enquiries"
  ON public.enquiries FOR INSERT TO anon
  WITH CHECK (status = 'pending');

DROP POLICY IF EXISTS "Authenticated can insert enquiries" ON public.enquiries;
CREATE POLICY "Authenticated can insert enquiries"
  ON public.enquiries FOR INSERT TO authenticated
  WITH CHECK (status = 'pending');

DROP POLICY IF EXISTS "Allow anonymous tour enquiry inserts" ON public.tour_enquiries;
CREATE POLICY "Allow anonymous tour enquiry inserts"
  ON public.tour_enquiries FOR INSERT TO anon, authenticated
  WITH CHECK (status = 'pending');

-- =============================================================
-- 2. SECURITY: restrict review-media uploads to a 'pending/' prefix
--    so anonymous uploads land in a moderation folder only.
-- =============================================================
DROP POLICY IF EXISTS "review_media_public_upload" ON storage.objects;
CREATE POLICY "review_media_public_upload"
  ON storage.objects FOR INSERT TO anon, authenticated
  WITH CHECK (
    bucket_id = 'review-media'
    AND (storage.foldername(name))[1] = 'pending'
  );

-- Enforce image-only uploads and a size cap at the bucket level.
UPDATE storage.buckets
SET file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg','image/png','image/webp','image/heic','image/heif']
WHERE id = 'review-media';

-- =============================================================
-- 3. Admin notifications for EVERY enquiry type (tour + catering).
--    Stay bookings already notify; this extends coverage so the
--    Enquiry Review panel + bell react to all submissions.
-- =============================================================
CREATE OR REPLACE FUNCTION public.notify_admin_new_tour_enquiry()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.admin_notifications (type, title, message, metadata)
  VALUES (
    'enquiry',
    'New tour enquiry',
    COALESCE(NEW.guest_name, 'A guest') || ' enquired about ' || COALESCE(NEW.package_title, 'a tour package'),
    jsonb_build_object(
      'category', 'tour',
      'ref_id', NEW.enquiry_id,
      'enquiry_uuid', NEW.id,
      'phone', NEW.whatsapp_number,
      'email', NEW.email
    )
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_admin_new_tour_enquiry ON public.tour_enquiries;
CREATE TRIGGER trg_notify_admin_new_tour_enquiry
  AFTER INSERT ON public.tour_enquiries
  FOR EACH ROW EXECUTE FUNCTION public.notify_admin_new_tour_enquiry();

CREATE OR REPLACE FUNCTION public.notify_admin_new_catering_enquiry()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.admin_notifications (type, title, message, metadata)
  VALUES (
    'enquiry',
    'New catering enquiry',
    COALESCE(NEW.full_name, 'A guest') || ' requested ' || COALESCE(NEW.event_type, 'catering / event'),
    jsonb_build_object(
      'category', 'catering',
      'enquiry_uuid', NEW.id,
      'phone', NEW.phone,
      'email', NEW.email,
      'event_date', NEW.event_date,
      'guest_count', NEW.guest_count
    )
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_admin_new_catering_enquiry ON public.catering_enquiries;
CREATE TRIGGER trg_notify_admin_new_catering_enquiry
  AFTER INSERT ON public.catering_enquiries
  FOR EACH ROW EXECUTE FUNCTION public.notify_admin_new_catering_enquiry();