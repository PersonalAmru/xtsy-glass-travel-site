import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageCircle, Calendar, Users, Phone, Trash2, Home, AlertCircle, MapPin, Info, ChevronDown, ChevronUp, Sparkles, X, ArrowLeft, Gift } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { saveWhatsAppBooking } from "@/services/formBookingService";
import FoodAddonsSection from "@/components/FoodAddonsSection";
import { useApp } from "@/contexts/AppContext";
import { validateField, validateWhatsAppBooking } from "@/utils/whatsappBookingValidation";
import { useLocationConsent } from "@/hooks/useLocationConsent";
import { useFormEngagement } from "@/hooks/useFormEngagement";
import { useEnhancedAnalytics } from "@/hooks/useEnhancedAnalytics";

// All Indian states and union territories
const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  // Union Territories
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

// States eligible for 5% welcome discount (major metro cities)
const DISCOUNT_ELIGIBLE_STATES = ["Karnataka", "Maharashtra", "Delhi", "Tamil Nadu"];

interface WhatsAppBookingFormProps {
  isOpen: boolean;
  onClose: () => void;
}

interface RoomType {
  id: string;
  name: string;
  category: string;
  base_price: number;
  capacity: number;
}

interface SelectedRoom {
  roomTypeId: string;
  roomTypeName: string;
  quantity: number;
  price: number;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  city?: string;
  pincode?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: string;
  specialRequests?: string;
}

