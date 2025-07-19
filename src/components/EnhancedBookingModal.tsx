
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
  initialData?: {
    checkIn: string;
    checkOut: string;
    guests: number;
  };
}

interface BookingData {
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  quantity: number;
}

const rooms: Room[] = [
  // XTSY Travellers Hostel Rooms
  {
    id: "4-bed-female-only-dorm",
    name: "Bed in 4 Bed Female Only Dorm",
    price: 850,
    capacity: 4,
    description: "Female-only dormitory with modern amenities",
    type: 'hostel'
  },
  {
    id: "4-bed-mixed-female-dorm",
    name: "Bed in 4 Bed Mixed/Female Dorm", 
    price: 800,
    capacity: 4,
    description: "Mixed or female dormitory with shared facilities",
    type: 'hostel'
  },
  {
    id: "6-bed-mixed-female-dorm",
    name: "Bed in 6 Bed Mixed/Female Dorm",
    price: 700,
    capacity: 30,
    description: "Spacious mixed or female dormitory",
    type: 'hostel'
  },
  {
    id: "8-bed-mixed-dorm",
    name: "Bed in 8 Bed Mixed Dorm",
    price: 600,
    capacity: 8,
    description: "Large mixed dormitory for budget travelers",
    type: 'hostel'
  },
  // XTSY Luxury Rooms
  {
    id: "king-double-room",
    name: "King Double Room",
    price: 3200,
    capacity: 2,
    description: "Spacious room with king bed for two guests (2 rooms available)",
    type: 'luxury'
  },
  {
    id: "king-triple-room",
    name: "King Triple Room",
    price: 4200,
    capacity: 3,
    description: "Luxurious room accommodating up to three guests",
    type: 'luxury'
  },
  {
    id: "signature-270-glass-suite",
    name: "Signature 270° Glass Suite",
    price: 18000,
    capacity: 2,
    description: "Premium suite with 270-degree panoramic views and luxury amenities",
    type: 'luxury'
  }
];

