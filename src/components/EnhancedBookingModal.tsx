import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Users, ArrowRight, ArrowLeft, Hotel, Bed, Home, IndianRupee } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import RoomCard from "./RoomCard";
import { useApp } from "@/contexts/AppContext";
import OptimizedLazyImage from "./OptimizedLazyImage";

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
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20MixedFemale%20Dorms/4.JPG",
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20MixedFemale%20Dorms/5.jpg",
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20MixedFemale%20Dorms/IMG_5161.png"
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
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/3.jpg",
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/4.jpg",
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/5.JPG",
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/6.JPG",
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/IMG_5160.png"
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
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/8%20Bed%20Mixed%20Dorms/4.jpg",
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/8%20Bed%20Mixed%20Dorms/5.jpg",
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/8%20Bed%20Mixed%20Dorms/6.jpg",
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/8%20Bed%20Mixed%20Dorms/8.jpg",
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/8%20Bed%20Mixed%20Dorms/9.jpg"
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
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Double%20Room/2.jpg",
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Double%20Room/3.JPG",
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Double%20Room/IMG_4077.jpg"
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
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Triple%20Room/2.jpg",
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Triple%20Room/3.jpg",
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Triple%20Room/5.jpg",
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Double%20Room/IMG_4077.jpg"
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
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/3.jpg",
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/4.jpg",
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/5.JPG",
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/6.JPG",
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/IMG_5160.png"
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
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/8%20Bed%20Mixed%20Dorms/4.jpg",
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/8%20Bed%20Mixed%20Dorms/5.jpg",
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/8%20Bed%20Mixed%20Dorms/6.jpg",
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/8%20Bed%20Mixed%20Dorms/8.jpg",
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/8%20Bed%20Mixed%20Dorms/9.jpg"
    ]
  }
};

