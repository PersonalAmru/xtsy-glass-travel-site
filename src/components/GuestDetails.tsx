import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, User, Phone, MapPin, AlertTriangle, Calendar, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useApp } from "@/contexts/AppContext";
import { supabase } from "@/integrations/supabase/client";

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
      selection: { guests: number; rooms: number };
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

const GuestDetails = ({ isOpen, onClose, onBack, bookingData }: GuestDetailsProps) => {
  const [formData, setFormData] = useState({
    guestName: "",
    email: "",
    whatsappNumber: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    emergencyContact: "",
    emergencyRelation: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isHeaderCompact, setIsHeaderCompact] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastScrollTop = useRef(0);
  const { toast } = useToast();
  const { formatPrice } = useApp();

  // Calculate actual guests
  const actualGuests = bookingData.selectedRooms.reduce((total, room) => {
    if (room.type === "dorm") return total + room.selection.rooms;
    return total + room.selection.guests * room.selection.rooms;
  }, 0);
  const displayGuests = actualGuests > 0 ? actualGuests : bookingData.guests;

  // Compact header on scroll
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const handleScroll = () => {
      const st = el.scrollTop;
      const down = st > lastScrollTop.current;
      if (down && st > 100) setIsHeaderCompact(true);
      else if (!down && st < 50) setIsHeaderCompact(false);
      lastScrollTop.current = st;
    };
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  // Validation
  const validateEmail = (email: string) =>
    /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]+$/.test(email);
  const validatePhone = (phone: string) =>
    /^[\+]?[1-9][\d]{0,15}$/.test(phone.replace(/\s/g, ""));
  const sanitize = (s: string) => s.trim();

  const handleInputChange = (field: string, value: string) =>
    setFormData(prev => ({ ...prev, [field]: sanitize(value) }));

  const validateForm = () => {
    const req = ["guestName", "email", "whatsappNumber", "address", "city", "state", "pincode"] as const;
    const hasAll = req.every(f => formData[f].trim() !== "");
    if (!hasAll) return false;
    if (!validateEmail(formData.email)) return false;
    if (!validatePhone(formData.whatsappNumber)) return false;
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast({
        title: "Please fill all required fields",
        description: "All fields are mandatory except emergency contact information",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    // Silent log in Supabase (no user-facing errors)
    try {
      await supabase.from("logs").insert([
        {
          log_name: "Complete Booking via Whatsapp",
          payload: {
            guest: formData,
            bookingData,
            generatedAt: new Date().toISOString()
          }
        }
      ]);
    } catch (err) {
      console.error("Silent Supabase log failed:", err);
    }

    // Format message
    const formatDate = (d: string) =>
      new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });

    const roomDetails = bookingData.selectedRooms
      .map(r => `• ${r.name}: ${r.selection.rooms || r.selection.guests} × ${bookingData.nights} nights`)
      .join("\n");

    const whatsappMessage = `🏔️ *NEW BOOKING REQUEST* 🏔️

Hi ${formData.guestName},

👤 Guest: ${formData.guestName}
📧 Email: ${formData.email}
📱 Phone: ${formData.whatsappNumber}
🏠 Address: ${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}

🛏️ Stay:
• Check-in: ${formatDate(bookingData.checkIn)}
• Check-out: ${formatDate(bookingData.checkOut)}
• Nights: ${bookingData.nights}
• Guests: ${bookingData.guests}

${roomDetails}

💳 Total: ${formatPrice(bookingData.totalAmount)}

We’ll confirm availability & share payment details shortly.`;

    const whatsappURL = `https://wa.me/918837317070?text=${encodeURIComponent(whatsappMessage)}`;

    // Always redirect to WhatsApp
    window.open(whatsappURL, "_blank");

    // Clean up
    localStorage.removeItem("xtsy_current_booking");
    onClose();
    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full h-full max-w-none max-h-none md:max-w-2xl lg:max-w-3xl md:max-h-[95vh] md:h-auto bg-white border-0 p-0 overflow-hidden">
        <div className="flex flex-col h-full max-h-[100vh] md:max-h-[95vh]">
          {/* Header */}
          <div className={`flex-shrink-0 border-b bg-gradient-to-r from-orange-50 to-red-50 ${isHeaderCompact ? "p-2 md:p-3" : "p-4 md:p-6"}`}>
            <div className="flex items-center gap-3 mb-2">
              <Button variant="ghost" size="sm" onClick={onBack} className="p-2 text-gray-900 hover:bg-gray-100">
                <ArrowLeft className="h-5 w-5 text-gray-900" />
              </Button>
              <DialogTitle className={`font-bold text-gray-900 ${isHeaderCompact ? "text-lg md:text-xl" : "text-xl md:text-2xl"}`}>
                Booking Summary and Guest Details
              </DialogTitle>
            </div>

            {/* Quick summary */}
            <div className={`bg-white rounded-lg shadow-sm ${isHeaderCompact ? "p-2 mt-2" : "p-3 mt-4"}`}>
              <div className={`grid gap-3 ${isHeaderCompact ? "grid-cols-4 text-xs" : "grid-cols-2 md:grid-cols-4 text-sm"}`}>
                <div className="flex items-center gap-2">
                  <Calendar className={`text-orange-500 ${isHeaderCompact ? "h-3 w-3" : "h-4 w-4"}`} />
                  <div>
                    <div className="text-gray-700 font-medium">Check-in</div>
                    <div className="font-semibold text-gray-900">{new Date(bookingData.checkIn).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className={`text-orange-500 ${isHeaderCompact ? "h-3 w-3" : "h-4 w-4"}`} />
                  <div>
                    <div className="text-gray-700 font-medium">Check-out</div>
                    <div className="font-semibold text-gray-900">{new Date(bookingData.checkOut).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className={`text-orange-500 ${isHeaderCompact ? "h-3 w-3" : "h-4 w-4"}`} />
                  <div>
                    <div className="text-gray-700 font-medium">Guests</div>
                    <div className="font-semibold text-gray-900">{displayGuests}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className={`text-orange-500 ${isHeaderCompact ? "h-3 w-3" : "h-4 w-4"}`} />
                  <div>
                    <div className="text-gray-700 font-medium">Nights</div>
                    <div className="font-semibold text-gray-900">{bookingData.nights}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scrollable Form */}
          <div ref={scrollContainerRef} className="flex-1 overflow-y-auto min-h-0">
            <div className="p-4 md:p-6 space-y-6 pb-40 md:pb-6">
              {/* Guest Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <User className="h-5 w-5 text-orange-500" />
                  Primary Guest Information *
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="guestName">Full Name *</Label>
                    <Input id="guestName" value={formData.guestName} onChange={e => handleInputChange("guestName", e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" value={formData.email} onChange={e => handleInputChange("email", e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="whatsappNumber">WhatsApp Number *</Label>
                    <Input id="whatsappNumber" value={formData.whatsappNumber} onChange={e => handleInputChange("whatsappNumber", e.target.value)} />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-orange-500" />
                  Address Information *
                </h3>
                <Input id="address" value={formData.address} onChange={e => handleInputChange("address", e.target.value)} placeholder="Address" />
              </div>

              {/* Emergency (optional) */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Emergency Contact
                </h3>
                <Input id="emergencyContact" value={formData.emergencyContact} onChange={e => handleInputChange("emergencyContact", e.target.value)} placeholder="Contact" />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex-shrink-0 p-4 md:p-6 border-t bg-gray-50 fixed bottom-0 left-0 right-0 z-50">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !validateForm()}
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-3 text-lg"
            >
              {isSubmitting ? "Processing..." : "Complete Booking via WhatsApp"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GuestDetails;
