import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { MessageCircle, Calendar, Users, Phone, Trash2, Home } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { saveWhatsAppBooking } from "@/services/formBookingService";
import FoodAddonsSection from "@/components/FoodAddonsSection";

interface WhatsAppBookingFormProps {
  isOpen: boolean;
  onClose: () => void;
}

interface RoomType {
  id: string;
  name: string;
  category: string;
  base_price: number;
  capacity: number;
}

interface SelectedRoom {
  roomTypeId: string;
  roomTypeName: string;
  quantity: number;
  price: number;
}

const WhatsAppBookingForm = ({ isOpen, onClose }: WhatsAppBookingFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    pincode: "",
    checkIn: "",
    checkOut: "",
    guests: 2,
    specialRequests: "",
    breakfast: false,
    breakfastGuests: 1,
    dinner: false,
    dinnerGuests: 1,
    dinnerType: "veg",
    transportation: false,
    itinerary: false,
    petDetails: false,
    petType: "",
    petBreed: "",
    petSize: "",
    petAge: ""
  });

  const [nights, setNights] = useState(0);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [selectedRoomIds, setSelectedRoomIds] = useState<Set<string>>(new Set());
  const [selectedRooms, setSelectedRooms] = useState<SelectedRoom[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [roomsError, setRoomsError] = useState<string>("");

  useEffect(() => {
    if (formData.checkIn && formData.checkOut) {
      const checkIn = new Date(formData.checkIn);
      const checkOut = new Date(formData.checkOut);
      const diffTime = checkOut.getTime() - checkIn.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setNights(diffDays > 0 ? diffDays : 0);
    }
  }, [formData.checkIn, formData.checkOut]);

  // Fetch room types from Supabase edge function
  useEffect(() => {
    const fetchRoomTypes = async () => {
      setLoadingRooms(true);
      setRoomsError("");
      
      try {
        console.log('Fetching room types...');
        const { data, error } = await supabase.functions.invoke('get-room-types');

        if (error) {
          console.error('Error fetching room types:', error);
          setRoomsError('Failed to load room types');
          
          // Fallback: Load directly from Supabase table
          console.log('Attempting fallback: loading from room_types table...');
          const { data: roomTypesData, error: tableError } = await supabase
            .from('room_types')
            .select('*')
            .eq('is_active', true);
          
          if (tableError) {
            console.error('Fallback also failed:', tableError);
          } else if (roomTypesData) {
            setRoomTypes(roomTypesData);
            setRoomsError("");
            console.log('Loaded room types from fallback:', roomTypesData.length);
          }
        } else if (data) {
          setRoomTypes(data);
          console.log('Loaded room types from edge function:', data.length);
        }
      } catch (err) {
        console.error('Exception fetching room types:', err);
        setRoomsError('Failed to load room types');
        
        // Fallback: Load directly from Supabase table
        try {
          const { data: roomTypesData, error: tableError } = await supabase
            .from('room_types')
            .select('*')
            .eq('is_active', true);
          
          if (!tableError && roomTypesData) {
            setRoomTypes(roomTypesData);
            setRoomsError("");
            console.log('Loaded room types from fallback after exception:', roomTypesData.length);
          }
        } catch (fallbackErr) {
          console.error('Fallback failed:', fallbackErr);
        }
      } finally {
        setLoadingRooms(false);
      }
    };

    if (isOpen) {
      fetchRoomTypes();
    }
  }, [isOpen]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRoomToggle = (roomTypeId: string) => {
    const roomType = roomTypes.find(rt => rt.id === roomTypeId);
    if (!roomType) return;

    setSelectedRoomIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(roomTypeId)) {
        newSet.delete(roomTypeId);
        // Remove from selectedRooms
        setSelectedRooms(prevRooms => prevRooms.filter(r => r.roomTypeId !== roomTypeId));
      } else {
        newSet.add(roomTypeId);
        // Add to selectedRooms with 10% winter discount
        const discountedPrice = Math.round(roomType.base_price * 0.9);
        const isDormitory = roomType.name.toLowerCase().includes('dormitory');
        const newRoom: SelectedRoom = {
          roomTypeId: roomType.id,
          roomTypeName: `${roomType.category} - ${roomType.name}`,
          quantity: isDormitory ? formData.guests : 1,
          price: discountedPrice
        };
        setSelectedRooms(prevRooms => {
          const updatedRooms = [...prevRooms, newRoom];
          
          // Check total capacity vs guests
          const totalCapacity = updatedRooms.reduce((sum, room) => {
            const capacity = getMaxQuantity(room.roomTypeName);
            return sum + (capacity * room.quantity);
          }, 0);
          
          if (totalCapacity < formData.guests) {
            const remaining = formData.guests - totalCapacity;
            toast({
              title: "Additional Rooms Needed",
              description: `This selection accommodates ${totalCapacity} guest(s). Please select ${remaining} more bed(s)/room(s) to accommodate all ${formData.guests} guests.`,
              variant: "default",
            });
          }
          
          return updatedRooms;
        });
      }
      return newSet;
    });
  };

  const handleRemoveRoom = (roomTypeId: string) => {
    setSelectedRooms(prev => prev.filter(room => room.roomTypeId !== roomTypeId));
    setSelectedRoomIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(roomTypeId);
      return newSet;
    });
  };

  const getMaxQuantity = (roomTypeName: string): number => {
    const lowerName = roomTypeName.toLowerCase();
    if (lowerName.includes('4-bed') && lowerName.includes('dormitory')) return 4;
    if (lowerName.includes('6-bed') && lowerName.includes('dormitory')) return 6;
    if (lowerName.includes('panorama glass ensuite')) return 1;
    if (lowerName.includes('king triple')) return 1;
    if (lowerName.includes('king double')) return 2;
    return 10; // Default max
  };

  const handleUpdateQuantity = (roomTypeId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    const room = selectedRooms.find(r => r.roomTypeId === roomTypeId);
    if (!room) return;
    const maxQty = getMaxQuantity(room.roomTypeName);
    const isDormitory = room.roomTypeName.toLowerCase().includes('dormitory');
    
    // For dormitory rooms, update the guest count
    if (isDormitory) {
      if (newQuantity > maxQty) {
        toast({
          title: "Capacity Exceeded",
          description: "Kindly choose other room type for remaining guests",
          duration: 3000,
        });
        return;
      }
      handleInputChange('guests', newQuantity);
      setSelectedRooms(prev =>
        prev.map(r =>
          r.roomTypeId === roomTypeId
            ? { ...r, quantity: newQuantity }
            : r
        )
      );
    } else {
      // For non-dormitory rooms, just update quantity
      if (newQuantity > maxQty) return;
      setSelectedRooms(prev =>
        prev.map(r =>
          r.roomTypeId === roomTypeId
            ? { ...r, quantity: newQuantity }
            : r
        )
      );
    }
  };

  const getTotalAmount = () => {
    return selectedRooms.reduce((total, room) => {
      const isDormitory = room.roomTypeName.toLowerCase().includes('dormitory');
      const roomTotal = isDormitory 
        ? room.price * formData.guests * nights
        : room.price * room.quantity * nights;
      return total + roomTotal;
    }, 0);
  };

  const handleBookNow = async () => {
    // Save to database first
    const totalAmount = getTotalAmount();
    const saveResult = await saveWhatsAppBooking({
      name: formData.name || 'Guest',
      email: formData.email || 'not-provided@example.com',
      phone: formData.phone || '0000000000',
      city: formData.city || '',
      pincode: formData.pincode || '',
      checkIn: formData.checkIn || new Date().toISOString().split('T')[0],
      checkOut: formData.checkOut || new Date(Date.now() + 86400000).toISOString().split('T')[0],
      guests: formData.guests || 1,
      specialRequests: formData.specialRequests || '',
      selectedRooms,
      nights: nights || 1,
      totalAmount: totalAmount || 0
    });

    // Build beautiful WhatsApp welcome message for XTSY
    const roomsText = selectedRooms.length > 0 
      ? selectedRooms.map(room => `   • ${room.roomTypeName} × ${room.quantity} room(s)`).join('\n')
      : '   • To be decided';

    const addOnsText = [];
    if (formData.breakfast) addOnsText.push(`   • Breakfast for ${formData.breakfastGuests} guest(s)`);
    if (formData.dinner) addOnsText.push(`   • Dinner (${formData.dinnerType}) for ${formData.dinnerGuests} guest(s)`);
    if (formData.transportation) addOnsText.push(`   • Transportation Service`);
    if (formData.itinerary) addOnsText.push(`   • Custom Itinerary Planning`);

    const message = `🏨 *XTSY - Premium Room Booking*

Hi XTSY Team! Ready to book my stay in beautiful Meghalaya! 🏔️

👤 *Guest Information:*
   Name: ${formData.name || 'Not provided'}
   📧 Email: ${formData.email || 'Not provided'}
   📱 Phone: ${formData.phone || 'Not provided'}
   📍 Location: ${formData.city ? `${formData.city}${formData.pincode ? `, ${formData.pincode}` : ''}` : 'Not provided'}

📅 *Booking Details:*
   Check-in: ${formData.checkIn || 'To be decided'}
   Check-out: ${formData.checkOut || 'To be decided'}
   ${nights > 0 ? `🌙 Nights: ${nights}` : ''}
   👥 Guests: ${formData.guests || 'Not specified'}

🏠 *Selected Rooms:*
${roomsText}
${addOnsText.length > 0 ? `\n🎯 *Add-on Services:*\n${addOnsText.join('\n')}` : ''}
${formData.specialRequests ? `\n📝 *Special Requests:*\n   ${formData.specialRequests}` : ''}
${totalAmount > 0 ? `\n💰 *Estimated Total: ₹${totalAmount.toLocaleString('en-IN')}*` : ''}

Can't wait to experience XTSY hospitality! Please confirm availability. 🎉✨`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://api.whatsapp.com/send/?phone=918837317070&text=${encodedMessage}&type=phone_number&app_absent=0`, '_blank');
    
    if (saveResult.success) {
      toast({
        title: "Booking Saved",
        description: "Your booking inquiry has been saved successfully!",
      });
    }
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
        </DialogHeader>
        <Card className="bg-card/95 backdrop-blur-sm border-border shadow-2xl border">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              <MessageCircle className="h-8 w-8 mx-auto mb-2 text-primary" />
              Book through WhatsApp
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Fill in your details and connect with us on WhatsApp
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+91 XXXXXXXXXX"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your@email.com"
                />
              </div>

              {/* City and Pincode */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="Your City"
                  />
                </div>
                <div>
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input
                    id="pincode"
                    value={formData.pincode}
                    onChange={(e) => handleInputChange('pincode', e.target.value)}
                    placeholder="123456"
                    maxLength={6}
                  />
                </div>
              </div>

              {/* Booking Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="checkIn">Check-in Date</Label>
                  <Input
                    id="checkIn"
                    type="date"
                    value={formData.checkIn}
                    onChange={(e) => handleInputChange('checkIn', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="checkOut">Check-out Date</Label>
                  <Input
                    id="checkOut"
                    type="date"
                    value={formData.checkOut}
                    onChange={(e) => handleInputChange('checkOut', e.target.value)}
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

              {/* Guest Selection */}
              <div>
                <Label htmlFor="guests">Number of Guests</Label>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="guests"
                    type="number"
                    min="1"
                    max="100"
                    value={formData.guests}
                    onChange={(e) => handleInputChange('guests', parseInt(e.target.value) || 1)}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Room/Dorm Type Selection */}
              <div className="space-y-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                {/* Winter Offer Badge */}
                <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-2xl">❄️</span>
                    <p className="text-sm font-bold text-blue-900 dark:text-blue-100">
                      Winter Offer: 10% Flat Off on All Rooms!
                    </p>
                    <span className="text-2xl">❄️</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Home className="h-5 w-5 text-primary" />
                    <Label className="text-lg font-semibold">Choose Your Room/Dorm Type</Label>
                  </div>
                  {loadingRooms && (
                    <span className="text-xs text-muted-foreground">Loading rooms...</span>
                  )}
                  {!loadingRooms && roomTypes.length > 0 && (
                    <span className="text-xs text-muted-foreground">{roomTypes.length} options available</span>
                  )}
                </div>

                {roomsError && (
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <p className="text-sm text-destructive">{roomsError}</p>
                  </div>
                )}

                {/* Room Type Checkboxes - Grouped by Property Type */}
                <div className="space-y-4">
                  {loadingRooms ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      Loading room types...
                    </div>
                  ) : roomTypes.length === 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      No room types available
                    </div>
                  ) : (
                    <>
                      {/* Group rooms by category - exclude Economy */}
                      {Array.from(new Set(roomTypes.map(rt => rt.category))).filter(category => category !== 'Economy').map(category => (
                        <div key={category} className="space-y-2">
                          <h4 className="font-semibold text-sm text-primary uppercase tracking-wide">{category}</h4>
                          <div className="space-y-2 pl-2">
                            {roomTypes
                              .filter(rt => rt.category === category)
                              .sort((a, b) => {
                                // Custom order for rooms
                                const order = [
                                  'King Double Room',
                                  'King Triple Room', 
                                  'Bed in 4-Bed Female Dormitory',
                                  'Bed in 4-Bed Mixed Dormitory',
                                  'Bed in 6-Bed Female Dormitory',
                                  'Bed in 6-Bed Mixed Dormitory'
                                ];
                                const aIndex = order.indexOf(a.name);
                                const bIndex = order.indexOf(b.name);
                                
                                if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
                                if (aIndex !== -1) return -1;
                                if (bIndex !== -1) return 1;
                                return a.name.localeCompare(b.name);
                              })
                              .map(roomType => (
                                <div
                                  key={roomType.id}
                                  className="flex items-start space-x-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-primary transition-colors"
                                >
                                  <Checkbox
                                    id={roomType.id}
                                    checked={selectedRoomIds.has(roomType.id)}
                                    onCheckedChange={() => handleRoomToggle(roomType.id)}
                                    className="mt-1"
                                  />
                                  <div className="flex-1">
                                     <Label
                                      htmlFor={roomType.id}
                                      className="font-medium cursor-pointer leading-tight"
                                    >
                                      {roomType.name}
                                    </Label>
                                    <div className="flex items-center gap-2 mt-1">
                                      <p className="text-xs text-muted-foreground line-through">
                                        ₹{roomType.base_price.toLocaleString('en-IN')}
                                      </p>
                                      <p className="text-xs font-semibold text-green-600">
                                        ₹{Math.round(roomType.base_price * 0.9).toLocaleString('en-IN')}/night
                                      </p>
                                      <span className="text-[10px] bg-blue-500 text-white px-1.5 py-0.5 rounded">10% OFF</span>
                                      <p className="text-xs text-muted-foreground">• {roomType.capacity} guests</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>

                {/* Helper text */}
                <p className="text-xs text-muted-foreground">
                  Select one or more room types for your booking. You can adjust quantities below.
                </p>

                {/* Selected Rooms Display */}
                {selectedRooms.length > 0 && (
                  <div className="space-y-2 mt-4">
                    <Label className="text-sm font-medium text-muted-foreground">Selected Rooms:</Label>
                    {selectedRooms.map((room) => (
                      <div
                        key={room.roomTypeId}
                        className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-sm">{room.roomTypeName}</p>
                          {room.roomTypeName.toLowerCase().includes('dormitory') ? (
                            <p className="text-xs text-muted-foreground">
                              ₹{room.price}/night/per person × {formData.guests} guest(s) × {nights || 0} nights = ₹{room.price * formData.guests * (nights || 0)}
                            </p>
                          ) : (
                            <p className="text-xs text-muted-foreground">
                              ₹{room.price}/night × {room.quantity} room(s) × {nights || 0} nights = ₹{room.price * room.quantity * (nights || 0)}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateQuantity(room.roomTypeId, room.quantity - 1)}
                              className="h-7 w-7 p-0"
                            >
                              -
                            </Button>
                            <span className="w-8 text-center text-sm font-medium">{room.quantity}</span>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateQuantity(room.roomTypeId, room.quantity + 1)}
                              disabled={room.quantity >= getMaxQuantity(room.roomTypeName)}
                              className="h-7 w-7 p-0"
                            >
                              +
                            </Button>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveRoom(room.roomTypeId)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    {/* Total Amount */}
                    {nights > 0 && (
                      <div className="mt-3 p-3 bg-primary/10 rounded-lg border border-primary/20">
                        <p className="text-primary font-bold text-lg text-right">
                          Total Estimated Amount: ₹{getTotalAmount()}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Food Add-ons & Additional Services */}
              <FoodAddonsSection 
                formData={formData}
                onInputChange={handleInputChange}
              />

              {/* Special Requests */}
              <div>
                <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
                <Textarea
                  id="specialRequests"
                  value={formData.specialRequests}
                  onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                  placeholder="Any special requirements or requests..."
                  rows={4}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleBookNow}
                  className="flex-1 bg-[#25D366] hover:bg-[#20BD5A] text-white"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Book Now
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default WhatsAppBookingForm;
