import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useApp } from "@/contexts/AppContext";
import { GuestDetailsHeader } from "./guest-details/GuestDetailsHeader";
import { GuestDetailsForm } from "./guest-details/GuestDetailsForm";
import { useGuestDetailsForm } from "./guest-details/useGuestDetailsForm";
import { supabase } from "@/integrations/supabase/client";
import BookingSuccessModal from "./BookingSuccessModal";

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
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [bookingId, setBookingId] = useState<string>('');

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
    if (!validateForm()) {
      toast({
        title: "Please fill all required fields",
        description: "All fields are mandatory.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Save booking to database
      const { data: saveBookingResponse, error: saveBookingError } = await supabase.functions.invoke('save-booking', {
        body: {
          bookingData,
          guestDetails: formData
        }
      });

      if (saveBookingError) {
        throw new Error(saveBookingError.message);
      }

      const { bookingId: newBookingId } = saveBookingResponse;
      setBookingId(newBookingId);

      // Send WhatsApp message
      const roomsText = bookingData.selectedRooms.map(room => 
        `${room.name} (${room.selection.rooms} ${room.type === 'dorm' ? 'bed(s)' : 'room(s)'})`
      ).join(', ');

      await supabase.functions.invoke('send-whatsapp-booking', {
        body: {
          bookingId: newBookingId,
          guestName: formData.guestName,
          phone: formData.whatsappNumber,
          checkIn: bookingData.checkIn,
          checkOut: bookingData.checkOut,
          rooms: roomsText,
          totalAmount: bookingData.totalAmount
        }
      });

      toast({
        title: "Booking Submitted Successfully!",
        description: "We'll contact you shortly with payment details.",
      });

      // Show success modal
      setShowSuccessModal(true);
      
    } catch (error) {
      console.error('Booking submission error:', error);
      toast({
        title: "Booking Error",
        description: "Failed to submit booking. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    onClose(); // Close the guest details modal
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
            className={`w-full font-bold py-3 text-lg transition-all duration-300 ${
              validateForm() && !isSubmitting
                ? "bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isSubmitting ? "Submitting..." : validateForm() ? "Pay & Confirm" : "Please fill all required fields"}
          </Button>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            We'll contact you shortly with payment details and booking confirmation.
          </p>
        </div>
      </DialogContent>

      {/* Success Modal */}
      <BookingSuccessModal 
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        bookingId={bookingId}
        guestName={formData.guestName}
      />
    </Dialog>
  );
};

export default GuestDetails;
