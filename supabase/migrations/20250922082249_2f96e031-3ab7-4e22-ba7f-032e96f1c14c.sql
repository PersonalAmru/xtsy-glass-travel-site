-- Fix partial block/unblock: remove full-block entries and adjust inventory correctly
CREATE OR REPLACE FUNCTION public.admin_block_room_date_secure(
  p_room_type text,
  p_date date,
  p_block_count integer DEFAULT NULL::integer,
  p_action text DEFAULT 'toggle'::text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  result jsonb;
  existing_block_id uuid;
  total_capacity integer;
  current_available integer;
BEGIN
  -- Permission check
  IF NOT ((get_user_role() = ANY (ARRAY['admin'::text, 'staff'::text])) OR (auth.role() = 'service_role'::text)) THEN
    RAISE EXCEPTION 'Admin privileges required for room blocking operations';
  END IF;

  -- Validate inputs
  IF p_room_type IS NULL OR p_date IS NULL THEN
    RAISE EXCEPTION 'Room type and date are required';
  END IF;

  -- Resolve capacity from room type label
  SELECT 
    CASE 
      WHEN p_room_type ILIKE '%270%' OR p_room_type ILIKE '%Panorama%' THEN 1
      WHEN p_room_type ILIKE '%King Double%' OR p_room_type ILIKE '%Double%' THEN 1  
      WHEN p_room_type ILIKE '%King Triple%' OR p_room_type ILIKE '%Triple%' THEN 1
      WHEN p_room_type ILIKE '%4-Bed%' OR p_room_type ILIKE '%Mixed Dormitory%' THEN 4
      WHEN p_room_type ILIKE '%6-Bed%' THEN 6
      WHEN p_room_type ILIKE '%8-Bed%' THEN 8
      ELSE 2
    END INTO total_capacity;

  -- Detect existing full block
  SELECT id INTO existing_block_id
  FROM public.blocked_dates
  WHERE room_type = p_room_type 
    AND date = p_date 
    AND blocked = true
  LIMIT 1;

  -- Current availability: treat fully blocked as 0 if no inventory row
  SELECT COALESCE(
           (SELECT available_count FROM public.room_inventory 
             WHERE room_type_id = p_room_type AND date = p_date),
           CASE WHEN existing_block_id IS NOT NULL THEN 0 ELSE total_capacity END
         )
  INTO current_available;

  -- Handle explicit actions first
  IF p_action = 'partial_unblock' THEN
    IF p_block_count IS NULL OR p_block_count <= 0 THEN
      RAISE EXCEPTION 'Unblock count must be positive';
    END IF;

    -- Convert from full block to partial open by removing full-block row
    IF existing_block_id IS NOT NULL THEN
      DELETE FROM public.blocked_dates WHERE id = existing_block_id;
    END IF;

    INSERT INTO public.room_inventory (room_type_id, date, available_count)
    VALUES (p_room_type, p_date, LEAST(total_capacity, current_available + p_block_count))
    ON CONFLICT (room_type_id, date)
    DO UPDATE SET 
      available_count = LEAST(total_capacity, room_inventory.available_count + p_block_count),
      last_updated = now();

    result := jsonb_build_object(
      'success', true,
      'action', 'partial_unblocked',
      'room_type', p_room_type,
      'date', p_date,
      'unblock_count', p_block_count,
      'message', format('Opened %s beds for %s on %s', p_block_count, p_room_type, p_date)
    );

  ELSIF p_action = 'partial_block' THEN
    IF p_block_count IS NULL OR p_block_count <= 0 THEN
      RAISE EXCEPTION 'Block count must be positive';
    END IF;

    IF p_block_count >= total_capacity THEN
      -- Equivalent to full block
      DELETE FROM public.room_inventory WHERE room_type_id = p_room_type AND date = p_date;
      INSERT INTO public.blocked_dates (room_type, date, blocked)
      VALUES (p_room_type, p_date, true)
      ON CONFLICT DO NOTHING;

      result := jsonb_build_object(
        'success', true,
        'action', 'fully_blocked',
        'room_type', p_room_type,
        'date', p_date,
        'message', format('Fully blocked %s on %s', p_room_type, p_date)
      );
    ELSE
      -- Convert from full block to partial block by removing full-block row
      IF existing_block_id IS NOT NULL THEN
        DELETE FROM public.blocked_dates WHERE id = existing_block_id;
      END IF;

      INSERT INTO public.room_inventory (room_type_id, date, available_count)
      VALUES (p_room_type, p_date, GREATEST(0, total_capacity - p_block_count))
      ON CONFLICT (room_type_id, date)
      DO UPDATE SET 
        available_count = GREATEST(0, total_capacity - p_block_count),
        last_updated = now();

      result := jsonb_build_object(
        'success', true,
        'action', 'partial_blocked',
        'room_type', p_room_type,
        'date', p_date,
        'blocked_count', p_block_count,
        'message', format('Blocked %s beds for %s on %s', p_block_count, p_room_type, p_date)
      );
    END IF;

  ELSIF existing_block_id IS NOT NULL THEN
    -- Toggle from full block to unblocked
    DELETE FROM public.blocked_dates WHERE id = existing_block_id;
    DELETE FROM public.room_inventory WHERE room_type_id = p_room_type AND date = p_date;

    result := jsonb_build_object(
      'success', true,
      'action', 'unblocked',
      'room_type', p_room_type,
      'date', p_date,
      'message', 'Room unblocked successfully'
    );

  ELSE
    -- Toggle to block depending on provided count
    IF p_block_count IS NOT NULL AND p_block_count < total_capacity THEN
      INSERT INTO public.room_inventory (room_type_id, date, available_count)
      VALUES (p_room_type, p_date, GREATEST(0, total_capacity - p_block_count))
      ON CONFLICT (room_type_id, date)
      DO UPDATE SET 
        available_count = GREATEST(0, total_capacity - p_block_count),
        last_updated = now();

      result := jsonb_build_object(
        'success', true,
        'action', 'partial_blocked',
        'room_type', p_room_type,
        'date', p_date,
        'blocked_count', p_block_count,
        'message', format('Blocked %s beds for %s on %s', p_block_count, p_room_type, p_date)
      );
    ELSE
      INSERT INTO public.blocked_dates (room_type, date, blocked)
      VALUES (p_room_type, p_date, true);

      result := jsonb_build_object(
        'success', true,
        'action', 'fully_blocked',
        'room_type', p_room_type,
        'date', p_date,
        'message', format('Fully blocked %s on %s', p_room_type, p_date)
      );
    END IF;
  END IF;

  -- Audit log
  INSERT INTO public.security_alerts (alert_type, severity, details, user_id)
  VALUES ('admin_room_blocking', 'low', result || jsonb_build_object(
    'admin_user_id', auth.uid(),
    'admin_email', get_jwt_email(),
    'timestamp', now()
  ), auth.uid());

  RETURN result;
END;
$function$;