const WhatsAppBookingForm = ({ isOpen, onClose }: WhatsAppBookingFormProps) => {
  const { currency, formatPrice } = useApp();
  const { locationData, isLoading: locationLoading, requestLocation, hasConsented } = useLocationConsent();
  const { trackFieldFocus, trackFieldBlur, trackFormComplete, resetEngagement } = useFormEngagement('whatsapp_booking');
  const { updateProfile } = useEnhancedAnalytics();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    pincode: "",
    checkIn: "",
    checkOut: "",
    guests: 2,
    specialRequests: "",
    breakfast: false,
    breakfastGuests: 1,
    dinner: false,
    dinnerGuests: 1,
    dinnerType: "veg",
    transportation: false,
    itinerary: false,
    petDetails: false,
    petType: "",
    petBreed: "",
    petSize: "",
    petAge: ""
  });

  // Travel behavior questions (mandatory)
  const [travelPreferences, setTravelPreferences] = useState({
    tripPurpose: "",
    travelingWith: "",
    heardFrom: "",
    travelStyle: "",
    visitorState: "", // Only state shown to user
  });
  
  // Full location data for analytics (not shown to user)
  const [fullLocationData, setFullLocationData] = useState<{
    city?: string;
    state?: string;
    country?: string;
    pincode?: string;
    latitude?: number;
    longitude?: number;
  } | null>(null);

  const [nights, setNights] = useState(0);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [selectedRoomIds, setSelectedRoomIds] = useState<Set<string>>(new Set());
  const [selectedRooms, setSelectedRooms] = useState<SelectedRoom[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [roomsError, setRoomsError] = useState<string>("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  // Reset engagement tracking when form opens
  useEffect(() => {
    if (isOpen) {
      resetEngagement();
    }
  }, [isOpen, resetEngagement]);

  // Field validation on blur
  const handleBlur = useCallback((field: keyof FormErrors, value: any) => {
    const error = validateField(field, value, formData);
    setErrors(prev => ({ ...prev, [field]: error || undefined }));
  }, [formData]);
  useEffect(() => {
    if (formData.checkIn && formData.checkOut) {
      const checkIn = new Date(formData.checkIn);
      const checkOut = new Date(formData.checkOut);
      const diffTime = checkOut.getTime() - checkIn.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setNights(diffDays > 0 ? diffDays : 0);
    }
  }, [formData.checkIn, formData.checkOut]);

  // Fetch room types from Supabase edge function
  useEffect(() => {
    const fetchRoomTypes = async () => {
      setLoadingRooms(true);
      setRoomsError("");
      
      try {
        console.log('Fetching room types...');
        const { data, error } = await supabase.functions.invoke('get-room-types');

        if (error) {
          console.error('Error fetching room types:', error);
          setRoomsError('Failed to load room types');
          
          // Fallback: Load directly from Supabase table
          console.log('Attempting fallback: loading from room_types table...');
          const { data: roomTypesData, error: tableError } = await supabase
            .from('room_types')
            .select('*')
            .eq('is_active', true);
          
          if (tableError) {
            console.error('Fallback also failed:', tableError);
          } else if (roomTypesData) {
            setRoomTypes(roomTypesData);
            setRoomsError("");
            console.log('Loaded room types from fallback:', roomTypesData.length);
          }
        } else if (data) {
          setRoomTypes(data);
          console.log('Loaded room types from edge function:', data.length);
        }
      } catch (err) {
        console.error('Exception fetching room types:', err);
        setRoomsError('Failed to load room types');
        
        // Fallback: Load directly from Supabase table
        try {
          const { data: roomTypesData, error: tableError } = await supabase
            .from('room_types')
            .select('*')
            .eq('is_active', true);
          
          if (!tableError && roomTypesData) {
            setRoomTypes(roomTypesData);
            setRoomsError("");
            console.log('Loaded room types from fallback after exception:', roomTypesData.length);
          }
        } catch (fallbackErr) {
          console.error('Fallback failed:', fallbackErr);
        }
      } finally {
        setLoadingRooms(false);
      }
    };

    if (isOpen) {
      fetchRoomTypes();
    }
  }, [isOpen]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // No auto-sync for dormitory - users manually select how many beds they want
  };

  // Calculate remaining guests that need accommodation
  const getRemainingGuests = () => {
    const totalGuests = formData.guests;
    const accommodated = selectedRooms.reduce((sum, room) => {
      const maxCapacity = getMaxQuantity(room.roomTypeName);
      return sum + Math.min(room.quantity, maxCapacity);
    }, 0);
    return Math.max(0, totalGuests - accommodated);
  };

  const canAccommodateRemaining = (roomTypeName: string) => {
    const remaining = getRemainingGuests();
    if (remaining === 0) return false;
    const maxCapacity = getMaxQuantity(roomTypeName);
    return remaining <= maxCapacity;
  };

  // Helper to determine if a room type is a private room (not dormitory)
  const isPrivateRoom = (roomTypeName: string): boolean => {
    const lowerName = roomTypeName.toLowerCase();
    return lowerName.includes('room') || lowerName.includes('ensuite');
  };

  // Get capacity per unit for a room type
  const getCapacityPerUnit = (roomTypeName: string): number => {
    const lowerName = roomTypeName.toLowerCase();
    if (lowerName.includes('king double')) return 2;
    if (lowerName.includes('king triple')) return 3;
    if (lowerName.includes('panorama glass ensuite')) return 2;
    // Dormitory beds = 1 guest per bed
    return 1;
  };

  const handleRoomToggle = (roomTypeId: string) => {
    const roomType = roomTypes.find(rt => rt.id === roomTypeId);
    if (!roomType) return;

    setSelectedRoomIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(roomTypeId)) {
        newSet.delete(roomTypeId);
        // Remove from selectedRooms
        setSelectedRooms(prevRooms => prevRooms.filter(r => r.roomTypeId !== roomTypeId));
      } else {
        newSet.add(roomTypeId);
        // Add to selectedRooms with 10% winter discount
        const discountedPrice = Math.round(roomType.base_price * 0.9);
        const isDormitory = roomType.name.toLowerCase().includes('dormitory');
        const newRoom: SelectedRoom = {
          roomTypeId: roomType.id,
          roomTypeName: `${roomType.category} - ${roomType.name}`,
          // Dormitory: start with 1 bed, Private rooms: start with 1 room
          quantity: 1,
          price: discountedPrice // Store in INR for internal calculations
        };
        setSelectedRooms(prevRooms => {
          const updatedRooms = [...prevRooms, newRoom];
          return updatedRooms;
        });
      }
      return newSet;
    });
  };

  const handleRemoveRoom = (roomTypeId: string) => {
    setSelectedRooms(prev => prev.filter(room => room.roomTypeId !== roomTypeId));
    setSelectedRoomIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(roomTypeId);
      return newSet;
    });
  };

  const getMaxQuantity = (roomTypeName: string): number => {
    const lowerName = roomTypeName.toLowerCase();
    if (lowerName.includes('4-bed') && lowerName.includes('dormitory')) return 4;
    if (lowerName.includes('6-bed') && lowerName.includes('dormitory')) return 6;
    if (lowerName.includes('panorama glass ensuite')) return 1;
    if (lowerName.includes('king triple')) return 1;
    if (lowerName.includes('king double')) return 2;
    return 10; // Default max
  };

  const handleUpdateQuantity = (roomTypeId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    const room = selectedRooms.find(r => r.roomTypeId === roomTypeId);
    if (!room) return;
    const maxQty = getMaxQuantity(room.roomTypeName);
    
    // Check max quantity for both dormitory and private rooms
    if (newQuantity > maxQty) {
      toast({
        title: "Maximum Reached",
        description: `Maximum ${maxQty} ${room.roomTypeName.toLowerCase().includes('dormitory') ? 'beds' : 'rooms'} available for this type`,
        duration: 3000,
      });
      return;
    }
    
    setSelectedRooms(prev =>
      prev.map(r =>
        r.roomTypeId === roomTypeId
          ? { ...r, quantity: newQuantity }
          : r
      )
    );
  };

  // Calculate total accommodation capacity
  const getTotalAccommodatedGuests = () => {
    return selectedRooms.reduce((sum, room) => {
      const capacityPerUnit = getCapacityPerUnit(room.roomTypeName);
      return sum + (room.quantity * capacityPerUnit);
    }, 0);
  };

  const getTotalAmount = () => {
    return selectedRooms.reduce((total, room) => {
      // All room types: price × quantity × nights
      const roomTotal = room.price * room.quantity * nights;
      return total + roomTotal;
    }, 0);
  };

  // Check if eligible for 5% welcome discount
  const isEligibleForWelcomeDiscount = DISCOUNT_ELIGIBLE_STATES.includes(travelPreferences.visitorState);
  
  const getWelcomeDiscount = () => {
    if (!isEligibleForWelcomeDiscount) return 0;
    return Math.round(getTotalAmount() * 0.05);
  };

  const getFinalAmount = () => {
    return getTotalAmount() - getWelcomeDiscount();
  };

  const handleBookNow = async () => {
    // Validate all required fields
    const validation = validateWhatsAppBooking({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      city: formData.city,
      pincode: formData.pincode,
      checkIn: formData.checkIn,
      checkOut: formData.checkOut,
      guests: formData.guests,
      specialRequests: formData.specialRequests,
    });

    if (!validation.success) {
      setErrors(validation.errors || {});
      toast({
        title: "Please fix the errors",
        description: "Some required fields are missing or invalid.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    const subtotalAmount = getTotalAmount();
    const discountAmount = getWelcomeDiscount();
    const finalAmount = getFinalAmount();

    // Build warm, branded WhatsApp message for XTSY Travellers Hostel
    const roomsText = selectedRooms.length > 0 
      ? selectedRooms.map(room => `   • ${room.roomTypeName} × ${room.quantity}`).join('\n')
      : '   • To be decided';

    const addOnsText = [];
    if (formData.breakfast) addOnsText.push(`   • Breakfast for ${formData.breakfastGuests} guest(s)`);
    if (formData.dinner) addOnsText.push(`   • Dinner (${formData.dinnerType}) for ${formData.dinnerGuests} guest(s)`);
    if (formData.transportation) addOnsText.push(`   • Transportation Service`);
    if (formData.itinerary) addOnsText.push(`   • Custom Itinerary Planning`);

    // Build pricing text with discount if applicable
    const pricingText = finalAmount > 0 
      ? isEligibleForWelcomeDiscount 
        ? `\n💰 *Pricing:*\n   Subtotal: ${formatPrice(subtotalAmount)}\n   XTSY Welcome Discount (5%): -${formatPrice(discountAmount)}\n   *Final Amount: ${formatPrice(finalAmount)}*${currency.code !== 'INR' ? ` (${currency.code})` : ''}`
        : `\n💰 *Estimated: ${formatPrice(finalAmount)}${currency.code !== 'INR' ? ` (${currency.code})` : ''}*`
      : '';

    const message = `🏠 *XTSY Travellers Hostel - Booking Inquiry*

Namaste Team XTSY! 🙏

I'd love to stay at XTSY Travellers Hostel, Shillong.

👤 *Guest Details:*
   Name: ${formData.name}
   Email: ${formData.email}
   Phone: ${formData.phone}
   ${travelPreferences.visitorState ? `From: ${travelPreferences.visitorState}` : formData.city ? `From: ${formData.city}${formData.pincode ? ` - ${formData.pincode}` : ''}` : ''}

📅 *Stay Details:*
   Check-in: ${formData.checkIn}
   Check-out: ${formData.checkOut}
   ${nights > 0 ? `Duration: ${nights} night${nights > 1 ? 's' : ''}` : ''}
   Guests: ${formData.guests}

🛏️ *Room Selection:*
${roomsText}
${addOnsText.length > 0 ? `\n🍽️ *Services:*\n${addOnsText.join('\n')}` : ''}
${formData.specialRequests ? `\n📝 *Requests:*\n   ${formData.specialRequests}` : ''}
${pricingText}

Looking forward to hearing from you. Thank you! 🌟`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/918837317070?text=${encodedMessage}`, '_blank');
    
    // Save to database in background (non-blocking)
    saveWhatsAppBooking({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      city: formData.city,
      pincode: formData.pincode,
      checkIn: formData.checkIn,
      checkOut: formData.checkOut,
      guests: formData.guests,
      specialRequests: formData.specialRequests,
      selectedRooms,
      nights: nights || 1,
      totalAmount: finalAmount || 0
    }).catch(err => console.error('Background booking save failed:', err));
    
    // Track form completion for analytics
    trackFormComplete();
    
    // Update traveller profile with travel intelligence
    updateProfile({
      is_solo_traveller: travelPreferences.travelingWith === 'solo',
      is_group_organizer: travelPreferences.travelingWith === 'team',
      travel_style: travelPreferences.travelStyle,
      trip_purpose: travelPreferences.tripPurpose,
      location_granted: hasConsented,
      location_city: locationData?.city,
      location_country: locationData?.country,
    });
    
    toast({
      title: "Opening WhatsApp",
      description: "Continue your booking on WhatsApp.",
    });
    
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
        </DialogHeader>
        <Card className="bg-card/95 backdrop-blur-sm border-border shadow-2xl border">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              <MessageCircle className="h-8 w-8 mx-auto mb-2 text-primary" />
              Book through WhatsApp
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Fill in your details and connect with us on WhatsApp
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="flex items-center gap-1">
                    Full Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    onBlur={(e) => handleBlur('name', e.target.value)}
                    placeholder="Your Name"
                    className={errors.name ? 'border-destructive focus-visible:ring-destructive' : ''}
                  />
                  {errors.name && (
                    <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.name}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="phone" className="flex items-center gap-1">
                    Phone Number <span className="text-destructive">*</span>
                  </Label>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      onBlur={(e) => handleBlur('phone', e.target.value)}
                      placeholder="+91 9876543210"
                      className={errors.phone ? 'border-destructive focus-visible:ring-destructive' : ''}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="flex items-center gap-1">
                  Email Address <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  onBlur={(e) => handleBlur('email', e.target.value)}
                  placeholder="your@email.com"
                  className={errors.email ? 'border-destructive focus-visible:ring-destructive' : ''}
                />
                {errors.email && (
                  <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.email}
                  </p>
                )}
              </div>

              {/* City and Pincode */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    onBlur={(e) => handleBlur('city', e.target.value)}
                    placeholder="Your City"
                    className={errors.city ? 'border-destructive focus-visible:ring-destructive' : ''}
                  />
                  {errors.city && (
                    <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.city}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input
                    id="pincode"
                    value={formData.pincode}
                    onChange={(e) => handleInputChange('pincode', e.target.value)}
                    onBlur={(e) => handleBlur('pincode', e.target.value)}
                    placeholder="123456"
                    maxLength={6}
                    className={errors.pincode ? 'border-destructive focus-visible:ring-destructive' : ''}
                  />
                  {errors.pincode && (
                    <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.pincode}
                    </p>
                  )}
                </div>
              </div>

              {/* Booking Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="checkIn" className="flex items-center gap-1">
                    Check-in Date <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="checkIn"
                    type="date"
                    value={formData.checkIn}
                    onChange={(e) => handleInputChange('checkIn', e.target.value)}
                    onBlur={(e) => handleBlur('checkIn', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className={errors.checkIn ? 'border-destructive focus-visible:ring-destructive' : ''}
                  />
                  {errors.checkIn && (
                    <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.checkIn}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="checkOut" className="flex items-center gap-1">
                    Check-out Date <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="checkOut"
                    type="date"
                    value={formData.checkOut}
                    onChange={(e) => handleInputChange('checkOut', e.target.value)}
                    onBlur={(e) => handleBlur('checkOut', e.target.value)}
                    min={formData.checkIn || new Date().toISOString().split('T')[0]}
                    className={errors.checkOut ? 'border-destructive focus-visible:ring-destructive' : ''}
                  />
                  {errors.checkOut && (
                    <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.checkOut}
                    </p>
                  )}
                </div>
              </div>

              {nights > 0 && (
                <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                  <p className="text-primary font-semibold">
                    <Calendar className="h-4 w-4 inline mr-2" />
                    Total Nights: {nights}
                  </p>
                </div>
              )}

              {/* Guest Selection */}
              <div>
                <Label htmlFor="guests">Number of Guests</Label>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="guests"
                    type="number"
                    min="1"
                    max="100"
                    value={formData.guests}
                    onChange={(e) => handleInputChange('guests', parseInt(e.target.value) || 1)}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Room/Dorm Type Selection */}
              <div className="space-y-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                {/* Winter Offer Badge */}
                <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-2xl">❄️</span>
                    <p className="text-sm font-bold text-blue-900 dark:text-blue-100">
                      Winter Offer: 10% Flat Off on All Rooms!
                    </p>
                    <span className="text-2xl">❄️</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Home className="h-5 w-5 text-primary" />
                    <Label className="text-lg font-semibold">Choose Your Room/Dorm Type</Label>
                  </div>
                  {loadingRooms && (
                    <span className="text-xs text-muted-foreground">Loading rooms...</span>
                  )}
                  {!loadingRooms && roomTypes.length > 0 && (
                    <span className="text-xs text-muted-foreground">{roomTypes.length} options available</span>
                  )}
                </div>

                {roomsError && (
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <p className="text-sm text-destructive">{roomsError}</p>
                  </div>
                )}

                {/* Room Type Checkboxes - Grouped by Property Type */}
                <div className="space-y-4">
                  {loadingRooms ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      Loading room types...
                    </div>
                  ) : roomTypes.length === 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      No room types available
                    </div>
                  ) : (
                    <>
                      {/* Group rooms by category - exclude Economy */}
                      {Array.from(new Set(roomTypes.map(rt => rt.category))).filter(category => category !== 'Economy').map(category => (
                        <div key={category} className="space-y-2">
                          <h4 className="font-semibold text-sm text-primary uppercase tracking-wide">{category}</h4>
                          <div className="space-y-2 pl-2">
                            {roomTypes
                              .filter(rt => rt.category === category)
                              .sort((a, b) => {
                                // Custom order for rooms
                                const order = [
                                  'King Double Room',
                                  'King Triple Room', 
                                  'Bed in 4-Bed Female Dormitory',
                                  'Bed in 4-Bed Mixed Dormitory',
                                  'Bed in 6-Bed Female Dormitory',
                                  'Bed in 6-Bed Mixed Dormitory'
                                ];
                                const aIndex = order.indexOf(a.name);
                                const bIndex = order.indexOf(b.name);
                                
                                if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
                                if (aIndex !== -1) return -1;
                                if (bIndex !== -1) return 1;
                                return a.name.localeCompare(b.name);
                              })
                              .map(roomType => (
                                 <div
                                   key={roomType.id}
                                   className={`flex items-start space-x-3 p-3 rounded-lg border transition-colors ${
                                     selectedRoomIds.has(roomType.id)
                                       ? 'border-primary bg-primary/5'
                                       : canAccommodateRemaining(roomType.name)
                                       ? 'border-accent bg-accent/10 hover:border-accent shadow-sm'
                                       : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-primary'
                                   }`}
                                 >
                                  <Checkbox
                                    id={roomType.id}
                                    checked={selectedRoomIds.has(roomType.id)}
                                    onCheckedChange={() => handleRoomToggle(roomType.id)}
                                    className="mt-1"
                                  />
                                   <div className="flex-1">
                                      <Label
                                       htmlFor={roomType.id}
                                       className="font-medium cursor-pointer leading-tight"
                                     >
                                       {roomType.name}
                                     </Label>
                                      <div className="flex items-center gap-2 mt-1">
                                        <p className="text-xs text-muted-foreground line-through">
                                          {formatPrice(roomType.base_price)}
                                        </p>
                                        <p className="text-xs font-semibold text-green-600">
                                          {formatPrice(Math.round(roomType.base_price * 0.9))}/night
                                        </p>
                                        <span className="text-[10px] bg-blue-500 text-white px-1.5 py-0.5 rounded">10% OFF</span>
                                        <p className="text-xs text-muted-foreground">• {roomType.capacity} guests</p>
                                      </div>
                                     {canAccommodateRemaining(roomType.name) && !selectedRoomIds.has(roomType.id) && (
                                       <p className="text-xs text-accent font-medium mt-1 flex items-center gap-1">
                                         <span className="inline-block w-2 h-2 bg-accent rounded-full animate-pulse"></span>
                                         Can accommodate {getRemainingGuests()} remaining guest{getRemainingGuests() > 1 ? 's' : ''}
                                       </p>
                                     )}
                                   </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>

                {/* Helper text */}
                <p className="text-xs text-muted-foreground">
                  Select one or more room types for your booking. You can adjust quantities below.
                </p>

                {/* Selected Rooms Display */}
                {selectedRooms.length > 0 && (
                  <div className="space-y-2 mt-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium text-muted-foreground">Selected Rooms:</Label>
                      <span className="text-xs text-muted-foreground">
                        Accommodates: {getTotalAccommodatedGuests()} / {formData.guests} guests
                      </span>
                    </div>
                    {selectedRooms.map((room) => {
                      const isDormitory = room.roomTypeName.toLowerCase().includes('dormitory');
                      const unitLabel = isDormitory ? 'bed(s)' : 'room(s)';
                      const priceLabel = isDormitory ? '/night/bed' : '/night';
                      const capacityPerUnit = getCapacityPerUnit(room.roomTypeName);
                      
                      return (
                        <div
                          key={room.roomTypeId}
                          className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-sm">{room.roomTypeName}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatPrice(room.price)}{priceLabel} × {room.quantity} {unitLabel} × {nights || 0} nights = {formatPrice(room.price * room.quantity * (nights || 0))}
                            </p>
                            <p className="text-xs text-primary/70">
                              {isDormitory 
                                ? `${room.quantity} bed(s) = ${room.quantity} guest(s)`
                                : `${room.quantity} room(s) × ${capacityPerUnit} guests/room = ${room.quantity * capacityPerUnit} guest(s)`
                              }
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleUpdateQuantity(room.roomTypeId, room.quantity - 1)}
                                className="h-7 w-7 p-0"
                              >
                                -
                              </Button>
                              <span className="w-8 text-center text-sm font-medium">{room.quantity}</span>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleUpdateQuantity(room.roomTypeId, room.quantity + 1)}
                                disabled={room.quantity >= getMaxQuantity(room.roomTypeName)}
                                className="h-7 w-7 p-0"
                              >
                                +
                              </Button>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveRoom(room.roomTypeId)}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                    
                    {/* Capacity warning if not enough rooms selected */}
                    {getTotalAccommodatedGuests() < formData.guests && (
                      <div className="p-2 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                        <p className="text-xs text-amber-700 dark:text-amber-400">
                          ⚠️ Please add {formData.guests - getTotalAccommodatedGuests()} more bed(s)/room(s) to accommodate all {formData.guests} guests
                        </p>
                      </div>
                    )}
                    
                    {/* Total Amount */}
                    {nights > 0 && (
                      <div className="mt-3 p-3 bg-primary/10 rounded-lg border border-primary/20 space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">Subtotal:</span>
                          <span className="text-foreground">{formatPrice(getTotalAmount())}</span>
                        </div>
                        
                        {isEligibleForWelcomeDiscount && (
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-green-600 flex items-center gap-1">
                              <Gift className="h-3 w-3" />
                              XTSY Welcome Discount (5%):
                            </span>
                            <span className="text-green-600">-{formatPrice(getWelcomeDiscount())}</span>
                          </div>
                        )}
                        
                        <div className="border-t border-primary/20 pt-2">
                          <p className="text-primary font-bold text-lg text-right">
                            Total: {formatPrice(getFinalAmount())}
                          </p>
                        </div>
                        
                        {!travelPreferences.visitorState && (
                          <p className="text-xs text-amber-600 text-center">
                            💡 Select your state below to check for exclusive discounts!
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Food Add-ons & Additional Services */}
              <FoodAddonsSection 
                formData={formData}
                onInputChange={handleInputChange}
              />

              {/* Travel Preferences - Mandatory Section */}
              <div className="border border-border/50 rounded-lg overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5">
                <div className="flex items-center gap-2 p-4 border-b border-border/50">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="font-medium text-sm">Tell us about yourself</span>
                  <span className="text-xs text-primary ml-auto">Required</span>
                </div>
                
                <div className="p-4 space-y-4">
                  {/* Where are you from - State Dropdown */}
                  <div>
                    <Label className="text-sm text-muted-foreground flex items-center gap-2">
                      <MapPin className="h-3 w-3" />
                      Where are you from?
                    </Label>
                    <Select
                      value={travelPreferences.visitorState}
                      onValueChange={async (value) => {
                        setTravelPreferences(prev => ({ ...prev, visitorState: value }));
                        
                        // Track state selection to analytics
                        try {
                          await supabase.functions.invoke('track-analytics', {
                            body: {
                              endpoint: 'visitor_location',
                              data: {
                                visitorId: localStorage.getItem('xtsy_visitor_id') || 'unknown',
                                region: value,
                                country: 'India',
                                countryCode: 'IN',
                                source: 'booking_form_dropdown',
                              }
                            }
                          });
                        } catch (e) {
                          console.log('Location tracking error:', e);
                        }
                        
                        // Show toast if eligible for discount
                        if (DISCOUNT_ELIGIBLE_STATES.includes(value)) {
                          toast({
                            title: "🎉 XTSY Welcome Discount Unlocked!",
                            description: `Welcome from ${value}! You get an extra 5% off on your booking.`,
                            duration: 4000,
                          });
                        }
                      }}
                    >
                      <SelectTrigger className="mt-2 bg-background">
                        <SelectValue placeholder="Select your state" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60 bg-background z-50">
                        {INDIAN_STATES.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    {/* Show discount badge after selection */}
                    {isEligibleForWelcomeDiscount && (
                      <div className="mt-2 p-2 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
                        <p className="text-xs text-green-700 dark:text-green-400 flex items-center gap-1">
                          <Gift className="h-3 w-3" />
                          <span className="font-medium">XTSY Welcome Discount Applied!</span>
                          <span className="ml-auto">Extra 5% off</span>
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Trip Purpose */}
                  <div>
                    <Label className="text-sm text-muted-foreground">What brings you to Shillong?</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {['Adventure', 'Work', 'Vacation', 'Event', 'Other'].map((purpose) => (
                        <Button
                          key={purpose}
                          type="button"
                          variant={travelPreferences.tripPurpose === purpose.toLowerCase() ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setTravelPreferences(prev => ({ ...prev, tripPurpose: purpose.toLowerCase() }))}
                          className="text-xs h-7"
                        >
                          {purpose}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Traveling With */}
                  <div>
                    <Label className="text-sm text-muted-foreground">Who are you traveling with?</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {['Solo', 'Couple', 'Family', 'Friends', 'Team'].map((group) => (
                        <Button
                          key={group}
                          type="button"
                          variant={travelPreferences.travelingWith === group.toLowerCase() ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setTravelPreferences(prev => ({ ...prev, travelingWith: group.toLowerCase() }))}
                          className="text-xs h-7"
                        >
                          {group}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Travel Style */}
                  <div>
                    <Label className="text-sm text-muted-foreground">What's your travel style?</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {['Budget', 'Mid-range', 'Luxury'].map((style) => (
                        <Button
                          key={style}
                          type="button"
                          variant={travelPreferences.travelStyle === style.toLowerCase() ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setTravelPreferences(prev => ({ ...prev, travelStyle: style.toLowerCase() }))}
                          className="text-xs h-7"
                        >
                          {style}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* How did you hear */}
                  <div>
                    <Label className="text-sm text-muted-foreground">How did you hear about us?</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {['Google', 'Instagram', 'YouTube', 'Friend', 'Booking.com'].map((source) => (
                        <Button
                          key={source}
                          type="button"
                          variant={travelPreferences.heardFrom === source.toLowerCase() ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setTravelPreferences(prev => ({ ...prev, heardFrom: source.toLowerCase() }))}
                          className="text-xs h-7"
                        >
                          {source}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
                <Textarea
                  id="specialRequests"
                  value={formData.specialRequests}
                  onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                  onFocus={() => trackFieldFocus('specialRequests')}
                  onBlur={(e) => trackFieldBlur('specialRequests', !!e.target.value)}
                  placeholder="Any special requirements or requests..."
                  rows={4}
                />
              </div>

              {/* Privacy Notice */}
              <div className="flex items-start gap-2 p-3 bg-muted/30 rounded-lg text-xs text-muted-foreground">
                <Info className="h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground/70" />
                <p>
                  We use your information to personalize your booking experience and improve our services. 
                  Your data is stored securely and never shared with third parties.{' '}
                  <button 
                    type="button"
                    onClick={() => setShowPrivacyModal(true)} 
                    className="text-primary underline hover:text-primary/80"
                  >
                    Privacy Policy
                  </button>
                </p>
              </div>

              {/* Privacy Policy Modal - Rendered via Portal */}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleBookNow}
                  disabled={isSubmitting}
                  className="flex-1 bg-[#25D366] hover:bg-[#20BD5A] text-white disabled:opacity-50"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  {isSubmitting ? 'Submitting...' : 'Book Now'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </DialogContent>

      {/* Privacy Policy Modal - Separate Dialog for proper viewport positioning */}
      <Dialog
        open={showPrivacyModal}
        onOpenChange={(open) => {
          if (!open) setShowPrivacyModal(false);
        }}
      >
        <DialogContent
          className="p-0 overflow-hidden"
          style={{
            position: 'fixed',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'min(calc(100vw - 32px), 32rem)',
            maxWidth: '32rem',
            boxSizing: 'border-box',
            margin: 0,
          }}
        >
          <div className="flex flex-col max-h-[80vh]">
            <div className="sticky top-0 bg-background border-b p-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowPrivacyModal(false)}
                  className="p-2 hover:bg-muted rounded-full transition-colors md:hidden"
                  aria-label="Go back"
                >
                  <ArrowLeft className="h-5 w-5 text-foreground" />
                </button>
                <h3 className="text-lg font-semibold text-foreground">Privacy Policy</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPrivacyModal(false)}
                className="p-2 hover:bg-muted rounded-full transition-colors bg-muted/50"
                aria-label="Close privacy policy"
              >
                <X className="h-5 w-5 text-foreground" />
              </button>
            </div>

            <div className="p-4 space-y-4 text-sm text-muted-foreground overflow-y-auto">
              <section>
                <h4 className="font-semibold text-foreground mb-2">Information We Collect</h4>
                <p>
                  We collect personal information you provide when making a booking, including your name,
                  email, phone number, and travel preferences. We also collect anonymous usage data to
                  improve our services.
                </p>
              </section>
              <section>
                <h4 className="font-semibold text-foreground mb-2">How We Use Your Information</h4>
                <p>
                  Your information is used to process bookings, personalize your experience, send booking
                  confirmations, and improve our services. We may use location data (with your consent) to
                  provide local recommendations.
                </p>
              </section>
              <section>
                <h4 className="font-semibold text-foreground mb-2">Data Security</h4>
                <p>
                  We implement industry-standard security measures to protect your personal information.
                  Your data is encrypted and stored securely on our servers.
                </p>
              </section>
              <section>
                <h4 className="font-semibold text-foreground mb-2">Your Rights</h4>
                <p>
                  You have the right to access, correct, or delete your personal data. Contact us at
                  admin@xtsy.one for any privacy-related requests.
                </p>
              </section>
              <section>
                <h4 className="font-semibold text-foreground mb-2">Contact</h4>
                <p>Email: admin@xtsy.one | Phone: +91 88373 17070</p>
              </section>
            </div>

            <div className="sticky bottom-0 bg-background border-t p-4">
              <Button
                type="button"
                onClick={() => setShowPrivacyModal(false)}
                className="w-full"
                variant="outline"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
};

export default WhatsAppBookingForm;
