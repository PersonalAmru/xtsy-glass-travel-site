
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, User, Mail, Phone, MapPin, AlertTriangle, Calendar, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import SecurePaymentHandler from "./SecurePaymentHandler";

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
  const [showLastMinDeal, setShowLastMinDeal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState<string>("");
  const { toast } = useToast();

  // Check if booking is within 7 days for XTSY-DEAL
  const isUrgentBooking = () => {
    const checkInDate = new Date(bookingData.checkIn);
    const today = new Date();
    const diffTime = checkInDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
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
    const required = ['guestName', 'email', 'whatsappNumber'];
    const hasRequiredFields = required.every(field => formData[field as keyof typeof formData].trim() !== '');
    
    if (!hasRequiredFields) return false;
    if (!validateEmail(formData.email)) return false;
    if (!validatePhone(formData.whatsappNumber)) return false;
    
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast({
        title: "Invalid Information",
        description: "Please check your email and phone number format",
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
      
      // Calculate totals with enhanced validation
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

      // Apply XTSY-DEAL if urgent booking and 4+ beds from XTSY Travellers Hostel
      let discountAmount = cart.couponDiscount || 0;
      if (isUrgentBooking() && !cart.couponApplied) {
        const xtsyTravellersItems = cart.items.filter((item: any) => 
          item.hostelName === 'XTSY Travellers Hostel'
        );
        const totalBeds = xtsyTravellersItems.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0);
        
        if (totalBeds >= 4) {
          discountAmount = Math.round(subtotal * 0.15); // 15% discount
        }
      }

      const gstAmount = Math.round(subtotal * 0.18); // 18% GST
      const totalAmount = subtotal + gstAmount - discountAmount;

      // Validate amounts
      if (totalAmount <= 0 || subtotal <= 0) {
        throw new Error('Invalid booking amounts calculated');
      }

      // Generate a temporary booking ID for the insert
      const tempBookingId = 'TEMP-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);

      // Create booking record - let the database trigger handle the actual booking_id
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          booking_id: tempBookingId, // Temporary ID, will be replaced by trigger
          guest_name: formData.guestName,
          email: formData.email,
          whatsapp_number: formData.whatsappNumber,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          emergency_contact: formData.emergencyContact,
          emergency_relation: formData.emergencyRelation,
          check_in: bookingData.checkIn,
          check_out: bookingData.checkOut,
          nights: bookingData.nights,
          guests: bookingData.guests,
          room_details: cart.items,
          subtotal: subtotal,
          gst_amount: gstAmount,
          discount_amount: discountAmount,
          total_amount: totalAmount,
          promo_code: isUrgentBooking() && !cart.couponApplied ? 'XTSY-DEAL' : cart.couponCode,
          promo_applied: discountAmount > 0,
          booking_status: 'pending'
        })
        .select()
        .single();

      if (bookingError) {
        console.error('Booking creation error:', bookingError);
        throw bookingError;
      }

      setBookingId(booking.booking_id);

      // Use secure payment handler
      const paymentHandler = SecurePaymentHandler({
        bookingData: {
          totalAmount: totalAmount,
          guestName: formData.guestName,
          email: formData.email,
          whatsappNumber: formData.whatsappNumber,
          bookingId: booking.booking_id
        },
        onSuccess: () => {
          localStorage.removeItem('xtsy_booking_cart');
          onClose();
        },
        onError: (error) => {
          console.error('Payment error:', error);
        }
      });

      paymentHandler.initiateSecurePayment();

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

  const handleClose = () => {
    if (isUrgentBooking() && !showLastMinDeal) {
      setShowLastMinDeal(true);
    } else {
      onClose();
    }
  };

  if (showLastMinDeal) {
    return (
      <Dialog open={true} onOpenChange={() => {}}>
        <DialogContent className="max-w-md mx-auto bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold text-gray-900">
              LAST-MINUTE DEAL!
            </DialogTitle>
          </DialogHeader>
          <div className="text-center p-6">
            <div className="text-6xl mb-4">⚡</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              15% OFF Your Booking!
            </h3>
            <p className="text-gray-700 mb-4">
              Since you're booking within 7 days, get an instant 15% discount on your stay!
            </p>
            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => {
                  setShowLastMinDeal(false);
                }}
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold"
              >
                Apply & Continue
              </Button>
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1 border-gray-300 text-gray-600"
              >
                Skip Deal
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
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
          </div>

          {/* Scrollable Form Content */}
          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="p-4 md:p-6 space-y-6">
              {/* Primary Guest Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <User className="h-5 w-5 text-orange-500" />
                  Primary Guest Information
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
                      placeholder="your@email.com"
                      className="mt-1"
                      maxLength={100}
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
                    />
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-orange-500" />
                  Address Information
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                      Full Address
                    </Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="House No, Street, Area"
                      className="mt-1"
                      maxLength={200}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                        City
                      </Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="City"
                        className="mt-1"
                        maxLength={50}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="state" className="text-sm font-medium text-gray-700">
                        State
                      </Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        placeholder="State"
                        className="mt-1"
                        maxLength={50}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="pincode" className="text-sm font-medium text-gray-700">
                        Pincode
                      </Label>
                      <Input
                        id="pincode"
                        value={formData.pincode}
                        onChange={(e) => handleInputChange('pincode', e.target.value)}
                        placeholder="123456"
                        className="mt-1"
                        maxLength={10}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Emergency Contact
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
                'Pay Now & Confirm Booking'
              )}
            </Button>
            <p className="text-xs text-gray-500 text-center mt-2">
              * Only 21% advance payment required. Pay rest at check-in.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GuestDetails;
