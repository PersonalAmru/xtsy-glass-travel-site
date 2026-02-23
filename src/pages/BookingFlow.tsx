/**
 * BookingFlow - Premium World-Class Booking Engine
 * Dark green theme with sleek, minimal design
 * Mobile-first, gesture-based, no-compromise UX
 */

import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { format, differenceInDays, parseISO, isBefore, startOfToday } from 'date-fns';
import { 
  ChevronLeft, 
  ChevronRight, 
  Users, 
  Bed, 
  Check, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  Home, 
  Sparkles, 
  Shield,
  Minus,
  Plus,
  Calendar as CalendarIcon,
  Star,
  FileText,
  Download,
  MessageCircle,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useApp } from '@/contexts/AppContext';
import UnifiedImage from '@/components/UnifiedImage';
import { PremiumBookingCalendar } from '@/components/booking/PremiumBookingCalendar';
import { useEnhancedAnalytics } from '@/hooks/useEnhancedAnalytics';
import { ROOM_INVENTORY } from '@/data/roomInventory';
import { useOptionalAuth } from '@/hooks/useRequireAuth';
import { generateInvoice, openInvoiceHTML, downloadInvoiceAsPDF } from '@/services/invoiceService';
import { BookingChat } from '@/components/chat/BookingChat';
// Premium color tokens - Dark slate theme
const THEME = {
  gradient: 'from-[hsl(220,20%,12%)] to-[hsl(220,25%,8%)]',
  surface: 'bg-[hsl(220,20%,12%)]',
  surfaceLight: 'bg-[hsl(220,18%,16%)]',
  accent: 'bg-[hsl(220,25%,20%)]',
  text: 'text-white',
  textMuted: 'text-white/60',
  textDim: 'text-white/40',
  border: 'border-white/10',
  ring: 'ring-white/20',
};

type BookingStep = 'dates' | 'rooms' | 'summary' | 'details' | 'confirmation';

const STEPS: { id: BookingStep; title: string; icon: React.ReactNode }[] = [
  { id: 'dates', title: 'Dates', icon: <CalendarIcon className="w-4 h-4" /> },
  { id: 'rooms', title: 'Room', icon: <Bed className="w-4 h-4" /> },
  { id: 'summary', title: 'Review', icon: <Check className="w-4 h-4" /> },
  { id: 'details', title: 'Details', icon: <User className="w-4 h-4" /> },
  { id: 'confirmation', title: 'Done', icon: <Sparkles className="w-4 h-4" /> },
];

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

// Premium Step Indicator
const StepIndicator = ({ currentStep, steps }: { currentStep: BookingStep; steps: typeof STEPS }) => {
  const currentIndex = steps.findIndex(s => s.id === currentStep);
  
  return (
    <div className="flex items-center justify-center gap-1.5 py-6">
      {steps.slice(0, 4).map((step, index) => (
        <motion.div
          key={step.id}
          initial={false}
          animate={{
            width: index === currentIndex ? 32 : 8,
            opacity: index <= currentIndex ? 1 : 0.3,
          }}
          className={cn(
            "h-2 rounded-full transition-colors",
            index === currentIndex 
              ? "bg-white" 
              : index < currentIndex 
              ? "bg-white/60" 
              : "bg-white/20"
          )}
        />
      ))}
    </div>
  );
};

// Premium Header
const BookingHeader = ({ 
  step, 
  onBack, 
  canGoBack,
  currentIndex,
  onHome,
}: { 
  step: typeof STEPS[0]; 
  onBack: () => void; 
  canGoBack: boolean;
  currentIndex: number;
  onHome: () => void;
}) => (
  <div className={cn(
    "sticky top-0 z-50",
    "bg-[hsl(220,20%,10%)]",
    "border-b border-white/10"
  )}>
    <div className="flex items-center justify-between px-4 h-16">
      <div className="w-20">
        {canGoBack ? (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="flex items-center gap-1 text-white/80 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </motion.button>
        ) : (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onHome}
            className="flex items-center gap-1 text-white/80 hover:text-white transition-colors"
          >
            <Home className="w-5 h-5" />
            <span className="text-sm font-medium">Home</span>
          </motion.button>
        )}
      </div>
      <div className="text-center">
        <motion.div
          key={step.id}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center"
        >
          <span className="text-xs text-white/50 uppercase tracking-widest mb-0.5">
            Step {currentIndex + 1} of 4
          </span>
          <h1 className="text-lg font-semibold text-white">{step.title}</h1>
        </motion.div>
      </div>
      <div className="w-20" />
    </div>
  </div>
);

