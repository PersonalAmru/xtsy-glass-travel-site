import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.55.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BookingRequest {
  bookingData: {
    checkIn: string;
    checkOut: string;
    guests: number;
    nights: number;
    selectedRooms: Array<{
      id: string;
      name: string;
      price: number;
      type: string;
      selection: {
        guests: number;
        rooms: number;
      };
    }>;
    totalAmount: number;
  };
  guestDetails: {
    guestName: string;
    email: string;
    whatsappNumber: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    emergencyContact: string;
    specialRequests: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { bookingData, guestDetails }: BookingRequest = await req.json();

    // Generate booking ID
    const bookingId = `XTSY-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    // Calculate total guests and rooms
    const totalGuests = bookingData.selectedRooms.reduce((total, room) => {
      if (room.type === "dorm") return total + room.selection.rooms;
      return total + room.selection.guests * room.selection.rooms;
    }, 0);

    const totalRooms = bookingData.selectedRooms.reduce((total, room) => 
      total + room.selection.rooms, 0
    );

    // Create the main booking record
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        booking_id: bookingId,
        guest_name: guestDetails.guestName,
        email: guestDetails.email,
        whatsapp_number: guestDetails.whatsappNumber,
        check_in: bookingData.checkIn,
        check_out: bookingData.checkOut,
        guests: totalGuests,
        quantity: totalRooms,
        room_type: bookingData.selectedRooms.map(r => r.name).join(', '),
        room_type_id: bookingData.selectedRooms[0]?.id || 'mixed',
        total_amount: bookingData.totalAmount,
        subtotal: bookingData.totalAmount,
        taxes: 0,
        booking_status: 'pending',
        payment_status: 'pending',
        address: guestDetails.address,
        city: guestDetails.city,
        state: guestDetails.state,
        pincode: guestDetails.pincode,
        emergency_contact: guestDetails.emergencyContact,
        special_requests: guestDetails.specialRequests,
        source: 'direct'
      })
      .select()
      .single();

    if (bookingError) {
      console.error('Booking creation error:', bookingError);
      throw new Error(`Failed to create booking: ${bookingError.message}`);
    }

    console.log('Booking created successfully:', booking);

    return new Response(JSON.stringify({ 
      success: true, 
      bookingId: bookingId,
      booking: booking 
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error('Error in save-booking function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        success: false 
      }),
      {
        status: 500,
        headers: { 
          'Content-Type': 'application/json', 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);