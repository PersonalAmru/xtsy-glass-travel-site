/**
 * PropertyDetail - Full property detail page
 * Shows hero, description, gallery, room types with quantity selectors, and floating Book Now
 */

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  MapPin, 
  Star, 
  Users,
  Bed,
  Check,
  Sparkles,
  Shield,
  Coffee,
  Wifi,
  Tv,
  Wind,
  Calendar,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getPropertyById } from '@/data/properties';
import { ROOM_INVENTORY, RoomType } from '@/data/roomInventory';
import UnifiedImage from '@/components/UnifiedImage';
import { PropertyGallery } from '@/components/property/PropertyGallery';
import { RoomSelectionCard } from '@/components/property/RoomSelectionCard';
import { format, differenceInDays, parseISO, addDays } from 'date-fns';

// Map amenity names to icons
const amenityIcons: Record<string, React.ReactNode> = {
  'Free WiFi': <Wifi className="w-4 h-4" />,
  'Air Conditioning': <Wind className="w-4 h-4" />,
  '4K QLED TV': <Tv className="w-4 h-4" />,
  'Premium Breakfast': <Coffee className="w-4 h-4" />,
};

const PropertyDetail = () => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const navigate = useNavigate();
  const [showFloatingBtn, setShowFloatingBtn] = useState(false);
  
  // Room selection state
  const [roomQuantities, setRoomQuantities] = useState<Record<string, number>>({});
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);

  const property = useMemo(() => propertyId ? getPropertyById(propertyId) : null, [propertyId]);

  // Get room types for this property
  const roomTypes: RoomType[] = useMemo(() => {
    if (!property) return [];
    return property.roomTypeIds
      .map(id => ROOM_INVENTORY[id])
      .filter(Boolean);
  }, [property]);

  // Get all property images including room images
  const allImages = useMemo(() => {
    if (!property) return [];
    const images = [...property.images];
    roomTypes.forEach(room => {
      room.images.slice(0, 2).forEach(img => {
        if (!images.includes(img)) images.push(img);
      });
    });
    return images.slice(0, 9);
  }, [property, roomTypes]);

  // Load dates from session storage
  useEffect(() => {
    try {
      const storedParams = sessionStorage.getItem('xtsy_search_params');
      if (storedParams) {
        const params = JSON.parse(storedParams);
        if (params.checkIn) setCheckIn(parseISO(params.checkIn));
        if (params.checkOut) setCheckOut(parseISO(params.checkOut));
      }
    } catch {
      // Ignore parsing errors
    }
  }, []);

  // Show floating button after scrolling
  useEffect(() => {
    const handleScroll = () => {
      setShowFloatingBtn(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  // Handle room quantity change
  const handleQuantityChange = useCallback((roomId: string, quantity: number) => {
    setRoomQuantities(prev => {
      if (quantity === 0) {
        const { [roomId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [roomId]: quantity };
    });
  }, []);

  // Calculate totals
  const { selectedRoomsCount, nights, subtotal, gstAmount, total } = useMemo(() => {
    const count = Object.values(roomQuantities).reduce((sum, q) => sum + q, 0);
    const n = checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 1;
    
    let sub = 0;
    let gst = 0;
    
    Object.entries(roomQuantities).forEach(([roomId, quantity]) => {
      const room = ROOM_INVENTORY[roomId];
      if (room && quantity > 0) {
        const roomTotal = room.discountedPrice * quantity * n;
        sub += roomTotal;
        // 5% GST for hostel rooms, 0% for dorms
        const rate = room.kind === 'dorm' ? 0 : 0.05;
        gst += Math.round(roomTotal * rate);
      }
    });
    
    return { 
      selectedRoomsCount: count, 
      nights: n, 
      subtotal: sub, 
      gstAmount: gst, 
      total: sub + gst 
    };
  }, [roomQuantities, checkIn, checkOut]);

  const hasDateSelection = checkIn && checkOut;
  const hasRoomSelection = selectedRoomsCount > 0;

  // Handle Book Now click
  const handleBookNow = useCallback(() => {
    if (!property) return;

    // Ensure we have dates
    let finalCheckIn = checkIn;
    let finalCheckOut = checkOut;
    
    if (!finalCheckIn || !finalCheckOut) {
      // Set default dates (today + 1 day)
      finalCheckIn = addDays(new Date(), 1);
      finalCheckOut = addDays(new Date(), 2);
    }

    // Build selected rooms array
    const selectedRooms = Object.entries(roomQuantities)
      .filter(([_, quantity]) => quantity > 0)
      .map(([roomId, quantity]) => ({
        roomId,
        quantity,
      }));

    // Store booking data in session
    const bookingData = {
      checkIn: format(finalCheckIn, 'yyyy-MM-dd'),
      checkOut: format(finalCheckOut, 'yyyy-MM-dd'),
      propertyName: property.name,
      propertyId: property.slug,
      selectedRooms,
    };
    
    sessionStorage.setItem('xtsy_simplified_booking', JSON.stringify(bookingData));

    // Navigate to simplified booking flow
    navigate('/book');
  }, [property, checkIn, checkOut, roomQuantities, navigate]);

  // Format date for display
  const formatDateDisplay = (date: Date | null) => {
    if (!date) return 'Select';
    return format(date, 'MMM d');
  };

  if (!property) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <p className="text-white/60">Property not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px]" />
      </div>

      {/* Hero Section */}
      <div className="relative h-[50vh] md:h-[60vh]">
        <UnifiedImage
          src={property.heroImage}
          alt={property.name}
          className="w-full h-full object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />

        {/* Header */}
        <header className="absolute top-0 left-0 right-0 z-20">
          <div className="flex items-center justify-between px-4 h-16 max-w-4xl mx-auto">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleBack}
              className="flex items-center gap-1 text-white/90 hover:text-white transition-colors bg-black/20 backdrop-blur-sm px-3 py-2 rounded-full"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back</span>
            </motion.button>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/20 backdrop-blur-sm">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-sm font-semibold text-white">{property.rating}</span>
              <span className="text-sm text-white/60">({property.reviewCount})</span>
            </div>
          </div>
        </header>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 max-w-4xl mx-auto">
          <span className={cn(
            "inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3",
            property.category === 'luxury' 
              ? "bg-amber-500/90 text-white" 
              : "bg-emerald-500/90 text-white"
          )}>
            {property.category === 'luxury' ? 'Luxury' : 'Hostel'}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {property.name}
          </h1>
          <div className="flex items-center gap-2 text-white/70">
            <MapPin className="w-4 h-4" />
            <span>Shillong, Meghalaya</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 px-4 py-8 max-w-4xl mx-auto -mt-8">
        {/* Quick Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-3 gap-3 mb-8"
        >
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
            <p className="text-2xl font-bold text-white">₹{property.priceRange.min.toLocaleString()}</p>
            <p className="text-xs text-white/50">Starting price</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
            <p className="text-2xl font-bold text-white">{roomTypes.length}</p>
            <p className="text-xs text-white/50">Room types</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
            <p className="text-2xl font-bold text-white">{property.rating}</p>
            <p className="text-xs text-white/50">Rating</p>
          </div>
        </motion.div>

        {/* Date Selection Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="p-4 rounded-2xl bg-primary/10 border border-primary/20 mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-white">
                  {hasDateSelection 
                    ? `${formatDateDisplay(checkIn)} → ${formatDateDisplay(checkOut)} (${nights} night${nights > 1 ? 's' : ''})`
                    : 'Select your dates for accurate pricing'
                  }
                </p>
                {!hasDateSelection && (
                  <p className="text-xs text-white/50 mt-0.5">Prices shown are per night</p>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Description */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            About
          </h2>
          <p className="text-white/70 leading-relaxed">
            {property.description}
          </p>
        </motion.div>

        {/* Amenities */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold text-white mb-4">Amenities</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {property.amenities.map((amenity, index) => (
              <div 
                key={index}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10"
              >
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  {amenityIcons[amenity] || <Check className="w-4 h-4" />}
                </div>
                <span className="text-sm text-white/80">{amenity}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Gallery */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold text-white mb-4">Gallery</h2>
          <PropertyGallery images={allImages} propertyName={property.name} />
        </motion.div>

        {/* Room Types with Quantity Selectors */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Bed className="w-5 h-5 text-primary" />
            Room Types
          </h2>
          <p className="text-sm text-white/50 mb-4">
            Select rooms and quantity using +/- buttons
          </p>
          <div className="space-y-3">
            {roomTypes.map((room) => (
              <RoomSelectionCard 
                key={room.id}
                room={room}
                quantity={roomQuantities[room.id] || 0}
                onQuantityChange={handleQuantityChange}
              />
            ))}
          </div>
        </motion.div>

        {/* GST & Pricing Info */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-32"
        >
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-emerald-400 mt-0.5" />
              <div>
                <p className="font-medium text-emerald-400">Pay at Hotel</p>
                <p className="text-sm text-white/60 mt-1">
                  No advance payment required. GST of 5% applicable on private rooms. 
                  Dormitory beds are exempt from GST.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Floating Book Now Footer - Always visible */}
      <AnimatePresence>
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent"
        >
          <div className="max-w-4xl mx-auto p-4">
            {/* Selection Summary */}
            {hasRoomSelection && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between mb-3 px-1"
              >
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-wider">
                    {selectedRoomsCount} room{selectedRoomsCount > 1 ? 's' : ''} • {nights} night{nights > 1 ? 's' : ''}
                  </p>
                  <p className="text-2xl font-bold text-white">
                    ₹{total.toLocaleString()}
                  </p>
                </div>
                {gstAmount > 0 && (
                  <p className="text-xs text-white/40">
                    incl. GST ₹{gstAmount.toLocaleString()}
                  </p>
                )}
              </motion.div>
            )}

            {/* Book Now Button */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleBookNow}
              disabled={!hasRoomSelection}
              className={cn(
                "w-full h-14 rounded-2xl font-bold text-base flex items-center justify-center gap-3 transition-all",
                hasRoomSelection
                  ? "bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 text-white shadow-xl shadow-primary/25"
                  : "bg-white/10 text-white/40 cursor-not-allowed"
              )}
            >
              {hasRoomSelection ? (
                <>
                  <span>Book Now</span>
                  <span className="text-sm font-normal opacity-80">• ₹{total.toLocaleString()}</span>
                  <ChevronRight className="w-5 h-5" />
                </>
              ) : (
                <>
                  <span>Select rooms to continue</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default PropertyDetail;
