import { supabase } from '@/integrations/supabase/client';

export interface TourEnquiryData {
  packageTitle: string;
  packageDuration: string;
  packageDifficulty: string;
  packageCategory: string;
  packageLocation: string;
  travellers: number;
  preferredDate: string;
  groupType: string;
  perPersonPrice: number;
  totalAmount: number;
  guestName: string;
  email: string;
  whatsappNumber: string;
  city?: string;
  specialRequests?: string;
  userId?: string;
}

export interface TourEnquiryResponse {
  success: boolean;
  enquiryId?: string;
  error?: string;
}

function generateTourEnquiryId(): string {
  const prefix = 'XTSY-T';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

export async function createTourEnquiry(data: TourEnquiryData): Promise<TourEnquiryResponse> {
  try {
    const enquiryId = generateTourEnquiryId();

    const { error } = await supabase
      .from('tour_enquiries' as any)
      .insert({
        enquiry_id: enquiryId,
        package_title: data.packageTitle,
        package_duration: data.packageDuration,
        package_difficulty: data.packageDifficulty,
        package_category: data.packageCategory,
        package_location: data.packageLocation,
        travellers: data.travellers,
        preferred_date: data.preferredDate,
        group_type: data.groupType,
        per_person_price: data.perPersonPrice,
        total_amount: data.totalAmount,
        guest_name: data.guestName,
        email: data.email,
        whatsapp_number: data.whatsappNumber,
        city: data.city || null,
        special_requests: data.specialRequests || null,
        user_id: data.userId || null,
        status: 'pending',
      } as any);

    if (error) {
      console.error('Tour enquiry insert error:', error);
      return { success: false, error: error.message };
    }

    // Fire GTM event
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: 'tour_booking_submitted',
        tour_package: data.packageTitle,
        tour_location: data.packageLocation,
        travellers: data.travellers,
        total_value: data.totalAmount,
        currency: 'INR',
        enquiry_id: enquiryId,
      });
    }

    return { success: true, enquiryId };
  } catch (err: any) {
    console.error('Tour booking service error:', err);
    return { success: false, error: err.message || 'Unknown error' };
  }
}
