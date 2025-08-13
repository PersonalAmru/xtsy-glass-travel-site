import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BookingData {
  bookingId: string;
  guestName: string;
  email: string;
  whatsappNumber: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  roomDetails: any[];
  subtotal: number;
  gstAmount: number;
  totalAmount: number;
  discountAmount?: number;
  promoCode?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  emergencyContact?: string;
  emergencyRelation?: string;
  addOns?: any;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    if (req.method === 'POST') {
      const { action, bookingData } = await req.json();

      switch (action) {
        case 'create_booking': {
          // Validate required fields
          if (!bookingData.bookingId || !bookingData.guestName || !bookingData.email || !bookingData.whatsappNumber) {
            return new Response(
              JSON.stringify({ error: 'Missing required booking fields' }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          // Validate email format
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(bookingData.email)) {
            return new Response(
              JSON.stringify({ error: 'Invalid email format' }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          // Validate phone number (basic validation)
          const phoneRegex = /^[+]?[\d\s\-\(\)]{8,}$/;
          if (!phoneRegex.test(bookingData.whatsappNumber)) {
            return new Response(
              JSON.stringify({ error: 'Invalid phone number format' }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          // Check if booking ID already exists
          const { data: existingBooking } = await supabaseClient
            .from('bookings')
            .select('booking_id')
            .eq('booking_id', bookingData.bookingId)
            .single();

          if (existingBooking) {
            return new Response(
              JSON.stringify({ error: 'Booking ID already exists' }),
              { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          // Create the booking with server-side validation
          const { data: booking, error: bookingError } = await supabaseClient
            .from('bookings')
            .insert({
              booking_id: bookingData.bookingId,
              guest_name: bookingData.guestName,
              email: bookingData.email.toLowerCase(), // Normalize email
              whatsapp_number: bookingData.whatsappNumber,
              check_in: bookingData.checkIn,
              check_out: bookingData.checkOut,
              guests: bookingData.guests,
              nights: bookingData.nights,
              room_details: bookingData.roomDetails,
              subtotal: bookingData.subtotal,
              gst_amount: bookingData.gstAmount,
              total_amount: bookingData.totalAmount,
              discount_amount: bookingData.discountAmount || 0,
              promo_code: bookingData.promoCode || null,
              promo_applied: !!bookingData.promoCode,
              address: bookingData.address || null,
              city: bookingData.city || null,
              state: bookingData.state || null,
              pincode: bookingData.pincode || null,
              emergency_contact: bookingData.emergencyContact || null,
              emergency_relation: bookingData.emergencyRelation || null,
              booking_status: 'pending',
              payment_method: 'whatsapp_initiated',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .select()
            .single();

          if (bookingError) {
            console.error('Booking creation error:', bookingError);
            return new Response(
              JSON.stringify({ error: 'Failed to create booking', details: bookingError.message }),
              { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          // Log the booking creation for audit
          console.log(`Secure booking created: ${bookingData.bookingId} for ${bookingData.email}`);

          return new Response(
            JSON.stringify({ 
              success: true, 
              booking: booking,
              message: 'Booking created successfully'
            }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        case 'verify_booking': {
          const { bookingId, email } = bookingData;
          
          if (!bookingId || !email) {
            return new Response(
              JSON.stringify({ error: 'Missing booking ID or email' }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          // Verify booking exists and belongs to the email
          const { data: booking, error } = await supabaseClient
            .from('bookings')
            .select('*')
            .eq('booking_id', bookingId)
            .eq('email', email.toLowerCase())
            .single();

          if (error || !booking) {
            return new Response(
              JSON.stringify({ error: 'Booking not found or access denied' }),
              { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          return new Response(
            JSON.stringify({ success: true, booking }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        default:
          return new Response(
            JSON.stringify({ error: 'Invalid action' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
      }
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Secure booking function error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});