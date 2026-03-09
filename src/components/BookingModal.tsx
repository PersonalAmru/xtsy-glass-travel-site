import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, ChevronLeft, ChevronRight, Users, Calendar, Plus, Minus, Check, Loader2, 
  Bed, Home, ZoomIn, Sparkles, Shield, MapPin, Star, Camera, ChevronDown, Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, differenceInDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { createEnquiry } from '@/services/enquiryService';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { getBookableRoomTypes, RoomTypeConfig, ROOM_TYPES, ROOM_IMAGES } from '@/config/roomTypes';
import { motion, AnimatePresence } from 'framer-motion';
import EnquirySuccessModal from './EnquirySuccessModal';
import CelebrationInterstitial from './CelebrationInterstitial';
import { CurrencySelector } from './CurrencySelector';
import { useApp } from '@/contexts/AppContext';

// Winter discount configuration
const WINTER_DISCOUNT = 0.10; // 10% off
const applyDiscount = (price: number): number => Math.round(price * (1 - WINTER_DISCOUNT));

interface BookingRoom {
  id: string;
  name: string;
  type: 'dorm' | 'private';
  price: number;           // Discounted price
  originalPrice: number;   // Original price before discount
  capacity: number;
  totalUnits: number;
  image: string;
  images: string[];
}

interface RoomSelection {
  roomId: string;
  quantity: number;
}

const ADD_ONS = [
  { id: 'food_menu', name: 'Request Breakfast & Dinner Menu', price: 0, unit: 'free', icon: '🍽️', tag: 'TAB Bistro by XTSY', description: 'We\'ll share our menu options with you' },
  { id: 'transport', name: 'Airport Pickup/Drop Service', price: 0, unit: 'enquiry', icon: '🚗', tag: 'Check Availability', description: 'Private car with driver (not shared transport)' },
  { id: 'self_drive', name: 'Self Drive Cars & Bikes', price: 0, unit: 'enquiry', icon: '🏍️', tag: 'Check Availability', description: 'Explore at your own pace with our rental options' },
  { id: 'itinerary', name: 'Curated Itinerary + 24/7 Support', price: 0, unit: 'free', icon: '🗺️', tag: 'Service charges applicable', description: 'Full-fledged travel support throughout your trip' },
];

// Country codes for international compliance
const COUNTRY_CODES = [
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+1', country: 'USA/Canada', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬' },
  { code: '+81', country: 'Japan', flag: '🇯🇵' },
  { code: '+82', country: 'South Korea', flag: '🇰🇷' },
  { code: '+86', country: 'China', flag: '🇨🇳' },
  { code: '+977', country: 'Nepal', flag: '🇳🇵' },
  { code: '+880', country: 'Bangladesh', flag: '🇧🇩' },
  { code: '+94', country: 'Sri Lanka', flag: '🇱🇰' },
  { code: '+60', country: 'Malaysia', flag: '🇲🇾' },
  { code: '+66', country: 'Thailand', flag: '🇹🇭' },
  { code: '+31', country: 'Netherlands', flag: '🇳🇱' },
  { code: '+39', country: 'Italy', flag: '🇮🇹' },
  { code: '+34', country: 'Spain', flag: '🇪🇸' },
  { code: '+7', country: 'Russia', flag: '🇷🇺' },
  { code: '+55', country: 'Brazil', flag: '🇧🇷' },
  { code: '+27', country: 'South Africa', flag: '🇿🇦' },
  { code: '+64', country: 'New Zealand', flag: '🇳🇿' },
  { code: '+353', country: 'Ireland', flag: '🇮🇪' },
  { code: '+41', country: 'Switzerland', flag: '🇨🇭' },
];

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCheckIn?: Date;
  initialCheckOut?: Date;
  initialGuests?: number;
}

// Premium Lightbox with gesture support
function PremiumLightbox({ 
  images, 
  roomName, 
  isOpen, 
  onClose, 
  initialIndex = 0 
}: { 
  images: string[]; 
  roomName: string; 
  isOpen: boolean; 
  onClose: () => void; 
  initialIndex?: number;
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') setCurrentIndex(prev => Math.max(0, prev - 1));
      if (e.key === 'ArrowRight') setCurrentIndex(prev => Math.min(images.length - 1, prev + 1));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, images.length, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center bg-black backdrop-blur-xl"
      style={{ zIndex: 999999 }}
      onClick={onClose}
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 sm:p-6 z-10 bg-gradient-to-b from-black/80 to-transparent">
        <div className="text-white">
          <h3 className="text-base sm:text-lg font-semibold">{roomName}</h3>
          <p className="text-sm text-white/60">{currentIndex + 1} of {images.length}</p>
        </div>
        <button 
          onClick={onClose}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Instagram-style 4:5 portrait image container */}
      <div 
        className="relative w-full h-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fixed 4:5 aspect ratio container */}
        <div className="relative w-full max-w-[min(85vw,400px)] aspect-[4/5] mx-auto">
          <motion.img 
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            src={images[currentIndex]} 
            alt={`${roomName} - Image ${currentIndex + 1}`}
            className="absolute inset-0 w-full h-full object-cover rounded-lg"
          />
        </div>

        {/* Navigation arrows */}
        {currentIndex > 0 && (
          <button 
            onClick={(e) => { e.stopPropagation(); setCurrentIndex(prev => prev - 1); }}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md transition-all"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
        )}
        {currentIndex < images.length - 1 && (
          <button 
            onClick={(e) => { e.stopPropagation(); setCurrentIndex(prev => prev + 1); }}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md transition-all"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        )}
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
            className={cn(
              'h-1.5 rounded-full transition-all',
              currentIndex === idx ? 'w-5 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/60'
            )}
          />
        ))}
      </div>
    </motion.div>,
    document.body
  );
}

