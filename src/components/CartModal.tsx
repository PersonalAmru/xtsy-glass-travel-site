
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Trash2, Tag, X, ArrowLeft, Clock } from "lucide-react";
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
}

const CartModal = ({ isOpen, onClose }: CartModalProps) => {
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
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

  useEffect(() => {
    if (isOpen) {
      const savedData = localStorage.getItem('xtsy_booking_cart');
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
              return { ...item, price: 18000 };
            }
            return item;
          });
        }
        setBookingData(parsedData);
        setCouponApplied(parsedData.couponApplied || false);
      }
    }
  }, [isOpen]);

  const handleClose = () => {
    if (showGuestDetails && bookingData && bookingData.items.length > 0) {
      // Show exit discount only if trying to close from guest details
      setShowExitDiscount(true);
    } else {
      onClose();
    }
  };

  const applyExitDiscount = () => {
    if (!bookingData) return;
    
    const { subtotal } = calculateTotals();
    const additionalDiscount = Math.round(subtotal * 0.05); // 5% additional discount
    setBonusDiscount(additionalDiscount);
    
    const updatedData = {
      ...bookingData,
      couponApplied: true,
      couponDiscount: (bookingData.couponDiscount || 0) + additionalDiscount
    };
    
    setBookingData(updatedData);
    setCouponApplied(true);
    setShowExitDiscount(false);
    
    localStorage.setItem('xtsy_booking_cart', JSON.stringify(updatedData));
    
    toast({
      title: "Special Discount Applied! 🎉",
      description: `Extra ₹${additionalDiscount} discount added to your booking!`,
    });
  };

  const declineExitDiscount = () => {
    setShowExitDiscount(false);
    onClose();
  };

  const applyCoupon = () => {
    if (!bookingData) return;

    if (couponCode.toUpperCase() === "XTSY-BASH") {
      if (bookingData.guests >= 4) {
        const { subtotal } = calculateTotals();
        const baseDiscount = Math.round(subtotal * 0.1); // 10% discount
        const totalDiscount = baseDiscount + bonusDiscount;
        
        const updatedData = {
          ...bookingData,
          couponApplied: true,
          couponDiscount: totalDiscount
        };
        
        setBookingData(updatedData);
        setCouponApplied(true);
        localStorage.setItem('xtsy_booking_cart', JSON.stringify(updatedData));
        
        toast({
          title: "Coupon Applied!",
          description: `₹${totalDiscount} discount applied successfully!`,
        });
      } else {
        toast({
          title: "Coupon Invalid",
          description: "XTSY-BASH coupon requires minimum 4 guests",
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
      couponDiscount: 0
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

  const clearCart = () => {
    localStorage.removeItem('xtsy_booking_cart');
    setBookingData(null);
    setCouponApplied(false);
    setCouponCode("");
    setBonusDiscount(0);
  };

  const saveForLater = () => {
    if (bookingData) {
      const savedData = {
        ...bookingData,
        savedForLater: true,
        timestamp: new Date().getTime()
      };
      localStorage.setItem('xtsy_saved_booking', JSON.stringify(savedData));
      toast({
        title: "Booking Saved!",
        description: "Your booking has been saved for later. You can access it from the cart.",
      });
    }
    onClose();
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
    
    let subtotal = 0;
    let totalGST = 0;
    
    bookingData.items.forEach(item => {
      let itemTotal = 0;
      const nights = item.nights || bookingData.nights || 1;
      
      if (item.roomType === 'dorm') {
        // For dorms: price per person per night
        itemTotal = item.price * item.quantity * (item.guests || bookingData.guests) * nights;
      } else {
        // For luxury rooms: price per room per night
        itemTotal = item.price * item.quantity * nights;
      }
      
      subtotal += itemTotal;
      
      // Calculate GST for this item
      const gstRate = calculateGSTRate(item.price);
      const itemGST = Math.round(itemTotal * gstRate);
      totalGST += itemGST;
    });
    
    const discountAmount = bookingData.couponApplied ? (bookingData.couponDiscount || 0) : 0;
    const grandTotal = subtotal + totalGST - discountAmount;
    const payableNow = Math.round(grandTotal * 0.21);
    
    return { totalAmount: subtotal, totalGST, grandTotal, payableNow, discountAmount };
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
          nights: bookingData.nights || 1
        }}
      />
    );
  }

  // Exit discount modal
  if (showExitDiscount) {
    return (
      <Dialog open={true} onOpenChange={() => {}}>
        <DialogContent className="max-w-md mx-auto bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold text-gray-900">
              Wait! Don't Miss Out! 🎯
            </DialogTitle>
          </DialogHeader>
          <div className="text-center p-6">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Special Exit Offer!
            </h3>
            <p className="text-gray-700 mb-4">
              Get an additional <span className="font-bold text-orange-600">5% discount</span> on your booking if you complete it now!
            </p>
            <div className="flex gap-3 mt-6">
              <Button
                onClick={applyExitDiscount}
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold"
              >
                Apply & Continue
              </Button>
              <Button
                onClick={declineExitDiscount}
                variant="outline"
                className="flex-1 border-gray-300 text-gray-600"
              >
                No Thanks
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full h-full max-w-none max-h-none md:max-w-4xl md:max-h-[90vh] md:h-auto bg-white border-0 p-0 overflow-hidden">
        {/* Mobile/Tablet Layout */}
        <div className="flex flex-col h-full md:flex-row">
          {/* Header - Mobile Only */}
          <div className="md:hidden flex items-center justify-between p-4 border-b bg-white sticky top-0 z-50">
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

          {/* Main Content */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* Desktop Header */}
            <DialogHeader className="hidden md:block flex-shrink-0 p-6 border-b">
              <DialogTitle className="text-2xl font-bold text-center text-gray-900 flex items-center justify-center gap-2">
                <ShoppingCart className="h-6 w-6 text-orange-500" />
                Your Cart
              </DialogTitle>
            </DialogHeader>

            {!bookingData || bookingData.items.length === 0 ? (
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center">
                  <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg mb-2">Your cart is empty</p>
                  <p className="text-gray-500 text-sm">Add some rooms to get started</p>
                </div>
              </div>
            ) : (
              <>
                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6">
                  {/* Cart saved info */}
                  <div className="text-center text-sm text-gray-500">
                    Cart saved {getDaysAgo(bookingData.timestamp)}
                  </div>

                  {/* Booking Summary */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Check-in:</span>
                        <div className="text-gray-900 font-medium">{formatDate(bookingData.checkIn)}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Check-out:</span>
                        <div className="text-gray-900 font-medium">{formatDate(bookingData.checkOut)}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Nights:</span>
                        <div className="text-gray-900 font-medium">{bookingData.nights || 1}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Guests:</span>
                        <div className="text-gray-900 font-medium">{bookingData.guests}</div>
                      </div>
                    </div>
                  </div>

                  {/* Coupon Section */}
                  <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Tag className="h-5 w-5 text-orange-500" />
                      Apply Coupon
                    </h3>
                    {!couponApplied ? (
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Enter coupon code"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            className="flex-1"
                          />
                          <Button 
                            onClick={applyCoupon}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-4 whitespace-nowrap"
                          >
                            Apply
                          </Button>
                        </div>
                        <p className="text-orange-600 text-xs">
                          Use "XTSY-BASH" for 10% off (min 4 guests)
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between bg-green-100 rounded-lg p-3 border border-green-300">
                        <div>
                          <span className="text-green-800 font-medium">XTSY-BASH Applied!</span>
                          <p className="text-green-700 text-sm">₹{discountAmount} discount</p>
                        </div>
                        <Button 
                          onClick={removeCoupon}
                          variant="outline"
                          size="sm"
                          className="border-green-300 text-green-700 hover:bg-green-50"
                        >
                          Remove
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Selected Rooms */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900">Selected Rooms</h3>
                    {bookingData.items.map((item, index) => {
                      const nights = item.nights || bookingData.nights || 1;
                      let itemTotal = 0;
                      
                      if (item.roomType === 'dorm') {
                        itemTotal = item.price * item.quantity * (item.guests || bookingData.guests) * nights;
                      } else {
                        itemTotal = item.price * item.quantity * nights;
                      }
                      
                      return (
                        <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                          <div className="flex justify-between items-start">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 mb-1 truncate">{item.roomName}</h4>
                              <p className="text-gray-600 text-sm">
                                {item.roomType === 'dorm' ? (
                                  <>₹{item.price} x {item.guests || bookingData.guests} guest{(item.guests || bookingData.guests) > 1 ? 's' : ''} x {nights} night{nights > 1 ? 's' : ''}</>
                                ) : (
                                  <>₹{item.price} x {item.quantity} room{item.quantity > 1 ? 's' : ''} x {nights} night{nights > 1 ? 's' : ''}</>
                                )}
                              </p>
                            </div>
                            <div className="text-right ml-2">
                              <div className="font-bold text-gray-900">₹{itemTotal}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Price Breakdown */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="text-gray-900">₹{totalAmount}</span>
                      </div>
                      {bookingData.couponApplied && discountAmount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount (XTSY-BASH):</span>
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
                <div className="flex-shrink-0 p-4 md:p-6 border-t bg-white">
                  <div className="flex flex-col gap-3 md:flex-row md:gap-4">
                    <Button
                      onClick={saveForLater}
                      variant="outline"
                      className="flex-1 border-blue-300 text-blue-600 hover:bg-blue-50 flex items-center justify-center gap-2"
                    >
                      <Clock className="h-4 w-4" />
                      Save Later
                    </Button>
                    <Button
                      onClick={clearCart}
                      variant="outline"
                      className="flex-1 border-red-300 text-red-600 hover:bg-red-50 flex items-center justify-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Clear Cart
                    </Button>
                    <Button
                      onClick={proceedToGuestDetails}
                      className="flex-1 md:flex-[2] bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold"
                    >
                      Book Now
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CartModal;
