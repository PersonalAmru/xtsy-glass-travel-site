
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, User, Phone, MapPin, Calendar, Users, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GuestDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  onBack?: () => void;
  bookingData: {
    checkIn: string;
    checkOut: string;
    guests: number;
    nights: number;
  };
}

const GuestDetails = ({ isOpen, onClose, onBack, bookingData }: GuestDetailsProps) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    whatsapp: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    emergencyContact: "",
    emergencyRelation: "",
  });
  
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr || dateStr === 'undefined' || dateStr.includes('undefined')) {
      return 'Select Date';
    }
    
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return 'Select Date';
      
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return 'Select Date';
    }
  };

  const generateBookingSummary = () => {
    const cartData = localStorage.getItem('xtsy_booking_cart');
    if (!cartData) return "";

    const booking = JSON.parse(cartData);
    let summary = `🏨 *XTSY Booking Confirmation*\n\n`;
    summary += `👤 *Guest Details:*\n`;
    summary += `Name: ${formData.fullName}\n`;
    summary += `WhatsApp: ${formData.whatsapp}\n`;
    summary += `Email: ${formData.email}\n`;
    summary += `Address: ${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}\n`;
    summary += `Emergency Contact: ${formData.emergencyContact} (${formData.emergencyRelation})\n\n`;
    
    summary += `📅 *Booking Details:*\n`;
    summary += `Check-in: ${formatDate(booking.checkIn)}\n`;
    summary += `Check-out: ${formatDate(booking.checkOut)}\n`;
    summary += `Nights: ${booking.nights || 1}\n`;
    summary += `Guests: ${booking.guests}\n\n`;
    
    summary += `🏠 *Room Details:*\n`;
    booking.items.forEach((item: any, index: number) => {
      const nights = item.nights || booking.nights || 1;
      let itemTotal = 0;
      
      if (item.roomType === 'dorm') {
        itemTotal = item.price * item.quantity * booking.guests * nights;
      } else {
        itemTotal = item.price * item.quantity * nights;
      }
      
      summary += `${index + 1}. ${item.roomName}\n`;
      summary += `   Price: ₹${item.price} ${item.roomType === 'dorm' ? 'per person' : 'per room'} per night\n`;
      summary += `   Total: ₹${itemTotal}\n`;
    });
    
    // Calculate totals
    let subtotal = 0;
    let totalGST = 0;
    
    booking.items.forEach((item: any) => {
      let itemTotal = 0;
      const nights = item.nights || booking.nights || 1;
      
      if (item.roomType === 'dorm') {
        itemTotal = item.price * item.quantity * booking.guests * nights;
      } else {
        itemTotal = item.price * item.quantity * nights;
      }
      
      subtotal += itemTotal;
      
      // Calculate GST
      const gstRate = item.price < 1000 ? 0 : (item.price < 7500 ? 0.12 : 0.18);
      const itemGST = Math.round(itemTotal * gstRate);
      totalGST += itemGST;
    });
    
    const discountAmount = booking.couponApplied ? (booking.couponDiscount || 0) : 0;
    const grandTotal = subtotal + totalGST - discountAmount;
    const payableNow = Math.round(grandTotal * 0.21);
    
    summary += `\n💰 *Payment Summary:*\n`;
    summary += `Subtotal: ₹${subtotal}\n`;
    if (discountAmount > 0) {
      summary += `Discount: -₹${discountAmount}\n`;
    }
    summary += `GST: ₹${totalGST}\n`;
    summary += `Grand Total: ₹${grandTotal}\n`;
    summary += `Payable Now (21%): ₹${payableNow}\n`;
    summary += `Balance on Check-in: ₹${grandTotal - payableNow}\n\n`;
    
    summary += `📞 For any queries, contact us at +91 88373 17070\n`;
    summary += `🌟 Thank you for choosing XTSY!`;
    
    return summary;
  };

  const handleSubmit = () => {
    // Validation
    if (!formData.fullName || !formData.whatsapp || !formData.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // WhatsApp number validation (should be 10 digits)
    const whatsappPattern = /^[6-9]\d{9}$/;
    if (!whatsappPattern.test(formData.whatsapp)) {
      toast({
        title: "Invalid WhatsApp Number",
        description: "Please enter a valid 10-digit WhatsApp number",
        variant: "destructive"
      });
      return;
    }

    const bookingSummary = generateBookingSummary();
    
    // Send to guest's WhatsApp
    const guestMessage = encodeURIComponent(bookingSummary);
    const guestWhatsAppUrl = `https://wa.me/91${formData.whatsapp}?text=${guestMessage}`;
    
    // Send to property WhatsApp
    const propertyMessage = encodeURIComponent(`🏨 *New Booking Alert*\n\n${bookingSummary}`);
    const propertyWhatsAppUrl = `https://wa.me/918837317070?text=${propertyMessage}`;
    
    // Clear cart
    localStorage.removeItem('xtsy_booking_cart');
    
    // Open both WhatsApp links
    window.open(guestWhatsAppUrl, '_blank');
    setTimeout(() => {
      window.open(propertyWhatsAppUrl, '_blank');
    }, 1000);
    
    toast({
      title: "Booking Confirmed! 🎉",
      description: "Booking details sent to your WhatsApp and the property",
    });
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full h-full max-w-none max-h-none md:max-w-2xl md:max-h-[90vh] md:h-auto bg-white border-0 p-0 overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex-shrink-0 p-4 md:p-6 border-b bg-white">
            <div className="flex items-center gap-3 mb-4">
              {onBack && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onBack}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Back to Cart</span>
                </Button>
              )}
              <DialogTitle className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
                <User className="h-5 w-5 md:h-6 md:w-6 text-orange-500" />
                Guest Details
              </DialogTitle>
            </div>
            
            {/* Booking Summary Card */}
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 border border-orange-200">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-orange-500" />
                  <div>
                    <div className="text-gray-600">Check-in</div>
                    <div className="font-semibold">{formatDate(bookingData.checkIn)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-orange-500" />
                  <div>
                    <div className="text-gray-600">Check-out</div>
                    <div className="font-semibold">{formatDate(bookingData.checkOut)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-orange-500" />
                  <div>
                    <div className="text-gray-600">Guests</div>
                    <div className="font-semibold">{bookingData.guests}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-orange-500" />
                  <div>
                    <div className="text-gray-600">Nights</div>
                    <div className="font-semibold">{bookingData.nights}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scrollable Form */}
          <ScrollArea className="flex-1">
            <div className="p-4 md:p-6 space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <User className="h-5 w-5 text-orange-500" />
                  Personal Information
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                      Full Name *
                    </Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      placeholder="Enter your full name"
                      className="mt-1"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="your.email@example.com"
                        className="mt-1"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="whatsapp" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                        <Phone className="h-4 w-4 text-green-500" />
                        WhatsApp Number *
                      </Label>
                      <Input
                        id="whatsapp"
                        value={formData.whatsapp}
                        onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                        placeholder="9876543210"
                        className="mt-1"
                        maxLength={10}
                        required
                      />
                    </div>
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
                      Street Address
                    </Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Enter your street address"
                      className="mt-1"
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
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="pincode" className="text-sm font-medium text-gray-700">
                        PIN Code
                      </Label>
                      <Input
                        id="pincode"
                        value={formData.pincode}
                        onChange={(e) => handleInputChange('pincode', e.target.value)}
                        placeholder="PIN Code"
                        className="mt-1"
                        maxLength={6}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Emergency Contact</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="emergencyContact" className="text-sm font-medium text-gray-700">
                      Emergency Contact Number
                    </Label>
                    <Input
                      id="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                      placeholder="Emergency contact number"
                      className="mt-1"
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
                      placeholder="e.g., Father, Mother, Spouse"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>

          {/* Fixed Footer */}
          <div className="flex-shrink-0 p-4 md:p-6 border-t bg-white">
            <Button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold py-3 text-base"
            >
              Pay Now & Confirm Booking
            </Button>
            <p className="text-xs text-gray-500 text-center mt-2">
              * Booking details will be sent to your WhatsApp number
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GuestDetails;
