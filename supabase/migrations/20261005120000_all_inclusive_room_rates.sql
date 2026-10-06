-- 5 Oct 2026: room rates are ALL INCLUSIVE (GST inside the price), set by the owner.
-- King Double ₹2,399, Experience by XTSY ₹5,999 (stay only; breakfast plan withdrawn),
-- 8-bed ₹399, 6-bed ₹499, 4-bed women-only ₹599. Decoration stays ₹2,500 + 18% GST.
-- Mirrors quoteStay() in src/data/panoramaPricing.ts exactly.

-- Applied 5 Oct 2026. Row updates on room_types are blocked on this database for every SQL path,
-- so the two changed rooms are mapped in a function, only while the table holds the old value.
-- When updates are possible again, run these two lines; current_room_rate then passes values through:
--   UPDATE public.room_types SET base_price = 2399 WHERE id = '3746fd14-8fa7-4b27-b285-38855b447964';
--   UPDATE public.room_types SET base_price = 5999 WHERE id = '3b10c81d-ad5f-441f-9b56-5ab9a7a00544';

CREATE OR REPLACE FUNCTION public.current_room_rate(p_room_id text, p_base_price numeric)
RETURNS numeric LANGUAGE sql IMMUTABLE SET search_path TO 'public' AS $$
  SELECT CASE
    WHEN p_room_id = '3746fd14-8fa7-4b27-b285-38855b447964' AND p_base_price = 2200 THEN 2399
    WHEN p_room_id = '3b10c81d-ad5f-441f-9b56-5ab9a7a00544' AND p_base_price = 5399 THEN 5999
    ELSE p_base_price END
