import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Users, ArrowRight, ArrowLeft, Hotel, Bed, Home, IndianRupee, MessageCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import UnifiedImage from "@/components/UnifiedImage";
import { useApp } from "@/contexts/AppContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Room data with Supabase images (reused from EnhancedBookingModal)
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
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20Female%20Only%20Dorms/2.jpg"
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
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20MixedFemale%20Dorms/3.jpg"
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
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/1.JPG"
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
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/8%20Bed%20Mixed%20Dorms/3.jpg"
    ]
  },
  "twin-private-ensuite": {
    id: "twin-private-ensuite",
    name: "Twin Private Ensuite",
    price: 7000,
    maxGuests: 2,
    maxRooms: 1,
    description: "Private twin room with ensuite bathroom for comfort and privacy",
    type: "private",
    propertyType: "economy" as const,
    features: ["Twin Beds", "Private Bathroom", "AC", "Free Breakfast", "Games Room Access"],
    image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/Twin%20Private%20Ensuite/1.JPG",
    images: [
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/Twin%20Private%20Ensuite/1.JPG"
    ]
  },
  "family-private-ensuite": {
    id: "family-private-ensuite", 
    name: "Family Private Ensuite (4 Beds)",
    price: 10000,
    maxGuests: 4,
    maxRooms: 1,
    description: "Spacious family room with 4 beds and private bathroom",
    type: "private",
    propertyType: "economy" as const,
    features: ["4 Beds", "Family Room", "Private Bathroom", "AC", "Free Breakfast", "Games Room Access"],
    image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/Family%20Private%20Ensuite%204%20Beds/1.JPG",
    images: [
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/Family%20Private%20Ensuite%204%20Beds/1.JPG"
    ]
  }
};

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

interface GuestData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  specialRequests: string;
}

