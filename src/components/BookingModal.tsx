import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Users, Calendar, Plus, Minus, Check, Loader2 } from 'lucide-react';
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

const ROOMS = [
  { id: 'dorm-4-mixed', name: '4-Bed Mixed Dormitory', type: 'dorm', price: 599, capacity: 4, image: '/lovable-uploads/784b2108-6432-4589-b79b-0433fa26bc3b.png' },
  { id: 'dorm-6-mixed', name: '6-Bed Mixed Dormitory', type: 'dorm', price: 499, capacity: 6, image: '/lovable-uploads/784b2108-6432-4589-b79b-0433fa26bc3b.png' },
  { id: 'dorm-4-female', name: '4-Bed Female Dormitory', type: 'dorm', price: 649, capacity: 4, image: '/lovable-uploads/784b2108-6432-4589-b79b-0433fa26bc3b.png' },
  { id: 'private-king', name: 'King Double Room', type: 'private', price: 1899, capacity: 2, image: '/lovable-uploads/784b2108-6432-4589-b79b-0433fa26bc3b.png' },
  { id: 'private-twin', name: 'Twin Private Room', type: 'private', price: 1699, capacity: 2, image: '/lovable-uploads/784b2108-6432-4589-b79b-0433fa26bc3b.png' },
];

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

export default function BookingModal({ isOpen, onClose, initialCheckIn, initialCheckOut, initialGuests = 1 }: BookingModalProps) {
  const { user } = useUserAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<typeof ROOMS[0] | null>(null);
  const [checkIn, setCheckIn] = useState<Date | undefined>(initialCheckIn);
  const [checkOut, setCheckOut] = useState<Date | undefined>(initialCheckOut);
  const [guests, setGuests] = useState(initialGuests);
  const [quantity, setQuantity] = useState(1);
  const [selectedAddOns, setSelectedAddOns] = useState<Record<string, boolean>>({});
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  useEffect(() => {
    if (user?.profile) {
      setGuestName(user.profile.full_name || '');
      setGuestEmail(user.profile.email || '');
      setGuestPhone(user.profile.phone || '');
    }
  }, [user?.profile]);

  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setSelectedRoom(null);
      setCheckIn(initialCheckIn);
      setCheckOut(initialCheckOut);
      setGuests(initialGuests);
      setQuantity(1);
      setSelectedAddOns({});
      setSpecialRequests('');
    }
  }, [isOpen, initialCheckIn, initialCheckOut, initialGuests]);

  const nights = checkIn && checkOut ? Math.max(1, differenceInDays(checkOut, checkIn)) : 0;
  const roomTotal = selectedRoom ? selectedRoom.price * quantity * nights : 0;
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
      case 1: return !!selectedRoom;
      case 2: return !!checkIn && !!checkOut && nights > 0;
      case 3: return true;
      case 4: return guestName.trim() && guestEmail.trim() && guestPhone.trim();
      default: return false;
    }
  };

  const handleSubmit = async () => {
    if (!selectedRoom || !checkIn || !checkOut) return;
    setIsSubmitting(true);
    try {
      const result = await createEnquiry({
        guestName, guestEmail, guestPhone,
        checkIn: format(checkIn, 'yyyy-MM-dd'),
        checkOut: format(checkOut, 'yyyy-MM-dd'),
        roomName: selectedRoom.name, roomType: selectedRoom.id,
        quantity, nights, ratePerNight: selectedRoom.price,
        subtotal, gstRate, gstAmount, totalAmount,
        specialRequests: specialRequests || undefined,
        userId: user?.id,
      });
      if (result.success) {
        toast.success(`Enquiry ${result.enquiryId} submitted!`, { description: 'The host will review and confirm shortly.' });
        onClose();
      } else {
        toast.error('Failed to submit enquiry', { description: result.error });
      }
    } catch { toast.error('Something went wrong'); }
    finally { setIsSubmitting(false); }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Glassmorphism Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose} 
      />
      
      {/* Modal Content - Simple solid background */}
      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl bg-background border border-border shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border bg-muted/50">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Book Your Stay</h2>
            <p className="text-sm text-muted-foreground">Step {step} of 4</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-muted transition-colors">
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
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">Select Your Room</h3>
              <div className="grid gap-3">
                {ROOMS.map((room) => (
                  <button 
                    key={room.id} 
                    onClick={() => setSelectedRoom(room)} 
                    className={cn(
                      'flex items-center gap-4 p-4 rounded-xl border transition-all text-left',
                      selectedRoom?.id === room.id 
                        ? 'bg-primary/10 border-primary' 
                        : 'bg-muted/30 border-border hover:bg-muted/50'
                    )}
                  >
                    <div className="w-14 h-14 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                      <img src={room.image} alt={room.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-foreground truncate">{room.name}</h4>
                        {selectedRoom?.id === room.id && <Check className="w-5 h-5 text-primary flex-shrink-0" />}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>{room.capacity} guests</span>
                        <span>•</span>
                        <span className="text-primary font-medium">₹{room.price}/night</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div className="space-y-5">
              <h3 className="text-lg font-medium text-foreground">Choose Dates & Guests</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Check-in</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <Calendar className="w-4 h-4 mr-2" />
                        {checkIn ? format(checkIn, 'MMM d, yyyy') : 'Select date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent mode="single" selected={checkIn} onSelect={setCheckIn} disabled={(date) => date < new Date()} />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Check-out</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <Calendar className="w-4 h-4 mr-2" />
                        {checkOut ? format(checkOut, 'MMM d, yyyy') : 'Select date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent mode="single" selected={checkOut} onSelect={setCheckOut} disabled={(date) => date <= (checkIn || new Date())} />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              {nights > 0 && <p className="text-sm text-muted-foreground">{nights} night{nights > 1 ? 's' : ''}</p>}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Guests</label>
                  <div className="flex items-center gap-3 bg-muted/50 rounded-lg p-3 border border-border">
                    <button onClick={() => setGuests(Math.max(1, guests - 1))} className="p-1 rounded-full hover:bg-muted">
                      <Minus className="w-4 h-4 text-foreground" />
                    </button>
                    <span className="flex-1 text-center text-foreground font-medium">{guests}</span>
                    <button onClick={() => setGuests(guests + 1)} className="p-1 rounded-full hover:bg-muted">
                      <Plus className="w-4 h-4 text-foreground" />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">{selectedRoom?.type === 'dorm' ? 'Beds' : 'Rooms'}</label>
                  <div className="flex items-center gap-3 bg-muted/50 rounded-lg p-3 border border-border">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-1 rounded-full hover:bg-muted">
                      <Minus className="w-4 h-4 text-foreground" />
                    </button>
                    <span className="flex-1 text-center text-foreground font-medium">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="p-1 rounded-full hover:bg-muted">
                      <Plus className="w-4 h-4 text-foreground" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
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
          
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">Guest Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Full Name *</label>
                  <Input value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder="Enter your full name" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Email *</label>
                  <Input type="email" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} placeholder="Enter your email" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Phone *</label>
                  <Input type="tel" value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} placeholder="Enter your phone number" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Special Requests</label>
                  <Textarea value={specialRequests} onChange={(e) => setSpecialRequests(e.target.value)} placeholder="Any special requests? (optional)" rows={3} />
                </div>
              </div>
              
              {/* Price Summary */}
              <div className="mt-4 p-4 rounded-xl bg-muted/50 border border-border">
                <h4 className="font-medium text-foreground mb-3">Price Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>{selectedRoom?.name} × {quantity} × {nights} nights</span>
                    <span>₹{roomTotal.toLocaleString()}</span>
                  </div>
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
    </div>
  );
}