const EnhancedBookingModal = ({ isOpen, onClose, initialData }: EnhancedBookingModalProps) => {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(rooms[0]);
  const [bookingData, setBookingData] = useState<BookingData>({
    checkIn: initialData?.checkIn || "",
    checkOut: initialData?.checkOut || "",
    guests: initialData?.guests || 1,
    nights: 1,
    quantity: 1,
  });
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
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

  const getGuestCapacityForRoom = (room: Room) => {
    const isDorm = room.name.toLowerCase().includes('dorm');
    if (isDorm) {
      return room.capacity; // For dorms: use room capacity
    } else {
      // For private rooms: 2 guests per room, except King Triple which can have 3
      if (room.name === "King Triple Room") {
        return 3;
      }
      return 2;
    }
  };

  const calculateTotals = () => {
    const roomPrice = selectedRoom ? selectedRoom.price : 0;
    const nights = bookingData.nights || 1;
    // For dorms: guests = beds (1 bed per guest), for private rooms: always 1 room
    const quantity = selectedRoom?.name.toLowerCase().includes('dorm') ? bookingData.guests : 1;
    const subtotal = roomPrice * quantity * nights;
    const discountAmount = Math.round(subtotal * (couponDiscount / 100));
    const discountedSubtotal = subtotal - discountAmount;
    const gstAmount = Math.round(discountedSubtotal * 0.18);
    const totalAmount = discountedSubtotal + gstAmount;
    return { subtotal, gstAmount, totalAmount, discountAmount };
  };

  const applyCoupon = () => {
    setCouponError("");
    if (couponCode === "XTSY-DEAL") {
      // Check conditions: Min 4 guests and at least 2 nights
      if (bookingData.guests >= 4 && bookingData.nights >= 2) {
        setCouponDiscount(15); // 15% discount
        toast({
          title: "Coupon Applied!",
          description: "15% discount has been applied to your booking.",
        });
      } else if (bookingData.guests >= 4 && bookingData.nights < 2) {
        setCouponError("Minimum 2 nights required for 4+ guests");
      } else {
        setCouponError("Minimum 4 guests required for this offer");
      }
    } else {
      setCouponError("Invalid coupon code");
    }
  };

  const removeCoupon = () => {
    setCouponCode("");
    setCouponDiscount(0);
    setCouponError("");
    toast({
      title: "Coupon Removed",
      description: "Discount has been removed from your booking.",
    });
  };

  const { subtotal, gstAmount, totalAmount, discountAmount } = calculateTotals();

  // Update guests when room or quantity changes
  useEffect(() => {
    if (selectedRoom) {
      const maxGuests = getGuestCapacityForRoom(selectedRoom);
      setBookingData(prev => ({ 
        ...prev, 
        guests: Math.min(prev.guests, maxGuests)
      }));
    }
  }, [selectedRoom, bookingData.quantity]);

  const handleAddToCart = () => {
    if (!selectedRoom || !bookingData.checkIn || !bookingData.checkOut || bookingData.guests === 0) {
      toast({
        title: "Incomplete Booking",
        description: "Please select a room, dates and number of guests first",
        variant: "destructive"
      });
      return;
    }

    // Get or generate session ID (same logic as header)
    let sessionId = localStorage.getItem('current_guest_session');
    if (!sessionId) {
      sessionId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('current_guest_session', sessionId);
    }

    // Create cart item in the same format as tour packages
    const cartItem = {
      sessionId: sessionId,
      type: 'room_booking',
      packageId: selectedRoom.id,
      packageTitle: selectedRoom.name,
      guests: bookingData.guests,
      selectedDate: bookingData.checkIn,
      duration: bookingData.nights,
      baseRate: selectedRoom.price,
      totalAmount: totalAmount,
      gstAmount: gstAmount,
      finalTotal: totalAmount,
      guestDetails: {
        name: '',
        email: '',
        phone: '',
        emergencyContact: ''
      },
      createdAt: new Date().toISOString(),
      savedForLater: false,
      checkOut: bookingData.checkOut,
      quantity: bookingData.quantity,
      roomType: selectedRoom.type || 'hostel'
    };

    // Add to cart using the same storage system as tour packages
    const existingCart = JSON.parse(localStorage.getItem(`tour_cart_${sessionId}`) || '[]');
    const updatedCart = [...existingCart, cartItem];
    localStorage.setItem(`tour_cart_${sessionId}`, JSON.stringify(updatedCart));

    // Trigger storage event for real-time updates
    window.dispatchEvent(new StorageEvent('storage', {
      key: `tour_cart_${sessionId}`,
      newValue: JSON.stringify(updatedCart)
    }));

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

    // Get or generate session ID (same logic as header)
    let sessionId = localStorage.getItem('current_tour_session');
    if (!sessionId) {
      sessionId = 'session_' + new Date().getTime() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('current_tour_session', sessionId);
      
      const allSessions = JSON.parse(localStorage.getItem("active_tour_sessions") || "[]");
      if (!allSessions.includes(sessionId)) {
        allSessions.push(sessionId);
        localStorage.setItem("active_tour_sessions", JSON.stringify(allSessions));
      }
    }

    // Create cart item in the same format as tour packages
    const cartItem = {
      sessionId: sessionId,
      type: 'room_booking',
      packageId: selectedRoom.id,
      packageTitle: selectedRoom.name,
      guests: bookingData.guests,
      selectedDate: bookingData.checkIn,
      duration: bookingData.nights,
      baseRate: selectedRoom.price,
      totalAmount: totalAmount,
      gstAmount: gstAmount,
      finalTotal: totalAmount,
      guestDetails: {
        name: '',
        email: '',
        phone: '',
        emergencyContact: ''
      },
      createdAt: new Date().toISOString(),
      savedForLater: true,
      checkOut: bookingData.checkOut,
      quantity: bookingData.quantity,
      roomType: selectedRoom.type || 'dorm'
    };

    // Save to the same storage system as tour packages
    const existingSaved = JSON.parse(localStorage.getItem(`tour_saved_${sessionId}`) || '[]');
    const updatedSaved = [...existingSaved, cartItem];
    localStorage.setItem(`tour_saved_${sessionId}`, JSON.stringify(updatedSaved));

    // Trigger storage event for real-time updates
    window.dispatchEvent(new StorageEvent('storage', {
      key: `tour_saved_${sessionId}`,
      newValue: JSON.stringify(updatedSaved)
    }));

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
            <div className="flex items-center gap-3">
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
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-3 h-full">
              {/* Left side - 3 Tiles */}
              <div className="lg:col-span-2 p-4 md:p-6 space-y-4 overflow-y-auto">
                {/* Know before you go section - smaller tile */}
                <div className="bg-white rounded-lg p-4 border shadow-sm">
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

                {/* Date selection - smaller tile */}
                <div className="bg-blue-100 rounded-lg p-4 border shadow-sm">
                  <div className="text-blue-800 font-medium mb-3 text-center">
                    {bookingData.checkIn && bookingData.checkOut 
                      ? `${formatDate(bookingData.checkIn)} → ${formatDate(bookingData.checkOut)} (${bookingData.nights} nights)`
                      : "Select your dates"
                    }
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-blue-800">Check-in</label>
                      <Input
                        type="date"
                        value={bookingData.checkIn}
                        onChange={(e) => handleDateChange('checkIn', e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="bg-white border-blue-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-blue-800">Check-out</label>
                      <Input
                        type="date"
                        value={bookingData.checkOut}
                        onChange={(e) => handleDateChange('checkOut', e.target.value)}
                        min={bookingData.checkIn ? new Date(new Date(bookingData.checkIn).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] : new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                        className="bg-white border-blue-200"
                      />
                    </div>
                  </div>
                </div>

                {/* Live the Shillong Vibe - larger scrollable tile */}
                <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg p-4 border shadow-sm">
                  <h2 className="text-xl font-bold mb-4">Live the Shillong Vibe</h2>
                  
                  {/* Room Selection - scrollable content */}
                  <div className="max-h-96 overflow-y-auto">
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-3 text-white">Select a Room</h3>
                      
                      {/* XTSY Travellers Hostel */}
                      <div className="mb-6">
                        <h4 className="text-md font-semibold mb-3 text-orange-200">XTSY Travellers Hostel</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {rooms.filter(room => room.type === 'hostel').map((room) => (
                            <Card
                              key={room.id}
                              className={`cursor-pointer hover:shadow-md transition-shadow duration-200 ${selectedRoom?.id === room.id ? 'border-2 border-orange-300' : ''}`}
                              onClick={() => setSelectedRoom(room)}
                            >
                              <div className="flex gap-4 p-4">
                                <div className="w-24 h-20 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <span className="text-gray-500 text-sm">Room Image</span>
                                </div>
                                
                                <div className="flex-1">
                                  <h4 className="font-semibold mb-1 text-gray-900">{room.name}</h4>
                                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                    <div className="flex items-center gap-1">
                                      <Users className="h-4 w-4" />
                                      <span>Max {room.capacity} guests</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <span className="text-gray-600">Per Bed</span>
                                    </div>
                                  </div>
                                  <div className="text-gray-600 text-sm mb-2">{room.description}</div>
                                  <div className="text-lg font-bold text-orange-600">₹{room.price}</div>
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

                      {/* XTSY Luxury */}
                      <div className="mb-6">
                        <h4 className="text-md font-semibold mb-3 text-orange-200">XTSY Luxury</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {rooms.filter(room => room.type === 'luxury').map((room) => (
                            <Card
                              key={room.id}
                              className={`cursor-pointer hover:shadow-md transition-shadow duration-200 ${selectedRoom?.id === room.id ? 'border-2 border-orange-300' : ''}`}
                              onClick={() => setSelectedRoom(room)}
                            >
                              <div className="flex gap-4 p-4">
                                <div className="w-24 h-20 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <span className="text-gray-500 text-sm">Room Image</span>
                                </div>
                                
                                <div className="flex-1">
                                  <h4 className="font-semibold mb-1 text-gray-900">{room.name}</h4>
                                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                    <div className="flex items-center gap-1">
                                      <Users className="h-4 w-4" />
                                      <span>Max {room.capacity} guests</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <span className="text-gray-600">
                                        {room.name === "King Double Room" ? "2 rooms available" : "Per Room"}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="text-gray-600 text-sm mb-2">{room.description}</div>
                                  <div className="text-lg font-bold text-orange-600">₹{room.price}</div>
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
                    </div>

                    {/* Guest Selection - Auto-calculated based on room type */}
                    {selectedRoom && (
                      <Card className="p-4 bg-white">
                        <h3 className="font-semibold mb-3 text-gray-900">Number of Guests</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-900">Number of guests:</span>
                            <div className="flex items-center gap-3">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setBookingData(prev => ({ ...prev, guests: Math.max(1, prev.guests - 1) }))}
                                disabled={bookingData.guests <= 1}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="w-8 text-center text-gray-900">{bookingData.guests}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setBookingData(prev => ({ ...prev, guests: prev.guests + 1 }))}
                                disabled={bookingData.guests >= getGuestCapacityForRoom(selectedRoom)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="text-sm text-gray-600">
                            {selectedRoom.name.toLowerCase().includes('dorm') 
                              ? `For dorms: 1 bed = 1 guest (${bookingData.guests} ${bookingData.guests === 1 ? 'guest' : 'guests'})`
                              : selectedRoom.name === "King Triple Room" 
                                ? "Up to 3 guests per room (with extra bed option)"
                                : "Up to 2 guests per room (strictly)"
                            }
                          </div>
                        </div>
                      </Card>
                    )}
                  </div>
                </div>
              </div>

              {/* Right side - Fixed Booking Summary from top */}
              <div className="lg:col-span-1 bg-gray-50 p-4 md:p-6 flex flex-col h-full border-l">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-4">Booking Summary</h3>
                  
                  {bookingData.checkIn && bookingData.checkOut && (
                    <div className="text-sm text-gray-600 mb-4">
                      {bookingData.nights} nights starting from {formatDate(bookingData.checkIn)}
                    </div>
                  )}

                  {selectedRoom && (
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between">
                        <span className="font-medium">{selectedRoom.name}</span>
                        <span>₹{selectedRoom.price}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        ₹{selectedRoom.price} x {selectedRoom.name.toLowerCase().includes('dorm') ? bookingData.quantity : 1} {selectedRoom.name.toLowerCase().includes('dorm') ? (bookingData.quantity === 1 ? 'bed' : 'beds') : 'room'} x {bookingData.nights} nights
                      </div>
                      <div className="text-sm text-gray-600">
                        Guests: {bookingData.guests}
                      </div>
                    </div>
                  )}

                  <Separator className="my-4" />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₹{subtotal}</span>
                    </div>
                    {couponDiscount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount ({couponDiscount}%)</span>
                        <span>-₹{discountAmount}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>GST</span>
                      <span>₹{gstAmount}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Grand Total (Amount)</span>
                      <span>₹{totalAmount}</span>
                    </div>
                  </div>

                  {/* Coupon Section */}
                  <div className="mt-6 space-y-3">
                    {couponDiscount === 0 ? (
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter coupon code (XTSY-DEAL)"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="flex-1"
                        />
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={applyCoupon}
                          disabled={!couponCode}
                        >
                          Apply
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="text-green-600 text-sm flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Check className="h-4 w-4" />
                            Coupon Applied! ({couponCode})
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={removeCoupon}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="text-green-600 text-sm">
                          15% discount has been applied to your booking.
                        </div>
                      </div>
                    )}
                    {couponError && (
                      <div className="text-red-500 text-sm">{couponError}</div>
                    )}
                  </div>
                </div>

                {/* Action Buttons - Fixed at bottom */}
                <div className="mt-6 space-y-3 flex-shrink-0">
                  <Button 
                    onClick={handleBookNow}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    Book Now
                  </Button>
                  <Button 
                    onClick={saveForLater}
                    variant="outline" 
                    className="w-full border-orange-500 text-orange-500 hover:bg-orange-50"
                  >
                    <Bookmark className="h-4 w-4 mr-2" />
                    Save Later
                  </Button>
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
