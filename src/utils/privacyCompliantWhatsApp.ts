/**
 * Privacy-compliant WhatsApp utilities for EU compliance
 * No PII logging, no tracking, user-initiated only
 */

/**
 * Open WhatsApp with formatted message - NO LOGGING
 * Pure client-side action with privacy notice
 */
export function openWhatsAppDirectly(
  message: string,
  phoneNumber: string = "918837317070"
): void {
  const encodedMessage = encodeURIComponent(message);
  const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  // Open WhatsApp immediately - no tracking or logging
  if (typeof window !== "undefined") {
    window.open(whatsappURL, "_blank", "noopener,noreferrer");
  }
}

/** Page metadata only; never forward query parameters or referrer identifiers. */
export function bookingPageSource(): string {
  if (typeof window === 'undefined') return 'XTSY booking';
  return `${document.title || 'XTSY booking'} — ${window.location.origin}${window.location.pathname}`;
}

/**
 * Generate WhatsApp message for booking - privacy compliant
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
  city?: string;
  state?: string;
  pincode?: string;
  specialRequests?: string;
  reference?: string;
  source?: string;
}): string => {
  return `Namaste XTSY Team! I'd like to enquire about a stay:

🏨 *BOOKING DETAILS:*
Room Type: ${params.roomType || "XTSY Accommodation"}
Guests: ${params.guests}
Dates: ${params.checkIn} – ${params.checkOut} (${params.nights} nights)
Estimated total: ₹${params.totalPrice?.toLocaleString('en-IN') || "TBD"}

👤 *MY DETAILS:*
Name: ${params.guestName || "To be provided"}
Email: ${params.email || "To be provided"}
Phone: ${params.phone || "To be provided"}
Address: ${params.address || "To be provided"}
City / State / PIN: ${[params.city, params.state, params.pincode].filter(Boolean).join(', ') || 'Not provided'}
${params.specialRequests ? `Requests: ${params.specialRequests}\n` : ''}${params.reference ? `Enquiry ID: ${params.reference}\n` : ''}${params.source ? `Page: ${params.source}\n` : ''}

Please confirm availability and provide final booking confirmation.
Thank you!`;
};

/**
 * Generate WhatsApp message for XTSY 270°
 */
export const generateXTSY270Message = (params: {
  state: string;
  city: string;
  pincode: string;
  mobile: string;
  email: string;
}): string => {
  return `🏔️ *XTSY Experience by XTSY Inquiry* 🏔️

Hi XTSY Team! ✨

I'm interested in reserving the XTSY 270° - India's first panoramic glass house experience!

👤 *My Details:*
State: ${params.state}
City: ${params.city}
Pincode: ${params.pincode}
Mobile: ${params.mobile}
Email: ${params.email}

🏨 *Property Details:*
• Experience by XTSY (270° panoramic glass suite)
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
 * Generate WhatsApp message for travel inquiries
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

/**
 * Privacy notice component text
 */
export const PRIVACY_NOTICE = "Opens WhatsApp. You control what you send. We don't store this.";