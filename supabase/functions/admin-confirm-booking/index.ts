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

    const { booking_id, room_selections, guest_name, check_in, check_out } = await req.json();

    if (!booking_id) {
      return new Response(
        JSON.stringify({ success: false, error: 'Booking ID is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`Confirming booking: ${booking_id}`);

    // Check room availability for all selected rooms
    const checkInDate = new Date(check_in);
    const checkOutDate = new Date(check_out);
    
    for (const selection of room_selections) {
      for (let date = new Date(checkInDate); date < checkOutDate; date.setDate(date.getDate() + 1)) {
        const dateStr = date.toISOString().split('T')[0];
        
        // Check availability
        const { data: inventory } = await supabaseAdmin
          .from('room_inventory')
          .select('available_count')
          .eq('room_type_id', selection.room_type_id)
          .eq('date', dateStr)
          .single();

        const availableCount = inventory?.available_count || 0;
        
        if (availableCount < selection.quantity) {
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: `Insufficient availability for ${selection.room_type_name} on ${dateStr}. Available: ${availableCount}, Requested: ${selection.quantity}` 
            }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }
      }
    }

    // Lock room inventory for all selected rooms and dates
    for (const selection of room_selections) {
      for (let date = new Date(checkInDate); date < checkOutDate; date.setDate(date.getDate() + 1)) {
        const dateStr = date.toISOString().split('T')[0];
        
        // Update inventory to lock availability
        await supabaseAdmin
          .from('room_inventory')
          .upsert({
            room_type_id: selection.room_type_id,
            date: dateStr,
            available_count: 
              // Get current availability and subtract quantity
              await supabaseAdmin
                .from('room_inventory')
                .select('available_count')
                .eq('room_type_id', selection.room_type_id)
                .eq('date', dateStr)
                .single()
                .then(({ data }) => Math.max(0, (data?.available_count || 0) - selection.quantity))
          }, {
            onConflict: 'room_type_id,date'
          });
      }
    }

    // Update booking status to confirmed
    const { data, error } = await supabaseAdmin
      .from('bookings')
      .update({
        booking_status: 'confirmed',
        confirmed_at: new Date().toISOString(),
        guest_name: guest_name,
        check_in: check_in,
        check_out: check_out,
        room_type: room_selections.map(s => s.room_type_name).join(', '),
        room_type_id: room_selections[0]?.room_type_id, // Store primary room type
        quantity: room_selections.reduce((sum, s) => sum + s.quantity, 0)
      })
      .eq('id', booking_id)
      .select()
      .single();

    if (error) {
      // Log detailed error information for debugging
      console.error('Error confirming booking:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      // Return generic error message to client
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to confirm booking. Please try again.' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Booking confirmed successfully:', data);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Booking confirmed and room availability locked',
        booking: data
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error: any) {
    // Log detailed error information for debugging
    console.error('Error in admin-confirm-booking function:', {
      message: error?.message,
      stack: error?.stack,
      name: error?.name
    });
    // Return generic error message to client
    return new Response(
      JSON.stringify({ success: false, error: 'Unable to confirm booking. Please try again.' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});