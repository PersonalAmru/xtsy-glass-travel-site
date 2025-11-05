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

    console.log(`Attempting to cancel booking: ${booking_id}`);

    // Update booking status to cancelled
    const { data, error } = await supabaseAdmin
      .from('bookings')
      .update({
        booking_status: 'cancelled',
        cancelled_at: new Date().toISOString()
      })
      .eq('id', booking_id)
      .select()
      .single();

    if (error) {
      // Log detailed error information for debugging
      console.error('Error cancelling booking:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      // Return generic error message to client
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to cancel booking. Please try again.' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Booking cancelled successfully:', data);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Booking cancelled successfully',
        booking: data
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error: any) {
    // Log detailed error information for debugging
    console.error('Error in admin-cancel-booking function:', {
      message: error?.message,
      stack: error?.stack,
      name: error?.name
    });
    // Return generic error message to client
    return new Response(
      JSON.stringify({ success: false, error: 'Unable to process cancellation. Please try again.' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});