// Premium Room Card with hero image
function PremiumRoomCard({ 
  room, 
  quantity,
  onQuantityChange,
  onViewGallery 
}: { 
  room: BookingRoom; 
  quantity: number;
  onQuantityChange: (delta: number) => void;
  onViewGallery: () => void;
}) {
  const isDorm = room.type === 'dorm';
  const unitLabel = isDorm ? 'bed' : 'room';
  const priceLabel = isDorm ? 'per bed' : 'per room';
  const isSelected = quantity > 0;

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'relative overflow-hidden rounded-3xl transition-all duration-300',
        isSelected 
          ? 'ring-2 ring-primary shadow-lg shadow-primary/20' 
          : 'ring-1 ring-border/50 hover:ring-border'
      )}
    >
      {/* Hero Image */}
      <div 
        className="relative h-44 cursor-pointer group overflow-hidden"
        onClick={onViewGallery}
      >
        <img 
          src={room.image} 
          alt={room.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        {/* Gallery badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md text-white text-xs font-medium">
          <Camera className="w-3.5 h-3.5" />
          {room.images.length}
        </div>

        {/* Room type badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-medium">
          {isDorm ? <Bed className="w-3.5 h-3.5" /> : <Home className="w-3.5 h-3.5" />}
          {isDorm ? 'Dormitory' : 'Private Room'}
        </div>

        {/* Room name overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h4 className="text-white font-semibold text-lg leading-tight">{room.name}</h4>
          <div className="flex items-center gap-3 mt-1 text-white/80 text-sm">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {isDorm ? `${room.capacity}-bed room` : `Up to ${room.capacity}`}
            </span>
            <span className="w-1 h-1 rounded-full bg-white/40" />
            <span>{room.totalUnits} available</span>
          </div>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md text-white text-sm">
            <ZoomIn className="w-4 h-4" />
            View Gallery
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="p-4 bg-background">
        <div className="flex items-center justify-between">
          {/* Price with discount */}
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-foreground">₹{room.price.toLocaleString()}</span>
              <span className="text-sm text-muted-foreground line-through">₹{room.originalPrice.toLocaleString()}</span>
              <span className="text-xs font-medium text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded">10% OFF</span>
            </div>
            <span className="text-xs text-muted-foreground">{priceLabel}/night • Winter Special</span>
            {isSelected && (
              <motion.p 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-primary font-medium mt-1"
              >
                ₹{(room.price * quantity).toLocaleString()} for {quantity} {unitLabel}{quantity > 1 ? 's' : ''}
              </motion.p>
            )}
          </div>

          {/* Quantity Stepper */}
          <div className="flex items-center gap-1 bg-muted rounded-2xl p-1">
            <button 
              onClick={() => onQuantityChange(-1)}
              disabled={quantity === 0}
              className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center transition-all',
                quantity === 0 
                  ? 'text-muted-foreground/40' 
                  : 'text-foreground hover:bg-background active:scale-95'
              )}
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className={cn(
              'w-8 text-center font-bold text-lg transition-colors',
              isSelected ? 'text-primary' : 'text-muted-foreground'
            )}>
              {quantity}
            </span>
            <button 
              onClick={() => onQuantityChange(1)}
              disabled={quantity >= room.totalUnits}
              className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center transition-all',
                quantity >= room.totalUnits 
                  ? 'text-muted-foreground/40' 
                  : 'text-foreground hover:bg-background active:scale-95'
              )}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Selection indicator */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute top-16 right-3 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg"
          >
            <Check className="w-4 h-4 text-primary-foreground" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Step indicator with icons
const STEPS = [
  { num: 1, label: 'Rooms', icon: Bed },
  { num: 2, label: 'Dates', icon: Calendar },
  { num: 3, label: 'Add-ons', icon: Sparkles },
  { num: 4, label: 'Details', icon: Shield },
];

