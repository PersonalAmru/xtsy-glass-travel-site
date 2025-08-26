
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
import { ROOM_DATA } from '@/data/rooms/xtsy270';

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

  const roomsArray: Room[] = Object.values(ROOM_DATA);

  // Pre-select room immediately when params are available
  useEffect(() => {
    if (preSelectedRoom && preSelectedProperty) {
      try {
        const room = ROOM_DATA[preSelectedRoom as keyof typeof ROOM_DATA];
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
      const room = ROOM_DATA[roomId as keyof typeof ROOM_DATA];
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
    if (!guestDetails) return null;
    
    const checkIn = new Date();
    const checkOut = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const nights = 1;
    const guests = selectedRooms.reduce((total, room) => total + room.selection.guests, 0);
    const totalAmount = calculateTotalAmount();
    
    return {
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
      couponDiscount: 0
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

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Booking Flow</h1>
            <p className="text-gray-600">Step {step === 'rooms' ? '1' : step === 'guest' ? '2' : '3'} of 3</p>
          </div>

          {step === 'rooms' && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Choose Your Accommodation</h2>
                <p className="text-gray-600">Select from our available rooms and customize your stay</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {roomsArray.map((room) => {
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

              <div className="flex justify-end">
                <Button onClick={handleNext}>Next: Guest Details <User className="ml-2" /></Button>
              </div>
            </div>
          )}

          {step === 'guest' && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Guest Details Complete</h2>
                <p className="text-gray-600">Your contact information has been saved</p>
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
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Payment</h2>
                <p className="text-gray-600">Choose your payment method to complete the booking</p>
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
      {getBookingData() && (
        <GuestDetails
          isOpen={isGuestModalOpen}
          onClose={handleGuestModalClose}
          onBack={handleGuestModalBack}
          bookingData={getBookingData()!}
        />
      )}

      {/* UPI Payment Modal */}
      {getBookingData() && (
        <UPIPaymentModal 
          isOpen={isPaymentModalOpen} 
          onClose={() => setIsPaymentModalOpen(false)}
          bookingData={getBookingData()!}
        />
      )}
    </>
  );
};

export default BookingFlow;
