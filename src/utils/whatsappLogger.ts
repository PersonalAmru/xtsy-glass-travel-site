import { supabase } from "@/integrations/supabase/client";

export interface WhatsAppLogEntry {
  type: 'booking' | 'travel' | 'group' | 'xtsy270' | 'contact';
  phone?: string;
  email?: string;
  message: string;
  ip_address?: string;
}

/**
 * Silent logging utility for WhatsApp interactions.
 * Logs data to Supabase without blocking user experience.
 */
export const logWhatsAppInteraction = async (
  logEntry: WhatsAppLogEntry
): Promise<void> => {
  try {
    const { error } = await supabase
      .from("whatsapp_logs")
      .insert([{ ...logEntry, created_at: new Date().toISOString() }]);
    if (error) {
      console.warn("WhatsApp logging failed:", error);
    }
  } catch (error) {
    console.warn("WhatsApp logging error:", error);
  }
};

/**
 * Open WhatsApp with formatted message and log the interaction.
 * Opens the new tab immediately and then logs asynchronously (non-blocking).
 *
 * @param message     Preformatted WhatsApp text.
 * @param logEntry    Data you wish to save in Supabase.
 * @param phoneNumber WhatsApp number to dial (default is the XTSY booking number).
 */
export function openWhatsAppWithLogging(
  message: string,
  logEntry: WhatsAppLogEntry,
  phoneNumber: string = "918837317070"
): void {
  const encodedMessage = encodeURIComponent(message);
  const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  // 1) Open WhatsApp immediately to avoid popup blockers
  if (typeof window !== "undefined") {
    window.open(whatsappURL, "_blank", "noopener,noreferrer");
  }

  // 2) Log in the background (do not await)
  logWhatsAppInteraction(logEntry).catch(() => {
    /* swallow errors to keep UX smooth */
  });
}

/**
 * Generate WhatsApp message for booking.
 */
export const generateBookingMessage = (params: {
  roomType?: string;
  guests: number;
  checkIn: string;
  checkOut: string;
  nights: number;
  totalPrice?: number;
  guestName?: string;
  email?: string;
  phone?: string;
  address?: string;
}): string => {
  return `Hello XTSY Team, I'd like to book:

🏨 *BOOKING DETAILS:*
Room Type: ${params.roomType || "XTSY Accommodation"}
Guests: ${params.guests}
Dates: ${params.checkIn} – ${params.checkOut} (${params.nights} nights)
Total: ₹${params.totalPrice?.toLocaleString() || "TBD"}

👤 *MY DETAILS:*
Name: ${params.guestName || "To be provided"}
Email: ${params.email || "To be provided"}
Phone: ${params.phone || "To be provided"}
Address: ${params.address || "To be provided"}

Please confirm availability and provide final booking confirmation.
Thank you!`;
};

/**
 * Generate WhatsApp message for XTSY 270°.
 */
export const generateXTSY270Message = (params: {
  state: string;
  mobile: string;
  email: string;
}): string => {
  return `🏔️ *XTSY 270° Panorama Glass Suite Inquiry* 🏔️

Hi XTSY Team! ✨

I'm interested in reserving the XTSY 270° - India's first panoramic glass house experience!

👤 *My Details:*
State: ${params.state}
Mobile: ${params.mobile}
Email: ${params.email}

🏨 *Property Details:*
• XTSY 270° Panorama Glass Ensuite
• Only 1 suite available per night in India
• Exclusive signature stay – limited edition

💰 *Current Interest:*
• Weekday rates and availability
• Weekend rates and availability  
• Special packages or add-on services

Only one suite available per night in India — I want to reserve it before it's gone!

Looking forward to experiencing this incredible architectural marvel! 🌿

Thank you! 😊`;
};

/**
 * Generate WhatsApp message for travel inquiries.
 */
export const generateTravelMessage = (params: {
  tourName: string;
  guestName: string;
  phone: string;
  startDate: string;
  guests: number;
  emergencyContact?: string;
  addOns?: string[];
}): string => {
  const addOnText = params.addOns?.length
    ? `\n\nAdd-ons Interested:\n${params.addOns.join(", ")}`
    : "";

  return `🌄 *XTSY Travel Package Inquiry* 🌄

Hi XTSY Team! 

I'm interested in booking your travel package:

📍 *Tour Package:* ${params.tourName}

👤 *My Details:*
Name: ${params.guestName}
Phone: ${params.phone}
Guests: ${params.guests}
Preferred Start Date: ${params.startDate}
Emergency Contact: ${params.emergencyContact || "To be provided"}${addOnText}

Could you please provide:
• Complete itinerary details
• Pricing breakdown
• Availability confirmation
• Booking process

Looking forward to exploring with XTSY! 🎒

Thank you! 😊`;
};