interface EnhancedBookingModalProps {
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

const EnhancedBookingModal = ({ isOpen, onClose, initialData }: EnhancedBookingModalProps) => {
  const { formatPrice, currency } = useApp();
  // console.log("🎯 Enhanced Booking Modal opened with Transportation/Itinerary checkboxes!");
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

  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  // For tablet view, we want to use desktop layout. Only use mobile flow for actual mobile devices
  const [isActualMobile, setIsActualMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsActualMobile(window.innerWidth < 640); // sm breakpoint
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const roomsArray = Object.values(ROOM_DATA);
  const nights = initialData.checkIn && initialData.checkOut ? 
    Math.ceil((new Date(initialData.checkOut).getTime() - new Date(initialData.checkIn).getTime()) / (1000 * 3600 * 24)) : 1;

  const calculateTotal = () => {
    // Check if selected date is weekend (for USD/EUR pricing)
    const isWeekend = initialData.checkIn ? 
      [0, 6].includes(new Date(initialData.checkIn).getDay()) : false;
    
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

    if (validPromoCodes[promoCode.toUpperCase()]) {
      setPromoDiscount(validPromoCodes[promoCode.toUpperCase()]);
      setPromoApplied(true);
      toast({
        title: "Promo code applied!",
        description: `You got ${validPromoCodes[promoCode.toUpperCase()]}% discount`,
      });
    } else {
      toast({
        title: "Invalid promo code",
        description: "Please check your promo code and try again",
        variant: "destructive",
      });
    }
  };

  const removePromoCode = () => {
    setPromoCode('');
    setPromoDiscount(0);
    setPromoApplied(false);
    toast({
      title: "Promo code removed",
      description: "Discount has been removed from your booking",
    });
  };

  const handleRoomSelect = (roomId: string) => {
    const room = ROOM_DATA[roomId as keyof typeof ROOM_DATA];
    if (!room) return;

    const existingRoom = selectedRooms.find(r => r.id === roomId);
    if (existingRoom) {
      toast({
        title: "Room Already Selected",
        description: "This room is already in your selection",
        variant: "destructive"
      });
      return;
    }

    const newRoom: SelectedRoom = {
      id: room.id,
      name: room.name,
      price: room.price,
      type: room.type,
      selection: {
        guests: room.type === 'luxury' ? 2 : 1,
        rooms: room.type === 'dorm' ? 1 : 1
      }
    };

    setSelectedRooms(prev => [...prev, newRoom]);
    toast({
      title: "Room Added",
      description: `${room.name} has been added to your selection`,
    });
  };

  const handleNext = () => {
    if (currentStep === 'room-selection') {
      if (selectedRooms.length === 0) {
        toast({
          title: "No Room Selected",
          description: "Please select at least one room to continue",
          variant: "destructive"
        });
        return;
      }
      setCurrentStep('booking-summary');
    } else if (currentStep === 'booking-summary') {
      setCurrentStep('guest-details');
    }
  };

  const handlePrevious = () => {
    if (currentStep === 'guest-details') {
      setCurrentStep('booking-summary');
    } else if (currentStep === 'booking-summary') {
      setCurrentStep('room-selection');
    }
  };

  const handleBookNow = () => {
    if (selectedRooms.length === 0) {
      toast({
        title: "No Rooms Selected",
        description: "Please select at least one room",
        variant: "destructive"
      });
      return;
    }

    const { subtotal, discountAmount, afterDiscount, gstAmount, total } = calculateTotal();
    
    const bookingData = {
      checkIn: initialData.checkIn,
      checkOut: initialData.checkOut,
      guests: initialData.guests,
      nights,
      selectedRooms,
      totalAmount: total,
      gstAmount,
      subtotal,
      discountAmount,
      couponCode: promoCode,
      couponDiscount: promoDiscount,
      addOns
    };

    localStorage.setItem('xtsy_current_booking', JSON.stringify(bookingData));

    // Dispatch event to open guest details
    window.dispatchEvent(new CustomEvent('openGuestDetails', { 
      detail: bookingData 
    }));

    onClose();
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-full h-full max-w-none max-h-none md:max-w-7xl lg:max-w-[90vw] md:max-h-[95vh] md:h-auto bg-white border-0 p-0 overflow-hidden">
        <div className="flex flex-col h-full max-h-[100vh] md:max-h-[95vh] pb-safe-bottom">{/* Fixed layout structure with safe bottom */}
          {/* Header */}
          <div className="flex-shrink-0 p-4 md:p-6 border-b bg-gradient-to-r from-orange-50 to-red-50">
            <div className="flex items-center gap-3 mb-4">
              {currentStep !== 'room-selection' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePrevious}
                  className="p-2 text-gray-900 hover:bg-gray-100"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-900" />
                </Button>
              )}
              <DialogTitle className="text-lg md:text-xl font-bold text-black">
                {currentStep === 'room-selection' && 'Select Your Room'}
                {currentStep === 'booking-summary' && 'Booking Summary'}
                {currentStep === 'guest-details' && 'Guest Details'}
              </DialogTitle>
            </div>
            
            {/* Date selection */}
            <div className="bg-blue-100 rounded-lg p-3 text-center">
              <div className="text-black font-bold text-base">
                {initialData.checkIn && initialData.checkOut 
                  ? `${formatDate(initialData.checkIn)} → ${formatDate(initialData.checkOut)} (${nights} nights)`
                  : "Select your dates"
                }
              </div>
            </div>

            {/* Progress indicator */}
            {isActualMobile && (
              <div className="flex justify-center mt-4">
                <div className="flex space-x-2">
                  <div className={`w-3 h-3 rounded-full ${currentStep === 'room-selection' ? 'bg-orange-500' : 'bg-gray-300'}`} />
                  <div className={`w-3 h-3 rounded-full ${currentStep === 'booking-summary' ? 'bg-orange-500' : 'bg-gray-300'}`} />
                  <div className={`w-3 h-3 rounded-full ${currentStep === 'guest-details' ? 'bg-orange-500' : 'bg-gray-300'}`} />
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto min-h-0">
            {/* Mobile only: Multi-step flow */}
            {isActualMobile && (
              <>
                {currentStep === 'room-selection' && (
                  <div className="p-4 space-y-6 pb-40">
                    {/* Live the Shillong Vibe Hero Section - Mobile */}
                    <div className="relative h-32 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl overflow-hidden">
                      <div className="absolute inset-0 bg-black/20"></div>
                      <div className="relative h-full flex items-center justify-center text-center px-4">
                        <div>
                          <h2 className="text-lg font-bold text-white mb-1">Live the Shillong Vibe</h2>
                          <p className="text-white/90 text-xs">Experience the best of Meghalaya</p>
                        </div>
                      </div>
                    </div>

                    {/* Room Type Classifications - Mobile */}
                    <div className="space-y-6">
                      {/* XTSY Luxury */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Hotel className="h-5 w-5 text-orange-600" />
                          <h3 className="text-lg font-bold text-gray-900">XTSY Luxury</h3>
                          <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full">Premium</span>
                        </div>
                        <div className="space-y-3">
                          {roomsArray.filter(room => room.propertyType === 'luxury').map((room) => (
                            <MobileRoomSelectionCard key={room.id} room={room} selectedRooms={selectedRooms} setSelectedRooms={setSelectedRooms} nights={nights} formatPrice={formatPrice} />
                          ))}
                        </div>
                      </div>

                      {/* XTSY Travellers Hostel */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Users className="h-5 w-5 text-orange-600" />
                          <h3 className="text-lg font-bold text-gray-900">XTSY Travellers Hostel</h3>
                          <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full">Social</span>
                        </div>
                        <div className="space-y-3">
                          {roomsArray.filter(room => room.propertyType === 'hostel').map((room) => (
                            <MobileRoomSelectionCard key={room.id} room={room} selectedRooms={selectedRooms} setSelectedRooms={setSelectedRooms} nights={nights} formatPrice={formatPrice} />
                          ))}
                        </div>
                      </div>

                      {/* XTSY Economy */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Home className="h-5 w-5 text-orange-600" />
                          <h3 className="text-lg font-bold text-gray-900">XTSY Economy</h3>
                          <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full">Budget</span>
                        </div>
                        <div className="space-y-3">
                          {roomsArray.filter(room => room.propertyType === 'economy').map((room) => (
                            <MobileRoomSelectionCard key={room.id} room={room} selectedRooms={selectedRooms} setSelectedRooms={setSelectedRooms} nights={nights} formatPrice={formatPrice} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 'booking-summary' && (
                  <div className="p-4 md:p-6 space-y-6 pb-40">
                    {/* Selected Rooms */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Selected Rooms</h3>
                      <div className="space-y-3">
                        {selectedRooms.map((room, index) => (
                          <Card key={index} className="p-4">
                            <div className="flex justify-between items-center">
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
                          </Card>
                        ))}
                      </div>
                    </div>

                    {/* Add-on Services */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Add-on Services</h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                          <Card className="p-4 bg-white border border-gray-200">
                            <div className="flex justify-between items-center">
                              <div>
                                <h4 className="font-medium text-gray-900">Breakfast</h4>
                                <p className="text-sm text-gray-600">{formatPrice(calculateTotal().breakfastPrice)} per person per day</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => setAddOns(prev => ({ ...prev, breakfast: Math.max(0, prev.breakfast - 1) }))}
                                  className="bg-white text-black border-black hover:bg-gray-100"
                                >
                                  -
                                </Button>
                                <span className="w-8 text-center bg-white text-black font-bold border border-black rounded px-2 py-1">{addOns.breakfast}</span>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => setAddOns(prev => ({ ...prev, breakfast: prev.breakfast + 1 }))}
                                  className="bg-white text-black border-black hover:bg-gray-100"
                                >
                                  +
                                </Button>
                              </div>
                            </div>
                          </Card>

                          <Card className="p-4 bg-white border border-gray-200">
                            <div className="flex justify-between items-center">
                              <div>
                                <h4 className="font-medium text-gray-900">Dinner - Veg</h4>
                                <p className="text-sm text-gray-600">{formatPrice(calculateTotal().dinnerVegPrice)} per person per day</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => setAddOns(prev => ({ ...prev, dinnerVeg: Math.max(0, prev.dinnerVeg - 1) }))}
                                  className="bg-white text-black border-black hover:bg-gray-100"
                                >
                                  -
                                </Button>
                                <span className="w-8 text-center bg-white text-black font-bold border border-black rounded px-2 py-1">{addOns.dinnerVeg}</span>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => setAddOns(prev => ({ ...prev, dinnerVeg: prev.dinnerVeg + 1 }))}
                                  className="bg-white text-black border-black hover:bg-gray-100"
                                >
                                  +
                                </Button>
                              </div>
                            </div>
                          </Card>

                          <Card className="p-4 bg-white border border-gray-200">
                            <div className="flex justify-between items-center">
                              <div>
                                <h4 className="font-medium text-gray-900">Dinner - Non Veg</h4>
                                <p className="text-sm text-gray-600">{formatPrice(calculateTotal().dinnerNonVegPrice)} per person per day</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => setAddOns(prev => ({ ...prev, dinnerNonVeg: Math.max(0, prev.dinnerNonVeg - 1) }))}
                                  className="bg-white text-black border-black hover:bg-gray-100"
                                >
                                  -
                                </Button>
                                <span className="w-8 text-center bg-white text-black font-bold border border-black rounded px-2 py-1">{addOns.dinnerNonVeg}</span>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => setAddOns(prev => ({ ...prev, dinnerNonVeg: prev.dinnerNonVeg + 1 }))}
                                  className="bg-white text-black border-black hover:bg-gray-100"
                                >
                                  +
                                </Button>
                              </div>
                            </div>
                           </Card>

                          <Card className="p-4 bg-white border border-gray-200">
                            <div className="flex justify-between items-center">
                              <div>
                                <h4 className="font-medium text-gray-900">Transportation arrangement</h4>
                                <p className="text-sm text-gray-600">On request basis</p>
                              </div>
                              <div className="flex items-center">
                                <Checkbox 
                                  checked={addOns.transportation}
                                  onCheckedChange={(checked) => setAddOns(prev => ({ ...prev, transportation: checked as boolean }))}
                                />
                              </div>
                            </div>
                          </Card>

                          <Card className="p-4 bg-white border border-gray-200">
                            <div className="flex justify-between items-center">
                              <div>
                                <h4 className="font-medium text-gray-900">Itinerary planning</h4>
                                <p className="text-sm text-gray-600">On request basis</p>
                              </div>
                              <div className="flex items-center">
                                <Checkbox 
                                  checked={addOns.itinerary}
                                  onCheckedChange={(checked) => setAddOns(prev => ({ ...prev, itinerary: checked as boolean }))}
                                />
                              </div>
                            </div>
                          </Card>
                         </div>
                       </div>
                     </div>

                      {/* Mobile Price Summary - Enhanced */}
                     <Card className="p-4 bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
                       <h3 className="text-lg font-semibold text-orange-900 mb-4 flex items-center">
                         <IndianRupee className="h-5 w-5 mr-2" />
                         Price Summary
                       </h3>
                       
                       {/* Promocode Section */}
                       <div className="mb-4 p-3 bg-white rounded-lg border">
                         <label className="block text-sm font-medium text-gray-700 mb-2">Promo Code</label>
                         {!promoApplied ? (
                           <div className="flex gap-2">
                             <input
                               type="text"
                               value={promoCode}
                               onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                               placeholder="Enter promo code"
                               className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                             />
                             <Button 
                               onClick={applyPromoCode}
                               disabled={!promoCode.trim()}
                               size="sm"
                               className="bg-orange-500 hover:bg-orange-600 text-white"
                             >
                               Apply
                             </Button>
                           </div>
                         ) : (
                           <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-md p-2">
                             <div className="flex items-center gap-2">
                               <span className="text-green-600 font-medium text-sm">{promoCode}</span>
                               <span className="text-green-600 text-sm">({promoDiscount}% off)</span>
                             </div>
                             <Button 
                               onClick={removePromoCode}
                               size="sm"
                               variant="ghost"
                               className="text-red-500 hover:text-red-700 h-6 w-6 p-0"
                             >
                               ×
                             </Button>
                           </div>
                         )}
                       </div>

                       <div className="space-y-3 text-sm">
                         <div className="flex justify-between">
                           <span className="text-gray-700">Subtotal</span>
                            <span className="font-semibold text-gray-900">{formatPrice(calculateTotal().subtotal)}</span>
                         </div>
                         {promoApplied && (
                           <div className="flex justify-between text-green-600">
                             <span>Discount ({promoCode})</span>
                              <span className="font-semibold">-{formatPrice(calculateTotal().discountAmount)}</span>
                           </div>
                         )}
                         <div className="flex justify-between">
                           <span className="text-gray-700">GST ({calculateTotal().gstAmount > 0 ? '12-18%' : '0%'})</span>
                            <span className="font-semibold text-gray-900">{formatPrice(calculateTotal().gstAmount)}</span>
                         </div>
                         <Separator className="bg-orange-200" />
                         <div className="flex justify-between font-bold text-lg bg-white rounded-lg p-3 border border-orange-200">
                           <span className="text-orange-900">Total Amount</span>
                            <span className="text-orange-900">{formatPrice(calculateTotal().total)}</span>
                         </div>
                      </div>
                    </Card>

                    {/* Fixed bottom booking button for mobile */}
                    <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
                      <Button onClick={() => setCurrentStep('guest-details')} className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold text-lg py-3">
                        Book Now - {formatPrice(calculateTotal().total)}
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Desktop/Tablet: Side-by-side layout with proper room selection */}
            {!isActualMobile && (
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
                          <RoomSelectionCard key={room.id} room={room} selectedRooms={selectedRooms} setSelectedRooms={setSelectedRooms} nights={nights} formatPrice={formatPrice} />
                        ))}
                      </div>
                    </div>

                    {/* XTSY Travellers Hostel */}
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <Bed className="h-6 w-6 text-blue-600" />
                        <h3 className="text-xl font-bold text-gray-900">XTSY Travellers Hostel</h3>
                        <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded-full">Free Breakfast & Games Room</span>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                        {roomsArray.filter(room => room.propertyType === 'hostel').map((room) => (
                          <RoomSelectionCard key={room.id} room={room} selectedRooms={selectedRooms} setSelectedRooms={setSelectedRooms} nights={nights} formatPrice={formatPrice} />
                        ))}
                      </div>
                    </div>

                    {/* XTSY Economy */}
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <Users className="h-6 w-6 text-green-600" />
                        <h3 className="text-xl font-bold text-gray-900">XTSY Economy</h3>
                        <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded-full">Budget Friendly</span>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                        {roomsArray.filter(room => room.propertyType === 'economy').map((room) => (
                          <RoomSelectionCard key={room.id} room={room} selectedRooms={selectedRooms} setSelectedRooms={setSelectedRooms} nights={nights} formatPrice={formatPrice} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right side - Booking Summary */}
                <div className="w-96 bg-gray-50 border-l p-6 overflow-y-auto">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Booking Summary</h3>
                  
                  {/* Selected Rooms */}
                  <div className="mb-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Selected Rooms</h4>
                    {selectedRooms.length === 0 ? (
                      <p className="text-gray-600 text-sm">No rooms selected yet</p>
                    ) : (
                      <div className="space-y-3">
                        {selectedRooms.map((room, index) => (
                          <Card key={index} className="p-3">
                            <div className="space-y-2">
                              <h5 className="font-medium text-gray-900 text-sm">{room.name}</h5>
                              <p className="text-xs text-gray-600">
                                {room.type === 'dorm' ? `${room.selection.guests} beds` : `${room.selection.rooms} rooms`} × {nights} nights
                              </p>
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-600">{formatPrice(room.price)}/night</span>
                                <span className="font-bold text-gray-900">
                                  {formatPrice(room.type === 'dorm' ? room.price * room.selection.guests * nights : room.price * room.selection.rooms * nights)}
                                </span>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedRooms(prev => prev.filter((_, i) => i !== index))}
                                className="w-full text-xs bg-white text-red-600 border-red-200 hover:bg-red-50"
                              >
                                Remove
                              </Button>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Add-on Services */}
                  <div className="mb-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Add-on Services</h4>
                    <div className="space-y-3">
                      <Card className="p-3 bg-white border border-gray-200">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div>
                              <h5 className="font-medium text-gray-900 text-sm">Breakfast</h5>
                              <p className="text-xs text-gray-600">{formatPrice(calculateTotal().breakfastPrice)} per person per day</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => setAddOns(prev => ({ ...prev, breakfast: Math.max(0, prev.breakfast - 1) }))}
                              className="bg-white text-black border-black hover:bg-gray-100 h-8 w-8 p-0"
                            >
                              -
                            </Button>
                            <span className="w-8 text-center bg-white text-black font-bold border border-black rounded px-2 py-1 text-sm">{addOns.breakfast}</span>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => setAddOns(prev => ({ ...prev, breakfast: prev.breakfast + 1 }))}
                              className="bg-white text-black border-black hover:bg-gray-100 h-8 w-8 p-0"
                            >
                              +
                            </Button>
                          </div>
                        </div>
                      </Card>

                      <Card className="p-3 bg-white border border-gray-200">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div>
                              <h5 className="font-medium text-gray-900 text-sm">Dinner - Veg</h5>
                              <p className="text-xs text-gray-600">{formatPrice(calculateTotal().dinnerVegPrice)} per person per day</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => setAddOns(prev => ({ ...prev, dinnerVeg: Math.max(0, prev.dinnerVeg - 1) }))}
                              className="bg-white text-black border-black hover:bg-gray-100 h-8 w-8 p-0"
                            >
                              -
                            </Button>
                            <span className="w-8 text-center bg-white text-black font-bold border border-black rounded px-2 py-1 text-sm">{addOns.dinnerVeg}</span>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => setAddOns(prev => ({ ...prev, dinnerVeg: prev.dinnerVeg + 1 }))}
                              className="bg-white text-black border-black hover:bg-gray-100 h-8 w-8 p-0"
                            >
                              +
                            </Button>
                          </div>
                        </div>
                      </Card>

                      <Card className="p-3 bg-white border border-gray-200">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div>
                              <h5 className="font-medium text-gray-900 text-sm">Dinner - Non Veg</h5>
                              <p className="text-xs text-gray-600">{formatPrice(calculateTotal().dinnerNonVegPrice)} per person per day</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => setAddOns(prev => ({ ...prev, dinnerNonVeg: Math.max(0, prev.dinnerNonVeg - 1) }))}
                              className="bg-white text-black border-black hover:bg-gray-100 h-8 w-8 p-0"
                            >
                              -
                            </Button>
                            <span className="w-8 text-center bg-white text-black font-bold border border-black rounded px-2 py-1 text-sm">{addOns.dinnerNonVeg}</span>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => setAddOns(prev => ({ ...prev, dinnerNonVeg: prev.dinnerNonVeg + 1 }))}
                              className="bg-white text-black border-black hover:bg-gray-100 h-8 w-8 p-0"
                            >
                              +
                            </Button>
                          </div>
                        </div>
                       </Card>

                      <Card className="p-3 bg-white border border-gray-200">
                        <div className="flex justify-between items-center">
                          <div>
                            <h5 className="font-medium text-gray-900 text-sm">Transportation arrangement</h5>
                            <p className="text-xs text-gray-600">On request basis</p>
                          </div>
                          <div className="flex items-center">
                            <Checkbox 
                              checked={addOns.transportation}
                              onCheckedChange={(checked) => setAddOns(prev => ({ ...prev, transportation: checked as boolean }))}
                            />
                          </div>
                        </div>
                      </Card>

                      <Card className="p-3 bg-white border border-gray-200">
                        <div className="flex justify-between items-center">
                          <div>
                            <h5 className="font-medium text-gray-900 text-sm">Itinerary planning</h5>
                            <p className="text-xs text-gray-600">On request basis</p>
                          </div>
                          <div className="flex items-center">
                            <Checkbox 
                              checked={addOns.itinerary}
                              onCheckedChange={(checked) => setAddOns(prev => ({ ...prev, itinerary: checked as boolean }))}
                            />
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>

                  {/* Price Summary */}
                  <Card className="p-4 bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
                    <h4 className="text-lg font-semibold text-orange-900 mb-3 flex items-center">
                      <IndianRupee className="h-5 w-5 mr-2" />
                      Price Summary
                    </h4>
                    
                    {/* Promocode Section */}
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg border">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Promo Code</label>
                      {!promoApplied ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                            placeholder="Enter promo code"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                          <Button 
                            onClick={applyPromoCode}
                            disabled={!promoCode.trim()}
                            size="sm"
                            className="bg-orange-500 hover:bg-orange-600 text-white"
                          >
                            Apply
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-md p-2">
                          <div className="flex items-center gap-2">
                            <span className="text-green-600 font-medium text-sm">{promoCode}</span>
                            <span className="text-green-600 text-sm">({promoDiscount}% off)</span>
                          </div>
                          <Button 
                            onClick={removePromoCode}
                            size="sm"
                            variant="ghost"
                            className="text-red-500 hover:text-red-700 h-6 w-6 p-0"
                          >
                            ×
                          </Button>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-700">Subtotal</span>
                        <span className="font-semibold text-gray-900">{formatPrice(calculateTotal().subtotal)}</span>
                      </div>
                      {promoApplied && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount ({promoCode})</span>
                          <span className="font-semibold">-{formatPrice(calculateTotal().discountAmount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-700">{currency.code === 'INR' ? 'GST' : 'Tax (as per India)'} ({calculateTotal().gstAmount > 0 ? '12-18%' : '0%'})</span>
                        <span className="font-semibold text-gray-900">{formatPrice(calculateTotal().gstAmount)}</span>
                      </div>
                      <Separator className="bg-orange-200" />
                      <div className="flex justify-between font-bold text-lg bg-white rounded-lg p-3 border border-orange-200">
                        <span className="text-orange-900">Total Amount</span>
                        <span className="text-orange-900">{formatPrice(calculateTotal().total)}</span>
                      </div>
                    </div>
                    <Button
                      onClick={handleBookNow}
                      disabled={selectedRooms.length === 0}
                      className="w-full mt-4 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-3 text-lg rounded-lg shadow-lg"
                    >
                      Book Now
                    </Button>
                  </Card>
                </div>
              </div>
            )}
          </div>

          {/* Footer - Only for actual mobile devices */}
          {isActualMobile && (
            <div className="flex-shrink-0 p-4 border-t bg-white shadow-lg fixed bottom-0 left-0 right-0 z-50">
              {currentStep === 'room-selection' && (
                <Button
                  onClick={handleNext}
                  disabled={selectedRooms.length === 0}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-3 text-lg rounded-lg"
                >
                  Next - Review Booking <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              )}

              {currentStep === 'booking-summary' && (
                <Button
                  onClick={handleBookNow}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-3 text-lg rounded-lg"
                >
                  Book Now <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Room Selection Card Component for Desktop
interface RoomSelectionCardProps {
  room: any;
  selectedRooms: SelectedRoom[];
  setSelectedRooms: React.Dispatch<React.SetStateAction<SelectedRoom[]>>;
  nights: number;
  formatPrice: (price: number) => string;
}

const RoomSelectionCard: React.FC<RoomSelectionCardProps> = ({ room, selectedRooms, setSelectedRooms, nights, formatPrice }) => {
  const [quantity, setQuantity] = useState(0);
  const { toast } = useToast();

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
    
    if (newQuantity === 0) {
      // Remove room from selection
      setSelectedRooms(prev => prev.filter(r => r.id !== room.id));
    } else {
      // Add or update room selection
      const roomSelection: SelectedRoom = {
        id: room.id,
        name: room.name,
        price: room.price,
        type: room.type,
        selection: {
          guests: room.type === 'dorm' ? newQuantity : newQuantity,
          rooms: room.type === 'dorm' ? 1 : newQuantity
        }
      };

      setSelectedRooms(prev => {
        const existingIndex = prev.findIndex(r => r.id === room.id);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = roomSelection;
          return updated;
        } else {
          return [...prev, roomSelection];
        }
      });
    }
  };

  const currentSelection = selectedRooms.find(r => r.id === room.id);
  const currentQuantity = currentSelection ? 
    (room.type === 'dorm' ? currentSelection.selection.guests : currentSelection.selection.rooms) : 0;

  return (
    <Card className="overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="relative h-48">
        <OptimizedLazyImage 
          src={room.image} 
          alt={room.name}
          className="w-full h-full object-cover"
          threshold={0.1}
        />
        <div className="absolute top-2 right-2">
          <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium">
            {formatPrice(room.price)}/night
          </span>
        </div>
      </div>
      
      <CardContent className="p-4">
        <h4 className="font-semibold text-gray-900 mb-2">{room.name}</h4>
        <p className="text-sm text-gray-600 mb-3">{room.description}</p>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {room.features.slice(0, 3).map((feature: string, index: number) => (
            <span key={index} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
              {feature}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {room.type === 'dorm' ? 'Beds' : 'Rooms'}
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleQuantityChange(Math.max(0, currentQuantity - 1))}
              className="bg-white text-black border-black hover:bg-gray-100 h-8 w-8 p-0"
            >
              -
            </Button>
            <span className="w-8 text-center bg-white text-black font-bold border border-black rounded px-2 py-1 text-sm">
              {currentQuantity}
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleQuantityChange(currentQuantity + 1)}
              className="bg-white text-black border-black hover:bg-gray-100 h-8 w-8 p-0"
            >
              +
            </Button>
          </div>
        </div>
        
        {currentQuantity > 0 && (
          <div className="mt-3 pt-3 border-t">
            <div className="flex justify-between text-sm">
              <span>Total for {nights} nights:</span>
              <span className="font-bold">
                {formatPrice(room.type === 'dorm' ? room.price * currentQuantity * nights : room.price * currentQuantity * nights)}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Mobile Room Selection Card Component
interface MobileRoomSelectionCardProps {
  room: any;
  selectedRooms: SelectedRoom[];
  setSelectedRooms: React.Dispatch<React.SetStateAction<SelectedRoom[]>>;
  nights: number;
  formatPrice: (price: number) => string;
}

const MobileRoomSelectionCard: React.FC<MobileRoomSelectionCardProps> = ({ room, selectedRooms, setSelectedRooms, nights, formatPrice }) => {
  const { toast } = useToast();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity === 0) {
      // Remove room from selection
      setSelectedRooms(prev => prev.filter(r => r.id !== room.id));
    } else {
      // Add or update room selection
      const roomSelection: SelectedRoom = {
        id: room.id,
        name: room.name,
        price: room.price,
        type: room.type,
        selection: {
          guests: room.type === 'dorm' ? newQuantity : newQuantity,
          rooms: room.type === 'dorm' ? 1 : newQuantity
        }
      };

      setSelectedRooms(prev => {
        const existingIndex = prev.findIndex(r => r.id === room.id);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = roomSelection;
          return updated;
        } else {
          return [...prev, roomSelection];
        }
      });
    }
  };

  const currentSelection = selectedRooms.find(r => r.id === room.id);
  const currentQuantity = currentSelection ? 
    (room.type === 'dorm' ? currentSelection.selection.guests : currentSelection.selection.rooms) : 0;

  return (
    <Card className="overflow-hidden border border-gray-200">
      <div className="flex gap-3 p-3">
        {/* Room Image */}
        <div className="w-20 h-20 flex-shrink-0">
          <OptimizedLazyImage 
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
              onClick={() => handleQuantityChange(Math.max(0, currentQuantity - 1))}
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
            <div className="text-xs text-center font-bold text-gray-900">
              {formatPrice(room.type === 'dorm' ? room.price * currentQuantity * nights : room.price * currentQuantity * nights)}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default EnhancedBookingModal;
