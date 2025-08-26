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

  const roomsArray = Object.values(ROOM_DATA);
  const nights = initialData.checkIn && initialData.checkOut ? 
    Math.ceil((new Date(initialData.checkOut).getTime() - new Date(initialData.checkIn).getTime()) / (1000 * 3600 * 24)) : 1;

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
    return totalAccommodated >= initialData.guests;
  };

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
        return sum + room.selection.rooms; // For private rooms, assume 1 bed per room (can be adjusted)
      }
    }, 0);
    
    // Check eligibility conditions for specific promo codes
    if (code === 'XTSY10') {
      // Condition: Min 4 guests, 4 beds, 2+ nights
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
      // Condition: Min 2 guests, 2+ nights
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
      // Condition: Min 2 guests, 3+ nights
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

    setPromoDiscount((validPromoCodes as any)[code]);
    setPromoApplied(true);
    toast({
      title: "Promo code applied!",
      description: `${(validPromoCodes as any)[code]}% discount applied to your booking`,
    });
  };

  const handleRoomSelection = (room: any) => {
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
      
      // Check if guest requirement is met
      if (!isGuestRequirementMet()) {
        const totalAccommodated = getTotalAccommodatedGuests();
        toast({
          title: "Insufficient Accommodation",
          description: `You need accommodation for ${initialData.guests} guests but only selected ${totalAccommodated} beds/spaces. Please add more rooms or beds.`,
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

    // Check if guest requirement is met
    if (!isGuestRequirementMet()) {
      const totalAccommodated = getTotalAccommodatedGuests();
      toast({
        title: "Insufficient Accommodation",
        description: `You need accommodation for ${initialData.guests} guests but only selected ${totalAccommodated} beds/spaces. Please add more rooms or beds.`,
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
        <div className="flex flex-col h-full max-h-[100dvh] md:max-h-[95vh]">
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
            
            {/* Date selection with guest info */}
            <div className="bg-blue-100 rounded-lg p-3 text-center">
              <div className="text-black font-bold text-base">
                {initialData.checkIn && initialData.checkOut 
                  ? `${formatDate(initialData.checkIn)} → ${formatDate(initialData.checkOut)} (${nights} nights)`
                  : "Select your dates"
                }
              </div>
              <div className="text-sm text-blue-700 mt-1">
                {initialData.guests} {initialData.guests === 1 ? 'Guest' : 'Guests'} • Need {getTotalAccommodatedGuests()}/{initialData.guests} beds selected
                {!isGuestRequirementMet() && (
                  <span className="text-red-600 font-semibold"> - Need more beds!</span>
                )}
              </div>
            </div>

            {/* Progress indicator */}
            <div className="flex justify-center mt-4">
              <div className="flex space-x-2">
                <div className={`w-3 h-3 rounded-full ${currentStep === 'room-selection' ? 'bg-orange-500' : 'bg-gray-300'}`} />
                <div className={`w-3 h-3 rounded-full ${currentStep === 'booking-summary' ? 'bg-orange-500' : 'bg-gray-300'}`} />
                <div className={`w-3 h-3 rounded-full ${currentStep === 'guest-details' ? 'bg-orange-500' : 'bg-gray-300'}`} />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto min-h-0" style={{ maxHeight: 'calc(100dvh - 140px)' }}>
            {currentStep === 'room-selection' && (
              <div className="p-6 space-y-6">
                {/* Live the Shillong Vibe Hero Section */}
                <div className="relative h-32 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl overflow-hidden">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="relative h-full flex items-center justify-center text-center px-4">
                    <div>
                      <h2 className="text-lg font-bold text-white mb-1">Live the Shillong Vibe</h2>
                      <p className="text-white/90 text-xs">Experience the best of Meghalaya</p>
                    </div>
                  </div>
                </div>

                {/* Room Type Classifications */}
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
                        <MobileRoomSelectionCard key={room.id} room={room} selectedRooms={selectedRooms} setSelectedRooms={setSelectedRooms} nights={nights} formatPrice={formatPrice} initialGuests={initialData.guests} />
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
                        <MobileRoomSelectionCard key={room.id} room={room} selectedRooms={selectedRooms} setSelectedRooms={setSelectedRooms} nights={nights} formatPrice={formatPrice} initialGuests={initialData.guests} />
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
                        <MobileRoomSelectionCard key={room.id} room={room} selectedRooms={selectedRooms} setSelectedRooms={setSelectedRooms} nights={nights} formatPrice={formatPrice} initialGuests={initialData.guests} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 'booking-summary' && (
              <div className="p-6 space-y-6">
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

                {/* Add-ons */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Add-ons</h3>
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
                </div>

                {/* Promo Code */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Promo Code</h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter promo code"
                      className="flex-1 px-3 py-2 border rounded-lg"
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
                </div>

                {/* Price Summary */}
                <Card className="p-4 bg-gray-50">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Summary</h3>
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
                    <div className="flex justify-between">
                      <span>GST</span>
                      <span>{formatPrice(calculateTotal().gstAmount)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-orange-900">{formatPrice(calculateTotal().total)}</span>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {currentStep === 'guest-details' && (
              <div className="p-6">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Almost Done!</h3>
                  <p className="text-gray-600 mb-6">Click below to complete your booking via WhatsApp</p>
                  <Button
                    onClick={handleBookNow}
                    disabled={!isGuestRequirementMet()}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-3 text-lg rounded-lg disabled:opacity-50"
                  >
                    {!isGuestRequirementMet() ? `Need ${initialData.guests - getTotalAccommodatedGuests()} More Beds` : "Complete Booking via WhatsApp"} <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Fixed bottom navigation */}
          {currentStep !== 'guest-details' && (
            <div className="flex-shrink-0 p-4 border-t bg-white">
              {currentStep === 'room-selection' && (
                <Button
                  onClick={handleNext}
                  disabled={!isGuestRequirementMet()}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-3 text-lg rounded-lg disabled:opacity-50"
                >
                  {!isGuestRequirementMet() ? `Need ${initialData.guests - getTotalAccommodatedGuests()} More Beds` : "Continue"} <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              )}
              {currentStep === 'booking-summary' && (
                <Button
                  onClick={handleNext}
                  disabled={!isGuestRequirementMet()}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-3 text-lg rounded-lg disabled:opacity-50"
                >
                  {!isGuestRequirementMet() ? `Need ${initialData.guests - getTotalAccommodatedGuests()} More Beds` : "Book Now"} <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Mobile Room Selection Card Component
interface MobileRoomSelectionCardProps {
  room: any;
  selectedRooms: SelectedRoom[];
  setSelectedRooms: React.Dispatch<React.SetStateAction<SelectedRoom[]>>;
  nights: number;
  formatPrice: (price: number) => string;
  initialGuests: number;
}

const MobileRoomSelectionCard: React.FC<MobileRoomSelectionCardProps> = ({ room, selectedRooms, setSelectedRooms, nights, formatPrice, initialGuests }) => {
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

export default EnhancedBookingModal;