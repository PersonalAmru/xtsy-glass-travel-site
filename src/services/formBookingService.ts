import { supabase } from "@/integrations/supabase/client";

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

// Save WhatsApp booking form data
export async function saveWhatsAppBooking(data: WhatsAppBookingData) {
  try {
    // Generate a unique booking ID
    const bookingId = `WA-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    console.log('Attempting to save booking:', { bookingId, data });
    
    const { data: booking, error } = await supabase
      .from('bookings')
      .insert({
        booking_id: bookingId,
        guest_name: data.name || 'Guest',
        email: data.email || 'not-provided@example.com',
        whatsapp_number: data.phone || '0000000000',
        city: data.city || null,
        pincode: data.pincode || null,
        check_in: data.checkIn || new Date().toISOString().split('T')[0],
        check_out: data.checkOut || new Date(Date.now() + 86400000).toISOString().split('T')[0],
        guests: data.guests || 1,
        special_requests: data.specialRequests || null,
        room_type: data.selectedRooms.length > 0 
          ? data.selectedRooms.map(r => r.roomTypeName).join(', ')
          : 'Not specified',
        room_type_id: data.selectedRooms.length > 0 
          ? data.selectedRooms[0].roomTypeId 
          : null,
        quantity: data.selectedRooms.reduce((sum, room) => sum + room.quantity, 0) || 1,
        total_amount: data.totalAmount || 0,
        subtotal: data.totalAmount || 0,
        taxes: 0,
        booking_status: 'inquiry',
        payment_status: 'pending',
        source: 'whatsapp_form'
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      throw error;
    }
    
    console.log('Booking saved successfully:', booking);
    return { success: true, bookingId: booking?.id };
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
