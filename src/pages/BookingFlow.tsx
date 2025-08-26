
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Users, Calendar, MapPin, User, CreditCard, Phone } from 'lucide-react';
import { BookingSummary } from '@/components/BookingSummary';
import FastRoomCard from '@/components/FastRoomCard';
import GuestDetails from '@/components/GuestDetails';
import UPIPaymentModal from '@/components/UPIPaymentModal';
import { useScreenSize } from '@/hooks/use-mobile';
import { toast } from 'sonner';
import { differenceInDays, parseISO } from 'date-fns';
import Header from '@/components/Header';
import { ROOM_DATA, XTSY270_DATA } from '@/data/rooms/xtsy270';
import { useApp } from '@/contexts/AppContext';

interface Room {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  amenities: string[];
  type: 'dorm' | 'private';
  maxGuests: number;
  propertyType: string;
  maxRooms?: number; // Available beds/rooms for selection
  images?: string[];
}

interface SelectedRoom {
  id: string;
  name: string;
  price: number;
  type: 'dorm' | 'private';
  selection: {
    guests: number;
    rooms: number;
  };
}

// All available rooms from the home page with precise pricing and capacity
const ALL_ROOMS_DATA: { [key: string]: Room } = {
  // XTSY Luxury
  'xtsy-270': {
    id: 'xtsy-270',
    name: '270° Panorama Glass Ensuite',
    price: 18000,
    image: XTSY270_DATA.image,
    description: XTSY270_DATA.description,
    amenities: XTSY270_DATA.features,
    type: 'private',
    maxGuests: 2,
    propertyType: 'luxury',
    maxRooms: 1,
    images: XTSY270_DATA.images || [XTSY270_DATA.image]
  },
  
  // XTSY Travellers Hostel
  '4-bed-female-only-dorm': {
    id: '4-bed-female-only-dorm',
    name: 'Bed in 4 Bed Female Only Dormitory',
    price: 850,
    image: 'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20Female%20Only%20Dorms/1.jpg',
    description: 'Female-only dormitory with modern amenities and comfortable beds',
    amenities: ['Female only', 'Attached bathroom', 'Wi-Fi', 'Locker', 'Common area', 'Reading lights', 'Power outlets', 'Premium Breakfast'],
    type: 'dorm',
    maxGuests: 1, // Per bed
    propertyType: 'hostel',
    maxRooms: 4, // 4 beds available
    images: [
      'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20Female%20Only%20Dorms/1.jpg',
      'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20Female%20Only%20Dorms/2.jpg',
      'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20Female%20Only%20Dorms/3.jpg',
      'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20Female%20Only%20Dorms/4.JPG',
      'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20Female%20Only%20Dorms/5.JPG',
      'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20Female%20Only%20Dorms/6.JPG',
      'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20Female%20Only%20Dorms/7.JPG',
      'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20Female%20Only%20Dorms/IMG_5161.png'
    ]
  },
  
  '4-bed-mixed-female-dorm': {
    id: '4-bed-mixed-female-dorm',
    name: 'Bed in 4 Bed Mixed Dormitory',
    price: 800,
    image: 'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20MixedFemale%20Dorms/3.jpg',
    description: 'Mixed dormitory with shared facilities and social atmosphere',
    amenities: ['Mixed', 'Attached bathroom', 'Wi-Fi', 'Locker', 'Common area', 'Reading lights', 'Power outlets', 'Premium Breakfast'],
    type: 'dorm',
    maxGuests: 1, // Per bed
    propertyType: 'hostel',
    maxRooms: 4, // 4 beds available
    images: [
      'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20MixedFemale%20Dorms/3.jpg',
      'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20MixedFemale%20Dorms/4.JPG',
      'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20MixedFemale%20Dorms/5.jpg',
      'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20MixedFemale%20Dorms/IMG_5161.png'
    ]
  },
  
  '6-bed-mixed-female-dorm': {
    id: '6-bed-mixed-female-dorm',
    name: 'Bed in 6 Bed Female Only Dormitory',
    price: 700,
    image: 'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/1.JPG',
    description: 'Spacious mixed or female dormitory with modern amenities',
    amenities: ['Mixed/Female', 'Attached bathroom', 'Wi-Fi', 'Locker', 'Common area', 'Reading lights', 'Power outlets', 'Premium Breakfast'],
    type: 'dorm',
    maxGuests: 1, // Per bed
    propertyType: 'hostel',
    maxRooms: 6, // 6 beds available
    images: [
      'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/1.JPG',
      'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/3.jpg',
      'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/4.jpg',
      'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/5.JPG',
      'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/6.JPG',
      'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/IMG_5160.png'
    ]
  },

  // Add the missing room from home page
  '6-bed-mixed-dorm': {
    id: '6-bed-mixed-dorm',
    name: 'Bed in 6 Bed Mixed Dormitory',
    price: 700,
    image: 'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/1.JPG',
    description: 'Spacious mixed dormitory with modern amenities',
    amenities: ['Mixed', 'Attached bathroom', 'Wi-Fi', 'Locker', 'Common area', 'Reading lights', 'Power outlets', 'Premium Breakfast'],
    type: 'dorm',
    maxGuests: 1, // Per bed
    propertyType: 'hostel',
    maxRooms: 6, // 6 beds available
    images: [
      'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/1.JPG',
      'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/3.jpg',
      'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/4.jpg',
      'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/5.JPG',
      'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/6.JPG',
      'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/IMG_5160.png'
    ]
  },
  
  'king-double-room': {
    id: 'king-double-room',
    name: 'King Double Room',
    price: 3200,
    image: 'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Double%20Room/1.jpg',
    description: 'Spacious private room with king bed for two guests',
    amenities: ['King bed', 'Valley view', 'Attached bath', 'Wi-Fi', 'Premium amenities', 'Mini fridge', 'Premium Breakfast'],
    type: 'private',
    maxGuests: 2, // Max 2 guests per room
    propertyType: 'hostel',
    maxRooms: 2, // 2 rooms available
    images: [
      'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Double%20Room/1.jpg',
      'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Double%20Room/2.jpg',
      'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Double%20Room/3.JPG',
      'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Double%20Room/IMG_4077.jpg'
    ]
  },
  
  'king-triple-room': {
    id: 'king-triple-room',
    name: 'King Triple Room',
    price: 4200,
    image: 'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Triple%20Room/1.jpg',
    description: 'Luxurious private room accommodating up to three guests',
    amenities: ['King bed + extra bed', 'Panoramic view', 'Attached bath', 'Wi-Fi', 'Premium amenities', 'Mini fridge', 'Premium Breakfast'],
    type: 'private',
    maxGuests: 3,
    propertyType: 'hostel',
    maxRooms: 1, // 1 room available
    images: [
      'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Triple%20Room/1.jpg',
      'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Triple%20Room/2.jpg',
      'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Triple%20Room/3.jpg',
      'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Triple%20Room/5.jpg',
      'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Double%20Room/IMG_4077.jpg'
    ]
  },
  
  // XTSY Economy
  '6-bed-mixed-economy-dorm': {
    id: '6-bed-mixed-economy-dorm',
    name: 'Bed in 6 Bed Mixed Dormitory',
    price: 550,
    image: 'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/1.JPG',
    description: 'Budget-friendly mixed dormitory with essential amenities',
    amenities: ['Mixed/Female', 'AC', 'Reading lights', 'Lockers', 'Budget Friendly'],
    type: 'dorm',
    maxGuests: 1, // Per bed
    propertyType: 'economy',
    maxRooms: 6, // 6 beds available
    images: [
      'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/1.JPG',
      'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/3.jpg',
      'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/4.jpg',
      'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/5.JPG',
      'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/6.JPG',
      'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/IMG_5160.png'
    ]
  },
  
  '8-bed-mixed-economy-dorm': {
    id: '8-bed-mixed-economy-dorm',
    name: 'Bed in 8 Bed Mixed Dormitory',
    price: 450,
    image: 'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/8%20Bed%20Mixed%20Dorms/3.jpg',
    description: 'Most economical option for backpackers and budget travelers',
    amenities: ['Mixed', 'AC', 'Reading lights', 'Lockers', 'Budget Friendly'],
    type: 'dorm',
    maxGuests: 1, // Per bed
    propertyType: 'economy',
    maxRooms: 8, // 8 beds available
    images: [
      'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/8%20Bed%20Mixed%20Dorms/3.jpg',
      'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/8%20Bed%20Mixed%20Dorms/4.jpg',
      'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/8%20Bed%20Mixed%20Dorms/5.jpg',
      'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/8%20Bed%20Mixed%20Dorms/6.jpg',
      'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/8%20Bed%20Mixed%20Dorms/8.jpg',
      'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/8%20Bed%20Mixed%20Dorms/9.jpg'
    ]
  }
};

