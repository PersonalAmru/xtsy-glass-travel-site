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

    const { room_type_id, start_date, end_date } = await req.json();

    if (!room_type_id || !start_date || !end_date) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required parameters' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`Getting availability for room ${room_type_id} from ${start_date} to ${end_date}`);

    // Get room type details
    const { data: roomType } = await supabaseAdmin
      .from('room_types')
      .select('total_units')
      .eq('id', room_type_id)
      .single();

    if (!roomType) {
      return new Response(
        JSON.stringify({ success: false, error: 'Room type not found' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Get inventory data for the date range
    const { data: inventory } = await supabaseAdmin
      .from('room_inventory')
      .select('date, available_count')
      .eq('room_type_id', room_type_id)
      .gte('date', start_date)
      .lte('date', end_date)
      .order('date');

    // Get blocked dates
    const { data: blockedDates } = await supabaseAdmin
      .from('blocked_dates')
      .select('date')
      .eq('room_type', room_type_id)
      .eq('blocked', true)
      .gte('date', start_date)
      .lte('date', end_date);

    // Get confirmed bookings for the period
    const { data: confirmedBookings } = await supabaseAdmin
      .from('bookings')
      .select('check_in, check_out, quantity')
      .eq('room_type_id', room_type_id)
      .eq('booking_status', 'confirmed')
      .gte('check_in', start_date)
      .lte('check_out', end_date);

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
      const availableCount = inventoryMap[dateStr] ?? roomType.total_units;
      
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
        total: roomType.total_units,
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
        room_type_id,
        total_units: roomType.total_units
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