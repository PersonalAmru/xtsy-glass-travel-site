import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { Building2, Calendar, Users, IndianRupee, Minus, Plus } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import FoodAddonsSection from "@/components/FoodAddonsSection";

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
    petDetails: false,
    petType: "",
    petBreed: "",
    petSize: "",
    petAge: "",
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

  const handleSubmit = async () => {
    try {
      // Use secure RPC function with server-side validation
      const { data, error } = await supabase.rpc('create_booking_secure', {
        p_guest_name: formData.companyName || 'Guest',
        p_email: formData.email || 'inquiry@xtsy.one',
        p_whatsapp_number: formData.phone || '+910000000000',
        p_city: formData.city || null,
        p_pincode: formData.pincode || null,
        p_check_in: formData.checkIn || new Date().toISOString().split('T')[0],
        p_check_out: formData.checkOut || new Date(Date.now() + 86400000).toISOString().split('T')[0],
        p_guests: formData.guests || 1,
        p_room_type: isCoupleFocused ? 'Couple Getaway' : 'B2B Booking',
        p_room_type_id: isCoupleFocused ? 'couple-getaway' : 'b2b-booking',
        p_quantity: 1,
        p_subtotal: isCoupleFocused ? 0 : totalPrice,
        p_taxes: isCoupleFocused ? 0 : gst,
        p_total_amount: isCoupleFocused ? 0 : finalTotal,
        p_special_requests: formData.specialRequests || null
      });

      // Log error but don't block WhatsApp redirect
      if (error) {
        console.error('Error saving booking:', error.message);
      }
      
      // Build beautiful WhatsApp message with all details
      const foodAddons = [];
      if (formData.breakfast) {
        foodAddons.push(`🍳 Breakfast: ${formData.breakfastGuests} guests - ${formatPrice(breakfastCost)}`);
      }
      if (formData.dinner) {
        foodAddons.push(`🍽️ Dinner (${formData.dinnerType === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'}): ${formData.dinnerGuests} guests - ${formatPrice(dinnerCost)}`);
      }
      
      const additionalServices = [];
      if (formData.transportation) {
        additionalServices.push('🚗 Transportation Arrangement');
      }
      if (formData.itinerary) {
        additionalServices.push('📋 Travel Itinerary Support');
      }
      
      const whatsappMessage = isCoupleFocused 
        ? `✨ *Romantic Getaway Inquiry* ✨

🌟 *Welcome to Premium Panoramic Glass Suite Experience*

Hi XTSY Team! We're planning a romantic escape and would love to experience your stunning suite! 💕

❤️ *Guest Details:*
${formData.companyName || 'Guest'}${formData.contactPerson ? ` & ${formData.contactPerson}` : ''}
📧 Email: ${formData.email || 'Not provided'}
📱 Phone: ${formData.phone || 'Not provided'}
📍 City: ${formData.city || 'Not provided'}, PIN: ${formData.pincode || 'Not provided'}

📅 *Booking Details:*
Check-in: ${formData.checkIn || 'Not selected'}
Check-out: ${formData.checkOut || 'Not selected'}
🌙 Nights: ${nights || 0}
👥 Guests: ${formData.guests || 1} (Couple)
${formData.eventType ? `💝 Occasion: ${formData.eventType}` : ''}

${foodAddons.length > 0 ? `🍴 *Food Add-ons:*\n${foodAddons.join('\n')}\n\n` : ''}${additionalServices.length > 0 ? `✨ *Additional Services:*\n${additionalServices.join('\n')}\n\n` : ''}${formData.specialRequests ? `💬 *Special Requests:*\n${formData.specialRequests}\n\n` : ''}Looking forward to creating magical memories with you! 🏔️✨
        `.trim()
        : `🏢 *Corporate Booking Inquiry* 🏢

🌟 *Premium Mountain View Accommodation*

Hello XTSY Team! We'd like to book your property for a corporate event! 🎯

🏢 *Company Details:*
Company: ${formData.companyName || 'Not provided'}
Contact Person: ${formData.contactPerson || 'Not provided'}
📧 Email: ${formData.email || 'Not provided'}
📱 Phone: ${formData.phone || 'Not provided'}
📍 City: ${formData.city || 'Not provided'}, PIN: ${formData.pincode || 'Not provided'}

📅 *Booking Details:*
Check-in: ${formData.checkIn || 'Not selected'}
Check-out: ${formData.checkOut || 'Not selected'}
🌙 Nights: ${nights || 0}
👥 Total Guests: ${formData.guests || 1}
🎯 Event Type: ${formData.eventType || 'Not specified'}

💰 *Price Summary (Corporate Rate):*
Accommodation: ${formatPrice(totalPrice)} (${formatPrice(corporateRate)}/person/night)
${foodAddons.length > 0 ? foodAddons.join('\n') + '\n' : ''}${additionalServices.length > 0 ? additionalServices.join('\n') + '\n' : ''}GST (12%): ${formatPrice(gst)}
*Total: ${formatPrice(finalTotal)}*

${formData.specialRequests ? `📝 *Special Requests:*\n${formData.specialRequests}\n\n` : ''}Looking forward to hosting a successful corporate event at XTSY! 🏔️
        `.trim();
      
      const whatsappUrl = `https://api.whatsapp.com/send/?phone=918837317070&text=${encodeURIComponent(whatsappMessage)}&type=phone_number&app_absent=0`;
      window.open(whatsappUrl, '_blank');
      onClose();
    } catch (error) {
      console.error('Error processing booking:', error);
      // Still redirect to WhatsApp even if save fails
      window.open('https://api.whatsapp.com/send/?phone=918837317070&text&type=phone_number&app_absent=0', '_blank');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <VisuallyHidden>
            <DialogTitle>{customTitle}</DialogTitle>
            <DialogDescription>{customDescription}</DialogDescription>
          </VisuallyHidden>
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
                <FoodAddonsSection 
                  formData={formData}
                  onInputChange={handleInputChange}
                />
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
                  onClick={handleSubmit}
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
