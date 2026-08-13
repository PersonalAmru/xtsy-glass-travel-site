-- Harden guest enquiry creation: bind identity server-side, validate input,
-- and throttle anonymous submissions.

CREATE OR REPLACE FUNCTION public.create_enquiry(
  p_guest_name TEXT,
  p_email TEXT,
  p_phone TEXT,
  p_check_in TEXT,
  p_check_out TEXT,
  p_room_type TEXT,
  p_room_name TEXT,
  p_quantity INTEGER,
  p_nights INTEGER,
  p_rate_per_night NUMERIC,
  p_subtotal NUMERIC,
  p_gst_rate NUMERIC,
  p_gst_amount NUMERIC,
  p_total_amount NUMERIC,
  p_address TEXT DEFAULT NULL,
  p_city TEXT DEFAULT NULL,
  p_state TEXT DEFAULT NULL,
  p_pincode TEXT DEFAULT NULL,
  p_special_requests TEXT DEFAULT NULL,
  p_user_id UUID DEFAULT NULL
)
RETURNS TABLE(enquiry_id TEXT, enquiry_uuid UUID)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_counter INTEGER;
  v_enquiry_id TEXT;
  v_enquiry_uuid UUID;
  v_user_id UUID;
  v_check_in DATE;
  v_check_out DATE;
  v_name TEXT;
  v_email TEXT;
  v_phone TEXT;
  v_nights INTEGER;
  v_subtotal NUMERIC;
  v_gst_amount NUMERIC;
  v_total NUMERIC;
  v_recent INTEGER;
