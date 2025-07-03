
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, User, Calendar, Users } from "lucide-react";

interface GuestDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  bookingData: {
    checkIn: string;
    checkOut: string;
    guests: number;
  } | null;
}

const GuestDetails = ({ isOpen, onClose, bookingData }: GuestDetailsProps) => {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("1");
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "Male",
    email: "",
    phone: "",
    address: "",
    agreeToTerms: false
  });

  useEffect(() => {
    if (bookingData) {
      setCheckIn(bookingData.checkIn);
      setCheckOut(bookingData.checkOut);
      setGuests(bookingData.guests.toString());
    }
  }, [bookingData]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    if (!formData.firstName || !formData.email || !formData.phone) {
      alert("Please fill in all required fields");
      return;
    }
    
    if (!formData.agreeToTerms) {
      alert("Please accept the terms and conditions");
      return;
    }
    
    console.log("Guest Details:", {
      checkIn,
      checkOut,
      guests: parseInt(guests),
      ...formData
    });
    
    alert("Proceeding to payment gateway...");
  };

  // Mock booking data for display
  const roomData = {
    name: "Standard 2 Bed Female Dorm (shared attached washroom)",
    image: "/lovable-uploads/db863c94-a5db-4aa4-afa6-e11364e4b9d7.png",
    price: 899,
    quantity: 1
  };

  const totalAmount = roomData.price * roomData.quantity;
  const tax = Math.round(totalAmount * 0.12);
  const grandTotal = totalAmount + tax;
  const payableNow = Math.round(grandTotal * 0.21);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] bg-gray-50 border-0 p-0 overflow-hidden">
        <div className="flex h-full">
          {/* Left Panel - Guest Information Form */}
          <div className="flex-1 overflow-y-auto bg-white">
            <DialogHeader className="sticky top-0 bg-white z-10 p-6 border-b border-gray-200">
              <div className="flex items-center gap-4 mb-4">
                <Button
                  variant="ghost"
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <DialogTitle className="text-2xl font-bold text-gray-900">
                  Confirm your booking
                </DialogTitle>
              </div>
            </DialogHeader>

            <div className="p-6 space-y-6">
              {/* Guest Information Section */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Guest Information
                  </h3>
                </div>
                
                <div className="space-y-4">
                  {/* Name Fields */}
                  <div>
                    <Label className="text-gray-700 mb-2 block">
                      Name <span className="text-red-500">*</span>
                    </Label>
                    <div className="grid grid-cols-3 gap-3">
                      <Input
                        placeholder="Enter the first name"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className="bg-white border-gray-300"
                      />
                      <Input
                        placeholder="Enter the middle name"
                        value={formData.middleName}
                        onChange={(e) => handleInputChange('middleName', e.target.value)}
                        className="bg-white border-gray-300"
                      />
                      <Input
                        placeholder="Enter the last name"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className="bg-white border-gray-300"
                      />
                    </div>
                  </div>

                  {/* Gender */}
                  <div>
                    <Label className="text-gray-700 mb-2 block">
                      Gender <span className="text-red-500">*</span>
                    </Label>
                    <select
                      value={formData.gender}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Email */}
                  <div>
                    <Label className="text-gray-700 mb-2 block">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="email"
                      placeholder="Select the Email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="bg-white border-gray-300"
                    />
                  </div>

                  {/* Phone Number */}
                  <div>
                    <Label className="text-gray-700 mb-2 block">
                      Number <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex">
                      <div className="flex items-center px-3 py-2 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md">
                        <span className="text-orange-500 mr-2">🇮🇳</span>
                        <span className="text-gray-700">+91</span>
                      </div>
                      <Input
                        type="tel"
                        placeholder=""
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="bg-white border-gray-300 rounded-l-none"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <Label className="text-gray-700 mb-2 block">
                      Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      placeholder="Select the Address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="bg-white border-gray-300"
                    />
                  </div>
                </div>
              </div>

              {/* Our Policies Section */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Our Policies</h3>
                <p className="text-orange-600 text-sm mb-4">Please read them once</p>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">General Policies</h4>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                      🔗 Cancellation Policy
                    </h4>
                    
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">😊</span>
                          <div>
                            <div className="text-xs text-gray-500">Now → 5 Jul 11:59 AM</div>
                            <div className="font-semibold text-red-600">No Refund</div>
                          </div>
                        </div>
                        <div className="w-full mx-4">
                          <div className="h-2 bg-red-500 rounded-full"></div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">🏠</span>
                          <div>
                            <div className="text-xs text-gray-500">5 Jul 12:00 pm</div>
                            <div className="font-semibold text-gray-900">Check-in day</div>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-700">
                        No date modifications (date changes or stay duration reductions) are allowed within the 7-day window 
                        prior to the check-in date. Any such requests will be treated as cancellations.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start gap-3">
                <Checkbox
                  id="terms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked)}
                />
                <Label htmlFor="terms" className="text-sm text-gray-700 leading-relaxed">
                  I acknowledge and accept the terms and conditions mentioned in the Property Policy & Cancellation Policy. 
                  <span className="text-red-500">*</span>
                </Label>
              </div>

              <div className="text-center text-sm text-gray-500">
                By continuing, you confirm all guests are 18+
              </div>
            </div>
          </div>

          {/* Right Panel - Booking Summary */}
          <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-1">Summary</h3>
              <p className="text-sm text-gray-600">1 night starting from Sat 5 Jul, 2025</p>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {/* Room Details */}
                <div className="flex gap-3">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0">
                    <div className="w-full h-full bg-gradient-to-br from-orange-200 to-red-200 rounded-lg flex items-center justify-center">
                      <span className="text-xs text-orange-700">Room</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-sm">{roomData.name}</h4>
                    <p className="text-gray-600 text-xs">x {roomData.quantity}</p>
                    <p className="text-gray-600 text-xs">₹{roomData.price} x 1 night</p>
                    <div className="font-bold text-right">₹{roomData.price}</div>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span className="text-gray-900">₹{tax}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span className="text-gray-900">Total (tax incl.)</span>
                    <span className="text-gray-900">₹{grandTotal}</span>
                  </div>
                  <div className="flex justify-between text-green-600 font-bold">
                    <span>Payable Now</span>
                    <span>₹{payableNow}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200">
              <Button
                onClick={handleSubmit}
                disabled={!formData.agreeToTerms}
                className="w-full bg-gray-400 hover:bg-gray-500 text-white py-3 font-semibold disabled:opacity-50"
              >
                Reserve
              </Button>
              {!formData.firstName && (
                <p className="text-red-500 text-xs mt-2 text-center">* Please enter name</p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GuestDetails;