const BookingFlow = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { formatPrice, currency } = useApp();
  const { toast } = useToast();

  // URL parameters
  const checkIn = searchParams.get('checkIn') || new Date().toISOString().split('T')[0];
  const checkOut = searchParams.get('checkOut') || '';
  const guests = parseInt(searchParams.get('guests') || '1');
  const preSelectedRoom = searchParams.get('roomType');
  const preSelectedProperty = searchParams.get('propertyType');

  // State
  const [currentStep, setCurrentStep] = useState<'room-selection' | 'booking-summary' | 'guest-details'>('room-selection');
  const [selectedRooms, setSelectedRooms] = useState<SelectedRoom[]>([]);
  const [addOns, setAddOns] = useState({
    breakfast: 0,
    dinnerVeg: 0,
    dinnerNonVeg: 0,
    transportation: false,
    itinerary: false,
  });
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [guestData, setGuestData] = useState<GuestData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    specialRequests: ''
  });

  const roomsArray = Object.values(ROOM_DATA);
  const nights = checkIn && checkOut ? 
    Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 3600 * 24)) : 1;

  // Pre-select room if specified
  useEffect(() => {
    if (preSelectedRoom && preSelectedProperty) {
      const room = ROOM_DATA[preSelectedRoom as keyof typeof ROOM_DATA];
      if (room && room.propertyType === preSelectedProperty) {
        setSelectedRooms([{
          id: room.id,
          name: room.name,
          price: room.price,
          type: room.type,
          selection: {
            guests: room.type === 'dorm' ? 1 : 1,
            rooms: room.type === 'dorm' ? 0 : 1
          }
        }]);
      }
    }
  }, [preSelectedRoom, preSelectedProperty]);

  // Calculate total accommodated guests from selected rooms
  const getTotalAccommodatedGuests = () => {
    return selectedRooms.reduce((total, room) => {
      const roomData = ROOM_DATA[room.id as keyof typeof ROOM_DATA];
      if (roomData.type === 'dorm') {
        return total + room.selection.guests; // Each bed accommodates 1 guest
      } else {
        return total + (roomData.maxGuests * room.selection.rooms); // Each room can accommodate maxGuests
      }
    }, 0);
  };

  // Validate if current selection meets guest requirement
  const isGuestRequirementMet = () => {
    const totalAccommodated = getTotalAccommodatedGuests();
    return totalAccommodated >= guests;
  };

  const calculateTotal = () => {
    // Check if selected date is weekend (for USD/EUR pricing)
    const isWeekend = checkIn ? 
      [0, 6].includes(new Date(checkIn).getDay()) : false;
    
    const roomTotal = selectedRooms.reduce((total, room) => {
      const isDorm = room.name.toLowerCase().includes('dorm');
      let roomPrice = room.price;
      
      // For USD/EUR guests: Add hikes
      if (currency.code !== 'INR') {
        const weekendHike = isWeekend ? 1.15 : 1.10; // 15% weekend, 10% weekday
        roomPrice = Math.round(room.price * weekendHike);
      }
      
      const basePrice = isDorm ? roomPrice * room.selection.guests : roomPrice * room.selection.rooms;
      return total + (basePrice * nights);
    }, 0);

    // Add-on prices (always in INR base, then converted)
    let breakfastPrice = 125;
    let dinnerVegPrice = 180; 
    let dinnerNonVegPrice = 240;
    
    // Apply same hikes to food for USD/EUR
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
    
    // GST calculation based on room types and prices
    let totalGstAmount = 0;
    
    selectedRooms.forEach(room => {
      const isDorm = room.name.toLowerCase().includes('dorm');
      let roomPrice = room.price;
      
      // Apply same currency hikes for GST calculation
      if (currency.code !== 'INR') {
        const weekendHike = isWeekend ? 1.15 : 1.10;
        roomPrice = Math.round(room.price * weekendHike);
      }
      
      let roomGstRate = 0;
      
      if (isDorm) {
        roomGstRate = 0; // No GST for dormitory
      } else {
        // Private rooms based on original INR price
        if (room.price >= 8000) {
          roomGstRate = 0.18; // 18% for ₹8000+
        } else if (room.price >= 7999 && room.price <= 10001) {
          roomGstRate = 0.12; // 12% for ₹7999-₹10001
        } else {
          roomGstRate = 0.12; // Default 12% for other private rooms
        }
      }
      
      const roomSubtotal = isDorm ? roomPrice * room.selection.guests * nights : roomPrice * room.selection.rooms * nights;
      totalGstAmount += Math.round(roomSubtotal * roomGstRate);
    });
    
    // No GST for food as requested
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

  const applyPromoCode = () => {
    const validPromoCodes = {
      'XTSY10': 10,
      'WELCOME15': 15,
      'MEGHALAYA20': 20,
    };

    const code = promoCode.toUpperCase();
    
    // Check if promo code exists
    if (!validPromoCodes[code]) {
      toast({
        title: "Invalid promo code",
        description: "Please check your promo code and try again",
        variant: "destructive",
      });
      return;
    }

    // Calculate total guests and beds from selected rooms
    const totalSelectedGuests = selectedRooms.reduce((sum, room) => sum + room.selection.guests, 0);
    const totalBeds = selectedRooms.reduce((sum, room) => {
      if (room.type === 'dorm') {
        return sum + room.selection.guests; // For dorms, each guest gets a bed
      } else {
        return sum + room.selection.rooms; // For private rooms, assume 1 bed per room
      }
    }, 0);
    
    // Check eligibility conditions for specific promo codes
    if (code === 'XTSY10') {
      const errors = [];
      if (totalSelectedGuests < 4) errors.push(`minimum 4 guests selected (current: ${totalSelectedGuests})`);
      if (totalBeds < 4) errors.push(`minimum 4 beds (current: ${totalBeds})`);
      if (nights < 2) errors.push(`minimum 2 nights (current: ${nights})`);
      
      if (errors.length > 0) {
        toast({
          title: "XTSY10 not eligible",
          description: `This promo requires: ${errors.join(', ')}`,
          variant: "destructive",
        });
        return;
      }
    } else if (code === 'WELCOME15') {
      const errors = [];
      if (totalSelectedGuests < 2) errors.push(`minimum 2 guests selected (current: ${totalSelectedGuests})`);
      if (nights < 2) errors.push(`minimum 2 nights (current: ${nights})`);
      
      if (errors.length > 0) {
        toast({
          title: "WELCOME15 not eligible",
          description: `This promo requires: ${errors.join(', ')}`,
          variant: "destructive",
        });
        return;
      }
    } else if (code === 'MEGHALAYA20') {
      const errors = [];
      if (totalSelectedGuests < 2) errors.push(`minimum 2 guests selected (current: ${totalSelectedGuests})`);
      if (nights < 3) errors.push(`minimum 3 nights (current: ${nights})`);
      
      if (errors.length > 0) {
        toast({
          title: "MEGHALAYA20 not eligible",
          description: `This promo requires: ${errors.join(', ')}`,
          variant: "destructive",
        });
        return;
      }
    }

    setPromoDiscount(validPromoCodes[code]);
    setPromoApplied(true);
    toast({
      title: "Promo code applied!",
      description: `You saved ${validPromoCodes[code]}% on your booking`,
    });
  };

  const handleRoomSelection = (roomId: string, guestCount: number, roomCount: number) => {
    const roomData = ROOM_DATA[roomId as keyof typeof ROOM_DATA];
    if (!roomData) return;

    setSelectedRooms(prev => {
      const existing = prev.find(r => r.id === roomId);
      if (existing) {
        if (guestCount === 0 && roomCount === 0) {
          return prev.filter(r => r.id !== roomId);
        }
        return prev.map(r =>
          r.id === roomId
            ? { ...r, selection: { guests: guestCount, rooms: roomCount } }
            : r
        );
      } else if (guestCount > 0 || roomCount > 0) {
        return [...prev, {
          id: roomId,
          name: roomData.name,
          price: roomData.price,
          type: roomData.type,
          selection: { guests: guestCount, rooms: roomCount }
        }];
      }
      return prev;
    });
  };

  const handleNextStep = () => {
    if (currentStep === 'room-selection') {
      if (selectedRooms.length === 0) {
        toast({
          title: "No rooms selected",
          description: "Please select at least one room to continue",
          variant: "destructive",
        });
        return;
      }
      if (!isGuestRequirementMet()) {
        toast({
          title: "Guest requirement not met",
          description: `Please select accommodations for all ${guests} guests`,
          variant: "destructive",
        });
        return;
      }
      setCurrentStep('booking-summary');
    } else if (currentStep === 'booking-summary') {
      setCurrentStep('guest-details');
    }
  };

  const handlePreviousStep = () => {
    if (currentStep === 'booking-summary') {
      setCurrentStep('room-selection');
    } else if (currentStep === 'guest-details') {
      setCurrentStep('booking-summary');
    }
  };

  const validateGuestData = () => {
    const errors = [];
    if (!guestData.firstName.trim()) errors.push('First name is required');
    if (!guestData.lastName.trim()) errors.push('Last name is required');
    if (!guestData.email.trim()) errors.push('Email is required');
    if (!guestData.phone.trim()) errors.push('Phone number is required');
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestData.email)) {
      errors.push('Please enter a valid email address');
    }
    
    return errors;
  };

  const handleCompleteBooking = () => {
    const errors = validateGuestData();
    if (errors.length > 0) {
      toast({
        title: "Please fill in required fields",
        description: errors.join(', '),
        variant: "destructive",
      });
      return;
    }

    // Generate WhatsApp message
    const total = calculateTotal();
    const bookingDetails = `
*XTSY Booking Request*

*Guest Details:*
Name: ${guestData.firstName} ${guestData.lastName}
Email: ${guestData.email}
Phone: ${guestData.phone}

*Stay Details:*
Check-in: ${checkIn}
Check-out: ${checkOut}
Nights: ${nights}
Guests: ${guests}

*Selected Rooms:*
${selectedRooms.map(room => `• ${room.name} (${room.type === 'dorm' ? room.selection.guests + ' beds' : room.selection.rooms + ' rooms'})`).join('\n')}

*Total Amount:* ${formatPrice(total.total)}

${guestData.specialRequests ? `*Special Requests:* ${guestData.specialRequests}` : ''}

Please confirm this booking and provide payment details.
    `.trim();

    const whatsappUrl = `https://wa.me/9366015383?text=${encodeURIComponent(bookingDetails)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Mobile Room Selection Card Component
  const MobileRoomSelectionCard = ({ room }: { room: any }) => {
    const currentSelection = selectedRooms.find(r => r.id === room.id);
    const currentQuantity = currentSelection ? 
      (room.type === 'dorm' ? currentSelection.selection.guests : currentSelection.selection.rooms) : 0;

    const handleQuantityChange = (newQuantity: number) => {
      const maxQuantity = room.type === 'dorm' ? room.maxRooms : 3;
      const validQuantity = Math.max(0, Math.min(newQuantity, maxQuantity));
      
      if (room.type === 'dorm') {
        handleRoomSelection(room.id, validQuantity, 0);
      } else {
        handleRoomSelection(room.id, 0, validQuantity);
      }
    };

    return (
      <Card className="overflow-hidden border border-gray-200">
        <div className="flex gap-3 p-3">
          {/* Room Image */}
          <div className="w-20 h-20 flex-shrink-0">
            <UnifiedImage 
              src={room.image} 
              alt={room.name}
              className="w-full h-full object-cover rounded"
              threshold={0.1}
            />
          </div>
          
          {/* Room Details */}
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 text-sm mb-1">{room.name}</h4>
            <p className="text-xs text-gray-600 mb-2 line-clamp-2">{room.description}</p>
            <div className="text-sm font-bold text-orange-600">{formatPrice(room.price)}/night</div>
            <div className="text-xs text-gray-500">Max {room.maxGuests} guests</div>
          </div>
          
          {/* Quantity Selector */}
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="text-xs text-gray-600 text-center">
              {room.type === 'dorm' ? 'Beds' : 'Rooms'}
            </div>
            <div className="flex items-center gap-1">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleQuantityChange(currentQuantity - 1)}
                className="bg-white text-black border-black hover:bg-gray-100 h-6 w-6 p-0 text-xs"
              >
                -
              </Button>
              <span className="w-6 text-center bg-white text-black font-bold border border-black rounded px-1 text-xs">
                {currentQuantity}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleQuantityChange(currentQuantity + 1)}
                className="bg-white text-black border-black hover:bg-gray-100 h-6 w-6 p-0 text-xs"
              >
                +
              </Button>
            </div>
            {currentQuantity > 0 && (
              <div className="text-xs text-center">
                <div className="font-bold text-gray-900">
                  {formatPrice(room.type === 'dorm' ? room.price * currentQuantity * nights : room.price * currentQuantity * nights)}
                </div>
                <div className="text-gray-600">
                  {room.type === 'dorm' ? currentQuantity : currentQuantity * room.maxGuests} guests
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className={`flex items-center ${currentStep === 'room-selection' ? 'text-orange-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'room-selection' ? 'bg-orange-600 text-white' : 'bg-gray-300'}`}>
                1
              </div>
              <span className="ml-2 hidden sm:inline">Room Selection</span>
            </div>
            
            <div className="h-1 w-12 bg-gray-300">
              <div className={`h-full ${currentStep !== 'room-selection' ? 'bg-orange-600' : 'bg-gray-300'} transition-all duration-300`}></div>
            </div>
            
            <div className={`flex items-center ${currentStep === 'booking-summary' ? 'text-orange-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'booking-summary' ? 'bg-orange-600 text-white' : currentStep === 'guest-details' ? 'bg-green-600 text-white' : 'bg-gray-300'}`}>
                {currentStep === 'guest-details' ? <CheckCircle className="w-4 h-4" /> : 2}
              </div>
              <span className="ml-2 hidden sm:inline">Booking Summary</span>
            </div>
            
            <div className="h-1 w-12 bg-gray-300">
              <div className={`h-full ${currentStep === 'guest-details' ? 'bg-orange-600' : 'bg-gray-300'} transition-all duration-300`}></div>
            </div>
            
            <div className={`flex items-center ${currentStep === 'guest-details' ? 'text-orange-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'guest-details' ? 'bg-orange-600 text-white' : 'bg-gray-300'}`}>
                3
              </div>
              <span className="ml-2 hidden sm:inline">Guest Details</span>
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-4xl mx-auto">
          {currentStep === 'room-selection' && (
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Select Your Rooms</h1>
                <p className="text-gray-600">Choose from our variety of accommodations</p>
                <div className="mt-4 text-sm text-gray-500">
                  Check-in: {checkIn} | Check-out: {checkOut} | {nights} nights | {guests} guests
                </div>
              </div>

              {/* XTSY Luxury */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Hotel className="h-6 w-6 text-orange-600" />
                  <h2 className="text-xl font-bold text-gray-900">XTSY Luxury</h2>
                  <span className="text-sm text-orange-600 bg-orange-50 px-2 py-1 rounded-full">Premium</span>
                </div>
                <div className="grid gap-4">
                  {roomsArray.filter(room => room.propertyType === 'luxury').map((room) => (
                    <MobileRoomSelectionCard key={room.id} room={room} />
                  ))}
                </div>
              </div>

              {/* XTSY Travellers Hostel */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Users className="h-6 w-6 text-orange-600" />
                  <h2 className="text-xl font-bold text-gray-900">XTSY Travellers Hostel</h2>
                  <span className="text-sm text-orange-600 bg-orange-50 px-2 py-1 rounded-full">Social</span>
                </div>
                <div className="grid gap-4">
                  {roomsArray.filter(room => room.propertyType === 'hostel').map((room) => (
                    <MobileRoomSelectionCard key={room.id} room={room} />
                  ))}
                </div>
              </div>

              {/* XTSY Economy */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Home className="h-6 w-6 text-orange-600" />
                  <h2 className="text-xl font-bold text-gray-900">XTSY Economy</h2>
                  <span className="text-sm text-orange-600 bg-orange-50 px-2 py-1 rounded-full">Budget</span>
                </div>
                <div className="grid gap-4">
                  {roomsArray.filter(room => room.propertyType === 'economy').map((room) => (
                    <MobileRoomSelectionCard key={room.id} room={room} />
                  ))}
                </div>
              </div>

              {/* Selection Summary */}
              {selectedRooms.length > 0 && (
                <Card className="p-4 bg-orange-50 border-orange-200">
                  <h3 className="font-semibold text-gray-900 mb-2">Current Selection</h3>
                  {selectedRooms.map((room, index) => (
                    <div key={index} className="flex justify-between items-center py-1">
                      <span className="text-sm">{room.name}</span>
                      <span className="text-sm font-medium">
                        {room.type === 'dorm' ? `${room.selection.guests} beds` : `${room.selection.rooms} rooms`}
                      </span>
                    </div>
                  ))}
                  <Separator className="my-2" />
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total accommodated</span>
                    <span className="font-bold text-orange-600">
                      {getTotalAccommodatedGuests()} / {guests} guests
                    </span>
                  </div>
                </Card>
              )}
            </div>
          )}

          {currentStep === 'booking-summary' && (
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Booking Summary</h1>
                <p className="text-gray-600">Review your selection and add extras</p>
              </div>

              {/* Selected Rooms */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Selected Rooms</h2>
                <div className="space-y-3">
                  {selectedRooms.map((room, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{room.name}</h4>
                        <p className="text-sm text-gray-600">
                          {room.type === 'dorm' ? `${room.selection.guests} beds` : `${room.selection.rooms} rooms`} × {nights} nights
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">
                          {formatPrice(room.type === 'dorm' ? room.price * room.selection.guests * nights : room.price * room.selection.rooms * nights)}
                        </div>
                        <div className="text-sm text-gray-600">{formatPrice(room.price)}/night</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Add-ons */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Add-ons</h2>
                <div className="space-y-4">
                  {/* Breakfast */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Breakfast</h4>
                      <p className="text-sm text-gray-600">{formatPrice(calculateTotal().breakfastPrice)} per person per day</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setAddOns(prev => ({ ...prev, breakfast: Math.max(0, prev.breakfast - 1) }))}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">{addOns.breakfast}</span>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setAddOns(prev => ({ ...prev, breakfast: prev.breakfast + 1 }))}
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  {/* Veg Dinner */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Vegetarian Dinner</h4>
                      <p className="text-sm text-gray-600">{formatPrice(calculateTotal().dinnerVegPrice)} per person per day</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setAddOns(prev => ({ ...prev, dinnerVeg: Math.max(0, prev.dinnerVeg - 1) }))}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">{addOns.dinnerVeg}</span>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setAddOns(prev => ({ ...prev, dinnerVeg: prev.dinnerVeg + 1 }))}
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  {/* Non-Veg Dinner */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Non-Vegetarian Dinner</h4>
                      <p className="text-sm text-gray-600">{formatPrice(calculateTotal().dinnerNonVegPrice)} per person per day</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setAddOns(prev => ({ ...prev, dinnerNonVeg: Math.max(0, prev.dinnerNonVeg - 1) }))}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">{addOns.dinnerNonVeg}</span>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setAddOns(prev => ({ ...prev, dinnerNonVeg: prev.dinnerNonVeg + 1 }))}
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  {/* Transportation */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Transportation</h4>
                      <p className="text-sm text-gray-600">Local transport and transfers</p>
                    </div>
                    <Checkbox 
                      checked={addOns.transportation}
                      onCheckedChange={(checked) => setAddOns(prev => ({ ...prev, transportation: checked as boolean }))}
                    />
                  </div>

                  {/* Itinerary */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Curated Itinerary</h4>
                      <p className="text-sm text-gray-600">Personalized travel plan</p>
                    </div>
                    <Checkbox 
                      checked={addOns.itinerary}
                      onCheckedChange={(checked) => setAddOns(prev => ({ ...prev, itinerary: checked as boolean }))}
                    />
                  </div>
                </div>
              </Card>

              {/* Promo Code */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Promo Code</h2>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter promo code"
                    className="flex-1"
                    disabled={promoApplied}
                  />
                  <Button 
                    onClick={applyPromoCode}
                    disabled={promoApplied || !promoCode.trim()}
                    variant={promoApplied ? "secondary" : "default"}
                  >
                    {promoApplied ? "Applied" : "Apply"}
                  </Button>
                </div>
                {promoApplied && (
                  <p className="text-green-600 text-sm mt-2">
                    {promoDiscount}% discount applied!
                  </p>
                )}
              </Card>

              {/* Price Summary */}
              <Card className="p-6 bg-gray-50">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Price Summary</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(calculateTotal().subtotal)}</span>
                  </div>
                  {promoApplied && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({promoDiscount}%)</span>
                      <span>-{formatPrice(calculateTotal().discountAmount)}</span>
                    </div>
                  )}
                  {calculateTotal().gstAmount > 0 && (
                    <div className="flex justify-between">
                      <span>GST</span>
                      <span>{formatPrice(calculateTotal().gstAmount)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-orange-600">{formatPrice(calculateTotal().total)}</span>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {currentStep === 'guest-details' && (
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Guest Details</h1>
                <p className="text-gray-600">Please provide your information to complete the booking</p>
              </div>

              <Card className="p-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={guestData.firstName}
                      onChange={(e) => setGuestData(prev => ({ ...prev, firstName: e.target.value }))}
                      placeholder="Enter first name"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={guestData.lastName}
                      onChange={(e) => setGuestData(prev => ({ ...prev, lastName: e.target.value }))}
                      placeholder="Enter last name"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={guestData.email}
                      onChange={(e) => setGuestData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter email address"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={guestData.phone}
                      onChange={(e) => setGuestData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Enter phone number"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={guestData.address}
                      onChange={(e) => setGuestData(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="Enter address"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={guestData.city}
                      onChange={(e) => setGuestData(prev => ({ ...prev, city: e.target.value }))}
                      placeholder="Enter city"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={guestData.state}
                      onChange={(e) => setGuestData(prev => ({ ...prev, state: e.target.value }))}
                      placeholder="Enter state"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label htmlFor="specialRequests">Special Requests</Label>
                    <Input
                      id="specialRequests"
                      value={guestData.specialRequests}
                      onChange={(e) => setGuestData(prev => ({ ...prev, specialRequests: e.target.value }))}
                      placeholder="Any special requests or requirements"
                    />
                  </div>
                </div>
              </Card>

              {/* Booking Summary */}
              <Card className="p-6 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Final Booking Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Stay Period</span>
                    <span>{checkIn} to {checkOut} ({nights} nights)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Guests</span>
                    <span>{guests}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rooms</span>
                    <span>{selectedRooms.length}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount</span>
                    <span className="text-orange-600">{formatPrice(calculateTotal().total)}</span>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="max-w-4xl mx-auto mt-8">
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => {
                if (currentStep === 'room-selection') {
                  navigate('/');
                } else {
                  handlePreviousStep();
                }
              }}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              {currentStep === 'room-selection' ? 'Back to Home' : 'Previous'}
            </Button>

            {currentStep !== 'guest-details' ? (
              <Button
                onClick={handleNextStep}
                className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700"
              >
                Next Step
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleCompleteBooking}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                Complete Booking via WhatsApp
                <MessageCircle className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BookingFlow;