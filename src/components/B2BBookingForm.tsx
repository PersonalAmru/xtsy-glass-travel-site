import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Building2, Calendar, Users, IndianRupee, Minus, Plus } from "lucide-react";
import { useApp } from "@/contexts/AppContext";

interface B2BBookingFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const B2BBookingForm = ({ isOpen, onClose }: B2BBookingFormProps) => {
  const { formatPrice } = useApp();
  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    checkIn: "",
    checkOut: "",
    arrivalTime: "",
    guests: 20,
    eventType: "",
    breakfast: false,
    dinner: false,
    dinnerType: "veg",
    transportation: false,
    itinerary: false,
    specialRequests: ""
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

  // Calculate food add-ons
  const breakfastCost = formData.breakfast ? formData.guests * 150 * nights : 0;
  const dinnerCost = formData.dinner ? formData.guests * 300 * nights : 0;
  const foodTotal = breakfastCost + dinnerCost;
  
  // B2B Corporate pricing - 850 INR per guest per night (higher rate than group booking)
  const corporateRate = 850;
  const totalPrice = corporateRate * formData.guests * nights;
  const gst = Math.round((totalPrice + foodTotal) * 0.12);
  const finalTotal = totalPrice + foodTotal + gst;

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
    const foodDetails = [];
    if (formData.breakfast) foodDetails.push(`Breakfast: ${formatPrice(breakfastCost)}`);
    if (formData.dinner) foodDetails.push(`Dinner (${formData.dinnerType}): ${formatPrice(dinnerCost)}`);
    
    const additionalServices = [];
    if (formData.transportation) additionalServices.push("Transportation Arrangement");
    if (formData.itinerary) additionalServices.push("Travel Itinerary Support");
    
    const bookingDetails = `
🏢 *XTSY B2B Corporate Booking Request*

🏢 *Company Details:*
Company: ${formData.companyName}
Contact Person: ${formData.contactPerson}
Email: ${formData.email}
Phone: ${formData.phone}

📅 *Booking Details:*
Check-in: ${formData.checkIn}
Check-out: ${formData.checkOut}
${formData.arrivalTime ? `Arrival Time: ${formData.arrivalTime}` : ''}
Nights: ${nights}
Total Guests: ${formData.guests}
Event Type: ${formData.eventType}

💰 *Price Summary (Corporate Rate):*
Accommodation: ${formatPrice(totalPrice)} (${formatPrice(corporateRate)}/person/night)
${foodDetails.length > 0 ? `Food Add-ons:\n${foodDetails.join('\n')}` : ''}
${additionalServices.length > 0 ? `Additional Services:\n${additionalServices.map(service => `• ${service}`).join('\n')}` : ''}
GST (12%): ${formatPrice(gst)}
*Total: ${formatPrice(finalTotal)}*

📝 *Special Requests:*
${formData.specialRequests || 'None'}
    `.trim();