BEGIN
  -- 1. Identity binding: never trust a client-supplied user id.
  v_user_id := auth.uid();

  -- 2. Normalise + validate the guest fields.
  v_name  := btrim(COALESCE(p_guest_name, ''));
  v_email := lower(btrim(COALESCE(p_email, '')));
  v_phone := regexp_replace(COALESCE(p_phone, ''), '[^0-9+]', '', 'g');

  IF length(v_name) < 2 OR length(v_name) > 120 THEN
    RAISE EXCEPTION 'Invalid guest name';
  END IF;
  IF v_email !~ '^[^@\s]+@[^@\s]+\.[a-z]{2,}$' OR length(v_email) > 254 THEN
    RAISE EXCEPTION 'Invalid email address';
  END IF;
  IF length(v_phone) < 8 OR length(v_phone) > 16 THEN
    RAISE EXCEPTION 'Invalid phone number';
  END IF;
  IF length(COALESCE(p_special_requests, '')) > 2000 THEN
    RAISE EXCEPTION 'Special requests too long';
  END IF;

  -- 3. Validate stay dates.
  BEGIN
    v_check_in  := p_check_in::DATE;
    v_check_out := p_check_out::DATE;
  EXCEPTION WHEN others THEN
    RAISE EXCEPTION 'Invalid check-in / check-out date';
  END;

  IF v_check_in < (CURRENT_DATE - INTERVAL '1 day') THEN
    RAISE EXCEPTION 'Check-in date cannot be in the past';
  END IF;
  IF v_check_out <= v_check_in THEN
    RAISE EXCEPTION 'Check-out must be after check-in';
  END IF;
  IF v_check_in > (CURRENT_DATE + INTERVAL '18 months') THEN
    RAISE EXCEPTION 'Check-in date too far in the future';
  END IF;

  v_nights := GREATEST(1, (v_check_out - v_check_in));
  IF v_nights > 60 THEN
    RAISE EXCEPTION 'Stay length exceeds the 60-night maximum';
  END IF;

  IF COALESCE(p_quantity, 0) < 1 OR p_quantity > 30 THEN
    RAISE EXCEPTION 'Invalid room / bed quantity';
  END IF;
  IF COALESCE(p_rate_per_night, -1) < 0 OR p_rate_per_night > 200000 THEN
    RAISE EXCEPTION 'Invalid nightly rate';
  END IF;
  IF COALESCE(p_gst_rate, -1) NOT IN (0, 5, 12, 18) THEN
    RAISE EXCEPTION 'Invalid GST rate';
  END IF;

  -- 4. Recompute money server-side; client totals are advisory only.
  v_subtotal   := ROUND(p_rate_per_night * p_quantity * v_nights, 2);
  v_gst_amount := ROUND(v_subtotal * p_gst_rate / 100.0, 2);
  v_total      := ROUND(v_subtotal + v_gst_amount, 2);

  -- 5. Throttle: cap enquiries per contact identity (and per signed-in user).
  SELECT COUNT(*) INTO v_recent
  FROM enquiries
  WHERE created_at > now() - INTERVAL '1 hour'
    AND (
      email = v_email
      OR phone = v_phone
      OR (v_user_id IS NOT NULL AND user_id = v_user_id)
    );

  IF v_recent >= 5 THEN
    RAISE EXCEPTION 'Too many enquiries submitted recently. Please try again later or contact us directly.';
  END IF;

  -- 6. Allocate reference id.
  UPDATE invoice_counter
  SET counter = counter + 1, updated_at = now()
  WHERE prefix = 'XTH-ENQ-'
  RETURNING counter INTO v_counter;

  IF v_counter IS NULL THEN
    INSERT INTO invoice_counter (prefix, counter) VALUES ('XTH-ENQ-', 1)
    RETURNING counter INTO v_counter;
  END IF;

  v_enquiry_id := 'XTH-ENQ-' || LPAD(v_counter::text, 3, '0');
  v_enquiry_uuid := gen_random_uuid();

  INSERT INTO enquiries (
    id, enquiry_id, guest_name, email, phone,
    check_in, check_out, room_type, room_name,
    quantity, nights, rate_per_night, subtotal,
    gst_rate, gst_amount, total_amount,
    guest_address, guest_city, guest_state, guest_pincode,
    special_requests, user_id, status
  ) VALUES (
    v_enquiry_uuid, v_enquiry_id, v_name, v_email, v_phone,
    v_check_in, v_check_out, p_room_type, p_room_name,
    p_quantity, v_nights, p_rate_per_night, v_subtotal,
    p_gst_rate, v_gst_amount, v_total,
    p_address, p_city, p_state, p_pincode,
    NULLIF(btrim(COALESCE(p_special_requests, '')), ''), v_user_id, 'pending'
  );

  RETURN QUERY SELECT v_enquiry_id, v_enquiry_uuid;
END;
$$;

REVOKE ALL ON FUNCTION public.create_enquiry(TEXT,TEXT,TEXT,TEXT,TEXT,TEXT,TEXT,INTEGER,INTEGER,NUMERIC,NUMERIC,NUMERIC,NUMERIC,NUMERIC,TEXT,TEXT,TEXT,TEXT,TEXT,UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_enquiry(TEXT,TEXT,TEXT,TEXT,TEXT,TEXT,TEXT,INTEGER,INTEGER,NUMERIC,NUMERIC,NUMERIC,NUMERIC,NUMERIC,TEXT,TEXT,TEXT,TEXT,TEXT,UUID) TO anon, authenticated, service_role;

-- Direct-table inserts must also bind identity: a signed-in caller may only
-- create rows attributed to themselves; anonymous rows stay unattributed.
DROP POLICY IF EXISTS "Anon can insert enquiries" ON public.enquiries;
CREATE POLICY "Anon can insert enquiries"
  ON public.enquiries FOR INSERT TO anon
  WITH CHECK (status = 'pending' AND user_id IS NULL);

DROP POLICY IF EXISTS "Authenticated can insert enquiries" ON public.enquiries;
CREATE POLICY "Authenticated can insert enquiries"
  ON public.enquiries FOR INSERT TO authenticated
  WITH CHECK (status = 'pending' AND (user_id IS NULL OR user_id = auth.uid()));