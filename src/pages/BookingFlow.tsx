import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import WhatsAppBookingForm from '@/components/WhatsAppBookingForm';
import { BookingSummary } from '@/components/BookingSummary';
import FastRoomCard from '@/components/FastRoomCard';
import SharedAvailabilityCalendar from '@/components/SharedAvailabilityCalendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useScreenSize } from '@/hooks/use-mobile';
import { toast } from 'sonner';
import { differenceInDays, parseISO } from 'date-fns';
import Header from '@/components/Header';
import { ROOM_DATA, XTSY270_DATA } from '@/data/rooms/xtsy270';
import { useApp } from '@/contexts/AppContext';
import { generateStandardizedFeatures } from '@/utils/roomFeatures';
import { useRoomAvailability, checkDateRangeAvailability } from '@/hooks/useRoomAvailability';
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

const ALL_ROOMS_DATA: { [key: string]: Room } = {
  'xtsy-270': {
    id: 'xtsy-270',
    name: '270° Panorama Glass Ensuite',
    price: 7999,
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
    price: 2800,
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
    price: 3500,
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
    name: 'Bed in 6-Bed Female Dormitory',
    price: 325,
    image: 'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/1.JPG',
    description: 'Budget-friendly female dormitory with essential amenities',
    amenities: generateFeatures('economy', 'Bed in 6-Bed Female Dormitory', 'dorm'),
    type: 'dorm',
    maxGuests: 1,
    propertyType: 'economy',
    maxRooms: 6,
    images: ['https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/1.JPG', 'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/3.jpg', 'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/4.jpg', 'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/5.JPG', 'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/6.JPG', 'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/IMG_5160.png']
  },
  '8-bed-mixed-economy-dorm': {
    id: '8-bed-mixed-economy-dorm',
    name: 'Bed in 8-Bed Mixed Dormitory',
    price: 399,
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
  const { formatPrice } = useApp();
  
  const [selectedRooms, setSelectedRooms] = useState<SelectedRoom[]>([]);
  const [showPropertyDialog, setShowPropertyDialog] = useState(false);
  const [showWhatsAppForm, setShowWhatsAppForm] = useState(false);
  const [roomsWithAvailability, setRoomsWithAvailability] = useState<Room[]>(Object.values(ALL_ROOMS_DATA));
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    address: '',
    state: '',
    pincode: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const screenSize = useScreenSize();
  const isMobileView = screenSize === 'mobile';
  const isTabletView = screenSize === 'tablet';
  
  const preSelectedRoom = searchParams.get('room');
  const preSelectedProperty = searchParams.get('property');
  const urlCheckIn = searchParams.get('checkIn') || new Date().toISOString().split('T')[0];
  const urlCheckOut = searchParams.get('checkOut') || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const urlGuests = parseInt(searchParams.get('guests') || '4');
  
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
  
  const roomsArray: Room[] = Object.values(ALL_ROOMS_DATA);

  const getAvailabilityName = (room: Room): string => {
    switch (room.id) {
      case '8-bed-mixed-economy-dorm':
        return 'Bed in 8 bed mixed economy dorm';
      default:
        return room.name;
    }
  };

  const roomAvailabilityQueries = roomsArray.map(room => {
    const availabilityName = getAvailabilityName(room);
    return useRoomAvailability(availabilityName, true);
  });

  useEffect(() => {
    const updatedRooms = roomsArray.map((room, index) => {
      const availabilityQuery = roomAvailabilityQueries[index];
      const { availability } = availabilityQuery || { availability: {} };
      
      const checkInDate = new Date(bookingDates.checkIn);
      const checkOutDate = new Date(bookingDates.checkOut);
      const isAvailable = checkDateRangeAvailability(checkInDate, checkOutDate, availability);
      
      return { ...room, isBlocked: !isAvailable };
    });
    
    setRoomsWithAvailability(updatedRooms);
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
        return prev.map(room =>
          room.id === roomId
            ? { ...room, selection: { ...room.selection, guests } }
            : room
        );
      }
      
      const roomData = ALL_ROOMS_DATA[roomId as keyof typeof ALL_ROOMS_DATA];
      if (!roomData) return prev;
      
      return [
        ...prev,
        {
          id: roomData.id,
          name: roomData.name,
          price: roomData.price,
          type: roomData.type,
          selection: { guests, rooms: 0 }
        }
      ];
    });
  }, []);

  const handleRoomChange = React.useCallback((roomId: string, rooms: number) => {
    setSelectedRooms(prev => {
      const existing = prev.find(room => room.id === roomId);
      if (existing) {
        return prev.map(room =>
          room.id === roomId
            ? { ...room, selection: { ...room.selection, rooms } }
            : room
        );
      }
      
      if (rooms > 0) {
        const roomData = ALL_ROOMS_DATA[roomId as keyof typeof ALL_ROOMS_DATA];
        if (roomData) {
          return [
            ...prev,
            {
              id: roomData.id,
              name: roomData.name,
              price: roomData.price,
              type: roomData.type,
              selection: {
                guests: roomData.type === 'dorm' ? 1 : roomData.maxGuests,
                rooms
              }
            }
          ];
        }
      }
      return prev;
    });
  }, []);

  const handleNext = () => {
    setShowPropertyDialog(true);
  };

  const handlePrevious = () => {
    navigate(-1);
  };

  const roomsByProperty = {
    luxury: roomsWithAvailability.filter(room => room.propertyType === 'luxury'),
    hostel: roomsWithAvailability.filter(room => room.propertyType === 'hostel'),
    economy: roomsWithAvailability.filter(room => room.propertyType === 'economy')
  };

  const getRoomSelection = React.useCallback((roomId: string) => {
    const selected = selectedRooms.find(r => r.id === roomId);
    return selected?.selection || { guests: 1, rooms: 0 };
  }, [selectedRooms]);

  const isRoomSelected = React.useCallback(
    (roomId: string) => !!selectedRooms.find(r => r.id === roomId),
    [selectedRooms]
  );

  const calculateTotalAmount = () => {
    return selectedRooms.reduce((total, room) => {
      const roomData = ALL_ROOMS_DATA[room.id];
      const roomCount = room.selection.rooms;
      return total + (roomData.price * roomCount * nights);
    }, 0);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.mobile || !formData.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (selectedRooms.length === 0) {
      toast.error('Please select at least one room');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create booking for each selected room
      for (const room of selectedRooms) {
        const roomData = ALL_ROOMS_DATA[room.id];
        const roomSubtotal = roomData.price * room.selection.rooms * nights;
        const roomTaxes = Math.round(roomSubtotal * 0.12); // 12% GST
        
        const { data, error } = await supabase
          .from('bookings')
          .insert({
            booking_id: '', // Will be auto-generated by trigger
            guest_name: formData.name,
            email: formData.email,
            whatsapp_number: formData.mobile,
            address: formData.address || null,
            state: formData.state || null,
            pincode: formData.pincode || null,
            check_in: bookingDates.checkIn,
            check_out: bookingDates.checkOut,
            guests: room.selection.guests,
            room_type: roomData.name,
            room_type_id: roomData.id,
            quantity: room.selection.rooms,
            subtotal: roomSubtotal,
            taxes: roomTaxes,
            total_amount: roomSubtotal + roomTaxes,
            booking_status: 'pending',
            payment_status: 'pending',
            source: 'direct'
          });

        if (error) throw error;
      }

      toast.success('Booking request submitted successfully!');
      
      // Reset form
      setFormData({
        name: '',
        mobile: '',
        email: '',
        address: '',
        state: '',
        pincode: ''
      });
      setSelectedRooms([]);
      
    } catch (error) {
      console.error('Error submitting booking:', error);
      toast.error('Failed to submit booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      <Header />

      {/* Back button + title */}
      <div className={`absolute top-20 left-4 z-10 ${isMobileView ? 'top-16 left-2' : isTabletView ? 'top-18 left-4' : 'top-20 left-6'}`}>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={handlePrevious}
            className={`text-gray-600 hover:text-gray-900 hover:bg-transparent focus:ring-0 focus:outline-none ${isMobileView ? 'p-2' : ''}`}
          >
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
            <BookingSummary
              checkIn={bookingDates.checkIn}
              checkOut={bookingDates.checkOut}
              guests={bookingDates.guests}
              nights={nights}
            />
          </div>
        </div>

        {/* Room Listings by Property Type */}
        <div className="w-full space-y-8">
          {/* Luxury */}
          {roomsByProperty.luxury.length > 0 && (
            <div className="space-y-4">
              <div className="backdrop-blur-md bg-white/20 border border-white/20 rounded-2xl shadow-lg mx-auto p-6 max-w-2xl">
                <h3 className={`font-bold text-center font-playfair bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent ${isMobileView ? 'text-xl' : isTabletView ? 'text-2xl' : 'text-3xl'}`}>
                  XTSY Luxury
                </h3>
                <p className={`text-center text-gray-600 mt-2 ${isMobileView ? 'text-sm' : 'text-base'}`}>
                  Luxury ensuite with panoramic views. Ultra Luxury views is a 200% Guarantee
                </p>
                <div className="w-16 h-0.5 bg-gradient-to-r from-orange-500 to-red-600 mx-auto mt-3 rounded-full" />
              </div>
              <div className={`grid gap-6 ${isMobileView ? 'grid-cols-1' : isTabletView ? 'grid-cols-2' : 'grid-cols-3'}`}>
                {roomsByProperty.luxury.map(room => {
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

          {/* Hostel */}
          {roomsByProperty.hostel.length > 0 && (
            <div className="space-y-4">
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

          {/* Economy */}
          {roomsByProperty.economy.length > 0 && (
            <div className="space-y-4">
              <div className="backdrop-blur-md bg-white/20 border border-white/20 rounded-2xl shadow-lg mx-auto p-8 max-w-3xl">
                <h3 className={`font-bold text-center font-playfair bg-gradient-to-r from-green-500 to-teal-600 bg-clip-text text-transparent ${isMobileView ? 'text-xl' : isTabletView ? 'text-2xl' : 'text-3xl'}`}>
                  XTSY Economy
                </h3>
                <p className={`text-center text-gray-600 mt-2 ${isMobileView ? 'text-sm' : 'text-base'}`}>
                  Your Ultra-Budget Stay Without Compromise Simple, clean, and affordable. Designed for backpackers who need a safe, reliable place to crash with all the essentials
                </p>
                <p className={`text-center text-orange-600 font-semibold mt-2 ${isMobileView ? 'text-xs' : 'text-sm'}`}>
                  XTSY Economy is exclusively available only on Booking.com
                </p>
                <div className="w-16 h-0.5 bg-gradient-to-r from-green-500 to-teal-600 mx-auto mt-3 rounded-full" />
              </div>
              <div className={`grid gap-6 ${isMobileView ? 'grid-cols-1' : isTabletView ? 'grid-cols-2' : 'grid-cols-3'}`}>
                {roomsByProperty.economy.map(room => {
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



          {/* Spacer for fixed button */}
          <div className="h-[92px] md:h-[100px]" />
        </div>
      </div>

      {/* Fixed Next Button */}
      <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-[calc(env(safe-area-inset-bottom,0px)+12px)] pt-3 bg-transparent pointer-events-none">
        <div className="mx-auto max-w-5xl flex justify-center">
          <Button
            onClick={handleNext}
            className="pointer-events-auto rounded-xl px-6 md:px-8 py-3 md:py-3.5 text-white font-semibold shadow-md hover:shadow-lg transition bg-gradient-to-r from-orange-500 to-red-600"
          >
            Next: Complete Your Booking
          </Button>
        </div>
      </div>

      {/* Booking Options Dialog */}
      <Dialog open={showPropertyDialog} onOpenChange={setShowPropertyDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">Choose Booking Method</DialogTitle>
            <DialogDescription className="text-center">
              Select how you'd like to complete your booking
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 py-4">
            {/* Book through WhatsApp */}
            <Button
              variant="outline"
              className="w-full h-auto py-6 px-6 text-left hover:bg-accent hover:border-primary transition-all"
              onClick={() => {
                setShowPropertyDialog(false);
                setShowWhatsAppForm(true);
              }}
            >
              <div className="flex flex-col items-start gap-1 w-full">
                <span className="font-semibold text-lg">Book through WhatsApp</span>
                <span className="text-sm text-muted-foreground">Chat with us to complete your booking</span>
              </div>
            </Button>

            {/* Book via Google Form */}
            <Button
              variant="outline"
              className="w-full h-auto py-6 px-6 text-left hover:bg-accent hover:border-primary transition-all"
              onClick={() => {
                window.open('https://forms.gle/SvpUBHTZ7jM2S5z98', '_blank');
              }}
            >
              <div className="flex flex-col items-start gap-1 w-full">
                <span className="font-semibold text-lg">Book Directly via Google Form</span>
                <span className="text-sm text-muted-foreground">Fill out our booking form online</span>
              </div>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* WhatsApp Booking Form */}
      <WhatsAppBookingForm 
        isOpen={showWhatsAppForm} 
        onClose={() => setShowWhatsAppForm(false)} 
      />
    </div>
  );
}
