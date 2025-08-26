import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Users, MapPin, Phone, Mail, User, CreditCard } from 'lucide-react';
import RoomCard from '@/components/RoomCard';
import FastRoomCard from '@/components/FastRoomCard';
import GuestDetails from '@/components/GuestDetails';
import PaymentHandler from '@/components/PaymentHandler';
import UPIPaymentModal from '@/components/UPIPaymentModal';
import { toast } from 'sonner';
import { ROOM_DATA, XTSY270_DATA } from '@/data/rooms/xtsy270';

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

// All available rooms from the home page
const ALL_ROOMS_DATA: { [key: string]: Room } = {
  // XTSY Luxury
  'xtsy-270': {
    id: 'xtsy-270',
    name: XTSY270_DATA.name,
    price: XTSY270_DATA.price,
    image: XTSY270_DATA.image,
    description: XTSY270_DATA.description,
    amenities: XTSY270_DATA.features,
    type: 'private',
    maxGuests: XTSY270_DATA.maxGuests,
    propertyType: 'luxury'
  },
  
  // XTSY Travellers Hostel
  '4-bed-female-only-dorm': {
    id: '4-bed-female-only-dorm',
    name: 'Bed in 4 Bed Female Only Dorm',
    price: 850,
    image: 'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20Female%20Only%20Dorms/1.jpg',
    description: 'Female-only dormitory with modern amenities and comfortable beds',
    amenities: ['Female only', 'Attached bathroom', 'Wi-Fi', 'Locker', 'Common area', 'Reading lights', 'Power outlets', 'Complimentary breakfast'],
    type: 'dorm',
    maxGuests: 4,
    propertyType: 'hostel'
  },
  
  '4-bed-mixed-female-dorm': {
    id: '4-bed-mixed-female-dorm',
    name: 'Bed in 4 Bed Mixed/Female Dorm',
    price: 800,
    image: 'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20MixedFemale%20Dorms/3.jpg',
    description: 'Mixed or female dormitory with shared facilities and social atmosphere',
    amenities: ['Mixed/Female', 'Attached bathroom', 'Wi-Fi', 'Locker', 'Common area', 'Reading lights', 'Power outlets', 'Complimentary breakfast'],
    type: 'dorm',
    maxGuests: 4,
    propertyType: 'hostel'
  },
  
  '6-bed-mixed-female-dorm': {
    id: '6-bed-mixed-female-dorm',
    name: 'Bed in 6 Bed Mixed/Female Dorm',
    price: 700,
    image: 'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/1.JPG',
    description: 'Spacious mixed or female dormitory with modern amenities',
    amenities: ['Mixed/Female', 'Attached bathroom', 'Wi-Fi', 'Locker', 'Common area', 'Reading lights', 'Power outlets', 'Complimentary breakfast'],
    type: 'dorm',
    maxGuests: 6,
    propertyType: 'hostel'
  },
  
  'king-double-room': {
    id: 'king-double-room',
    name: 'King Double Room',
    price: 3200,
    image: 'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Double%20Room/1.jpg',
    description: 'Spacious private room with king bed for two guests',
    amenities: ['King bed', 'Valley view', 'Attached bath', 'Wi-Fi', 'Premium amenities', 'Mini fridge', 'Complimentary breakfast'],
    type: 'private',
    maxGuests: 4,
    propertyType: 'hostel'
  },
  
  'king-triple-room': {
    id: 'king-triple-room',
    name: 'King Triple Room',
    price: 4200,
    image: 'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Triple%20Room/1.jpg',
    description: 'Luxurious private room accommodating up to three guests',
    amenities: ['King bed + extra bed', 'Panoramic view', 'Attached bath', 'Wi-Fi', 'Premium amenities', 'Mini fridge', 'Complimentary breakfast'],
    type: 'private',
    maxGuests: 3,
    propertyType: 'hostel'
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
    maxGuests: 6,
    propertyType: 'economy'
  },
  
  '8-bed-mixed-economy-dorm': {
    id: '8-bed-mixed-economy-dorm',
    name: 'Bed in 8 Bed Mixed Dormitory',
    price: 450,
    image: 'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/8%20Bed%20Mixed%20Dorms/3.jpg',
    description: 'Most economical option for backpackers and budget travelers',
    amenities: ['Mixed', 'AC', 'Reading lights', 'Lockers', 'Budget Friendly'],
    type: 'dorm',
    maxGuests: 8,
    propertyType: 'economy'
  }
};

