/**
 * BookingFlow - iOS-Style Guest Booking Interface
 * Apple Human Interface Guidelines compliant
 * Mobile-first, gesture-based, dark mode ready
 * 
 * Flow: Dates → Rooms → Summary → Guest Details → Confirmation
 */

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { format, differenceInDays, parseISO, addDays, isBefore, isAfter, startOfToday } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Users, Bed, Check, MapPin, Phone, Mail, User, ArrowLeft, Home, Sparkles, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useApp } from '@/contexts/AppContext';
import { createBooking } from '@/services/bookingService';
import UnifiedImage from '@/components/UnifiedImage';

// Step definitions
type BookingStep = 'dates' | 'rooms' | 'summary' | 'details' | 'confirmation';

const STEPS: { id: BookingStep; title: string; subtitle: string }[] = [
  { id: 'dates', title: 'Select Dates', subtitle: 'When are you visiting?' },
  { id: 'rooms', title: 'Choose Room', subtitle: 'Find your perfect stay' },
  { id: 'summary', title: 'Review', subtitle: 'Your booking summary' },
  { id: 'details', title: 'Guest Info', subtitle: 'Complete your booking' },
  { id: 'confirmation', title: 'Confirmed', subtitle: 'You\'re all set!' },
];

// Room type interface
interface RoomType {
  id: string;
  name: string;
  category: string;
  kind: string;
  base_price: number;
  weekday_price: number | null;
  weekend_price: number | null;
  capacity: number;
  total_units: number;
  amenities: string[];
  images: string[];
  is_active: boolean;
}

interface SelectedRoom {
  roomTypeId: string;
  roomTypeName: string;
  quantity: number;
  pricePerNight: number;
  capacity: number;
}

interface GuestDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  specialRequests: string;
}

// iOS-style page transition variants
const pageVariants = {
  initial: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  in: {
    x: 0,
    opacity: 1,
  },
  out: (direction: number) => ({
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
  }),
};

const pageTransition = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 30,
};

// iOS-style step indicator
const StepIndicator = ({ currentStep, steps }: { currentStep: BookingStep; steps: typeof STEPS }) => {
  const currentIndex = steps.findIndex(s => s.id === currentStep);
  
  return (
    <div className="flex items-center justify-center gap-2 py-4">
      {steps.slice(0, 4).map((step, index) => (
        <div
          key={step.id}
          className={cn(
            "w-2 h-2 rounded-full transition-all duration-300",
            index === currentIndex
              ? "w-6 bg-primary"
              : index < currentIndex
              ? "bg-primary/60"
              : "bg-muted-foreground/30"
          )}
        />
      ))}
    </div>
  );
};

// iOS-style header
const BookingHeader = ({ 
  step, 
  onBack, 
  canGoBack 
}: { 
  step: typeof STEPS[0]; 
  onBack: () => void; 
  canGoBack: boolean;
}) => (
  <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50 safe-area-top">
    <div className="flex items-center justify-between px-4 h-14">
      <div className="w-16">
        {canGoBack && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-primary hover:bg-transparent -ml-2"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back
          </Button>
        )}
      </div>
      <div className="text-center">
        <h1 className="text-lg font-semibold">{step.title}</h1>
      </div>
      <div className="w-16" />
    </div>
  </div>
);

