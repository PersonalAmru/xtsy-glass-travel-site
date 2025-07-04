import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Calendar, Users, MapPin, Phone, Mail, CreditCard } from "lucide-react";

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
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    emergencyContact: "",
    emergencyPhone: "",
    specialRequests: "",
    arrivalTime: "",
    idProof: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      alert("Please fill in all required fields");
      return;
    }

    // Here you would normally submit to your backend
    console.log("Booking submitted:", { ...formData, bookingData });
    alert("Booking submitted successfully!");
    onClose();
  };

  // Format date properly
  const formatDate = (dateStr: string) => {
    if (!dateStr || dateStr === 'undefined') return 'Select Date';
    
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] bg-white border border-gray-200 text-gray-900 shadow-lg overflow-hidden">
        <div className="flex h-full">
          {/* Left Panel - Guest Details Form */}
          <div className="flex-1 overflow-y-auto p-6">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Users className="h-6 w-6 text-orange-500" />
                Guest Details
              </DialogTitle>
              <p className="text-gray-600">Please provide your information to complete the booking</p>
            </DialogHeader>

            <div className="space-y-6">
              {/* Personal Information */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-gray-700">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="mt-1"
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-gray-700">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="mt-1"
                      placeholder="Enter last name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-gray-700">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="mt-1"
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-gray-700">Phone *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="mt-1"
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Address Information</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="address" className="text-gray-700">Address</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="mt-1"
                      placeholder="Enter full address"
                      rows={2}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city" className="text-gray-700">City</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className="mt-1"
                        placeholder="Enter city"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state" className="text-gray-700">State</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        className="mt-1"
                        placeholder="Enter state"
                      />
                    </div>
                    <div>
                      <Label htmlFor="pincode" className="text-gray-700">Pincode</Label>
                      <Input
                        id="pincode"
                        value={formData.pincode}
                        onChange={(e) => handleInputChange('pincode', e.target.value)}
                        className="mt-1"
                        placeholder="Enter pincode"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="emergencyContact" className="text-gray-700">Contact Name</Label>
                    <Input
                      id="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                      className="mt-1"
                      placeholder="Enter emergency contact name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="emergencyPhone" className="text-gray-700">Contact Phone</Label>
                    <Input
                      id="emergencyPhone"
                      value={formData.emergencyPhone}
                      onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                      className="mt-1"
                      placeholder="Enter emergency contact phone"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="arrivalTime" className="text-gray-700">Expected Arrival Time</Label>
                    <Select onValueChange={(value) => handleInputChange('arrivalTime', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select arrival time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="before-12pm">Before 12:00 PM</SelectItem>
                        <SelectItem value="12pm-3pm">12:00 PM - 3:00 PM</SelectItem>
                        <SelectItem value="3pm-6pm">3:00 PM - 6:00 PM</SelectItem>
                        <SelectItem value="6pm-9pm">6:00 PM - 9:00 PM</SelectItem>
                        <SelectItem value="after-9pm">After 9:00 PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="idProof" className="text-gray-700">ID Proof Type</Label>
                    <Select onValueChange={(value) => handleInputChange('idProof', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select ID proof" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="aadhar">Aadhar Card</SelectItem>
                        <SelectItem value="passport">Passport</SelectItem>
                        <SelectItem value="driving-license">Driving License</SelectItem>
                        <SelectItem value="voter-id">Voter ID</SelectItem>
                        <SelectItem value="pan-card">PAN Card</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="specialRequests" className="text-gray-700">Special Requests</Label>
                  <Textarea
                    id="specialRequests"
                    value={formData.specialRequests}
                    onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                    className="mt-1"
                    placeholder="Any special requests or dietary requirements"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Booking Summary */}
          <div className="w-96 bg-gray-50 border-l border-gray-200 flex flex-col">
            <div className="p-6 border-b border-gray-200 bg-white">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Booking Summary</h3>
              <p className="text-sm text-gray-600">Review your booking details</p>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {/* Booking Details */}
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-600" />
                      <span className="font-medium text-gray-900">Stay Details</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Check-in:</span>
                        <span className="text-gray-900 font-medium">{formatDate(bookingData.checkIn)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Check-out:</span>
                        <span className="text-gray-900 font-medium">{formatDate(bookingData.checkOut)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Nights:</span>
                        <span className="text-gray-900 font-medium">{bookingData.nights}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Guests:</span>
                        <span className="text-gray-900 font-medium">{bookingData.guests}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Property Information */}
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="h-4 w-4 text-gray-600" />
                    <span className="font-medium text-gray-900">Property</span>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">XTSY Travellers Hostel</p>
                    <p className="text-gray-600">Near Manali Mall Road</p>
                    <p className="text-gray-600">Himachal Pradesh, India</p>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Phone className="h-4 w-4 text-gray-600" />
                    <span className="font-medium text-gray-900">Contact</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3 text-gray-500" />
                      <span className="text-gray-900">+91 98765 43210</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3 text-gray-500" />
                      <span className="text-gray-900">info@xtsy.com</span>
                    </div>
                  </div>
                </div>

                {/* Important Notes */}
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <h4 className="font-medium text-orange-900 mb-2">Important Notes</h4>
                  <ul className="text-sm text-orange-800 space-y-1">
                    <li>• Check-in: 12:00 PM onwards</li>
                    <li>• Check-out: 10:00 AM</li>
                    <li>• Valid ID proof required</li>
                    <li>• Only guests 18+ allowed</li>
                    <li>• No outside visitors after 10 PM</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 bg-white">
              <div className="space-y-3">
                <Button
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white py-3 font-semibold"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Proceed to Payment
                </Button>
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="w-full border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  Back to Booking
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GuestDetails;
