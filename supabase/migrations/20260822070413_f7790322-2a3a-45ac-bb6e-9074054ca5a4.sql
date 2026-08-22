-- 1. catering_enquiries gets a user binding column
ALTER TABLE public.catering_enquiries ADD COLUMN IF NOT EXISTS user_id uuid;

-- 2. Bind the authenticated caller on insert (cannot be spoofed from the client)
CREATE OR REPLACE FUNCTION public.bind_enquiry_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.user_id := auth.uid();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS bind_user_tour_enquiries ON public.tour_enquiries;
CREATE TRIGGER bind_user_tour_enquiries
  BEFORE INSERT ON public.tour_enquiries
  FOR EACH ROW EXECUTE FUNCTION public.bind_enquiry_user();

DROP TRIGGER IF EXISTS bind_user_catering_enquiries ON public.catering_enquiries;
CREATE TRIGGER bind_user_catering_enquiries
  BEFORE INSERT ON public.catering_enquiries
  FOR EACH ROW EXECUTE FUNCTION public.bind_enquiry_user();

-- 3. Per-email hourly insert throttle
CREATE OR REPLACE FUNCTION public.throttle_enquiry_inserts()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  recent integer;
BEGIN
  IF NEW.email IS NULL OR btrim(NEW.email) = '' THEN
    RETURN NEW;
  END IF;

  IF TG_TABLE_NAME = 'tour_enquiries' THEN
    SELECT count(*) INTO recent FROM public.tour_enquiries
      WHERE lower(email) = lower(NEW.email) AND created_at > now() - interval '1 hour';
  ELSE
    SELECT count(*) INTO recent FROM public.catering_enquiries
      WHERE lower(email) = lower(NEW.email) AND created_at > now() - interval '1 hour';
  END IF;

  IF recent >= 5 THEN
    RAISE EXCEPTION 'Too many enquiries submitted. Please try again later.'
      USING ERRCODE = 'check_violation';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS throttle_tour_enquiries ON public.tour_enquiries;
CREATE TRIGGER throttle_tour_enquiries
  BEFORE INSERT ON public.tour_enquiries
  FOR EACH ROW EXECUTE FUNCTION public.throttle_enquiry_inserts();

DROP TRIGGER IF EXISTS throttle_catering_enquiries ON public.catering_enquiries;
CREATE TRIGGER throttle_catering_enquiries
  BEFORE INSERT ON public.catering_enquiries
  FOR EACH ROW EXECUTE FUNCTION public.throttle_enquiry_inserts();

-- 4. Policies now require the bound user to match the caller
DROP POLICY IF EXISTS "Allow anonymous tour enquiry inserts" ON public.tour_enquiries;
CREATE POLICY "tour_enquiries_guest_insert" ON public.tour_enquiries
  FOR INSERT TO anon, authenticated
  WITH CHECK (status = 'pending' AND user_id IS NOT DISTINCT FROM auth.uid());

DROP POLICY IF EXISTS "catering_enquiries_public_insert" ON public.catering_enquiries;
CREATE POLICY "catering_enquiries_guest_insert" ON public.catering_enquiries
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    status = 'new'
    AND char_length(full_name) BETWEEN 1 AND 120
    AND user_id IS NOT DISTINCT FROM auth.uid()
  );