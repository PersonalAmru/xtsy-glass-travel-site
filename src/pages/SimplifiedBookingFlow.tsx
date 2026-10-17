/**
 * SimplifiedBookingFlow - 2-Step Booking Engine
 * Step 1: Summary (dates, rooms, price breakdown)
 * Step 2: Guest Details & Submission
 * Triggered from PropertyDetail page with pre-selected rooms
 */

import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from '@/lib/router-compat';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { format, differenceInDays, parseISO } from 'date-fns';
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
  Calendar as CalendarIcon,
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
import UnifiedImage from '@/components/UnifiedImage';
import { useEnhancedAnalytics } from '@/hooks/useEnhancedAnalytics';
import { ROOM_INVENTORY, RoomType } from '@/data/roomInventory';
import { getCanonicalRate, getBreakfastInclusion } from '@/utils/rateSanityCheck';
import { useOptionalAuth } from '@/hooks/useRequireAuth';
import { openWhatsAppDirectly, generateBookingMessage, bookingPageSource } from '@/utils/privacyCompliantWhatsApp';
import { trackBookingStart } from '@/utils/dataLayerService';
import { trafficAnalytics } from '@/services/trafficAnalyticsService';
import { quoteStay } from '@/data/panoramaPricing';
import { resolveBookingQuote } from '@/utils/bookingCatalogue';

type BookingStep = 'dates' | 'rooms' | 'summary' | 'details' | 'confirmation';

interface SelectedRoom {
  room: RoomType;
  quantity: number;
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

// Premium Header
/** Step 0 — shown when /book is opened without dates (header "Book now", room cards, "Stays"). */
function DateStep({ initialProperty, onSubmit }: { initialProperty: 'xtsy-hostel' | 'xtsy-experience'; onSubmit: (checkIn: string, checkOut: string, property: string) => void }) {
  // Local calendar date (not UTC), so "today" is right for guests in India after midnight.
  const iso = (d: Date) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  const today = new Date();
  const [ci, setCi] = useState(iso(today));
  const [co, setCo] = useState(iso(new Date(today.getTime() + 86400000)));
  const [property, setProperty] = useState(initialProperty);
  const nightsCount = Math.round((new Date(co).getTime() - new Date(ci).getTime()) / 86400000);
  const valid = Boolean(ci && co) && nightsCount >= 1;
  const pickCi = (v: string) => {
    setCi(v);
    if (v && (!co || new Date(co) <= new Date(v))) setCo(iso(new Date(new Date(v).getTime() + 86400000)));
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-[hsl(220,20%,12%)] to-[hsl(220,25%,6%)] px-4 py-10 text-white">
      <div className="mx-auto flex max-w-md flex-col gap-6">
        <a href="/" className="text-sm text-white/70 hover:text-white">← XTSY home</a>
        <div>
          <p className="text-xs uppercase tracking-widest text-white/70">Step 1</p>
          <h1 className="mt-1 font-['Staatliches',Impact,sans-serif] text-[40px] font-normal leading-[0.95] sm:text-[52px]">Book your stay at XTSY Travellers Hostel</h1>
          <p className="mt-3 text-base text-white/80">Pick your dates to see live rooms and prices. Check-in 11 AM · check-out 10 AM.</p>
        </div>
        <form className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); if (valid) onSubmit(ci, co, property); }}>
          <fieldset className="grid grid-cols-2 gap-2">
            <legend className="mb-2 text-sm font-medium">Where</legend>
            {([['xtsy-hostel', 'Hostel — dorms & rooms'], ['xtsy-experience', 'Experience by XTSY']] as const).map(([id, label]) => (
              <label key={id} className={`flex min-h-[48px] cursor-pointer items-center justify-center rounded-xl border px-3 text-center text-sm font-medium ${property === id ? 'border-white bg-white text-[hsl(220,25%,10%)]' : 'border-white/30 text-white'}`}>
                <input type="radio" name="property" value={id} checked={property === id} onChange={() => setProperty(id)} className="sr-only" />
                {label}
              </label>
            ))}
          </fieldset>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1 text-sm font-medium" htmlFor="book-ci">Check-in
              <input id="book-ci" type="date" required value={ci} min={iso(today)} onChange={(e) => pickCi(e.target.value)} className="h-12 rounded-xl border border-white/30 bg-white/10 px-3 text-white [color-scheme:dark]" />
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium" htmlFor="book-co">Check-out
              <input id="book-co" type="date" required value={co} min={ci ? iso(new Date(new Date(ci).getTime() + 86400000)) : iso(today)} onChange={(e) => setCo(e.target.value)} className="h-12 rounded-xl border border-white/30 bg-white/10 px-3 text-white [color-scheme:dark]" />
            </label>
          </div>
          <p className="m-0 text-sm text-white/80" aria-live="polite">{valid ? `${nightsCount} ${nightsCount === 1 ? 'night' : 'nights'}` : 'Check-out must be at least one night after check-in'}</p>
          <button type="submit" disabled={!valid} className="h-12 rounded-xl bg-[#B3262F] text-base font-semibold text-white disabled:opacity-50">See rooms and prices</button>
        </form>
        <p className="text-sm text-white/70">Prefer to talk? WhatsApp +91 88373 17070.</p>
      </div>
    </div>
  );
}

