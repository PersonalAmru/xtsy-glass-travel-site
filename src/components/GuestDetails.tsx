
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
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [bookingId, setBookingId] = useState<string>("");
  const { toast } = useToast();

  // Check if booking is within 7 days or group size <= 4 for full payment
  const requiresFullPayment = () => {
    const checkInDate = new Date(bookingData.checkIn);
    const today = new Date();
    const diffTime = checkInDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Full payment required if:
    // 1. Booking within 7 days, OR
    // 2. Group size is 4 or less
    return diffDays <= 7 || bookingData.guests <= 4;
  };

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

    setIsSubmitting(true);
    
    try {
      // Get cart data
      const cartData = localStorage.getItem('xtsy_booking_cart');
      if (!cartData) {
        throw new Error('No booking data found');
      }

      const cart = JSON.parse(cartData);
      
      // Calculate totals
      let subtotal = 0;
      cart.items.forEach((item: any) => {
        const nights = item.nights || cart.nights || 1;
        const itemPrice = Number(item.price) || 0;
        const quantity = Number(item.quantity) || 0;
        
        if (itemPrice <= 0 || quantity <= 0) {
          throw new Error('Invalid booking data detected');
        }
        
        subtotal += itemPrice * quantity * nights;
      });

      const gstAmount = Math.round(subtotal * 0.18); // 18% GST
      let totalAmount = subtotal + gstAmount;
      
      // Calculate payment amount based on rules
      let paymentAmount;
      let paymentType;
      
      if (requiresFullPayment()) {
        paymentAmount = totalAmount;
        paymentType = 'full';
      } else {
        paymentAmount = Math.round(totalAmount * 0.21); // 21% advance
        paymentType = 'advance';
      }

      // Validate amounts
      if (totalAmount <= 0 || subtotal <= 0) {
        throw new Error('Invalid booking amounts calculated');
      }

      // Create booking record
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          guest_name: formData.guestName,
          email: formData.email,
          whatsapp_number: formData.whatsappNumber,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          emergency_contact: formData.emergencyContact || null,
          emergency_relation: formData.emergencyRelation || null,
          check_in: bookingData.checkIn,
          check_out: bookingData.checkOut,
          nights: bookingData.nights,
          guests: bookingData.guests,
          room_details: cart.items,
          subtotal: subtotal,
          gst_amount: gstAmount,
          total_amount: totalAmount,
          booking_status: 'pending',
          payment_method: 'upi'
        })
        .select()
        .single();

      if (bookingError) {
        console.error('Booking creation error:', bookingError);
        throw bookingError;
      }

      setBookingId(booking.booking_id);
      
      // Show payment modal with calculated amount
      setShowPaymentModal(true);

    } catch (error: any) {
      console.error('Booking creation error:', error);
      toast({
        title: "Booking Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentModalClose = () => {
    setShowPaymentModal(false);
    localStorage.removeItem('xtsy_booking_cart');
    onClose();
  };

  const getPaymentAmount = () => {
    const cartData = localStorage.getItem('xtsy_booking_cart');
    if (!cartData) return 0;

    const cart = JSON.parse(cartData);
    let subtotal = 0;
    
    cart.items.forEach((item: any) => {
      const nights = item.nights || cart.nights || 1;
      const itemPrice = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 0;
      subtotal += itemPrice * quantity * nights;
    });

    const gstAmount = Math.round(subtotal * 0.18);
    const totalAmount = subtotal + gstAmount;
    
    return requiresFullPayment() ? totalAmount : Math.round(totalAmount * 0.21);
  };

  const paymentAmount = getPaymentAmount();
  const isFullPayment = requiresFullPayment();

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

              {/* Payment Info Banner */}
              <div className={`mt-3 p-3 rounded-lg ${isFullPayment ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
                <div className={`text-sm font-medium ${isFullPayment ? 'text-red-800' : 'text-green-800'}`}>
                  {isFullPayment ? (
                    <>🔒 Full Payment Required: ₹{paymentAmount}</>
                  ) : (
                    <>💰 Advance Payment: ₹{paymentAmount} (21% of total)</>
                  )}
                </div>
                <div className={`text-xs mt-1 ${isFullPayment ? 'text-red-600' : 'text-green-600'}`}>
                  {isFullPayment 
                    ? bookingData.guests <= 4 
                      ? "Groups of 4 or less require full payment"
                      : "Bookings within 7 days require full payment"
                    : "Balance payable at check-in"
                  }
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
                  `Pay ₹${paymentAmount} & Confirm Booking`
                )}
              </Button>
              <p className="text-xs text-gray-500 text-center mt-2">
                {isFullPayment 
                  ? "* Full payment required for this booking"
                  : "* Pay 21% advance now, rest at check-in"
                }
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* UPI Payment Modal */}
      {showPaymentModal && (
        <UPIPaymentModal
          isOpen={showPaymentModal}
          onClose={handlePaymentModalClose}
          bookingData={{
            bookingId: bookingId,
            guestName: formData.guestName,
            checkIn: bookingData.checkIn,
            checkOut: bookingData.checkOut,
            totalAmount: paymentAmount,
            whatsappNumber: formData.whatsappNumber
          }}
        />
      )}
    </>
  );
};

export default GuestDetails;