    const whatsappUrl = `https://wa.me/918837317070?text=${encodeURIComponent(bookingDetails)}`;
    window.open(whatsappUrl, '_blank');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
        </DialogHeader>
        <Card className="bg-card/95 backdrop-blur-sm border-border shadow-2xl border">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              <Building2 className="h-8 w-8 mx-auto mb-2 text-primary" />
              B2B Corporate Booking
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Professional accommodation solutions for corporate events ({formatPrice(850)}/person/night)
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Company Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    placeholder="Your Company Name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="contactPerson">Contact Person *</Label>
                  <Input
                    id="contactPerson"
                    value={formData.contactPerson}
                    onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                    placeholder="Primary Contact Name"
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
                    placeholder="company@example.com"
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
                <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                  <p className="text-primary font-semibold">
                    <Calendar className="h-4 w-4 inline mr-2" />
                    Total Nights: {nights}
                  </p>
                </div>
              )}

              {/* Time of Arrival */}
              <div>
                <Label htmlFor="arrivalTime">Expected Time of Arrival</Label>
                <Input
                  id="arrivalTime"
                  type="time"
                  value={formData.arrivalTime}
                  onChange={(e) => handleInputChange('arrivalTime', e.target.value)}
                  placeholder="e.g., 14:00"
                />
              </div>

              {/* Guest Selection */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="guests">Total Guests (Min: 20, Max: 100)</Label>
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleInputChange('guests', Math.max(20, formData.guests - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      id="guests"
                      type="number"
                      min="20"
                      max="100"
                      value={formData.guests}
                      onChange={(e) => handleInputChange('guests', parseInt(e.target.value) || 20)}
                      className="text-center w-20"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleInputChange('guests', Math.min(100, formData.guests + 1))}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="eventType">Event Type *</Label>
                <Input
                  id="eventType"
                  value={formData.eventType}
                  onChange={(e) => handleInputChange('eventType', e.target.value)}
                  placeholder="Conference, Team Building, etc."
                  required
                />
              </div>

              {/* Food Add-ons & Additional Services */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold">Food Add-ons & Additional Services</Label>
                
                {/* Breakfast */}
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border">
                  <div>
                    <h4 className="font-semibold">Breakfast</h4>
                    <p className="text-sm text-muted-foreground">{formatPrice(150)} per person per day</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.breakfast}
                    onChange={(e) => handleInputChange('breakfast', e.target.checked)}
                    className="w-5 h-5 text-primary"
                  />
                </div>

                {/* Dinner */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border">
                    <div>
                      <h4 className="font-semibold">Dinner Thali</h4>
                      <p className="text-sm text-muted-foreground">{formatPrice(300)} per person per day (Veg/Non-Veg)</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleInputChange('guests', Math.max(20, formData.guests - 1))}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        min="20"
                        max="100"
                        value={formData.guests}
                        onChange={(e) => handleInputChange('guests', parseInt(e.target.value) || 20)}
                        className="text-center w-20"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleInputChange('guests', Math.min(100, formData.guests + 1))}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <input
                        type="checkbox"
                        checked={formData.dinner}
                        onChange={(e) => handleInputChange('dinner', e.target.checked)}
                        className="w-5 h-5 text-primary ml-2"
                      />
                    </div>
                  </div>
                  
                  {formData.dinner && (
                    <div className="ml-4">
                      <Label>Dinner Type</Label>
                      <Select value={formData.dinnerType} onValueChange={(value) => handleInputChange('dinnerType', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="veg">Vegetarian Thali</SelectItem>
                          <SelectItem value="nonveg">Non-Vegetarian Thali</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                {/* Transportation */}
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border">
                  <div>
                    <h4 className="font-semibold">Transportation Arrangement</h4>
                    <p className="text-sm text-muted-foreground">Local transport and transfers</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.transportation}
                    onChange={(e) => handleInputChange('transportation', e.target.checked)}
                    className="w-5 h-5 text-primary"
                  />
                </div>

                {/* Travel Itinerary */}
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border">
                  <div>
                    <h4 className="font-semibold">Travel Itinerary Support</h4>
                    <p className="text-sm text-muted-foreground">Customized itinerary planning</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.itinerary}
                    onChange={(e) => handleInputChange('itinerary', e.target.checked)}
                    className="w-5 h-5 text-primary"
                  />
                </div>
              </div>

              {/* Price Summary */}
              {nights > 0 && (
                <Card className="bg-primary/10 border-primary/20">
                  <CardContent className="p-4">
                    <h3 className="font-bold text-primary mb-2 flex items-center">
                      <IndianRupee className="h-4 w-4 mr-1" />
                      Price Summary (Corporate Rate)
                    </h3>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Accommodation ({formData.guests} guests × {nights} nights × {formatPrice(850)})</span>
                          <span>{formatPrice(totalPrice)}</span>
                        </div>
                        {formData.breakfast && (
                          <div className="flex justify-between">
                            <span>Breakfast ({formData.guests} guests × {nights} nights)</span>
                            <span>{formatPrice(breakfastCost)}</span>
                          </div>
                        )}
                        {formData.dinner && (
                          <div className="flex justify-between">
                            <span>Dinner {formData.dinnerType} ({formData.guests} guests × {nights} nights)</span>
                            <span>{formatPrice(dinnerCost)}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span>GST (12%)</span>
                          <span>{formatPrice(gst)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-primary pt-2 border-t border-primary/20">
                          <span>Total Amount</span>
                          <span>{formatPrice(finalTotal)}</span>
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
                  className="w-full bg-gradient-to-r from-primary to-orange-600 hover:from-orange-600 hover:to-red-700 text-white font-bold shadow-lg"
                  disabled={!formData.checkIn || !formData.checkOut || nights <= 0}
                >
                  <Building2 className="h-4 w-4 mr-2" />
                  Book Now - {nights > 0 ? formatPrice(finalTotal) : formatPrice(0)}
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
