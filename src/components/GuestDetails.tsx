
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, User, Mail, Phone, MapPin, AlertTriangle, Calendar, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import UPIPaymentModal from "./UPIPaymentModal";

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
  const { toast } = useToast();

  // Validate email format
  const validateEmail = (email: string) => {
    const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]+$/;
    return emailRegex.test(email);
  };

  // Validate phone number
  const validatePhone = (phone: string) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  // Sanitize input to prevent XSS
  const sanitizeInput = (input: string) => {
    return input.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  };

  const handleInputChange = (field: string, value: string) => {
    const sanitizedValue = sanitizeInput(value);
    setFormData(prev => ({ ...prev, [field]: sanitizedValue }));
  };

  const validateForm = () => {
    // All fields are mandatory except emergency contact fields
    const requiredFields = ['guestName', 'email', 'whatsappNumber', 'address', 'city', 'state', 'pincode'];
    const hasRequiredFields = requiredFields.every(field => formData[field as keyof typeof formData].trim() !== '');
    
    if (!hasRequiredFields) return false;
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

    // Directly redirect to WhatsApp without payment processing
    const formatDate = (dateStr: string) => {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    };

    // Format room details for WhatsApp message
    const roomDetails = bookingData.selectedRooms.map(room => {
      const isDorm = room.name.toLowerCase().includes('dorm');
      const selection = room.selection;
      const nights = bookingData.nights;
      
      if (isDorm) {
        return `${room.name}: ${selection.guests} beds × ${nights} nights = ₹${room.price * selection.guests * nights}`;
      } else {
        return `${room.name}: ${selection.rooms} rooms × ${nights} nights = ₹${room.price * selection.rooms * nights}`;
      }
    }).join('\n');

    const discountText = bookingData.discountAmount > 0 
      ? `\nDiscount (${bookingData.couponCode}): -₹${bookingData.discountAmount}`
      : '';

    // Include emergency contact if provided
    const emergencyContactText = formData.emergencyContact && formData.emergencyRelation 
      ? `\nEmergency Contact: ${formData.emergencyContact} (${formData.emergencyRelation})`
      : formData.emergencyContact 
        ? `\nEmergency Contact: ${formData.emergencyContact}`
        : '';

    const whatsappMessage = `*XTSY Travellers Hostel & XTSY Luxury Booking Request*

*Guest Details:*
Name: ${formData.guestName}
Email: ${formData.email}
Phone: ${formData.whatsappNumber}
Address: ${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}${emergencyContactText}

*Booking Details:*
Check-in: ${formatDate(bookingData.checkIn)}
Check-out: ${formatDate(bookingData.checkOut)}
Total Guests: ${bookingData.guests}
Number of Nights: ${bookingData.nights}

*Room Details:*
${roomDetails}

*Payment Summary:*
Subtotal: ₹${bookingData.subtotal}${discountText}
GST (18%): ₹${bookingData.gstAmount}
*Total Amount: ₹${bookingData.totalAmount}*

Please confirm this booking. We have already made payment and here is the Payment screenshot for reference.`;

    const whatsappURL = `https://wa.me/918837317070?text=${encodeURIComponent(whatsappMessage)}`;
    
    // Open WhatsApp in new tab
    window.open(whatsappURL, '_blank');
    
    // Show success message and close modal
    toast({
      title: "Redirecting to WhatsApp",
      description: "Your booking details have been prepared. Complete the booking via WhatsApp.",
    });
    
    // Clear booking data and close modal
    localStorage.removeItem('xtsy_current_booking');
    onClose();
  };


  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-full h-full max-w-none max-h-none md:max-w-2xl lg:max-w-3xl md:max-h-[95vh] md:h-auto bg-white border-0 p-0 overflow-hidden">
          <div className="flex flex-col h-full max-h-[100vh] md:max-h-[95vh]">
            {/* Header - Fixed */}
            <div className="flex-shrink-0 p-4 md:p-6 border-b bg-gradient-to-r from-orange-50 to-red-50">
              <div className="flex items-center gap-3 mb-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onBack}
                  className="p-2"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <DialogTitle className="text-xl md:text-2xl font-bold text-gray-900">
                  Guest Details
                </DialogTitle>
              </div>
              
              {/* Booking Summary */}
              <div className="bg-white rounded-lg p-3 mt-4 shadow-sm">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-orange-500" />
                    <div>
                      <div className="text-gray-600">Check-in</div>
                      <div className="font-medium">{new Date(bookingData.checkIn).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-orange-500" />
                    <div>
                      <div className="text-gray-600">Check-out</div>
                      <div className="font-medium">{new Date(bookingData.checkOut).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-orange-500" />
                    <div>
                      <div className="text-gray-600">Guests</div>
                      <div className="font-medium">{bookingData.guests}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-orange-500" />
                    <div>
                      <div className="text-gray-600">Nights</div>
                      <div className="font-medium">{bookingData.nights}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="mt-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                <div className="text-sm font-medium text-blue-800">
                  💰 Total Amount: ₹{bookingData.totalAmount}
                </div>
                <div className="text-xs mt-1 text-blue-600">
                  Complete booking via WhatsApp with payment details
                </div>
              </div>
            </div>

            {/* Scrollable Form Content */}
            <div className="flex-1 overflow-y-auto min-h-0">
              <div className="p-4 md:p-6 space-y-6">
                {/* Primary Guest Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <User className="h-5 w-5 text-orange-500" />
                    Primary Guest Information *
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="guestName" className="text-sm font-medium text-gray-700">
                        Full Name *
                      </Label>
                      <Input
                        id="guestName"
                        value={formData.guestName}
                        onChange={(e) => handleInputChange('guestName', e.target.value)}
                        placeholder="Enter your full name"
                        className="mt-1"
                        maxLength={100}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="your@example.com"
                        className="mt-1"
                        maxLength={100}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="whatsappNumber" className="text-sm font-medium text-gray-700">
                        WhatsApp Number *
                      </Label>
                      <Input
                        id="whatsappNumber"
                        value={formData.whatsappNumber}
                        onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
                        placeholder="+91 9876543210"
                        className="mt-1"
                        maxLength={20}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-orange-500" />
                    Address Information *
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                        Full Address *
                      </Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="House No, Street, Area"
                        className="mt-1"
                        maxLength={200}
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                          City *
                        </Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          placeholder="City"
                          className="mt-1"
                          maxLength={50}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="state" className="text-sm font-medium text-gray-700">
                          State *
                        </Label>
                        <Input
                          id="state"
                          value={formData.state}
                          onChange={(e) => handleInputChange('state', e.target.value)}
                          placeholder="State"
                          className="mt-1"
                          maxLength={50}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="pincode" className="text-sm font-medium text-gray-700">
                          Pincode *
                        </Label>
                        <Input
                          id="pincode"
                          value={formData.pincode}
                          onChange={(e) => handleInputChange('pincode', e.target.value)}
                          placeholder="123456"
                          className="mt-1"
                          maxLength={10}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Emergency Contact - Optional */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    Emergency Contact (Optional)
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="emergencyContact" className="text-sm font-medium text-gray-700">
                        Emergency Contact Number
                      </Label>
                      <Input
                        id="emergencyContact"
                        value={formData.emergencyContact}
                        onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                        placeholder="+91 9876543210"
                        className="mt-1"
                        maxLength={20}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="emergencyRelation" className="text-sm font-medium text-gray-700">
                        Relationship
                      </Label>
                      <Input
                        id="emergencyRelation"
                        value={formData.emergencyRelation}
                        onChange={(e) => handleInputChange('emergencyRelation', e.target.value)}
                        placeholder="e.g., Father, Mother, Friend"
                        className="mt-1"
                        maxLength={50}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer - Fixed */}
            <div className="flex-shrink-0 p-4 md:p-6 border-t bg-gray-50">
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !validateForm()}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-3 text-lg"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </div>
                 ) : (
                  "Complete Booking via WhatsApp"
                 )}
               </Button>
               <p className="text-xs text-gray-500 text-center mt-2">
                 Complete your booking through WhatsApp with payment details
               </p>
             </div>
           </div>
         </DialogContent>
       </Dialog>
    </>
  );
};

export default GuestDetails;
