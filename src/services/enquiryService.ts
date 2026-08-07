import { supabase } from '@/integrations/supabase/client';

export interface EnquiryData {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestAddress?: string;
  guestCity?: string;
  guestState?: string;
  guestPincode?: string;
  checkIn: string;
  checkOut: string;
  roomName: string;
  roomType: string;
  quantity: number;
  nights: number;
  ratePerNight: number;
  subtotal: number;
  gstRate: number;
  gstAmount: number;
  totalAmount: number;
  specialRequests?: string;
  userId?: string;
}

export interface Enquiry {
  id: string;
  enquiry_id: string;
  guest_name: string;
  email: string;
  phone: string;
  check_in: string;
  check_out: string;
  room_type: string;
  room_name: string;
  quantity: number;
  nights: number;
  rate_per_night: number;
  subtotal: number;
  gst_rate: number;
  gst_amount: number;
  total_amount: number;
  status: string;
  created_at: string;
  special_requests?: string;
}

export interface CreateEnquiryResponse {
  success: boolean;
  enquiryId?: string;
  enquiryUUID?: string;
  error?: string;
}

export async function createEnquiry(data: EnquiryData): Promise<CreateEnquiryResponse> {
  try {
    const { data: result, error } = await supabase.rpc('create_enquiry', {
      p_guest_name: data.guestName,
      p_email: data.guestEmail,
      p_phone: data.guestPhone,
      p_check_in: data.checkIn,
      p_check_out: data.checkOut,
      p_room_type: data.roomType,
      p_room_name: data.roomName,
      p_quantity: data.quantity,
      p_nights: data.nights,
      p_rate_per_night: data.ratePerNight,
      p_subtotal: data.subtotal,
      p_gst_rate: data.gstRate,
      p_gst_amount: data.gstAmount,
      p_total_amount: data.totalAmount,
      p_address: data.guestAddress || null,
      p_city: data.guestCity || null,
      p_state: data.guestState || null,
      p_pincode: data.guestPincode || null,
      p_special_requests: data.specialRequests || null,
      p_user_id: data.userId || null,
    });

    if (error) {
      console.error('Enquiry creation error:', error);
      return { success: false, error: error.message };
    }

    if (result && result[0]) {
      return {
        success: true,
        enquiryId: result[0].enquiry_id,
        enquiryUUID: result[0].enquiry_uuid,
      };
    }

    return { success: false, error: 'No enquiry ID returned' };
  } catch (error) {
    console.error('Enquiry service error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create enquiry',
    };
  }
}

export async function getEnquiries(status?: string) {
  let query = supabase
    .from('enquiries')
    .select('*')
    .order('created_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;
  return { data, error };
}

export async function approveEnquiry(enquiryUUID: string, adminId: string) {
  const { data, error } = await supabase.rpc('approve_enquiry', {
    p_enquiry_uuid: enquiryUUID,
    p_admin_id: adminId,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return {
    success: true,
    bookingId: data?.[0]?.booking_id,
    invoiceNumber: data?.[0]?.invoice_number,
  };
}

export async function rejectEnquiry(enquiryUUID: string, adminId: string, reason: string) {
  const { error } = await supabase
    .from('enquiries')
    .update({
      status: 'rejected',
      rejected_at: new Date().toISOString(),
      rejected_by: adminId,
      rejection_reason: reason,
      updated_at: new Date().toISOString(),
    })
    .eq('id', enquiryUUID);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}
