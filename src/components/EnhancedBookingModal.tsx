import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Users, ArrowRight, ArrowLeft, Hotel, Bed, Home, IndianRupee } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import RoomCard from "./RoomCard";
import { useApp } from "@/contexts/AppContext";
import UnifiedImage from "./UnifiedImage";

// Room data with Supabase images
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
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20Female%20Only%20Dorms/3.jpg",
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20Female%20Only%20Dorms/4.JPG",
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20Female%20Only%20Dorms/5.JPG",
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20Female%20Only%20Dorms/6.JPG",
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20Female%20Only%20Dorms/7.JPG",
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20Female%20Only%20Dorms/IMG_5161.png"
    ]
  },
  "6-bed-mixed-dorm": {
    id: "6-bed-mixed-dorm",
    name: "Bed in 6 Bed Mixed Dorm",
    price: 750,
    maxGuests: 1,
    maxRooms: 6,
    description: "Mixed dormitory with modern amenities and comfortable beds",
    type: "dorm",
    propertyType: "hostel" as const,
    features: ["Mixed Dorm", "AC", "Reading Lights", "Lockers", "Free Breakfast", "Games Room Access"],
    image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20Mixed%20Dorms/1.jpg",
    images: [
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20Mixed%20Dorms/1.jpg",
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20Mixed%20Dorms/2.jpg",
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20Mixed%20Dorms/3.jpg",
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20Mixed%20Dorms/4.jpg"
    ]
  },
  "double-private-room": {
    id: "double-private-room",
    name: "Double Private Room",
    price: 3000,
    maxGuests: 2,
    maxRooms: 3,
    description: "Private room with double bed and attached bathroom",
    type: "private",
    propertyType: "economy" as const,
    features: ["Private Room", "Double Bed", "Attached Bathroom", "AC", "Free Breakfast", "Games Room Access"],
    image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/Double%20Private%20Room/1.jpg",
    images: [
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/Double%20Private%20Room/1.jpg",
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/Double%20Private%20Room/2.jpg",
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/Double%20Private%20Room/3.jpg",
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/Double%20Private%20Room/4.jpg",
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/Double%20Private%20Room/5.jpg"
    ]
  },
  "twin-private-room": {
    id: "twin-private-room",
    name: "Twin Private Room",
    price: 3200,
    maxGuests: 2,
    maxRooms: 2,
    description: "Private room with twin beds and attached bathroom",
    type: "private",
    propertyType: "economy" as const,
    features: ["Private Room", "Twin Beds", "Attached Bathroom", "AC", "Free Breakfast", "Games Room Access"],
    image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/Twin%20Private%20Room/1.jpg",
    images: [
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/Twin%20Private%20Room/1.jpg",
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/Twin%20Private%20Room/2.jpg",
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/Twin%20Private%20Room/3.jpg",
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/Twin%20Private%20Room/4.jpg"
    ]
  }
};

interface SelectedRoom {
  id: string;
  name: string;
  price: number;
  type: string;
  selection: {
    rooms?: number;
    guests?: number;
  };
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: {
    checkIn: string;
    checkOut: string;
    guests: number;
  };
}

