CREATE OR REPLACE FUNCTION public.create_whatsapp_enquiry(p_guest_name text, p_email text, p_phone text, p_check_in date, p_check_out date, p_guests integer, p_room_ids text[], p_quantities integer[], p_breakfast boolean, p_decoration boolean, p_subtotal numeric, p_taxes numeric, p_total numeric, p_requests text DEFAULT NULL) RETURNS json LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_nights integer; v_i integer; v_count integer; v_room public.room_types%ROWTYPE; v_rate numeric; v_subtotal numeric := 0; v_tax numeric := 0; v_total numeric; v_capacity integer := 0; v_name text := ''; v_id text; v_uuid uuid; v_recent integer; v_is_panorama boolean := false;
BEGIN
  IF length(btrim(coalesce(p_guest_name,''))) NOT BETWEEN 2 AND 120 OR coalesce(p_email,'') !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' OR length(regexp_replace(coalesce(p_phone,''),'[^0-9]','','g')) < 10 THEN RETURN json_build_object('success',false,'error','Invalid contact details'); END IF;
  IF length(coalesce(p_requests,'')) > 2000 THEN RETURN json_build_object('success',false,'error','Special requests too long'); END IF;
  v_nights := p_check_out - p_check_in;
  IF p_check_in < current_date OR v_nights NOT BETWEEN 1 AND 60 OR p_check_in > current_date + interval '18 months' OR p_guests NOT BETWEEN 1 AND 30 THEN RETURN json_build_object('success',false,'error','Invalid dates or guest count'); END IF;
  v_count := coalesce(array_length(p_room_ids,1),0);
  IF v_count NOT BETWEEN 1 AND 10 OR v_count <> coalesce(array_length(p_quantities,1),0) THEN RETURN json_build_object('success',false,'error','Select available rooms'); END IF;
  IF (p_breakfast OR p_decoration) AND NOT EXISTS (SELECT 1 FROM unnest(p_room_ids) room_id JOIN public.room_types rt ON rt.id::text=room_id WHERE rt.name ILIKE '%panorama%' OR rt.name ILIKE '%270%') THEN RETURN json_build_object('success',false,'error','Panorama package needs Panorama room'); END IF;
  FOR v_i IN 1..v_count LOOP
    SELECT * INTO v_room FROM public.room_types WHERE id::text=p_room_ids[v_i] AND is_active=true;
    IF NOT FOUND OR lower(btrim(v_room.name))='bed in 4-bed mixed dormitory' OR p_quantities[v_i] NOT BETWEEN 1 AND 10 OR p_quantities[v_i] > coalesce(v_room.total_units,1) THEN RETURN json_build_object('success',false,'error','Unavailable room selection'); END IF;
    v_is_panorama := v_room.name ILIKE '%panorama%' OR v_room.name ILIKE '%270%';
    IF v_is_panorama AND v_count > 1 THEN RETURN json_build_object('success',false,'error','Book Panorama separately'); END IF;
    IF v_is_panorama AND v_room.base_price <> 5399 THEN RETURN json_build_object('success',false,'error','Panorama rate is being updated. Please retry shortly'); END IF;
    v_rate := CASE WHEN v_is_panorama AND p_breakfast THEN 5799 ELSE v_room.base_price END;
    v_subtotal := v_subtotal + v_rate * p_quantities[v_i] * v_nights;
    v_tax := v_tax + round(v_rate * p_quantities[v_i] * v_nights * CASE WHEN v_rate >= 7500 THEN .18 ELSE .05 END);
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
  VALUES(v_uuid,v_id,btrim(p_guest_name),lower(btrim(p_email)),p_phone,p_check_in,p_check_out,array_to_string(p_room_ids,','),v_name || CASE WHEN p_breakfast THEN ' — breakfast for 2' ELSE ' — stay only' END || CASE WHEN p_decoration THEN ' + decoration' ELSE '' END,p_guests,v_nights,v_subtotal/v_nights, v_subtotal, CASE WHEN p_decoration THEN 18 ELSE 5 END,v_tax,v_total,left('[WhatsApp] '||coalesce(p_requests,''),2000),auth.uid(),'pending');
  RETURN json_build_object('success',true,'enquiry_id',v_id);
END; $$;
REVOKE ALL ON FUNCTION public.create_whatsapp_enquiry(text,text,text,date,date,integer,text[],integer[],boolean,boolean,numeric,numeric,numeric,text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_whatsapp_enquiry(text,text,text,date,date,integer,text[],integer[],boolean,boolean,numeric,numeric,numeric,text) TO anon,authenticated,service_role;