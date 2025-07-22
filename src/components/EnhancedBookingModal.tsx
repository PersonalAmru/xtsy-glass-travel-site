import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, Users, Bed, Clock, Tag, X, Minus, Plus, Bookmark, Coffee, Utensils, Car, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

interface EnhancedBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  room?: {
    id: string;
    name: string;
    price: number;
    capacity: number;
    description: string;
    type?: string;
  };
  initialData?: {
    checkIn: string;
    checkOut: string;
    guests: number;
  };
}

const EnhancedBookingModal = ({ isOpen, onClose, room, initialData }: EnhancedBookingModalProps) => {
  // Default room data for hero section bookings
  const defaultRoom = {
    id: 'hero-booking',
    name: 'XTSY Accommodation',
    price: 850,
    capacity: 4,
    description: 'Perfect stay for your Shillong adventure',
    type: 'dorm'
  };

  const currentRoom = room || defaultRoom;

  const [bookingData, setBookingData] = useState({
    checkIn: initialData?.checkIn || "",
    checkOut: initialData?.checkOut || "",
    guests: initialData?.guests || 1,
    quantity: 1,
    nights: 1,
  });

  const [addOnServices, setAddOnServices] = useState({
    breakfast: 0,
    dinnerVeg: 0,
    dinnerNonVeg: 0,
    transportation: false,
    itineraryPlanning: false,
  });
  const { toast } = useToast();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleDateChange = (field: string, value: string) => {
    setBookingData(prev => {
      const updatedData = { ...prev, [field]: value };
      
      if (updatedData.checkIn && updatedData.checkOut) {
        const checkInDate = new Date(updatedData.checkIn);
        const checkOutDate = new Date(updatedData.checkOut);
        const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
        const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
        updatedData.nights = nights;
      }
      
      return updatedData;
    });
  };

  const totalAmount = currentRoom.price * bookingData.quantity * bookingData.nights;
  const gstAmount = Math.round(totalAmount * 0.18);
  const grandTotal = totalAmount + gstAmount;

  const handleBookNow = () => {
    if (!bookingData.checkIn || !bookingData.checkOut || bookingData.guests === 0) {
      toast({
        title: "Incomplete Booking",
        description: "Please select dates and number of guests first",
        variant: "destructive"
      });
      return;
    }

    const cartData = {
      checkIn: bookingData.checkIn,
      checkOut: bookingData.checkOut,
      guests: bookingData.guests,
      nights: bookingData.nights,
      items: [{
        roomId: currentRoom.id,
        roomName: currentRoom.name,
        price: currentRoom.price,
        quantity: 1,
        guests: bookingData.guests,
        nights: bookingData.nights,
        roomType: currentRoom.type || 'dorm'
      }],
      timestamp: new Date().getTime()
    };
    
    localStorage.setItem('xtsy_booking_cart', JSON.stringify(cartData));

    toast({
      title: "Added to Cart",
      description: "Your booking has been added to the cart.",
    });

    onClose();
  };

  const saveForLater = () => {
    if (!bookingData.checkIn || !bookingData.checkOut || bookingData.guests === 0) {
      toast({
        title: "Incomplete Booking",
        description: "Please select dates and number of guests first",
        variant: "destructive"
      });
      return;
    }

    const cartData = {
      checkIn: bookingData.checkIn,
      checkOut: bookingData.checkOut,
      guests: bookingData.guests,
      nights: bookingData.nights,
      items: [{
        roomId: currentRoom.id,
        roomName: currentRoom.name,
        price: currentRoom.price,
        quantity: 1,
        guests: bookingData.guests,
        nights: bookingData.nights,
        roomType: currentRoom.type || 'dorm'
      }],
      timestamp: new Date().getTime(),
      savedForLater: true
    };

    const existingSaved = JSON.parse(localStorage.getItem('xtsy_saved_bookings') || '[]');
    const updatedSaved = [...existingSaved, cartData];
    localStorage.setItem('xtsy_saved_bookings', JSON.stringify(updatedSaved));

    toast({
      title: "Saved for Later",
      description: "Your booking has been saved. You can access it from your cart.",
    });

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full h-full max-w-none max-h-none md:max-w-6xl lg:max-w-7xl md:max-h-[95vh] md:h-auto bg-white border-0 p-0 overflow-hidden">
        <div className="flex flex-col h-full max-h-[100vh] md:max-h-[95vh]">
          {/* Header */}
          <div className="flex-shrink-0 p-4 md:p-6 border-b bg-gradient-to-r from-orange-50 to-red-50">
            <div className="flex items-center gap-3 mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="p-2 text-gray-900 hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-900" />
              </Button>
              <DialogTitle className="text-xl md:text-2xl font-bold text-black">
                Book your stay
              </DialogTitle>
            </div>
            
            {/* Know before you go section */}
            <div className="bg-white rounded-lg p-4 mb-4">
              <h3 className="text-lg font-semibold mb-3 text-black">Know before you go</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-500" />
                  <div>
                    <div className="font-medium text-black">Check-in</div>
                    <div className="text-black">12:00 PM</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-500" />
                  <div>
                    <div className="font-medium text-black">Check-out</div>
                    <div className="text-black">10:00 AM</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-orange-500" />
                  <div>
                    <div className="font-medium text-black">Special Offer</div>
                    <div className="text-orange-600">Use XTSY-DEAL for eligible bookings</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Date selection */}
            <div className="bg-blue-100 rounded-lg p-3 text-center">
              <div className="text-black font-bold text-base">
                {bookingData.checkIn && bookingData.checkOut 
                  ? `${formatDate(bookingData.checkIn)} → ${formatDate(bookingData.checkOut)} (${bookingData.nights} nights)`
                  : "Select your dates"
                }
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
              {/* Left side - Room Selection */}
              <div className="p-4 md:p-6 border-r overflow-y-auto">
                <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg p-4 mb-6">
                  <h2 className="text-xl font-bold text-white">XTSY Travellers Hostel</h2>
                </div>

                {/* Room Card */}
                <Card className="mb-6">
                  <div className="flex gap-4 p-4">
                    <div className="w-32 h-24 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-black text-sm font-semibold">Room Image</span>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-2 text-black">{currentRoom.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-black font-semibold mb-2">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-black" />
                          <span className="text-black font-bold">Max {currentRoom.capacity} guests</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Bed className="h-4 w-4 text-black" />
                          <span className="text-black font-bold">Per Bed</span>
                        </div>
                      </div>
                      <div className="text-lg font-bold text-black">₹{currentRoom.price} / night</div>
                      <p className="text-sm text-black font-semibold mt-1">{currentRoom.description}</p>
                    </div>
                  </div>

                  {/* Quantity and Guest Selection */}
                  <div className="px-4 pb-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-black text-base">
                        {currentRoom.type === 'luxury' ? 'Number of rooms:' : 'Number of beds:'}
                      </span>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setBookingData(prev => ({ ...prev, quantity: Math.max(1, prev.quantity - 1) }))}
                          disabled={bookingData.quantity <= 1}
                          className="text-black border-black hover:bg-gray-100"
                        >
                          <Minus className="h-4 w-4 text-black" />
                        </Button>
                        <span className="w-8 text-center text-black font-bold text-lg">{bookingData.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setBookingData(prev => ({ ...prev, quantity: prev.quantity + 1 }))}
                          disabled={bookingData.quantity >= currentRoom.capacity}
                          className="text-black border-black hover:bg-gray-100"
                        >
                          <Plus className="h-4 w-4 text-black" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="font-bold text-black text-base">Number of guests:</span>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setBookingData(prev => ({ ...prev, guests: Math.max(1, prev.guests - 1) }))}
                          disabled={bookingData.guests <= 1}
                          className="text-black border-black hover:bg-gray-100"
                        >
                          <Minus className="h-4 w-4 text-black" />
                        </Button>
                        <span className="w-8 text-center text-black font-bold text-lg">{bookingData.guests}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setBookingData(prev => ({ ...prev, guests: prev.guests + 1 }))}
                          disabled={bookingData.guests >= currentRoom.capacity * bookingData.quantity}
                          className="text-black border-black hover:bg-gray-100"
                        >
                          <Plus className="h-4 w-4 text-black" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Add-on Services */}
                <Card className="p-4 mt-6">
                  <h3 className="font-bold mb-4 text-black text-lg">Add-on Services</h3>
                  <div className="space-y-4">
                    {/* Breakfast */}
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-orange-50">
                      <div className="flex items-center gap-3">
                        <Coffee className="h-5 w-5 text-orange-500" />
                        <div>
                          <span className="text-sm font-medium text-black block">Breakfast (₹150/person/meal)</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setAddOnServices(prev => ({ 
                            ...prev, 
                            breakfast: Math.max(0, prev.breakfast - 1) 
                          }))}
                          disabled={addOnServices.breakfast <= 0}
                          className="h-8 w-8 p-0 border-2 border-black text-black hover:bg-gray-100 bg-white"
                        >
                          <Minus className="h-4 w-4 text-black" />
                        </Button>
                        <span className="w-8 text-center text-sm font-bold text-black bg-white px-2 py-1 rounded border-2 border-black">
                          {addOnServices.breakfast}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setAddOnServices(prev => ({ 
                            ...prev, 
                            breakfast: prev.breakfast + 1 
                          }))}
                          className="h-8 w-8 p-0 border-2 border-black text-black hover:bg-gray-100 bg-white"
                        >
                          <Plus className="h-4 w-4 text-black" />
                        </Button>
                      </div>
                    </div>

                    {/* Dinner Veg */}
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50">
                      <div className="flex items-center gap-3">
                        <Utensils className="h-5 w-5 text-green-500" />
                        <div>
                          <span className="text-sm font-medium text-black block">Dinner Veg (₹300/person/meal)</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setAddOnServices(prev => ({ 
                            ...prev, 
                            dinnerVeg: Math.max(0, prev.dinnerVeg - 1) 
                          }))}
                          disabled={addOnServices.dinnerVeg <= 0}
                          className="h-8 w-8 p-0 border-2 border-black text-black hover:bg-gray-100 bg-white"
                        >
                          <Minus className="h-4 w-4 text-black" />
                        </Button>
                        <span className="w-8 text-center text-sm font-bold text-black bg-white px-2 py-1 rounded border-2 border-black">
                          {addOnServices.dinnerVeg}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setAddOnServices(prev => ({ 
                            ...prev, 
                            dinnerVeg: prev.dinnerVeg + 1 
                          }))}
                          className="h-8 w-8 p-0 border-2 border-black text-black hover:bg-gray-100 bg-white"
                        >
                          <Plus className="h-4 w-4 text-black" />
                        </Button>
                      </div>
                    </div>

                    {/* Dinner Non-Veg */}
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-red-50">
                      <div className="flex items-center gap-3">
                        <Utensils className="h-5 w-5 text-red-500" />
                        <div>
                          <span className="text-sm font-medium text-black block">Dinner Non-Veg (₹300/person/meal)</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setAddOnServices(prev => ({ 
                            ...prev, 
                            dinnerNonVeg: Math.max(0, prev.dinnerNonVeg - 1) 
                          }))}
                          disabled={addOnServices.dinnerNonVeg <= 0}
                          className="h-8 w-8 p-0 border-2 border-black text-black hover:bg-gray-100 bg-white"
                        >
                          <Minus className="h-4 w-4 text-black" />
                        </Button>
                        <span className="w-8 text-center text-sm font-bold text-black bg-white px-2 py-1 rounded border-2 border-black">
                          {addOnServices.dinnerNonVeg}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setAddOnServices(prev => ({ 
                            ...prev, 
                            dinnerNonVeg: prev.dinnerNonVeg + 1 
                          }))}
                          className="h-8 w-8 p-0 border-2 border-black text-black hover:bg-gray-100 bg-white"
                        >
                          <Plus className="h-4 w-4 text-black" />
                        </Button>
                      </div>
                    </div>

                    {/* Transportation Services */}
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-blue-50">
                      <div className="flex items-center gap-3">
                        <Car className="h-5 w-5 text-blue-500" />
                        <div>
                          <span className="text-sm font-medium text-black block">Transportation Services</span>
                          <span className="text-xs text-black">Price match guarantee • Best rates</span>
                        </div>
                      </div>
                      <Checkbox
                        checked={addOnServices.transportation}
                        onCheckedChange={(checked) => setAddOnServices(prev => ({ 
                          ...prev, 
                          transportation: !!checked 
                        }))}
                        className="h-5 w-5 border-2 border-black data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                      />
                    </div>

                    {/* Itinerary Planning & Support */}
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-purple-50">
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-purple-500" />
                        <div>
                          <span className="text-sm font-medium text-black block">Itinerary Planning & Support</span>
                          <span className="text-xs text-black">
                            {addOnServices.transportation ? "Free with transportation" : "5% convenience charges"}
                          </span>
                        </div>
                      </div>
                      <Checkbox
                        checked={addOnServices.itineraryPlanning}
                        onCheckedChange={(checked) => setAddOnServices(prev => ({ 
                          ...prev, 
                          itineraryPlanning: !!checked 
                        }))}
                        className="h-5 w-5 border-2 border-black data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                      />
                    </div>
                  </div>
                </Card>

                {/* Date Selection */}
                <Card className="p-4">
                  <h3 className="font-bold mb-3 text-black text-lg">Select Dates</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold mb-1 text-black">Check-in</label>
                      <Input
                        type="date"
                        value={bookingData.checkIn}
                        onChange={(e) => handleDateChange('checkIn', e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="text-black font-semibold border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-1 text-black">Check-out</label>
                      <Input
                        type="date"
                        value={bookingData.checkOut}
                        onChange={(e) => handleDateChange('checkOut', e.target.value)}
                        min={bookingData.checkIn || new Date().toISOString().split('T')[0]}
                        className="text-black font-semibold border-black"
                      />
                    </div>
                  </div>
                </Card>
              </div>

              {/* Right side - Booking Summary */}
              <div className="p-4 md:p-6 bg-gray-50 overflow-y-auto">
                <div className="sticky top-0">
                  <Card className="p-4 mb-4">
                    <h3 className="text-lg font-semibold mb-3 text-black">Booking Summary</h3>
                    <div className="text-sm text-black mb-4">
                      {bookingData.nights} nights starting from {bookingData.checkIn ? formatDate(bookingData.checkIn) : 'Select date'}
                    </div>
                    
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-black font-medium">{currentRoom.name}</span>
                      <span className="text-black font-semibold">₹{totalAmount}</span>
                    </div>
                    <div className="flex justify-between text-sm text-black">
                      {currentRoom.type === 'luxury' ? (
                        <span>₹{currentRoom.price} x {bookingData.quantity} room x {bookingData.nights} nights</span>
                      ) : (
                        <span>₹{currentRoom.price} x {bookingData.quantity} bed x {bookingData.nights}</span>
                      )}
                    </div>
                  </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-black">Subtotal</span>
                        <span className="text-black font-medium">₹{totalAmount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-black">GST (18%)</span>
                        <span className="text-black font-medium">₹{gstAmount}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-lg">
                        <span className="text-black">Grand Total</span>
                        <span className="text-black">₹{grandTotal}</span>
                      </div>
                      <div className="flex justify-between text-green-700 font-semibold">
                        <span>Payable Now (21%)</span>
                        <span>₹{Math.round(grandTotal * 0.21)}</span>
                      </div>
                    </div>
                  </Card>

                  {/* Coupon Section */}
                  <Card className="p-4 mb-4">
                    <h4 className="font-medium mb-3 text-black">Have a discount coupon?</h4>
                    <div className="flex gap-2">
                      <Input placeholder="Enter XTSY-DEAL" className="text-black" />
                      <Button variant="outline" className="text-black border-black">Apply</Button>
                    </div>
                    <p className="text-xs text-black mt-2">
                      XTSY-DEAL: 10% off for hostel bookings (min 4 guests) or luxury bookings (min 2 nights)
                    </p>
                  </Card>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button
                      onClick={saveForLater}
                      variant="outline"
                      className="w-full border-blue-300 text-blue-600 hover:bg-blue-50 flex items-center justify-center gap-2"
                    >
                      <Bookmark className="h-4 w-4" />
                      Save Later
                    </Button>
                    <Button
                      onClick={handleBookNow}
                      disabled={!bookingData.checkIn || !bookingData.checkOut || bookingData.guests === 0}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold"
                    >
                      Book Now
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedBookingModal;
