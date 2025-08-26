import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, User, Mail, Phone, MapPin, AlertTriangle, Calendar, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useApp } from "@/contexts/AppContext";
import UPIPaymentModal from "./UPIPaymentModal";

interface GuestDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  bookingData: {
    checkIn: string;
    checkOut: string;
    guests: number;
    nights: number;
    selectedRooms: Array<{
      id: string;
      name: string;
      price: number;
      type: string;
      selection: { guests: number; rooms: number };
    }>;
    totalAmount: number;
    gstAmount: number;
    subtotal: number;
    discountAmount: number;
    couponCode: string;
    couponDiscount: number;
    addOns?: {
      breakfast: number;
      dinnerVeg: number;
      dinnerNonVeg: number;
      transportation: boolean;
      itineraryPlanning: boolean;
    };
  };
}

const GuestDetails = ({ isOpen, onClose, onBack, bookingData }: GuestDetailsProps) => {
  const [formData, setFormData] = useState({
    guestName: "",
    email: "",
    whatsappNumber: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    emergencyContact: "",
    emergencyRelation: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isHeaderCompact, setIsHeaderCompact] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastScrollTop = useRef(0);
  
  const { toast } = useToast();
  const { formatPrice } = useApp();

  // Scroll detection for header compacting
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const currentScrollTop = scrollContainer.scrollTop;
      const scrollingDown = currentScrollTop > lastScrollTop.current;
      
      // Compact header when scrolling down past 100px, expand when scrolling up
      if (scrollingDown && currentScrollTop > 100) {
        setIsHeaderCompact(true);
      } else if (!scrollingDown && currentScrollTop < 50) {
        setIsHeaderCompact(false);
      }
      
      lastScrollTop.current = currentScrollTop;
    };

    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, []);

  // Validate email format
  const validateEmail = (email: string) => {
    const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]+$/;
    return emailRegex.test(email);
  };

  // Validate phone number
  const validatePhone = (phone: string) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  // Sanitize input to prevent XSS
  const sanitizeInput = (input: string) => {
    return input.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  };

  const handleInputChange = (field: string, value: string) => {
    const sanitizedValue = sanitizeInput(value);
    setFormData(prev => ({ ...prev, [field]: sanitizedValue }));
  };

  const validateForm = () => {
    // All fields are mandatory except emergency contact fields
    const requiredFields = ['guestName', 'email', 'whatsappNumber', 'address', 'city', 'state', 'pincode'];
    const hasRequiredFields = requiredFields.every(field => formData[field as keyof typeof formData].trim() !== '');
    
    if (!hasRequiredFields) return false;
    if (!validateEmail(formData.email)) return false;
    if (!validatePhone(formData.whatsappNumber)) return false;
    
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast({
        title: "Please fill all required fields",
        description: "All fields are mandatory except emergency contact information",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    // Generate booking ID outside try block for later use
    let bookingId = '';

    try {
      // Import the secure booking service
      const { SecureBookingService } = await import('@/services/secureBookingService');
      
      // Generate a unique booking ID
      bookingId = SecureBookingService.generateBookingId();
      
      // Prepare booking data for secure storage
      const secureBookingData = {
        bookingId,
        guestName: formData.guestName,
        email: formData.email,
        whatsappNumber: formData.whatsappNumber,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        guests: bookingData.guests,
        nights: bookingData.nights,
        roomDetails: bookingData.selectedRooms.map(room => ({
          roomId: room.id,
          roomName: room.name,
          roomType: room.type,
          price: room.price,
          quantity: room.selection.rooms || room.selection.guests,
          guests: room.selection.guests,
          totalPrice: room.type === 'dorm' 
            ? room.price * room.selection.guests * bookingData.nights
            : room.price * room.selection.rooms * bookingData.nights
        })),
        subtotal: bookingData.subtotal,
        gstAmount: bookingData.gstAmount,
        totalAmount: bookingData.totalAmount,
        discountAmount: bookingData.discountAmount || 0,
        promoCode: bookingData.couponCode || null,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        emergencyContact: formData.emergencyContact || null,
        emergencyRelation: formData.emergencyRelation || null,
        addOns: {
          breakfast: bookingData.addOns?.breakfast || 0,
          dinnerVeg: bookingData.addOns?.dinnerVeg || 0,
          dinnerNonVeg: bookingData.addOns?.dinnerNonVeg || 0,
          transportation: bookingData.addOns?.transportation || false,
          itinerary: bookingData.addOns?.itineraryPlanning || false,
        }
      };

      // Validate booking data before submission
      const validation = SecureBookingService.validateBookingData(secureBookingData);
      if (!validation.isValid) {
        toast({
          title: "Booking validation failed",
          description: validation.errors.join(', '),
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }

      // Create booking through secure service
      const result = await SecureBookingService.createBooking(secureBookingData);
      
      if (!result.success) {
        toast({
          title: "Booking creation failed",
          description: result.error || "Please try again or contact support.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }

      toast({
        title: "Booking Saved Securely",
        description: `Your booking ${bookingId} has been saved. Proceeding to WhatsApp...`,
      });

    } catch (error) {
      console.error('Secure booking creation error:', error);
      toast({
        title: "Security Error",
        description: "Unable to save booking securely. Please try again.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    // Format dates for WhatsApp message
    const formatDate = (dateStr: string) => {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
    };

    // Determine property type based on room selection
    const hasLuxuryRooms = bookingData.selectedRooms.some(room => 
      room.name.toLowerCase().includes('luxury') || 
      room.name.toLowerCase().includes('suite') || 
      room.name.toLowerCase().includes('deluxe')
    );
    const hasDormRooms = bookingData.selectedRooms.some(room => 
      room.name.toLowerCase().includes('dorm')
    );
    
    // Determine property name based on room types
    let propertyName = '';
    if (hasLuxuryRooms && hasDormRooms) {
      propertyName = 'XTSY Travellers Hostel & XTSY Luxury';
    } else if (hasLuxuryRooms) {
      propertyName = 'XTSY Luxury';
    } else {
      propertyName = 'XTSY Travellers Hostel';
    }

    // Format room details for WhatsApp message with currency formatting
    const roomDetails = bookingData.selectedRooms.map(room => {
      const isDorm = room.name.toLowerCase().includes('dorm');
      const selection = room.selection;
      const nights = bookingData.nights;
      
      if (isDorm) {
        const totalPrice = room.price * selection.guests * nights;
        return `• ${room.name}: ${selection.guests} beds × ${nights} nights = ${formatPrice(totalPrice)}`;
      } else {
        const totalPrice = room.price * selection.rooms * nights;
        return `• ${room.name}: ${selection.rooms} rooms × ${nights} nights = ${formatPrice(totalPrice)}`;
      }
    }).join('\n');

    // Include emergency contact if provided
    const emergencyContactText = formData.emergencyContact && formData.emergencyRelation 
      ? `\n• Emergency Contact: ${formData.emergencyContact} (${formData.emergencyRelation})`
      : formData.emergencyContact 
        ? `\n• Emergency Contact: ${formData.emergencyContact}`
        : '';

    // Format add-on services
    const addOnServices = [];
    if (bookingData.addOns?.breakfast > 0) {
      addOnServices.push(`• Breakfast: ${bookingData.addOns.breakfast} persons × ${bookingData.nights} nights`);
    }
    if (bookingData.addOns?.dinnerVeg > 0) {
      addOnServices.push(`• Dinner (Veg): ${bookingData.addOns.dinnerVeg} persons × ${bookingData.nights} nights`);
    }
    if (bookingData.addOns?.dinnerNonVeg > 0) {
      addOnServices.push(`• Dinner (Non-Veg): ${bookingData.addOns.dinnerNonVeg} persons × ${bookingData.nights} nights`);
    }
    if (bookingData.addOns?.transportation) {
      addOnServices.push(`• Transportation arrangement: On request basis`);
    }
    if (bookingData.addOns?.itineraryPlanning) {
      addOnServices.push(`• Itinerary planning: On request basis`);
    }

    const addOnServicesText = addOnServices.length > 0 
      ? `\n\n🍽️ Add-on Services\n${addOnServices.join('\n')}`
      : '';

    // Use the booking ID generated earlier
    
    const whatsappMessage = `🏔️ *NEW BOOKING REQUEST* 🏔️
✨ Property: ${propertyName}
📋 Booking ID: ${bookingId}

Hi ${formData.guestName},

Thanks for choosing to vibe with us at ${propertyName.includes('&') ? 'XTSY' : propertyName} – where travel meets community ✨
We've received your booking request. Your reservation is pending final confirmation from our property team. Here's what we've got:

👤 Guest Details
• Name: ${formData.guestName}
• Email: ${formData.email}
• Phone: ${formData.whatsappNumber}
• Address: ${formData.address}, ${formData.city}, ${formData.state} – ${formData.pincode}${emergencyContactText}

🛏️ Booking Summary
• Check-in: ${formatDate(bookingData.checkIn)}
• Check-out: ${formatDate(bookingData.checkOut)}
• Nights: ${bookingData.nights}
• Guests: ${bookingData.guests}

Room Selection:
${roomDetails}
Total Stay: ${formatPrice(bookingData.totalAmount)}${addOnServicesText}

💳 Payment Info
• GST: ${formatPrice(bookingData.gstAmount)} ${bookingData.gstAmount === 0 ? '(Dorms under ₹1000/night exempt)' : ''}
• Total Amount: ${formatPrice(bookingData.totalAmount)}
• Status: Pending Final Confirmation

If you need anything before your trip—airport pickup, itinerary help, or just the latest café playlist, hit us up on WhatsApp anytime!

—

We're hyped to host you! Stay tuned for confirmation.
Until then—safe travels & pack light 🧳🌿

— Team XTSY`;

    const whatsappURL = `https://wa.me/918837317070?text=${encodeURIComponent(whatsappMessage)}`;
    
    // Open WhatsApp in new tab
    window.open(whatsappURL, '_blank');
    
    // Show success message and close modal
    toast({
      title: "Redirecting to WhatsApp",
      description: "Your booking details have been prepared. Complete the booking via WhatsApp.",
    });
    
    // Clear booking data and close modal
    localStorage.removeItem('xtsy_current_booking');
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-full h-full max-w-none max-h-none md:max-w-2xl lg:max-w-3xl md:max-h-[95vh] md:h-auto bg-white border-0 p-0 overflow-hidden">
          <div className="flex flex-col h-full max-h-[100vh] md:max-h-[95vh]">
            {/* Header - Fixed with Dynamic Sizing */}
            <div className={`flex-shrink-0 border-b bg-gradient-to-r from-orange-50 to-red-50 transition-all duration-300 ${
              isHeaderCompact ? 'p-2 md:p-3' : 'p-4 md:p-6'
            }`}>
              <div className="flex items-center gap-3 mb-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onBack}
                  className="p-2 text-gray-900 hover:bg-gray-100"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-900" />
                </Button>
                <DialogTitle className={`font-bold text-gray-900 transition-all duration-300 ${
                  isHeaderCompact ? 'text-lg md:text-xl' : 'text-xl md:text-2xl'
                }`}>
                  Booking Summary and Guest Details
                </DialogTitle>
              </div>
              
              {/* Booking Summary - Collapsible */}
              <div className={`bg-white rounded-lg shadow-sm transition-all duration-300 overflow-hidden ${
                isHeaderCompact ? 'p-2 mt-2' : 'p-3 mt-4'
              }`}>
                <div className={`grid gap-3 transition-all duration-300 ${
                  isHeaderCompact ? 'grid-cols-4 text-xs' : 'grid-cols-2 md:grid-cols-4 text-sm'
                }`}>
                  <div className="flex items-center gap-2">
                    <Calendar className={`text-orange-500 transition-all duration-300 ${
                      isHeaderCompact ? 'h-3 w-3' : 'h-4 w-4'
                    }`} />
                    <div>
                      <div className="text-gray-700 font-medium">Check-in</div>
                      <div className="font-semibold text-gray-900">{new Date(bookingData.checkIn).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className={`text-orange-500 transition-all duration-300 ${
                      isHeaderCompact ? 'h-3 w-3' : 'h-4 w-4'
                    }`} />
                    <div>
                      <div className="text-gray-700 font-medium">Check-out</div>
                      <div className="font-semibold text-gray-900">{new Date(bookingData.checkOut).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className={`text-orange-500 transition-all duration-300 ${
                      isHeaderCompact ? 'h-3 w-3' : 'h-4 w-4'
                    }`} />
                    <div>
                      <div className="text-gray-700 font-medium">Guests</div>
                      <div className="font-semibold text-gray-900">{bookingData.guests}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className={`text-orange-500 transition-all duration-300 ${
                      isHeaderCompact ? 'h-3 w-3' : 'h-4 w-4'
                    }`} />
                    <div>
                      <div className="text-gray-700 font-medium">Nights</div>
                      <div className="font-semibold text-gray-900">{bookingData.nights}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Booking Summary - Hidden when compact */}
              {!isHeaderCompact && (
                <div className="mt-3 p-3 rounded-lg bg-blue-50 border border-blue-200 transition-all duration-300">
                  <div className="text-sm font-medium text-blue-800 mb-2">
                    📋 Booking Details
                  </div>
                  
                  {/* Room Details */}
                  <div className="space-y-2">
                    {bookingData.selectedRooms.map((room, index) => {
                      const isDorm = room.type === 'dorm';
                      const quantity = isDorm ? room.selection.guests : room.selection.rooms;
                      const unitPrice = room.price;
                      const totalPrice = unitPrice * quantity * bookingData.nights;
                      
                      return (
                        <div key={index} className="flex justify-between items-center text-xs text-blue-700">
                          <span className="font-medium">
                            {room.name}: {quantity} {isDorm ? 'beds' : 'rooms'} × {bookingData.nights} nights
                          </span>
                          <span className="font-semibold">{formatPrice(totalPrice)}</span>
                        </div>
                      );
                    })}
                    
                    {/* Add-ons */}
                    {bookingData.addOns && (
                      <>
                        {bookingData.addOns.breakfast > 0 && (
                          <div className="flex justify-between items-center text-xs text-blue-700">
                            <span>Breakfast: {bookingData.addOns.breakfast} persons × {bookingData.nights} nights</span>
                            <span>Included</span>
                          </div>
                        )}
                        {bookingData.addOns.dinnerVeg > 0 && (
                          <div className="flex justify-between items-center text-xs text-blue-700">
                            <span>Dinner (Veg): {bookingData.addOns.dinnerVeg} persons × {bookingData.nights} nights</span>
                            <span>Included</span>
                          </div>
                        )}
                        {bookingData.addOns.dinnerNonVeg > 0 && (
                          <div className="flex justify-between items-center text-xs text-blue-700">
                            <span>Dinner (Non-Veg): {bookingData.addOns.dinnerNonVeg} persons × {bookingData.nights} nights</span>
                            <span>Included</span>
                          </div>
                        )}
                        {bookingData.addOns.transportation && (
                          <div className="flex justify-between items-center text-xs text-blue-700">
                            <span>Transportation</span>
                            <span>On request</span>
                          </div>
                        )}
                        {bookingData.addOns.itineraryPlanning && (
                          <div className="flex justify-between items-center text-xs text-blue-700">
                            <span>Itinerary Planning</span>
                            <span>On request</span>
                          </div>
                        )}
                      </>
                    )}
                    
                    {/* Pricing Breakdown */}
                    <div className="border-t border-blue-300 pt-2 mt-2">
                      <div className="flex justify-between items-center text-xs text-blue-700">
                        <span>Subtotal</span>
                        <span>{formatPrice(bookingData.subtotal)}</span>
                      </div>
                      {bookingData.discountAmount > 0 && (
                        <div className="flex justify-between items-center text-xs text-blue-700">
                          <span>Discount {bookingData.couponCode && `(${bookingData.couponCode})`}</span>
                          <span>-{formatPrice(bookingData.discountAmount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center text-xs text-blue-700">
                        <span>GST {bookingData.gstAmount === 0 ? '(Exempt)' : ''}</span>
                        <span>{formatPrice(bookingData.gstAmount)}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm font-semibold text-blue-800 border-t border-blue-300 pt-1 mt-1">
                        <span>Total Amount</span>
                        <span>{formatPrice(bookingData.totalAmount)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-xs mt-2 text-blue-600">
                    Complete booking via WhatsApp with payment details
                  </div>
                </div>
              )}
            </div>

            {/* Scrollable Form Content */}
            <div ref={scrollContainerRef} className="flex-1 overflow-y-auto min-h-0">
              <div className="p-4 md:p-6 space-y-6 pb-40 md:pb-6">
                {/* Primary Guest Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <User className="h-5 w-5 text-orange-500" />
                    Primary Guest Information *
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="guestName" className="text-sm font-medium text-gray-700">
                        Full Name *
                      </Label>
                      <Input
                        id="guestName"
                        value={formData.guestName}
                        onChange={(e) => handleInputChange('guestName', e.target.value)}
                        placeholder="Enter your full name"
                        className="mt-1"
                        maxLength={100}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="your@example.com"
                        className="mt-1"
                        maxLength={100}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="whatsappNumber" className="text-sm font-medium text-gray-700">
                        WhatsApp Number *
                      </Label>
                      <Input
                        id="whatsappNumber"
                        value={formData.whatsappNumber}
                        onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
                        placeholder="+91 9876543210"
                        className="mt-1"
                        maxLength={20}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-orange-500" />
                    Address Information *
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                        Full Address *
                      </Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="House No, Street, Area"
                        className="mt-1"
                        maxLength={200}
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                          City *
                        </Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          placeholder="City"
                          className="mt-1"
                          maxLength={50}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="state" className="text-sm font-medium text-gray-700">
                          State *
                        </Label>
                        <Input
                          id="state"
                          value={formData.state}
                          onChange={(e) => handleInputChange('state', e.target.value)}
                          placeholder="State"
                          className="mt-1"
                          maxLength={50}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="pincode" className="text-sm font-medium text-gray-700">
                          Pincode *
                        </Label>
                        <Input
                          id="pincode"
                          value={formData.pincode}
                          onChange={(e) => handleInputChange('pincode', e.target.value)}
                          placeholder="123456"
                          className="mt-1"
                          maxLength={10}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Emergency Contact - Optional */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    Emergency Contact (Optional)
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="emergencyContact" className="text-sm font-medium text-gray-700">
                        Emergency Contact Number
                      </Label>
                      <Input
                        id="emergencyContact"
                        value={formData.emergencyContact}
                        onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                        placeholder="+91 9876543210"
                        className="mt-1"
                        maxLength={20}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="emergencyRelation" className="text-sm font-medium text-gray-700">
                        Relationship
                      </Label>
                      <Input
                        id="emergencyRelation"
                        value={formData.emergencyRelation}
                        onChange={(e) => handleInputChange('emergencyRelation', e.target.value)}
                        placeholder="e.g., Father, Mother, Friend"
                        className="mt-1"
                        maxLength={50}
                      />
                    </div>
                  </div>
                </div>

                {/* Instructions for Booking */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Phone className="h-5 w-5 text-orange-500" />
                    Instructions for Booking
                  </h3>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <ul className="space-y-2 text-sm text-blue-800">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 font-semibold">•</span>
                        <span>This is an <strong>enquiry-based booking system</strong> - not real-time availability</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 font-semibold">•</span>
                        <span>Room allocation will be confirmed based on availability across all OTA platforms</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 font-semibold">•</span>
                        <span>Payment is collected manually via QR codes sent through WhatsApp after confirmation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 font-semibold">•</span>
                        <span>Our team will verify availability and send payment details within 2-4 hours</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 font-semibold">•</span>
                        <span>Complete the booking process via WhatsApp for final confirmation</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer - Fixed */}
            <div className="flex-shrink-0 p-4 md:p-6 border-t bg-gray-50 md:relative fixed bottom-0 left-0 right-0 z-50">
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !validateForm()}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-3 text-lg"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </div>
                 ) : (
                  "Complete Booking via WhatsApp"
                 )}
               </Button>
               <p className="text-xs text-gray-500 text-center mt-2">
                 Complete your booking through WhatsApp with payment details
               </p>
             </div>
           </div>
         </DialogContent>
       </Dialog>
    </>
  );
};

export default GuestDetails;
