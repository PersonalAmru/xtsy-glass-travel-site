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
import { differenceInDays, parseISO } from 'date-fns';
import Header from '@/components/Header';
import { XTSY270_DATA } from '@/data/rooms/xtsy270';
import { useApp } from '@/contexts/AppContext';
import { generateStandardizedFeatures } from '@/utils/roomFeatures';

interface Room {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  amenities: string[];
  type: 'dorm' | 'private';
  maxGuests: number;
  propertyType: 'luxury' | 'hostel' | 'economy';
  maxRooms?: number;
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

const generateFeatures = generateStandardizedFeatures;

// --- SAMPLE: keep your full dataset as before; leaving one here as a reference ---
const ALL_ROOMS_DATA: { [key: string]: Room } = {
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
  // ...KEEP all your other room entries exactly as they were
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
    try { return differenceInDays(parseISO(bookingDates.checkOut), parseISO(bookingDates.checkIn)); }
    catch { return 1; }
  }, [bookingDates.checkIn, bookingDates.checkOut]);

  const roomsArray: Room[] = Object.values(ALL_ROOMS_DATA);

  // Grouped by property
  const roomsByProperty = {
    luxury: roomsArray.filter(r => r.propertyType === 'luxury'),
    hostel: roomsArray.filter(r => r.propertyType === 'hostel'),
    economy: roomsArray.filter(r => r.propertyType === 'economy'),
  };

  // Helper: aggregate distinct amenities for a property (first 10)
  const getPropertyFeatures = (property: 'luxury' | 'hostel' | 'economy', fallback: string[] = []) => {
    const all = roomsByProperty[property];
    const amenitySet = new Set<string>();
    all.forEach(r => (r.amenities || []).forEach(a => amenitySet.add(a)));
    const list = Array.from(amenitySet);
    if (list.length === 0) return fallback;
    return list.slice(0, 12);
  };

  // Chips data per section
  const luxuryFeatures = getPropertyFeatures('luxury', XTSY270_DATA.features || []);
  const hostelFeatures = getPropertyFeatures('hostel', []);
  const economyFeatures = getPropertyFeatures('economy', []);

  useEffect(() => {
    const preSelectedRoom = searchParams.get('room');
    const preSelectedProperty = searchParams.get('property');
    if (preSelectedRoom && preSelectedProperty) {
      try {
        const room = ALL_ROOMS_DATA[preSelectedRoom as keyof typeof ALL_ROOMS_DATA];
        if (room && room.propertyType === preSelectedProperty) {
          setSelectedRooms([{
            id: room.id,
            name: room.name,
            price: room.price,
            type: room.type,
            selection: { guests: room.type === 'dorm' ? 1 : room.maxGuests, rooms: 0 }
          }]);
        }
      } catch (e) {
        console.error('Preselect room failed:', e);
      }
    }
  }, [searchParams]);

  const handleRoomSelect = React.useCallback((roomId: string) => {
    setSelectedRooms(prev => {
      const room = ALL_ROOMS_DATA[roomId as keyof typeof ALL_ROOMS_DATA];
      const already = prev.find(r => r.id === roomId);
      if (already) return prev.filter(r => r.id !== roomId);
      const newEntry: SelectedRoom = {
        id: room.id, name: room.name, price: room.price, type: room.type,
        selection: { guests: room.type === 'dorm' ? 1 : room.maxGuests, rooms: 0 }
      };
      return [...prev, newEntry];
    });
  }, []);

  const handleGuestChange = React.useCallback((roomId: string, guests: number) => {
    setSelectedRooms(prev => prev.map(r => r.id === roomId ? { ...r, selection: { ...r.selection, guests } } : r));
  }, []);

  const handleRoomChange = React.useCallback((roomId: string, rooms: number) => {
    setSelectedRooms(prev => {
      const exists = prev.find(r => r.id === roomId);
      if (exists) return prev.map(r => r.id === roomId ? { ...r, selection: { ...r.selection, rooms } } : r);
      if (rooms <= 0) return prev;
      const room = ALL_ROOMS_DATA[roomId as keyof typeof ALL_ROOMS_DATA];
      if (!room) return prev;
      return [...prev, {
        id: room.id, name: room.name, price: room.price, type: room.type,
        selection: { guests: room.type === 'dorm' ? 1 : room.maxGuests, rooms }
      }];
    });
  }, []);

  const validateGuestAccommodation = () => {
    if (selectedRooms.length === 0) return false;
    const total = selectedRooms.reduce((sum, r) => {
      if (r.type === 'dorm') return sum + r.selection.rooms;
      const src = ALL_ROOMS_DATA[r.id];
      return sum + r.selection.rooms * (src?.maxGuests || 1);
    }, 0);
    return total >= bookingDates.guests;
  };

  const handleNext = () => {
    if (currentStep === 'rooms') {
      if (selectedRooms.length === 0) return toast.error('Please select at least one room or bed');
      if (!validateGuestAccommodation()) return toast.error(`Please select enough beds/rooms to accommodate all ${bookingDates.guests} guests`);
      setShowGuestModal(true);
      return;
    }
    if (currentStep === 'guest') {
      if (!guestDetails.firstName || !guestDetails.email) return toast.error('Please fill in your details');
      setCurrentStep('payment');
      return;
    }
    if (currentStep === 'payment') {
      if (!paymentMethod) return toast.error('Please select a payment method');
      if (paymentMethod === 'upi') setShowUPIModal(true);
      else toast.success('Payment processed successfully!');
    }
  };

  const handlePrevious = () => {
    if (currentStep === 'guest') return setCurrentStep('rooms');
    if (currentStep === 'payment') return setCurrentStep('guest');
  };

  const calculateTotalAmount = () =>
    selectedRooms.reduce((sum, r) => sum + r.price * r.selection.rooms * nights, 0);

  const generateBookingId = () =>
    `XTSY-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

  const getRoomSelection = React.useCallback(
    (roomId: string) => selectedRooms.find(r => r.id === roomId)?.selection || { guests: 1, rooms: 0 },
    [selectedRooms]
  );
  const isRoomSelected = React.useCallback(
    (roomId: string) => !!selectedRooms.find(r => r.id === roomId),
    [selectedRooms]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      <Header />

      {/* Back + Title */}
      <div className={`absolute top-20 left-4 z-10 ${isMobileView ? 'top-16 left-2' : 'top-20 left-6'}`}>
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-900 hover:bg-transparent focus:ring-0 focus:outline-none">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="font-bold text-gray-900 text-2xl md:text-3xl">Choose Your Stay</h1>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4 pt-28">
        {/* Summary */}
        <div className="flex justify-center mb-8">
          <div className="w-full max-w-lg">
            <BookingSummary
              checkIn={bookingDates.checkIn}
              checkOut={bookingDates.checkOut}
              guests={bookingDates.guests}
              nights={nights}
            />
          </div>
        </div>

        {/* ROOMS STEP */}
        {currentStep === 'rooms' && (
          <div className="space-y-8">
            {/* XTSY Luxury */}
            {roomsByProperty.luxury.length > 0 && (
              <div className="space-y-4 mt-2">
                <div className="backdrop-blur-md bg-white/20 border border-white/20 rounded-2xl shadow-lg mx-auto px-6 py-4 md:py-5 max-w-5xl">
                  <h3 className="font-bold text-center font-playfair bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent text-xl md:text-3xl">
                    XTSY Luxury
                  </h3>
                  <p className="text-center text-gray-600 mt-1 text-base md:whitespace-nowrap">
                    Premium accommodations with panoramic views. Ultra Luxury Views is a 200% Guarantee
                  </p>
                  {luxuryFeatures.length > 0 && (
                    <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                      {luxuryFeatures.map((f, i) => (
                        <span key={`lux-${i}`} className="inline-block rounded-full border border-orange-300/60 bg-white/60 px-3 py-1 text-xs font-medium text-orange-700 shadow-sm backdrop-blur">
                          {f}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="w-16 h-0.5 bg-gradient-to-r from-orange-500 to-red-600 mx-auto mt-3 rounded-full" />
                </div>

                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {roomsByProperty.luxury.map(room => {
                    const selection = getRoomSelection(room.id);
                    const isSelected = isRoomSelected(room.id);
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

            {/* XTSY Travellers Hostel */}
            {roomsByProperty.hostel.length > 0 && (
              <div className="space-y-4">
                <div className="backdrop-blur-md bg-white/20 border border-white/20 rounded-2xl shadow-lg mx-auto px-6 py-4 md:py-5 max-w-5xl">
                  <h3 className="font-bold text-center font-playfair bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent text-xl md:text-3xl">
                    XTSY Travellers Hostel
                  </h3>
                  <p className="text-center text-gray-600 mt-1 text-base md:whitespace-nowrap">
                    Comfortable stays with modern amenities. This isn't just a stay. It's a vibe
                  </p>
                  {hostelFeatures.length > 0 && (
                    <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                      {hostelFeatures.map((f, i) => (
                        <span key={`hos-${i}`} className="inline-block rounded-full border border-blue-300/60 bg-white/60 px-3 py-1 text-xs font-medium text-blue-700 shadow-sm backdrop-blur">
                          {f}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="w-16 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mt-3 rounded-full" />
                </div>

                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {roomsByProperty.hostel.map(room => {
                    const selection = getRoomSelection(room.id);
                    const isSelected = isRoomSelected(room.id);
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

            {/* XTSY Economy */}
            {roomsByProperty.economy.length > 0 && (
              <div className="space-y-4">
                <div className="backdrop-blur-md bg-white/20 border border-white/20 rounded-2xl shadow-lg mx-auto px-6 py-4 md:py-5 max-w-5xl">
                  <h3 className="font-bold text-center font-playfair bg-gradient-to-r from-green-500 to-teal-600 bg-clip-text text-transparent text-xl md:text-3xl">
                    XTSY Economy
                  </h3>
                  <p className="text-center text-gray-600 mt-1 text-base md:whitespace-nowrap">
                    Budget-friendly options for backpackers. No access to Common Area, Shared Lounge or Games Room.
                  </p>
                  {economyFeatures.length > 0 && (
                    <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                      {economyFeatures.map((f, i) => (
                        <span key={`eco-${i}`} className="inline-block rounded-full border border-emerald-300/60 bg-white/60 px-3 py-1 text-xs font-medium text-emerald-700 shadow-sm backdrop-blur">
                          {f}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="w-16 h-0.5 bg-gradient-to-r from-green-500 to-teal-600 mx-auto mt-3 rounded-full" />
                </div>

                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {roomsByProperty.economy.map(room => {
                    const selection = getRoomSelection(room.id);
                    const isSelected = isRoomSelected(room.id);
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

            {/* Spacer for fixed CTA */}
            <div className="h-[92px] md:h-[100px]" />
          </div>
        )}

        {/* GUEST STEP */}
        {currentStep === 'guest' && (
          <div className="space-y-6">
            <div className="text-center mb-12">
              <h2 className="font-bold text-gray-800 mb-3 font-playfair text-2xl md:text-5xl">Guest Details Complete</h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">Your contact information has been saved</p>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-6 rounded-full" />
            </div>

            <Card>
              <CardContent className="p-6">
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
              <Button variant="outline" onClick={() => setCurrentStep('rooms')}>Previous: Rooms</Button>
              <Button onClick={() => setCurrentStep('payment')}>Next: Payment</Button>
            </div>
          </div>
        )}

        {/* PAYMENT STEP */}
        {currentStep === 'payment' && (
          <div className="space-y-6">
            <div className="text-center mb-12">
              <h2 className="font-bold text-gray-800 mb-3 font-playfair text-2xl md:text-5xl">Payment</h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">Choose your payment method to complete the booking</p>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-6 rounded-full" />
            </div>

            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold mb-4">Select Payment Method</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" onClick={() => setPaymentMethod('card')}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Credit/Debit Card
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => setPaymentMethod('upi')}>
                    <Phone className="mr-2 h-4 w-4" />
                    UPI Payment
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep('guest')}>Previous: Guest Details</Button>
              <Button onClick={() => toast.success('Payment processed successfully!')}>Complete Booking</Button>
            </div>
          </div>
        )}
      </div>

      {/* Fixed bottom CTA (stable center; no shaking on currency change) */}
      {currentStep === 'rooms' && (
        <div className="
          fixed bottom-0 left-1/2 -translate-x-1/2 z-50
          w-full max-w-5xl px-4
          pb-[calc(env(safe-area-inset-bottom,0px)+12px)] pt-3
          bg-transparent pointer-events-none
          transform transition-none
        ">
          <div className="flex justify-center">
            <Button
              onClick={handleNext}
              className="pointer-events-auto rounded-xl px-6 md:px-8 py-3 md:py-3.5 text-white font-semibold shadow-md hover:shadow-lg bg-gradient-to-r from-orange-500 to-red-600 transition-none"
            >
              Next: Complete Your Booking
            </Button>
          </div>
        </div>
      )}

      <GuestDetails
        isOpen={showGuestModal}
        onClose={() => { setShowGuestModal(false); if (guestDetails.firstName && guestDetails.email) setCurrentStep('guest'); }}
        onBack={() => { setShowGuestModal(false); setCurrentStep('rooms'); }}
        bookingData={{
          bookingId: generateBookingId(),
          guestName: `${guestDetails.firstName} ${guestDetails.lastName}`.trim(),
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
          whatsappNumber: guestDetails?.phone || '',
          addOns: { breakfast: 0, dinnerVeg: 0, dinnerNonVeg: 0, transportation: false, itineraryPlanning: false },
          addOnTotal: 0
        }}
      />

      <UPIPaymentModal
        isOpen={showUPIModal}
        onClose={() => setShowUPIModal(false)}
        bookingData={{
          bookingId: generateBookingId(),
          guestName: `${guestDetails.firstName} ${guestDetails.lastName}`.trim(),
          checkIn: bookingDates.checkIn,
          checkOut: bookingDates.checkOut,
          guests: selectedRooms.reduce((t, r) => t + r.selection.guests, 0),
          nights,
          selectedRooms,
          totalAmount: calculateTotalAmount(),
          gstAmount: 0,
          subtotal: calculateTotalAmount(),
          discountAmount: 0
        }}
      />
    </div>
  );
}
