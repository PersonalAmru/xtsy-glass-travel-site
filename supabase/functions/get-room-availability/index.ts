import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    const requestBody = await req.json();
    console.log('Request received:', requestBody);
    
    const { room_type_name, start_date, end_date } = requestBody;

    if (!room_type_name || !start_date || !end_date) {
      console.log('Missing parameters:', { room_type_name, start_date, end_date });
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required parameters' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`Getting availability for room ${room_type_name} from ${start_date} to ${end_date}`);

    // Try to resolve room type by name to get canonical id and total units
    const { data: roomTypeRow, error: roomTypeError } = await supabaseAdmin
      .from('room_types')
      .select('id, total_units')
      .eq('name', room_type_name)
      .maybeSingle();

    if (roomTypeError) {
      console.log('room_types lookup error (non-critical):', roomTypeError);
    }

    // Define room capacity based on room type name - aligned with frontend logic
    const getRoomCapacity = (roomName: string): number => {
      const name = roomName.toLowerCase();
      
      // Dormitories - capacity = number of beds
      if (name.includes('8') && name.includes('bed')) return 8;
      if (name.includes('6') && name.includes('bed')) return 6; 
      if (name.includes('4') && name.includes('bed')) return 4;
      
      // Private rooms - capacity = 1 room (but may accommodate multiple guests)
      if (name.includes('270') || name.includes('panorama')) return 1;
      if (name.includes('king triple') || name.includes('triple')) return 1;
      if (name.includes('king double') || name.includes('double')) return 2; // 2 rooms available
      
      return 1; // Default to 1 room
    };

    const totalUnits = roomTypeRow?.total_units ?? getRoomCapacity(room_type_name);
    const altKey = roomTypeRow?.id || null;
    const keys = altKey ? [room_type_name, altKey] : [room_type_name];
    console.log(`Room capacity for ${room_type_name}: ${totalUnits}`);

    // Get inventory data for the date range (using room_type_name)
    const { data: inventory, error: inventoryError } = await supabaseAdmin
      .from('room_inventory')
      .select('date, available_count, room_type_id')
      .in('room_type_id', keys)
      .gte('date', start_date)
      .lte('date', end_date)
      .order('date');

    if (inventoryError) {
      console.log('Inventory query error (non-critical):', inventoryError);
    } else {
      console.log('Inventory query result:', inventory?.length || 0, 'records');
    }

    // Get blocked dates (using room_type field)
    const { data: blockedDates, error: blockedError } = await supabaseAdmin
      .from('blocked_dates')
      .select('date')
      .in('room_type', keys)
      .eq('blocked', true)
      .gte('date', start_date)
      .lte('date', end_date);

    if (blockedError) {
      console.log('Blocked dates query error (non-critical):', blockedError);
    } else {
      console.log('Blocked dates query result:', blockedDates?.length || 0, 'records');
    }

    // Get confirmed bookings for the period (using room_type field)
    const { data: confirmedBookings, error: bookingsError } = await supabaseAdmin
      .from('bookings')
      .select('check_in, check_out, quantity, room_type')
      .in('room_type', keys)
      .eq('booking_status', 'confirmed')
      .gte('check_in', start_date)
      .lte('check_out', end_date);

    if (bookingsError) {
      console.log('Bookings query error (non-critical):', bookingsError);
    } else {
      console.log('Bookings query result:', confirmedBookings?.length || 0, 'records');
    }

    // Build availability calendar
    const availability = {};
    const inventoryMap = {};
    const blockedDatesSet = new Set();

    // Map inventory data
    if (inventory) {
      inventory.forEach(item => {
        inventoryMap[item.date] = item.available_count;
      });
    }

    // Map blocked dates
    if (blockedDates) {
      blockedDates.forEach(item => {
        blockedDatesSet.add(item.date);
      });
    }

    // Generate availability for each date in range
    const startDateObj = new Date(start_date);
    const endDateObj = new Date(end_date);
    
    for (let d = new Date(startDateObj); d <= endDateObj; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      
      // Check if date is blocked by admin
      const isBlockedByAdmin = blockedDatesSet.has(dateStr);
      
      // Get available count from inventory or default to total units
      const availableCount = inventoryMap[dateStr] ?? totalUnits;
      
      // Calculate bookings for this specific date
      let bookedCount = 0;
      if (confirmedBookings) {
        confirmedBookings.forEach(booking => {
          const checkIn = new Date(booking.check_in);
          const checkOut = new Date(booking.check_out);
          const currentDate = new Date(dateStr);
          
          // Check if current date falls within booking period
          if (currentDate >= checkIn && currentDate < checkOut) {
            bookedCount += booking.quantity || 1;
          }
        });
      }
      
      const finalAvailableCount = Math.max(0, availableCount - bookedCount);
      
      availability[dateStr] = {
        available: finalAvailableCount,
        total: totalUnits,
        isBlocked: isBlockedByAdmin,
        isSoldOut: isBlockedByAdmin || finalAvailableCount === 0,
        bookedCount
      };
    }

    console.log('Availability calculated:', Object.keys(availability).length, 'dates');

    return new Response(
      JSON.stringify({ 
        success: true, 
        availability,
        room_type_name,
        total_units: totalUnits
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in get-room-availability function:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});