import { supabase } from "@/integrations/supabase/client";
import { validateWhatsAppBooking } from "@/utils/whatsappBookingValidation";

interface WhatsAppBookingData {
  name: string;
  email: string;
  phone: string;
  city: string;
  pincode: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  specialRequests: string;
  selectedRooms: Array<{
    roomTypeId: string;
    roomTypeName: string;
    quantity: number;
    price: number;
  }>;
  nights: number;
  totalAmount: number;
}

interface XTSY270BookingData {
  state: string;
  city: string;
  pincode: string;
  mobile: string;
  email: string;
}

interface TourBookingData {
  name: string;
  email: string;
  phone: string;
  city: string;
  pincode: string;
  guests: number;
  selectedDate: string;
  tourName: string;
  duration: string;
  category: string;
  basePrice: number;
}

// Save WhatsApp booking using secure RPC function
export async function saveWhatsAppBooking(data: WhatsAppBookingData) {
  try {
    // Validate input data
    const validation = validateWhatsAppBooking({
      name: data.name,
      email: data.email,
      phone: data.phone,
      city: data.city,
      pincode: data.pincode,
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      guests: data.guests,
      specialRequests: data.specialRequests,
    });

    if (!validation.success) {
      const errorMessages = Object.values(validation.errors || {}).join(', ');
      return { success: false, error: `Validation failed: ${errorMessages}` };
    }

    // Calculate taxes (12% GST)
    const subtotal = data.totalAmount || 0;
    const taxes = Math.round(subtotal * 0.12);
    const totalWithTax = subtotal + taxes;

    // Use secure RPC function for booking creation (includes rate limiting & fraud detection)
    const { data: result, error } = await supabase.rpc('create_booking_secure', {
      p_guest_name: data.name || 'Guest',
      p_email: data.email || 'not-provided@example.com',
      p_whatsapp_number: data.phone || '0000000000',
      p_city: data.city || null,
      p_pincode: data.pincode || null,
      p_check_in: data.checkIn || new Date().toISOString().split('T')[0],
      p_check_out: data.checkOut || new Date(Date.now() + 86400000).toISOString().split('T')[0],
      p_guests: data.guests || 1,
      p_special_requests: data.specialRequests 
        ? `[WhatsApp Inquiry] ${data.specialRequests}` 
        : '[WhatsApp Inquiry]',
      p_room_type: data.selectedRooms.length > 0 
        ? data.selectedRooms.map(r => r.roomTypeName).join(', ')
        : 'Not specified',
      p_room_type_id: data.selectedRooms.length > 0 
        ? data.selectedRooms[0].roomTypeId 
        : 'inquiry',
      p_quantity: data.selectedRooms.reduce((sum, room) => sum + room.quantity, 0) || 1,
      p_subtotal: subtotal,
      p_taxes: taxes,
      p_total_amount: totalWithTax,
    });

    if (error) {
      console.error('Secure booking creation error:', error);
      
      // Handle rate limiting errors
      if (error.message?.includes('rate limit') || error.message?.includes('too many')) {
        return { 
          success: false, 
          error: 'Too many booking attempts. Please try again in a few minutes.' 
        };
      }
      
      throw error;
    }

    // Parse the result
    const bookingResult = typeof result === 'string' ? JSON.parse(result) : result;
    
    if (!bookingResult?.success) {
      return { 
        success: false, 
        error: bookingResult?.error || 'Failed to create booking' 
      };
    }
    
    console.log('Booking saved successfully via secure RPC:', bookingResult.booking_id);
    return { success: true, bookingId: bookingResult.booking_id };
  } catch (error: any) {
    console.error('Error saving WhatsApp booking:', error);
    return { success: false, error: error.message || 'Unknown error occurred' };
  }
}

// Save XTSY270 inquiry
export async function saveXTSY270Inquiry(data: XTSY270BookingData) {
  try {
    // Generate a unique booking ID
    const bookingId = `XTSY270-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const { data: booking, error } = await supabase
      .from('bookings')
      .insert({
        booking_id: bookingId,
        guest_name: 'XTSY270 Inquiry',
        email: data.email,
        whatsapp_number: data.mobile,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        check_in: new Date().toISOString().split('T')[0], // Today's date as placeholder
        check_out: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow as placeholder
        guests: 2,
        room_type: 'XTSY 270° Panorama Glass Suite',
        room_type_id: 'xtsy-270',
        quantity: 1,
        total_amount: 0, // To be determined
        subtotal: 0,
        taxes: 0,
        booking_status: 'inquiry',
        payment_status: 'pending',
        source: 'xtsy270_inquiry',
        special_requests: 'XTSY 270° Glass Suite Inquiry'
      })
      .select()
      .single();

    if (error) throw error;
    return { success: true, bookingId: booking?.id };
  } catch (error: any) {
    console.error('Error saving XTSY270 inquiry:', error);
    return { success: false, error: error.message };
  }
}

// Save tour package inquiry
export async function saveTourInquiry(data: TourBookingData) {
  try {
    // Calculate estimated end date based on duration
    const startDate = new Date(data.selectedDate);
    const durationDays = parseInt(data.duration.match(/\d+/)?.[0] || '1');
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + durationDays);

    // Generate a unique booking ID
    const bookingId = `TOUR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const { data: booking, error } = await supabase
      .from('bookings')
      .insert({
        booking_id: bookingId,
        guest_name: data.name,
        email: data.email,
        whatsapp_number: data.phone,
        city: data.city,
        pincode: data.pincode,
        check_in: data.selectedDate,
        check_out: endDate.toISOString().split('T')[0],
        guests: data.guests,
        room_type: `Tour: ${data.tourName}`,
        total_amount: data.basePrice * data.guests,
        subtotal: data.basePrice * data.guests,
        taxes: 0,
        booking_status: 'inquiry',
        payment_status: 'pending',
        source: 'tour_inquiry',
        special_requests: `Tour Package: ${data.tourName} | Category: ${data.category} | Duration: ${data.duration}`
      })
      .select()
      .single();

    if (error) throw error;
    return { success: true, bookingId: booking?.id };
  } catch (error: any) {
    console.error('Error saving tour inquiry:', error);
    return { success: false, error: error.message };
  }
}
