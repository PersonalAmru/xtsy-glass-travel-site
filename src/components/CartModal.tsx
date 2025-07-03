
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Trash2, Edit } from "lucide-react";

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
    // Here you would navigate to guest details page
    alert("Navigating to guest details page...");
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
  const advanceAmount = Math.round(totalAmount * 0.22);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl backdrop-blur-xl bg-slate-900/95 border border-white/20 text-white slide-in-from-left-full animate-in duration-300 fixed left-0 top-0 h-full rounded-none w-full sm:w-96 sm:max-w-none data-[state=open]:slide-in-from-left-0 data-[state=closed]:slide-out-to-left-0">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent flex items-center justify-center gap-2">
            <ShoppingCart className="h-6 w-6" />
            Your Cart
          </DialogTitle>
        </DialogHeader>

        {!bookingData || bookingData.items.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">Your cart is empty</p>
            <p className="text-gray-500 text-sm">Add some rooms to get started</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Cart saved info */}
            <div className="text-center text-sm text-gray-400">
              Cart saved {getDaysAgo(bookingData.timestamp)}
            </div>

            <div className="bg-white/10 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-2">Booking Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Check-in:</span>
                  <p className="text-white">{bookingData.checkIn}</p>
                </div>
                <div>
                  <span className="text-gray-400">Check-out:</span>
                  <p className="text-white">{bookingData.checkOut}</p>
                </div>
                <div>
                  <span className="text-gray-400">Guests:</span>
                  <p className="text-white">{bookingData.guests}</p>
                </div>
                <div>
                  <span className="text-gray-400">Booking Date:</span>
                  <p className="text-white">{new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white">Selected Rooms</h3>
              {bookingData.items.map((item, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <p className="text-white font-medium">{item.roomName}</p>
                    <p className="text-gray-400 text-sm">
                      ₹{item.price} x {item.quantity} room(s) = ₹{item.price * item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-white/20 pt-4">
              <div className="flex justify-between text-lg font-bold text-white">
                <span>Total Amount:</span>
                <span>₹{totalAmount}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-400">
                <span>Advance Payment (22%):</span>
                <span>₹{advanceAmount}</span>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={clearCart}
                variant="outline"
                className="flex-1 border-red-500/50 text-red-400 hover:bg-red-500/10"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Cart
              </Button>
              <Button
                onClick={proceedToGuestDetails}
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
              >
                Next Step
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CartModal;
