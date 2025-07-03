
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Trash2, X } from "lucide-react";
import GuestDetails from "./GuestDetails";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface BookingData {
  checkIn: string;
  checkOut: string;
  guests: number;
  items: Array<{
    roomId: string;
    roomName: string;
    price: number;
    quantity: number;
    guests: number;
  }>;
  timestamp: number;
}

const CartModal = ({ isOpen, onClose }: CartModalProps) => {
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [showGuestDetails, setShowGuestDetails] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const savedData = localStorage.getItem('xtsy_booking_cart');
      if (savedData) {
        setBookingData(JSON.parse(savedData));
      }
    }
  }, [isOpen]);

  const clearCart = () => {
    localStorage.removeItem('xtsy_booking_cart');
    setBookingData(null);
  };

  const proceedToGuestDetails = () => {
    setShowGuestDetails(true);
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

  const totalAmount = bookingData?.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
  const tax = Math.round(totalAmount * 0.12);
  const grandTotal = totalAmount + tax;
  const payableNow = Math.round(grandTotal * 0.21);

  if (showGuestDetails && bookingData) {
    return (
      <GuestDetails
        isOpen={true}
        onClose={() => {
          setShowGuestDetails(false);
          onClose();
        }}
        onBack={() => setShowGuestDetails(false)}
        bookingData={bookingData}
      />
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="fixed left-0 top-0 h-full w-full sm:w-96 max-w-none rounded-none backdrop-blur-xl bg-white/95 border-r border-gray-200 text-gray-900 p-0 data-[state=open]:animate-slide-in-left data-[state=closed]:animate-slide-out-left">
        <div className="flex flex-col h-full">
          {/* Header */}
          <DialogHeader className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <ShoppingCart className="h-6 w-6" />
                Booking Summary
              </DialogTitle>
              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                className="p-2"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </DialogHeader>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {!bookingData || bookingData.items.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">Your cart is empty</p>
                <p className="text-gray-500 text-sm">Add some rooms to get started</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Stay Duration */}
                <div className="bg-orange-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 font-medium">
                    1 night starting from Sat {new Date(bookingData.checkIn).toLocaleDateString('en-GB', { 
                      day: 'numeric', 
                      month: 'short', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>

                {/* Cart saved info */}
                <div className="text-center text-sm text-gray-500">
                  Cart saved {getDaysAgo(bookingData.timestamp)}
                </div>

                {/* Booking Details */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Booking Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Check-in:</span>
                      <span className="text-gray-900 font-medium">{bookingData.checkIn}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Check-out:</span>
                      <span className="text-gray-900 font-medium">{bookingData.checkOut}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Guests:</span>
                      <span className="text-gray-900 font-medium">{bookingData.guests}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Booking Date:</span>
                      <span className="text-gray-900 font-medium">{new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Selected Rooms */}
                <div className="space-y-3">
                  {bookingData.items.map((item, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{item.roomName}</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            ₹{item.price} x {item.quantity} night
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">₹{item.price * item.quantity}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pricing Summary */}
                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="text-gray-900">₹{totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax:</span>
                    <span className="text-gray-900">₹{tax}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span className="text-gray-900">Grand Total (tax incl.):</span>
                    <span className="text-gray-900">₹{grandTotal}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-green-600">
                    <span>Payable Now:</span>
                    <span>₹{payableNow}</span>
                  </div>
                </div>

                {/* Discount Coupon */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Have a discount coupon?</h4>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="px-4 py-2 border-orange-500 text-orange-500 hover:bg-orange-50"
                    >
                      Apply
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    For 18+ guests only. Infants/Kids/Minors not allowed
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          {bookingData && bookingData.items.length > 0 && (
            <div className="border-t border-gray-200 p-6 space-y-3">
              <Button
                onClick={clearCart}
                variant="outline"
                className="w-full border-red-500 text-red-500 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Cart
              </Button>
              <Button
                onClick={proceedToGuestDetails}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
              >
                Book now
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CartModal;
