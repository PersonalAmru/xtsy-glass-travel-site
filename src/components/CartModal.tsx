
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Trash2 } from "lucide-react";
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
        bookingData={{
          checkIn: bookingData.checkIn,
          checkOut: bookingData.checkOut,
          guests: bookingData.guests
        }}
      />
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-white border border-gray-200 text-gray-900 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-gray-900 flex items-center justify-center gap-2">
            <ShoppingCart className="h-6 w-6 text-orange-500" />
            Your Cart
          </DialogTitle>
        </DialogHeader>

        {!bookingData || bookingData.items.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Your cart is empty</p>
            <p className="text-gray-500 text-sm">Add some rooms to get started</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Cart saved info */}
            <div className="text-center text-sm text-gray-500">
              Cart saved {getDaysAgo(bookingData.timestamp)}
            </div>

            {/* Booking Summary */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
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
              </div>
            </div>

            {/* Selected Rooms */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Selected Rooms</h3>
              {bookingData.items.map((item, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{item.roomName}</h4>
                      <p className="text-gray-600 text-sm">
                        ₹{item.price} x {item.quantity} room(s)
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">₹{item.price * item.quantity}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="text-gray-900">₹{totalAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (12%):</span>
                  <span className="text-gray-900">₹{tax}</span>
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

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                onClick={clearCart}
                variant="outline"
                className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Cart
              </Button>
              <Button
                onClick={proceedToGuestDetails}
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
              >
                Book Now
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CartModal;