const BookingFlow = () => {
  const [searchParams] = useSearchParams();
  const preSelectedRoom = searchParams.get('room');
  const preSelectedProperty = searchParams.get('property');

  const [step, setStep] = useState<'rooms' | 'guest' | 'payment'>('rooms');
  const [selectedRooms, setSelectedRooms] = useState<SelectedRoom[]>([]);
  const [guestDetails, setGuestDetails] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    zipCode: string;
  } | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);

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
              guests: room.type === 'private' ? 1 : 1,
              rooms: room.type === 'private' ? 1 : 0
            }
          }]);
        }
      } catch (error) {
        console.error('Error pre-selecting room:', error);
      }
    }
  }, [preSelectedRoom, preSelectedProperty]);

  const handleRoomSelect = (roomId: string) => {
    setSelectedRooms(prev => {
      const room = ALL_ROOMS_DATA[roomId as keyof typeof ALL_ROOMS_DATA];
      const isSelected = prev.find(r => r.id === roomId);

      if (isSelected) {
        return prev.filter(r => r.id !== roomId);
      } else {
        return [...prev, {
          id: room.id,
          name: room.name,
          price: room.price,
          type: room.type,
          selection: {
            guests: room.type === 'private' ? 1 : 1,
            rooms: room.type === 'private' ? 1 : 0
          }
        }];
      }
    });
  };

  const handleGuestChange = (roomId: string, guests: number) => {
    setSelectedRooms(prev => {
      return prev.map(room => {
        if (room.id === roomId) {
          return { ...room, selection: { ...room.selection, guests } };
        }
        return room;
      });
    });
  };

  const handleRoomChange = (roomId: string, rooms: number) => {
    setSelectedRooms(prev => {
      return prev.map(room => {
        if (room.id === roomId) {
          return { ...room, selection: { ...room.selection, rooms } };
        }
        return room;
      });
    });
  };

  const handleNext = () => {
    if (step === 'rooms') {
      if (selectedRooms.length === 0) {
        toast.error('Please select at least one room');
        return;
      }
      setIsGuestModalOpen(true);
    } else if (step === 'guest') {
      if (!guestDetails) {
        toast.error('Please fill in your details');
        return;
      }
      setStep('payment');
    } else if (step === 'payment') {
      if (!paymentMethod) {
        toast.error('Please select a payment method');
        return;
      }

      if (paymentMethod === 'upi') {
        setIsPaymentModalOpen(true);
      } else {
        toast.success('Payment processed successfully!');
      }
    }
  };

  const handlePrevious = () => {
    if (step === 'guest') {
      setStep('rooms');
    } else if (step === 'payment') {
      setStep('guest');
    }
  };

  const handlePayment = (method: 'card' | 'upi') => {
    setPaymentMethod(method);
  };

  const calculateTotalAmount = () => {
    return selectedRooms.reduce((total, room) => {
      return total + (room.price * room.selection.guests * (room.type === 'private' ? room.selection.rooms : 1));
    }, 0);
  };

  const generateBookingId = () => {
    return `XTSY-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
  };

  const getBookingData = () => {
    const checkIn = new Date();
    const checkOut = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const nights = 1;
    const guests = selectedRooms.reduce((total, room) => total + room.selection.guests, 0);
    const totalAmount = calculateTotalAmount();
    
    return {
      bookingId: generateBookingId(),
      guestName: guestDetails ? `${guestDetails.firstName} ${guestDetails.lastName}` : '',
      checkIn: checkIn.toISOString(),
      checkOut: checkOut.toISOString(),
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
    setIsGuestModalOpen(false);
    setStep('rooms');
  };

  const handleGuestModalClose = () => {
    setIsGuestModalOpen(false);
    if (guestDetails) {
      setStep('guest');
    }
  };

  // Group rooms by property type for better organization
  const roomsByProperty = {
    luxury: roomsArray.filter(room => room.propertyType === 'luxury'),
    hostel: roomsArray.filter(room => room.propertyType === 'hostel'),
    economy: roomsArray.filter(room => room.propertyType === 'economy')
  };

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center">
            <div className="inline-block">
              <div className="glass-card rounded-3xl p-8 mx-auto max-w-2xl bg-gradient-to-br from-white/20 via-white/10 to-transparent backdrop-blur-xl border border-white/30 shadow-2xl">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-orange-500/20 rounded-2xl blur-xl"></div>
                  <div className="relative z-10">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 font-playfair">
                      Live the Shillong Vibe
                    </h1>
                    <p className="text-lg text-white font-medium drop-shadow-lg">
                      Experience the magic of the hills
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {step === 'rooms' && (
            <div className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-3 sm:mb-4 font-playfair">
                  Choose Your Accommodation
                </h2>
                <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
                  Select from our available rooms and customize your stay
                </p>
                <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-6 rounded-full" />
              </div>
              
              {/* XTSY Luxury Section */}
              {roomsByProperty.luxury.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-2xl sm:text-3xl font-bold text-center font-playfair bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                    XTSY Luxury
                  </h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {roomsByProperty.luxury.map((room) => {
                      const selectedRoom = selectedRooms.find(r => r.id === room.id);
                      const isSelected = !!selectedRoom;
                      const selection = selectedRoom?.selection || { guests: 1, rooms: room.type === 'private' ? 1 : 0 };
                      
                      return (
                        <FastRoomCard
                          key={room.id}
                          room={room}
                          isSelected={isSelected}
                          selection={selection}
                          onSelect={handleRoomSelect}
                          onGuestChange={handleGuestChange}
                          onRoomChange={handleRoomChange}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* XTSY Travellers Hostel Section */}
              {roomsByProperty.hostel.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-2xl sm:text-3xl font-bold text-center font-playfair bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                    XTSY Travellers Hostel
                  </h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {roomsByProperty.hostel.map((room) => {
                      const selectedRoom = selectedRooms.find(r => r.id === room.id);
                      const isSelected = !!selectedRoom;
                      const selection = selectedRoom?.selection || { guests: 1, rooms: room.type === 'private' ? 1 : 0 };
                      
                      return (
                        <FastRoomCard
                          key={room.id}
                          room={room}
                          isSelected={isSelected}
                          selection={selection}
                          onSelect={handleRoomSelect}
                          onGuestChange={handleGuestChange}
                          onRoomChange={handleRoomChange}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* XTSY Economy Section */}
              {roomsByProperty.economy.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-2xl sm:text-3xl font-bold text-center font-playfair bg-gradient-to-r from-green-500 to-teal-600 bg-clip-text text-transparent">
                    XTSY Economy
                  </h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {roomsByProperty.economy.map((room) => {
                      const selectedRoom = selectedRooms.find(r => r.id === room.id);
                      const isSelected = !!selectedRoom;
                      const selection = selectedRoom?.selection || { guests: 1, rooms: room.type === 'private' ? 1 : 0 };
                      
                      return (
                        <FastRoomCard
                          key={room.id}
                          room={room}
                          isSelected={isSelected}
                          selection={selection}
                          onSelect={handleRoomSelect}
                          onGuestChange={handleGuestChange}
                          onRoomChange={handleRoomChange}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-6">
                <Button onClick={handleNext} size="lg">
                  Next: Guest Details <User className="ml-2" />
                </Button>
              </div>
            </div>
          )}

          {step === 'guest' && (
            <div className="space-y-6">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-3 sm:mb-4 font-playfair">
                  Guest Details Complete
                </h2>
                <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
                  Your contact information has been saved
                </p>
                <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-6 rounded-full" />
              </div>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Guest Information</h3>
                  {guestDetails && (
                    <div className="space-y-2 text-sm">
                      <p><strong>Name:</strong> {guestDetails.firstName} {guestDetails.lastName}</p>
                      <p><strong>Email:</strong> {guestDetails.email}</p>
                      <p><strong>Phone:</strong> {guestDetails.phone}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="flex justify-between">
                <Button variant="outline" onClick={handlePrevious}><CalendarDays className="mr-2" /> Previous: Rooms</Button>
                <Button onClick={handleNext}>Next: Payment <CreditCard className="ml-2" /></Button>
              </div>
            </div>
          )}

          {step === 'payment' && (
            <div className="space-y-6">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-3 sm:mb-4 font-playfair">
                  Payment
                </h2>
                <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
                  Choose your payment method to complete the booking
                </p>
                <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-6 rounded-full" />
              </div>

              <Card>
                <CardContent className="p-6 space-y-4">
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
                      <span className="text-xl font-bold text-orange-600">₹{calculateTotalAmount()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between">
                <Button variant="outline" onClick={handlePrevious}><User className="mr-2" /> Previous: Guest Details</Button>
                <Button onClick={handleNext}>Complete Booking <CreditCard className="ml-2" /></Button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Guest Details Modal */}
      <GuestDetails
        isOpen={isGuestModalOpen}
        onClose={handleGuestModalClose}
        onBack={handleGuestModalBack}
        bookingData={getBookingData()}
      />

      {/* UPI Payment Modal */}
      <UPIPaymentModal 
        isOpen={isPaymentModalOpen} 
        onClose={() => setIsPaymentModalOpen(false)}
        bookingData={getBookingData()}
      />
    </>
  );
};

export default BookingFlow;
