
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
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [roomSelections, setRoomSelections] = useState<{[key: string]: {guests: number, rooms: number}}>({});
  const [bookingData, setBookingData] = useState<BookingData>({
    checkIn: initialData?.checkIn || "",
    checkOut: initialData?.checkOut || "",
    guests: initialData?.guests || 2,
    nights: 1,
    quantity: 1,
  });
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const { toast } = useToast();

  // Initialize booking data when initialData changes
  useEffect(() => {
    if (initialData) {
      let calculatedNights = 1;
      if (initialData.checkIn && initialData.checkOut) {
        const checkInDate = new Date(initialData.checkIn);
        const checkOutDate = new Date(initialData.checkOut);
        const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
        calculatedNights = Math.max(1, Math.floor(timeDiff / (1000 * 3600 * 24)));
      }
      
      setBookingData({
        checkIn: initialData.checkIn || "",
        checkOut: initialData.checkOut || "",
        guests: initialData.guests || 2,
        nights: calculatedNights,
        quantity: 1,
      });
    }
  }, [initialData]);

  useEffect(() => {
    if (bookingData.checkIn && bookingData.checkOut) {
      const checkInDate = new Date(bookingData.checkIn);
      const checkOutDate = new Date(bookingData.checkOut);
      const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
      const nights = Math.max(1, Math.floor(timeDiff / (1000 * 3600 * 24)));
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

  const getRoomSelectionForRoom = (roomId: string) => {
    return roomSelections[roomId] || { guests: 0, rooms: 0 };
  };

  const updateRoomSelection = (roomId: string, field: 'guests' | 'rooms', value: number) => {
    setRoomSelections(prev => ({
      ...prev,
      [roomId]: {
        ...prev[roomId],
        [field]: value
      }
    }));
  };

  const calculateTotals = () => {
    const nights = bookingData.nights || 1;
    let subtotal = 0;
    let totalGuestsCalculated = 0;
    
    // Calculate total for all room selections (multiple rooms can be selected)
    Object.entries(roomSelections).forEach(([roomId, selection]) => {
      const room = rooms.find(r => r.id === roomId);
      if (!room || (!selection.guests && !selection.rooms)) return;
      
      const isDorm = room.name.toLowerCase().includes('dorm');
      
      if (isDorm) {
        // For dorms: price per bed * number of guests (beds) * nights
        const guestCount = selection.guests || 0;
        subtotal += room.price * guestCount * nights;
        totalGuestsCalculated += guestCount;
      } else {
        // For luxury rooms: price per room * number of rooms * nights
        const roomCount = selection.rooms || 0;
        subtotal += room.price * roomCount * nights;
        
        // Calculate guests for luxury rooms
        if (room.name === "King Triple Room") {
          totalGuestsCalculated += Math.min(3, roomCount * 3);
        } else {
          totalGuestsCalculated += roomCount * 2;
        }
      }
    });
    
    const discountAmount = Math.round(subtotal * (couponDiscount / 100));
    const discountedSubtotal = subtotal - discountAmount;
    
    // Calculate GST room-wise only for luxury rooms (XTSY Luxury)
    // Dorm rooms are GST exempt, luxury rooms have specific GST rates
    let gstAmount = 0;
    
    Object.entries(roomSelections).forEach(([roomId, selection]) => {
      const room = rooms.find(r => r.id === roomId);
      if (!room || (!selection.guests && !selection.rooms)) return;
      
      const isDorm = room.name.toLowerCase().includes('dorm');
      
      // Skip GST calculation for dorm rooms (they are GST exempt)
      if (isDorm) return;
      
      // Apply GST only to luxury rooms
      let roomGstRate = 0;
      const roomName = room.name.toLowerCase();
      
      if (roomName.includes('king double') || roomName.includes('king triple')) {
        roomGstRate = 0.12; // 12% GST for King Double and King Triple rooms
      } else if (roomName.includes('signature') && roomName.includes('glass suite')) {
        roomGstRate = 0.18; // 18% GST for Signature 270° Glass Suite
      }
      
      if (roomGstRate > 0) {
        const roomCount = selection.rooms || 0;
        const roomTotal = room.price * roomCount * nights;
        const roomDiscountedTotal = roomTotal - Math.round(roomTotal * (couponDiscount / 100));
        gstAmount += Math.round(roomDiscountedTotal * roomGstRate);
      }
    });
    const totalAmount = discountedSubtotal + gstAmount;
    
    return { subtotal, gstAmount, totalAmount, discountAmount, totalGuestsCalculated };
  };

  const applyCoupon = () => {
    setCouponError("");
    if (couponCode === "XTSY-DEAL") {
      // Use the calculated total guests from calculateTotals
      const { totalGuestsCalculated } = calculateTotals();
      
      // Check conditions: Min 4 guests and at least 2 nights
      if (totalGuestsCalculated >= 4 && bookingData.nights >= 2) {
        setCouponDiscount(15); // 15% discount
        toast({
          title: "Coupon Applied!",
          description: "15% discount has been applied to your booking.",
        });
      } else if (totalGuestsCalculated >= 4 && bookingData.nights < 2) {
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

  const { subtotal, gstAmount, totalAmount, discountAmount, totalGuestsCalculated } = calculateTotals();

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
    if (!bookingData.checkIn || !bookingData.checkOut || totalGuestsCalculated === 0) {
      toast({
        title: "Incomplete Booking",
        description: "Please select dates and rooms/beds first",
        variant: "destructive"
      });
      return;
    }

    // Get all selected room details
    const selectedRooms = Object.entries(roomSelections)
      .filter(([_, selection]) => selection.guests > 0 || selection.rooms > 0)
      .map(([roomId, selection]) => {
        const room = rooms.find(r => r.id === roomId);
        return {
          id: roomId,
          name: room?.name || '',
          price: room?.price || 0,
          type: room?.type || 'hostel',
          selection: selection
        };
      });

    const bookingDetails = {
      checkIn: bookingData.checkIn,
      checkOut: bookingData.checkOut,
      guests: totalGuestsCalculated,
      nights: bookingData.nights,
      selectedRooms: selectedRooms,
      totalAmount: totalAmount,
      gstAmount: gstAmount,
      subtotal: subtotal,
      discountAmount: discountAmount,
      couponCode: couponCode,
      couponDiscount: couponDiscount
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
              {/* Left side - Room Selection Only */}
              <div className="lg:col-span-2 p-4 md:p-6 overflow-y-auto">
                {/* Live the Shillong Vibe - Full Height */}
                <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg border shadow-sm h-full">
                  {/* Header fixed at top */}
                  <div className="p-4 border-b border-orange-400/30">
                    <h2 className="text-xl font-bold">Live the Shillong Vibe</h2>
                    
                    {/* Compact date and guest display */}
                    <div className="mt-2 text-sm text-orange-100">
                      {bookingData.checkIn && bookingData.checkOut ? (
                        <div className="flex items-center gap-4">
                          <span>{formatDate(bookingData.checkIn)} → {formatDate(bookingData.checkOut)}</span>
                          <span>•</span>
                          <span>{bookingData.nights} nights</span>
                          <span>•</span>
                          <span>{totalGuestsCalculated} guests total</span>
                        </div>
                      ) : (
                        <span>Please select dates and guests first</span>
                      )}
                    </div>

                    {/* Quick date and guest controls */}
                    <div className="grid grid-cols-3 gap-4 mt-3">
                      <div>
                        <label className="block text-xs font-medium mb-1 text-orange-200">Check-in</label>
                        <Input
                          type="date"
                          value={bookingData.checkIn}
                          onChange={(e) => handleDateChange('checkIn', e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          className="bg-white/20 border-orange-300/50 text-white text-sm placeholder:text-orange-200"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1 text-orange-200">Check-out</label>
                        <Input
                          type="date"
                          value={bookingData.checkOut}
                          onChange={(e) => handleDateChange('checkOut', e.target.value)}
                          min={bookingData.checkIn ? new Date(new Date(bookingData.checkIn).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] : new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                          className="bg-white/20 border-orange-300/50 text-white text-sm placeholder:text-orange-200"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1 text-orange-200">Target Guests</label>
                        <div className="flex items-center gap-1 bg-white/20 border border-orange-300/50 rounded-md p-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setBookingData(prev => ({ ...prev, guests: Math.max(1, prev.guests - 1) }))}
                            disabled={bookingData.guests <= 1}
                            className="h-5 w-5 p-0 text-white hover:bg-white/20"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-6 text-center text-xs text-white font-medium">
                            {bookingData.guests}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setBookingData(prev => ({ ...prev, guests: Math.min(20, prev.guests + 1) }))}
                            disabled={bookingData.guests >= 20}
                            className="h-5 w-5 p-0 text-white hover:bg-white/20"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="text-xs text-orange-200 mt-1">
                          Max 20 guests
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Room Selection - scrollable content */}
                  <div className="p-4 overflow-y-auto" style={{ height: 'calc(100% - 200px)' }}>
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-3 text-white">Select a Room</h3>
                      
                       {/* XTSY Travellers Hostel */}
                       <div className="mb-6">
                         <h4 className="text-md font-semibold mb-3 text-orange-200">XTSY Travellers Hostel</h4>
                         <div className="grid grid-cols-1 gap-4">
                           {rooms.filter(room => room.type === 'hostel').map((room) => (
                             <Card
                               key={room.id}
                               className="cursor-pointer hover:shadow-md transition-shadow duration-200 bg-white/95"
                             >
                               <div className="p-4">
                                 <div className="flex gap-4 mb-3">
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
                                   </div>
                                 </div>
                                 
                                 {/* Number of Guests for Hostel Rooms */}
                                 <div className="border-t pt-3">
                                   <div className="flex items-center justify-between">
                                     <span className="text-sm font-medium text-gray-900">Number of Beds:</span>
                                     <div className="flex items-center gap-2">
                                       <Button
                                         variant="outline"
                                         size="sm"
                                         onClick={(e) => {
                                           e.stopPropagation();
                                           const currentGuests = getRoomSelectionForRoom(room.id).guests || 0;
                                           updateRoomSelection(room.id, 'guests', Math.max(0, currentGuests - 1));
                                         }}
                                         disabled={getRoomSelectionForRoom(room.id).guests <= 0}
                                         className="h-8 w-8 p-0"
                                       >
                                         <Minus className="h-4 w-4" />
                                       </Button>
                                       <span className="w-8 text-center text-sm text-gray-900">
                                         {getRoomSelectionForRoom(room.id).guests || 0}
                                       </span>
                                       <Button
                                         variant="outline"
                                         size="sm"
                                         onClick={(e) => {
                                           e.stopPropagation();
                                           const currentGuests = getRoomSelectionForRoom(room.id).guests || 0;
                                           updateRoomSelection(room.id, 'guests', Math.min(room.capacity, currentGuests + 1));
                                         }}
                                         disabled={getRoomSelectionForRoom(room.id).guests >= room.capacity}
                                         className="h-8 w-8 p-0"
                                       >
                                         <Plus className="h-4 w-4" />
                                       </Button>
                                     </div>
                                   </div>
                                   <div className="text-xs text-gray-600 mt-1">
                                     1 bed = 1 guest • Price: ₹{room.price} per bed per night
                                   </div>
                                 </div>
                               </div>
                             </Card>
                           ))}
                         </div>
                       </div>

                       {/* XTSY Luxury */}
                       <div className="mb-6">
                         <h4 className="text-md font-semibold mb-3 text-orange-200">XTSY Luxury</h4>
                         <div className="grid grid-cols-1 gap-4">
                           {rooms.filter(room => room.type === 'luxury').map((room) => (
                             <Card
                               key={room.id}
                               className="cursor-pointer hover:shadow-md transition-shadow duration-200 bg-white/95"
                             >
                               <div className="p-4">
                                 <div className="flex gap-4 mb-3">
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
                                   </div>
                                 </div>
                                 
                                 {/* Number of Rooms for Luxury Rooms */}
                                 <div className="border-t pt-3">
                                   <div className="flex items-center justify-between">
                                     <span className="text-sm font-medium text-gray-900">Number of Rooms:</span>
                                     <div className="flex items-center gap-2">
                                       <Button
                                         variant="outline"
                                         size="sm"
                                         onClick={(e) => {
                                           e.stopPropagation();
                                           const currentRooms = getRoomSelectionForRoom(room.id).rooms || 0;
                                           updateRoomSelection(room.id, 'rooms', Math.max(0, currentRooms - 1));
                                         }}
                                         disabled={getRoomSelectionForRoom(room.id).rooms <= 0}
                                         className="h-8 w-8 p-0"
                                       >
                                         <Minus className="h-4 w-4" />
                                       </Button>
                                       <span className="w-8 text-center text-sm text-gray-900">
                                         {getRoomSelectionForRoom(room.id).rooms || 0}
                                       </span>
                                       <Button
                                         variant="outline"
                                         size="sm"
                                         onClick={(e) => {
                                           e.stopPropagation();
                                           const currentRooms = getRoomSelectionForRoom(room.id).rooms || 0;
                                           const maxRooms = room.name === "King Double Room" ? 2 : 1;
                                           updateRoomSelection(room.id, 'rooms', Math.min(maxRooms, currentRooms + 1));
                                         }}
                                         disabled={getRoomSelectionForRoom(room.id).rooms >= (room.name === "King Double Room" ? 2 : 1)}
                                         className="h-8 w-8 p-0"
                                       >
                                         <Plus className="h-4 w-4" />
                                       </Button>
                                     </div>
                                   </div>
                                   <div className="text-xs text-gray-600 mt-1">
                                     {room.name === "King Triple Room" 
                                       ? "2 guests per room + 1 extra bed option • Price: ₹" + room.price + " per room per night"
                                       : "2 guests per room (strictly) • Price: ₹" + room.price + " per room per night"
                                     }
                                     {room.name === "King Double Room" && " • Max 2 rooms available"}
                                   </div>
                                 </div>
                               </div>
                             </Card>
                           ))}
                         </div>
                       </div>
                     </div>
                  </div>
                </div>
              </div>

               {/* Right side - Scrollable Booking Summary */}
              <div className="lg:col-span-1 bg-gray-50 flex flex-col h-full border-l">
                {/* Header - Fixed */}
                <div className="flex-shrink-0 p-4 md:p-6 border-b bg-white">
                  <h3 className="text-lg font-semibold">Booking Summary</h3>
                  {bookingData.checkIn && bookingData.checkOut && (
                    <div className="text-sm text-gray-600 mt-2">
                      {bookingData.nights} nights starting from {formatDate(bookingData.checkIn)}
                    </div>
                  )}
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 max-h-[calc(100vh-300px)]">
                   {/* Show all selected rooms */}
                   <div className="space-y-3 mb-4">
                     {Object.entries(roomSelections)
                       .filter(([_, selection]) => selection.guests > 0 || selection.rooms > 0)
                       .map(([roomId, selection]) => {
                         const room = rooms.find(r => r.id === roomId);
                         if (!room) return null;
                         
                         const isDorm = room.name.toLowerCase().includes('dorm');
                         const roomPrice = room.price;
                         const nights = bookingData.nights || 1;
                         
                         return (
                           <div key={roomId} className="bg-white rounded-lg p-3 border">
                             <div className="flex justify-between items-start mb-2">
                               <span className="font-medium text-sm">{room.name}</span>
                               <span className="text-sm">₹{roomPrice}</span>
                             </div>
                             <div className="text-xs text-gray-600 mb-1">
                               {isDorm ? (
                                 <>₹{roomPrice} x {selection.guests} {selection.guests === 1 ? 'bed' : 'beds'} x {nights} nights</>
                               ) : (
                                 <>₹{roomPrice} x {selection.rooms} {selection.rooms === 1 ? 'room' : 'rooms'} x {nights} nights</>
                               )}
                             </div>
                             <div className="text-xs text-gray-600">
                               Guests: {isDorm 
                                 ? selection.guests
                                 : room.name === "King Triple Room" 
                                   ? Math.min(3, selection.rooms * 3)
                                   : selection.rooms * 2
                               }
                             </div>
                             <div className="text-xs font-medium text-orange-600 mt-1">
                               Subtotal: ₹{isDorm ? roomPrice * selection.guests * nights : roomPrice * selection.rooms * nights}
                             </div>
                           </div>
                         );
                       })}
                     
                     {totalGuestsCalculated > 0 && (
                       <div className="text-sm text-gray-600 font-medium bg-blue-50 p-3 rounded-lg border">
                         Total Guests: {totalGuestsCalculated}
                       </div>
                     )}
                   </div>

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
                <div className="flex-shrink-0 p-4 md:p-6 border-t bg-white">
                  <Button 
                    onClick={handleBookNow}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                    disabled={totalGuestsCalculated === 0}
                  >
                    Book Now
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