const BookingHeader = ({ 
  step, 
  stepNumber,
  totalSteps,
  onBack, 
  canGoBack,
  onHome,
}: { 
  step: string;
  stepNumber: number;
  totalSteps: number;
  onBack: () => void; 
  canGoBack: boolean;
  onHome: () => void;
}) => (
  <div className={cn(
    "sticky top-0 z-50",
    "bg-[hsl(220,20%,10%)]",
    "border-b border-white/10"
  )}>
    <div className="flex items-center justify-between px-4 h-16 max-w-md mx-auto">
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
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </motion.button>
        )}
      </div>
      <div className="text-center">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center"
        >
          <span className="text-xs text-white/80 uppercase tracking-widest mb-0.5">
            Step {stepNumber} of {totalSteps}
          </span>
          <h1 className="text-lg font-semibold text-white">{step}</h1>
        </motion.div>
      </div>
      <div className="w-20" />
    </div>
  </div>
);

// Step Indicator
const StepIndicator = ({ currentStep, total }: { currentStep: number; total: number }) => {
  return (
    <div className="flex items-center justify-center gap-1.5 py-6">
      {Array.from({ length: total }, (_, index) => (
        <motion.div
          key={index}
          initial={false}
          animate={{
            width: index === currentStep ? 32 : 8,
            opacity: index <= currentStep ? 1 : 0.3,
          }}
          className={cn(
            "h-2 rounded-full transition-colors",
            index === currentStep 
              ? "bg-white" 
              : index < currentStep 
              ? "bg-white/60" 
              : "bg-white/20"
          )}
        />
      ))}
    </div>
  );
};

