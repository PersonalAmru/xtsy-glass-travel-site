import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Calendar, Users, IndianRupee, Minus, Plus, ShoppingCart } from "lucide-react";
import CartModal from "./CartModal";

interface GroupBookingFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const GroupBookingForm = ({ isOpen, onClose }: GroupBookingFormProps) => {
  const [formData, setFormData] = useState({
    groupName: "",
    contactPerson: "",
    email: "",
    phone: "",
    checkIn: "",
    checkOut: "",
    guests: 26,
    roomType: "",
    specialRequests: ""
  });

  const [showCart, setShowCart] = useState(false);
  const [nights, setNights] = useState(0);
  
  const roomTypes = [
    { id: "4-bed-dorm", name: "4-Bed Mixed Dorm", pricePerNight: 800, capacity: 4 },
    { id: "6-bed-dorm", name: "6-Bed Mixed Dorm", pricePerNight: 700, capacity: 6 },
    { id: "signature-suite", name: "Signature 270° Glass Suite", pricePerNight: 2500, capacity: 2 },
    { id: "private-room", name: "Private Room", pricePerNight: 2000, capacity: 2 },
    { id: "entire-property", name: "Entire Property", pricePerNight: 15000, capacity: 50 }
  ];

  // Calculate nights when dates change
  useEffect(() => {
    if (formData.checkIn && formData.checkOut) {
      const checkIn = new Date(formData.checkIn);
      const checkOut = new Date(formData.checkOut);
      const diffTime = checkOut.getTime() - checkIn.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setNights(diffDays > 0 ? diffDays : 0);
    }
  }, [formData.checkIn, formData.checkOut]);

  // Fixed pricing for group booking - entire property
  const totalPrice = 15000 * nights;
  const gst = Math.round(totalPrice * 0.12);
  const finalTotal = totalPrice + gst;

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.checkIn || !formData.checkOut || nights <= 0) {
      alert("Please fill in all required fields including valid dates");
      return;
    }
    
    // WhatsApp booking functionality
    const bookingDetails = `
🏨 *XTSY Group Booking Request*

👥 *Group Details:*
Group Name: ${formData.groupName}
Contact Person: ${formData.contactPerson}
Email: ${formData.email}
Phone: ${formData.phone}

📅 *Booking Details:*
Check-in: ${formData.checkIn}
Check-out: ${formData.checkOut}
Nights: ${nights}
Total Guests: ${formData.guests}

💰 *Price Summary:*
Rate: ₹15,000 per night
Subtotal: ₹${(15000 * nights).toLocaleString()}
GST (12%): ₹${Math.round(15000 * nights * 0.12).toLocaleString()}
Total: ₹${(15000 * nights * 1.12).toLocaleString()}

📝 *Special Requests:*
${formData.specialRequests || 'None'}
    `.trim();

    const whatsappUrl = `https://wa.me/918837317070?text=${encodeURIComponent(bookingDetails)}`;
    window.open(whatsappUrl, '_blank');
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
          </DialogHeader>
          <Card className="bg-white/95 backdrop-blur-sm border-green-200 shadow-2xl border-0">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 font-serif-sans">
                <Users className="h-8 w-8 mx-auto mb-2 text-green-600" />
                Group Booking
              </CardTitle>
              <CardDescription className="text-gray-600 font-seasons">
                Perfect for group travels and special occasions
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Group Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="groupName">Group Name *</Label>
                    <Input
                      id="groupName"
                      value={formData.groupName}
                      onChange={(e) => handleInputChange('groupName', e.target.value)}
                      placeholder="Your Group Name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactPerson">Contact Person *</Label>
                    <Input
                      id="contactPerson"
                      value={formData.contactPerson}
                      onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                      placeholder="Group Leader Name"
                      required
                    />
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="group@example.com"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+91 XXXXXXXXXX"
                      required
                    />
                  </div>
                </div>

                {/* Booking Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="checkIn">Check-in Date *</Label>
                    <Input
                      id="checkIn"
                      type="date"
                      value={formData.checkIn}
                      onChange={(e) => handleInputChange('checkIn', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="checkOut">Check-out Date *</Label>
                    <Input
                      id="checkOut"
                      type="date"
                      value={formData.checkOut}
                      onChange={(e) => handleInputChange('checkOut', e.target.value)}
                      required
                    />
                  </div>
                </div>

                {nights > 0 && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-green-800 font-semibold">
                      <Calendar className="h-4 w-4 inline mr-2" />
                      Total Nights: {nights}
                    </p>
                  </div>
                )}

                {/* Guest Selection */}
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="guests">Total Guests</Label>
                    <div className="flex items-center space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleInputChange('guests', Math.max(26, formData.guests - 1))}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        id="guests"
                        type="number"
                        min="26"
                        max="58"
                        value={formData.guests}
                        onChange={(e) => handleInputChange('guests', parseInt(e.target.value) || 26)}
                        className="text-center w-20"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleInputChange('guests', Math.min(58, formData.guests + 1))}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Price Summary */}
                {nights > 0 && (
                  <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
                    <CardContent className="p-4">
                      <h3 className="font-bold text-green-800 mb-2 flex items-center">
                        <IndianRupee className="h-4 w-4 mr-1" />
                        Price Summary
                      </h3>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Group Booking × {nights} nights</span>
                          <span>₹15,000 per night</span>
                        </div>
                        <div className="flex justify-between">
                          <span>GST (12%)</span>
                          <span>₹{Math.round(15000 * nights * 0.12).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between font-bold text-green-800 pt-2 border-t border-green-200">
                          <span>Total Amount</span>
                          <span>₹{(15000 * nights * 1.12).toLocaleString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Special Requests */}
                <div>
                  <Label htmlFor="specialRequests">Special Requests</Label>
                  <Textarea
                    id="specialRequests"
                    value={formData.specialRequests}
                    onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                    placeholder="Any special requirements or requests..."
                    rows={3}
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-center">
                  <Button 
                    type="submit"
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold shadow-lg"
                    disabled={!formData.checkIn || !formData.checkOut || nights <= 0}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Book Now - ₹{nights > 0 ? (15000 * nights * 1.12).toLocaleString() : '0'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>

      <CartModal 
        isOpen={showCart}
        onClose={() => setShowCart(false)}
      />
    </>
  );
};

export default GroupBookingForm;
