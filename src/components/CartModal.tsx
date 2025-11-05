import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Trash2, Tag, X, ArrowLeft, Clock, Bookmark } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import GuestDetails from "./GuestDetails";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface BookingData {
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  items: Array<{
    roomId: string;
    roomName: string;
    price: number;
    quantity: number;
    guests: number;
    nights: number;
    roomType?: string;
  }>;
  timestamp: number;
  couponApplied?: boolean;
  couponDiscount?: number;
  couponCode?: string;
  savedForLater?: boolean;
}

const CartModal = ({ isOpen, onClose }: CartModalProps) => {
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [savedBookings, setSavedBookings] = useState<BookingData[]>([]);
  const [showGuestDetails, setShowGuestDetails] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [showExitDiscount, setShowExitDiscount] = useState(false);
  const [bonusDiscount, setBonusDiscount] = useState(0);
  const { toast } = useToast();

  // Calculate GST rate based on room tariff
  const calculateGSTRate = (roomPrice: number) => {
    if (roomPrice < 1000) {
      return 0; // 0% GST
    } else if (roomPrice >= 1000 && roomPrice < 7500) {
      return 0.12; // 12% GST
    } else {
      return 0.18; // 18% GST
    }
  };

  // Check if booking is within 3 days for LASTMIN-DEAL
  const isUrgentBooking = () => {
    if (!bookingData) return false;
    const checkInDate = new Date(bookingData.checkIn);
    const today = new Date();
    const diffTime = checkInDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays >= 0;
  };

  useEffect(() => {
    if (isOpen) {
      const savedData = localStorage.getItem('xtsy_booking_cart');
      const savedForLaterData = localStorage.getItem('xtsy_saved_bookings');
      
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        // Ensure backwards compatibility with old cart data
        if (parsedData && !parsedData.nights) {
          parsedData.nights = 1;
          parsedData.items = parsedData.items?.map((item: any) => ({
            ...item,
            nights: 1,
            roomType: item.roomType || 'dorm'
          })) || [];
        }
        // Update Sky Glass Suite price if it exists in cart
        if (parsedData.items) {
          parsedData.items = parsedData.items.map((item: any) => {
            if (item.roomId === 'sky-glass-suite') {
              return { ...item, price: 7999 };
            }
            return item;
          });
        }
        setBookingData(parsedData);
        setCouponApplied(parsedData.couponApplied || false);
      }
      
      if (savedForLaterData) {
        setSavedBookings(JSON.parse(savedForLaterData));
      }
    }
  }, [isOpen]);

  const handleClose = () => {
    if (showGuestDetails && bookingData && bookingData.items.length > 0) {
      // Check if it's an urgent booking for LASTMIN-DEAL
      if (isUrgentBooking()) {
        setShowExitDiscount(true);
      } else {
        onClose();
      }
    } else {
      onClose();
    }
  };

  const applyLastMinDeal = () => {
    if (!bookingData) return;
    
    const { totalAmount } = calculateTotals();
    const lastMinDiscount = Math.round(totalAmount * 0.15); // 15% discount
    
    const updatedData = {
      ...bookingData,
      couponApplied: true,
      couponDiscount: lastMinDiscount,
      couponCode: 'LASTMIN-DEAL'
    };
    
    setBookingData(updatedData);
    setCouponApplied(true);
    setShowExitDiscount(false);
    
    localStorage.setItem('xtsy_booking_cart', JSON.stringify(updatedData));
    
    toast({
      title: "Last-Minute Deal Applied!",
      description: `15% discount (₹${lastMinDiscount}) applied to your booking!`,
    });
  };

  const declineLastMinDeal = () => {
    setShowExitDiscount(false);
    onClose();
  };

  // Updated promo code logic for XTSY-DEAL
  const applyCoupon = () => {
    if (!bookingData) return;

    if (couponCode.toUpperCase() === "XTSY-DEAL") {
      // Calculate total beds for hostel rooms (dorm type)
      const totalHostelBeds = bookingData.items
        .filter(item => item.roomType === 'dorm')
        .reduce((total, item) => total + item.quantity, 0);

      // Check dates for XTSY-DEAL: same day or within 7 days
      const checkInDate = new Date(bookingData.checkIn);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      checkInDate.setHours(0, 0, 0, 0);
      
      const diffTime = checkInDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const isValidDate = diffDays >= 0 && diffDays <= 7; // Same day (0) to 7 days

      // Check if XTSY-DEAL is applicable: min 4 beds AND valid booking date
      const hasMinBeds = totalHostelBeds >= 4;

      if (hasMinBeds && isValidDate) {
        const { totalAmount } = calculateTotals();
        const discount = Math.round(totalAmount * 0.1); // 10% discount
        
        const updatedData = {
          ...bookingData,
          couponApplied: true,
          couponDiscount: discount,
          couponCode: 'XTSY-DEAL'
        };
        
        setBookingData(updatedData);
        setCouponApplied(true);
        localStorage.setItem('xtsy_booking_cart', JSON.stringify(updatedData));
        
        toast({
          title: "Coupon Applied!",
          description: `₹${discount} discount applied successfully!`,
        });
      } else {
        let errorMessage = "XTSY-DEAL requires ";
        if (!hasMinBeds && !isValidDate) {
          errorMessage += "minimum 4 beds from XTSY Travellers Hostel and booking for same day or within 7 days";
        } else if (!hasMinBeds) {
          errorMessage += "minimum 4 beds from XTSY Travellers Hostel";
        } else {
          errorMessage += "booking for same day or within 7 days from today";
        }
        
        toast({
          title: "Coupon Invalid",
          description: errorMessage,
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "Invalid Coupon",
        description: "Please enter a valid coupon code",
        variant: "destructive"
      });
    }
  };

  const removeCoupon = () => {
    if (!bookingData) return;
    
    const updatedData = {
      ...bookingData,
      couponApplied: false,
      couponDiscount: 0,
      couponCode: undefined
    };
    
    setBookingData(updatedData);
    setCouponApplied(false);
    setCouponCode("");
    setBonusDiscount(0);
    localStorage.setItem('xtsy_booking_cart', JSON.stringify(updatedData));
    
    toast({
      title: "Coupon Removed",
      description: "Discount has been removed from your booking",
    });
  };

  const saveForLater = () => {
    if (bookingData) {
      const savedData = {
        ...bookingData,
        savedForLater: true,
        timestamp: new Date().getTime()
      };
      
      const existingSaved = JSON.parse(localStorage.getItem('xtsy_saved_bookings') || '[]');
      const updatedSaved = [...existingSaved, savedData];
      
      localStorage.setItem('xtsy_saved_bookings', JSON.stringify(updatedSaved));
      localStorage.removeItem('xtsy_booking_cart');
      
      setSavedBookings(updatedSaved);
      setBookingData(null);
      
      toast({
        title: "Booking Saved!",
        description: "Your booking has been saved for later. You can access it anytime.",
      });
    }
    onClose();
  };

  const moveToCart = (index: number) => {
    const bookingToMove = savedBookings[index];
    const updatedSaved = savedBookings.filter((_, i) => i !== index);
    
    // Remove savedForLater flag and update timestamp
    const { savedForLater, ...bookingWithoutFlag } = bookingToMove;
    const updatedBooking = {
      ...bookingWithoutFlag,
      timestamp: new Date().getTime()
    };
    
    localStorage.setItem('xtsy_booking_cart', JSON.stringify(updatedBooking));
    localStorage.setItem('xtsy_saved_bookings', JSON.stringify(updatedSaved));
    
    setSavedBookings(updatedSaved);
    setBookingData(updatedBooking);
    
    toast({
      title: "Moved to Cart",
      description: "Booking has been moved back to your cart",
    });
  };

  const removeSavedBooking = (index: number) => {
    const updatedSaved = savedBookings.filter((_, i) => i !== index);
    setSavedBookings(updatedSaved);
    localStorage.setItem('xtsy_saved_bookings', JSON.stringify(updatedSaved));
    
    toast({
      title: "Booking Removed",
      description: "Saved booking has been removed",
    });
  };

  const clearCart = () => {
    localStorage.removeItem('xtsy_booking_cart');
    setBookingData(null);
    setCouponApplied(false);
    setCouponCode("");
    setBonusDiscount(0);
    toast({
      title: "Cart Cleared",
      description: "All items have been removed from your cart",
    });
  };

  const proceedToGuestDetails = () => {
    setShowGuestDetails(true);
  };

  const goBackToCart = () => {
    setShowGuestDetails(false);
  };

  const getDaysAgo = (timestamp: number) => {
    const now = new Date().getTime();
    const diffTime = Math.abs(now - timestamp);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return "today";
    } else if (diffDays === 1) {
      return "1 day ago";
    } else {
      return `${diffDays} days ago`;
    }
  };

  // Format date properly - remove undefined
  const formatDate = (dateStr: string) => {
    if (!dateStr || dateStr === 'undefined' || dateStr.includes('undefined')) {
      return 'Select Date';
    }
    
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return 'Select Date';
      
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return 'Select Date';
    }
  };

  // Calculate total with proper pricing logic and GST
  const calculateTotals = () => {
    if (!bookingData?.items) return { totalAmount: 0, totalGST: 0, grandTotal: 0, payableNow: 0, discountAmount: 0 };
    
    let totalAmount = 0;
    let totalGST = 0;
    
    bookingData.items.forEach(item => {
      let itemTotal = 0;
      const nights = item.nights || bookingData.nights || 1;
      
      if (item.roomType === 'dorm') {
        // For dorms: price per bed per night
        itemTotal = item.price * item.quantity * nights;
      } else {
        // For luxury rooms: price per room per night
        itemTotal = item.price * item.quantity * nights;
      }
      
      totalAmount += itemTotal;
      
      // Calculate GST for this item
      const gstRate = calculateGSTRate(item.price);
      const itemGST = Math.round(itemTotal * gstRate);
      totalGST += itemGST;
    });
    
    const discountAmount = bookingData.couponApplied ? (bookingData.couponDiscount || 0) : 0;
    const grandTotal = totalAmount + totalGST - discountAmount;
    const payableNow = Math.round(grandTotal * 0.21);
    
    return { totalAmount, totalGST, grandTotal, payableNow, discountAmount };
  };

  const { totalAmount, totalGST, grandTotal, payableNow, discountAmount } = calculateTotals();

  if (showGuestDetails && bookingData) {
    return (
      <GuestDetails
        isOpen={true}
        onClose={handleClose}
        onBack={goBackToCart}
        bookingData={{
          checkIn: bookingData.checkIn,
          checkOut: bookingData.checkOut,
          guests: bookingData.guests,
          nights: bookingData.nights || 1,
        selectedRooms: bookingData.items.map(item => ({
          id: item.roomId,
          name: item.roomName,
          price: item.price,
          type: (item.roomType === 'dorm' || item.roomType === 'private') ? item.roomType : 'dorm',
          selection: { 
            guests: item.guests || 0,
            rooms: item.quantity || 0
            }
          })),
          totalAmount: grandTotal,
          gstAmount: totalGST,
          subtotal: totalAmount,
          discountAmount: discountAmount,
          couponCode: bookingData.couponCode || '',
          couponDiscount: bookingData.couponDiscount || 0
        }}
      />
    );
  }

  // Last-minute deal modal
  if (showExitDiscount) {
    return (
      <Dialog open={true} onOpenChange={() => {}}>
        <DialogContent className="max-w-md mx-auto bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold text-gray-900">
              Wait! Last-Minute Deal!
            </DialogTitle>
          </DialogHeader>
          <div className="text-center p-6">
            <div className="text-6xl mb-4">⚡</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              15% OFF Your Booking!
            </h3>
            <p className="text-gray-700 mb-4">
              Since you're booking within 3 days, get an instant 15% discount on your stay!
            </p>
            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => {
                  applyLastMinDeal();
                  // Navigate to booking summary after applying deal
                  setTimeout(() => {
                    setShowGuestDetails(true);
                  }, 500);
                }}
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold"
              >
                Apply & Continue
              </Button>
              <Button
                onClick={declineLastMinDeal}
                variant="outline"
                className="flex-1 border-gray-300 text-gray-600"
              >
                Skip Deal
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full h-full max-w-none max-h-none md:max-w-3xl lg:max-w-4xl md:max-h-[90vh] md:h-auto bg-white border-0 p-0 overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Mobile Header */}
          <div className="md:hidden flex items-center justify-between p-3 border-b bg-white sticky top-0 z-50">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-orange-500" />
              Your Cart
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Desktop Header */}
          <DialogHeader className="hidden md:block flex-shrink-0 p-6 border-b">
            <DialogTitle className="text-2xl font-bold text-center text-gray-900 flex items-center justify-center gap-2">
              <ShoppingCart className="h-6 w-6 text-orange-500" />
              Your Cart
            </DialogTitle>
          </DialogHeader>

          {!bookingData || bookingData.items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center">
                <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg mb-2">Your cart is empty</p>
                <p className="text-gray-500 text-sm">Add some rooms to get started</p>
                
                {/* Show saved bookings if available */}
                {savedBookings.length > 0 && (
                  <div className="mt-8 w-full max-w-md">
                    <h3 className="text-lg font-semibold mb-4 flex items-center justify-center gap-2">
                      <Bookmark className="h-5 w-5" />
                      Saved Bookings ({savedBookings.length})
                    </h3>
                    <div className="space-y-3">
                      {savedBookings.map((booking, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg border-dashed border-2">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-medium text-sm">
                                {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                              </p>
                              <p className="text-xs text-gray-500">
                                {booking.guests} guests, {booking.nights} nights
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-sm">₹{calculateTotals().grandTotal.toLocaleString()}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => moveToCart(index)}
                              className="flex-1 text-xs h-8"
                            >
                              Move to Cart
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeSavedBooking(index)}
                              className="text-red-600 hover:text-red-700 text-xs h-8"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Scrollable Content - Fixed height for all views */}
              <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-4 max-h-[60vh] md:max-h-[50vh]">
                {/* Cart saved info */}
                <div className="text-center text-sm text-gray-500">
                  Cart saved {getDaysAgo(bookingData.timestamp)} | Session expires in {Math.max(0, 6 - Math.floor((Date.now() - bookingData.timestamp) / (1000 * 60 * 60)))} hours
                </div>

                {/* Booking Summary - Compact view */}
                <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-3 md:p-4 border border-orange-200">
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    Booking Summary
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 text-xs md:text-sm">
                    <div>
                      <span className="text-gray-600 block">Check-in:</span>
                      <div className="text-gray-900 font-medium">{formatDate(bookingData.checkIn)}</div>
                    </div>
                    <div>
                      <span className="text-gray-600 block">Check-out:</span>
                      <div className="text-gray-900 font-medium">{formatDate(bookingData.checkOut)}</div>
                    </div>
                    <div>
                      <span className="text-gray-600 block">Nights:</span>
                      <div className="text-gray-900 font-medium">{bookingData.nights || 1}</div>
                    </div>
                    <div>
                      <span className="text-gray-600 block">Guests:</span>
                      <div className="text-gray-900 font-medium">{bookingData.guests}</div>
                    </div>
                  </div>
                </div>

                {/* Coupon Section - Compact */}
                <div className="bg-yellow-50 rounded-xl p-3 md:p-4 border border-yellow-200">
                  <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Tag className="h-4 w-4 text-yellow-500" />
                    Apply Coupon
                  </h3>
                  {!couponApplied ? (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter coupon code"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="flex-1 text-sm h-10"
                        />
                        <Button 
                          onClick={applyCoupon}
                          className="bg-orange-500 hover:bg-orange-600 text-white px-3 text-sm h-10"
                        >
                          Apply
                        </Button>
                      </div>
                      <p className="text-orange-600 text-xs">
                        Use "XTSY-DEAL" for min 4 beds from XTSY Travellers Hostel (same day or within 7 days)
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between bg-green-100 rounded-lg p-3 border border-green-300">
                      <div>
                        <span className="text-green-800 font-medium text-sm">{bookingData.couponCode || 'XTSY-DEAL'} Applied!</span>
                        <p className="text-green-700 text-xs">₹{discountAmount} discount</p>
                      </div>
                      <Button 
                        onClick={removeCoupon}
                        variant="outline"
                        size="sm"
                        className="border-green-300 text-green-700 hover:bg-green-50 text-xs"
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                </div>

                {/* Selected Rooms - Compact cards */}
                <div className="space-y-2">
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 flex items-center gap-2">
                    Selected Rooms
                  </h3>
                  {bookingData.items.map((item, index) => {
                    const nights = item.nights || bookingData.nights || 1;
                    let itemTotal = 0;
                    
                    if (item.roomType === 'dorm') {
                      itemTotal = item.price * item.quantity * nights;
                    } else {
                      itemTotal = item.price * item.quantity * nights;
                    }
                    
                    return (
                      <div key={index} className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 mb-1 text-sm md:text-base">{item.roomName}</h4>
                            <p className="text-gray-600 text-xs md:text-sm">
                              {item.roomType === 'dorm' ? (
                                <>₹{item.price} x {item.quantity} bed{item.quantity > 1 ? 's' : ''} x {nights} night{nights > 1 ? 's' : ''}</>
                              ) : (
                                <>₹{item.price} x {item.quantity} room{item.quantity > 1 ? 's' : ''} x {nights} night{nights > 1 ? 's' : ''}</>
                              )}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="font-bold text-gray-900 text-sm md:text-base">₹{itemTotal}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Price Breakdown - Compact */}
                <div className="bg-gray-50 rounded-lg p-3 md:p-4 border border-gray-200">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="text-gray-900">₹{totalAmount}</span>
                    </div>
                    {bookingData.couponApplied && discountAmount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount ({bookingData.couponCode || 'XTSY-BASH'}):</span>
                        <span>-₹{discountAmount}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">GST:</span>
                      <span className="text-gray-900">₹{totalGST}</span>
                    </div>
                    <div className="border-t border-gray-300 pt-2 flex justify-between font-bold">
                      <span className="text-gray-900">Total (tax incl.):</span>
                      <span className="text-gray-900">₹{grandTotal}</span>
                    </div>
                    <div className="flex justify-between text-green-600 font-bold">
                      <span>Payable Now (21%):</span>
                      <span>₹{payableNow}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fixed Footer with Action Buttons */}
              <div className="flex-shrink-0 p-3 md:p-6 border-t bg-white">
                <div className="flex flex-col gap-2 md:flex-row md:gap-3">
                  <Button
                    onClick={saveForLater}
                    variant="outline"
                    className="flex-1 border-blue-300 text-blue-600 hover:bg-blue-50 flex items-center justify-center gap-2 h-12 text-sm md:text-base"
                  >
                    <Bookmark className="h-4 w-4" />
                    Save Later
                  </Button>
                  <Button
                    onClick={clearCart}
                    variant="outline"
                    className="flex-1 border-red-300 text-red-600 hover:bg-red-50 flex items-center justify-center gap-2 h-12 text-sm md:text-base"
                  >
                    <Trash2 className="h-4 w-4" />
                    Clear Cart
                  </Button>
                  <Button
                    onClick={proceedToGuestDetails}
                    className="flex-1 md:flex-[2] bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold h-12 text-sm md:text-base"
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CartModal;
