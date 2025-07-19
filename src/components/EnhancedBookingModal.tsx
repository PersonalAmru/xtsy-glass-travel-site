
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, Check, Clock, Tag, Users, Bed, Minus, Plus, Bookmark, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Room {
  id: string;
  name: string;
  price: number;
  capacity: number;
  description: string;
  type?: string;
}

interface EnhancedBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface BookingData {
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  quantity: number;
}

const rooms: Room[] = [
  {
    id: "xtsy-travellers-hostel",
    name: "XTSY Travellers Hostel",
    price: 800,
    capacity: 8,
    description: "Our signature hostel room, perfect for budget travellers",
    type: 'dorm'
  },
  {
    id: "xtsy-luxury",
    name: "XTSY Luxury Suite",
    price: 18000,
    capacity: 2,
    description: "Experience luxury with panoramic views",
    type: 'luxury'
  },
  {
    id: "xtsy-deluxe-suite",
    name: "XTSY Deluxe Suite",
    price: 12000,
    capacity: 4,
    description: "Spacious suite with modern amenities",
    type: 'luxury'
  },
];

const EnhancedBookingModal = ({ isOpen, onClose }: EnhancedBookingModalProps) => {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(rooms[0]);
  const [bookingData, setBookingData] = useState<BookingData>({
    checkIn: "",
    checkOut: "",
    guests: 1,
    nights: 1,
    quantity: 1,
  });
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const { toast } = useToast();

  useEffect(() => {
    if (bookingData.checkIn && bookingData.checkOut) {
      const checkInDate = new Date(bookingData.checkIn);
      const checkOutDate = new Date(bookingData.checkOut);
      const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
      const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
      setBookingData(prev => ({ ...prev, nights: nights }));
    }
  }, [bookingData.checkIn, bookingData.checkOut]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleDateChange = (field: string, value: string) => {
    setDate(undefined);
    setBookingData(prev => ({ ...prev, [field]: value }));
  };

  const calculateTotals = () => {
    const roomPrice = selectedRoom ? selectedRoom.price : 0;
    const quantity = bookingData.quantity || 1;
    const nights = bookingData.nights || 1;
    const subtotal = roomPrice * quantity * nights;
    const gstAmount = Math.round(subtotal * 0.18);
    const totalAmount = subtotal + gstAmount;
    return { subtotal, gstAmount, totalAmount };
  };

  const { subtotal, gstAmount, totalAmount } = calculateTotals();

  const handleAddToCart = () => {
    if (!selectedRoom || !bookingData.checkIn || !bookingData.checkOut || bookingData.guests === 0) {
      toast({
        title: "Incomplete Booking",
        description: "Please select a room, dates and number of guests first",
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
        roomId: selectedRoom.id,
        roomName: selectedRoom.name,
        price: selectedRoom.price,
        quantity: bookingData.quantity,
        guests: bookingData.guests,
        nights: bookingData.nights,
        roomType: selectedRoom.type || 'dorm'
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
    if (!selectedRoom || !bookingData.checkIn || !bookingData.checkOut || bookingData.guests === 0) {
      toast({
        title: "Incomplete Booking",
        description: "Please select a room, dates and number of guests first",
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
        roomId: selectedRoom.id,
        roomName: selectedRoom.name,
        price: selectedRoom.price,
        quantity: bookingData.quantity,
        guests: bookingData.guests,
        nights: bookingData.nights,
        roomType: selectedRoom.type || 'dorm'
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

  const handleBookNow = () => {
    if (!selectedRoom || !bookingData.checkIn || !bookingData.checkOut || bookingData.guests === 0) {
      toast({
        title: "Incomplete Booking",
        description: "Please select a room, dates and number of guests first",
        variant: "destructive"
      });
      return;
    }

    const bookingDetails = {
      checkIn: bookingData.checkIn,
      checkOut: bookingData.checkOut,
      guests: bookingData.guests,
      nights: bookingData.nights,
      room: {
        id: selectedRoom.id,
        name: selectedRoom.name,
        price: selectedRoom.price,
        quantity: bookingData.quantity,
        type: selectedRoom.type || 'dorm'
      },
      totalAmount,
      payableNow: Math.round(totalAmount * 0.21)
    };

    localStorage.setItem('xtsy_current_booking', JSON.stringify(bookingDetails));

    // Trigger guest details modal/component
    window.dispatchEvent(new CustomEvent('openGuestDetails', { detail: bookingDetails }));
    
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
                className="p-2"
              >
                <X className="h-5 w-5" />
              </Button>
              <DialogTitle className="text-xl md:text-2xl font-bold text-gray-900">
                Book your stay
              </DialogTitle>
            </div>
            
            {/* Know before you go section */}
            <div className="bg-white rounded-lg p-4 mb-4">
              <h3 className="text-lg font-semibold mb-3">Know before you go</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-500" />
                  <div>
                    <div className="font-medium">Check-in</div>
                    <div className="text-gray-600">12:00 PM</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-500" />
                  <div>
                    <div className="font-medium">Check-out</div>
                    <div className="text-gray-600">10:00 AM</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-orange-500" />
                  <div>
                    <div className="font-medium">Special Offer</div>
                    <div className="text-orange-600">Use XTSY-DEAL for eligible bookings</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Date selection */}
            <div className="bg-blue-100 rounded-lg p-3 text-center">
              <div className="text-blue-800 font-medium">
                {bookingData.checkIn && bookingData.checkOut 
                  ? `${formatDate(bookingData.checkIn)} → ${formatDate(bookingData.checkOut)} (${bookingData.nights} nights)`
                  : "Select your dates"
                }
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 h-full">
              {/* Left side - Room Selection */}
              <div className="lg:col-span-2 p-4 md:p-6 border-r">
                <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg p-4 mb-6">
                  <h2 className="text-xl font-bold">Live the Shillong Vibe</h2>
                </div>

                {/* Room Selection */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Select a Room</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {rooms.map((room) => (
                      <Card
                        key={room.id}
                        className={`cursor-pointer hover:shadow-md transition-shadow duration-200 ${selectedRoom?.id === room.id ? 'border-2 border-orange-500' : ''}`}
                        onClick={() => setSelectedRoom(room)}
                      >
                        <div className="flex gap-4 p-4">
                          <div className="w-24 h-20 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-gray-500 text-sm">Room Image</span>
                          </div>
                          
                          <div className="flex-1">
                            <h4 className="font-semibold mb-1">{room.name}</h4>
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                <span>Max {room.capacity} guests</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Bed className="h-4 w-4" />
                                <span>Per Bed</span>
                              </div>
                            </div>
                            <div className="text-gray-600 text-sm">{room.description}</div>
                            {selectedRoom?.id === room.id && (
                              <div className="text-green-600 mt-2 flex items-center gap-1">
                                <Check className="h-4 w-4" />
                                Selected
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Quantity and Guest Selection */}
                {selectedRoom && (
                  <Card className="p-4">
                    <h3 className="font-semibold mb-3">Select Number of Guests & Beds</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Number of beds:</span>
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setBookingData(prev => ({ ...prev, quantity: Math.max(1, prev.quantity - 1) }))}
                            disabled={bookingData.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{bookingData.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setBookingData(prev => ({ ...prev, quantity: prev.quantity + 1 }))}
                            disabled={bookingData.quantity >= selectedRoom.capacity}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="font-medium">Number of guests:</span>
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setBookingData(prev => ({ ...prev, guests: Math.max(1, prev.guests - 1) }))}
                            disabled={bookingData.guests <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{bookingData.guests}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setBookingData(prev => ({ ...prev, guests: prev.guests + 1 }))}
                            disabled={bookingData.guests >= selectedRoom.capacity * bookingData.quantity}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Date Selection */}
                <Card className="p-4 mt-4">
                  <h3 className="font-semibold mb-3">Select Dates</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Check-in</label>
                      <Input
                        type="date"
                        value={bookingData.checkIn}
                        onChange={(e) => handleDateChange('checkIn', e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Check-out</label>
                      <Input
                        type="date"
                        value={bookingData.checkOut}
                        onChange={(e) => handleDateChange('checkOut', e.target.value)}
                        min={bookingData.checkIn || new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>
                </Card>
              </div>

              {/* Right side - Booking Summary */}
              <div className="p-4 md:p-6 bg-gray-50">
                <div className="sticky top-0">
                  <Card className="p-4 mb-4">
                    <h3 className="text-lg font-semibold mb-3">Booking Summary</h3>
                    <div className="text-sm text-gray-600 mb-4">
                      {bookingData.nights} nights starting from {bookingData.checkIn ? formatDate(bookingData.checkIn) : 'Select date'}
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span>{selectedRoom?.name}</span>
                        <span>₹{totalAmount}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>₹{selectedRoom?.price} x {bookingData.quantity} bed x {bookingData.nights} nights</span>
                        <span>Remove</span>
                      </div>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>₹{subtotal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>GST</span>
                        <span>₹{gstAmount}</span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span>Grand Total (tax incl.)</span>
                        <span>₹{totalAmount}</span>
                      </div>
                      <div className="flex justify-between text-green-600 font-semibold">
                        <span>Payable Now (21%)</span>
                        <span>₹{Math.round(totalAmount * 0.21)}</span>
                      </div>
                    </div>
                  </Card>

                  {/* Coupon Section */}
                  <Card className="p-4 mb-4">
                    <h4 className="font-medium mb-3">Have a discount coupon?</h4>
                    <div className="flex gap-2">
                      <Input placeholder="Enter XTSY-DEAL" />
                      <Button variant="outline">Apply</Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      XTSY-DEAL: 10% off for hostel bookings (min 4 guests) or luxury bookings (min 2 nights)
                    </p>
                  </Card>

                  {/* Action Buttons */}
                  <div className="space-y-3 mt-6">
                    <Button
                      onClick={handleBookNow}
                      disabled={!selectedRoom || !bookingData.checkIn || !bookingData.checkOut || bookingData.guests === 0}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold"
                    >
                      Book Now
                    </Button>
                    <Button
                      onClick={saveForLater}
                      variant="outline"
                      className="w-full border-blue-300 text-blue-600 hover:bg-blue-50 flex items-center justify-center gap-2"
                    >
                      <Bookmark className="h-4 w-4" />
                      Save Later
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
