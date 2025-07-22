
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Calendar, Users, Building, IndianRupee, Minus, Plus, Clock } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface B2BBookingFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const B2BBookingForm = ({ isOpen, onClose }: B2BBookingFormProps) => {
  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    checkIn: "",
    checkOut: "",
    guests: 26,
    bookingType: "partial" as "partial" | "entire",
    specialRequests: "",
    arrivalTime: "",
    includeBreakfast: false,
    includeDinner: false
  });

  const [nights, setNights] = useState(0);
  
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

  // B2B Corporate pricing: ₹850 per person average
  const accommodationCost = formData.guests * 850 * nights;
  const breakfastCost = formData.includeBreakfast ? formData.guests * 150 * nights : 0;
  const dinnerCost = formData.includeDinner ? formData.guests * 300 * nights : 0;
  const subtotal = accommodationCost + breakfastCost + dinnerCost;
  const gst = Math.round(subtotal * 0.12);
  const totalAmount = subtotal + gst;

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
    const mealDetails = [];
    if (formData.includeBreakfast) mealDetails.push(`Breakfast: ₹${breakfastCost.toLocaleString()}`);
    if (formData.includeDinner) mealDetails.push(`Dinner: ₹${dinnerCost.toLocaleString()}`);

    const bookingDetails = `
🏢 *B2B Corporate Booking Request*

🏢 *Company Details:*
Company Name: ${formData.companyName}
Contact Person: ${formData.contactPerson}
Email: ${formData.email}
Phone: ${formData.phone}

📅 *Booking Details:*
Check-in: ${formData.checkIn}
Check-out: ${formData.checkOut}
Nights: ${nights}
Total Guests: ${formData.guests}
Booking Type: ${formData.bookingType === 'entire' ? 'Entire Property' : 'Partial Booking'}
Arrival Time: ${formData.arrivalTime || 'Not specified'}

💰 *Price Summary:*
Accommodation: ₹${accommodationCost.toLocaleString()} (₹850 per person per night)
${mealDetails.length > 0 ? `Meals:\n${mealDetails.join('\n')}` : ''}
Subtotal: ₹${subtotal.toLocaleString()}
GST (12%): ₹${gst.toLocaleString()}
*Total: ₹${totalAmount.toLocaleString()}*

📝 *Special Requests:*
${formData.specialRequests || 'None'}
    `.trim();

    const whatsappUrl = `https://wa.me/918837317070?text=${encodeURIComponent(bookingDetails)}`;
    window.open(whatsappUrl, '_blank');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
        </DialogHeader>
        <Card className="bg-white/95 backdrop-blur-sm border-blue-200 shadow-2xl border-0">
          <CardHeader className="text-center pb-4 sm:pb-6">
            <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
              <Building className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 text-blue-600" />
              B2B Corporate Booking
            </CardTitle>
            <CardDescription className="text-gray-600 text-sm">
              Exclusive rates and services for corporate clients
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Company Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <Label htmlFor="companyName" className="text-sm">Company Name *</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    placeholder="Your Company Name"
                    className="h-10 sm:h-12 text-sm"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="contactPerson" className="text-sm">Contact Person *</Label>
                  <Input
                    id="contactPerson"
                    value={formData.contactPerson}
                    onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                    placeholder="Primary Contact Name"
                    className="h-10 sm:h-12 text-sm"
                    required
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <Label htmlFor="email" className="text-sm">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="company@example.com"
                    className="h-10 sm:h-12 text-sm"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-sm">Phone *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+91 XXXXXXXXXX"
                    className="h-10 sm:h-12 text-sm"
                    required
                  />
                </div>
              </div>

              {/* Booking Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <Label htmlFor="checkIn" className="text-sm">Check-in Date *</Label>
                  <Input
                    id="checkIn"
                    type="date"
                    value={formData.checkIn}
                    onChange={(e) => handleInputChange('checkIn', e.target.value)}
                    className="h-10 sm:h-12 text-sm"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="checkOut" className="text-sm">Check-out Date *</Label>
                  <Input
                    id="checkOut"
                    type="date"
                    value={formData.checkOut}
                    onChange={(e) => handleInputChange('checkOut', e.target.value)}
                    className="h-10 sm:h-12 text-sm"
                    required
                  />
                </div>
              </div>

              {nights > 0 && (
                <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                  <p className="text-blue-800 font-semibold text-sm">
                    <Calendar className="h-4 w-4 inline mr-2" />
                    Total Nights: {nights}
                  </p>
                </div>
              )}

              {/* Guest Selection and Booking Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <Label htmlFor="guests" className="text-sm">Total Guests</Label>
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleInputChange('guests', Math.max(26, formData.guests - 1))}
                    >
                      <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                    <Input
                      id="guests"
                      type="number"
                      min="26"
                      max="58"
                      value={formData.guests}
                      onChange={(e) => handleInputChange('guests', parseInt(e.target.value) || 26)}
                      className="text-center w-16 sm:w-20 h-10 text-sm"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleInputChange('guests', Math.min(58, formData.guests + 1))}
                    >
                      <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="arrivalTime" className="text-sm">Time of Arrival</Label>
                  <Input
                    id="arrivalTime"
                    type="time"
                    value={formData.arrivalTime}
                    onChange={(e) => handleInputChange('arrivalTime', e.target.value)}
                    className="h-10 sm:h-12 text-sm"
                  />
                </div>
              </div>

              {/* Booking Type */}
              <div>
                <Label className="text-sm font-medium">Booking Type</Label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="bookingType"
                      value="partial"
                      checked={formData.bookingType === "partial"}
                      onChange={(e) => handleInputChange('bookingType', e.target.value)}
                      className="text-blue-600"
                    />
                    <span className="text-sm">Partial Booking</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="bookingType"
                      value="entire"
                      checked={formData.bookingType === "entire"}
                      onChange={(e) => handleInputChange('bookingType', e.target.value)}
                      className="text-blue-600"
                    />
                    <span className="text-sm">Entire Property</span>
                  </label>
                </div>
              </div>

              {/* Food Add-ons */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Food Add-ons</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="breakfast"
                      checked={formData.includeBreakfast}
                      onCheckedChange={(checked) => handleInputChange('includeBreakfast', checked)}
                    />
                    <Label htmlFor="breakfast" className="text-sm">
                      Breakfast - ₹150/person/day
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="dinner"
                      checked={formData.includeDinner}
                      onCheckedChange={(checked) => handleInputChange('includeDinner', checked)}
                    />
                    <Label htmlFor="dinner" className="text-sm">
                      Dinner Thali (Veg/Non-Veg) - ₹300/person/day
                    </Label>
                  </div>
                </div>
              </div>

              {/* Price Summary */}
              {nights > 0 && (
                <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
                  <CardContent className="p-3 sm:p-4">
                    <h3 className="font-bold text-blue-800 mb-2 flex items-center text-sm">
                      <IndianRupee className="h-4 w-4 mr-1" />
                      Price Summary
                    </h3>
                    <div className="space-y-1 text-xs sm:text-sm">
                      <div className="flex justify-between">
                        <span>Accommodation ({formData.guests} guests × {nights} nights)</span>
                        <span>₹{accommodationCost.toLocaleString()}</span>
                      </div>
                      {formData.includeBreakfast && (
                        <div className="flex justify-between">
                          <span>Breakfast</span>
                          <span>₹{breakfastCost.toLocaleString()}</span>
                        </div>
                      )}
                      {formData.includeDinner && (
                        <div className="flex justify-between">
                          <span>Dinner</span>
                          <span>₹{dinnerCost.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>GST (12%)</span>
                        <span>₹{gst.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-bold text-blue-800 pt-2 border-t border-blue-200">
                        <span>Total Amount</span>
                        <span>₹{totalAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Special Requests */}
              <div>
                <Label htmlFor="specialRequests" className="text-sm">Special Requests</Label>
                <Textarea
                  id="specialRequests"
                  value={formData.specialRequests}
                  onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                  placeholder="Any special requirements or requests..."
                  rows={3}
                  className="text-sm"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-center">
                <Button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold shadow-lg h-10 sm:h-12 text-sm"
                  disabled={!formData.checkIn || !formData.checkOut || nights <= 0}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Book Now - ₹{nights > 0 ? totalAmount.toLocaleString() : '0'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default B2BBookingForm;
