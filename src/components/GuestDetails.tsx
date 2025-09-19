import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useApp } from "@/contexts/AppContext";
import { GuestDetailsHeader } from "./guest-details/GuestDetailsHeader";
import { GuestDetailsForm } from "./guest-details/GuestDetailsForm";
import { useGuestDetailsForm } from "./guest-details/useGuestDetailsForm";
import { cashfreeService } from "@/services/cashfreePayment";

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
    if (!validateForm()) {
      toast({
        title: "Please fill all required fields",
        description: "All fields are mandatory except emergency contact information.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create payment session with Cashfree
      const paymentUrl = await cashfreeService.createPaymentSession(bookingData, formData);
      
      toast({
        title: "Redirecting to Payment Gateway",
        description: "Please complete your payment to confirm booking.",
      });

      // Redirect to Cashfree payment gateway
      window.location.href = paymentUrl;
      
    } catch (error) {
      console.error('Payment initiation error:', error);
      toast({
        title: "Payment Error",
        description: "Failed to initiate payment. Please try again.",
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
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
            {isSubmitting ? "Redirecting to Payment..." : validateForm() ? "Proceed to Payment" : "Please fill all required fields"}
          </Button>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Your payment information is processed securely through Cashfree. Your booking will be confirmed upon successful payment.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GuestDetails;
