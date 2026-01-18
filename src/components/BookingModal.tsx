import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight, Users, Calendar, Plus, Minus, Check, Loader2, Bed, Home, Image as ImageIcon, ZoomIn } from 'lucide-react';
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
import { getBookableRoomTypes, RoomTypeConfig, ROOM_TYPES } from '@/config/roomTypes';

// Room images for gallery (per room type)
const ROOM_IMAGES: Record<string, string[]> = {
  'xtsy-270': [
    '/lovable-uploads/784b2108-6432-4589-b79b-0433fa26bc3b.png',
    '/lovable-uploads/70b7c61f-c52c-479b-9663-3957d72f31b0.png',
    '/lovable-uploads/6a7b3dad-87a3-49d9-98fa-919ff7b09dd0.png',
    '/lovable-uploads/737fc57d-44c2-4784-a8ce-4ad5bcc174ff.png',
  ],
  '4-bed-female-only-dorm': [
    '/lovable-uploads/8059ea95-b64d-4eba-8b12-52e002c59567.png',
    '/lovable-uploads/9190ba64-4f45-45e8-b15d-981db2e861b3.png',
  ],
  '4-bed-mixed-female-dorm': [
    '/lovable-uploads/8059ea95-b64d-4eba-8b12-52e002c59567.png',
    '/lovable-uploads/9190ba64-4f45-45e8-b15d-981db2e861b3.png',
  ],
  '6-bed-mixed-female-dorm': [
    '/lovable-uploads/8059ea95-b64d-4eba-8b12-52e002c59567.png',
    '/lovable-uploads/f60939c8-8351-4f63-80df-a4c6e37e539a.png',
  ],
  '6-bed-mixed-dorm': [
    '/lovable-uploads/8059ea95-b64d-4eba-8b12-52e002c59567.png',
    '/lovable-uploads/f60939c8-8351-4f63-80df-a4c6e37e539a.png',
  ],
  'king-double-room': [
    '/lovable-uploads/0ef988f7-b7f3-4d1f-80e3-fc2a04acd9cb.png',
    '/lovable-uploads/160f683c-a41c-41fd-8bdb-700d74a7e027.png',
  ],
  'king-triple-room': [
    '/lovable-uploads/0ef988f7-b7f3-4d1f-80e3-fc2a04acd9cb.png',
    '/lovable-uploads/160f683c-a41c-41fd-8bdb-700d74a7e027.png',
  ],
};

// Booking room with selection state
interface BookingRoom {
  id: string;
  name: string;
  type: 'dorm' | 'private';
  price: number;            // Price per bed (dorm) or per room (private)
  capacity: number;         // Max beds/guests per unit
  totalUnits: number;       // Total inventory
  image: string;
  images: string[];
}

// Selection state for multi-room booking
interface RoomSelection {
  roomId: string;
  quantity: number;         // Number of beds (dorm) or rooms (private)
}

const ADD_ONS = [
  { id: 'breakfast', name: 'Breakfast', price: 199, unit: 'per person/day' },
  { id: 'dinner', name: 'Dinner', price: 299, unit: 'per person/day' },
  { id: 'transport', name: 'Airport Pickup', price: 799, unit: 'one-time' },
  { id: 'itinerary', name: 'Curated Itinerary', price: 499, unit: 'one-time' },
];

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCheckIn?: Date;
  initialCheckOut?: Date;
  initialGuests?: number;
}

