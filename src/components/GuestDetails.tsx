import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Users, User, Phone } from "lucide-react";

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
  const [primaryGuest, setPrimaryGuest] = useState({
    name: "",
    mobile: ""
  });
  const [otherGuests, setOtherGuests] = useState<Array<{ name: string; mobile: string }>>([]);

  useEffect(() => {
    if (bookingData) {
      setCheckIn(bookingData.checkIn);
      setCheckOut(bookingData.checkOut);
      setGuests(bookingData.guests.toString());
      
      // Initialize other guests array
      const guestCount = bookingData.guests - 1; // Excluding primary guest
      setOtherGuests(Array(Math.max(0, guestCount)).fill(null).map(() => ({ name: "", mobile: "" })));
    }
  }, [bookingData]);

  const handleOtherGuestChange = (index: number, field: 'name' | 'mobile', value: string) => {
    const updated = [...otherGuests];
    updated[index] = { ...updated[index], [field]: value };
    setOtherGuests(updated);
  };

  const handleGuestCountChange = (newCount: string) => {
    setGuests(newCount);
    const guestCount = parseInt(newCount) - 1; // Excluding primary guest
    const newOtherGuests = Array(Math.max(0, guestCount)).fill(null).map((_, i) => 
      otherGuests[i] || { name: "", mobile: "" }
    );
    setOtherGuests(newOtherGuests);
  };

  const handleSubmit = () => {
    // Validate primary guest details
    if (!primaryGuest.name || !primaryGuest.mobile) {
      alert("Please fill in primary guest details");
      return;
    }
    
    // Here you would process the guest details and proceed to payment
    console.log("Guest Details:", {
      checkIn,
      checkOut,
      guests: parseInt(guests),
      primaryGuest,
      otherGuests
    });
    
    alert("Proceeding to payment gateway...");
  };

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  
  // Get tomorrow's date for minimum checkout
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl backdrop-blur-xl bg-white border border-gray-200 text-gray-900 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-gray-900 flex items-center justify-center gap-2">
            <User className="h-6 w-6" />
            Guest Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Booking Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <Label className="text-gray-600 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Check-in
                </Label>
                <Input
                  type="date"
                  value={checkIn}
                  min={today}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-gray-600 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Check-out
                </Label>
                <Input
                  type="date"
                  value={checkOut}
                  min={checkIn ? (new Date(new Date(checkIn).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]) : tomorrowStr}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-gray-600 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Guests
                </Label>
                <select
                  value={guests}
                  onChange={(e) => handleGuestCountChange(e.target.value)}
                  className="w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md text-gray-900"
                >
                  {Array.from({length: 25}, (_, i) => i + 1).map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Primary Guest Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Primary Guest Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="primary-name">Full Name *</Label>
                <Input
                  id="primary-name"
                  type="text"
                  value={primaryGuest.name}
                  onChange={(e) => setPrimaryGuest({...primaryGuest, name: e.target.value})}
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="primary-mobile">Mobile Number *</Label>
                <Input
                  id="primary-mobile"
                  type="tel"
                  value={primaryGuest.mobile}
                  onChange={(e) => setPrimaryGuest({...primaryGuest, mobile: e.target.value})}
                  placeholder="Enter mobile number"
                  required
                />
              </div>
            </div>
          </div>

          {/* Other Guests Details */}
          {otherGuests.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Other Guests Details</h3>
              {otherGuests.map((guest, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Guest {index + 2}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`guest-${index}-name`}>Full Name</Label>
                      <Input
                        id={`guest-${index}-name`}
                        type="text"
                        value={guest.name}
                        onChange={(e) => handleOtherGuestChange(index, 'name', e.target.value)}
                        placeholder="Enter full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`guest-${index}-mobile`}>Mobile Number</Label>
                      <Input
                        id={`guest-${index}-mobile`}
                        type="tel"
                        value={guest.mobile}
                        onChange={(e) => handleOtherGuestChange(index, 'mobile', e.target.value)}
                        placeholder="Enter mobile number"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              Back to Cart
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
            >
              Proceed to Payment
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GuestDetails;
