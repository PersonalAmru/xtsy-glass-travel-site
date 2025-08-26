import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, ArrowLeft, Users, Calendar, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import RoomCard from "./RoomCard";
import { useApp } from "@/contexts/AppContext";
import { Input } from "@/components/ui/input";

const ROOM_DATA = {
  "signature-270-glass-suite": {
    id: "signature-270-glass-suite",
    name: "270° Panorama Glass Ensuite",
    price: 18000,
    maxGuests: 2,
    maxRooms: 1,
    description: "Premium suite with 270-degree panoramic views and luxury amenities",
    type: "luxury",
    propertyType: "luxury" as const,
    features: ["Panoramic Glass Walls", "Premium Bedding", "Luxury Bath", "Mountain Views", "Free Breakfast", "Games Room Access"],
    image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/Signature%20270%20Glass%20Suite/Screenshot%202025-08-17%20140811.png",
    images: ["https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/Signature%20270%20Glass%20Suite/Screenshot%202025-08-17%20140811.png"]
  },
  "4-bed-female-only-dorm": {
    id: "4-bed-female-only-dorm",
    name: "Bed in 4 Bed Female Only Dorm",
    price: 850,
    maxGuests: 1,
    maxRooms: 4,
    description: "Female-only dormitory with modern amenities and comfortable beds",
    type: "dorm",
    propertyType: "hostel" as const,
    features: ["Female Only", "AC", "Reading Lights", "Lockers", "Free Breakfast", "Games Room Access"],
    image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20Female%20Only%20Dorms/1.jpg",
    images: [
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20Female%20Only%20Dorms/1.jpg",
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20Female%20Only%20Dorms/2.jpg",
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20Female%20Only%20Dorms/3.jpg"
    ]
  },
  "4-bed-mixed-female-dorm": {
    id: "4-bed-mixed-female-dorm",
    name: "Bed in 4 Bed Mixed/Female Dorm",
    price: 800,
    maxGuests: 1,
    maxRooms: 4,
    description: "Mixed or female dormitory with shared facilities and social atmosphere",
    type: "dorm",
    propertyType: "hostel" as const,
    features: ["Mixed/Female", "AC", "Reading Lights", "Lockers", "Free Breakfast", "Games Room Access"],
    image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20MixedFemale%20Dorms/3.jpg",
    images: [
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20MixedFemale%20Dorms/3.jpg",
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20MixedFemale%20Dorms/4.JPG"
    ]
  },
  "6-bed-mixed-female-dorm": {
    id: "6-bed-mixed-female-dorm",
    name: "Bed in 6 Bed Mixed/Female Dorm",
    price: 700,
    maxGuests: 1,
    maxRooms: 6,
    description: "Spacious mixed or female dormitory with modern amenities",
    type: "dorm",
    propertyType: "hostel" as const,
    features: ["Mixed/Female", "AC", "Reading Lights", "Lockers", "Free Breakfast", "Games Room Access"],
    image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/1.JPG",
    images: [
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/1.JPG",
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/3.jpg"
    ]
  },
  "8-bed-mixed-dorm": {
    id: "8-bed-mixed-dorm",
    name: "Bed in 8 Bed Mixed Dorm",
    price: 600,
    maxGuests: 1,
    maxRooms: 8,
    description: "Large mixed dormitory for budget travelers seeking social experience",
    type: "dorm",
    propertyType: "hostel" as const,
    features: ["Mixed", "AC", "Reading Lights", "Lockers", "Free Breakfast", "Games Room Access"],
    image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/8%20Bed%20Mixed%20Dorms/3.jpg",
    images: [
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/8%20Bed%20Mixed%20Dorms/3.jpg",
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/8%20Bed%20Mixed%20Dorms/4.jpg"
    ]
  },
  "king-double-room": {
    id: "king-double-room",
    name: "King Double Room",
    price: 3200,
    maxGuests: 4,
    maxRooms: 1,
    description: "Spacious private room with king bed for two guests",
    type: "room",
    propertyType: "hostel" as const,
    features: ["King Size Bed", "Private Bathroom", "AC", "Balcony", "Free Breakfast", "Games Room Access"],
    image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Double%20Room/1.jpg",
    images: [
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Double%20Room/1.jpg",
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Double%20Room/2.jpg"
    ]
  },
  "king-triple-room": {
    id: "king-triple-room",
    name: "King Triple Room",
    price: 4200,
    maxGuests: 3,
    maxRooms: 1,
    description: "Luxurious private room accommodating up to three guests",
    type: "room",
    propertyType: "hostel" as const,
    features: ["King Size Bed", "Extra Bed", "Private Bathroom", "AC", "Balcony", "Free Breakfast", "Games Room Access"],
    image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Triple%20Room/1.jpg",
    images: [
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Triple%20Room/1.jpg",
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Triple%20Room/2.jpg"
    ]
  },
  "6-bed-mixed-economy-dorm": {
    id: "6-bed-mixed-economy-dorm",
    name: "Bed in 6 Bed Mixed Dormitory",
    price: 550,
    maxGuests: 1,
    maxRooms: 6,
    description: "Budget-friendly mixed dormitory with essential amenities",
    type: "dorm",
    propertyType: "economy" as const,
    features: ["Mixed/Female", "AC", "Reading Lights", "Lockers", "Budget Friendly"],
    image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/1.JPG",
    images: [
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/1.JPG",
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/3.jpg"
    ]
  },
  "8-bed-mixed-economy-dorm": {
    id: "8-bed-mixed-economy-dorm",
    name: "Bed in 8 Bed Mixed Dormitory",
    price: 450,
    maxGuests: 1,
    maxRooms: 8,
    description: "Most economical option for backpackers and budget travelers",
    type: "dorm",
    propertyType: "economy" as const,
    features: ["Mixed", "AC", "Reading Lights", "Lockers", "Budget Friendly"],
    image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/8%20Bed%20Mixed%20Dorms/3.jpg",
    images: [
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/8%20Bed%20Mixed%20Dorms/3.jpg",
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/8%20Bed%20Mixed%20Dorms/4.jpg"
    ]
  }
};

