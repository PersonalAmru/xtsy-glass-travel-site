import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageCircle, Calendar, Users, Phone, Plus, Trash2, Home } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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
    checkIn: "",
    checkOut: "",
    guests: 2,
    specialRequests: ""
  });

  const [nights, setNights] = useState(0);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [selectedRoomType, setSelectedRoomType] = useState<string>("");
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

  // Fetch room types from Supabase
  useEffect(() => {
    const fetchRoomTypes = async () => {
      setLoadingRooms(true);
      setRoomsError("");
      
      try {
        const { data, error } = await supabase
          .from('room_types')
          .select('id, name, category, base_price, capacity')
          .eq('is_active', true)
          .order('category', { ascending: true });

        if (error) {
          console.error('Error fetching room types:', error);
          setRoomsError('Failed to load room types');
        } else if (data) {
          setRoomTypes(data);
          console.log('Loaded room types:', data.length);
        }
      } catch (err) {
        console.error('Exception fetching room types:', err);
        setRoomsError('Failed to load room types');
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

  const handleAddRoom = () => {
    if (!selectedRoomType) return;

    const roomType = roomTypes.find(rt => rt.id === selectedRoomType);
    if (!roomType) return;

    // Check if room already added
    const existingRoom = selectedRooms.find(r => r.roomTypeId === selectedRoomType);
    if (existingRoom) {
      // Increase quantity
      setSelectedRooms(prev => 
        prev.map(room => 
          room.roomTypeId === selectedRoomType 
            ? { ...room, quantity: room.quantity + 1 }
            : room
        )
      );
    } else {
      // Add new room
      setSelectedRooms(prev => [...prev, {
        roomTypeId: roomType.id,
        roomTypeName: `${roomType.category} - ${roomType.name}`,
        quantity: 1,
        price: roomType.base_price
      }]);
    }

    setSelectedRoomType("");
  };

  const handleRemoveRoom = (roomTypeId: string) => {
    setSelectedRooms(prev => prev.filter(room => room.roomTypeId !== roomTypeId));
  };

  const handleUpdateQuantity = (roomTypeId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setSelectedRooms(prev =>
      prev.map(room =>
        room.roomTypeId === roomTypeId
          ? { ...room, quantity: newQuantity }
          : room
      )
    );
  };

  const getTotalAmount = () => {
    return selectedRooms.reduce((total, room) => total + (room.price * room.quantity * nights), 0);
  };

  const handleBookNow = () => {
    // Build WhatsApp message with selected rooms
    const roomsText = selectedRooms.map(room => 
      `${room.roomTypeName} x ${room.quantity}`
    ).join(', ');

    const message = `Hi! I'd like to make a booking:\n\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nCheck-in: ${formData.checkIn}\nCheck-out: ${formData.checkOut}\nNights: ${nights}\nGuests: ${formData.guests}\nRooms: ${roomsText || 'Not selected'}\n${formData.specialRequests ? `Special Requests: ${formData.specialRequests}` : ''}`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/918837317070?text=${encodedMessage}`, '_blank');
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
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Your Name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+91 XXXXXXXXXX"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your@email.com"
                  required
                />
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

              {/* Guest Selection */}
              <div>
                <Label htmlFor="guests">Number of Guests *</Label>
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

                {/* Room Type Selector */}
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Select value={selectedRoomType} onValueChange={setSelectedRoomType}>
                      <SelectTrigger className="w-full bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 hover:border-primary">
                        <SelectValue placeholder={
                          loadingRooms 
                            ? "Loading room types..." 
                            : roomTypes.length === 0 
                              ? "No rooms available" 
                              : "Select a room or dorm type"
                        } />
                      </SelectTrigger>
                      <SelectContent 
                        className="bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 shadow-xl z-[9999]"
                        position="popper"
                        sideOffset={5}
                      >
                        {roomTypes.length === 0 && !loadingRooms && (
                          <div className="p-4 text-center text-sm text-muted-foreground">
                            No room types available
                          </div>
                        )}
                        {roomTypes.map((roomType) => (
                          <SelectItem 
                            key={roomType.id} 
                            value={roomType.id}
                            className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 py-3 px-4"
                          >
                            <div className="flex flex-col gap-1">
                              <span className="font-semibold">{roomType.category} - {roomType.name}</span>
                              <span className="text-xs text-muted-foreground">
                                ₹{roomType.base_price.toLocaleString('en-IN')}/night • Capacity: {roomType.capacity} guests
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    type="button"
                    onClick={handleAddRoom}
                    disabled={!selectedRoomType || loadingRooms}
                    className="bg-primary hover:bg-primary/90 px-6"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>

                {/* Helper text */}
                <p className="text-xs text-muted-foreground">
                  Select a room type and click "Add" to add it to your booking. You can add multiple rooms.
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
                          <p className="text-xs text-muted-foreground">
                            ₹{room.price}/night × {room.quantity} room(s) × {nights || 0} nights = ₹{room.price * room.quantity * (nights || 0)}
                          </p>
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
