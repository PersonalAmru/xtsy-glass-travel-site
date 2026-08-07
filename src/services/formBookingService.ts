import { supabase } from "@/integrations/supabase/client";
import { validateWhatsAppBooking } from "@/utils/whatsappBookingValidation";
import { validateXTSY270Inquiry, validateTourInquiry } from "@/utils/inquiryValidation";

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
      p_city: data.city || undefined,
      p_pincode: data.pincode || undefined,
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

// Save XTSY270 inquiry using secure RPC function
export async function saveXTSY270Inquiry(data: XTSY270BookingData) {
  try {
    // Validate input data
    const validation = validateXTSY270Inquiry(data);
    
    if (!validation.success) {
      const errorMessages = Object.values(validation.errors || {}).join(', ');
      return { success: false, error: `Validation failed: ${errorMessages}` };
    }

    // Use secure RPC function (includes rate limiting & fraud detection)
    const { data: result, error } = await supabase.rpc('create_booking_secure', {
      p_guest_name: 'XTSY 270° Inquiry',
      p_email: data.email,
      p_whatsapp_number: data.mobile,
      p_city: data.city,
      p_state: data.state,
      p_pincode: data.pincode,
      p_check_in: new Date().toISOString().split('T')[0],
      p_check_out: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      p_guests: 2,
      p_room_type: 'XTSY 270° Panorama Glass Suite',
      p_room_type_id: 'xtsy-270',
      p_quantity: 1,
      p_subtotal: 0,
      p_taxes: 0,
      p_total_amount: 0,
      p_special_requests: '[XTSY 270° Glass Suite Inquiry]',
    });

    if (error) {
      console.error('XTSY270 inquiry error:', error);
      
      if (error.message?.includes('rate limit') || error.message?.includes('too many')) {
        return { 
          success: false, 
          error: 'Too many requests. Please try again in a few minutes.' 
        };
      }
      
      throw error;
    }

    const bookingResult = typeof result === 'string' ? JSON.parse(result) : result;
    
    if (!bookingResult?.success) {
      return { 
        success: false, 
        error: bookingResult?.error || 'Failed to save inquiry' 
      };
    }

    console.log('XTSY270 inquiry saved via secure RPC:', bookingResult.booking_id);
    return { success: true, bookingId: bookingResult.booking_id };
  } catch (error: any) {
    console.error('Error saving XTSY270 inquiry:', error);
    return { success: false, error: error.message };
  }
}

// Save tour package inquiry using secure RPC function
export async function saveTourInquiry(data: TourBookingData) {
  try {
    // Validate input data
    const validation = validateTourInquiry({
      name: data.name,
      email: data.email,
      phone: data.phone,
      city: data.city,
      pincode: data.pincode,
      guests: data.guests,
      selectedDate: data.selectedDate,
      tourName: data.tourName,
    });

    if (!validation.success) {
      const errorMessages = Object.values(validation.errors || {}).join(', ');
      return { success: false, error: `Validation failed: ${errorMessages}` };
    }

    // Calculate estimated end date based on duration
    const startDate = new Date(data.selectedDate);
    const durationDays = parseInt(data.duration.match(/\d+/)?.[0] || '1');
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + durationDays);

    // Calculate total amount
    const totalAmount = data.basePrice * data.guests;

    // Use secure RPC function (includes rate limiting & fraud detection)
    const { data: result, error } = await supabase.rpc('create_booking_secure', {
      p_guest_name: data.name,
      p_email: data.email,
      p_whatsapp_number: data.phone.replace(/^\+91[\-\s]?/, ''),
      p_city: data.city || undefined,
      p_pincode: data.pincode || undefined,
      p_check_in: data.selectedDate,
      p_check_out: endDate.toISOString().split('T')[0],
      p_guests: data.guests,
      p_room_type: `Tour: ${data.tourName}`,
      p_room_type_id: 'tour-inquiry',
      p_quantity: 1,
      p_subtotal: totalAmount,
      p_taxes: 0,
      p_total_amount: totalAmount,
      p_special_requests: `[Tour Inquiry] ${data.tourName} | Category: ${data.category} | Duration: ${data.duration}`,
    });

    if (error) {
      console.error('Tour inquiry error:', error);
      
      if (error.message?.includes('rate limit') || error.message?.includes('too many')) {
        return { 
          success: false, 
          error: 'Too many requests. Please try again in a few minutes.' 
        };
      }
      
      throw error;
    }

    const bookingResult = typeof result === 'string' ? JSON.parse(result) : result;
    
    if (!bookingResult?.success) {
      return { 
        success: false, 
        error: bookingResult?.error || 'Failed to save tour inquiry' 
      };
    }

    console.log('Tour inquiry saved via secure RPC:', bookingResult.booking_id);
    return { success: true, bookingId: bookingResult.booking_id };
  } catch (error: any) {
    console.error('Error saving tour inquiry:', error);
    return { success: false, error: error.message };
  }
}
