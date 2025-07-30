import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, Users, Bed, Clock, Tag, X, Minus, Plus, Bookmark, TreePine } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useApp } from "@/contexts/AppContext";

// Room data with images - same as in RoomsSection
const ROOM_DATA = {
  "signature-270-glass-suite": {
    id: "signature-270-glass-suite",
    name: "Signature 270° Glass Suite",
    price: 18000,
    capacity: 2,
    description: "Premium suite with 270-degree panoramic views and luxury amenities",
    type: "luxury",
    image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/Signature%20270%20Glass%20Suite/20250722_0921_Meghalaya%20Getaway%20View_remix_01k0r405w4f66svm6nn0qdtxye%20(1).png"
  },
  "4-bed-female-only-dorm": {
    id: "4-bed-female-only-dorm",
    name: "Bed in 4 Bed Female Only Dorm",
    price: 850,
    capacity: 4,
    description: "Female-only dormitory with modern amenities and comfortable beds",
    type: "dorm",
    image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20Female%20Only%20Dorms/1.jpg"
  },
  "4-bed-mixed-female-dorm": {
    id: "4-bed-mixed-female-dorm",
    name: "Bed in 4 Bed Mixed/Female Dorm",
    price: 800,
    capacity: 4,
    description: "Mixed or female dormitory with shared facilities and social atmosphere",
    type: "dorm",
    image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20MixedFemale%20Dorms/3.jpg"
  },
  "6-bed-mixed-female-dorm": {
    id: "6-bed-mixed-female-dorm",
    name: "Bed in 6 Bed Mixed/Female Dorm",
    price: 700,
    capacity: 6,
    description: "Spacious mixed or female dormitory with modern amenities",
    type: "dorm",
    image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/1.JPG"
  },
  "8-bed-mixed-dorm": {
    id: "8-bed-mixed-dorm",
    name: "Bed in 8 Bed Mixed Dorm",
    price: 600,
    capacity: 8,
    description: "Large mixed dormitory for budget travelers seeking social experience",
    type: "dorm",
    image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/8%20Bed%20Mixed%20Dorms/3.jpg"
  },
  "king-double-room": {
    id: "king-double-room",
    name: "King Double Room",
    price: 3200,
    capacity: 4,
    description: "Spacious private room with king bed for two guests",
    type: "room",
    image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Double%20Room/1.jpg"
  },
  "king-triple-room": {
    id: "king-triple-room",
    name: "King Triple Room",
    price: 4200,
    capacity: 3,
    description: "Luxurious private room accommodating up to three guests",
    type: "room",
    image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Triple%20Room/1.jpg"
  },
  "6-bed-female-mixed-economy-dorm": {
    id: "6-bed-female-mixed-economy-dorm",
    name: "Bed in 6 Bed Female/Mixed Economy Dorm",
    price: 550,
    capacity: 6,
    description: "Budget-friendly female/mixed dormitory with essential amenities",
    type: "dorm",
    image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/1.JPG"
  },
  "8-bed-mixed-economy-dorm": {
    id: "8-bed-mixed-economy-dorm",
    name: "Bed in 8 Bed Mixed Economy Dorm",
    price: 450,
    capacity: 8,
    description: "Most economical option for backpackers and budget travelers",
    type: "dorm",
    image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/8%20Bed%20Mixed%20Dorms/3.jpg"
  }
};

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: {
    id: string;
    name: string;
    price: number;
    capacity: number;
    description: string;
    type?: string;
  };
}