interface MobileBookingFlowProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: {
    checkIn: string;
    checkOut: string;
    guests: number;
  };
}

interface SelectedRoom {
  id: string;
  name: string;
  price: number;
  type: string;
  selection: {
    guests: number;
    rooms: number;
  };
}

const MobileBookingFlow = ({ isOpen, onClose, initialData }: MobileBookingFlowProps) => {
  const { formatPrice, currency } = useApp();
  const [currentPage, setCurrentPage] = useState<'rooms' | 'summary' | 'details'>('rooms');
  const [selectedRooms, setSelectedRooms] = useState<SelectedRoom[]>([]);
  const [addOns, setAddOns] = useState({
    breakfast: 0,
    dinnerVeg: 0,
    dinnerNonVeg: 0,
    transportation: false,
    itineraryPlanning: false,
  });
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);

  const { toast } = useToast();
  const roomsArray = Object.values(ROOM_DATA);
  const nights = initialData.checkIn && initialData.checkOut ? 
    Math.ceil((new Date(initialData.checkOut).getTime() - new Date(initialData.checkIn).getTime()) / (1000 * 3600 * 24)) : 1;

  // Calculate total accommodated guests from selected rooms
  const getTotalAccommodatedGuests = () => {
    return selectedRooms.reduce((total, room) => {
      const roomData = ROOM_DATA[room.id as keyof typeof ROOM_DATA];
      if (roomData.type === 'dorm') {
        return total + room.selection.guests;
      } else {
        return total + (roomData.maxGuests * room.selection.rooms);
      }
    }, 0);
  };

  // Validate if current selection meets guest requirement
  const isGuestRequirementMet = () => {
    const totalAccommodated = getTotalAccommodatedGuests();
    return totalAccommodated >= initialData.guests;
  };

  const calculateTotal = () => {
    const isWeekend = initialData.checkIn ? 
      [0, 6].includes(new Date(initialData.checkIn).getDay()) : false;
    
    const roomTotal = selectedRooms.reduce((total, room) => {
      const isDorm = room.name.toLowerCase().includes('dorm');
      let roomPrice = room.price;
      
      if (currency.code !== 'INR') {
        const weekendHike = isWeekend ? 1.15 : 1.10;
        roomPrice = Math.round(room.price * weekendHike);
      }
      
      const basePrice = isDorm ? roomPrice * room.selection.guests : roomPrice * room.selection.rooms;
      return total + (basePrice * nights);
    }, 0);

    // Add-on prices
    let breakfastPrice = 125;
    let dinnerVegPrice = 180; 
    let dinnerNonVegPrice = 240;
    
    if (currency.code !== 'INR') {
      const foodHike = isWeekend ? 1.15 : 1.10;
      breakfastPrice = Math.round(breakfastPrice * foodHike);
      dinnerVegPrice = Math.round(dinnerVegPrice * foodHike);
      dinnerNonVegPrice = Math.round(dinnerNonVegPrice * foodHike);
    }

    const addOnTotal = (addOns.breakfast * breakfastPrice + addOns.dinnerVeg * dinnerVegPrice + addOns.dinnerNonVeg * dinnerNonVegPrice) * nights;
    const subtotal = roomTotal + addOnTotal;
    const discountAmount = promoApplied ? Math.round(subtotal * (promoDiscount / 100)) : 0;
    const afterDiscount = subtotal - discountAmount;
    
    // GST calculation
    let totalGstAmount = 0;
    
    selectedRooms.forEach(room => {
      const isDorm = room.name.toLowerCase().includes('dorm');
      let roomPrice = room.price;
      
      if (currency.code !== 'INR') {
        const weekendHike = isWeekend ? 1.15 : 1.10;
        roomPrice = Math.round(room.price * weekendHike);
      }
      
      let roomGstRate = 0;
      
      if (isDorm) {
        roomGstRate = 0;
      } else {
        if (room.price >= 8000) {
          roomGstRate = 0.18;
        } else if (room.price >= 7999 && room.price <= 10001) {
          roomGstRate = 0.12;
        } else {
          roomGstRate = 0.12;
        }
      }
      
      const roomSubtotal = isDorm ? roomPrice * room.selection.guests * nights : roomPrice * room.selection.rooms * nights;
      totalGstAmount += Math.round(roomSubtotal * roomGstRate);
    });
    
    const total = afterDiscount + totalGstAmount;

    return { 
      subtotal, 
      discountAmount, 
      afterDiscount, 
      gstAmount: totalGstAmount, 
      total,
      isWeekend,
      breakfastPrice,
      dinnerVegPrice,
      dinnerNonVegPrice
    };
  };

  const handleRoomSelection = (roomId: string) => {
    // This is a simple room selection for mobile - just add/remove from selection
    const roomData = ROOM_DATA[roomId as keyof typeof ROOM_DATA];
    if (!roomData) return;

    setSelectedRooms(prev => {
      const existing = prev.find(r => r.id === roomId);
      if (existing) {
        // Remove if already selected
        return prev.filter(r => r.id !== roomId);
      } else {
        // Add with default selection
        return [...prev, {
          id: roomId,
          name: roomData.name,
          price: roomData.price,
          type: roomData.type,
          selection: { 
            guests: roomData.type === 'dorm' ? 1 : 1, 
            rooms: roomData.type === 'dorm' ? 0 : 1 
          }
        }];
      }
    });
  };

  const handleNextPage = () => {
    if (currentPage === 'rooms') {
      if (selectedRooms.length === 0) {
        toast({
          title: "Select a room",
          description: "Please select at least one room to continue",
          variant: "destructive",
        });
        return;
      }
      if (!isGuestRequirementMet()) {
        toast({
          title: "Guest requirement not met",
          description: `You need accommodation for ${initialData.guests} guests. Currently selected rooms accommodate ${getTotalAccommodatedGuests()} guests.`,
          variant: "destructive",
        });
        return;
      }
      setCurrentPage('summary');
    } else if (currentPage === 'summary') {
      setCurrentPage('details');
    }
  };

  const handlePrevPage = () => {
    if (currentPage === 'summary') {
      setCurrentPage('rooms');
    } else if (currentPage === 'details') {
      setCurrentPage('summary');
    }
  };

  const handleBookNow = () => {
    const totals = calculateTotal();
    const whatsappMessage = `Hi! I'd like to book rooms at XTSY Travellers Hostel.

*Booking Details:*
Check-in: ${initialData.checkIn}
Check-out: ${initialData.checkOut}
Nights: ${nights}
Guests: ${initialData.guests}

*Selected Rooms:*
${selectedRooms.map(room => `• ${room.name} - ${room.selection.guests || room.selection.rooms} ${room.type === 'dorm' ? 'beds' : 'rooms'}`).join('\n')}

*Add-ons:*
${addOns.breakfast > 0 ? `• Breakfast: ${addOns.breakfast} persons` : ''}
${addOns.dinnerVeg > 0 ? `• Veg Dinner: ${addOns.dinnerVeg} persons` : ''}
${addOns.dinnerNonVeg > 0 ? `• Non-Veg Dinner: ${addOns.dinnerNonVeg} persons` : ''}
${addOns.transportation ? '• Transportation required' : ''}
${addOns.itineraryPlanning ? '• Itinerary planning required' : ''}

*Total Amount:* ${formatPrice(totals.total)}

Please confirm availability and booking process.`;

    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappURL = `https://wa.me/918837317070?text=${encodedMessage}`;
    
    window.open(whatsappURL, '_blank');
    
    toast({
      title: "Redirecting to WhatsApp",
      description: "Complete your booking via WhatsApp chat with our team",
    });
  };

  const applyPromoCode = () => {
    const validPromoCodes: Record<string, number> = {
      'XTSY10': 10,
      'WELCOME15': 15,
      'MEGHALAYA20': 20,
    };

    const code = promoCode.toUpperCase();
    
    if (!validPromoCodes[code]) {
      toast({
        title: "Invalid promo code",
        description: "Please check your promo code and try again",
        variant: "destructive",
      });
      return;
    }

    setPromoDiscount(validPromoCodes[code]);
    setPromoApplied(true);
    
    toast({
      title: "Promo code applied!",
      description: `${validPromoCodes[code]}% discount applied to your booking`,
    });
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 h-screen max-h-screen w-screen max-w-none m-0 overflow-hidden">
        <div className="flex flex-col h-full bg-white">
          {/* Header */}
          <div className="flex-shrink-0 p-4 bg-gradient-to-r from-orange-500 to-red-600 text-white">
            <div className="flex items-center justify-between">
              {currentPage !== 'rooms' && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handlePrevPage}
                  className="text-white hover:bg-white/20"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <h1 className="text-lg font-bold text-center flex-1">
                {currentPage === 'rooms' && 'Select Room'}
                {currentPage === 'summary' && 'Booking Summary'}
                {currentPage === 'details' && 'Guest Details'}
              </h1>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClose}
                className="text-white hover:bg-white/20"
              >
                ✕
              </Button>
            </div>
            
            {/* Progress indicator */}
            <div className="flex mt-3 space-x-2">
              <div className={`h-1 flex-1 rounded ${currentPage === 'rooms' ? 'bg-white' : 'bg-white/30'}`} />
              <div className={`h-1 flex-1 rounded ${currentPage === 'summary' ? 'bg-white' : 'bg-white/30'}`} />
              <div className={`h-1 flex-1 rounded ${currentPage === 'details' ? 'bg-white' : 'bg-white/30'}`} />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {currentPage === 'rooms' && (
              <div className="p-4 space-y-4">
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-600">
                    Check-in: {initialData.checkIn} | Check-out: {initialData.checkOut} | Guests: {initialData.guests}
                  </p>
                </div>
                
                {roomsArray.map((room) => {
                  const isSelected = selectedRooms.find(r => r.id === room.id);
                  return (
                    <RoomCard
                      key={room.id}
                      room={room}
                      propertyType={room.propertyType}
                      onSelectRoom={() => handleRoomSelection(room.id)}
                      isLuxury={room.propertyType === "luxury"}
                    />
                  );
                })}
              </div>
            )}

            {currentPage === 'summary' && (
              <div className="p-4 space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-bold mb-3">Selected Rooms</h3>
                    {selectedRooms.map((room, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                        <div>
                          <p className="font-medium text-sm">{room.name}</p>
                          <p className="text-xs text-gray-600">
                            {room.selection.guests || room.selection.rooms} {room.type === 'dorm' ? 'beds' : 'rooms'} × {nights} nights
                          </p>
                        </div>
                        <p className="font-bold text-sm">
                          {formatPrice((room.type === 'dorm' ? room.price * room.selection.guests : room.price * room.selection.rooms) * nights)}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Add-ons */}
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-bold mb-3">Add-ons</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-sm">Breakfast</p>
                          <p className="text-xs text-gray-600">₹125 per person per night</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setAddOns(prev => ({ ...prev, breakfast: Math.max(0, prev.breakfast - 1) }))}
                          >
                            -
                          </Button>
                          <span className="w-8 text-center">{addOns.breakfast}</span>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setAddOns(prev => ({ ...prev, breakfast: prev.breakfast + 1 }))}
                          >
                            +
                          </Button>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-sm">Veg Dinner</p>
                          <p className="text-xs text-gray-600">₹180 per person per night</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setAddOns(prev => ({ ...prev, dinnerVeg: Math.max(0, prev.dinnerVeg - 1) }))}
                          >
                            -
                          </Button>
                          <span className="w-8 text-center">{addOns.dinnerVeg}</span>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setAddOns(prev => ({ ...prev, dinnerVeg: prev.dinnerVeg + 1 }))}
                          >
                            +
                          </Button>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-sm">Non-Veg Dinner</p>
                          <p className="text-xs text-gray-600">₹240 per person per night</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setAddOns(prev => ({ ...prev, dinnerNonVeg: Math.max(0, prev.dinnerNonVeg - 1) }))}
                          >
                            -
                          </Button>
                          <span className="w-8 text-center">{addOns.dinnerNonVeg}</span>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setAddOns(prev => ({ ...prev, dinnerNonVeg: prev.dinnerNonVeg + 1 }))}
                          >
                            +
                          </Button>
                        </div>
                      </div>

                      <Separator />

                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          checked={addOns.transportation}
                          onCheckedChange={(checked) => setAddOns(prev => ({ ...prev, transportation: !!checked }))}
                        />
                        <div>
                          <p className="font-medium text-sm">Transportation Service</p>
                          <p className="text-xs text-gray-600">Airport pickup & local travel assistance</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          checked={addOns.itineraryPlanning}
                          onCheckedChange={(checked) => setAddOns(prev => ({ ...prev, itineraryPlanning: !!checked }))}
                        />
                        <div>
                          <p className="font-medium text-sm">Itinerary Planning</p>
                          <p className="text-xs text-gray-600">Custom travel planning & local guide</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Promo Code */}
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-bold mb-3">Promo Code</h3>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Enter promo code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="flex-1"
                      />
                      <Button 
                        onClick={applyPromoCode}
                        disabled={!promoCode || promoApplied}
                        size="sm"
                      >
                        Apply
                      </Button>
                    </div>
                    {promoApplied && (
                      <p className="text-green-600 text-sm mt-2">
                        {promoDiscount}% discount applied!
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Price Summary */}
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-bold mb-3">Price Summary</h3>
                    <div className="space-y-2">
                      {(() => {
                        const totals = calculateTotal();
                        return (
                          <>
                            <div className="flex justify-between text-sm">
                              <span>Subtotal</span>
                              <span>{formatPrice(totals.subtotal)}</span>
                            </div>
                            {promoApplied && (
                              <div className="flex justify-between text-sm text-green-600">
                                <span>Discount ({promoDiscount}%)</span>
                                <span>-{formatPrice(totals.discountAmount)}</span>
                              </div>
                            )}
                            <div className="flex justify-between text-sm">
                              <span>GST</span>
                              <span>{formatPrice(totals.gstAmount)}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between font-bold">
                              <span>Total</span>
                              <span className="text-orange-600">{formatPrice(totals.total)}</span>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {currentPage === 'details' && (
              <div className="p-4">
                <div className="text-center space-y-4">
                  <h3 className="text-xl font-bold">Complete Your Booking</h3>
                  <p className="text-gray-600">Click below to finalize your booking via WhatsApp</p>
                  <Button 
                    onClick={handleBookNow}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Complete Booking via WhatsApp
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex-shrink-0 p-4 bg-gray-50 border-t">
            {currentPage === 'rooms' && (
              <Button 
                onClick={handleNextPage} 
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                disabled={selectedRooms.length === 0 || !isGuestRequirementMet()}
              >
                Next Page <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
            
            {currentPage === 'summary' && (
              <Button 
                onClick={handleNextPage}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
              >
                Book Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
            
            {currentPage === 'details' && (
              <Button 
                onClick={handleBookNow}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Complete Booking via WhatsApp
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MobileBookingFlow;