// Date Selection Step
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

  const handleDateSelect = (date: Date) => {
    if (!selectingCheckOut || !checkIn) {
      onCheckInChange(date);
      onCheckOutChange(undefined);
      setSelectingCheckOut(true);
    } else {
      if (date > checkIn) {
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
    <div className="flex flex-col min-h-[calc(100vh-10rem)] px-4 pb-28">
      {/* Date Display Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 gap-3 mb-6"
      >
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => setSelectingCheckOut(false)}
          className={cn(
            "p-4 rounded-2xl text-left transition-all",
            "bg-white/5 border-2",
            !selectingCheckOut 
              ? "border-white/30 bg-white/10" 
              : "border-transparent hover:border-white/10"
          )}
        >
          <p className="text-[10px] text-white/50 uppercase tracking-widest font-medium mb-1">Check-in</p>
          <p className={cn(
            "text-lg font-bold transition-colors",
            checkIn ? "text-white" : "text-white/40"
          )}>
            {checkIn ? format(checkIn, 'EEE, MMM d') : 'Select'}
          </p>
          <p className="text-xs text-white/40 mt-0.5">After 12:00 PM</p>
        </motion.button>
        
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => checkIn && setSelectingCheckOut(true)}
          disabled={!checkIn}
          className={cn(
            "p-4 rounded-2xl text-left transition-all",
            "bg-white/5 border-2",
            selectingCheckOut && checkIn 
              ? "border-white/30 bg-white/10" 
              : "border-transparent hover:border-white/10",
            !checkIn && "opacity-50 cursor-not-allowed"
          )}
        >
          <p className="text-[10px] text-white/50 uppercase tracking-widest font-medium mb-1">Check-out</p>
          <p className={cn(
            "text-lg font-bold transition-colors",
            checkOut ? "text-white" : "text-white/40"
          )}>
            {checkOut ? format(checkOut, 'EEE, MMM d') : 'Select'}
          </p>
          <p className="text-xs text-white/40 mt-0.5">Before 10:00 AM</p>
        </motion.button>
      </motion.div>

      {/* Nights Badge */}
      <AnimatePresence mode="wait">
        {nights > 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center mb-5"
          >
            <span className="inline-flex items-center gap-2 px-5 py-2 bg-white/10 rounded-full text-white font-medium text-sm border border-white/10">
              <Bed className="w-4 h-4 text-white/70" />
              {nights} night{nights > 1 ? 's' : ''} stay
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Calendar */}
      <div className="flex-1">
        <PremiumBookingCalendar
          checkIn={checkIn}
          checkOut={checkOut}
          onDateSelect={handleDateSelect}
          selectingCheckOut={selectingCheckOut}
          minDate={today}
          className="w-full"
        />
      </div>

      {/* Continue Button - constrained width on desktop */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md lg:max-w-lg xl:max-w-xl p-4 bg-gradient-to-t from-[hsl(220,20%,12%)] via-[hsl(220,20%,12%)] to-transparent pt-8">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onNext}
          disabled={!isValidSelection}
          className={cn(
            "w-full h-14 rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-2",
            isValidSelection 
              ? "bg-white text-[hsl(220,20%,15%)] shadow-xl shadow-black/20" 
              : "bg-white/10 text-white/40 cursor-not-allowed"
          )}
        >
          {isValidSelection ? (
            <>
              Continue
              <ChevronRight className="w-5 h-5" />
            </>
          ) : (
            'Select your dates'
          )}
        </motion.button>
      </div>
    </div>
  );
};

// Get tag for room based on propertyType
const getRoomTag = (room: RoomType) => {
  const localRoom = ROOM_INVENTORY[room.id];
  const propertyType = localRoom?.propertyType || '';
  
  if (propertyType === 'XTSY Economy') {
    return { label: 'Hot Seller', color: 'bg-orange-500/90 text-white' };
  }
  if (propertyType === 'XTSY Travellers Hostel' && room.kind === 'dorm') {
    return { label: 'Best Seller', color: 'bg-emerald-500/90 text-white' };
  }
  if (propertyType === 'XTSY Xperience') {
    return { label: 'Luxury', color: 'bg-amber-500/90 text-white' };
  }
  return null;
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
  isLoading = false,
  error = null,
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
  isLoading?: boolean;
  error?: string | null;
}) => {
  const nights = differenceInDays(checkOut, checkIn);

  const getRoomPrice = (room: RoomType) => {
    const isWeekend = checkIn.getDay() >= 5 || checkIn.getDay() === 0;
    if (isWeekend && room.weekend_price) {
      return room.weekend_price;
    }
    return room.weekday_price || room.base_price;
  };

  // Get room image from local inventory for instant loading
  const getRoomImage = (room: RoomType) => {
    const localRoom = ROOM_INVENTORY[room.id];
    return localRoom?.image || localRoom?.images?.[0] || room.images?.[0] || '';
  };

  // Get property type label
  const getPropertyLabel = (category: string) => {
    if (category === 'luxury') return 'XTSY Xperience';
    if (category === 'hostel') return 'XTSY Travellers Hostel';
    if (category === 'economy') return 'XTSY Economy';
    return category;
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

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-[calc(100vh-10rem)] pb-40">
        <div className="sticky top-0 z-40 px-4 py-3 bg-[hsl(160,35%,18%)]/95 backdrop-blur-lg border-b border-white/5">
          <div className="flex items-center justify-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm font-medium text-white">
              <CalendarIcon className="w-4 h-4 text-white/60" />
              <span>{format(checkIn, 'MMM d')}</span>
              <span className="text-white/40">→</span>
              <span>{format(checkOut, 'MMM d')}</span>
              <span className="text-xs text-white/40 ml-1">({nights}N)</span>
            </div>
          </div>
        </div>
        <div className="px-4 py-6 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden animate-pulse">
              <div className="flex">
                <div className="w-28 h-28 bg-white/10" />
                <div className="flex-1 p-4 space-y-3">
                  <div className="h-4 bg-white/10 rounded w-3/4" />
                  <div className="h-3 bg-white/10 rounded w-1/2" />
                  <div className="h-5 bg-white/10 rounded w-1/4 mt-2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-10rem)] pb-40">
      {/* Date Summary Pill */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 px-4 py-3 bg-[hsl(160,35%,18%)]/95 backdrop-blur-lg border-b border-white/5"
      >
        <div className="flex items-center justify-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm font-medium text-white">
            <CalendarIcon className="w-4 h-4 text-white/60" />
            <span>{format(checkIn, 'MMM d')}</span>
            <span className="text-white/40">→</span>
            <span>{format(checkOut, 'MMM d')}</span>
            <span className="text-xs text-white/40 ml-1">({nights}N)</span>
          </div>
        </div>
        {error && (
          <div className="mt-2 text-center">
            <span className="text-xs text-amber-400/80">{error}</span>
          </div>
        )}
      </motion.div>

      {/* Room Categories */}
      <div className="px-4 py-6 space-y-8">
        {Object.entries(groupedRooms).map(([category, categoryRooms], categoryIndex) => (
          <motion.div 
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: categoryIndex * 0.1 }}
          >
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4 flex items-center gap-2">
              {category === 'luxury' && <Star className="w-3.5 h-3.5" />}
              {getPropertyLabel(category)}
            </h3>
            
            <div className="space-y-3">
              {categoryRooms.map((room, roomIndex) => {
                const price = getRoomPrice(room);
                const isSelected = selectedRoom?.id === room.id;
                const isDorm = room.kind === 'dorm';
                const roomImage = getRoomImage(room);
                const tag = getRoomTag(room);
                
                return (
                  <motion.div
                    key={room.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: categoryIndex * 0.1 + roomIndex * 0.05 }}
                  >
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onRoomSelect(room)}
                      className={cn(
                        "w-full overflow-hidden rounded-2xl transition-all duration-200 text-left",
                        "bg-white/5 border-2",
                        isSelected 
                          ? "border-white/30 bg-white/10" 
                          : "border-transparent hover:border-white/10"
                      )}
                    >
                      <div className="flex">
                        {/* Room Image */}
                        <div className="w-28 h-28 flex-shrink-0 relative overflow-hidden bg-white/5">
                          {roomImage && (
                            <img
                              src={roomImage}
                              alt={room.name}
                              className="w-full h-full object-cover"
                              loading="eager"
                            />
                          )}
                          {/* Tag Badge */}
                          {tag && (
                            <div className={cn(
                              "absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider",
                              tag.color
                            )}>
                              {tag.label}
                            </div>
                          )}
                          {isSelected && (
                            <motion.div 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg"
                            >
                              <Check className="w-3.5 h-3.5 text-[hsl(160,35%,25%)]" />
                            </motion.div>
                          )}
                        </div>
                        
                        {/* Room Info */}
                        <div className="flex-1 p-4 flex flex-col justify-between">
                          <div>
                            <h4 className="font-semibold text-sm text-white line-clamp-2 leading-tight">{room.name}</h4>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 bg-white/10 rounded-full text-white/60">
                                <Users className="w-3 h-3" />
                                {isDorm ? '1 bed' : `${room.capacity} guests`}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-end justify-between mt-2">
                            <div>
                              <span className="text-xl font-bold text-white">{formatPrice(price)}</span>
                              <span className="text-[10px] text-white/40 ml-1">
                                /{isDorm ? 'bed' : 'night'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Quantity Selector */}
                      <AnimatePresence>
                        {isSelected && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div 
                              className="px-4 py-4 bg-white/5 border-t border-white/10 flex items-center justify-between"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <span className="text-sm font-medium text-white/80">
                                {isDorm ? 'Beds needed' : 'Rooms needed'}
                              </span>
                              <div className="flex items-center gap-4">
                                <motion.button
                                  whileTap={{ scale: 0.9 }}
                                  className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onQuantityChange(Math.max(1, quantity - 1));
                                  }}
                                >
                                  <Minus className="w-4 h-4" />
                                </motion.button>
                                <span className="w-8 text-center text-xl font-bold text-white">{quantity}</span>
                                <motion.button
                                  whileTap={{ scale: 0.9 }}
                                  className="w-10 h-10 rounded-full bg-white text-[hsl(160,35%,25%)] flex items-center justify-center hover:bg-white/90 transition-colors"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // Cap at capacity for dorms (4 for 4-bed dorms), total_units for private rooms
                                    const maxQty = isDorm ? room.capacity : room.total_units;
                                    onQuantityChange(Math.min(maxQty, quantity + 1));
                                  }}
                                >
                                  <Plus className="w-4 h-4" />
                                </motion.button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Continue Button - constrained width on desktop */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md lg:max-w-lg xl:max-w-xl p-4 bg-gradient-to-t from-[hsl(220,20%,12%)] via-[hsl(220,20%,12%)] to-transparent pt-8">
        {selectedRoom && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-3 px-1"
          >
            <div>
              <p className="text-xs text-white/40 uppercase tracking-wider">Total • {nights} night{nights > 1 ? 's' : ''}</p>
              <p className="text-2xl font-bold text-white">
                {formatPrice(getRoomPrice(selectedRoom) * quantity * nights)}
              </p>
            </div>
            <p className="text-xs text-white/40">
              {quantity} × {selectedRoom.kind === 'dorm' ? 'bed' : 'room'}
            </p>
          </motion.div>
        )}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onNext}
          disabled={!selectedRoom}
          className={cn(
            "w-full h-14 rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-2",
            selectedRoom 
              ? "bg-white text-[hsl(220,20%,15%)] shadow-xl shadow-black/20" 
              : "bg-white/10 text-white/40 cursor-not-allowed"
          )}
        >
          {selectedRoom ? (
            <>
              Review & Book
              <ChevronRight className="w-5 h-5" />
            </>
          ) : (
            'Select a room'
          )}
        </motion.button>
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
    <div className="flex flex-col min-h-[calc(100vh-10rem)] px-4 pb-32">
      {/* Property Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-4"
      >
        <div className="flex gap-4">
          <div className="w-20 h-20 rounded-xl overflow-hidden bg-white/10 flex-shrink-0">
            {selectedRoom.images?.[0] && (
              <UnifiedImage
                src={selectedRoom.images[0]}
                alt={selectedRoom.name}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-white">{selectedRoom.name}</h3>
            <p className="text-sm text-white/50">{selectedRoom.category}</p>
            <div className="flex items-center gap-1 mt-1 text-sm text-white/40">
              <MapPin className="w-3 h-3" />
              <span>XTSY Travellers Hostel</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Date & Guests */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-4"
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] text-white/40 uppercase tracking-widest">Check-in</p>
            <p className="font-semibold text-white">{format(checkIn, 'EEE, MMM d')}</p>
            <p className="text-sm text-white/40">After 12:00 PM</p>
          </div>
          <div>
            <p className="text-[10px] text-white/40 uppercase tracking-widest">Check-out</p>
            <p className="font-semibold text-white">{format(checkOut, 'EEE, MMM d')}</p>
            <p className="text-sm text-white/40">Before 10:00 AM</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex justify-between">
            <span className="text-white/50">{selectedRoom.kind === 'dorm' ? 'Beds' : 'Rooms'}</span>
            <span className="font-medium text-white">{quantity}</span>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-white/50">Nights</span>
            <span className="font-medium text-white">{nights}</span>
          </div>
        </div>
      </motion.div>

      {/* Price Breakdown */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-4"
      >
        <h4 className="font-semibold text-white mb-3">Price Breakdown</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-white/50">
              {formatPrice(pricePerNight)} × {quantity} × {nights} night{nights > 1 ? 's' : ''}
            </span>
            <span className="text-white">{formatPrice(subtotal)}</span>
          </div>
          {gst > 0 && (
            <div className="flex justify-between">
              <span className="text-white/50">GST ({gstRate * 100}%)</span>
              <span className="text-white">{formatPrice(gst)}</span>
            </div>
          )}
          <div className="flex justify-between pt-3 border-t border-white/10 font-bold text-lg">
            <span className="text-white">Total</span>
            <span className="text-white">{formatPrice(total)}</span>
          </div>
        </div>
      </motion.div>

      {/* Pay at Hotel Badge */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex items-center gap-3 p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20"
      >
        <Shield className="w-5 h-5 text-emerald-400" />
        <div>
          <p className="font-medium text-emerald-400">Pay at Hotel</p>
          <p className="text-sm text-white/50">No advance payment required</p>
        </div>
      </motion.div>

      {/* Continue Button - constrained width on desktop */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md lg:max-w-lg xl:max-w-xl p-4 bg-gradient-to-t from-[hsl(220,20%,12%)] via-[hsl(220,20%,12%)] to-transparent pt-8">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onNext}
          className="w-full h-14 rounded-2xl font-bold text-base bg-white text-[hsl(220,20%,15%)] shadow-xl shadow-black/20 flex items-center justify-center gap-2"
        >
          Continue to Guest Details
          <ChevronRight className="w-5 h-5" />
        </motion.button>
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

  const inputClass = "h-12 pl-11 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-white/30 focus:ring-white/10 rounded-xl";
  const labelClass = "text-sm font-medium text-white/80";

  return (
    <div className="flex flex-col min-h-[calc(100vh-10rem)] px-4 pb-32">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4 py-4"
      >
        {/* Name */}
        <div>
          <Label htmlFor="name" className={labelClass}>
            Full Name <span className="text-red-400">*</span>
          </Label>
          <div className="relative mt-1.5">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <Input
              id="name"
              value={guestDetails.name}
              onChange={(e) => onChange('name', e.target.value)}
              placeholder="Enter your full name"
              className={cn(inputClass, errors.name && "border-red-400/50")}
            />
          </div>
          {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email" className={labelClass}>
            Email Address <span className="text-red-400">*</span>
          </Label>
          <div className="relative mt-1.5">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <Input
              id="email"
              type="email"
              value={guestDetails.email}
              onChange={(e) => onChange('email', e.target.value)}
              placeholder="your@email.com"
              className={cn(inputClass, errors.email && "border-red-400/50")}
            />
          </div>
          {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
        </div>

        {/* Phone */}
        <div>
          <Label htmlFor="phone" className={labelClass}>
            WhatsApp Number <span className="text-red-400">*</span>
          </Label>
          <div className="relative mt-1.5">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <Input
              id="phone"
              type="tel"
              value={guestDetails.phone}
              onChange={(e) => onChange('phone', e.target.value)}
              placeholder="9876543210"
              className={cn(inputClass, errors.phone && "border-red-400/50")}
            />
          </div>
          {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone}</p>}
        </div>

        {/* Address */}
        <div>
          <Label htmlFor="address" className={labelClass}>
            Address <span className="text-white/40">(Optional)</span>
          </Label>
          <div className="relative mt-1.5">
            <Home className="absolute left-3.5 top-3.5 w-4 h-4 text-white/40" />
            <Textarea
              id="address"
              value={guestDetails.address}
              onChange={(e) => onChange('address', e.target.value)}
              placeholder="Street address"
              className="pl-11 min-h-[60px] bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-white/30 focus:ring-white/10 rounded-xl"
            />
          </div>
        </div>

        {/* City & State */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="city" className={labelClass}>City</Label>
            <Input
              id="city"
              value={guestDetails.city}
              onChange={(e) => onChange('city', e.target.value)}
              placeholder="City"
              className="h-12 mt-1.5 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-white/30 rounded-xl"
            />
          </div>
          <div>
            <Label htmlFor="state" className={labelClass}>State</Label>
            <Input
              id="state"
              value={guestDetails.state}
              onChange={(e) => onChange('state', e.target.value)}
              placeholder="State"
              className="h-12 mt-1.5 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-white/30 rounded-xl"
            />
          </div>
        </div>


        {/* Special Requests */}
        <div>
          <Label htmlFor="requests" className={labelClass}>
            Special Requests <span className="text-white/40">(Optional)</span>
          </Label>
          <Textarea
            id="requests"
            value={guestDetails.specialRequests}
            onChange={(e) => onChange('specialRequests', e.target.value)}
            placeholder="Any special requirements..."
            className="min-h-[80px] mt-1.5 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-white/30 rounded-xl"
          />
        </div>
      </motion.div>

      {/* Submit Button - constrained width on desktop */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md lg:max-w-lg xl:max-w-xl p-4 bg-gradient-to-t from-[hsl(220,20%,12%)] via-[hsl(220,20%,12%)] to-transparent pt-8">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={cn(
            "w-full h-14 rounded-2xl font-bold text-base shadow-xl shadow-black/20 flex items-center justify-center gap-2",
            isSubmitting 
              ? "bg-white/50 text-[hsl(220,20%,15%)]/50 cursor-not-allowed"
              : "bg-white text-[hsl(220,20%,15%)]"
          )}
        >
          {isSubmitting ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-[hsl(220,20%,15%)]/30 border-t-[hsl(220,20%,15%)] rounded-full"
              />
              Confirming...
            </>
          ) : (
            <>
              Confirm Booking
              <Check className="w-5 h-5" />
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
};

// Confirmation Step with Invoice & Chat
const ConfirmationStep = ({
  bookingId,
  guestName,
  checkIn,
  checkOut,
  roomName,
  invoiceHtml,
  onGoHome,
  onOpenChat,
  onDownloadInvoice,
  onViewInvoice,
}: {
  bookingId: string;
  guestName: string;
  checkIn: Date;
  checkOut: Date;
  roomName: string;
  invoiceHtml?: string;
  onGoHome: () => void;
  onOpenChat: () => void;
  onDownloadInvoice: () => void;
  onViewInvoice: () => void;
}) => {
  const [showActions, setShowActions] = useState(false);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] px-6 text-center pb-8">
      {/* Pending Animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="w-28 h-28 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-amber-500/40"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
        >
          <Clock className="w-14 h-14 text-white" strokeWidth={2.5} />
        </motion.div>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-3xl font-bold text-white mb-3 tracking-tight"
      >
        Booking Received!
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-white/60 mb-2 text-lg"
      >
        Thank you, {guestName.split(' ')[0]}!
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="flex items-center gap-2 text-amber-400 mb-8 text-sm font-medium"
      >
        <Shield className="w-4 h-4" />
        <span>Awaiting host confirmation</span>
      </motion.div>

      {/* Booking Details Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-5 rounded-2xl bg-white/5 border border-white/10 text-left w-full max-w-sm mb-6"
      >
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-white/50">Booking ID</span>
            <span className="font-mono font-bold text-emerald-400">{bookingId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/50">Room</span>
            <span className="font-medium text-white text-right max-w-[180px] truncate">{roomName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/50">Check-in</span>
            <span className="font-medium text-white">{format(checkIn, 'MMM d, yyyy')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/50">Check-out</span>
            <span className="font-medium text-white">{format(checkOut, 'MMM d, yyyy')}</span>
          </div>
        </div>
      </motion.div>

      {/* Invoice Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex gap-3 w-full max-w-sm mb-4"
      >
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onViewInvoice}
          className="flex-1 h-12 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors"
        >
          <FileText className="w-4 h-4" />
          View Invoice
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onDownloadInvoice}
          className="flex-1 h-12 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </motion.button>
      </motion.div>

      {/* Message to Host Button - XTSY Pings */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        whileTap={{ scale: 0.98 }}
        onClick={onOpenChat}
        className="w-full max-w-sm h-12 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-medium text-sm flex items-center justify-center gap-2 transition-colors border border-emerald-500/20 mb-4"
      >
        <MessageCircle className="w-4 h-4" />
        Message to Host
      </motion.button>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex items-center gap-2 text-sm text-white/40 mb-6"
      >
        <Sparkles className="w-4 h-4" />
        <span>Confirmation sent to your email & WhatsApp</span>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
        whileTap={{ scale: 0.98 }}
        onClick={onGoHome}
        className="w-full max-w-sm h-14 rounded-2xl font-bold text-base bg-white text-[hsl(220,20%,12%)] shadow-xl shadow-black/20"
      >
        Back to Home
      </motion.button>
    </div>
  );
};

// Page transitions
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

// Main BookingFlow Component
export default function BookingFlow() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { formatPrice } = useApp();
  const { trackEvent, trackConversion, context } = useEnhancedAnalytics();
  const hasTrackedEntry = useRef(false);
  
  // User authentication - guest mode allowed for browsing
  const { user, isAuthenticated, isGuest } = useOptionalAuth();

  // State
  const [currentStep, setCurrentStep] = useState<BookingStep>('dates');
  const [direction, setDirection] = useState(1);
  const [checkIn, setCheckIn] = useState<Date | undefined>();
  const [checkOut, setCheckOut] = useState<Date | undefined>();
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);
  const [roomLoadError, setRoomLoadError] = useState<string | null>(null);
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
  const [invoiceHtml, setInvoiceHtml] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [bookingUUID, setBookingUUID] = useState('');
  const [chatOpen, setChatOpen] = useState(false);

  // Pre-fill guest details from Supabase user when authenticated
  useEffect(() => {
    if (user) {
      setGuestDetails(prev => ({
        ...prev,
        name: prev.name || user.displayName || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phoneNumber?.replace('+91', '') || '',
      }));
    }
  }, [user]);

  // Track booking flow entry - captures visitor entering booking with dates from Hero
  useEffect(() => {
    if (!context || hasTrackedEntry.current) return;
    hasTrackedEntry.current = true;

    const checkInParam = searchParams.get('checkIn');
    const checkOutParam = searchParams.get('checkOut');
    const guestsParam = searchParams.get('guests');

    // Track as high-intent booking activity
    trackEvent('booking', 'flow_entry', 'booking_flow', undefined, {
      source: 'hero_search',
      check_in: checkInParam || null,
      check_out: checkOutParam || null,
      guests: guestsParam ? parseInt(guestsParam) : null,
      has_dates: !!(checkInParam && checkOutParam),
    });

    // Also track as conversion funnel step
    trackConversion('booking', 'flow_entry', 0, {
      value: 0,
      isCompleted: false,
    });
  }, [context, searchParams, trackEvent, trackConversion]);

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

  // Load rooms - filter by property context and sync with database
  useEffect(() => {
    // Get property context from sessionStorage
    let allowedRoomIds: string[] | null = null;
    let skipDatesFromSession = false;
    
    try {
      const propertyContext = sessionStorage.getItem('xtsy_booking_property');
      if (propertyContext) {
        const ctx = JSON.parse(propertyContext);
        allowedRoomIds = ctx.roomTypeIds || null;
        skipDatesFromSession = ctx.skipDates || false;
        
        // If we have dates from session and should skip, set them
        if (skipDatesFromSession && ctx.checkIn && ctx.checkOut) {
          setCheckIn(parseISO(ctx.checkIn));
          setCheckOut(parseISO(ctx.checkOut));
          // Auto-advance to rooms step
          setTimeout(() => goToStep('rooms'), 100);
        }
      }
    } catch {
      // Ignore parsing errors
    }

    // Immediately load from local inventory for instant display
    const localRooms = Object.values(ROOM_INVENTORY)
      .filter(room => {
        if (!room.isBookable) return false;
        // CRITICAL: Property-room isolation - only show rooms for selected property
        if (allowedRoomIds && !allowedRoomIds.includes(room.id)) return false;
        return true;
      })
      .map(room => ({
        id: room.id,
        name: room.name,
        category: room.category,
        kind: room.kind,
        base_price: room.basePrice,
        weekday_price: room.weekdayPrice,
        weekend_price: room.weekendPrice,
        capacity: room.capacity,
        total_units: room.totalUnits,
        amenities: room.features,
        images: room.images,
        is_active: true,
      }))
      .sort((a, b) => a.base_price - b.base_price);
    
    setRooms(localRooms as RoomType[]);
    setIsLoadingRooms(false);
    
    // Background sync with database for latest prices/availability
    const syncWithDatabase = async () => {
      try {
        const { data, error } = await supabase
          .from('room_types')
          .select('*')
          .eq('is_active', true)
          .order('base_price', { ascending: true });

        if (error || !data || data.length === 0) return;
        
        // Filter by property and merge with local inventory images
        const mergedRooms = data
          .filter(dbRoom => !allowedRoomIds || allowedRoomIds.includes(dbRoom.id))
          .map(dbRoom => {
            const localRoom = ROOM_INVENTORY[dbRoom.id];
            return {
              ...dbRoom,
              images: dbRoom.images?.length > 0 ? dbRoom.images : localRoom?.images || [],
            };
          });
        
        setRooms(mergedRooms);
        setRoomLoadError(null);
      } catch (err) {
        console.warn('Background database sync failed, using local data:', err);
      }
    };

    syncWithDatabase();
  }, [goToStep]);

  const nights = useMemo(() => {
    if (checkIn && checkOut) {
      return differenceInDays(checkOut, checkIn);
    }
    return 0;
  }, [checkIn, checkOut]);

  // Handle booking submission using the new invoice system
  const handleSubmitBooking = async () => {
    if (!selectedRoom || !checkIn || !checkOut) return;

    setIsSubmitting(true);
    try {
      const pricePerNight = selectedRoom.weekday_price || selectedRoom.base_price;
      const subtotal = pricePerNight * quantity * nights;
      const gstRate = selectedRoom.kind === 'dorm' ? 0 : 0.12;
      const gstAmount = Math.round(subtotal * gstRate);
      const total = subtotal + gstAmount;

      // Get current user ID if logged in
      const { data: { user: currentUser } } = await supabase.auth.getUser();

      // Use the new invoice generation system
      const result = await generateInvoice({
        guestName: guestDetails.name,
        guestEmail: guestDetails.email,
        guestPhone: guestDetails.phone,
        guestAddress: guestDetails.address,
        guestCity: guestDetails.city,
        guestState: guestDetails.state,
        guestPincode: guestDetails.pincode,
        checkIn: format(checkIn, 'yyyy-MM-dd'),
        checkOut: format(checkOut, 'yyyy-MM-dd'),
        roomName: selectedRoom.name,
        roomType: selectedRoom.kind,
        quantity,
        nights,
        ratePerNight: pricePerNight,
        subtotal,
        gstRate,
        gstAmount,
        totalAmount: total,
        specialRequests: guestDetails.specialRequests,
        userId: currentUser?.id,
      });

      if (result.success && result.bookingId) {
        setBookingId(result.bookingId);
        if (result.bookingUUID) {
          setBookingUUID(result.bookingUUID);
        }
        if (result.html) {
          setInvoiceHtml(result.html);
        }
        goToStep('confirmation');
        toast.success('Booking submitted! Awaiting host approval.');
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
    <div className="min-h-screen bg-gradient-to-b from-[hsl(220,20%,12%)] to-[hsl(220,25%,6%)]">
      {/* Header */}
      <BookingHeader
        step={STEPS[stepIndex]}
        onBack={goBack}
        canGoBack={canGoBack}
        currentIndex={stepIndex}
        onHome={() => navigate('/')}
      />

      {/* Centered Container for Booking Engine - constrains width on desktop */}
      <div className="max-w-md mx-auto lg:max-w-lg xl:max-w-xl">
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
              isLoading={isLoadingRooms}
              error={roomLoadError}
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
            <>
              <ConfirmationStep
                bookingId={bookingId}
                guestName={guestDetails.name}
                checkIn={checkIn}
                checkOut={checkOut}
                roomName={selectedRoom.name}
                invoiceHtml={invoiceHtml}
                onGoHome={() => navigate('/')}
                onOpenChat={() => setChatOpen(true)}
                onDownloadInvoice={() => {
                  if (invoiceHtml) {
                    downloadInvoiceAsPDF(invoiceHtml, bookingId);
                  }
                }}
                onViewInvoice={() => {
                  if (invoiceHtml) {
                    openInvoiceHTML(invoiceHtml);
                  }
                }}
              />
              {bookingUUID && (
                <BookingChat
                  bookingId={bookingUUID}
                  guestName={guestDetails.name}
                  checkInDate={format(checkIn, 'yyyy-MM-dd')}
                  isOpen={chatOpen}
                  onClose={() => setChatOpen(false)}
                />
              )}
            </>
          )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