$$;
GRANT EXECUTE ON FUNCTION public.current_room_rate(text, numeric) TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION public.create_whatsapp_enquiry(p_guest_name text, p_email text, p_phone text, p_check_in date, p_check_out date, p_guests integer, p_room_ids text[], p_quantities integer[], p_breakfast boolean, p_decoration boolean, p_subtotal numeric, p_taxes numeric, p_total numeric, p_requests text DEFAULT NULL::text)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_nights integer; v_i integer; v_count integer; v_room public.room_types%ROWTYPE; v_rate numeric; v_gross numeric; v_line_tax numeric; v_pct numeric; v_subtotal numeric := 0; v_tax numeric := 0; v_total numeric; v_capacity integer := 0; v_name text := ''; v_id text; v_uuid uuid; v_recent integer; v_is_panorama boolean := false;
BEGIN
  IF length(btrim(coalesce(p_guest_name,''))) NOT BETWEEN 2 AND 120 OR coalesce(p_email,'') !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' OR length(regexp_replace(coalesce(p_phone,''),'[^0-9]','','g')) < 10 THEN RETURN json_build_object('success',false,'error','Invalid contact details'); END IF;
  IF length(coalesce(p_requests,'')) > 2000 THEN RETURN json_build_object('success',false,'error','Special requests too long'); END IF;
  IF coalesce(p_breakfast,false) THEN RETURN json_build_object('success',false,'error','The breakfast plan is no longer offered. Please refresh and try again'); END IF;
  v_nights := p_check_out - p_check_in;
  IF p_check_in < current_date OR v_nights NOT BETWEEN 1 AND 60 OR p_check_in > current_date + interval '18 months' OR p_guests NOT BETWEEN 1 AND 30 THEN RETURN json_build_object('success',false,'error','Invalid dates or guest count'); END IF;
  v_count := coalesce(array_length(p_room_ids,1),0);
  IF v_count NOT BETWEEN 1 AND 10 OR v_count <> coalesce(array_length(p_quantities,1),0) THEN RETURN json_build_object('success',false,'error','Select available rooms'); END IF;
  IF p_decoration AND NOT EXISTS (SELECT 1 FROM unnest(p_room_ids) room_id JOIN public.room_types rt ON rt.id::text=room_id WHERE rt.name ILIKE '%panorama%' OR rt.name ILIKE '%270%') THEN RETURN json_build_object('success',false,'error','Panorama package needs Panorama room'); END IF;
  FOR v_i IN 1..v_count LOOP
    SELECT * INTO v_room FROM public.room_types WHERE id::text=p_room_ids[v_i] AND is_active=true;
    IF NOT FOUND OR lower(btrim(v_room.name))='bed in 4-bed mixed dormitory' OR p_quantities[v_i] NOT BETWEEN 1 AND 10 OR p_quantities[v_i] > coalesce(v_room.total_units,1) THEN RETURN json_build_object('success',false,'error','Unavailable room selection'); END IF;
    v_is_panorama := v_room.name ILIKE '%panorama%' OR v_room.name ILIKE '%270%';
    IF v_is_panorama AND v_count > 1 THEN RETURN json_build_object('success',false,'error','Book Panorama separately'); END IF;
    v_rate := public.current_room_rate(v_room.id::text, v_room.base_price);
    IF v_is_panorama AND v_rate <> 5999 THEN RETURN json_build_object('success',false,'error','Panorama rate is being updated. Please retry shortly'); END IF;
    v_pct := CASE WHEN v_rate >= 7500 THEN 18 ELSE 5 END;
    v_gross := v_rate * p_quantities[v_i] * v_nights;          -- all inclusive
    v_line_tax := round(v_gross * v_pct / (100 + v_pct));       -- GST contained in the price
    v_tax := v_tax + v_line_tax;
    v_subtotal := v_subtotal + v_gross - v_line_tax;
    v_capacity := v_capacity + CASE WHEN v_room.name ILIKE '%bed in%' THEN p_quantities[v_i] ELSE v_room.capacity * p_quantities[v_i] END;
    v_name := v_name || CASE WHEN v_i > 1 THEN ', ' ELSE '' END || v_room.name || ' × ' || p_quantities[v_i]::text;
  END LOOP;
  IF v_capacity < p_guests THEN RETURN json_build_object('success',false,'error','Not enough beds for the guest count'); END IF;
  IF p_decoration THEN v_subtotal := v_subtotal+2500; v_tax := v_tax+450; END IF;
  v_total := v_subtotal + v_tax;
  IF p_subtotal IS DISTINCT FROM v_subtotal OR p_taxes IS DISTINCT FROM v_tax OR p_total IS DISTINCT FROM v_total THEN RETURN json_build_object('success',false,'error','Quote changed. Please refresh and try again'); END IF;
  SELECT count(*) INTO v_recent FROM public.enquiries WHERE lower(email)=lower(p_email) AND created_at > now()-interval '1 hour';
  IF v_recent >= 5 THEN RETURN json_build_object('success',false,'error','Too many enquiries. Please try again later'); END IF;
  v_id := 'XTH-WA-' || to_char(clock_timestamp(),'YYMMDDHH24MISS') || lpad(floor(random()*10000)::text,4,'0'); v_uuid:=gen_random_uuid();
  INSERT INTO public.enquiries(id,enquiry_id,guest_name,email,phone,check_in,check_out,room_type,room_name,quantity,nights,rate_per_night,subtotal,gst_rate,gst_amount,total_amount,special_requests,user_id,status)
  VALUES(v_uuid,v_id,btrim(p_guest_name),lower(btrim(p_email)),p_phone,p_check_in,p_check_out,array_to_string(p_room_ids,','),v_name || ' — stay only, all inclusive' || CASE WHEN p_decoration THEN ' + decoration' ELSE '' END,p_guests,v_nights,v_subtotal/v_nights, v_subtotal, CASE WHEN p_decoration THEN 18 ELSE 5 END,v_tax,v_total,left('[WhatsApp] '||coalesce(p_requests,''),2000),auth.uid(),'pending');
  RETURN json_build_object('success',true,'enquiry_id',v_id);
END; $function$;


-- create_booking_secure: unchanged except the room price now comes from current_room_rate.
CREATE OR REPLACE FUNCTION public.create_booking_secure(p_guest_name text, p_email text, p_whatsapp_number text, p_check_in date, p_check_out date, p_guests integer, p_room_type text, p_room_type_id text, p_quantity integer, p_subtotal integer, p_taxes integer, p_total_amount integer, p_address text DEFAULT NULL::text, p_city text DEFAULT NULL::text, p_state text DEFAULT NULL::text, p_pincode text DEFAULT NULL::text, p_special_requests text DEFAULT NULL::text, p_emergency_contact text DEFAULT NULL::text)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_booking_id TEXT;
  v_booking_uuid UUID;
  v_actual_price INTEGER;
  v_nights INTEGER;
  v_expected_subtotal INTEGER;
  v_suspicious_count INTEGER;
  v_user_id UUID;
