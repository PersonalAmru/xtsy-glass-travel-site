import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, CreditCard, Phone } from 'lucide-react';
import { BookingSummary } from '@/components/BookingSummary';
import FastRoomCard from '@/components/FastRoomCard';
import GuestDetails from '@/components/GuestDetails';
import UPIPaymentModal from '@/components/UPIPaymentModal';
import { useScreenSize } from '@/hooks/use-mobile';
import { toast } from 'sonner';
import { differenceInDays, parseISO, format, addDays } from 'date-fns';
import Header from '@/components/Header';
import { ROOM_DATA, XTSY270_DATA } from '@/data/rooms/xtsy270';
import { useApp } from '@/contexts/AppContext';
import { generateStandardizedFeatures } from '@/utils/roomFeatures';
import { supabase } from '@/integrations/supabase/client';
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
  maxRooms?: number;
  images?: string[];
  isBlocked?: boolean;
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
const generateFeatures = generateStandardizedFeatures;
const ALL_ROOMS_DATA: {
  [key: string]: Room;
} = {
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
  '4-bed-female-only-dorm': {
    id: '4-bed-female-only-dorm',
    name: 'Bed in 4-Bed Female Only Dormitory',
    price: 850,
    image: 'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20Female%20Only%20Dorms/1.jpg',
    description: 'Female-only dormitory with modern amenities and comfortable beds',
    amenities: generateFeatures('hostel', 'Bed in 4-Bed Female Only Dormitory', 'dorm'),
    type: 'dorm',
    maxGuests: 1,
    propertyType: 'hostel',
    maxRooms: 4,
    images: ['https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20Female%20Only%20Dorms/1.jpg', 'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20Female%20Only%20Dorms/2.jpg', 'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20Female%20Only%20Dorms/3.jpg', 'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20Female%20Only%20Dorms/4.JPG', 'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20Female%20Only%20Dorms/5.JPG', 'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20Female%20Only%20Dorms/6.JPG', 'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20Female%20Only%20Dorms/7.JPG', 'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20Female%20Only%20Dorms/IMG_5161.png']
  },
  '4-bed-mixed-female-dorm': {
    id: '4-bed-mixed-female-dorm',
    name: 'Bed in 4-Bed Mixed Dormitory',
    price: 800,
    image: 'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20MixedFemale%20Dorms/3.jpg',
    description: 'Mixed dormitory with shared facilities and social atmosphere',
    amenities: generateFeatures('hostel', 'Bed in 4-Bed Mixed Dormitory', 'dorm'),
    type: 'dorm',
    maxGuests: 1,
    propertyType: 'hostel',
    maxRooms: 4,
    images: ['https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20MixedFemale%20Dorms/3.jpg', 'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20MixedFemale%20Dorms/4.JPG', 'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20MixedFemale%20Dorms/5.jpg', 'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20MixedFemale%20Dorms/IMG_5161.png']
  },
  '6-bed-mixed-female-dorm': {
    id: '6-bed-mixed-female-dorm',
    name: 'Bed in 6-Bed Female Only Dormitory',
    price: 750,
    image: 'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/1.JPG',
    description: 'Spacious mixed or female dormitory with modern amenities',
    amenities: generateFeatures('hostel', 'Bed in 6-Bed Female Only Dormitory', 'dorm'),
    type: 'dorm',
    maxGuests: 1,
    propertyType: 'hostel',
    maxRooms: 6,
    images: ['https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/1.JPG', 'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/3.jpg', 'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/4.jpg', 'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/5.JPG', 'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/6.JPG', 'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/IMG_5160.png']
  },
  '6-bed-mixed-dorm': {
    id: '6-bed-mixed-dorm',
    name: 'Bed in 6-Bed Mixed Dormitory',
    price: 700,
    image: 'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/1.JPG',
    description: 'Spacious mixed dormitory with modern amenities',
    amenities: generateFeatures('hostel', 'Bed in 6-Bed Mixed Dormitory', 'dorm'),
    type: 'dorm',
    maxGuests: 1,
    propertyType: 'hostel',
    maxRooms: 6,
    images: ['https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/1.JPG', 'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/3.jpg', 'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/4.jpg', 'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/5.JPG', 'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/6.JPG', 'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/IMG_5160.png']
  },
  'king-double-room': {
    id: 'king-double-room',
    name: 'King Double Room',
    price: 3500,
    image: 'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Double%20Room/1.jpg',
    description: 'Spacious private room with king bed for two guests',
    amenities: generateFeatures('hostel', 'King Double Room', 'private'),
    type: 'private',
    maxGuests: 2,
    propertyType: 'hostel',
    maxRooms: 2,
    images: ['https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Double%20Room/1.jpg', 'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Double%20Room/2.jpg', 'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Double%20Room/3.JPG', 'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Double%20Room/IMG_4077.jpg']
  },
  'king-triple-room': {
    id: 'king-triple-room',
    name: 'King Triple Room',
    price: 4500,
    image: 'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Triple%20Room/1.jpg',
    description: 'Luxurious private room accommodating up to three guests',
    amenities: generateFeatures('hostel', 'King Triple Room', 'private'),
    type: 'private',
    maxGuests: 3,
    propertyType: 'hostel',
    maxRooms: 1,
    images: ['https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Triple%20Room/1.jpg', 'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Triple%20Room/2.jpg', 'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Triple%20Room/3.jpg', 'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Triple%20Room/5.jpg', 'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Double%20Room/IMG_4077.jpg']
  },
  '6-bed-mixed-economy-dorm': {
    id: '6-bed-mixed-economy-dorm',
    name: 'Bed in 6-Bed Mixed Dormitory',
    price: 450,
    image: 'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/1.JPG',
    description: 'Budget-friendly mixed dormitory with essential amenities',
    amenities: generateFeatures('economy', 'Bed in 6-Bed Mixed Dormitory', 'dorm'),
    type: 'dorm',
    maxGuests: 1,
    propertyType: 'economy',
    maxRooms: 6,
    images: ['https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/1.JPG', 'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/3.jpg', 'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/4.jpg', 'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/5.JPG', 'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/6.JPG', 'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/IMG_5160.png']
  },
  '8-bed-mixed-economy-dorm': {
    id: '8-bed-mixed-economy-dorm',
    name: 'Bed in 8-Bed Mixed Dormitory',
    price: 350,
    image: 'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/8%20Bed%20Mixed%20Dorms/3.jpg',
    description: 'Most economical option for backpackers and budget travelers',
    amenities: generateFeatures('economy', 'Bed in 8-Bed Mixed Dormitory', 'dorm'),
    type: 'dorm',
    maxGuests: 1,
    propertyType: 'economy',
    maxRooms: 8,
    images: ['https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/8%20Bed%20Mixed%20Dorms/3.jpg', 'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/8%20Bed%20Mixed%20Dorms/4.jpg', 'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/8%20Bed%20Mixed%20Dorms/5.jpg', 'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/8%20Bed%20Mixed%20Dorms/6.jpg', 'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/8%20Bed%20Mixed%20Dorms/8.jpg', 'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/8%20Bed%20Mixed%20Dorms/9.jpg']
  }
};
export default function BookingFlow() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    formatPrice
  } = useApp();
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
  const [blockedDates, setBlockedDates] = useState<{[key: string]: string[]}>({});
  const [roomsWithAvailability, setRoomsWithAvailability] = useState<Room[]>(Object.values(ALL_ROOMS_DATA));
  const screenSize = useScreenSize();
  const isMobileView = screenSize === 'mobile';
  const isTabletView = screenSize === 'tablet';
  const preSelectedRoom = searchParams.get('room');
  const preSelectedProperty = searchParams.get('property');
  const urlCheckIn = searchParams.get('checkIn') || new Date().toISOString().split('T')[0];
  const urlCheckOut = searchParams.get('checkOut') || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const urlGuests = parseInt(searchParams.get('guests') || '4');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | null>(null);
  const [bookingDates, setBookingDates] = useState({
    checkIn: urlCheckIn,
    checkOut: urlCheckOut,
    guests: urlGuests
  });
  const nights = React.useMemo(() => {
    try {
      return differenceInDays(parseISO(bookingDates.checkOut), parseISO(bookingDates.checkIn));
    } catch {
      return 1;
    }
  }, [bookingDates.checkIn, bookingDates.checkOut]);
  // Check if room is blocked for the selected dates
  const checkRoomAvailability = (roomId: string, checkIn: string, checkOut: string): boolean => {
    const roomBlockedDates = blockedDates[roomId] || [];
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    
    // Check each night of the stay
    let currentDate = new Date(checkInDate);
    while (currentDate < checkOutDate) {
      const dateStr = format(currentDate, 'yyyy-MM-dd');
      if (roomBlockedDates.includes(dateStr)) {
        return false; // Room is blocked for this date
      }
      currentDate = addDays(currentDate, 1);
    }
    return true; // Room is available
  };

  const roomsArray: Room[] = Object.values(ALL_ROOMS_DATA);
  // Load blocked dates on component mount and when booking dates change
  useEffect(() => {
    const loadBlockedDates = async () => {
      try {
        const { data: blockedData, error } = await supabase
          .from('blocked_dates')
          .select('room_type, date')
          .eq('blocked', true);

        if (error) {
          console.error('Error loading blocked dates:', error);
          return;
        }

        // Group blocked dates by room type
        const blockedByRoom: {[key: string]: string[]} = {};
        blockedData?.forEach(block => {
          if (!blockedByRoom[block.room_type]) {
            blockedByRoom[block.room_type] = [];
          }
          blockedByRoom[block.room_type].push(block.date);
        });

        setBlockedDates(blockedByRoom);

        // Update rooms with availability status
        const updatedRooms = Object.values(ALL_ROOMS_DATA).map(room => ({
          ...room,
          isBlocked: !checkRoomAvailability(room.id, bookingDates.checkIn, bookingDates.checkOut)
        }));
        
        setRoomsWithAvailability(updatedRooms);
      } catch (error) {
        console.error('Error loading room availability:', error);
        // Fallback: show all rooms even if availability can't be loaded
        setRoomsWithAvailability(Object.values(ALL_ROOMS_DATA));
      }
    };

    loadBlockedDates();

    // Set up real-time subscription for blocked dates updates
    const subscription = supabase
      .channel('blocked_dates_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'blocked_dates' 
      }, () => {
        // Reload blocked dates when changes occur
        loadBlockedDates();
      })
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [bookingDates.checkIn, bookingDates.checkOut]);

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
              rooms: 0
            }
          }]);
        }
      } catch (error) {
        console.error('Error pre-selecting room:', error);
      }
    }
  }, [preSelectedRoom, preSelectedProperty]);
  const handleRoomSelect = React.useCallback((roomId: string) => {
    setSelectedRooms(prev => {
      const room = ALL_ROOMS_DATA[roomId as keyof typeof ALL_ROOMS_DATA];
      const isSelected = prev.find(r => r.id === roomId);
      if (isSelected) return prev.filter(r => r.id !== roomId);
      const newRoom = {
        id: room.id,
        name: room.name,
        price: room.price,
        type: room.type,
        selection: {
          guests: room.type === 'dorm' ? 1 : room.maxGuests,
          rooms: 0
        }
      };
      return [...prev, newRoom];
    });
  }, []);
  const handleGuestChange = React.useCallback((roomId: string, guests: number) => {
    setSelectedRooms(prev => {
      const existing = prev.find(room => room.id === roomId);
      if (existing) {
        return prev.map(room => room.id === roomId ? {
          ...room,
          selection: {
            ...room.selection,
            guests
          }
        } : room);
      }
      const roomData = ALL_ROOMS_DATA[roomId as keyof typeof ALL_ROOMS_DATA];
      if (!roomData) return prev;
      return [...prev, {
        id: roomData.id,
        name: roomData.name,
        price: roomData.price,
        type: roomData.type,
        selection: {
          guests,
          rooms: 0
        }
      }];
    });
  }, []);
  const handleRoomChange = React.useCallback((roomId: string, rooms: number) => {
    setSelectedRooms(prev => {
      const existing = prev.find(room => room.id === roomId);
      if (existing) {
        return prev.map(room => room.id === roomId ? {
          ...room,
          selection: {
            ...room.selection,
            rooms
          }
        } : room);
      }
      if (rooms > 0) {
        const roomData = ALL_ROOMS_DATA[roomId as keyof typeof ALL_ROOMS_DATA];
        if (roomData) {
          return [...prev, {
            id: roomData.id,
            name: roomData.name,
            price: roomData.price,
            type: roomData.type,
            selection: {
              guests: roomData.type === 'dorm' ? 1 : roomData.maxGuests,
              rooms
            }
          }];
        }
      }
      return prev;
    });
  }, []);
  const validateGuestAccommodation = () => {
    if (selectedRooms.length === 0) return false;
    const totalAccommodated = selectedRooms.reduce((total, room) => {
      if (room.type === 'dorm') return total + room.selection.rooms;
      const roomData = ALL_ROOMS_DATA[room.id];
      return total + room.selection.rooms * roomData.maxGuests;
    }, 0);
    return totalAccommodated >= bookingDates.guests;
  };
  const handleNext = () => {
    if (currentStep === 'rooms') {
      if (selectedRooms.length === 0) return toast.error('Please select at least one room or bed');
      if (!validateGuestAccommodation()) return toast.error(`Please select enough beds/rooms to accommodate all ${bookingDates.guests} guests`);
      setShowGuestModal(true);
    } else if (currentStep === 'guest') {
      if (!guestDetails.firstName || !guestDetails.email) return toast.error('Please fill in your details');
      setCurrentStep('payment');
    } else if (currentStep === 'payment') {
      if (!paymentMethod) return toast.error('Please select a payment method');
      if (paymentMethod === 'upi') setShowUPIModal(true);else toast.success('Payment processed successfully!');
    }
  };
  const handlePrevious = () => {
    if (currentStep === 'guest') setCurrentStep('rooms');else if (currentStep === 'payment') setCurrentStep('guest');
  };
  const handlePayment = (method: 'card' | 'upi') => setPaymentMethod(method);
  const calculateTotalAmount = () => selectedRooms.reduce((total, room) => {
    return total + room.price * room.selection.rooms * nights;
  }, 0);
  const generateBookingId = () => `XTSY-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
  const getBookingData = () => {
    const guests = selectedRooms.reduce((t, r) => t + r.selection.guests, 0);
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
  const roomsByProperty = {
    luxury: (roomsWithAvailability.length > 0 ? roomsWithAvailability : Object.values(ALL_ROOMS_DATA)).filter(room => room.propertyType === 'luxury'),
    hostel: (roomsWithAvailability.length > 0 ? roomsWithAvailability : Object.values(ALL_ROOMS_DATA)).filter(room => room.propertyType === 'hostel'),
    economy: (roomsWithAvailability.length > 0 ? roomsWithAvailability : Object.values(ALL_ROOMS_DATA)).filter(room => room.propertyType === 'economy')
  };
  const getRoomSelection = React.useCallback((roomId: string) => {
    const selected = selectedRooms.find(r => r.id === roomId);
    return selected?.selection || {
      guests: 1,
      rooms: 0
    };
  }, [selectedRooms]);
  const isRoomSelected = React.useCallback((roomId: string) => !!selectedRooms.find(r => r.id === roomId), [selectedRooms]);
  return <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      <Header />

      {/* Back button + title */}
      <div className={`absolute top-20 left-4 z-10 ${isMobileView ? 'top-16 left-2' : isTabletView ? 'top-18 left-4' : 'top-20 left-6'}`}>
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => navigate('/')} className={`text-gray-600 hover:text-gray-900 hover:bg-transparent focus:ring-0 focus:outline-none ${isMobileView ? 'p-2' : ''}`}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className={`font-bold text-gray-900 ${isMobileView ? 'text-xl' : isTabletView ? 'text-2xl' : 'text-3xl'}`}>
            Choose Your Stay
          </h1>
        </div>
      </div>

      <div className={`container mx-auto py-8 ${isMobileView ? 'px-2 py-4 pt-20' : isTabletView ? 'px-4 pt-24' : 'px-6 pt-28'}`}>
        {/* Booking summary */}
        <div className="flex justify-center mb-8">
          <div className={`${isMobileView ? 'w-full max-w-sm' : isTabletView ? 'w-full max-w-md' : 'w-full max-w-lg'}`}>
            <BookingSummary checkIn={bookingDates.checkIn} checkOut={bookingDates.checkOut} guests={bookingDates.guests} nights={nights} />
          </div>
        </div>

        {/* Content */}
        <div className="w-full">
          {/* Step headings & progress bar omitted for brevity */}

          {/* ROOMS STEP */}
          {currentStep === 'rooms' && <div className="space-y-8">

              {/* Luxury */}
              {roomsByProperty.luxury.length > 0 && <div className="space-y-4">
                  <div className="backdrop-blur-md bg-white/20 border border-white/20 rounded-2xl shadow-lg mx-auto p-6 max-w-2xl">
                    <h3 className={`font-bold text-center font-playfair bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent ${isMobileView ? 'text-xl' : isTabletView ? 'text-2xl' : 'text-3xl'}`}>
                      XTSY Luxury
                    </h3>
                    <p className={`text-center text-gray-600 mt-2 ${isMobileView ? 'text-sm' : 'text-base'}`}>Luxury ensuite with panoramic views. Ultra Luxury views is a 200% Guarantee</p>
                    <div className="w-16 h-0.5 bg-gradient-to-r from-orange-500 to-red-600 mx-auto mt-3 rounded-full" />
                  </div>
                  <div className={`grid gap-6 ${isMobileView ? 'grid-cols-1' : isTabletView ? 'grid-cols-2' : 'grid-cols-3'}`}>
                    {roomsByProperty.luxury.map(room => {
                const isSelected = isRoomSelected(room.id);
                const selection = getRoomSelection(room.id);
                return <FastRoomCard key={room.id} room={room} isSelected={isSelected} selection={selection} onRoomSelect={handleRoomSelect} onGuestChange={handleGuestChange} onRoomChange={handleRoomChange} nights={nights} />;
              })}
                  </div>
                </div>}

              {/* Hostel */}
              {roomsByProperty.hostel.length > 0 && <div className="space-y-4">
                  <div className="backdrop-blur-md bg-white/20 border border-white/20 rounded-2xl shadow-lg mx-auto p-6 max-w-2xl">
                    <h3 className={`font-bold text-center font-playfair bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent ${isMobileView ? 'text-xl' : isTabletView ? 'text-2xl' : 'text-3xl'}`}>
                      XTSY Travellers Hostel
                    </h3>
                    <p className={`text-center text-gray-600 mt-2 ${isMobileView ? 'text-sm' : 'text-base'}`}>
                      Comfortable stays with modern amenities. This isn't just a stay. It's a vibe
                    </p>
                    <div className="w-16 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mt-3 rounded-full" />
                  </div>
                  <div className={`grid gap-6 ${isMobileView ? 'grid-cols-1' : isTabletView ? 'grid-cols-2' : 'grid-cols-3'}`}>
                    {roomsByProperty.hostel.map(room => {
                const isSelected = isRoomSelected(room.id);
                const selection = getRoomSelection(room.id);
                return <FastRoomCard key={room.id} room={room} isSelected={isSelected} selection={selection} onRoomSelect={handleRoomSelect} onGuestChange={handleGuestChange} onRoomChange={handleRoomChange} nights={nights} />;
              })}
                  </div>
                </div>}

              {/* Economy */}
              {roomsByProperty.economy.length > 0 && <div className="space-y-4">
                  <div className="backdrop-blur-md bg-white/20 border border-white/20 rounded-2xl shadow-lg mx-auto p-6 max-w-2xl">
                    <h3 className={`font-bold text-center font-playfair bg-gradient-to-r from-green-500 to-teal-600 bg-clip-text text-transparent ${isMobileView ? 'text-xl' : isTabletView ? 'text-2xl' : 'text-3xl'}`}>
                      XTSY Economy
                    </h3>
                    <p className={`text-center text-gray-600 mt-2 ${isMobileView ? 'text-sm' : 'text-base'}`}>
                      Budget-friendly options for backpackers. 
                      No access to Common Area, Shared Lounge or Games Room.
                    </p>
                    <div className="w-16 h-0.5 bg-gradient-to-r from-green-500 to-teal-600 mx-auto mt-3 rounded-full" />
                  </div>
                  <div className={`grid gap-6 ${isMobileView ? 'grid-cols-1' : isTabletView ? 'grid-cols-2' : 'grid-cols-3'}`}>
                    {roomsByProperty.economy.map(room => {
                const isSelected = isRoomSelected(room.id);
                const selection = getRoomSelection(room.id);
                return <FastRoomCard key={room.id} room={room} isSelected={isSelected} selection={selection} onRoomSelect={handleRoomSelect} onGuestChange={handleGuestChange} onRoomChange={handleRoomChange} nights={nights} />;
              })}
                  </div>
                </div>}

              {/* Spacer so content isn't hidden behind the fixed Next button */}
              <div className="h-[92px] md:h-[100px]" />
            </div>}

          {/* GUEST STEP */}
          {currentStep === 'guest' && <div className="space-y-6">
              <div className="text-center mb-12">
                <h2 className={`font-bold text-gray-800 mb-3 font-playfair ${isMobileView ? 'text-2xl' : 'text-3xl sm:text-4xl md:text-5xl'}`}>
                  Guest Details Complete
                </h2>
                <p className={`text-gray-600 max-w-2xl mx-auto ${isMobileView ? 'text-base px-4' : 'text-lg sm:text-xl'}`}>
                  Your contact information has been saved
                </p>
                <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-6 rounded-full" />
              </div>

              <Card>
                <CardContent className={isMobileView ? 'p-4' : 'p-6'}>
                  <h3 className="font-semibold mb-4">Guest Information</h3>
                  {guestDetails.firstName && <div className="space-y-2 text-sm">
                      <p><strong>Name:</strong> {guestDetails.firstName} {guestDetails.lastName}</p>
                      <p><strong>Email:</strong> {guestDetails.email}</p>
                      <p><strong>Phone:</strong> {guestDetails.phone}</p>
                    </div>}
                </CardContent>
              </Card>

              <div className="flex justify-between">
                <Button variant="outline" onClick={handlePrevious}>
                  {isMobileView ? 'Rooms' : 'Previous: Rooms'}
                </Button>
                <Button onClick={handleNext}>
                  {isMobileView ? 'Payment' : 'Next: Payment'}
                </Button>
              </div>
            </div>}

          {/* PAYMENT STEP */}
          {currentStep === 'payment' && <div className="space-y-6">
              <div className="text-center mb-12">
                <h2 className={`font-bold text-gray-800 mb-3 font-playfair ${isMobileView ? 'text-2xl' : 'text-3xl sm:text-4xl md:text-5xl'}`}>
                  Payment
                </h2>
                <p className={`text-gray-600 max-w-2xl mx-auto ${isMobileView ? 'text-base px-4' : 'text-lg sm:text-xl'}`}>
                  Choose your payment method to complete the booking
                </p>
                <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-6 rounded-full" />
              </div>

              <Card>
                <CardContent className={isMobileView ? 'p-4 space-y-4' : 'p-6 space-y-4'}>
                  <h3 className="font-semibold mb-4">Select Payment Method</h3>
                  <div className="space-y-3">
                    <Button variant={/* highlight */'outline'} className="w-full justify-start" onClick={() => setPaymentMethod('card')}>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Credit/Debit Card
                    </Button>
                    <Button variant={/* highlight */'outline'} className="w-full justify-start" onClick={() => setPaymentMethod('upi')}>
                      <Phone className="mr-2 h-4 w-4" />
                      UPI Payment
                    </Button>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Total Amount:</span>
                      <span className={`font-bold text-orange-600 ${isMobileView ? 'text-lg' : 'text-xl'}`}>
                        {formatPrice(calculateTotalAmount())}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between">
                <Button variant="outline" onClick={handlePrevious}>
                  {isMobileView ? 'Details' : 'Previous: Guest Details'}
                </Button>
                <Button onClick={handleNext}>
                  {isMobileView ? 'Complete' : 'Complete Booking'}
                </Button>
              </div>
            </div>}
        </div>
      </div>

      {/* Fixed Next button — only on Rooms step */}
      {currentStep === 'rooms' && <div className="
            fixed bottom-0 left-0 right-0 z-50
            px-4 pb-[calc(env(safe-area-inset-bottom,0px)+12px)] pt-3
            bg-transparent
            pointer-events-none
          ">
          <div className="mx-auto max-w-5xl flex justify-center">
            <Button onClick={handleNext} className="
                pointer-events-auto
                rounded-xl px-6 md:px-8 py-3 md:py-3.5
                text-white font-semibold
                shadow-md hover:shadow-lg transition
                bg-gradient-to-r from-orange-500 to-red-600
              ">
              Next: Complete Your Booking
            </Button>
          </div>
        </div>}

      <GuestDetails isOpen={showGuestModal} onClose={() => {
      setShowGuestModal(false);
      if (guestDetails.firstName && guestDetails.email) setCurrentStep('guest');
    }} onBack={() => {
      setShowGuestModal(false);
      setCurrentStep('rooms');
    }} bookingData={{
      checkIn: bookingDates.checkIn,
      checkOut: bookingDates.checkOut,
      guests: selectedRooms.reduce((t, r) => t + r.selection.guests, 0),
      nights,
      selectedRooms,
      totalAmount: calculateTotalAmount(),
      gstAmount: 0,
      subtotal: calculateTotalAmount(),
      discountAmount: 0,
      couponCode: '',
      couponDiscount: 0,
      addOns: {
        breakfast: 0,
        dinnerVeg: 0,
        dinnerNonVeg: 0,
        transportation: false,
        itineraryPlanning: false
      }
    }} />

      <UPIPaymentModal isOpen={showUPIModal} onClose={() => setShowUPIModal(false)} bookingData={{
      bookingId: `XTSY-${Date.now()}`,
      guestName: guestDetails ? `${guestDetails.firstName} ${guestDetails.lastName}` : '',
      checkIn: bookingDates.checkIn,
      checkOut: bookingDates.checkOut,
      totalAmount: calculateTotalAmount(),
      whatsappNumber: guestDetails?.phone || '',
      addOns: {
        breakfast: 0,
        dinnerVeg: 0,
        dinnerNonVeg: 0,
        transportation: false,
        itineraryPlanning: false
      },
      addOnTotal: 0
    }} />
    </div>;
}