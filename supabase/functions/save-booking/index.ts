import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.55.0";
import { bookingRequestSchema, formatValidationError } from "../_shared/validationSchemas.ts";

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

    const requestBody = await req.json();

    // Comprehensive validation using Zod
    const validationResult = bookingRequestSchema.safeParse(requestBody);
    
    if (!validationResult.success) {
      console.error('Validation failed:', validationResult.error.errors);
      return new Response(
        JSON.stringify({ 
          error: formatValidationError(validationResult.error),
          success: false,
          validationErrors: validationResult.error.errors
        }),
        {
          status: 400,
          headers: { 
            'Content-Type': 'application/json', 
            ...corsHeaders 
          },
        }
      );
    }

    const { bookingData, guestDetails } = validationResult.data;
  
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

    console.log('Creating booking with validated email:', guestDetails.email);
    console.log('Booking data:', { bookingId, totalGuests, totalRooms, amount: bookingData.totalAmount });

    // Create the main booking record with validated and sanitized data
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
      // Log detailed error information for debugging
      console.error('Booking creation error:', {
        message: bookingError.message,
        code: bookingError.code,
        details: bookingError.details,
        hint: bookingError.hint
      });
      // Throw generic error to avoid information leakage
      throw new Error('Unable to create booking. Please try again.');
    }

    console.log('Booking created successfully:', booking);

    // Block room availability for the booked dates
    for (const room of bookingData.selectedRooms) {
      const checkInDate = new Date(bookingData.checkIn);
      const checkOutDate = new Date(bookingData.checkOut);
      
      // Block each night in the date range
      for (let date = new Date(checkInDate); date < checkOutDate; date.setDate(date.getDate() + 1)) {
        const dateStr = date.toISOString().split('T')[0];
        
        try {
          // Get current inventory or create new record
          const { data: inventory } = await supabase
            .from('room_inventory')
            .select('available_count')
            .eq('room_type_id', room.id)
            .eq('date', dateStr)
            .single();
          
          const currentAvailable = inventory?.available_count ?? 10; // Default to room capacity if no inventory record
          const newAvailable = Math.max(0, currentAvailable - room.selection.rooms);
          
          // Update inventory
          const { error: inventoryError } = await supabase
            .from('room_inventory')
            .upsert({
              room_type_id: room.id,
              date: dateStr,
              available_count: newAvailable
            });
          
          if (inventoryError) {
            console.error('Error updating room inventory:', inventoryError);
          } else {
            console.log(`Updated inventory for ${room.id} on ${dateStr}: ${newAvailable} available`);
          }
        } catch (inventoryError) {
          console.error('Error processing inventory for', room.id, 'on', dateStr, ':', inventoryError);
        }
      }
    }

    console.log('Room availability blocked successfully');

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
    // Log detailed error information for debugging
    console.error('Error in save-booking function:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    // Return generic error message to client
    return new Response(
      JSON.stringify({ 
        error: 'Unable to process booking. Please try again or contact support.',
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