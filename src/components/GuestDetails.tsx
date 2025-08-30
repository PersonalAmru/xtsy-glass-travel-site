import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useApp } from "@/contexts/AppContext";
import { supabase } from "@/integrations/supabase/client";
import { GuestDetailsHeader } from "./guest-details/GuestDetailsHeader";
import { GuestDetailsForm } from "./guest-details/GuestDetailsForm";
import { useGuestDetailsForm } from "./guest-details/useGuestDetailsForm";

interface SelectedRoom {
  id: string;
  name: string;
  price: number;
  type: string; // 'dorm' | 'private'
  selection: {
    guests: number;
    rooms: number;
  };
}

interface BookingData {
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  selectedRooms: SelectedRoom[];
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
}

interface GuestDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  bookingData: BookingData;
}

const GuestDetails = ({ isOpen, onClose, onBack, bookingData }: GuestDetailsProps) => {
  const { formData, handleInputChange, validateForm } = useGuestDetailsForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isHeaderCompact, setIsHeaderCompact] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastScrollTop = useRef(0);
  const { toast } = useToast();
  const { formatPrice } = useApp();

  // Derive actual guests from selected rooms (dorm beds vs private rooms)
  const actualGuests = bookingData.selectedRooms.reduce((total, room) => {
    if (room.type === "dorm") return total + room.selection.rooms;
    return total + room.selection.guests * room.selection.rooms;
  }, 0);
  const displayGuests = actualGuests > 0 ? actualGuests : bookingData.guests;

  // Compact header on scroll
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


  const handleSubmit = async () => {
    console.log("Form data:", formData);
    console.log("Form validation result:", validateForm());
    
    if (!validateForm()) {
      console.log("Form validation failed");
      toast({
        title: "Please fill all required fields",
        description: "All fields are mandatory except emergency contact information.",
        variant: "destructive"
      });
      return;
    }

    console.log("Form validation passed, proceeding with WhatsApp redirect");
    setIsSubmitting(true);

    // 1) Silent log in Supabase — do not block, no user-facing errors
    try {
      await supabase.from("whatsapp_logs").insert([
        {
          type: "booking",
          phone: formData.whatsappNumber,
          email: formData.email,
          message: "Complete Booking via WhatsApp",
          created_at: new Date().toISOString()
        }
      ]); // Note: returning: 'minimal' not supported in current client version
    } catch (err) {
      // Stay silent for guests
      console.error("Silent Supabase log failed:", err);
    }

    // 2) Build WhatsApp message
    const formatDate = (d: string) =>
      new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });

    const roomLines = bookingData.selectedRooms.map(r => {
      const qty = r.selection.rooms || r.selection.guests;
      return `• ${r.name}: ${qty} × ${bookingData.nights} night${bookingData.nights > 1 ? "s" : ""}`;
    });

    const whatsappMessage = `🏔️ *NEW BOOKING REQUEST* 🏔️

👤 Name: ${formData.guestName}
📧 Email: ${formData.email}
📱 Phone: ${formData.whatsappNumber}
🏠 Address: ${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}${formData.emergencyContact ? `\n🆘 Emergency: ${formData.emergencyContact}${formData.emergencyRelation ? ` (${formData.emergencyRelation})` : ""}` : ""}

🛏️ Stay:
• Check-in: ${formatDate(bookingData.checkIn)}
• Check-out: ${formatDate(bookingData.checkOut)}
• Nights: ${bookingData.nights}
• Guests: ${displayGuests}

Room Selection:
${roomLines.join("\n")}

💳 Total: ${formatPrice(bookingData.totalAmount)}

Please confirm availability and share the payment details.`;

    const whatsappURL = `https://wa.me/918837317070?text=${encodeURIComponent(whatsappMessage)}`;

    console.log("WhatsApp URL:", whatsappURL);
    console.log("Opening WhatsApp...");

    // 3) Redirect to WhatsApp (always)
    window.open(whatsappURL, "_blank", "noopener,noreferrer");

    // 4) Cleanup & close
    try {
      localStorage.removeItem("xtsy_current_booking");
    } catch {}
    
    // Don't close immediately, give user time to see WhatsApp opened
    setTimeout(() => {
      onClose();
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* Constrain height & keep internals scrollable */}
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
            <GuestDetailsForm 
              formData={formData}
              onInputChange={handleInputChange}
            />
          </div>
        </div>

        {/* Sticky Footer (clickable and always visible) */}
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

export default GuestDetails;