// Image Gallery Lightbox Component
function ImageGalleryLightbox({ 
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
    <div 
      className="fixed inset-0 flex items-center justify-center p-4 bg-black/95"
      style={{ zIndex: 999999 }}
      onClick={onClose}
    >
      {/* Close button */}
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      {/* Room name */}
      <div className="absolute top-4 left-4 text-white">
        <h3 className="text-lg font-semibold">{roomName}</h3>
        <p className="text-sm text-white/70">{currentIndex + 1} / {images.length}</p>
      </div>

      {/* Main image */}
      <div 
        className="relative max-w-5xl max-h-[80vh] w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <img 
          src={images[currentIndex]} 
          alt={`${roomName} - Image ${currentIndex + 1}`}
          className="w-full h-full object-contain rounded-lg"
        />

        {/* Navigation arrows */}
        {currentIndex > 0 && (
          <button 
            onClick={() => setCurrentIndex(prev => prev - 1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
          >
            <ChevronLeft className="w-8 h-8 text-white" />
          </button>
        )}
        {currentIndex < images.length - 1 && (
          <button 
            onClick={() => setCurrentIndex(prev => prev + 1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
          >
            <ChevronRight className="w-8 h-8 text-white" />
          </button>
        )}
      </div>

      {/* Thumbnail strip */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-full px-4">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
            className={cn(
              'w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all',
              currentIndex === idx ? 'border-white scale-110' : 'border-transparent opacity-60 hover:opacity-100'
            )}
          >
            <img src={img} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>,
    document.body
  );
}

// Room Card with Instagram-style photo grid
function RoomPhotoGrid({ 
  room, 
  onImageClick 
}: { 
  room: BookingRoom; 
  onImageClick: (index: number) => void;
}) {
  const images = room.images.slice(0, 4);
  
  if (images.length === 1) {
    return (
      <div 
        className="w-full h-32 rounded-lg overflow-hidden cursor-pointer group relative"
        onClick={() => onImageClick(0)}
      >
        <img src={images[0]} alt={room.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-1 h-24 rounded-lg overflow-hidden">
      {images.map((img, idx) => (
        <div 
          key={idx}
          className={cn(
            'relative cursor-pointer group overflow-hidden',
            idx === 0 && images.length > 1 ? 'col-span-2 row-span-1' : ''
          )}
          onClick={() => onImageClick(idx)}
        >
          <img 
            src={img} 
            alt={`${room.name} ${idx + 1}`} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
            <ZoomIn className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          {idx === images.length - 1 && room.images.length > 4 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-semibold">+{room.images.length - 4}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function BookingModal({ isOpen, onClose, initialCheckIn, initialCheckOut, initialGuests = 2 }: BookingModalProps) {
  const { user } = useUserAuth();
  
  // Get rooms from centralized config (source of truth)
  const ROOMS: BookingRoom[] = useMemo(() => {
    return getBookableRoomTypes().map((room: RoomTypeConfig) => ({
      id: room.id,
      name: room.name,
      type: room.unitType === 'bed' ? 'dorm' : 'private',
      price: room.basePrice,
      capacity: room.capacity,
      totalUnits: room.totalUnits,
      image: room.image || '/lovable-uploads/784b2108-6432-4589-b79b-0433fa26bc3b.png',
      images: ROOM_IMAGES[room.id] || [room.image || '/lovable-uploads/784b2108-6432-4589-b79b-0433fa26bc3b.png'],
    }));
  }, []);
  
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Multi-room selection state
  const [roomSelections, setRoomSelections] = useState<RoomSelection[]>([]);
  const [guests, setGuests] = useState(initialGuests);
  
  // Date selection
  const [checkIn, setCheckIn] = useState<Date | undefined>(initialCheckIn);
  const [checkOut, setCheckOut] = useState<Date | undefined>(initialCheckOut);
  
  // Add-ons
  const [selectedAddOns, setSelectedAddOns] = useState<Record<string, boolean>>({});
  
  // Guest details
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  
  // Image lightbox state
  const [lightboxRoom, setLightboxRoom] = useState<BookingRoom | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Prefill from user profile
  useEffect(() => {
    if (user?.profile) {
      setGuestName(user.profile.full_name || '');
      setGuestEmail(user.profile.email || '');
      setGuestPhone(user.profile.phone || '');
    }
  }, [user?.profile]);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setRoomSelections([]);
      setCheckIn(initialCheckIn);
      setCheckOut(initialCheckOut);
      setGuests(initialGuests);
      setSelectedAddOns({});
      setSpecialRequests('');
      setLightboxRoom(null);
    }
  }, [isOpen, initialCheckIn, initialCheckOut, initialGuests]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Room selection handlers
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

  // Calculate totals
  const nights = checkIn && checkOut ? Math.max(1, differenceInDays(checkOut, checkIn)) : 0;
  
  const totalBedsSelected = useMemo(() => {
    return roomSelections.reduce((sum, sel) => {
      const room = ROOMS.find(r => r.id === sel.roomId);
      // For dorms, quantity = beds; for private rooms, quantity = rooms * capacity
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
      // Price calculation: price per unit × quantity × nights
      // For dorms: price is per bed
      // For private rooms: price is per room
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
  const gstRate = 12;
  const gstAmount = Math.round(subtotal * (gstRate / 100));
  const totalAmount = subtotal + gstAmount;

  const canProceed = () => {
    switch (step) {
      case 1: return roomSelections.length > 0;
      case 2: return !!checkIn && !!checkOut && nights > 0;
      case 3: return true;
      case 4: return guestName.trim() && guestEmail.trim() && guestPhone.trim();
      default: return false;
    }
  };

  const handleSubmit = async () => {
    if (roomSelections.length === 0 || !checkIn || !checkOut) return;
    setIsSubmitting(true);
    
    try {
      // Create enquiry for each room selection
      const results = await Promise.all(roomSelections.map(async (sel) => {
        const room = ROOMS.find(r => r.id === sel.roomId);
        if (!room) return { success: false, error: 'Room not found' };

        const roomSubtotal = room.price * sel.quantity * nights;
        const roomGst = Math.round(roomSubtotal * (gstRate / 100));
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
          gstRate,
          gstAmount: roomGst,
          totalAmount: roomTotal,
          specialRequests: specialRequests || undefined,
          userId: user?.id,
        });
      }));

      const allSuccess = results.every(r => r.success);
      if (allSuccess) {
        toast.success('Booking enquiry submitted!', { 
          description: `${roomSelections.length} room(s) for ${guests} guests submitted for review.` 
        });
        onClose();
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

  // Open lightbox
  const openLightbox = (room: BookingRoom, index: number) => {
    setLightboxRoom(room);
    setLightboxIndex(index);
  };

  if (!isOpen) return null;

  const modalContent = (
    <div 
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ zIndex: 99999, isolation: 'isolate' }}
    >
      {/* Dark Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80" 
        onClick={onClose}
        style={{ zIndex: 1 }}
      />
      
      {/* Modal Content */}
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl bg-background border border-border shadow-2xl"
        style={{ zIndex: 2 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border bg-muted/50">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Book Your Stay</h2>
            <p className="text-sm text-muted-foreground">Step {step} of 4</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full hover:bg-muted transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
        
        {/* Progress Bar */}
        <div className="h-1 bg-muted">
          <div 
            className="h-full bg-primary transition-all duration-300" 
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
        
        {/* Content */}
        <div className="p-5 overflow-y-auto max-h-[55vh]">
          {/* Step 1: Room Selection with Multi-Select */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-foreground">Select Rooms & Beds</h3>
                {roomSelections.length > 0 && (
                  <span className="text-sm text-primary font-medium">
                    {totalBedsSelected} {totalBedsSelected === 1 ? 'guest' : 'guests'} capacity
                  </span>
                )}
              </div>
              
              <p className="text-sm text-muted-foreground">
                Select multiple room types. For dormitories, you book individual beds.
              </p>
              
              <div className="grid gap-4">
                {ROOMS.map((room) => {
                  const qty = getRoomQuantity(room.id);
                  const isDorm = room.type === 'dorm';
                  const unitLabel = isDorm ? 'bed' : 'room';
                  const priceLabel = isDorm ? '/bed/night' : '/room/night';
                  
                  return (
                    <div 
                      key={room.id}
                      className={cn(
                        'p-4 rounded-xl border transition-all',
                        qty > 0 ? 'bg-primary/5 border-primary' : 'bg-muted/30 border-border'
                      )}
                    >
                      {/* Photo Grid */}
                      <RoomPhotoGrid 
                        room={room} 
                        onImageClick={(idx) => openLightbox(room, idx)} 
                      />
                      
                      {/* Room Info */}
                      <div className="mt-3 flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            {isDorm ? (
                              <Bed className="w-4 h-4 text-muted-foreground" />
                            ) : (
                              <Home className="w-4 h-4 text-muted-foreground" />
                            )}
                            <h4 className="font-medium text-foreground truncate">{room.name}</h4>
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Users className="w-3.5 h-3.5" />
                              {isDorm ? `${room.capacity}-bed room` : `Up to ${room.capacity} guests`}
                            </span>
                            <span>•</span>
                            <span>{room.totalUnits} {isDorm ? 'beds' : 'rooms'} total</span>
                          </div>
                          <p className="text-primary font-semibold mt-1">
                            ₹{room.price.toLocaleString()}{priceLabel}
                          </p>
                        </div>
                        
                        {/* Quantity Controls */}
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-xs text-muted-foreground capitalize">{unitLabel}s</span>
                          <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
                            <button 
                              onClick={() => updateRoomQuantity(room.id, -1)}
                              disabled={qty === 0}
                              className={cn(
                                'p-2 rounded-md transition-colors',
                                qty === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-background'
                              )}
                            >
                              <Minus className="w-4 h-4 text-foreground" />
                            </button>
                            <span className="w-8 text-center font-semibold text-foreground">{qty}</span>
                            <button 
                              onClick={() => updateRoomQuantity(room.id, 1)}
                              disabled={qty >= room.totalUnits}
                              className={cn(
                                'p-2 rounded-md transition-colors',
                                qty >= room.totalUnits ? 'opacity-30 cursor-not-allowed' : 'hover:bg-background'
                              )}
                            >
                              <Plus className="w-4 h-4 text-foreground" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Selection Summary */}
              {roomSelections.length > 0 && (
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground font-medium">Selected:</span>
                    <div className="text-right">
                      {roomSelections.map(sel => {
                        const room = ROOMS.find(r => r.id === sel.roomId);
                        return (
                          <div key={sel.roomId} className="text-muted-foreground">
                            {sel.quantity} × {room?.name.replace('Bed in ', '').replace(' Dormitory', '')}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Step 2: Dates & Guests */}
          {step === 2 && (
            <div className="space-y-5">
              <h3 className="text-lg font-medium text-foreground">Choose Dates & Guests</h3>
              
              {/* Date Selection - Always Visible */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Check-in</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="outline" 
                        className={cn(
                          "w-full justify-start text-left font-normal h-12",
                          !checkIn && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="text-foreground">
                          {checkIn ? format(checkIn, 'EEE, MMM d, yyyy') : 'Select date'}
                        </span>
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
                  <label className="text-sm font-medium text-foreground mb-2 block">Check-out</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline" 
                        className={cn(
                          "w-full justify-start text-left font-normal h-12",
                          !checkOut && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="text-foreground">
                          {checkOut ? format(checkOut, 'EEE, MMM d, yyyy') : 'Select date'}
                        </span>
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
                <div className="p-3 rounded-lg bg-muted/50 border border-border">
                  <p className="text-sm text-foreground font-medium">{nights} night{nights > 1 ? 's' : ''}</p>
                </div>
              )}
              
              {/* Guest Count with Override */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-foreground">Total Guests</label>
                  <span className="text-xs text-muted-foreground">
                    (Selected capacity: {totalBedsSelected})
                  </span>
                </div>
                <div className="flex items-center gap-4 bg-muted/50 rounded-xl p-4 border border-border">
                  <button 
                    onClick={() => setGuests(Math.max(1, guests - 1))} 
                    className="p-3 rounded-lg hover:bg-background transition-colors border border-border"
                  >
                    <Minus className="w-5 h-5 text-foreground" />
                  </button>
                  <span className="flex-1 text-center text-2xl text-foreground font-bold">{guests}</span>
                  <button 
                    onClick={() => setGuests(guests + 1)} 
                    className="p-3 rounded-lg hover:bg-background transition-colors border border-border"
                  >
                    <Plus className="w-5 h-5 text-foreground" />
                  </button>
                </div>
                {guests > totalBedsSelected && totalBedsSelected > 0 && (
                  <p className="text-xs text-amber-500 mt-2">
                    ⚠️ Guest count exceeds selected bed capacity. Consider adding more beds.
                  </p>
                )}
              </div>
              
              {/* Selection Summary */}
              <div className="p-3 rounded-lg bg-muted/30 border border-border">
                <h4 className="text-sm font-medium text-foreground mb-2">Your Selection</h4>
                {roomSelections.map(sel => {
                  const room = ROOMS.find(r => r.id === sel.roomId);
                  if (!room) return null;
                  const lineTotal = room.price * sel.quantity * nights;
                  return (
                    <div key={sel.roomId} className="flex justify-between text-sm text-muted-foreground">
                      <span>{sel.quantity} × {room.type === 'dorm' ? 'Bed' : 'Room'} - {room.name.replace('Bed in ', '')}</span>
                      <span>₹{lineTotal.toLocaleString()}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Step 3: Add-ons */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">Add-on Services</h3>
              <div className="grid gap-3">
                {ADD_ONS.map((addOn) => (
                  <button 
                    key={addOn.id} 
                    onClick={() => setSelectedAddOns(prev => ({ ...prev, [addOn.id]: !prev[addOn.id] }))} 
                    className={cn(
                      'flex items-center justify-between p-4 rounded-xl border transition-all text-left',
                      selectedAddOns[addOn.id] 
                        ? 'bg-primary/10 border-primary' 
                        : 'bg-muted/30 border-border hover:bg-muted/50'
                    )}
                  >
                    <div>
                      <h4 className="font-medium text-foreground">{addOn.name}</h4>
                      <p className="text-sm text-muted-foreground">₹{addOn.price} {addOn.unit}</p>
                    </div>
                    <div className={cn(
                      'w-6 h-6 rounded-full border-2 flex items-center justify-center',
                      selectedAddOns[addOn.id] ? 'bg-primary border-primary' : 'border-muted-foreground'
                    )}>
                      {selectedAddOns[addOn.id] && <Check className="w-4 h-4 text-primary-foreground" />}
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-sm text-muted-foreground text-center">Add-ons are optional.</p>
            </div>
          )}
          
          {/* Step 4: Guest Details & Summary */}
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">Guest Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Full Name *</label>
                  <Input value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder="Enter your full name" className="h-12" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Email *</label>
                  <Input type="email" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} placeholder="Enter your email" className="h-12" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Phone *</label>
                  <Input type="tel" value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} placeholder="Enter your phone number" className="h-12" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Special Requests</label>
                  <Textarea value={specialRequests} onChange={(e) => setSpecialRequests(e.target.value)} placeholder="Any special requests? (optional)" rows={3} />
                </div>
              </div>
              
              {/* Price Summary */}
              <div className="mt-4 p-4 rounded-xl bg-muted/50 border border-border">
                <h4 className="font-medium text-foreground mb-3">Price Summary</h4>
                <div className="space-y-2 text-sm">
                  {roomSelections.map(sel => {
                    const room = ROOMS.find(r => r.id === sel.roomId);
                    if (!room) return null;
                    const lineTotal = room.price * sel.quantity * nights;
                    const unitLabel = room.type === 'dorm' ? 'bed' : 'room';
                    return (
                      <div key={sel.roomId} className="flex justify-between text-muted-foreground">
                        <span>{room.name.replace('Bed in ', '')} × {sel.quantity} {unitLabel}{sel.quantity > 1 ? 's' : ''} × {nights} night{nights > 1 ? 's' : ''}</span>
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
                  <div className="flex justify-between text-muted-foreground">
                    <span>GST ({gstRate}%)</span>
                    <span>₹{gstAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-foreground font-semibold pt-2 border-t border-border">
                    <span>Total</span>
                    <span>₹{totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between p-5 border-t border-border bg-muted/30">
          <Button 
            variant="ghost" 
            onClick={() => step > 1 ? setStep(step - 1) : onClose} 
            className="text-muted-foreground"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            {step > 1 ? 'Back' : 'Cancel'}
          </Button>
          {step < 4 ? (
            <Button onClick={() => canProceed() && setStep(step + 1)} disabled={!canProceed()}>
              Continue
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={!canProceed() || isSubmitting}>
              {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              {isSubmitting ? 'Submitting...' : 'Submit Enquiry'}
            </Button>
          )}
        </div>
      </div>
      
      {/* Image Lightbox */}
      {lightboxRoom && (
        <ImageGalleryLightbox
          images={lightboxRoom.images}
          roomName={lightboxRoom.name}
          isOpen={!!lightboxRoom}
          onClose={() => setLightboxRoom(null)}
          initialIndex={lightboxIndex}
        />
      )}
    </div>
  );

  return createPortal(modalContent, document.body);
}
