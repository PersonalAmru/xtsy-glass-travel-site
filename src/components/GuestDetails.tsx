import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useApp } from "@/contexts/AppContext";
import { useGuestDetailsForm } from "./guest-details/useGuestDetailsForm";
import { GuestDetailsHeader } from "./guest-details/GuestDetailsHeader";
import { GuestDetailsForm } from "./guest-details/GuestDetailsForm";
import { openWhatsAppWithLogging } from "@/utils/whatsappLogger";

// Types for the component props and booking data
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

const GuestDetails = ({
  isOpen,
  onClose,
  onBack,
  bookingData,
}: GuestDetailsProps) => {
  const { formData, handleInputChange, validateForm } = useGuestDetailsForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isHeaderCompact, setIsHeaderCompact] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const lastScrollTop = useRef(0);
  const { toast } = useToast();
  const { formatPrice } = useApp();

  // Derive actual guests from selected rooms (dorm beds vs private rooms)
  const actualGuests = bookingData.selectedRooms.reduce((total, room) => {
    if (room.type === "dorm") return total + room.selection.rooms;
    return total + room.selection.guests * room.selection.rooms;
  }, 0);
  const displayGuests =
    actualGuests > 0 ? actualGuests : bookingData.guests;

  // Compact the header as the user scrolls down
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

  // Handle submit and redirect to WhatsApp
  const handleSubmit = () => {
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

    // Format the booking details into a WhatsApp message
    const formatDate = (d: string) =>
      new Date(d).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });

    const roomLines = bookingData.selectedRooms.map((r) => {
      const qty = r.selection.rooms || r.selection.guests;
      return `• ${r.name}: ${qty} × ${bookingData.nights} night${
        bookingData.nights > 1 ? "s" : ""
      }`;
      });
    const whatsappMessage = `🏔️ *NEW BOOKING REQUEST* 🏔️

👤 Name: ${formData.guestName}
📧 Email: ${formData.email}
📱 Phone: ${formData.whatsappNumber}
🏠 Address: ${formData.address}, ${formData.city}, ${
      formData.state
    } - ${formData.pincode}${
      formData.emergencyContact
        ? `\n🆘 Emergency: ${formData.emergencyContact}${
            formData.emergencyRelation
              ? ` (${formData.emergencyRelation})`
              : ""
          }`
        : ""
    }

🛏️ Stay:
• Check-in: ${formatDate(bookingData.checkIn)}
• Check-out: ${formatDate(bookingData.checkOut)}
• Nights: ${bookingData.nights}
• Guests: ${displayGuests}

Room Selection:
${roomLines.join("\n")}

💳 Total: ${formatPrice(bookingData.totalAmount)}

Please confirm availability and share the payment details.`;

    // Build log data for Supabase
    const logEntry = {
      type: "booking" as const,
      phone: formData.whatsappNumber,
      email: formData.email,
      message: "Complete Booking via WhatsApp",
    };

    // Open WhatsApp immediately and log in background
    openWhatsAppWithLogging(
      whatsappMessage,
      logEntry,
      "918837317070"
    );

    // Clean up local storage
    try {
      localStorage.removeItem("xtsy_current_booking");
    } catch (err) {
      // ignore
    }

    // Close the modal and reset state without delay
    onClose();
    setIsSubmitting(false);
  };

  // Button disabled state
  const isDisabled = isSubmitting || !validateForm();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl p-0">
        {/* Header */}
        <GuestDetailsHeader
          compact={isHeaderCompact}
          onBack={onBack}
        />

        {/* Scrollable body */}
        <div
          ref={scrollContainerRef}
          className="flex-grow overflow-y-auto px-4 py-4"
          style={{ maxHeight: "70vh" }}
        >
          <GuestDetailsForm
            formData={formData}
            onInputChange={handleInputChange}
          />
        </div>

        {/* Sticky footer */}
        <div className="border-t px-4 py-4">
          <Button
            onClick={handleSubmit}
            disabled={isDisabled}
            className="w-full"
            aria-busy={isSubmitting}
          >
            {isSubmitting
              ? "Processing..."
              : "Complete Booking via WhatsApp"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GuestDetails;
