import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, Users, X, ArrowRight, ArrowLeft, Hotel, Bed } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import RoomCard from "./RoomCard";

// Room data with Supabase images
const ROOM_DATA = {
  "signature-270-glass-suite": {
    id: "signature-270-glass-suite",
    name: "Signature 270° Glass Suite",
    price: 18000,
    maxGuests: 2,
    maxRooms: 1,
    description: "Premium suite with 270-degree panoramic views and luxury amenities",
    type: "luxury",
    propertyType: "luxury" as const,
    features: ["Panoramic Glass Walls", "Premium Bedding", "Luxury Bath", "Mountain Views", "Free Breakfast", "Games Room Access"],
    image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/Signature%20270%20Glass%20Suite/20250722_0921_Meghalaya%20Getaway%20View_remix_01k0r405w4f66svm6nn0qdtxye%20(1).png",
    images: ["https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/Signature%20270%20Glass%20Suite/20250722_0921_Meghalaya%20Getaway%20View_remix_01k0r405w4f66svm6nn0qdtxye%20(1).png"]
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
  "6-bed-female-mixed-economy-dorm": {
    id: "6-bed-female-mixed-economy-dorm",
    name: "Bed in 6 Bed Female/Mixed Economy Dorm",
    price: 550,
    maxGuests: 1,
    maxRooms: 6,
    description: "Budget-friendly female/mixed dormitory with essential amenities",
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
    name: "Bed in 8 Bed Mixed Economy Dorm",
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
  const [currentStep, setCurrentStep] = useState<'room-selection' | 'booking-summary' | 'guest-details'>('room-selection');
  const [selectedRooms, setSelectedRooms] = useState<SelectedRoom[]>([]);
  const [addOns, setAddOns] = useState({
    breakfast: 0,
    dinnerVeg: 0,
    dinnerNonVeg: 0,
    transportation: false,
    itineraryPlanning: false,
  });

  const { toast } = useToast();
  const isMobile = useIsMobile();

  const roomsArray = Object.values(ROOM_DATA);
  const nights = initialData.checkIn && initialData.checkOut ? 
    Math.ceil((new Date(initialData.checkOut).getTime() - new Date(initialData.checkIn).getTime()) / (1000 * 3600 * 24)) : 1;

  const calculateTotal = () => {
    const roomTotal = selectedRooms.reduce((total, room) => {
      const isDorm = room.name.toLowerCase().includes('dorm');
      const basePrice = isDorm ? room.price * room.selection.guests : room.price * room.selection.rooms;
      return total + (basePrice * nights);
    }, 0);

    const addOnTotal = (addOns.breakfast * 150 + addOns.dinnerVeg * 300 + addOns.dinnerNonVeg * 300) * nights;
    const subtotal = roomTotal + addOnTotal;
    const gstAmount = Math.round(subtotal * 0.18);
    const total = subtotal + gstAmount;

    return { subtotal, gstAmount, total };
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

    const { subtotal, gstAmount, total } = calculateTotal();

    const bookingData = {
      checkIn: initialData.checkIn,
      checkOut: initialData.checkOut,
      guests: initialData.guests,
      nights,
      selectedRooms,
      totalAmount: total,
      gstAmount,
      subtotal,
      discountAmount: 0,
      couponCode: "",
      couponDiscount: 0,
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
        <div className="flex flex-col h-full max-h-[100vh] md:max-h-[95vh]">
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
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="p-2 text-gray-900 hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-900" />
              </Button>
              <DialogTitle className="text-xl md:text-2xl font-bold text-black">
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
            {isMobile && (
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
            {currentStep === 'room-selection' && (
              <div className="p-4 md:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {roomsArray.map((room) => (
                    <RoomCard
                      key={room.id}
                      room={room}
                      propertyType={room.propertyType}
                      onSelectRoom={() => handleRoomSelect(room.id)}
                      isLuxury={room.propertyType === 'luxury'}
                    />
                  ))}
                </div>
              </div>
            )}

            {currentStep === 'booking-summary' && (
              <div className="p-4 md:p-6 space-y-6">
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
                              ₹{room.type === 'dorm' ? room.price * room.selection.guests * nights : room.price * room.selection.rooms * nights}
                            </div>
                            <div className="text-sm text-gray-600">₹{room.price}/night</div>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="p-4 bg-white border border-gray-200">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium text-gray-900">Extra Breakfast</h4>
                            <p className="text-sm text-gray-600">₹150 per person per day</p>
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
                            <h4 className="font-medium text-gray-900">Dinner (Veg)</h4>
                            <p className="text-sm text-gray-600">₹300 per person per day</p>
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
                            <h4 className="font-medium text-gray-900">Dinner (Non-Veg)</h4>
                            <p className="text-sm text-gray-600">₹300 per person per day</p>
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
                    </div>
                  </div>
                </div>

                {/* Price Summary */}
                <Card className="p-4 bg-gray-50">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₹{calculateTotal().subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>GST (18%)</span>
                      <span>₹{calculateTotal().gstAmount}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>₹{calculateTotal().total}</span>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex-shrink-0 p-4 md:p-6 border-t bg-gray-50">
            {currentStep === 'room-selection' && (
              <Button
                onClick={handleNext}
                disabled={selectedRooms.length === 0}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-3 text-lg"
              >
                Next - Review Booking <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            )}

            {currentStep === 'booking-summary' && (
              <Button
                onClick={handleBookNow}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-3 text-lg"
              >
                Book Now <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedBookingModal;