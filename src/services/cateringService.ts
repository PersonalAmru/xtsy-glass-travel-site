import { supabase } from "@/integrations/supabase/client";

export interface CateringEnquiryInput {
  fullName: string;
  phone: string;
  email?: string;
  eventType: string;
  eventDate?: string;
  guestCount?: number;
  cuisinePreferences?: string;
  message?: string;
}

export async function createCateringEnquiry(
  input: CateringEnquiryInput
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from("catering_enquiries").insert({
      full_name: input.fullName.trim().slice(0, 120),
      phone: input.phone.trim().slice(0, 20),
      email: input.email?.trim() || null,
      event_type: input.eventType,
      event_date: input.eventDate || null,
      guest_count: input.guestCount ?? null,
      cuisine_preferences: input.cuisinePreferences?.trim() || null,
      message: input.message?.trim().slice(0, 2000) || null,
      status: "new",
    });
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Submission failed" };
  }
}
