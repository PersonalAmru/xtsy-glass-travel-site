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
import { useApp } from "@/contexts/AppContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import FoodAddonsSection from "@/components/FoodAddonsSection";

interface GroupBookingFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const GroupBookingForm = ({ isOpen, onClose }: GroupBookingFormProps) => {
  const { formatPrice } = useApp();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    groupName: "",
    contactPerson: "",
    email: "",
    phone: "",
    city: "",
    pincode: "",
    checkIn: "",
    checkOut: "",
    arrivalTime: "",
    guests: 20,
    roomType: "",
    breakfast: false,
    breakfastGuests: 20,
    dinner: false,
    dinnerGuests: 20,
    dinnerType: "veg",
    transportation: false,
    itinerary: false,
    specialRequests: ""
  });

  const [showCart, setShowCart] = useState(false);
  const [nights, setNights] = useState(0);
  
  const roomTypes = [
    { id: "4-bed-dorm", name: "4-Bed Mixed Dorm", pricePerNight: 800, capacity: 4 },
    { id: "6-bed-dorm", name: "6-Bed Mixed Dorm", pricePerNight: 700, capacity: 6 },
    { id: "signature-suite", name: "270° Panorama Glass Ensuite", pricePerNight: 2500, capacity: 2 },
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

  // Calculate food add-ons
  const breakfastCost = formData.breakfast ? formData.breakfastGuests * 150 * nights : 0;
  const dinnerCost = formData.dinner ? formData.dinnerGuests * 300 * nights : 0;
  const foodTotal = breakfastCost + dinnerCost;
  
  // Fixed pricing for group booking - entire property
  const totalPrice = 15000 * nights;
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
      const bookingId = `GROUP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Save to Supabase
      const { error } = await supabase
        .from('bookings')
        .insert({
          booking_id: bookingId,
          room_type: "Group Booking",
          room_type_id: "group-booking",
          guest_name: formData.groupName,
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
          subtotal: totalPrice,
          taxes: gst,
          total_amount: finalTotal,
          source: 'group_booking_form'
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
        description: "Your group booking has been recorded successfully.",
      });
      
      // WhatsApp booking functionality
      const foodDetails = [];
      if (formData.breakfast) foodDetails.push(`• Breakfast: ${formData.breakfastGuests} guests - ${formatPrice(breakfastCost)}`);
      if (formData.dinner) foodDetails.push(`• Dinner (${formData.dinnerType}): ${formData.dinnerGuests} guests - ${formatPrice(dinnerCost)}`);
      
      const additionalServices = [];
      if (formData.transportation) additionalServices.push("• Transportation Arrangement");
      if (formData.itinerary) additionalServices.push("• Travel Itinerary Support");
      
      const bookingDetails = `
🏨 *XTSY Group Booking Request*
Booking ID: ${bookingId}

👥 *Group Details:*
Group Name: ${formData.groupName}
Contact Person: ${formData.contactPerson}
Email: ${formData.email}
Phone: ${formData.phone}
City: ${formData.city}, Pincode: ${formData.pincode}

📅 *Booking Details:*
Check-in: ${formData.checkIn}
Check-out: ${formData.checkOut}
${formData.arrivalTime ? `Arrival Time: ${formData.arrivalTime}` : ''}
Nights: ${nights}
Total Guests: ${formData.guests}

💰 *Price Summary:*
Property Rate: ${formatPrice(15000 * nights)}
${foodDetails.length > 0 ? `Food Add-ons:\n${foodDetails.join('\n')}` : ''}
${additionalServices.length > 0 ? `Additional Services:\n${additionalServices.join('\n')}` : ''}
GST (12%): ${formatPrice(gst)}
*Total: ${formatPrice(finalTotal)}*

📝 *Special Requests:*
${formData.specialRequests || 'None'}
      `.trim();

      const welcomeMessage = `👥 *XTSY - Group Booking Request* 👥

Hi XTSY Team! We're planning an exciting group trip to Meghalaya! 🏔️

${bookingDetails}

We're thrilled to experience XTSY's hospitality with our group! Looking forward to your confirmation! 🎉`;

      const whatsappUrl = `https://api.whatsapp.com/send/?phone=918837317070&text=${encodeURIComponent(welcomeMessage)}&type=phone_number&app_absent=0`;
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
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
          </DialogHeader>
          <Card className="bg-card/95 backdrop-blur-sm border-border shadow-2xl border">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                Group Booking
              </CardTitle>
              <CardDescription className="text-muted-foreground">
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

                 {/* Food Add-ons & Additional Services */}
                 <FoodAddonsSection 
                   formData={formData}
                   onInputChange={handleInputChange}
                 />

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
                    onClick={handleSubmit}
                    className="w-full bg-gradient-to-r from-primary to-orange-600 hover:from-orange-600 hover:to-red-700 text-white font-bold shadow-lg"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Book Now
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