export default function BookingFlow() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { formatPrice } = useApp();
  const [currentStep, setCurrentStep] = useState<'rooms' | 'guest' | 'payment'>('rooms');
  const [selectedRooms, setSelectedRooms] = useState<SelectedRoom[]>([]);
  const [guestDetails, setGuestDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialRequests: ''
  });
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [showUPIModal, setShowUPIModal] = useState(false);
  const screenSize = useScreenSize();
  const isMobileView = screenSize === 'mobile';
  const isTabletView = screenSize === 'tablet';
  
  const preSelectedRoom = searchParams.get('room');
  const preSelectedProperty = searchParams.get('property');
  
  // Extract booking parameters from URL
  const urlCheckIn = searchParams.get('checkIn') || new Date().toISOString().split('T')[0];
  const urlCheckOut = searchParams.get('checkOut') || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const urlGuests = parseInt(searchParams.get('guests') || '4');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | null>(null);
  
  const [bookingDates, setBookingDates] = useState({
    checkIn: urlCheckIn,
    checkOut: urlCheckOut,
    guests: urlGuests
  });

  // Calculate nights from dates
  const nights = React.useMemo(() => {
    try {
      return differenceInDays(parseISO(bookingDates.checkOut), parseISO(bookingDates.checkIn));
    } catch {
      return 1;
    }
  }, [bookingDates.checkIn, bookingDates.checkOut]);

  const roomsArray: Room[] = Object.values(ALL_ROOMS_DATA);

  // Pre-select room immediately when params are available
  useEffect(() => {
    if (preSelectedRoom && preSelectedProperty) {
      try {
        const room = ALL_ROOMS_DATA[preSelectedRoom as keyof typeof ALL_ROOMS_DATA];
        if (room && room.propertyType === preSelectedProperty) {
          setSelectedRooms([{
            id: room.id,
            name: room.name,
            price: room.price,
            type: room.type,
            selection: {
              guests: room.type === 'dorm' ? 1 : room.maxGuests,
              rooms: 0 // Start with 0 beds/rooms selected
            }
          }]);
        }
      } catch (error) {
        console.error('Error pre-selecting room:', error);
      }
    }
  }, [preSelectedRoom, preSelectedProperty]);

  const handleRoomSelect = React.useCallback((roomId: string) => {
    console.log('Room select called for:', roomId);
    setSelectedRooms(prev => {
      const room = ALL_ROOMS_DATA[roomId as keyof typeof ALL_ROOMS_DATA];
      const isSelected = prev.find(r => r.id === roomId);

      console.log('Room data:', room);
      console.log('Is selected:', !!isSelected);

      if (isSelected) {
        console.log('Removing room from selection');
        return prev.filter(r => r.id !== roomId);
      } else {
        console.log('Adding room to selection');
        const newRoom = {
          id: room.id,
          name: room.name,
          price: room.price,
          type: room.type,
          selection: {
            guests: room.type === 'dorm' ? 1 : room.maxGuests,
            rooms: 0 // Start with 0 beds/rooms selected
          }
        };
        console.log('New room object:', newRoom);
        return [...prev, newRoom];
      }
    });
  }, []);

  const handleGuestChange = React.useCallback((roomId: string, guests: number) => {
    console.log('Guest change called for room:', roomId, 'guests:', guests);
    setSelectedRooms(prev => {
      const existingRoom = prev.find(room => room.id === roomId);
      
      if (existingRoom) {
        // Update existing room
        return prev.map(room => {
          if (room.id === roomId) {
            const updated = { ...room, selection: { ...room.selection, guests } };
            console.log('Updated existing room with guests:', updated);
            return updated;
          }
          return room;
        });
      } else {
        // Auto-add room if it doesn't exist
        const roomData = ALL_ROOMS_DATA[roomId as keyof typeof ALL_ROOMS_DATA];
        if (roomData) {
          const newRoom = {
            id: roomData.id,
            name: roomData.name,
            price: roomData.price,
            type: roomData.type,
            selection: {
              guests,
              rooms: 0
            }
          };
          console.log('Auto-added room with guests:', newRoom);
          return [...prev, newRoom];
        }
        return prev;
      }
    });
  }, []);

  const handleRoomChange = React.useCallback((roomId: string, rooms: number) => {
    console.log('Room change called for room:', roomId, 'rooms:', rooms);
    setSelectedRooms(prev => {
      const existingRoom = prev.find(room => room.id === roomId);
      
      if (existingRoom) {
        // Update existing room
        return prev.map(room => {
          if (room.id === roomId) {
            const updated = { ...room, selection: { ...room.selection, rooms } };
            console.log('Updated existing room with room count:', updated);
            return updated;
          }
          return room;
        });
      } else if (rooms > 0) {
        // Auto-add room if it doesn't exist and rooms > 0
        const roomData = ALL_ROOMS_DATA[roomId as keyof typeof ALL_ROOMS_DATA];
        if (roomData) {
          const newRoom = {
            id: roomData.id,
            name: roomData.name,
            price: roomData.price,
            type: roomData.type,
            selection: {
              guests: roomData.type === 'dorm' ? 1 : roomData.maxGuests,
              rooms
            }
          };
          console.log('Auto-added room with room count:', newRoom);
          return [...prev, newRoom];
        }
      }
      return prev;
    });
  }, []);

  // Validate guest accommodation
  const validateGuestAccommodation = () => {
    if (selectedRooms.length === 0) return false;
    
    const totalAccommodatedGuests = selectedRooms.reduce((total, room) => {
      if (room.type === 'dorm') {
        // Each bed can accommodate 1 guest
        return total + room.selection.rooms;
      } else {
        // Each private room can accommodate maxGuests
        const roomData = ALL_ROOMS_DATA[room.id];
        return total + (room.selection.rooms * roomData.maxGuests);
      }
    }, 0);
    
    return totalAccommodatedGuests >= bookingDates.guests;
  };

  const handleNext = () => {
    if (currentStep === 'rooms') {
      if (selectedRooms.length === 0) {
        toast.error('Please select at least one room or bed');
        return;
      }
      
      // Validate guest accommodation
      if (!validateGuestAccommodation()) {
        toast.error(`Please select enough beds/rooms to accommodate all ${bookingDates.guests} guests`);
        return;
      }
      
      setShowGuestModal(true);
    } else if (currentStep === 'guest') {
      if (!guestDetails.firstName || !guestDetails.email) {
        toast.error('Please fill in your details');
        return;
      }
      setCurrentStep('payment');
    } else if (currentStep === 'payment') {
      if (!paymentMethod) {
        toast.error('Please select a payment method');
        return;
      }

      if (paymentMethod === 'upi') {
        setShowUPIModal(true);
      } else {
        toast.success('Payment processed successfully!');
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep === 'guest') {
      setCurrentStep('rooms');
    } else if (currentStep === 'payment') {
      setCurrentStep('guest');
    }
  };

  const handlePayment = (method: 'card' | 'upi') => {
    setPaymentMethod(method);
  };

  const calculateTotalAmount = () => {
    return selectedRooms.reduce((total, room) => {
      // For dorms: price per bed * number of beds * nights
      // For private rooms: price per room * number of rooms * nights
      if (room.type === 'dorm') {
        return total + (room.price * room.selection.rooms * nights);
      } else {
        return total + (room.price * room.selection.rooms * nights);
      }
    }, 0);
  };

  const generateBookingId = () => {
    return `XTSY-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
  };

  const getBookingData = () => {
    const guests = selectedRooms.reduce((total, room) => total + room.selection.guests, 0);
    const totalAmount = calculateTotalAmount();
    
    return {
      bookingId: generateBookingId(),
      guestName: guestDetails ? `${guestDetails.firstName} ${guestDetails.lastName}` : '',
      checkIn: bookingDates.checkIn,
      checkOut: bookingDates.checkOut,
      guests,
      nights,
      selectedRooms,
      totalAmount,
      gstAmount: 0,
      subtotal: totalAmount,
      discountAmount: 0,
      couponCode: '',
      couponDiscount: 0,
      whatsappNumber: guestDetails?.phone || '',
      addOns: {
        breakfast: 0,
        dinnerVeg: 0,
        dinnerNonVeg: 0,
        transportation: false,
        itineraryPlanning: false
      },
      addOnTotal: 0
    };
  };

  const handleGuestModalBack = () => {
    setShowGuestModal(false);
    setCurrentStep('rooms');
  };

  const handleGuestModalClose = () => {
    setShowGuestModal(false);
    if (guestDetails.firstName && guestDetails.email) {
      setCurrentStep('guest');
    }
  };

  // Group rooms by property type for better organization
  const roomsByProperty = {
    luxury: roomsArray.filter(room => room.propertyType === 'luxury'),
    hostel: roomsArray.filter(room => room.propertyType === 'hostel'),
    economy: roomsArray.filter(room => room.propertyType === 'economy')
  };

  // Helper function to get selection for a room
  const getRoomSelection = React.useCallback((roomId: string) => {
    const selectedRoom = selectedRooms.find(r => r.id === roomId);
    const selection = selectedRoom?.selection || { guests: 1, rooms: 0 };
    console.log('Getting selection for room:', roomId, 'selection:', selection);
    return selection;
  }, [selectedRooms]);

  // Helper function to check if room is selected
  const isRoomSelected = React.useCallback((roomId: string) => {
    const isSelected = !!selectedRooms.find(r => r.id === roomId);
    console.log('Checking if room is selected:', roomId, 'result:', isSelected);
    return isSelected;
  }, [selectedRooms]);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 ${
      isMobileView ? 'pb-20' : ''
    }`}>
      <Header />
      
      {/* Top Left Corner - Book Your Stay Button */}
      <div className={`absolute top-20 left-4 z-10 ${
        isMobileView ? 'top-16 left-2' : isTabletView ? 'top-18 left-4' : 'top-20 left-6'
      }`}>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className={`text-gray-600 hover:text-gray-900 ${
              isMobileView ? 'p-2' : ''
            }`}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className={`font-bold text-gray-900 ${
            isMobileView ? 'text-xl' : isTabletView ? 'text-2xl' : 'text-3xl'
          }`}>
            Book Your Stay
          </h1>
        </div>
      </div>

      <div className={`container mx-auto py-8 ${
        isMobileView ? 'px-2 py-4 pt-20' : isTabletView ? 'px-4 pt-24' : 'px-6 pt-28'
      }`}>
        {/* Booking Summary at Top Center */}
        <div className="flex justify-center mb-8">
          <div className={`${
            isMobileView 
              ? 'w-full max-w-sm' 
              : isTabletView 
                ? 'w-full max-w-md' 
                : 'w-full max-w-lg'
          }`}>
            <BookingSummary
              checkIn={bookingDates.checkIn}
              checkOut={bookingDates.checkOut}
              guests={bookingDates.guests}
              nights={nights}
            />
          </div>
        </div>

        {/* Main Content - Full Width */}
        <div className="w-full">
          {/* Progress Bar */}
          <div className={`mb-8 ${isMobileView ? 'mb-4' : ''}`}>
            <div className={`flex items-center space-x-4 ${
              isMobileView ? 'px-2 space-x-2' : ''
            }`}>
              <div className={`flex items-center ${currentStep === 'rooms' ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep === 'rooms' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                } ${isMobileView ? 'w-6 h-6 text-xs' : 'w-8 h-8'}`}>
                  1
                </div>
                <span className={`ml-2 font-medium ${
                  isMobileView ? 'text-xs' : ''
                }`}>
                  {isMobileView ? 'Rooms' : 'Select Rooms'}
                </span>
              </div>
              
              <div className="flex-1 h-0.5 bg-muted" />
              
              <div className={`flex items-center ${currentStep === 'guest' ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep === 'guest' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                } ${isMobileView ? 'w-6 h-6 text-xs' : 'w-8 h-8'}`}>
                  2
                </div>
                <span className={`ml-2 font-medium ${
                  isMobileView ? 'text-xs' : ''
                }`}>
                  {isMobileView ? 'Details' : 'Guest Details'}
                </span>
              </div>
              
              <div className="flex-1 h-0.5 bg-muted" />
              
              <div className={`flex items-center ${currentStep === 'payment' ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep === 'payment' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                } ${isMobileView ? 'w-6 h-6 text-xs' : 'w-8 h-8'}`}>
                  3
                </div>
                <span className={`ml-2 font-medium ${
                  isMobileView ? 'text-xs' : ''
                }`}>
                  Payment
                </span>
              </div>
            </div>
          </div>

          {/* Step Content */}
          {currentStep === 'rooms' && (
            <div className="space-y-8">
              {/* Main heading with glassmorphism card */}
              <div className={`text-center ${isMobileView ? 'mb-6' : 'mb-12'}`}>
                <div className="backdrop-blur-md bg-white/30 border border-white/20 rounded-3xl shadow-xl mx-auto p-8 max-w-4xl">
                  <h2 className={`font-bold text-gray-800 mb-3 font-playfair ${
                    isMobileView ? 'text-2xl' : isTabletView ? 'text-3xl' : 'text-4xl'
                  }`}>
                    Choose Your Accommodation
                  </h2>
                  <p className={`text-gray-600 max-w-2xl mx-auto ${
                    isMobileView ? 'text-base px-4' : isTabletView ? 'text-lg px-6' : 'text-xl'
                  }`}>
                    Select from our available rooms and customize your stay
                  </p>
                  <div className={`bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-6 rounded-full ${
                    isMobileView ? 'w-20 h-1' : 'w-24 h-1'
                  }`} />
                </div>
              </div>
              
              {/* XTSY Luxury Section */}
              {roomsByProperty.luxury.length > 0 && (
                <div className="space-y-4">
                  <div className="backdrop-blur-md bg-white/20 border border-white/20 rounded-2xl shadow-lg mx-auto p-6 max-w-2xl">
                    <h3 className={`font-bold text-center font-playfair bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent ${
                      isMobileView ? 'text-xl' : isTabletView ? 'text-2xl' : 'text-3xl'
                    }`}>
                      XTSY Luxury
                    </h3>
                    <p className={`text-center text-gray-600 mt-2 ${
                      isMobileView ? 'text-sm' : 'text-base'
                    }`}>
                      Premium accommodations with panoramic views
                    </p>
                    <div className="w-16 h-0.5 bg-gradient-to-r from-orange-500 to-red-600 mx-auto mt-3 rounded-full" />
                  </div>
                  <div className={`grid gap-6 ${
                    isMobileView ? 'grid-cols-1' : isTabletView ? 'grid-cols-2' : 'grid-cols-3'
                  }`}>
                    {roomsByProperty.luxury.map((room) => {
                      const isSelected = isRoomSelected(room.id);
                      const selection = getRoomSelection(room.id);
                      
                      return (
                        <FastRoomCard
                          key={room.id}
                          room={room}
                          isSelected={isSelected}
                          selection={selection}
                          onRoomSelect={handleRoomSelect}
                          onGuestChange={handleGuestChange}
                          onRoomChange={handleRoomChange}
                          nights={nights}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* XTSY Travellers Hostel Section */}
              {roomsByProperty.hostel.length > 0 && (
                <div className="space-y-4">
                  <div className="backdrop-blur-md bg-white/20 border border-white/20 rounded-2xl shadow-lg mx-auto p-6 max-w-2xl">
                    <h3 className={`font-bold text-center font-playfair bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent ${
                      isMobileView ? 'text-xl' : isTabletView ? 'text-2xl' : 'text-3xl'
                    }`}>
                      XTSY Travellers Hostel
                    </h3>
                    <p className={`text-center text-gray-600 mt-2 ${
                      isMobileView ? 'text-sm' : 'text-base'
                    }`}>
                      Comfortable stays with modern amenities
                    </p>
                    <div className="w-16 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mt-3 rounded-full" />
                  </div>
                  <div className={`grid gap-6 ${
                    isMobileView ? 'grid-cols-1' : isTabletView ? 'grid-cols-2' : 'grid-cols-3'
                  }`}>
                    {roomsByProperty.hostel.map((room) => {
                      const isSelected = isRoomSelected(room.id);
                      const selection = getRoomSelection(room.id);
                      
                      return (
                        <FastRoomCard
                          key={room.id}
                          room={room}
                          isSelected={isSelected}
                          selection={selection}
                          onRoomSelect={handleRoomSelect}
                          onGuestChange={handleGuestChange}
                          onRoomChange={handleRoomChange}
                          nights={nights}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* XTSY Economy Section */}
              {roomsByProperty.economy.length > 0 && (
                <div className="space-y-4">
                  <div className="backdrop-blur-md bg-white/20 border border-white/20 rounded-2xl shadow-lg mx-auto p-6 max-w-2xl">
                    <h3 className={`font-bold text-center font-playfair bg-gradient-to-r from-green-500 to-teal-600 bg-clip-text text-transparent ${
                      isMobileView ? 'text-xl' : isTabletView ? 'text-2xl' : 'text-3xl'
                    }`}>
                      XTSY Economy
                    </h3>
                    <p className={`text-center text-gray-600 mt-2 ${
                      isMobileView ? 'text-sm' : 'text-base'
                    }`}>
                      Budget-friendly options for backpackers
                    </p>
                    <div className="w-16 h-0.5 bg-gradient-to-r from-green-500 to-teal-600 mx-auto mt-3 rounded-full" />
                  </div>
                  <div className={`grid gap-6 ${
                    isMobileView ? 'grid-cols-1' : isTabletView ? 'grid-cols-2' : 'grid-cols-3'
                  }`}>
                    {roomsByProperty.economy.map((room) => {
                      const isSelected = isRoomSelected(room.id);
                      const selection = getRoomSelection(room.id);
                      
                      return (
                        <FastRoomCard
                          key={room.id}
                          room={room}
                          isSelected={isSelected}
                          selection={selection}
                          onRoomSelect={handleRoomSelect}
                          onGuestChange={handleGuestChange}
                          onRoomChange={handleRoomChange}
                          nights={nights}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              <div className={`flex justify-center pt-6 ${
                isMobileView ? 'px-4' : ''
              }`}>
                <button
                  onClick={handleNext}
                  className={`group relative overflow-hidden backdrop-blur-md bg-gradient-to-r from-orange-500/80 to-red-600/80 
                    hover:from-orange-600/90 hover:to-red-700/90 text-white font-semibold 
                    rounded-xl border border-white/20 shadow-lg hover:shadow-xl 
                    transition-all duration-300 transform hover:scale-105 active:scale-95
                    ${isMobileView ? 'px-6 py-3 text-sm' : 'px-8 py-4 text-base'}
                  `}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative flex items-center gap-2">
                    <span>Next: Complete Your Booking</span>
                    <User className={`${isMobileView ? 'h-4 w-4' : 'h-5 w-5'} transition-transform group-hover:translate-x-1`} />
                  </div>
                </button>
              </div>
            </div>
          )}

          {currentStep === 'guest' && (
            <div className="space-y-6">
              <div className="text-center mb-12">
                <h2 className={`font-bold text-gray-800 mb-3 font-playfair ${
                  isMobileView ? 'text-2xl' : 'text-3xl sm:text-4xl md:text-5xl'
                }`}>
                  Guest Details Complete
                </h2>
                <p className={`text-gray-600 max-w-2xl mx-auto ${
                  isMobileView ? 'text-base px-4' : 'text-lg sm:text-xl'
                }`}>
                  Your contact information has been saved
                </p>
                <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-6 rounded-full" />
              </div>

              <Card>
                <CardContent className={isMobileView ? 'p-4' : 'p-6'}>
                  <h3 className="font-semibold mb-4">Guest Information</h3>
                  {guestDetails.firstName && (
                    <div className="space-y-2 text-sm">
                      <p><strong>Name:</strong> {guestDetails.firstName} {guestDetails.lastName}</p>
                      <p><strong>Email:</strong> {guestDetails.email}</p>
                      <p><strong>Phone:</strong> {guestDetails.phone}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="flex justify-between">
                <Button variant="outline" onClick={handlePrevious}>
                  <Calendar className="mr-2 h-4 w-4" /> 
                  {isMobileView ? 'Rooms' : 'Previous: Rooms'}
                </Button>
                <Button onClick={handleNext}>
                  {isMobileView ? 'Payment' : 'Next: Payment'} 
                  <CreditCard className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {currentStep === 'payment' && (
            <div className="space-y-6">
              <div className="text-center mb-12">
                <h2 className={`font-bold text-gray-800 mb-3 font-playfair ${
                  isMobileView ? 'text-2xl' : 'text-3xl sm:text-4xl md:text-5xl'
                }`}>
                  Payment
                </h2>
                <p className={`text-gray-600 max-w-2xl mx-auto ${
                  isMobileView ? 'text-base px-4' : 'text-lg sm:text-xl'
                }`}>
                  Choose your payment method to complete the booking
                </p>
                <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-6 rounded-full" />
              </div>

              <Card>
                <CardContent className={isMobileView ? 'p-4 space-y-4' : 'p-6 space-y-4'}>
                  <h3 className="font-semibold mb-4">Select Payment Method</h3>
                  <div className="space-y-3">
                    <Button
                      variant={paymentMethod === 'card' ? 'default' : 'outline'}
                      className="w-full justify-start"
                      onClick={() => handlePayment('card')}
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      Credit/Debit Card
                    </Button>
                    <Button
                      variant={paymentMethod === 'upi' ? 'default' : 'outline'}
                      className="w-full justify-start"
                      onClick={() => handlePayment('upi')}
                    >
                      <Phone className="mr-2 h-4 w-4" />
                      UPI Payment
                    </Button>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Total Amount:</span>
                      <span className={`font-bold text-orange-600 ${
                        isMobileView ? 'text-lg' : 'text-xl'
                      }`}>
                        {formatPrice(calculateTotalAmount())}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between">
                <Button variant="outline" onClick={handlePrevious}>
                  <User className="mr-2 h-4 w-4" /> 
                  {isMobileView ? 'Details' : 'Previous: Guest Details'}
                </Button>
                <Button onClick={handleNext}>
                  {isMobileView ? 'Complete' : 'Complete Booking'} 
                  <CreditCard className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <GuestDetails
        isOpen={showGuestModal}
        onClose={handleGuestModalClose}
        onBack={handleGuestModalBack}
        bookingData={getBookingData()}
      />

      <UPIPaymentModal 
        isOpen={showUPIModal} 
        onClose={() => setShowUPIModal(false)}
        bookingData={getBookingData()}
      />
    </div>
  );
}
