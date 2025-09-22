-- Update admin_block_room_date_secure function to handle unblocking
CREATE OR REPLACE FUNCTION public.admin_block_room_date_secure(p_room_type text, p_date date, p_block_count integer DEFAULT NULL::integer, p_action text DEFAULT 'toggle'::text)
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
  -- Check admin permissions
  IF NOT ((get_user_role() = ANY (ARRAY['admin'::text, 'staff'::text])) OR (auth.role() = 'service_role'::text)) THEN
    RAISE EXCEPTION 'Admin privileges required for room blocking operations';
  END IF;
  
  -- Validate inputs
  IF p_room_type IS NULL OR p_date IS NULL THEN
    RAISE EXCEPTION 'Room type and date are required';
  END IF;
  
  -- Get room capacity
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

  -- Get current available count
  SELECT COALESCE(available_count, total_capacity) INTO current_available
  FROM public.room_inventory
  WHERE room_type_id = p_room_type AND date = p_date;
  
  -- Check if date is already blocked
  SELECT id INTO existing_block_id
  FROM public.blocked_dates
  WHERE room_type = p_room_type 
    AND date = p_date 
    AND blocked = true
  LIMIT 1;
  
  -- Handle different actions via the p_action parameter from the edge function body
  IF p_action = 'partial_unblock' THEN
    -- Partial unblock: Increase available count
    IF p_block_count IS NULL OR p_block_count <= 0 THEN
      RAISE EXCEPTION 'Unblock count must be positive';
    END IF;
    
    INSERT INTO public.room_inventory (room_type_id, date, available_count)
    VALUES (p_room_type, p_date, LEAST(total_capacity, COALESCE(current_available, 0) + p_block_count))
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
    
  ELSIF existing_block_id IS NOT NULL THEN
    -- Unblock the date (remove full block)
    DELETE FROM public.blocked_dates 
    WHERE id = existing_block_id;
    
    -- Also restore inventory if it was reduced
    DELETE FROM public.room_inventory
    WHERE room_type_id = p_room_type AND date = p_date;
    
    result := jsonb_build_object(
      'success', true,
      'action', 'unblocked',
      'room_type', p_room_type,
      'date', p_date,
      'message', 'Room unblocked successfully'
    );
  ELSE
    -- Block the date
    IF p_block_count IS NOT NULL AND p_block_count < total_capacity THEN
      -- Partial block: Update inventory to reduce available count
      INSERT INTO public.room_inventory (room_type_id, date, available_count)
      VALUES (p_room_type, p_date, total_capacity - p_block_count)
      ON CONFLICT (room_type_id, date)
      DO UPDATE SET 
        available_count = EXCLUDED.available_count,
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
      -- Full block: Add to blocked_dates table
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
  
  -- Log the admin action
  INSERT INTO public.security_alerts (alert_type, severity, details, user_id)
  VALUES ('admin_room_blocking', 'low', result || jsonb_build_object(
    'admin_user_id', auth.uid(),
    'admin_email', get_jwt_email(),
    'timestamp', now()
  ), auth.uid());
  
  RETURN result;
END;
$function$;