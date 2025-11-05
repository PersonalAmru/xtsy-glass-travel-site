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

    const { booking_id } = await req.json();

    if (!booking_id) {
      return new Response(
        JSON.stringify({ success: false, error: 'Booking ID is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`Attempting to permanently delete booking: ${booking_id}`);

    // Get booking details before deleting for inventory restoration
    const { data: bookingData, error: fetchError } = await supabaseAdmin
      .from('bookings')
      .select('*')
      .eq('id', booking_id)
      .single();

    if (fetchError) {
      // Log detailed error information for debugging
      console.error('Error fetching booking for deletion:', {
        message: fetchError.message,
        code: fetchError.code,
        details: fetchError.details,
        hint: fetchError.hint
      });
      // Return generic error message to client
      return new Response(
        JSON.stringify({ success: false, error: 'Booking not found' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Restore room inventory if booking was confirmed
    if (bookingData.booking_status === 'confirmed' && bookingData.room_type_id) {
      const checkInDate = new Date(bookingData.check_in);
      const checkOutDate = new Date(bookingData.check_out);
      
      // Restore inventory for each night
      for (let date = new Date(checkInDate); date < checkOutDate; date.setDate(date.getDate() + 1)) {
        const dateStr = date.toISOString().split('T')[0];
        
        await supabaseAdmin
          .from('room_inventory')
          .upsert({
            room_type_id: bookingData.room_type_id,
            date: dateStr,
            available_count: 
              // Get current availability and add back the quantity
              await supabaseAdmin
                .from('room_inventory')
                .select('available_count')
                .eq('room_type_id', bookingData.room_type_id)
                .eq('date', dateStr)
                .single()
                .then(({ data }) => (data?.available_count || 0) + bookingData.quantity)
          }, {
            onConflict: 'room_type_id,date'
          });
      }
    }

    // Permanently delete the booking
    const { error } = await supabaseAdmin
      .from('bookings')
      .delete()
      .eq('id', booking_id);

    if (error) {
      // Log detailed error information for debugging
      console.error('Error deleting booking:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      // Return generic error message to client
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to delete booking. Please try again.' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Booking permanently deleted successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Booking permanently deleted successfully'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error: any) {
    // Log detailed error information for debugging
    console.error('Error in admin-delete-booking function:', {
      message: error?.message,
      stack: error?.stack,
      name: error?.name
    });
    // Return generic error message to client
    return new Response(
      JSON.stringify({ success: false, error: 'Unable to process deletion. Please try again.' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});