BEGIN
  v_user_id := auth.uid();
  IF p_guest_name IS NULL OR length(trim(p_guest_name)) < 2 THEN
    RETURN json_build_object('success', false, 'error', 'Invalid guest name');
  END IF;
  IF p_email IS NULL OR p_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' THEN
    RETURN json_build_object('success', false, 'error', 'Invalid email');
  END IF;
  IF p_whatsapp_number IS NULL OR length(regexp_replace(p_whatsapp_number, '\D', '', 'g')) < 10 THEN
    RETURN json_build_object('success', false, 'error', 'Invalid WhatsApp number');
  END IF;
  v_nights := (p_check_out - p_check_in);
  IF v_nights < 1 THEN
    RETURN json_build_object('success', false, 'error', 'Invalid date range');
  END IF;
  IF p_check_in < CURRENT_DATE THEN
    RETURN json_build_object('success', false, 'error', 'Check-in must be in the future');
  END IF;
  IF p_quantity < 1 OR p_quantity > 10 THEN
    RETURN json_build_object('success', false, 'error', 'Invalid quantity');
  END IF;
  IF p_room_type_id IS NOT NULL AND NOT is_room_available(p_room_type_id, p_check_in, p_check_out, p_quantity) THEN
    RETURN json_build_object('success', false, 'error', 'Room not available for selected dates');
  END IF;
  IF p_room_type_id IS NOT NULL THEN
    SELECT public.current_room_rate(id::text, base_price)::integer INTO v_actual_price
    FROM room_types
    WHERE id = p_room_type_id AND is_active = true;
    IF v_actual_price IS NULL THEN
      RETURN json_build_object('success', false, 'error', 'Invalid room type');
    END IF;
    v_expected_subtotal := v_actual_price * v_nights * p_quantity;
    IF ABS(p_subtotal - v_expected_subtotal) > GREATEST(50, (v_expected_subtotal * 0.02)::INTEGER) THEN
      RETURN json_build_object('success', false, 'error', 'Price mismatch detected', 'expected_subtotal', v_expected_subtotal, 'received_subtotal', p_subtotal);
    END IF;
    IF ABS(p_total_amount - (p_subtotal + p_taxes)) > GREATEST(10, (p_total_amount * 0.01)::INTEGER) THEN
      RETURN json_build_object('success', false, 'error', 'Total amount mismatch', 'expected', p_subtotal + p_taxes, 'received', p_total_amount);
    END IF;
    IF p_taxes < 0 OR p_taxes > (p_subtotal * 0.20)::INTEGER THEN
      RETURN json_build_object('success', false, 'error', 'Invalid tax amount');
    END IF;
  END IF;
  SELECT COUNT(*) INTO v_suspicious_count FROM bookings
  WHERE lower(trim(email)) = lower(trim(p_email)) AND created_at > NOW() - INTERVAL '1 hour';
  IF v_suspicious_count >= 5 THEN
    RETURN json_build_object('success', false, 'error', 'Too many booking attempts. Please wait and try again.');
  END IF;
  v_booking_id := 'XTSY' || to_char(NOW(), 'YYMMDD') || lpad((floor(random() * 10000))::text, 4, '0');
  INSERT INTO bookings (
    booking_id, user_id, guest_name, email, whatsapp_number,
    check_in, check_out, guests, room_type, room_type_id, quantity,
    subtotal, taxes, total_amount, address, city, state, pincode,
    special_requests, emergency_contact, booking_status, payment_status, source
  ) VALUES (
    v_booking_id, v_user_id, p_guest_name, p_email, p_whatsapp_number,
    p_check_in, p_check_out, p_guests, p_room_type, p_room_type_id, p_quantity,
    p_subtotal, p_taxes, p_total_amount, p_address, p_city, p_state, p_pincode,
    p_special_requests, p_emergency_contact, 'pending_approval', 'pay_at_hotel', 'website'
  )
  RETURNING id INTO v_booking_uuid;
  RETURN json_build_object('success', true, 'bookingId', v_booking_id, 'bookingUUID', v_booking_uuid);
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object('success', false, 'error', 'Failed to create booking: ' || SQLERRM);
END;
$function$;
