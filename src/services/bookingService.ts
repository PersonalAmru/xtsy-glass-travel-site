import { supabase } from '@/integrations/supabase/client';
import { bookingRequestSchema, formatValidationError, type BookingRequest } from '@/utils/bookingValidation';

export interface CreateBookingResponse {
  success: boolean;
  bookingId?: string;
  error?: string;
}

/**
 * Create a secure booking using client-side Supabase SDK with proper validation
 */
export async function createBooking(request: BookingRequest): Promise<CreateBookingResponse> {
  try {
    // 1. Validate input data
    const validationResult = bookingRequestSchema.safeParse(request);
    
    if (!validationResult.success) {
      return {
        success: false,
        error: formatValidationError(validationResult.error)
      };
    }

    const { bookingData, guestDetails } = validationResult.data;

    // 2. Calculate subtotal and GST (12%)
    const totalAmount = bookingData.totalAmount;
    const subtotal = Math.round(totalAmount / 1.12);
    const gst = totalAmount - subtotal;

    // 3. Calculate total guests and quantity
    const totalGuests = bookingData.guests;
    const totalQuantity = bookingData.selectedRooms.reduce((sum, room) => 
      sum + (room.selection.guests || room.selection.rooms || 1), 0
    );

    // 4. Call the secure booking function with comprehensive server-side validation
    // This function handles: input validation, date validation, availability check,
    // price validation, rate limiting, and fraud detection
    const { data, error } = await supabase.rpc('create_booking_secure', {
      p_guest_name: guestDetails.guestName,
      p_email: guestDetails.email,
      p_whatsapp_number: guestDetails.whatsappNumber,
      p_check_in: bookingData.checkIn,
      p_check_out: bookingData.checkOut,
      p_guests: totalGuests,
      p_room_type: bookingData.selectedRooms[0]?.name || 'Unknown',
      p_room_type_id: bookingData.selectedRooms[0]?.id || null,
      p_quantity: totalQuantity,
      p_subtotal: subtotal,
      p_taxes: gst,
      p_total_amount: totalAmount,
      p_address: guestDetails.address || null,
      p_city: guestDetails.city || null,
      p_state: guestDetails.state || null,
      p_pincode: guestDetails.pincode || null,
      p_special_requests: guestDetails.specialRequests || null,
      p_emergency_contact: guestDetails.emergencyContact || null,
    });

    if (error) {
      console.error('Secure booking function error:', error);
      
      // Check for rate limiting errors
      if (error.message?.includes('rate limit') || error.message?.includes('too many')) {
        return { 
          success: false, 
          error: 'Too many booking attempts. Please wait 15 minutes and try again.' 
        };
      }
      
      return {
        success: false,
        error: error.message || 'Failed to create booking. Please try again.',
      };
    }

    // Parse the JSON response from the secure function
    const result = data as { success: boolean; bookingId?: string; error?: string };

    if (!result.success) {
      console.error('Booking creation failed:', result.error);
      return { 
        success: false, 
        error: result.error || 'Unable to create booking. Please try again or contact support.' 
      };
    }

    console.log('Booking created successfully:', result.bookingId);

    // Fire-and-forget admin notification email to booking@xtsy.one
    try {
      void supabase.functions.invoke('send-transactional-email', {
        body: {
          templateName: 'admin-booking-notification',
          recipientEmail: 'booking@xtsy.one',
          idempotencyKey: `admin-booking-${result.bookingId}`,
          templateData: {
            bookingId: result.bookingId,
            guestName: guestDetails.guestName,
            email: guestDetails.email,
            phone: guestDetails.whatsappNumber,
            checkIn: bookingData.checkIn,
            checkOut: bookingData.checkOut,
            nights: Math.max(
              1,
              Math.ceil(
                (new Date(bookingData.checkOut).getTime() - new Date(bookingData.checkIn).getTime()) /
                  (1000 * 60 * 60 * 24)
              )
            ),
            guests: totalGuests,
            roomType: bookingData.selectedRooms[0]?.name,
            quantity: totalQuantity,
            subtotal,
            taxes: gst,
            totalAmount,
            address: guestDetails.address,
            city: guestDetails.city,
            state: guestDetails.state,
            pincode: guestDetails.pincode,
            specialRequests: guestDetails.specialRequests,
            emergencyContact: guestDetails.emergencyContact,
            source: 'Website — bookingService',
          },
        },
      }).catch((e) => console.warn('Admin email dispatch failed', e));
    } catch (e) {
      console.warn('Admin email dispatch threw', e);
    }

    return {
      success: true,
      bookingId: result.bookingId
    };

  } catch (error) {
    console.error('Unexpected error creating booking:', error);
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.'
    };
  }
}

/**
 * Get user's bookings with proper RLS enforcement
 */
export async function getUserBookings() {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { data: null, error: 'Authentication required' };
  }

  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return { data, error };
}

/**
 * Get single booking by booking_id (user must own it)
 */
export async function getBookingById(bookingId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { data: null, error: 'Authentication required' };
  }

  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('booking_id', bookingId)
    .eq('user_id', user.id)
    .single();

  return { data, error };
}