// Room Selection Step (shown when entering from hero search)
const RoomSelectionStep = ({
  availableRooms,
  selectedRooms,
  onRoomChange,
  nights,
  onNext,
}: {
  availableRooms: RoomType[];
  selectedRooms: SelectedRoom[];
  onRoomChange: (roomId: string, quantity: number) => void;
  nights: number;
  onNext: () => void;
}) => {
  const getQuantity = (roomId: string) => {
    return selectedRooms.find(sr => sr.room.id === roomId)?.quantity || 0;
  };

  const totalAmount = selectedRooms.reduce((sum, sr) => {
    const rate = sr.room.kind === 'dorm' ? 0 : 0.05;
    const roomTotal = sr.room.discountedPrice * sr.quantity * nights;
    return sum + roomTotal + Math.round(roomTotal * rate);
  }, 0);

  return (
    <div className="flex flex-col min-h-[calc(100vh-10rem)] px-4 pb-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4"
      >
        <h3 className="text-lg font-bold text-white mb-1">Select Your Rooms</h3>
        <p className="text-sm text-white/80">{nights} night{nights > 1 ? 's' : ''} · Choose rooms & beds</p>
      </motion.div>

      <div className="space-y-3">
        {availableRooms.map((room, idx) => {
          const qty = getQuantity(room.id);
          const maxQty = room.kind === 'dorm' ? room.totalUnits : room.totalUnits;
          return (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={cn(
                "p-4 rounded-2xl border transition-all",
                qty > 0
                  ? "bg-white/10 border-white/20"
                  : "bg-white/5 border-white/10"
              )}
            >
              <div className="flex gap-3">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/10 flex-shrink-0">
                  <UnifiedImage
                    src={room.image}
                    alt={room.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white text-sm truncate">{room.name}</p>
                  <p className="text-xs text-white/75 mt-0.5">
                    {room.kind === 'dorm' ? `${room.capacity}-bed ${room.category}` : `Up to ${room.capacity} guests`}
                  </p>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="font-bold text-white">₹{room.discountedPrice.toLocaleString()}</span>
                    {room.originalPrice > room.discountedPrice && (
                      <span className="text-xs text-white/70 line-through">₹{room.originalPrice.toLocaleString()}</span>
                    )}
                    <span className="text-xs text-white/75">/{room.kind === 'dorm' ? 'bed' : 'night'}</span>
                  </div>
                </div>
                {/* Quantity control */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => onRoomChange(room.id, Math.max(0, qty - 1))}
                    disabled={qty === 0}
                    className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center disabled:opacity-30 active:scale-95 transition-all"
                  >
                    −
                  </button>
                  <span className="w-6 text-center font-bold text-white">{qty}</span>
                  <button
                    onClick={() => onRoomChange(room.id, Math.min(maxQty, qty + 1))}
                    disabled={qty >= maxQty}
                    className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center disabled:opacity-30 active:scale-95 transition-all"
                  >
                    +
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Continue Button */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md p-4 bg-gradient-to-t from-[hsl(220,20%,12%)] via-[hsl(220,20%,12%)] to-transparent pt-8">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-white/80 text-sm">
            {selectedRooms.length > 0 ? `${selectedRooms.reduce((s, r) => s + r.quantity, 0)} selected` : 'Select rooms'}
          </span>
          {totalAmount > 0 && (
            <span className="font-bold text-white">₹{totalAmount.toLocaleString()}</span>
          )}
        </div>
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onNext}
          disabled={selectedRooms.length === 0}
          className="w-full h-14 rounded-2xl font-bold text-base bg-white text-[hsl(220,20%,15%)] shadow-xl shadow-black/20 flex items-center justify-center gap-2 disabled:opacity-40"
        >
          Continue to Summary
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
};

// Summary Step
const SummaryStep = ({
  checkIn,
  checkOut,
  selectedRooms,
  nights,
  propertyName,
  subtotal,
  gstAmount,
  total,
  onNext,
}: {
  checkIn: Date;
  checkOut: Date;
  selectedRooms: SelectedRoom[];
  nights: number;
  propertyName: string;
  subtotal: number;
  gstAmount: number;
  total: number;
  onNext: () => void;
}) => {
  return (
    <div className="flex flex-col min-h-[calc(100vh-10rem)] px-4 pb-32">
      {/* Property & Location */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-4"
      >
        <div className="flex items-center gap-2 text-white/70">
          <MapPin className="w-4 h-4" />
          <span className="font-medium text-white">{propertyName}</span>
        </div>
        <p className="text-sm text-white/80 mt-1">Shillong, Meghalaya</p>
      </motion.div>

      {/* Date & Nights */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-4"
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] text-white/75 uppercase tracking-widest">Check-in</p>
            <p className="font-semibold text-white">{format(checkIn, 'EEE, MMM d')}</p>
            <p className="text-sm text-white/75">From 11:00 AM</p>
          </div>
          <div>
            <p className="text-[10px] text-white/75 uppercase tracking-widest">Check-out</p>
            <p className="font-semibold text-white">{format(checkOut, 'EEE, MMM d')}</p>
            <p className="text-sm text-white/75">Strictly 10:00 AM</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex justify-between">
            <span className="text-white/80">Duration</span>
            <span className="font-medium text-white">{nights} night{nights > 1 ? 's' : ''}</span>
          </div>
        </div>
      </motion.div>

      {/* Selected Rooms */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-4"
      >
        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
          <Bed className="w-4 h-4 text-primary" />
          Selected Rooms
        </h4>
        <div className="space-y-3">
          {selectedRooms.map(({ room, quantity }) => {
            const breakfastNote = getBreakfastInclusion(room.id);
            const canonicalPrice = getCanonicalRate(room.id);
            return (
              <div key={room.id} className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-white/10 flex-shrink-0">
                  <UnifiedImage
                    src={room.image}
                    alt={room.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white text-sm truncate">{room.name}</p>
                  <p className="text-xs text-white/80">
                    {quantity} × {room.kind === 'dorm' ? 'bed' : 'room'}
                  </p>
                  {breakfastNote && (
                    <p className="text-[11px] text-amber-300 mt-0.5">✨ {breakfastNote}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-semibold text-white">₹{(canonicalPrice * quantity * nights).toLocaleString()}</p>
                  <p className="text-xs text-white/75">{nights}N</p>
                </div>
              </div>
            );
          })}
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
            <span className="text-white/80">Room charges ({nights} night{nights > 1 ? 's' : ''}), all inclusive</span>
            <span className="text-white">₹{total.toLocaleString()}</span>
          </div>
          {gstAmount > 0 && (
            <div className="flex justify-between">
              <span className="text-white/60">Includes GST</span>
              <span className="text-white/60">₹{gstAmount.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between pt-3 border-t border-white/10 font-bold text-lg">
            <span className="text-white">Total</span>
            <span className="text-white">₹{total.toLocaleString()}</span>
          </div>
        </div>
      </motion.div>

      {/* Pay at Hotel Badge */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="flex items-center gap-3 p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20"
      >
        <Shield className="w-5 h-5 text-emerald-400" />
        <div>
          <p className="font-medium text-emerald-400">No payment now · Enquiry only</p>
          <p className="text-sm text-white/80">Host confirms availability before any payment</p>
        </div>
      </motion.div>

      {/* Continue Button */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md p-4 bg-gradient-to-t from-[hsl(220,20%,12%)] via-[hsl(220,20%,12%)] to-transparent pt-8">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onNext}
          className="w-full h-14 rounded-2xl font-bold text-base bg-white text-[hsl(220,20%,15%)] shadow-xl shadow-black/20 flex items-center justify-center gap-2"
        >
          Continue · Send Enquiry
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
  total,
}: {
  guestDetails: GuestDetails;
  onChange: (field: keyof GuestDetails, value: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  total: number;
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

  const inputClass = "h-12 pl-11 bg-white/5 border-white/10 text-white placeholder:text-white/70 focus:border-white/30 focus:ring-white/10 rounded-xl";
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
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/75" />
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
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/75" />
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
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/75" />
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
            Address <span className="text-white/75">(Optional)</span>
          </Label>
          <div className="relative mt-1.5">
            <Home className="absolute left-3.5 top-3.5 w-4 h-4 text-white/75" />
            <Textarea
              id="address"
              value={guestDetails.address}
              onChange={(e) => onChange('address', e.target.value)}
              placeholder="Street address"
              className="pl-11 min-h-[60px] bg-white/5 border-white/10 text-white placeholder:text-white/70 focus:border-white/30 focus:ring-white/10 rounded-xl"
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
              className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/70 focus:border-white/30 focus:ring-white/10 rounded-xl mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="state" className={labelClass}>State</Label>
            <Input
              id="state"
              value={guestDetails.state}
              onChange={(e) => onChange('state', e.target.value)}
              placeholder="State"
              className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/70 focus:border-white/30 focus:ring-white/10 rounded-xl mt-1.5"
            />
          </div>
        </div>

        {/* Pincode */}
        <div>
          <Label htmlFor="pincode" className={labelClass}>Pincode</Label>
          <Input
            id="pincode"
            value={guestDetails.pincode}
            onChange={(e) => onChange('pincode', e.target.value)}
            placeholder="000000"
            maxLength={6}
            className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/70 focus:border-white/30 focus:ring-white/10 rounded-xl mt-1.5"
          />
        </div>

        {/* Special Requests */}
        <div>
          <Label htmlFor="specialRequests" className={labelClass}>
            Special Requests <span className="text-white/75">(Optional)</span>
          </Label>
          <Textarea
            id="specialRequests"
            value={guestDetails.specialRequests}
            onChange={(e) => onChange('specialRequests', e.target.value)}
            placeholder="Any special requirements..."
            className="min-h-[80px] bg-white/5 border-white/10 text-white placeholder:text-white/70 focus:border-white/30 focus:ring-white/10 rounded-xl mt-1.5"
          />
        </div>
      </motion.div>

      {/* Submit Button */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md p-4 bg-gradient-to-t from-[hsl(220,20%,12%)] via-[hsl(220,20%,12%)] to-transparent pt-8">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={cn(
            "w-full h-14 rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-2",
            isSubmitting 
              ? "bg-white/50 text-[hsl(220,20%,15%)]/50 cursor-not-allowed"
              : "bg-gradient-to-r from-primary to-orange-500 text-white shadow-xl shadow-primary/25"
          )}
        >
          {isSubmitting ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles className="w-5 h-5" />
              </motion.div>
              Saving enquiry...
            </>
          ) : (
            <>
              <MessageCircle className="h-5 w-5" /> Send WhatsApp enquiry
              <span className="text-sm font-normal opacity-80">• ₹{total.toLocaleString()}</span>
            </>
          )}
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
  selectedRooms,
  total,
  onGoHome,
  onWhatsAppHost,
}: {
  bookingId: string;
  guestName: string;
  checkIn: Date;
  checkOut: Date;
  selectedRooms: SelectedRoom[];
  total: number;
  onGoHome: () => void;
  onWhatsAppHost: () => void;
}) => {
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
        Enquiry Sent!
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-white/60 mb-2 text-lg"
      >
        Thanks, {guestName.split(' ')[0]}!
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="flex items-center gap-2 text-amber-400 mb-4 text-sm font-medium"
      >
        <Shield className="w-4 h-4" />
        <span>Awaiting host confirmation</span>
      </motion.div>

      {/* Enquiry disclaimer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="w-full max-w-sm mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-left"
      >
        <p className="text-amber-200 text-sm leading-relaxed">
          <span className="font-semibold">This is a booking enquiry</span>, not a confirmed reservation.
          The host will review your dates and reach out on WhatsApp shortly to confirm
          availability and share payment details. No charge has been made.
        </p>
      </motion.div>

      {/* Booking Details Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="p-5 rounded-2xl bg-white/5 border border-white/10 text-left w-full max-w-sm mb-6"
      >
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-white/80">Enquiry ID</span>
            <span className="font-mono font-bold text-emerald-400">{bookingId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/80">Rooms</span>
            <span className="font-medium text-white text-right">
              {selectedRooms.map(r => `${r.quantity}× ${r.room.name}`).join(', ')}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/80">Check-in</span>
            <span className="font-medium text-white">{format(checkIn, 'MMM d, yyyy')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/80">Check-out</span>
            <span className="font-medium text-white">{format(checkOut, 'MMM d, yyyy')}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-white/10">
            <span className="text-white/80">Estimated Total</span>
            <span className="font-bold text-white">₹{total.toLocaleString()}</span>
          </div>
        </div>
      </motion.div>

      {/* WhatsApp Host CTA */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        whileTap={{ scale: 0.98 }}
        onClick={onWhatsAppHost}
        className="w-full max-w-sm h-14 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-base flex items-center justify-center gap-2 transition-colors shadow-xl shadow-emerald-500/20 mb-4"
      >
        <MessageCircle className="w-5 h-5" />
        Message Host on WhatsApp
      </motion.button>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex items-center gap-2 text-sm text-white/75 mb-6 text-center"
      >
        <Sparkles className="w-4 h-4" />
        <span>Enquiry saved. Send the pre-filled message in WhatsApp to reach the host.</span>
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

// Main Component
export default function SimplifiedBookingFlow() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const hasTrackedEntry = useRef(false);
  
  const { user } = useOptionalAuth();

  // State
  // Without dates in the URL the first screen is the date picker — decide it up front so the
  // server renders it (fast first paint, crawlable) instead of a loading state.
  const [currentStep, setCurrentStep] = useState<BookingStep>(() =>
    searchParams.get('checkIn') && searchParams.get('checkOut') ? 'summary' : 'dates',
  );
  const [direction, setDirection] = useState(1);
  const [checkIn, setCheckIn] = useState<Date | undefined>();
  const [checkOut, setCheckOut] = useState<Date | undefined>();
  const [selectedRooms, setSelectedRooms] = useState<SelectedRoom[]>([]);
  const [propertyName, setPropertyName] = useState('');
  const [availableRooms, setAvailableRooms] = useState<RoomType[]>([]);
  const [fromHeroSearch, setFromHeroSearch] = useState(false);
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

  // Load booking data from sessionStorage OR URL search params (hero search)
  useEffect(() => {
    try {
      const bookingData = sessionStorage.getItem('xtsy_simplified_booking');
      if (bookingData) {
        const data = JSON.parse(bookingData);
        if (data.checkIn) setCheckIn(parseISO(data.checkIn));
        if (data.checkOut) setCheckOut(parseISO(data.checkOut));
        if (data.propertyName) setPropertyName(data.propertyName);
        if (data.selectedRooms && Array.isArray(data.selectedRooms)) {
          const rooms: SelectedRoom[] = data.selectedRooms
            .map((sr: { roomId: string; quantity: number }) => {
              const room = ROOM_INVENTORY[sr.roomId];
              if (room) {
                return { room, quantity: sr.quantity };
              }
              return null;
            })
            .filter(Boolean) as SelectedRoom[];
          setSelectedRooms(rooms);
        }
        // A saved booking continues at the summary (the default step is the date picker).
        if (data.checkIn && data.checkOut) setCurrentStep('summary');
      } else {
        // Fallback: try URL search params from hero search
        const urlCheckIn = searchParams.get('checkIn');
        const urlCheckOut = searchParams.get('checkOut');
        const urlLocation = searchParams.get('location') || 'shillong';
        const urlProperty = searchParams.get('property'); // 'xtsy-experience' | 'xtsy-hostel' | null

        if (urlCheckIn && urlCheckOut) {
          setCheckIn(parseISO(urlCheckIn));
          setCheckOut(parseISO(urlCheckOut));
          setFromHeroSearch(true);

          // Determine which property to show rooms for.
          // Priority: explicit property param > location-based fallback
          const isXperience =
            urlProperty === 'xtsy-experience' ||
            urlLocation === 'xtsy-xperience' ||
            urlLocation === 'xtsy-270';

          setPropertyName(isXperience ? 'Experience by XTSY' : 'XTSY Travellers Hostel');

          // Get all bookable rooms for this property
          const bookableRooms = Object.values(ROOM_INVENTORY)
            .filter(r => {
              if (!r.isBookable) return false;
              if (isXperience) return r.propertyType === 'Experience by XTSY';
              return r.propertyType !== 'Experience by XTSY';
            })
            .sort((a, b) => a.displayOrder - b.displayOrder);

          if (bookableRooms.length > 0) {
            setAvailableRooms(bookableRooms);
            setCurrentStep('rooms');
          } else {
            navigate('/');
          }
        } else {
          // No dates yet (e.g. "Book now" from the header): ask for them here
          // instead of bouncing the guest to the home page.
          setCurrentStep('dates');
        }
      }
    } catch {
      setCurrentStep('dates');
    }
  }, [navigate, searchParams]);

  // Pre-fill guest details from user
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

  // Track booking flow entry
  useEffect(() => {
    if (hasTrackedEntry.current || selectedRooms.length === 0) return;
    hasTrackedEntry.current = true;

    trackBookingStart(
      selectedRooms[0]?.room.name || 'Multiple',
      total,
      checkIn?.toISOString().split('T')[0] || '',
      checkOut?.toISOString().split('T')[0] || '',
      selectedRooms.reduce((sum, r) => sum + r.quantity, 0)
    );

  }, [selectedRooms, propertyName]);

  // Calculations
  const nights = useMemo(() => {
    if (checkIn && checkOut) {
      return differenceInDays(checkOut, checkIn);
    }
    return 0;
  }, [checkIn, checkOut]);

  // Room rates are all inclusive: the total is the sum of the room prices; the GST inside it is
  // shown for information. Same maths as the database's enquiry check (quoteStay).
  const { subtotal, gstAmount, total } = useMemo(() => {
    const q = quoteStay(selectedRooms.map(({ room, quantity }) => ({ nightlyRate: room.discountedPrice, quantity })), nights);
    return { subtotal: q.subtotal, gstAmount: q.taxes, total: q.total };
  }, [selectedRooms, nights]);

  // Navigation
  const totalSteps = fromHeroSearch ? 3 : 2;
  const stepNumber = currentStep === 'rooms' ? 1 : currentStep === 'summary' ? (fromHeroSearch ? 2 : 1) : currentStep === 'details' ? (fromHeroSearch ? 3 : 2) : totalSteps;
  const stepTitle = currentStep === 'rooms' ? 'Select Rooms' : currentStep === 'summary' ? 'Review' : currentStep === 'details' ? 'Guest Details' : 'Confirmed';
  const canGoBack = currentStep === 'details' || (currentStep === 'summary' && fromHeroSearch);

  const goToStep = useCallback((step: BookingStep) => {
    const stepOrder: BookingStep[] = ['rooms', 'summary', 'details', 'confirmation'];
    const currentIdx = stepOrder.indexOf(currentStep);
    const newIdx = stepOrder.indexOf(step);
    setDirection(newIdx > currentIdx ? 1 : -1);
    setCurrentStep(step);
  }, [currentStep]);

  // Step-by-step funnel tracking: records every step view so the admin dashboard
  // can show where guests leave (dates → rooms → summary → details → confirmation).
  // Consent-gated and admin-excluded inside trafficAnalytics.trackInteraction.
  const lastTrackedStep = useRef<BookingStep | null>(null);
  useEffect(() => {
    if (lastTrackedStep.current === currentStep) return;
    lastTrackedStep.current = currentStep;
    void trafficAnalytics.trackInteraction({
      session_id: trafficAnalytics.getSessionId(),
      event_type: 'custom',
      event_name: 'booking_step_view',
      event_category: 'booking_funnel',
      page_url: window.location.pathname,
      metadata: {
        step: currentStep,
        property: propertyName || null,
        nights: nights || null,
        rooms_selected: selectedRooms.length,
        room_names: selectedRooms.map(sr => sr.room.name),
        guests: selectedRooms.reduce((sum, r) => sum + r.quantity, 0) || null,
        total: total || null,
      },
    });
  }, [currentStep, propertyName, nights, selectedRooms, total]);

  const goBack = useCallback(() => {
    if (currentStep === 'details') {
      goToStep('summary');
    } else if (currentStep === 'summary' && fromHeroSearch) {
      goToStep('rooms');
    } else {
      navigate(-1);
    }
  }, [currentStep, fromHeroSearch, goToStep, navigate]);

  // Handle room quantity change from room selection step
  const handleRoomChange = useCallback((roomId: string, quantity: number) => {
    setSelectedRooms(prev => {
      const room = ROOM_INVENTORY[roomId] || availableRooms.find(r => r.id === roomId);
      if (!room) return prev;
      if (quantity === 0) {
        return prev.filter(sr => sr.room.id !== roomId);
      }
      const existing = prev.find(sr => sr.room.id === roomId);
      if (existing) {
        return prev.map(sr => sr.room.id === roomId ? { ...sr, quantity } : sr);
      }
      return [...prev, { room, quantity }];
    });
  }, [availableRooms]);

  // Handle booking submission
  const handleSubmitBooking = async () => {
    if (isSubmitting || selectedRooms.length === 0 || !checkIn || !checkOut) return;

    // Open on the guest's click, before awaiting the database, to avoid popup blockers.
    const whatsAppTab = window.open('', '_blank');
    setIsSubmitting(true);
    try {
      const { data: catalogue, error: catalogueError } = await supabase.from('room_types')
        .select('id,name,base_price,is_active').eq('is_active', true);
      if (catalogueError) throw catalogueError;
      const quote = resolveBookingQuote((catalogue ?? []).map(entry => ({ ...entry, id: String(entry.id), base_price: Number(entry.base_price), is_active: entry.is_active === true })),
        selectedRooms.map(({ room, quantity }) => ({ name: room.name, quantity, kind: room.kind, capacity: room.capacity })), nights);
      const { rooms, guests } = quote;
      if (rooms.some((room, index) => room.nightlyRate !== selectedRooms[index]?.room.discountedPrice)) {
        setSelectedRooms(prev => prev.map((selection, index) => ({ ...selection, room: { ...selection.room, discountedPrice: rooms[index]?.nightlyRate ?? selection.room.discountedPrice } })));
        whatsAppTab?.close();
        goToStep('summary');
        toast.info('The current room price has been loaded. Please review the updated total and send your enquiry.');
        return;
      }
      const source = bookingPageSource();
      const requests = [`Page: ${source}`, guestDetails.specialRequests, guestDetails.address && `Address: ${guestDetails.address}`, [guestDetails.city, guestDetails.state, guestDetails.pincode].filter(Boolean).join(', ')].filter(Boolean).join(' | ').slice(0, 2000);
      const { data, error } = await supabase.rpc('create_whatsapp_enquiry', {
        p_guest_name: guestDetails.name.trim(), p_email: guestDetails.email.trim(), p_phone: guestDetails.phone.trim(),
        p_check_in: format(checkIn, 'yyyy-MM-dd'), p_check_out: format(checkOut, 'yyyy-MM-dd'),
        p_guests: guests, p_room_ids: rooms.map(r => r.id), p_quantities: rooms.map(r => r.quantity),
        p_breakfast: false, p_decoration: false, p_subtotal: quote.subtotal, p_taxes: quote.taxes,
        p_total: quote.total, p_requests: requests,
      });
      if (error) throw error;
      const saved = typeof data === 'string' ? JSON.parse(data) : data;
      if (!saved?.success || !saved.enquiry_id) throw new Error(saved?.error || 'Could not save enquiry');
      setBookingId(saved.enquiry_id);
      const message = generateBookingMessage({
        roomType: rooms.map(r => `${r.quantity}× ${r.name} (₹${r.nightlyRate.toLocaleString('en-IN')}/night, GST included)`).join(', '),
        guests, checkIn: format(checkIn, 'yyyy-MM-dd'), checkOut: format(checkOut, 'yyyy-MM-dd'), nights,
        totalPrice: quote.total, guestName: guestDetails.name, email: guestDetails.email, phone: guestDetails.phone,
        address: guestDetails.address, city: guestDetails.city, state: guestDetails.state,
        pincode: guestDetails.pincode, specialRequests: guestDetails.specialRequests,
        reference: saved.enquiry_id, source,
      });
      const url = `https://wa.me/918837317070?text=${encodeURIComponent(message)}`;
      if (whatsAppTab && !whatsAppTab.closed) { whatsAppTab.opener = null; whatsAppTab.location.href = url; }
      else openWhatsAppDirectly(message);
      goToStep('confirmation');
      toast.success('Enquiry saved. Send your message in WhatsApp to reach the host.');
    } catch (error) {
      whatsAppTab?.close();
      toast.error(error instanceof Error ? error.message : 'Could not save enquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (currentStep === 'dates') {
    return (
      <DateStep
        initialProperty={searchParams.get('property') === 'xtsy-experience' || searchParams.get('location') === 'xtsy-270' ? 'xtsy-experience' : 'xtsy-hostel'}
        onSubmit={(ci, co, property) => {
          sessionStorage.removeItem('xtsy_simplified_booking');
          setSearchParams({ checkIn: ci, checkOut: co, property, location: property === 'xtsy-experience' ? 'xtsy-270' : 'shillong' });
        }}
      />
    );
  }

  // Don't render until dates are loaded (rooms can be empty for hero search entry)
  if (!checkIn || !checkOut) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[hsl(220,20%,12%)] to-[hsl(220,25%,6%)] flex flex-col items-center justify-center gap-2 px-4 text-center">
        <h1 className="text-xl font-semibold text-white">Book your stay at XTSY Travellers Hostel</h1>
        <div className="text-white/80">Loading booking details...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[hsl(220,20%,12%)] to-[hsl(220,25%,6%)]">
      <Helmet>
      </Helmet>
      {/* Header */}
      {currentStep !== 'confirmation' && (
        <BookingHeader
          step={stepTitle}
          stepNumber={stepNumber}
          totalSteps={totalSteps}
          onBack={goBack}
          canGoBack={canGoBack}
          onHome={() => navigate(-1)}
        />
      )}

      {/* Centered Container */}
      <div className="max-w-md mx-auto">
        {/* Step Indicator */}
        {currentStep !== 'confirmation' && (
          <StepIndicator currentStep={stepNumber - 1} total={totalSteps} />
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
            {currentStep === 'rooms' && (
              <RoomSelectionStep
                availableRooms={availableRooms}
                selectedRooms={selectedRooms}
                onRoomChange={handleRoomChange}
                nights={nights}
                onNext={() => goToStep('summary')}
              />
            )}

            {currentStep === 'summary' && selectedRooms.length > 0 && (
              <SummaryStep
                checkIn={checkIn}
                checkOut={checkOut}
                selectedRooms={selectedRooms}
                nights={nights}
                propertyName={propertyName}
                subtotal={subtotal}
                gstAmount={gstAmount}
                total={total}
                onNext={() => {
                  goToStep('details');
                }}
              />
            )}

            {currentStep === 'details' && (
              <GuestDetailsStep
                guestDetails={guestDetails}
                onChange={(field, value) => setGuestDetails(prev => ({ ...prev, [field]: value }))}
                onSubmit={handleSubmitBooking}
                isSubmitting={isSubmitting}
                total={total}
              />
            )}

            {currentStep === 'confirmation' && (
              <ConfirmationStep
                bookingId={bookingId}
                guestName={guestDetails.name}
                checkIn={checkIn}
                checkOut={checkOut}
                selectedRooms={selectedRooms}
                total={total}
                onGoHome={() => navigate('/')}
                onWhatsAppHost={() => {
                  openWhatsAppDirectly(
                    generateBookingMessage({
                      roomType: selectedRooms.map(r => `${r.quantity}× ${r.room.name}`).join(', '),
                      guests: selectedRooms.reduce((s, r) => s + (r.room.kind === 'dorm' ? r.quantity : r.room.capacity * r.quantity), 0),
                      checkIn: format(checkIn, 'yyyy-MM-dd'),
                      checkOut: format(checkOut, 'yyyy-MM-dd'),
                      nights,
                      totalPrice: total,
                      guestName: guestDetails.name,
                      email: guestDetails.email,
                      phone: guestDetails.phone,
                      address: guestDetails.address, city: guestDetails.city, state: guestDetails.state,
                      pincode: guestDetails.pincode, specialRequests: guestDetails.specialRequests,
                      reference: bookingId, source: bookingPageSource(),
                    })
                  );
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
