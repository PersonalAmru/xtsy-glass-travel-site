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
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface B2BBookingFormProps {
  isOpen: boolean;
  onClose: () => void;
  customTitle?: string;
  customDescription?: string;
  customIcon?: React.ComponentType<{ className?: string }>;
  maxGuests?: number;
  fixedGuests?: boolean;
  isCoupleFocused?: boolean;
}

const B2BBookingForm = ({ 
  isOpen, 
  onClose, 
  customTitle = "B2B Corporate Booking",
  customDescription = "Professional accommodation solutions for corporate events",
  customIcon: CustomIcon = Building2,
  maxGuests = 50,
  fixedGuests = false,
  isCoupleFocused = false
}: B2BBookingFormProps) => {
  const { formatPrice } = useApp();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    city: "",
    pincode: "",
    checkIn: "",
    checkOut: "",
    arrivalTime: "",
    guests: fixedGuests ? maxGuests : 20,
    eventType: "",
    breakfast: false,
    breakfastGuests: fixedGuests ? maxGuests : 20,
    dinner: false,
    dinnerGuests: fixedGuests ? maxGuests : 20,
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
  const breakfastCost = formData.breakfast ? formData.breakfastGuests * 150 * nights : 0;
  const dinnerCost = formData.dinner ? formData.dinnerGuests * 300 * nights : 0;
  const foodTotal = breakfastCost + dinnerCost;
  
  // B2B Corporate pricing - 850 INR per guest per night (higher rate than group booking)
  const corporateRate = 850;
  const totalPrice = corporateRate * formData.guests * nights;
  const gst = Math.round((totalPrice + foodTotal) * 0.12);
  const finalTotal = totalPrice + foodTotal + gst;

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Auto-set meal guest counts to total guests when first enabling food options
      if (field === 'breakfast' && value && !prev.breakfast) {
        newData.breakfastGuests = prev.guests;
      }
      if (field === 'dinner' && value && !prev.dinner) {
        newData.dinnerGuests = prev.guests;
      }
      
      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Generate unique booking ID
      const bookingId = `XTSY270-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Save to Supabase
      const { error } = await supabase
        .from('bookings')
        .insert({
          booking_id: bookingId,
          room_type: "XTSY 270",
          room_type_id: "xtsy-270",
          guest_name: formData.companyName,
          email: formData.email,
          whatsapp_number: formData.phone,
          city: formData.city,
          pincode: formData.pincode,
          check_in: formData.checkIn,
          check_out: formData.checkOut,
          guests: formData.guests,
          special_requests: formData.specialRequests,
          booking_status: 'pending',
          payment_status: 'pending',
          subtotal: isCoupleFocused ? 0 : totalPrice,
          taxes: isCoupleFocused ? 0 : gst,
          total_amount: isCoupleFocused ? 0 : finalTotal,
          source: 'xtsy270_form'
        });

      if (error) {
        console.error('Error saving booking:', error);
        toast({
          title: "Booking Error",
          description: "Failed to save booking. Please try again.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Booking Saved!",
        description: "Your XTSY 270 booking has been recorded successfully.",
      });
      
      // WhatsApp booking functionality
      const bookingDetails = isCoupleFocused 
        ? `
✨ *XTSY 270° Glass Suite - Romantic Escape*
Booking ID: ${bookingId}

❤️ *Guest Details:*
${formData.companyName} & ${formData.contactPerson}
Email: ${formData.email}
Phone: ${formData.phone}
City: ${formData.city}, Pincode: ${formData.pincode}

📅 *Booking Details:*
Check-in: ${formData.checkIn}
Check-out: ${formData.checkOut}
Nights: ${nights}
Guests: ${formData.guests} (Couple)
${formData.eventType ? `Occasion: ${formData.eventType}` : ''}

💝 *Special Requests:*
${formData.specialRequests || 'None'}

🌟 *Experience:* India's First 270° Panoramic Glass House
        `.trim()
        : `
🏢 *XTSY B2B Corporate Booking Request*
Booking ID: ${bookingId}

🏢 *Company Details:*
Company: ${formData.companyName}
Contact Person: ${formData.contactPerson}
Email: ${formData.email}
Phone: ${formData.phone}
City: ${formData.city}, Pincode: ${formData.pincode}

📅 *Booking Details:*
Check-in: ${formData.checkIn}
Check-out: ${formData.checkOut}
Nights: ${nights}
Total Guests: ${formData.guests}
Event Type: ${formData.eventType}

💰 *Price Summary (Corporate Rate):*
Accommodation: ${formatPrice(totalPrice)} (${formatPrice(corporateRate)}/person/night)
${formData.breakfast ? `Breakfast: ${formData.breakfastGuests} guests - ${formatPrice(breakfastCost)}` : ''}
${formData.dinner ? `Dinner (${formData.dinnerType}): ${formData.dinnerGuests} guests - ${formatPrice(dinnerCost)}` : ''}
${formData.transportation ? '• Transportation Arrangement' : ''}
${formData.itinerary ? '• Travel Itinerary Support' : ''}
GST (12%): ${formatPrice(gst)}
*Total: ${formatPrice(finalTotal)}*

📝 *Special Requests:*
${formData.specialRequests || 'None'}
        `.trim();

      const whatsappUrl = `https://api.whatsapp.com/send/?phone=918837317070&text=${encodeURIComponent(bookingDetails)}&type=phone_number&app_absent=0`;
      window.open(whatsappUrl, '_blank');
      onClose();
    } catch (error) {
      console.error('Error processing booking:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
        </DialogHeader>
        <Card className="bg-card/95 backdrop-blur-sm border-border shadow-2xl border">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              <CustomIcon className="h-8 w-8 mx-auto mb-2 text-primary" />
              {customTitle}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {customDescription}{!isCoupleFocused && ` (${formatPrice(850)}/person/night)`}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Guest Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyName">{isCoupleFocused ? "Your Name" : "Company Name"} *</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    placeholder={isCoupleFocused ? "Your full name" : "Your Company Name"}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="contactPerson">{isCoupleFocused ? "Partner's Name" : "Contact Person"} *</Label>
                  <Input
                    id="contactPerson"
                    value={formData.contactPerson}
                    onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                    placeholder={isCoupleFocused ? "Partner's full name" : "Primary Contact Name"}
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

              {/* City & Pincode */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="Your city"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="pincode">Pincode *</Label>
                  <Input
                    id="pincode"
                    value={formData.pincode}
                    onChange={(e) => handleInputChange('pincode', e.target.value)}
                    placeholder="Your pincode"
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

              {/* Guest Display - Fixed for couples */}
              {fixedGuests && (
                <div className="p-4 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-foreground font-semibold text-lg">
                        {isCoupleFocused ? "Exclusive suite" : "Number of Guests"}
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {isCoupleFocused ? "An intimate escape designed for couples" : "Fixed accommodation"}
                      </p>
                    </div>
                    <span className="text-3xl font-bold text-primary">{maxGuests} {isCoupleFocused ? "❤️" : ""}</span>
                  </div>
                </div>
              )}

              {/* Guest Selection - For non-fixed bookings */}
              {!fixedGuests && (
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
              )}

              <div>
                <Label htmlFor="eventType">{isCoupleFocused ? "Special Occasion (Optional)" : "Event Type *"}</Label>
                <Input
                  id="eventType"
                  value={formData.eventType}
                  onChange={(e) => handleInputChange('eventType', e.target.value)}
                  placeholder={isCoupleFocused ? "Anniversary, Honeymoon, Proposal, or just because..." : "Conference, Team Building, etc."}
                  required={!isCoupleFocused}
                />
              </div>

              {/* Food Add-ons & Additional Services - Hide for couple-focused */}
              {!isCoupleFocused && (
                <div className="space-y-4">
                  <Label className="text-lg font-semibold">Food Add-ons & Additional Services</Label>
                
                {/* Breakfast */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border">
                    <div>
                      <h4 className="font-semibold">Breakfast</h4>
                      <p className="text-sm text-muted-foreground">Start your day with a delightful morning feast</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {formData.breakfast && (
                        <>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleInputChange('breakfastGuests', Math.max(1, formData.breakfastGuests - 1))}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <Input
                            type="number"
                            min="1"
                            max={formData.guests}
                            value={formData.breakfastGuests}
                            onChange={(e) => handleInputChange('breakfastGuests', Math.min(formData.guests, parseInt(e.target.value) || 1))}
                            className="text-center w-20"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleInputChange('breakfastGuests', Math.min(formData.guests, formData.breakfastGuests + 1))}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      <input
                        type="checkbox"
                        checked={formData.breakfast}
                        onChange={(e) => handleInputChange('breakfast', e.target.checked)}
                        className="w-5 h-5 text-primary ml-2"
                      />
                    </div>
                  </div>
                </div>

                {/* Dinner */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border">
                    <div>
                      <h4 className="font-semibold">Dinner</h4>
                      <p className="text-sm text-muted-foreground">Savor authentic flavors crafted with love</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {formData.dinner && (
                        <>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleInputChange('dinnerGuests', Math.max(1, formData.dinnerGuests - 1))}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <Input
                            type="number"
                            min="1"
                            max={formData.guests}
                            value={formData.dinnerGuests}
                            onChange={(e) => handleInputChange('dinnerGuests', Math.min(formData.guests, parseInt(e.target.value) || 1))}
                            className="text-center w-20"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleInputChange('dinnerGuests', Math.min(formData.guests, formData.dinnerGuests + 1))}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </>
                      )}
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
                          <SelectItem value="veg">Vegetarian</SelectItem>
                          <SelectItem value="nonveg">Non-Vegetarian</SelectItem>
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
              )}

              {/* Special Requests */}
              <div>
                <Label htmlFor="specialRequests">{isCoupleFocused ? "Special Requests (Optional)" : "Special Requests"}</Label>
                <Textarea
                  id="specialRequests"
                  value={formData.specialRequests}
                  onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                  placeholder={isCoupleFocused ? "Any special touches to make your stay memorable? (e.g., flower petals, champagne, special dietary needs)" : "Any special requirements or requests..."}
                  rows={3}
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-center">
                <Button 
                  type="button"
                  onClick={() => window.open('https://api.whatsapp.com/send/?phone=918837317070&text&type=phone_number&app_absent=0', '_blank')}
                  className="w-full bg-gradient-to-r from-primary to-orange-600 hover:from-orange-600 hover:to-red-700 text-white font-bold shadow-lg"
                >
                  {isCoupleFocused ? (
                    <>
                      <CustomIcon className="h-4 w-4 mr-2" />
                      Reserve Your Romantic Escape
                    </>
                  ) : (
                    <>
                      <Building2 className="h-4 w-4 mr-2" />
                      Book Now
                    </>
                  )}
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