export default function BookingModal({ isOpen, onClose, initialCheckIn, initialCheckOut, initialGuests = 2 }: BookingModalProps) {
  const { user } = useUserAuth();
  const { formatPrice, setCurrency } = useApp();
  
  const ROOMS: BookingRoom[] = useMemo(() => {
    return getBookableRoomTypes().map((room: RoomTypeConfig) => {
      const images = room.images || ROOM_IMAGES[room.id] || [];
      const primaryImage = images[0] || room.image || 'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20Female%20Only%20Dorms/1.jpg';
      return {
        id: room.id,
        name: room.name,
        type: room.unitType === 'bed' ? 'dorm' : 'private',
        price: applyDiscount(room.basePrice),        // 10% winter discount applied
        originalPrice: room.basePrice,                // Original price for display
        capacity: room.capacity,
        totalUnits: room.totalUnits,
        image: primaryImage,
        images: images.length > 0 ? images : [primaryImage],
      };
    });
  }, []);
  
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roomSelections, setRoomSelections] = useState<RoomSelection[]>([]);
  const [guests, setGuests] = useState(initialGuests);
  const [checkIn, setCheckIn] = useState<Date | undefined>(initialCheckIn);
  const [checkOut, setCheckOut] = useState<Date | undefined>(initialCheckOut);
  const [selectedAddOns, setSelectedAddOns] = useState<Record<string, boolean>>({});
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestWhatsApp, setGuestWhatsApp] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [guestDOB, setGuestDOB] = useState('');
  const [guestCity, setGuestCity] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [policyAccepted, setPolicyAccepted] = useState(false);
  const [promotionalConsent, setPromotionalConsent] = useState(false);
  const [lightboxRoom, setLightboxRoom] = useState<BookingRoom | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [successData, setSuccessData] = useState<{
    guestName: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    roomCount: number;
    roomType: string;
    totalAmount: number;
    ratePerNight: number;
    quantity: number;
    nights: number;
    gstRate: number;
    gstAmount: number;
    subtotal: number;
    guestEmail: string;
    guestPhone: string;
    guestCity: string;
    roomSelections: { roomName: string; quantity: number; ratePerNight: number; gstRate: number; lineTotal: number }[];
  } | null>(null);

  useEffect(() => {
    if (user?.profile) {
      setGuestName(user.profile.full_name || '');
      setGuestEmail(user.profile.email || '');
      setGuestPhone(user.profile.phone || '');
    }
  }, [user?.profile]);

  useEffect(() => {
    if (!isOpen && !showSuccessModal && !showCelebration) {
      setStep(1);
      setRoomSelections([]);
      setCheckIn(initialCheckIn);
      setCheckOut(initialCheckOut);
      setGuests(initialGuests);
      setSelectedAddOns({});
      setSpecialRequests('');
      setGuestWhatsApp('');
      setCountryCode('+91');
      setIsCountryDropdownOpen(false);
      setGuestDOB('');
      setGuestCity('');
      setPolicyAccepted(false);
      setPromotionalConsent(false);
      setLightboxRoom(null);
      setShowSuccessModal(false);
      setShowCelebration(false);
      setSuccessData(null);
    }
  }, [isOpen, showSuccessModal, showCelebration, initialCheckIn, initialCheckOut, initialGuests]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Close country dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isCountryDropdownOpen) {
        const target = e.target as HTMLElement;
        if (!target.closest('[data-country-dropdown]')) {
          setIsCountryDropdownOpen(false);
        }
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isCountryDropdownOpen]);

  const getRoomQuantity = useCallback((roomId: string) => {
    return roomSelections.find(s => s.roomId === roomId)?.quantity || 0;
  }, [roomSelections]);

  const updateRoomQuantity = useCallback((roomId: string, delta: number) => {
    const room = ROOMS.find(r => r.id === roomId);
    if (!room) return;

    setRoomSelections(prev => {
      const existing = prev.find(s => s.roomId === roomId);
      const currentQty = existing?.quantity || 0;
      const newQty = Math.max(0, Math.min(currentQty + delta, room.totalUnits));

      if (newQty === 0) {
        return prev.filter(s => s.roomId !== roomId);
      }

      if (existing) {
        return prev.map(s => s.roomId === roomId ? { ...s, quantity: newQty } : s);
      }

      return [...prev, { roomId, quantity: newQty }];
    });
  }, [ROOMS]);

  const nights = checkIn && checkOut ? Math.max(1, differenceInDays(checkOut, checkIn)) : 0;
  
  const totalBedsSelected = useMemo(() => {
    return roomSelections.reduce((sum, sel) => {
      const room = ROOMS.find(r => r.id === sel.roomId);
      if (room?.type === 'dorm') {
        return sum + sel.quantity;
      } else {
        return sum + sel.quantity * (room?.capacity || 1);
      }
    }, 0);
  }, [roomSelections, ROOMS]);

  const roomTotal = useMemo(() => {
    return roomSelections.reduce((total, sel) => {
      const room = ROOMS.find(r => r.id === sel.roomId);
      if (!room) return total;
      return total + (room.price * sel.quantity * nights);
    }, 0);
  }, [roomSelections, ROOMS, nights]);

  const addOnTotal = Object.entries(selectedAddOns).reduce((total, [id, selected]) => {
    if (!selected) return total;
    const addOn = ADD_ONS.find(a => a.id === id);
    if (!addOn) return total;
    return addOn.unit === 'one-time' ? total + addOn.price : total + addOn.price * guests * nights;
  }, 0);
  
  const subtotal = roomTotal + addOnTotal;
  
  // GST Calculation: 18% for rooms >= ₹7500/night (XTSY 270), 5% for rooms < ₹7500
  // Add-ons always at 18% GST
  const gstBreakdown = useMemo(() => {
    let gst5Total = 0;  // Rooms under ₹7500/night
    let gst18Total = 0; // Rooms ₹7500+ and add-ons
    
    // Calculate GST for each room based on per-night rate
    roomSelections.forEach(sel => {
      const room = ROOMS.find(r => r.id === sel.roomId);
      if (!room) return;
      const roomLineTotal = room.price * sel.quantity * nights;
      if (room.price >= 7500) {
        gst18Total += roomLineTotal;
      } else {
        gst5Total += roomLineTotal;
      }
    });
    
    // Add-ons always at 18% GST
    gst18Total += addOnTotal;
    
    const gst5Amount = Math.round(gst5Total * 0.05);
    const gst18Amount = Math.round(gst18Total * 0.18);
    
    return {
      gst5Base: gst5Total,
      gst18Base: gst18Total,
      gst5Amount,
      gst18Amount,
      totalGst: gst5Amount + gst18Amount
    };
  }, [roomSelections, ROOMS, nights, addOnTotal]);
  
  const gstAmount = gstBreakdown.totalGst;
  const totalAmount = subtotal + gstAmount;

  const canProceed = () => {
    switch (step) {
      case 1: return roomSelections.length > 0;
      case 2: return !!checkIn && !!checkOut && nights > 0 && guests === totalBedsSelected;
      case 3: return true;
      case 4: return guestName.trim() && guestEmail.trim() && guestWhatsApp.trim() && guestCity.trim() && policyAccepted;
      default: return false;
    }
  };

  const handleSubmit = async () => {
    if (roomSelections.length === 0 || !checkIn || !checkOut) return;
    setIsSubmitting(true);
    
    try {
      const results = await Promise.all(roomSelections.map(async (sel) => {
        const room = ROOMS.find(r => r.id === sel.roomId);
        if (!room) return { success: false, error: 'Room not found' };

        const roomSubtotal = room.price * sel.quantity * nights;
        // Correct GST rate based on per-night price
        const roomGstRate = room.price >= 7500 ? 18 : 5;
        const roomGst = Math.round(roomSubtotal * (roomGstRate / 100));
        const roomTotal = roomSubtotal + roomGst;

        return createEnquiry({
          guestName,
          guestEmail,
          guestPhone,
          checkIn: format(checkIn, 'yyyy-MM-dd'),
          checkOut: format(checkOut, 'yyyy-MM-dd'),
          roomName: room.name,
          roomType: room.id,
          quantity: sel.quantity,
          nights,
          ratePerNight: room.price,
          subtotal: roomSubtotal,
          gstRate: room.price >= 7500 ? 18 : 5,
          gstAmount: roomGst,
          totalAmount: roomTotal,
          specialRequests: specialRequests || undefined,
          userId: user?.id,
        });
      }));

      const allSuccess = results.every(r => r.success);
      if (allSuccess) {
        // Store success data and show success modal instead of closing
        const primaryRoom = ROOMS.find(r => r.id === roomSelections[0]?.roomId);
        const selectionDetails = roomSelections.map(sel => {
          const room = ROOMS.find(r => r.id === sel.roomId);
          const rate = room?.price || 0;
          const lineSubtotal = rate * sel.quantity * nights;
          const lineGstRate = rate >= 7500 ? 18 : 5;
          const lineGst = Math.round(lineSubtotal * (lineGstRate / 100));
          return {
            roomName: room?.name || 'Room',
            quantity: sel.quantity,
            ratePerNight: rate,
            gstRate: lineGstRate,
            lineTotal: lineSubtotal + lineGst,
          };
        });
        setSuccessData({
          guestName,
          checkIn: format(checkIn, 'yyyy-MM-dd'),
          checkOut: format(checkOut, 'yyyy-MM-dd'),
          guests,
          roomCount: roomSelections.reduce((sum, sel) => sum + sel.quantity, 0),
          roomType: primaryRoom?.name || 'Premium Stay',
          totalAmount,
          ratePerNight: primaryRoom?.price || 0,
          quantity: roomSelections.reduce((sum, sel) => sum + sel.quantity, 0),
          nights,
          gstRate: gstBreakdown.gst18Base > 0 ? 18 : 5,
          gstAmount,
          subtotal,
          guestEmail,
          guestPhone,
          guestCity,
          roomSelections: selectionDetails,
        });
        setShowCelebration(true);
      } else {
        const errors = results.filter(r => !r.success).map(r => r.error).join(', ');
        toast.error('Some bookings failed', { description: errors });
      }
    } catch { 
      toast.error('Something went wrong'); 
    } finally { 
      setIsSubmitting(false); 
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    setSuccessData(null);
    onClose();
  };

  const openLightbox = (room: BookingRoom, index: number) => {
    setLightboxRoom(room);
    setLightboxIndex(index);
  };

  if (!isOpen) return null;

  const modalContent = (
    <div 
      className="fixed inset-0 flex items-end sm:items-center justify-center"
      style={{ zIndex: 99999, isolation: 'isolate' }}
    >
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <motion.div 
        initial={{ opacity: 0, y: 100, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 100, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-lg max-h-[95vh] sm:max-h-[85vh] flex flex-col rounded-t-3xl sm:rounded-3xl bg-background shadow-2xl"
        style={{ zIndex: 2 }}
      >
        {/* Header with step indicator */}
        <div className="relative px-6 pt-6 pb-4 bg-gradient-to-b from-muted/80 to-background">
          {/* Drag handle (mobile) */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-muted-foreground/30 sm:hidden" />
          
          {/* Close button */}
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>

          {/* Title */}
          <div className="pr-10">
            <h2 className="text-xl font-bold text-foreground">Book Your Stay</h2>
            <p className="text-sm text-muted-foreground mt-0.5">XTSY Travellers Hostel Shillong, Meghalaya</p>
          </div>

          {/* Step indicators */}
          <div className="flex items-center justify-between mt-5 px-2">
            {STEPS.map((s, idx) => {
              const Icon = s.icon;
              const isActive = step === s.num;
              const isCompleted = step > s.num;
              
              return (
                <React.Fragment key={s.num}>
                  <button
                    onClick={() => isCompleted && setStep(s.num)}
                    disabled={!isCompleted}
                    className={cn(
                      'flex flex-col items-center gap-1.5 transition-all',
                      isCompleted && 'cursor-pointer'
                    )}
                  >
                    <div className={cn(
                      'w-10 h-10 rounded-2xl flex items-center justify-center transition-all',
                      isActive && 'bg-primary text-primary-foreground shadow-lg shadow-primary/30',
                      isCompleted && 'bg-primary/20 text-primary',
                      !isActive && !isCompleted && 'bg-muted text-muted-foreground'
                    )}>
                      {isCompleted ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    <span className={cn(
                      'text-xs font-medium transition-colors',
                      isActive ? 'text-foreground' : 'text-muted-foreground'
                    )}>
                      {s.label}
                    </span>
                  </button>
                  {idx < STEPS.length - 1 && (
                    <div className={cn(
                      'flex-1 h-0.5 mx-2 rounded-full transition-colors',
                      step > s.num ? 'bg-primary/40' : 'bg-muted'
                    )} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 px-6 pb-4 overflow-y-auto min-h-0">
          <AnimatePresence mode="wait">
            {/* Step 1: Room Selection */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4 py-2"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Choose Your Room</h3>
                    <p className="text-sm text-muted-foreground">Select beds or private rooms</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Currency Selector */}
                    <CurrencySelector 
                      className="text-foreground" 
                      onCurrencyChange={setCurrency}
                    />
                    {roomSelections.length > 0 && (
                      <div className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                        {totalBedsSelected} guest{totalBedsSelected !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  {ROOMS.map((room) => (
                    <PremiumRoomCard
                      key={room.id}
                      room={room}
                      quantity={getRoomQuantity(room.id)}
                      onQuantityChange={(delta) => updateRoomQuantity(room.id, delta)}
                      onViewGallery={() => openLightbox(room, 0)}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: Dates */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5 py-2"
              >
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Select Dates</h3>
                  <p className="text-sm text-muted-foreground">When are you visiting?</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">Check-in</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button 
                          variant="outline" 
                          className={cn(
                            "w-full justify-start text-left font-normal h-14 rounded-2xl border-2",
                            checkIn ? "border-primary/50" : "border-border"
                          )}
                        >
                          <Calendar className="w-5 h-5 mr-3 text-primary" />
                          <div className="flex flex-col items-start">
                            {checkIn ? (
                              <>
                                <span className="text-foreground font-medium">{format(checkIn, 'MMM d')}</span>
                                <span className="text-xs text-muted-foreground">{format(checkIn, 'EEEE')}</span>
                              </>
                            ) : (
                              <span className="text-muted-foreground">Select</span>
                            )}
                          </div>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start" style={{ zIndex: 100000 }}>
                        <CalendarComponent 
                          mode="single" 
                          selected={checkIn} 
                          onSelect={setCheckIn} 
                          disabled={(date) => date < new Date()}
                          autoFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">Check-out</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline" 
                          className={cn(
                            "w-full justify-start text-left font-normal h-14 rounded-2xl border-2",
                            checkOut ? "border-primary/50" : "border-border"
                          )}
                        >
                          <Calendar className="w-5 h-5 mr-3 text-primary" />
                          <div className="flex flex-col items-start">
                            {checkOut ? (
                              <>
                                <span className="text-foreground font-medium">{format(checkOut, 'MMM d')}</span>
                                <span className="text-xs text-muted-foreground">{format(checkOut, 'EEEE')}</span>
                              </>
                            ) : (
                              <span className="text-muted-foreground">Select</span>
                            )}
                          </div>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start" style={{ zIndex: 100000 }}>
                        <CalendarComponent 
                          mode="single" 
                          selected={checkOut} 
                          onSelect={setCheckOut} 
                          disabled={(date) => date <= (checkIn || new Date())}
                          autoFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {nights > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-primary/10 border border-primary/20"
                  >
                    <Star className="w-5 h-5 text-primary" />
                    <span className="font-semibold text-foreground">{nights} night{nights > 1 ? 's' : ''}</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">₹{roomTotal.toLocaleString()}</span>
                  </motion.div>
                )}

                {/* Guest count */}
                <div className="p-4 rounded-2xl bg-muted/50 border border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-foreground">Total Guests</h4>
                      <p className="text-sm text-muted-foreground">How many people are staying?</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setGuests(Math.max(1, guests - 1))} 
                        className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center hover:bg-muted transition-colors"
                      >
                        <Minus className="w-4 h-4 text-foreground" />
                      </button>
                      <span className="w-8 text-center text-xl font-bold text-foreground">{guests}</span>
                      <button 
                        onClick={() => setGuests(guests + 1)} 
                        className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center hover:bg-muted transition-colors"
                      >
                        <Plus className="w-4 h-4 text-foreground" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Selected Rooms Summary */}
                <div className="p-4 rounded-2xl bg-muted/30 border border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-foreground flex items-center gap-2">
                      <Bed className="w-4 h-4 text-primary" />
                      Your Selection
                    </h4>
                    <span className={cn(
                      'text-xs font-medium px-2 py-1 rounded-full',
                      guests <= totalBedsSelected 
                        ? 'bg-green-500/10 text-green-600' 
                        : 'bg-amber-500/10 text-amber-600'
                    )}>
                      {totalBedsSelected} bed{totalBedsSelected !== 1 ? 's' : ''} / {guests} guest{guests !== 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    {roomSelections.map(sel => {
                      const room = ROOMS.find(r => r.id === sel.roomId);
                      if (!room) return null;
                      const isDorm = room.type === 'dorm';
                      const unitLabel = isDorm ? 'bed' : 'room';
                      const lineTotal = room.price * sel.quantity * nights;
                      
                      return (
                        <div key={sel.roomId} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            {isDorm ? (
                              <Bed className="w-3.5 h-3.5 text-muted-foreground" />
                            ) : (
                              <Home className="w-3.5 h-3.5 text-muted-foreground" />
                            )}
                            <span className="text-foreground">
                              {sel.quantity} × {room.name.replace('Bed in ', '').replace(' Dormitory', '')}
                            </span>
                          </div>
                          <span className="text-muted-foreground">
                            {nights > 0 ? `₹${lineTotal.toLocaleString()}` : `₹${room.price}/night`}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Validation message */}
                  {guests > totalBedsSelected && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start gap-2 p-3 rounded-xl bg-destructive/10 border border-destructive/30"
                    >
                      <span className="text-sm">🚫</span>
                      <p className="text-xs text-destructive">
                        You have {guests} guest{guests !== 1 ? 's' : ''} but only {totalBedsSelected} bed{totalBedsSelected !== 1 ? 's' : ''} selected. 
                        Add {guests - totalBedsSelected} more bed{guests - totalBedsSelected !== 1 ? 's' : ''} or reduce guests to continue.
                      </p>
                    </motion.div>
                  )}
                  
                  {guests < totalBedsSelected && totalBedsSelected > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30"
                    >
                      <span className="text-sm">⚠️</span>
                      <p className="text-xs text-amber-600">
                        You selected {totalBedsSelected} bed{totalBedsSelected !== 1 ? 's' : ''} but only {guests} guest{guests !== 1 ? 's' : ''}. 
                        Add {totalBedsSelected - guests} more guest{totalBedsSelected - guests !== 1 ? 's' : ''} or remove beds to continue.
                      </p>
                    </motion.div>
                  )}
                  
                  {guests === totalBedsSelected && totalBedsSelected > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/20"
                    >
                      <Check className="w-4 h-4 text-green-500" />
                      <p className="text-xs text-green-600">
                        Perfect match! {totalBedsSelected} bed{totalBedsSelected !== 1 ? 's' : ''} for {guests} guest{guests !== 1 ? 's' : ''}.
                      </p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 3: Add-ons */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4 py-2"
              >
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Enhance Your Stay</h3>
                  <p className="text-sm text-muted-foreground">Optional add-on services</p>
                </div>

                <div className="space-y-3">
                  {ADD_ONS.map((addOn) => (
                    <button 
                      key={addOn.id} 
                      onClick={() => setSelectedAddOns(prev => ({ ...prev, [addOn.id]: !prev[addOn.id] }))} 
                      className={cn(
                        'w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left',
                        selectedAddOns[addOn.id] 
                          ? 'bg-primary/5 border-primary' 
                          : 'bg-muted/30 border-border hover:border-muted-foreground/30'
                      )}
                    >
                      <span className="text-2xl">{addOn.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-medium text-foreground">{addOn.name}</h4>
                          {addOn.tag && (
                            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary">
                              {addOn.tag}
                            </span>
                          )}
                        </div>
                        {addOn.description && (
                          <p className="text-xs text-muted-foreground mt-0.5">{addOn.description}</p>
                        )}
                        <p className="text-sm text-muted-foreground mt-1">
                          {addOn.price > 0 ? `₹${addOn.price} ${addOn.unit}` : addOn.unit === 'free' ? 'Free' : addOn.unit === 'enquiry' ? 'On request' : addOn.unit}
                        </p>
                      </div>
                      <div className={cn(
                        'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0',
                        selectedAddOns[addOn.id] ? 'bg-primary border-primary' : 'border-muted-foreground/40'
                      )}>
                        {selectedAddOns[addOn.id] && <Check className="w-4 h-4 text-primary-foreground" />}
                      </div>
                    </button>
                  ))}
                </div>

                <p className="text-center text-sm text-muted-foreground">Skip if not needed</p>
              </motion.div>
            )}

            {/* Step 4: Guest Details */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4 py-2"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Your Details</h3>
                    <p className="text-sm text-muted-foreground">Almost done! Enter your info</p>
                  </div>
                  {/* Currency Selector */}
                  <CurrencySelector 
                    className="text-foreground" 
                    onCurrencyChange={setCurrency}
                  />
                </div>

                <div className="space-y-3">
                  <Input 
                    value={guestName} 
                    onChange={(e) => setGuestName(e.target.value)} 
                    placeholder="Full Name *" 
                    className="h-12 rounded-2xl text-base text-foreground bg-background border-border" 
                  />
                  <Input 
                    type="email" 
                    value={guestEmail} 
                    onChange={(e) => setGuestEmail(e.target.value)} 
                    placeholder="Email *" 
                    className="h-12 rounded-2xl text-base text-foreground bg-background border-border" 
                  />
                  {/* Date of Birth with Apple-grade calendar */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "h-12 w-full rounded-2xl text-base justify-start font-normal bg-background border-border",
                          guestDOB ? "text-foreground" : "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {guestDOB ? format(new Date(guestDOB), "dd-MM-yyyy") : "Date of Birth (DD-MM-YYYY)"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 z-[100000] bg-background border border-border shadow-xl" align="start" sideOffset={4}>
                      <CalendarComponent
                        mode="single"
                        selected={guestDOB ? new Date(guestDOB) : undefined}
                        onSelect={(date) => setGuestDOB(date ? format(date, 'yyyy-MM-dd') : '')}
                        disabled={(date) => date > new Date() || date < new Date("1940-01-01")}
                        captionLayout="dropdown"
                        fromYear={1940}
                        toYear={new Date().getFullYear()}
                        className="rounded-xl pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  {/* WhatsApp with Country Code Selector */}
                  <div className="flex gap-2">
                    {/* Simplified Country Code Dropdown with Flag Emoji */}
                    <div className="relative" data-country-dropdown>
                      <button
                        type="button"
                        onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                        className="h-12 px-3 rounded-2xl border border-border bg-background text-foreground flex items-center gap-1.5 hover:bg-muted transition-colors"
                      >
                        <span className="text-xl">{COUNTRY_CODES.find(c => c.code === countryCode)?.flag}</span>
                        <ChevronDown className={cn("w-3.5 h-3.5 text-muted-foreground transition-transform", isCountryDropdownOpen && "rotate-180")} />
                      </button>
                      
                      {isCountryDropdownOpen && (
                        <div className="absolute top-full left-0 mt-1 w-48 max-h-60 overflow-y-auto bg-background border border-border rounded-xl shadow-xl z-[100001]">
                          {COUNTRY_CODES.map((country) => (
                            <button
                              key={country.code}
                              type="button"
                              onClick={() => {
                                setCountryCode(country.code);
                                setIsCountryDropdownOpen(false);
                              }}
                              className={cn(
                                "w-full px-3 py-2 flex items-center gap-2 text-left hover:bg-muted transition-colors text-foreground",
                                countryCode === country.code && "bg-primary/10"
                              )}
                            >
                              <span className="text-lg">{country.flag}</span>
                              <span className="text-sm">{country.code}</span>
                              {countryCode === country.code && <Check className="w-4 h-4 ml-auto text-primary" />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* WhatsApp Number Input */}
                    <Input 
                      type="tel" 
                      value={guestWhatsApp} 
                      onChange={(e) => setGuestWhatsApp(e.target.value.replace(/\D/g, ''))} 
                      placeholder="WhatsApp Number *" 
                      className="h-12 rounded-2xl text-base text-foreground bg-background border-border flex-1" 
                    />
                  </div>
                  <Input 
                    value={guestCity} 
                    onChange={(e) => setGuestCity(e.target.value)} 
                    placeholder="Current City *" 
                    className="h-12 rounded-2xl text-base text-foreground bg-background border-border" 
                  />
                  <Textarea 
                    value={specialRequests} 
                    onChange={(e) => setSpecialRequests(e.target.value)} 
                    placeholder="Special requests (optional)" 
                    rows={2}
                    className="rounded-2xl text-base resize-none text-foreground bg-background border-border"
                  />
                  
                  {/* Promotional Code Section with Winter Discount */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-emerald-500" />
                      <span className="font-semibold text-foreground text-sm">Promotional Offer Applied</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-600 font-medium">WINTER10</span>
                        <span className="text-sm text-muted-foreground">10% Winter Discount</span>
                      </div>
                      <Check className="w-5 h-5 text-emerald-500" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Applied to all bookings. Valid for the winter season.
                    </p>
                  </div>
                </div>

                {/* Consent Section */}
                <div className="space-y-3 p-4 rounded-2xl bg-muted/30 border border-border">
                  <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" />
                    Data & Privacy Consent
                  </h4>
                  
                  {/* Mandatory cookies notice */}
                  <p className="text-xs text-muted-foreground">
                    Essential cookies are enabled by default for security and functionality.
                  </p>
                  
                  {/* Policy acceptance - mandatory */}
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div 
                      onClick={() => setPolicyAccepted(!policyAccepted)}
                      className={cn(
                        'w-5 h-5 mt-0.5 rounded border-2 flex items-center justify-center transition-all flex-shrink-0',
                        policyAccepted ? 'bg-primary border-primary' : 'border-muted-foreground/40 group-hover:border-primary/60'
                      )}
                    >
                      {policyAccepted && <Check className="w-3 h-3 text-primary-foreground" />}
                    </div>
                    <span className="text-sm text-foreground">
                      I accept the <a href="/terms" target="_blank" className="text-primary underline">Terms & Conditions</a> and <a href="/privacy" target="_blank" className="text-primary underline">Privacy Policy</a>. I consent to data collection for improving personalized experiences as per applicable laws. <span className="text-destructive">*</span>
                    </span>
                  </label>
                  
                  {/* Promotional consent - optional */}
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div 
                      onClick={() => setPromotionalConsent(!promotionalConsent)}
                      className={cn(
                        'w-5 h-5 mt-0.5 rounded border-2 flex items-center justify-center transition-all flex-shrink-0',
                        promotionalConsent ? 'bg-primary border-primary' : 'border-muted-foreground/40 group-hover:border-primary/60'
                      )}
                    >
                      {promotionalConsent && <Check className="w-3 h-3 text-primary-foreground" />}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      I'd like to receive promotional updates, offers, and travel tips (optional, can skip)
                    </span>
                  </label>
                </div>

                {/* Summary */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-muted/80 to-muted/40 border border-border">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="font-semibold text-foreground">Booking Summary</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    {roomSelections.map(sel => {
                      const room = ROOMS.find(r => r.id === sel.roomId);
                      if (!room) return null;
                      const lineTotal = room.price * sel.quantity * nights;
                      return (
                        <div key={sel.roomId} className="flex justify-between text-muted-foreground">
                          <span>{sel.quantity}× {room.name.replace('Bed in ', '').slice(0, 20)}</span>
                          <span>₹{lineTotal.toLocaleString()}</span>
                        </div>
                      );
                    })}
                    {addOnTotal > 0 && (
                      <div className="flex justify-between text-muted-foreground">
                        <span>Add-ons</span>
                        <span>₹{addOnTotal.toLocaleString()}</span>
                      </div>
                    )}
                    {/* GST Breakdown */}
                    {gstBreakdown.gst5Amount > 0 && (
                      <div className="flex justify-between text-muted-foreground">
                        <span>GST (5% on Hostel Accommodation)</span>
                        <span>₹{gstBreakdown.gst5Amount.toLocaleString()}</span>
                      </div>
                    )}
                    {gstBreakdown.gst18Amount > 0 && (
                      <div className="flex justify-between text-muted-foreground">
                        <span>GST (18% on premium + add-ons)</span>
                        <span>₹{gstBreakdown.gst18Amount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-foreground font-bold pt-2 border-t border-border">
                      <span>Total</span>
                      <span className="text-primary">₹{totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Footer */}
        <div className="flex-shrink-0 px-6 py-4 border-t border-border bg-background/80 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              onClick={() => step > 1 ? setStep(step - 1) : onClose} 
              className="flex-1 h-14 rounded-2xl text-muted-foreground"
            >
              {step > 1 ? 'Back' : 'Cancel'}
            </Button>
            {step < 4 ? (
              <Button 
                onClick={() => canProceed() && setStep(step + 1)} 
                disabled={!canProceed()}
                className="flex-[2] h-14 rounded-2xl text-base font-semibold"
              >
                Continue
                <ChevronRight className="w-5 h-5 ml-1" />
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit} 
                disabled={!canProceed() || isSubmitting}
                className="flex-[2] h-14 rounded-2xl text-base font-semibold"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : null}
                {isSubmitting ? 'Submitting...' : 'Submit Enquiry'}
              </Button>
            )}
          </div>
        </div>
      </motion.div>
      
      {/* Lightbox */}
      <AnimatePresence>
        {lightboxRoom && (
          <PremiumLightbox
            images={lightboxRoom.images}
            roomName={lightboxRoom.name}
            isOpen={!!lightboxRoom}
            onClose={() => setLightboxRoom(null)}
            initialIndex={lightboxIndex}
          />
        )}
      </AnimatePresence>

      {/* Celebration Interstitial - 3 seconds */}
      {successData && (
        <CelebrationInterstitial
          isOpen={showCelebration}
          guestName={successData.guestName}
          onComplete={() => {
            setShowCelebration(false);
            setShowSuccessModal(true);
          }}
        />
      )}

      {/* Enquiry Success Modal */}
      {successData && (
        <EnquirySuccessModal
          isOpen={showSuccessModal}
          onClose={handleSuccessModalClose}
          guestName={successData.guestName}
          checkIn={successData.checkIn}
          checkOut={successData.checkOut}
          guests={successData.guests}
          roomCount={successData.roomCount}
          roomType={successData.roomType}
          totalAmount={successData.totalAmount}
          isAuthenticated={!!user}
        />
      )}
    </div>
  );

  return createPortal(modalContent, document.body);
}