export default function EnhancedBookingModal({ isOpen, onClose, initialData }: BookingModalProps) {
  const [selectedRooms, setSelectedRooms] = useState<SelectedRoom[]>([]);
  const [guestDetails, setGuestDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    specialRequests: ''
  });
  const [addons, setAddons] = useState({
    breakfast: 0,
    dinner: 0
  });
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);

  const { toast } = useToast();
  const isMobile = useIsMobile();

  const roomsArray = Object.values(ROOM_DATA);
  const nights = initialData.checkIn && initialData.checkOut ? 
    Math.ceil((new Date(initialData.checkOut).getTime() - new Date(initialData.checkIn).getTime()) / (1000 * 3600 * 24)) : 1;

  // Calculate total accommodated guests from selected rooms
  const getTotalAccommodatedGuests = () => {
    return selectedRooms.reduce((total, room) => {
      const roomData = ROOM_DATA[room.id as keyof typeof ROOM_DATA];
      if (roomData.type === 'dorm') {
        return total + (room.selection.guests || 0);
      } else {
        return total + (room.selection.rooms || 0) * roomData.maxGuests;
      }
    }, 0);
  };

  const isGuestRequirementMet = () => {
    return getTotalAccommodatedGuests() >= initialData.guests;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const calculateTotal = () => {
    const roomsTotal = selectedRooms.reduce((total, room) => {
      if (room.type === 'dorm') {
        return total + (room.price * (room.selection.guests || 0) * nights);
      } else {
        return total + (room.price * (room.selection.rooms || 0) * nights);
      }
    }, 0);

    const breakfastTotal = addons.breakfast * getTotalAccommodatedGuests() * nights * 125;
    const dinnerTotal = addons.dinner * getTotalAccommodatedGuests() * nights * 180;
    const addonsTotal = breakfastTotal + dinnerTotal;
    
    const subtotal = roomsTotal + addonsTotal;
    const discountAmount = subtotal * (promoDiscount / 100);
    const total = subtotal - discountAmount;

    return {
      rooms: roomsTotal,
      addons: addonsTotal,
      breakfastPrice: 125,
      dinnerPrice: 180,
      subtotal,
      discount: discountAmount,
      total
    };
  };

  const handleBookNow = () => {
    if (!isGuestRequirementMet()) {
      toast({
        title: "Insufficient Accommodation",
        description: `You need ${initialData.guests - getTotalAccommodatedGuests()} more beds to accommodate all guests.`,
        variant: "destructive"
      });
      return;
    }

    if (!guestDetails.firstName || !guestDetails.lastName || !guestDetails.email || !guestDetails.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required guest details.",
        variant: "destructive"
      });
      return;
    }

    // Here you would typically send the booking data to your backend
    toast({
      title: "Booking Confirmed!",
      description: "Your reservation has been successfully created.",
    });
    
    onClose();
  };

  const applyPromoCode = () => {
    // Simple promo code logic
    if (promoCode.toLowerCase() === 'welcome10') {
      setPromoDiscount(10);
      setPromoApplied(true);
      toast({
        title: "Promo Applied!",
        description: "You got 10% discount with WELCOME10",
      });
    } else if (promoCode.toLowerCase() === 'save20') {
      setPromoDiscount(20);
      setPromoApplied(true);
      toast({
        title: "Promo Applied!",
        description: "You got 20% discount with SAVE20",
      });
    } else {
      toast({
        title: "Invalid Promo Code",
        description: "The promo code you entered is not valid.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full h-full max-w-none max-h-none md:max-w-7xl lg:max-w-[90vw] md:max-h-[95vh] md:h-auto bg-white border-0 p-0 overflow-hidden">
        <div className="flex flex-col h-full max-h-[100dvh] md:max-h-[95vh]">
          {/* Header */}
          <div className="flex-shrink-0 p-4 md:p-6 border-b bg-gradient-to-r from-orange-50 to-red-50">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="h-5 w-5 text-orange-600" />
              <div className="text-sm md:text-base font-medium text-gray-700">
                <span className="text-orange-600">{new Date(initialData.checkIn).toLocaleDateString('en-GB')}</span>
                <span className="mx-2">→</span>
                <span className="text-orange-600">{new Date(initialData.checkOut).toLocaleDateString('en-GB')}</span>
                <span className="ml-2 text-gray-500">({nights} nights)</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-lg md:text-xl font-bold text-black">
                  Select Your Room
                </DialogTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Users className="h-4 w-4 text-blue-600" />
                  <div className="text-sm text-blue-700">
                    {initialData.guests} {initialData.guests === 1 ? 'Guest' : 'Guests'} • Need {getTotalAccommodatedGuests()}/{initialData.guests} beds selected
                    {!isGuestRequirementMet() && (
                      <span className="text-red-600 font-semibold"> - Need more beds!</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto min-h-0">
            {/* Unified layout for all screen sizes */}
            <div className="flex h-full">
              {/* Left side - Room Selection */}
              <div className="flex-1 p-6 overflow-y-auto">
                {/* Live the Shillong Vibe Hero Section */}
                <div className="relative mb-8 h-40 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="relative h-full flex items-center justify-center text-center px-6">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">Live the Shillong Vibe</h2>
                      <p className="text-white/90 text-sm">Experience the best of Meghalaya with our premium accommodations</p>
                    </div>
                  </div>
                </div>

                {/* Room Type Classifications */}
                <div className="space-y-8">
                  {/* XTSY Luxury */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <Hotel className="h-6 w-6 text-orange-600" />
                      <h3 className="text-xl font-bold text-gray-900">XTSY Luxury</h3>
                      <span className="text-sm text-orange-600 bg-orange-50 px-2 py-1 rounded-full">Premium Experience</span>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {roomsArray.filter(room => room.propertyType === 'luxury').map((room) => (
                        <RoomSelectionCard key={room.id} room={room} selectedRooms={selectedRooms} setSelectedRooms={setSelectedRooms} nights={nights} formatPrice={formatPrice} initialGuests={initialData.guests} />
                      ))}
                    </div>
                  </div>

                  {/* XTSY Travellers Hostel */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <Users className="h-6 w-6 text-orange-600" />
                      <h3 className="text-xl font-bold text-gray-900">XTSY Travellers Hostel</h3>
                      <span className="text-sm text-orange-600 bg-orange-50 px-2 py-1 rounded-full">Social Experience</span>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {roomsArray.filter(room => room.propertyType === 'hostel').map((room) => (
                        <RoomSelectionCard key={room.id} room={room} selectedRooms={selectedRooms} setSelectedRooms={setSelectedRooms} nights={nights} formatPrice={formatPrice} initialGuests={initialData.guests} />
                      ))}
                    </div>
                  </div>

                  {/* XTSY Economy */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <Home className="h-6 w-6 text-orange-600" />
                      <h3 className="text-xl font-bold text-gray-900">XTSY Economy</h3>
                      <span className="text-sm text-orange-600 bg-orange-50 px-2 py-1 rounded-full">Budget Friendly</span>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {roomsArray.filter(room => room.propertyType === 'economy').map((room) => (
                        <RoomSelectionCard key={room.id} room={room} selectedRooms={selectedRooms} setSelectedRooms={setSelectedRooms} nights={nights} formatPrice={formatPrice} initialGuests={initialData.guests} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right side - Booking Summary */}
              <Card className="w-80 flex-shrink-0 bg-gray-50">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
                  
                  {/* Guest accommodation status */}
                  <div className="mb-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-sm font-medium text-blue-900">
                      Guest accommodation: {getTotalAccommodatedGuests()}/{initialData.guests} guests
                    </div>
                    {!isGuestRequirementMet() && (
                      <div className="text-xs text-red-600 mt-1">Need {initialData.guests - getTotalAccommodatedGuests()} more beds/spaces</div>
                    )}
                  </div>

                  {/* Selected Rooms */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-3">Selected Rooms</h4>
                    {selectedRooms.length > 0 ? (
                      <div className="space-y-2">
                        {selectedRooms.map((room, index) => (
                          <div key={index} className="flex justify-between items-center p-2 bg-white rounded text-sm">
                            <div>
                              <div className="font-medium">{room.name}</div>
                              <div className="text-gray-600">
                                {room.type === 'dorm' ? `${room.selection.guests} beds` : `${room.selection.rooms} rooms`} × {nights} nights
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">
                                {formatPrice(room.type === 'dorm' ? room.price * (room.selection.guests || 0) * nights : room.price * (room.selection.rooms || 0) * nights)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-gray-500 text-sm">No rooms selected yet</div>
                    )}
                  </div>

                  {/* Add-on Services */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-3">Add-on Services</h4>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-white rounded">
                        <div>
                          <div className="font-medium">Breakfast</div>
                          <div className="text-sm text-gray-600">{formatPrice(125)} per person per day</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => setAddons(prev => ({ ...prev, breakfast: Math.max(0, prev.breakfast - 1) }))}>-</Button>
                          <span className="w-8 text-center">{addons.breakfast}</span>
                          <Button variant="outline" size="sm" onClick={() => setAddons(prev => ({ ...prev, breakfast: prev.breakfast + 1 }))}>+</Button>
                        </div>
                      </div>

                      <div className="flex justify-between items-center p-3 bg-white rounded">
                        <div>
                          <div className="font-medium">Dinner - Veg</div>
                          <div className="text-sm text-gray-600">{formatPrice(180)} per person per day</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => setAddons(prev => ({ ...prev, dinner: Math.max(0, prev.dinner - 1) }))}>-</Button>
                          <span className="w-8 text-center">{addons.dinner}</span>
                          <Button variant="outline" size="sm" onClick={() => setAddons(prev => ({ ...prev, dinner: prev.dinner + 1 }))}>+</Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Promo Code */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-3">Promo Code</h4>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter promo code"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        disabled={promoApplied}
                      />
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={applyPromoCode}
                        disabled={promoApplied || !promoCode}
                      >
                        Apply
                      </Button>
                    </div>
                    {promoApplied && (
                      <div className="text-green-600 text-sm mt-1">Promo applied: {promoDiscount}% off</div>
                    )}
                  </div>

                  {/* Price Breakdown */}
                  <div className="mb-6 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Rooms ({nights} nights)</span>
                      <span>{formatPrice(calculateTotal().rooms)}</span>
                    </div>
                    {calculateTotal().addons > 0 && (
                      <div className="flex justify-between">
                        <span>Add-ons</span>
                        <span>{formatPrice(calculateTotal().addons)}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatPrice(calculateTotal().subtotal)}</span>
                    </div>
                    {calculateTotal().discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount ({promoDiscount}%)</span>
                        <span>-{formatPrice(calculateTotal().discount)}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>{formatPrice(calculateTotal().total)}</span>
                    </div>
                  </div>

                  {/* Guest Details */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-3">Guest Details</h4>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="First Name *"
                          className="px-3 py-2 border border-gray-300 rounded text-sm"
                          value={guestDetails.firstName}
                          onChange={(e) => setGuestDetails(prev => ({ ...prev, firstName: e.target.value }))}
                        />
                        <input
                          type="text"
                          placeholder="Last Name *"
                          className="px-3 py-2 border border-gray-300 rounded text-sm"
                          value={guestDetails.lastName}
                          onChange={(e) => setGuestDetails(prev => ({ ...prev, lastName: e.target.value }))}
                        />
                      </div>
                      <input
                        type="email"
                        placeholder="Email *"
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                        value={guestDetails.email}
                        onChange={(e) => setGuestDetails(prev => ({ ...prev, email: e.target.value }))}
                      />
                      <input
                        type="tel"
                        placeholder="Phone *"
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                        value={guestDetails.phone}
                        onChange={(e) => setGuestDetails(prev => ({ ...prev, phone: e.target.value }))}
                      />
                      <textarea
                        placeholder="Special requests (optional)"
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm h-20 resize-none"
                        value={guestDetails.specialRequests}
                        onChange={(e) => setGuestDetails(prev => ({ ...prev, specialRequests: e.target.value }))}
                      />
                    </div>
                  </div>

                  {/* Book Now Button */}
                  <Button 
                    onClick={handleBookNow}
                    disabled={selectedRooms.length === 0 || !isGuestRequirementMet()}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-3 text-lg rounded-lg disabled:opacity-50"
                  >
                    {!isGuestRequirementMet() ? `Need ${initialData.guests - getTotalAccommodatedGuests()} More Beds` : `Book Now - ${formatPrice(calculateTotal().total)}`}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Room Selection Card Component
interface RoomSelectionCardProps {
  room: any;
  selectedRooms: SelectedRoom[];
  setSelectedRooms: React.Dispatch<React.SetStateAction<SelectedRoom[]>>;
  nights: number;
  formatPrice: (price: number) => string;
  initialGuests: number;
}

const RoomSelectionCard: React.FC<RoomSelectionCardProps> = ({ room, selectedRooms, setSelectedRooms, nights, formatPrice, initialGuests }) => {
  const { toast } = useToast();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity === 0) {
      setSelectedRooms(prev => prev.filter(r => r.id !== room.id));
    } else {
      const maxAllowed = room.type === 'dorm' ? Math.min(room.maxRooms, initialGuests) : room.maxRooms;
      
      if (newQuantity > maxAllowed) {
        toast({
          title: "Maximum Limit Reached",
          description: `Only ${maxAllowed} ${room.type === 'dorm' ? 'beds' : 'rooms'} available for this room type.`,
          variant: "destructive"
        });
        return;
      }

      setSelectedRooms(prev => {
        const existingRoom = prev.find(r => r.id === room.id);
        if (existingRoom) {
          return prev.map(r => 
            r.id === room.id 
              ? { 
                  ...r, 
                  selection: room.type === 'dorm' 
                    ? { guests: newQuantity } 
                    : { rooms: newQuantity }
                }
              : r
          );
        } else {
          return [...prev, {
            id: room.id,
            name: room.name,
            price: room.price,
            type: room.type,
            selection: room.type === 'dorm' 
              ? { guests: newQuantity } 
              : { rooms: newQuantity }
          }];
        }
      });
    }
  };

  const currentSelection = selectedRooms.find(r => r.id === room.id);
  const currentQuantity = room.type === 'dorm' 
    ? (currentSelection?.selection.guests || 0) 
    : (currentSelection?.selection.rooms || 0);

  return (
    <Card className="overflow-hidden border-2 hover:border-orange-200 transition-colors">
      <div className="aspect-w-16 aspect-h-9 relative">
        <UnifiedImage
          src={room.image}
          alt={room.name}
          className="w-full h-40 object-cover"
        />
        <div className="absolute top-2 left-2">
          <span className="bg-orange-600 text-white px-2 py-1 rounded text-xs font-medium">
            Max {room.maxGuests} guests
          </span>
        </div>
        <div className="absolute top-2 right-2">
          <span className="bg-white/90 text-gray-800 px-2 py-1 rounded text-xs font-medium">
            {formatPrice(room.price)}/night
          </span>
        </div>
      </div>
      
      <CardContent className="p-4">
        <h4 className="font-bold text-lg text-gray-900 mb-2">{room.name}</h4>
        <p className="text-gray-600 text-sm mb-3">{room.description}</p>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {room.features.slice(0, 3).map((feature: string, index: number) => (
            <span key={index} className="text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded">
              {feature}
            </span>
          ))}
          {room.features.length > 3 && (
            <span className="text-xs bg-gray-50 text-gray-700 px-2 py-1 rounded">
              +{room.features.length - 3} more
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-right">
            <div className="text-lg font-bold text-gray-900">
              {formatPrice(room.price * currentQuantity * nights)}
            </div>
            <div className="text-xs text-gray-600">
              {room.type === 'dorm' ? `${currentQuantity} beds` : `${currentQuantity} rooms`} × {nights} nights
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleQuantityChange(currentQuantity - 1)}
              disabled={currentQuantity === 0}
            >
              -
            </Button>
            <span className="w-8 text-center font-medium">{currentQuantity}</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleQuantityChange(currentQuantity + 1)}
            >
              +
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};