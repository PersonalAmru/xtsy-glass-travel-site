import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useApp } from "@/contexts/AppContext";
import { supabase } from "@/integrations/supabase/client";
import { GuestDetailsHeader } from "./guest-details/GuestDetailsHeader";
import { GuestDetailsForm } from "./guest-details/GuestDetailsForm";
import { useGuestDetailsForm } from "./guest-details/useGuestDetailsForm";

/**
 * Props definition for the GuestDetails component. It accepts the booking data
 * along with callbacks to close or navigate back.
 */
interface GuestDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  bookingData: {
    checkIn: string;
    checkOut: string;
    guests: number;
    nights: number;
    selectedRooms: Array<{
      id: string;
      name: string;
      price: number;
      type: string;
      selection: {
        guests: number;
        rooms: number;
      };
    }>;
    totalAmount: number;
    gstAmount: number;
    subtotal: number;
    discountAmount: number;
    couponCode: string;
    couponDiscount: number;
    addOns?: {
      breakfast: number;
      dinnerVeg: number;
      dinnerNonVeg: number;
      transportation: boolean;
      itineraryPlanning: boolean;
    };
  };
}

/**
 * GuestDetails renders the booking summary and collects guest details. When
 * submitted, it logs the CTA click to Supabase’s `cta_logs` table and then
 * opens WhatsApp with a prefilled message. Any logging errors are caught
 * silently to ensure the redirect always happens.
 */
export const GuestDetails = ({
  isOpen,
  onClose,
  onBack,
  bookingData,
}: GuestDetailsProps) => {
  const { formData, handleInputChange, validateForm } = useGuestDetailsForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isHeaderCompact, setIsHeaderCompact] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastScrollTop = useRef(0);
  const { toast } = useToast();
  const { formatPrice } = useApp();

  // Derive the number of guests based on selected rooms
  const actualGuests = bookingData.selectedRooms.reduce((total, room) => {
    if (room.type === "dorm") return total + room.selection.rooms;
    return total + room.selection.guests * room.selection.rooms;
  }, 0);
  const displayGuests = actualGuests > 0 ? actualGuests : bookingData.guests;

  // Shrink the header on scroll
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const onScroll = () => {
      const st = el.scrollTop;
      const down = st > lastScrollTop.current;
      if (down && st > 100) setIsHeaderCompact(true);
      else if (!down && st < 50) setIsHeaderCompact(false);
      lastScrollTop.current = st;
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // Format date in Indian locale
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  // Build WhatsApp message from booking and guest details
  const buildWhatsappMessage = () => {
    const roomLines = bookingData.selectedRooms.map((r) => {
      const qty = r.selection.rooms || r.selection.guests;
      return `• ${r.name}: ${qty} × ${bookingData.nights} night${
        bookingData.nights > 1 ? "s" : ""
      }`;
    });
    return `🏔️ *NEW BOOKING REQUEST* 🏔️\n\n` +
      `👤 Name: ${formData.guestName}\n` +
      `📧 Email: ${formData.email}\n` +
      `📱 Phone: ${formData.whatsappNumber}\n` +
      `🏠 Address: ${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}` +
      `${formData.emergencyContact ? `\n🆘 Emergency: ${formData.emergencyContact}${formData.emergencyRelation ? ` (${formData.emergencyRelation})` : ""}` : ""}` +
      `\n\n🛏️ Stay:\n` +
      `• Check-in: ${formatDate(bookingData.checkIn)}\n` +
      `• Check-out: ${formatDate(bookingData.checkOut)}\n` +
      `• Nights: ${bookingData.nights}\n` +
      `• Guests: ${displayGuests}\n\n` +
      `Room Selection:\n${roomLines.join("\n")}\n\n` +
      `💳 Total: ${formatPrice(bookingData.totalAmount)}\n\n` +
      `Please confirm availability and share the payment details.`;
  };

  // Handle form submission: validate, log CTA, open WhatsApp, clean up
  const handleSubmit = async () => {
    if (!validateForm()) {
      toast({
        title: "Please fill all required fields",
        description:
          "All fields are mandatory except emergency contact information.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    // Silent insert into cta_logs; do not block redirect
    try {
      await supabase.from("cta_logs").insert([
        { cta_name: "CompleteBookingViaWhatsApp", clicked_at: new Date().toISOString() },
      ]);
    } catch (err) {
      console.error("Silent Supabase log failed:", err);
    }
    const whatsappMessage = buildWhatsappMessage();
    const whatsappURL = `https://wa.me/918837317070?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappURL, "_blank", "noopener,noreferrer");
    // Clean up and close after short delay
    try {
      localStorage.removeItem("xtsy_current_booking");
    } catch {}
    setTimeout(() => {
      onClose();
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* Constrain height and keep internals scrollable */}
      <DialogContent className="w-full md:max-w-2xl lg:max-w-3xl max-h-[95vh] h-full flex flex-col overflow-hidden">
        <GuestDetailsHeader
          isCompact={isHeaderCompact}
          onBack={onBack}
          bookingData={bookingData}
          displayGuests={displayGuests}
        />
        {/* Scrollable content */}
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto min-h-0">
          <div className="p-4 md:p-6 space-y-6 pb-4">
            <GuestDetailsForm formData={formData} onInputChange={handleInputChange} />
          </div>
        </div>
        {/* Sticky footer (CTA button) */}
        <div className="flex-shrink-0 border-t bg-gray-50 p-4 sticky bottom-0">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !validateForm()}
            className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-3 text-lg"
          >
            {isSubmitting ? "Processing..." : "Complete Booking via WhatsApp"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
