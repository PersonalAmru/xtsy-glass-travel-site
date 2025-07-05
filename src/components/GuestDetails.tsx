
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Users, User, Mail, Phone, MapPin, Hotel } from "lucide-react";

interface GuestDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  bookingData: {
    checkIn: string;
    checkOut: string;
    guests: number;
    nights: number;
  };
}

const GuestDetails = ({ isOpen, onClose, bookingData }: GuestDetailsProps) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    whatsapp: "",
    address: "",
    city: "",
    state: "",
    pincode: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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

  const handlePayNow = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.whatsapp) {
      alert("Please fill in all required fields");
      return;
    }

    // Get booking data from localStorage
    const savedData = localStorage.getItem('xtsy_booking_cart');
    const cartData = savedData ? JSON.parse(savedData) : null;

    const guestMessage = `🎉 Booking Confirmation - XTSY

Dear ${formData.firstName} ${formData.lastName},

Thank you for booking with us! Here are your booking details:

📅 Check-in: ${formatDate(bookingData.checkIn)}
📅 Check-out: ${formatDate(bookingData.checkOut)}
🛏️ Nights: ${bookingData.nights}
👥 Guests: ${bookingData.guests}

📧 Email: ${formData.email}
📱 WhatsApp: ${formData.whatsapp}
📍 Address: ${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}

We look forward to hosting you!

Best regards,
XTSY Team`;

    const propertyMessage = `🏨 New Booking Alert - XTSY

Guest Details:
👤 Name: ${formData.firstName} ${formData.lastName}
📧 Email: ${formData.email}
📱 WhatsApp: ${formData.whatsapp}
📍 Address: ${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}

Booking Details:
📅 Check-in: ${formatDate(bookingData.checkIn)}
📅 Check-out: ${formatDate(bookingData.checkOut)}
🛏️ Nights: ${bookingData.nights}
👥 Guests: ${bookingData.guests}

${cartData && cartData.items ? cartData.items.map((item: any) => 
  `🏠 ${item.roomName} - ₹${item.price} x ${item.quantity}`
).join('\n') : ''}

Please confirm this booking.`;

    // Send to guest
    const guestWhatsAppUrl = `https://wa.me/${formData.whatsapp}?text=${encodeURIComponent(guestMessage)}`;
    
    // Send to property
    const propertyWhatsAppUrl = `https://wa.me/918837317070?text=${encodeURIComponent(propertyMessage)}`;

    // Open both WhatsApp links
    window.open(guestWhatsAppUrl, '_blank');
    setTimeout(() => {
      window.open(propertyWhatsAppUrl, '_blank');
    }, 1000);

    // Clear cart and close
    localStorage.removeItem('xtsy_booking_cart');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] bg-gray-50 border-0 p-0 overflow-hidden">
        <div className="flex h-full max-h-[95vh]">
          {/* Left Panel - Guest Details Form */}
          <div className="flex-1 flex flex-col bg-white">
            <DialogHeader className="flex-shrink-0 bg-white z-10 p-6 border-b border-gray-200">
              <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <User className="h-6 w-6 text-orange-500" />
                Guest Details
              </DialogTitle>
              <p className="text-gray-600">Please provide your information to complete the booking</p>
            </DialogHeader>

            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-6 space-y-6">
                  {/* Personal Information */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-gray-700 font-medium">
                          First Name *
                        </Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="Enter first name"
                          className="border-gray-300"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-gray-700 font-medium">
                          Last Name *
                        </Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder="Enter last name"
                          className="border-gray-300"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-700 font-medium">
                          Email *
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Enter email address"
                          className="border-gray-300"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="whatsapp" className="text-gray-700 font-medium">
                          WhatsApp Number *
                        </Label>
                        <Input
                          id="whatsapp"
                          name="whatsapp"
                          type="tel"
                          value={formData.whatsapp}
                          onChange={handleInputChange}
                          placeholder="Enter WhatsApp number"
                          className="border-gray-300"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Address Information */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Address Information</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="address" className="text-gray-700 font-medium">
                          Address
                        </Label>
                        <Textarea
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="Enter full address"
                          className="border-gray-300"
                          rows={3}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city" className="text-gray-700 font-medium">
                            City
                          </Label>
                          <Input
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            placeholder="Enter city"
                            className="border-gray-300"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state" className="text-gray-700 font-medium">
                            State
                          </Label>
                          <Input
                            id="state"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            placeholder="Enter state"
                            className="border-gray-300"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="pincode" className="text-gray-700 font-medium">
                            Pincode
                          </Label>
                          <Input
                            id="pincode"
                            name="pincode"
                            value={formData.pincode}
                            onChange={handleInputChange}
                            placeholder="Enter pincode"
                            className="border-gray-300"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* Right Panel - Booking Summary */}
          <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
            <div className="flex-shrink-0 p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Booking Summary</h3>
              <p className="text-gray-600">Review your booking details</p>
            </div>

            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-6 space-y-6">
                  {/* Stay Details */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Stay Details
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Check-in:</span>
                        <span className="font-medium">{formatDate(bookingData.checkIn)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Check-out:</span>
                        <span className="font-medium">{formatDate(bookingData.checkOut)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Nights:</span>
                        <span className="font-medium">{bookingData.nights}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Guests:</span>
                        <span className="font-medium">{bookingData.guests}</span>
                      </div>
                    </div>
                  </div>

                  {/* Property */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Hotel className="h-4 w-4" />
                      Property
                    </h4>
                    <div className="text-sm">
                      <p className="font-medium">XTSY Travellers Hostel</p>
                      <p className="text-gray-600">Near Manali Mall Road</p>
                      <p className="text-gray-600">Himachal Pradesh, India</p>
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Contact
                    </h4>
                    <div className="text-sm space-y-1">
                      <p className="flex items-center gap-2">
                        <Phone className="h-3 w-3" />
                        +91 98765 43210
                      </p>
                      <p className="flex items-center gap-2">
                        <Mail className="h-3 w-3" />
                        info@xtsy.com
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>

            <div className="flex-shrink-0 p-6 border-t border-gray-200">
              <Button
                onClick={handlePayNow}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 font-semibold"
              >
                Pay Now
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GuestDetails;
