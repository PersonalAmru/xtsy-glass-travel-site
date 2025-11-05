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

    // 2. Generate unique booking ID
    const bookingId = `XTSY-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

    // 3. Prepare booking record
    const bookingRecord = {
      booking_id: bookingId,
      check_in: bookingData.checkIn,
      check_out: bookingData.checkOut,
      guests: bookingData.guests,
      total_amount: bookingData.totalAmount,
      subtotal: Math.round(bookingData.totalAmount / 1.12), // Remove 12% GST for subtotal
      taxes: Math.round(bookingData.totalAmount * 0.12),
      
      // Guest details
      guest_name: guestDetails.guestName,
      email: guestDetails.email,
      whatsapp_number: guestDetails.whatsappNumber,
      address: guestDetails.address,
      city: guestDetails.city,
      state: guestDetails.state,
      pincode: guestDetails.pincode,
      emergency_contact: guestDetails.emergencyContact || null,
      special_requests: guestDetails.specialRequests || null,
      
      // Room details (store first selected room as primary)
      room_type: bookingData.selectedRooms[0]?.name || 'Unknown',
      room_type_id: bookingData.selectedRooms[0]?.id || null,
      quantity: bookingData.selectedRooms.reduce((sum, room) => 
        sum + (room.selection.guests || room.selection.rooms || 1), 0
      ),
      
      // Metadata
      booking_status: 'pending',
      payment_status: 'pending',
      source: 'web',
      created_at: new Date().toISOString()
    };

    // 4. Insert booking into database (RLS policies will enforce security)
    const { data, error } = await supabase
      .from('bookings')
      .insert(bookingRecord)
      .select()
      .single();

    if (error) {
      console.error('Booking creation error:', error);
      
      // Handle specific error codes
      if (error.code === '23505') {
        return { success: false, error: 'This booking already exists. Please try again.' };
      }
      
      if (error.code === 'PGRST116') {
        return { success: false, error: 'Unable to create booking. Please check room availability.' };
      }

      // Check for rate limiting errors
      if (error.message?.includes('rate limit') || error.message?.includes('too many')) {
        return { success: false, error: 'Too many booking attempts. Please wait 15 minutes and try again.' };
      }
      
      return { 
        success: false, 
        error: 'Unable to create booking. Please try again or contact support.' 
      };
    }

    console.log('Booking created successfully:', bookingId);

    return {
      success: true,
      bookingId: data.booking_id
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