// Date Selection Step with iOS Calendar
const DateSelectionStep = ({
  checkIn,
  checkOut,
  onCheckInChange,
  onCheckOutChange,
  onNext,
}: {
  checkIn: Date | undefined;
  checkOut: Date | undefined;
  onCheckInChange: (date: Date | undefined) => void;
  onCheckOutChange: (date: Date | undefined) => void;
  onNext: () => void;
}) => {
  const today = startOfToday();
  const [selectingCheckOut, setSelectingCheckOut] = useState(false);
  
  const nights = useMemo(() => {
    if (checkIn && checkOut) {
      return differenceInDays(checkOut, checkIn);
    }
    return 0;
  }, [checkIn, checkOut]);

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    if (!selectingCheckOut) {
      onCheckInChange(date);
      onCheckOutChange(undefined);
      setSelectingCheckOut(true);
    } else {
      if (checkIn && isAfter(date, checkIn)) {
        onCheckOutChange(date);
        setSelectingCheckOut(false);
      } else {
        onCheckInChange(date);
        setSelectingCheckOut(true);
      }
    }
  };

  const isValidSelection = checkIn && checkOut && nights >= 1;

  return (
    <div className="flex flex-col min-h-[calc(100vh-8rem)] px-4 pb-24">
      {/* Date Display Cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Card 
          className={cn(
            "p-4 cursor-pointer transition-all",
            !selectingCheckOut && "ring-2 ring-primary"
          )}
          onClick={() => setSelectingCheckOut(false)}
        >
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Check-in</p>
          <p className="text-lg font-semibold">
            {checkIn ? format(checkIn, 'MMM d, yyyy') : 'Select date'}
          </p>
          <p className="text-sm text-muted-foreground">After 12:00 PM</p>
        </Card>
        <Card 
          className={cn(
            "p-4 cursor-pointer transition-all",
            selectingCheckOut && checkIn && "ring-2 ring-primary"
          )}
          onClick={() => checkIn && setSelectingCheckOut(true)}
        >
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Check-out</p>
          <p className="text-lg font-semibold">
            {checkOut ? format(checkOut, 'MMM d, yyyy') : 'Select date'}
          </p>
          <p className="text-sm text-muted-foreground">Before 10:00 AM</p>
        </Card>
      </div>

      {/* Nights Indicator */}
      {nights > 0 && (
        <div className="text-center mb-4">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-medium">
            <Bed className="w-4 h-4" />
            {nights} night{nights > 1 ? 's' : ''}
          </span>
        </div>
      )}

      {/* iOS-style Calendar */}
      <Card className="p-4 flex-1">
        <Calendar
          mode="single"
          selected={selectingCheckOut ? checkOut : checkIn}
          onSelect={handleDateSelect}
          disabled={(date) => isBefore(date, today)}
          modifiers={{
            range: checkIn && checkOut ? { from: checkIn, to: checkOut } : undefined,
            rangeStart: checkIn,
            rangeEnd: checkOut,
          }}
          modifiersStyles={{
            range: { backgroundColor: 'hsl(var(--primary) / 0.1)' },
            rangeStart: { backgroundColor: 'hsl(var(--primary))', color: 'white' },
            rangeEnd: { backgroundColor: 'hsl(var(--primary))', color: 'white' },
          }}
          className="w-full pointer-events-auto"
        />
      </Card>

      {/* Continue Button - Fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-xl border-t border-border/50 safe-area-bottom">
        <Button
          onClick={onNext}
          disabled={!isValidSelection}
          className="w-full h-12 text-base font-semibold rounded-xl"
          size="lg"
        >
          Continue to Room Selection
        </Button>
      </div>
    </div>
  );
};

// Room Selection Step
const RoomSelectionStep = ({
  rooms,
  selectedRoom,
  quantity,
  checkIn,
  checkOut,
  onRoomSelect,
  onQuantityChange,
  onNext,
  formatPrice,
}: {
  rooms: RoomType[];
  selectedRoom: RoomType | null;
  quantity: number;
  checkIn: Date;
  checkOut: Date;
  onRoomSelect: (room: RoomType) => void;
  onQuantityChange: (qty: number) => void;
  onNext: () => void;
  formatPrice: (amount: number) => string;
}) => {
  const nights = differenceInDays(checkOut, checkIn);

  const getRoomPrice = (room: RoomType) => {
    // Check if any dates fall on weekend (Fri, Sat, Sun)
    const isWeekend = checkIn.getDay() >= 5 || checkIn.getDay() === 0;
    if (isWeekend && room.weekend_price) {
      return room.weekend_price;
    }
    return room.weekday_price || room.base_price;
  };

  const groupedRooms = useMemo(() => {
    const groups: Record<string, RoomType[]> = {};
    rooms.forEach(room => {
      if (!groups[room.category]) {
        groups[room.category] = [];
      }
      groups[room.category].push(room);
    });
    return groups;
  }, [rooms]);

  return (
    <div className="flex flex-col min-h-[calc(100vh-8rem)] pb-32">
      {/* Date Summary */}
      <div className="px-4 py-3 bg-muted/50 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <CalendarIcon className="w-4 h-4 text-muted-foreground" />
          <span>{format(checkIn, 'MMM d')} - {format(checkOut, 'MMM d')}</span>
          <span className="text-muted-foreground">({nights} night{nights > 1 ? 's' : ''})</span>
        </div>
      </div>

      {/* Room Categories */}
      <div className="px-4 py-4 space-y-6">
        {Object.entries(groupedRooms).map(([category, categoryRooms]) => (
          <div key={category}>
            <h3 className="text-lg font-semibold mb-3 capitalize">{category}</h3>
            <div className="space-y-3">
              {categoryRooms.map(room => {
                const price = getRoomPrice(room);
                const isSelected = selectedRoom?.id === room.id;
                const isDorm = room.kind === 'dorm';
                
                return (
                  <Card
                    key={room.id}
                    className={cn(
                      "overflow-hidden transition-all cursor-pointer",
                      isSelected && "ring-2 ring-primary"
                    )}
                    onClick={() => onRoomSelect(room)}
                  >
                    <div className="flex">
                      {/* Room Image */}
                      <div className="w-28 h-28 flex-shrink-0 bg-muted">
                        {room.images?.[0] && (
                          <UnifiedImage
                            src={room.images[0]}
                            alt={room.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      
                      {/* Room Info */}
                      <div className="flex-1 p-3 flex flex-col justify-between">
                        <div>
                          <h4 className="font-medium text-sm line-clamp-2">{room.name}</h4>
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <Users className="w-3 h-3" />
                            <span>{isDorm ? '1 guest per bed' : `Up to ${room.capacity} guests`}</span>
                          </div>
                        </div>
                        <div className="flex items-end justify-between">
                          <div>
                            <span className="text-lg font-bold">{formatPrice(price)}</span>
                            <span className="text-xs text-muted-foreground">
                              /{isDorm ? 'bed' : 'room'}/night
                            </span>
                          </div>
                          {isSelected && (
                            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                              <Check className="w-4 h-4 text-primary-foreground" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Quantity Selector (when selected) */}
                    {isSelected && (
                      <div className="px-3 py-3 bg-muted/50 border-t flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {isDorm ? 'Number of beds' : 'Number of rooms'}
                        </span>
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              onQuantityChange(Math.max(1, quantity - 1));
                            }}
                          >
                            <span className="text-lg">−</span>
                          </Button>
                          <span className="w-8 text-center font-semibold">{quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              onQuantityChange(Math.min(room.total_units, quantity + 1));
                            }}
                          >
                            <span className="text-lg">+</span>
                          </Button>
                        </div>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Continue Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-xl border-t border-border/50 safe-area-bottom">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm text-muted-foreground">Total for {nights} night{nights > 1 ? 's' : ''}</p>
            <p className="text-xl font-bold">
              {selectedRoom ? formatPrice(getRoomPrice(selectedRoom) * quantity * nights) : '—'}
            </p>
          </div>
        </div>
        <Button
          onClick={onNext}
          disabled={!selectedRoom}
          className="w-full h-12 text-base font-semibold rounded-xl"
          size="lg"
        >
          Review Booking
        </Button>
      </div>
    </div>
  );
};

// Summary Step
const SummaryStep = ({
  checkIn,
  checkOut,
  selectedRoom,
  quantity,
  nights,
  formatPrice,
  onNext,
}: {
  checkIn: Date;
  checkOut: Date;
  selectedRoom: RoomType;
  quantity: number;
  nights: number;
  formatPrice: (amount: number) => string;
  onNext: () => void;
}) => {
  const pricePerNight = selectedRoom.weekday_price || selectedRoom.base_price;
  const subtotal = pricePerNight * quantity * nights;
  const gstRate = selectedRoom.kind === 'dorm' ? 0 : 0.12;
  const gst = Math.round(subtotal * gstRate);
  const total = subtotal + gst;

  return (
    <div className="flex flex-col min-h-[calc(100vh-8rem)] px-4 pb-32">
      {/* Property Card */}
      <Card className="p-4 mb-4">
        <div className="flex gap-3">
          <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
            {selectedRoom.images?.[0] && (
              <UnifiedImage
                src={selectedRoom.images[0]}
                alt={selectedRoom.name}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">{selectedRoom.name}</h3>
            <p className="text-sm text-muted-foreground">{selectedRoom.category}</p>
            <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
              <MapPin className="w-3 h-3" />
              <span>XTSY Travellers Hostel, Shillong</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Date & Guests */}
      <Card className="p-4 mb-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Check-in</p>
            <p className="font-semibold">{format(checkIn, 'EEE, MMM d')}</p>
            <p className="text-sm text-muted-foreground">After 12:00 PM</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Check-out</p>
            <p className="font-semibold">{format(checkOut, 'EEE, MMM d')}</p>
            <p className="text-sm text-muted-foreground">Before 10:00 AM</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{selectedRoom.kind === 'dorm' ? 'Beds' : 'Rooms'}</span>
            <span className="font-medium">{quantity}</span>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-muted-foreground">Nights</span>
            <span className="font-medium">{nights}</span>
          </div>
        </div>
      </Card>

      {/* Price Breakdown */}
      <Card className="p-4 mb-4">
        <h4 className="font-semibold mb-3">Price Breakdown</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              {formatPrice(pricePerNight)} × {quantity} × {nights} night{nights > 1 ? 's' : ''}
            </span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          {gst > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">GST ({gstRate * 100}%)</span>
              <span>{formatPrice(gst)}</span>
            </div>
          )}
          <div className="flex justify-between pt-2 border-t font-semibold text-base">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      </Card>

      {/* Pay at Hotel Badge */}
      <div className="flex items-center gap-3 p-4 bg-green-500/10 rounded-xl mb-4">
        <Shield className="w-5 h-5 text-green-600" />
        <div>
          <p className="font-medium text-green-700 dark:text-green-400">Pay at Hotel</p>
          <p className="text-sm text-muted-foreground">No advance payment required</p>
        </div>
      </div>

      {/* Continue Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-xl border-t border-border/50 safe-area-bottom">
        <Button
          onClick={onNext}
          className="w-full h-12 text-base font-semibold rounded-xl"
          size="lg"
        >
          Continue to Guest Details
        </Button>
      </div>
    </div>
  );
};

// Guest Details Step
const GuestDetailsStep = ({
  guestDetails,
  onChange,
  onSubmit,
  isSubmitting,
}: {
  guestDetails: GuestDetails;
  onChange: (field: keyof GuestDetails, value: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}) => {
  const [errors, setErrors] = useState<Partial<GuestDetails>>({});

  const validate = () => {
    const newErrors: Partial<GuestDetails> = {};
    if (!guestDetails.name.trim()) newErrors.name = 'Name is required';
    if (!guestDetails.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestDetails.email)) {
      newErrors.email = 'Valid email is required';
    }
    if (!guestDetails.phone.trim() || !/^[6-9]\d{9}$/.test(guestDetails.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Valid 10-digit phone number required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit();
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-8rem)] px-4 pb-32">
      <div className="space-y-4 py-4">
        {/* Name */}
        <div>
          <Label htmlFor="name" className="text-sm font-medium">
            Full Name <span className="text-destructive">*</span>
          </Label>
          <div className="relative mt-1.5">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="name"
              value={guestDetails.name}
              onChange={(e) => onChange('name', e.target.value)}
              placeholder="Enter your full name"
              className={cn("pl-10 h-12", errors.name && "border-destructive")}
            />
          </div>
          {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email" className="text-sm font-medium">
            Email Address <span className="text-destructive">*</span>
          </Label>
          <div className="relative mt-1.5">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              value={guestDetails.email}
              onChange={(e) => onChange('email', e.target.value)}
              placeholder="your@email.com"
              className={cn("pl-10 h-12", errors.email && "border-destructive")}
            />
          </div>
          {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
        </div>

        {/* Phone */}
        <div>
          <Label htmlFor="phone" className="text-sm font-medium">
            WhatsApp Number <span className="text-destructive">*</span>
          </Label>
          <div className="relative mt-1.5">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="phone"
              type="tel"
              value={guestDetails.phone}
              onChange={(e) => onChange('phone', e.target.value)}
              placeholder="9876543210"
              className={cn("pl-10 h-12", errors.phone && "border-destructive")}
            />
          </div>
          {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
        </div>

        {/* Address (Optional) */}
        <div>
          <Label htmlFor="address" className="text-sm font-medium">
            Address <span className="text-muted-foreground">(Optional)</span>
          </Label>
          <div className="relative mt-1.5">
            <Home className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Textarea
              id="address"
              value={guestDetails.address}
              onChange={(e) => onChange('address', e.target.value)}
              placeholder="Street address"
              className="pl-10 min-h-[60px]"
            />
          </div>
        </div>

        {/* City & State */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="city" className="text-sm font-medium">City</Label>
            <Input
              id="city"
              value={guestDetails.city}
              onChange={(e) => onChange('city', e.target.value)}
              placeholder="City"
              className="h-12 mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="state" className="text-sm font-medium">State</Label>
            <Input
              id="state"
              value={guestDetails.state}
              onChange={(e) => onChange('state', e.target.value)}
              placeholder="State"
              className="h-12 mt-1.5"
            />
          </div>
        </div>

        {/* Special Requests */}
        <div>
          <Label htmlFor="requests" className="text-sm font-medium">
            Special Requests <span className="text-muted-foreground">(Optional)</span>
          </Label>
          <Textarea
            id="requests"
            value={guestDetails.specialRequests}
            onChange={(e) => onChange('specialRequests', e.target.value)}
            placeholder="Any special requirements or requests..."
            className="min-h-[80px] mt-1.5"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-xl border-t border-border/50 safe-area-bottom">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full h-12 text-base font-semibold rounded-xl"
          size="lg"
        >
          {isSubmitting ? 'Confirming...' : 'Confirm Booking'}
        </Button>
      </div>
    </div>
  );
};

// Confirmation Step
const ConfirmationStep = ({
  bookingId,
  guestName,
  checkIn,
  checkOut,
  roomName,
  onGoHome,
}: {
  bookingId: string;
  guestName: string;
  checkIn: Date;
  checkOut: Date;
  roomName: string;
  onGoHome: () => void;
}) => (
  <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] px-6 text-center">
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6"
    >
      <Check className="w-10 h-10 text-white" />
    </motion.div>

    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="text-2xl font-bold mb-2"
    >
      Booking Confirmed!
    </motion.h2>

    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="text-muted-foreground mb-6"
    >
      Thank you, {guestName.split(' ')[0]}! Your stay is confirmed.
    </motion.p>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card className="p-4 text-left w-full max-w-sm mb-6">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Booking ID</span>
            <span className="font-mono font-medium">{bookingId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Room</span>
            <span className="font-medium text-right max-w-[180px] truncate">{roomName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Check-in</span>
            <span className="font-medium">{format(checkIn, 'MMM d, yyyy')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Check-out</span>
            <span className="font-medium">{format(checkOut, 'MMM d, yyyy')}</span>
          </div>
        </div>
      </Card>
    </motion.div>

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="flex items-center gap-2 text-sm text-muted-foreground mb-8"
    >
      <Sparkles className="w-4 h-4" />
      <span>Confirmation sent to your email</span>
    </motion.div>

    <Button
      onClick={onGoHome}
      className="w-full max-w-sm h-12 text-base font-semibold rounded-xl"
      size="lg"
    >
      Back to Home
    </Button>
  </div>
);

// Main BookingFlow Component
export default function BookingFlow() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { formatPrice } = useApp();

  // State
  const [currentStep, setCurrentStep] = useState<BookingStep>('dates');
  const [direction, setDirection] = useState(1);
  const [checkIn, setCheckIn] = useState<Date | undefined>();
  const [checkOut, setCheckOut] = useState<Date | undefined>();
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<RoomType | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [guestDetails, setGuestDetails] = useState<GuestDetails>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    specialRequests: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [loadingRooms, setLoadingRooms] = useState(false);

  // Load rooms from database
  useEffect(() => {
    const fetchRooms = async () => {
      setLoadingRooms(true);
      try {
        const { data, error } = await supabase
          .from('room_types')
          .select('*')
          .eq('is_active', true)
          .order('base_price', { ascending: true });

        if (error) throw error;
        setRooms(data || []);
      } catch (err) {
        console.error('Error fetching rooms:', err);
        toast.error('Failed to load rooms');
      } finally {
        setLoadingRooms(false);
      }
    };

    fetchRooms();
  }, []);

  // Parse URL params for pre-selection
  useEffect(() => {
    const roomId = searchParams.get('room');
    const checkInParam = searchParams.get('checkIn');
    const checkOutParam = searchParams.get('checkOut');

    if (checkInParam) setCheckIn(parseISO(checkInParam));
    if (checkOutParam) setCheckOut(parseISO(checkOutParam));
    if (roomId && rooms.length > 0) {
      const room = rooms.find(r => r.id === roomId);
      if (room) setSelectedRoom(room);
    }
  }, [searchParams, rooms]);

  // Navigation helpers
  const stepIndex = STEPS.findIndex(s => s.id === currentStep);
  const canGoBack = stepIndex > 0 && currentStep !== 'confirmation';

  const goToStep = useCallback((step: BookingStep) => {
    const newIndex = STEPS.findIndex(s => s.id === step);
    setDirection(newIndex > stepIndex ? 1 : -1);
    setCurrentStep(step);
  }, [stepIndex]);

  const goBack = useCallback(() => {
    if (canGoBack) {
      goToStep(STEPS[stepIndex - 1].id);
    } else {
      navigate('/');
    }
  }, [canGoBack, stepIndex, goToStep, navigate]);

  const nights = useMemo(() => {
    if (checkIn && checkOut) {
      return differenceInDays(checkOut, checkIn);
    }
    return 0;
  }, [checkIn, checkOut]);

  // Handle booking submission
  const handleSubmitBooking = async () => {
    if (!selectedRoom || !checkIn || !checkOut) return;

    setIsSubmitting(true);
    try {
      const pricePerNight = selectedRoom.weekday_price || selectedRoom.base_price;
      const subtotal = pricePerNight * quantity * nights;
      const gstRate = selectedRoom.kind === 'dorm' ? 0 : 0.12;
      const total = Math.round(subtotal * (1 + gstRate));

      const result = await createBooking({
        bookingData: {
          checkIn: format(checkIn, 'yyyy-MM-dd'),
          checkOut: format(checkOut, 'yyyy-MM-dd'),
          guests: quantity * selectedRoom.capacity,
          nights,
          selectedRooms: [{
            id: selectedRoom.id,
            name: selectedRoom.name,
            price: pricePerNight,
            type: selectedRoom.kind as 'dorm' | 'private',
            selection: {
              guests: selectedRoom.kind === 'dorm' ? quantity : selectedRoom.capacity,
              rooms: quantity,
            },
          }],
          totalAmount: total,
        },
        guestDetails: {
          guestName: guestDetails.name,
          email: guestDetails.email,
          whatsappNumber: guestDetails.phone,
          address: guestDetails.address,
          city: guestDetails.city,
          state: guestDetails.state,
          pincode: guestDetails.pincode,
          specialRequests: guestDetails.specialRequests,
        },
      });

      if (result.success && result.bookingId) {
        setBookingId(result.bookingId);
        goToStep('confirmation');
        toast.success('Booking confirmed!');
      } else {
        toast.error(result.error || 'Booking failed. Please try again.');
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <BookingHeader
        step={STEPS[stepIndex]}
        onBack={goBack}
        canGoBack={canGoBack}
      />

      {/* Step Indicator */}
      {currentStep !== 'confirmation' && (
        <StepIndicator currentStep={currentStep} steps={STEPS} />
      )}

      {/* Step Content */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentStep}
          custom={direction}
          variants={pageVariants}
          initial="initial"
          animate="in"
          exit="out"
          transition={pageTransition}
        >
          {currentStep === 'dates' && (
            <DateSelectionStep
              checkIn={checkIn}
              checkOut={checkOut}
              onCheckInChange={setCheckIn}
              onCheckOutChange={setCheckOut}
              onNext={() => goToStep('rooms')}
            />
          )}

          {currentStep === 'rooms' && checkIn && checkOut && (
            <RoomSelectionStep
              rooms={rooms}
              selectedRoom={selectedRoom}
              quantity={quantity}
              checkIn={checkIn}
              checkOut={checkOut}
              onRoomSelect={(room) => {
                setSelectedRoom(room);
                setQuantity(1);
              }}
              onQuantityChange={setQuantity}
              onNext={() => goToStep('summary')}
              formatPrice={formatPrice}
            />
          )}

          {currentStep === 'summary' && selectedRoom && checkIn && checkOut && (
            <SummaryStep
              checkIn={checkIn}
              checkOut={checkOut}
              selectedRoom={selectedRoom}
              quantity={quantity}
              nights={nights}
              formatPrice={formatPrice}
              onNext={() => goToStep('details')}
            />
          )}

          {currentStep === 'details' && (
            <GuestDetailsStep
              guestDetails={guestDetails}
              onChange={(field, value) => setGuestDetails(prev => ({ ...prev, [field]: value }))}
              onSubmit={handleSubmitBooking}
              isSubmitting={isSubmitting}
            />
          )}

          {currentStep === 'confirmation' && checkIn && checkOut && selectedRoom && (
            <ConfirmationStep
              bookingId={bookingId}
              guestName={guestDetails.name}
              checkIn={checkIn}
              checkOut={checkOut}
              roomName={selectedRoom.name}
              onGoHome={() => navigate('/')}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