const BookingModal = ({ isOpen, onClose, room }: BookingModalProps) => {
  const { formatPrice } = useApp();
  const [bookingData, setBookingData] = useState({
    checkIn: "",
    checkOut: "",
    guests: 1,
    quantity: 1,
    nights: 1,
  });
  
  const [addOns, setAddOns] = useState({
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

  const totalAmount = room.price * bookingData.quantity * bookingData.nights;
  const addOnTotal = (addOns.breakfast * 150 + addOns.dinnerVeg * 300 + addOns.dinnerNonVeg * 300) * bookingData.nights;
  const gstAmount = Math.round((totalAmount + addOnTotal) * 0.18);
  const grandTotal = totalAmount + addOnTotal + gstAmount;

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
        roomId: room.id,
        roomName: room.name,
        price: room.price,
        quantity: 1,
        guests: bookingData.guests,
        nights: bookingData.nights,
        roomType: room.type || 'dorm',
        addOns: addOns
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
        roomId: room.id,
        roomName: room.name,
        price: room.price,
        quantity: 1,
        guests: bookingData.guests,
        nights: bookingData.nights,
        roomType: room.type || 'dorm',
        addOns: addOns
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

  // Get room image from ROOM_DATA
  const roomData = ROOM_DATA[room.id as keyof typeof ROOM_DATA];
  const roomImage = roomData?.image;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full h-full max-w-none max-h-none md:max-w-4xl lg:max-w-6xl md:max-h-[95vh] md:h-auto bg-white border-0 p-0 overflow-hidden">
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
              <div className="p-4 md:p-6 border-r">
                <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg p-4 mb-6">
                  <h2 className="text-xl font-bold text-white">XTSY Travellers Hostel</h2>
                </div>

                {/* Room Card */}
                <Card className="mb-6">
                  <div className="flex gap-4 p-4">
                    <div className="w-32 h-24 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {roomImage ? (
                        <img 
                          src={roomImage} 
                          alt={room.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div className={`text-center ${roomImage ? 'hidden' : ''}`}>
                        <TreePine className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                        <span className="text-black text-sm font-semibold">Room Image</span>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-2 text-black">{room.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-black font-semibold mb-2">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-black" />
                          <span className="text-black font-bold">Max {room.capacity} guests</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Bed className="h-4 w-4 text-black" />
                          <span className="text-black font-bold">Per Bed</span>
                        </div>
                      </div>
                      <div className="text-lg font-bold text-black">{formatPrice(room.price)} / night</div>
                      <p className="text-sm text-black font-semibold mt-1">{room.description}</p>
                    </div>
                  </div>

                  {/* Quantity and Guest Selection */}
                  <div className="px-4 pb-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-black text-base">
                        {room.type === 'luxury' ? 'Number of rooms:' : 'Number of beds:'}
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
                          disabled={bookingData.quantity >= room.capacity}
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
                          disabled={bookingData.guests >= room.capacity * bookingData.quantity}
                          className="text-black border-black hover:bg-gray-100"
                        >
                          <Plus className="h-4 w-4 text-black" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Add-on Services Card */}
                <Card className="mb-6 bg-white border border-gray-200">
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-black mb-4">Add-on Services</h3>
                    
                    {/* Meal Services */}
                    <div className="space-y-4">
                      {/* Breakfast */}
                      <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">🍳</span>
                          <div>
                            <span className="text-black font-semibold">Breakfast</span>
                            <span className="text-gray-700 ml-2">(₹150/person/meal)</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setAddOns(prev => ({ ...prev, breakfast: Math.max(0, prev.breakfast - 1) }))}
                            disabled={addOns.breakfast <= 0}
                            className="w-8 h-8 p-0 bg-gray-300 hover:bg-gray-400 border-gray-400"
                          >
                            <Minus className="h-3 w-3 text-black" />
                          </Button>
                          <span className="w-8 text-center text-black font-bold bg-white px-2 py-1 rounded border">
                            {addOns.breakfast}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setAddOns(prev => ({ ...prev, breakfast: prev.breakfast + 1 }))}
                            className="w-8 h-8 p-0 bg-black hover:bg-gray-800 text-white border-black"
                          >
                            <Plus className="h-3 w-3 text-white" />
                          </Button>
                        </div>
                      </div>

                      {/* Dinner Veg */}
                      <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">🥗</span>
                          <div>
                            <span className="text-black font-semibold">Dinner Veg</span>
                            <span className="text-gray-700 ml-2">(₹300/person/meal)</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setAddOns(prev => ({ ...prev, dinnerVeg: Math.max(0, prev.dinnerVeg - 1) }))}
                            disabled={addOns.dinnerVeg <= 0}
                            className="w-8 h-8 p-0 bg-gray-300 hover:bg-gray-400 border-gray-400"
                          >
                            <Minus className="h-3 w-3 text-black" />
                          </Button>
                          <span className="w-8 text-center text-black font-bold bg-white px-2 py-1 rounded border">
                            {addOns.dinnerVeg}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setAddOns(prev => ({ ...prev, dinnerVeg: prev.dinnerVeg + 1 }))}
                            className="w-8 h-8 p-0 bg-black hover:bg-gray-800 text-white border-black"
                          >
                            <Plus className="h-3 w-3 text-white" />
                          </Button>
                        </div>
                      </div>

                      {/* Dinner Non-Veg */}
                      <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">🍖</span>
                          <div>
                            <span className="text-black font-semibold">Dinner Non-Veg</span>
                            <span className="text-gray-700 ml-2">(₹300/person/meal)</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setAddOns(prev => ({ ...prev, dinnerNonVeg: Math.max(0, prev.dinnerNonVeg - 1) }))}
                            disabled={addOns.dinnerNonVeg <= 0}
                            className="w-8 h-8 p-0 bg-gray-300 hover:bg-gray-400 border-gray-400"
                          >
                            <Minus className="h-3 w-3 text-black" />
                          </Button>
                          <span className="w-8 text-center text-black font-bold bg-white px-2 py-1 rounded border">
                            {addOns.dinnerNonVeg}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setAddOns(prev => ({ ...prev, dinnerNonVeg: prev.dinnerNonVeg + 1 }))}
                            className="w-8 h-8 p-0 bg-black hover:bg-gray-800 text-white border-black"
                          >
                            <Plus className="h-3 w-3 text-white" />
                          </Button>
                        </div>
                      </div>

                      {/* Transportation Services */}
                      <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">🚗</span>
                          <div>
                            <span className="text-black font-semibold">Transportation Services</span>
                            <div className="text-sm text-gray-600">Price match guarantee • Best rates</div>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={addOns.transportation}
                          onChange={(e) => setAddOns(prev => ({ ...prev, transportation: e.target.checked }))}
                          className="w-5 h-5 text-orange-500 bg-white border-2 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
                        />
                      </div>

                      {/* Itinerary Planning */}
                      <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">📋</span>
                          <div>
                            <span className="text-black font-semibold">Itinerary Planning & Support</span>
                            <div className="text-sm text-gray-600">5% convenience charges</div>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={addOns.itineraryPlanning}
                          onChange={(e) => setAddOns(prev => ({ ...prev, itineraryPlanning: e.target.checked }))}
                          className="w-5 h-5 text-orange-500 bg-white border-2 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
                        />
                      </div>
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
              <div className="p-4 md:p-6 bg-gray-50">
                <div className="sticky top-0">
                  <Card className="p-4 mb-4">
                    <h3 className="text-lg font-semibold mb-3">Booking Summary</h3>
                    <div className="text-sm text-gray-600 mb-4">
                      {bookingData.nights} nights starting from {bookingData.checkIn ? formatDate(bookingData.checkIn) : 'Select date'}
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-900 font-medium">{room.name}</span>
                        <span className="text-gray-900 font-semibold">{formatPrice(totalAmount)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-700">
                        {room.type === 'luxury' ? (
                          <span>{formatPrice(room.price)} x {bookingData.quantity} room x {bookingData.nights} nights</span>
                        ) : (
                          <span>{formatPrice(room.price)} x {bookingData.quantity} bed x {bookingData.nights} nights</span>
                        )}
                      </div>
                      
                      {/* Add-on items in summary */}
                      {addOns.breakfast > 0 && (
                        <div className="flex justify-between text-sm text-gray-700">
                          <span>Breakfast ({addOns.breakfast} x {bookingData.nights} nights)</span>
                          <span>₹{addOns.breakfast * 150 * bookingData.nights}</span>
                        </div>
                      )}
                      {addOns.dinnerVeg > 0 && (
                        <div className="flex justify-between text-sm text-gray-700">
                          <span>Dinner Veg ({addOns.dinnerVeg} x {bookingData.nights} nights)</span>
                          <span>₹{addOns.dinnerVeg * 300 * bookingData.nights}</span>
                        </div>
                      )}
                      {addOns.dinnerNonVeg > 0 && (
                        <div className="flex justify-between text-sm text-gray-700">
                          <span>Dinner Non-Veg ({addOns.dinnerNonVeg} x {bookingData.nights} nights)</span>
                          <span>₹{addOns.dinnerNonVeg * 300 * bookingData.nights}</span>
                        </div>
                      )}
                      {addOns.transportation && (
                        <div className="flex justify-between text-sm text-gray-700">
                          <span>Transportation Services</span>
                          <span>Quoted separately</span>
                        </div>
                      )}
                      {addOns.itineraryPlanning && (
                        <div className="flex justify-between text-sm text-gray-700">
                          <span>Itinerary Planning</span>
                          <span>5% of total</span>
                        </div>
                      )}
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-700">Subtotal</span>
                        <span className="text-gray-900 font-medium">₹{totalAmount + addOnTotal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">GST (18%)</span>
                        <span className="text-gray-900 font-medium">₹{gstAmount}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-lg">
                        <span className="text-gray-900">Grand Total</span>
                        <span className="text-gray-900">₹{grandTotal}</span>
                      </div>
                      <div className="flex justify-between text-green-700 font-semibold">
                        <span>Payable Now (21%)</span>
                        <span>₹{Math.round(grandTotal * 0.21)}</span>
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

export default BookingModal;
