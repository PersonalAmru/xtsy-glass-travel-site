
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
}

const CartModal = ({ isOpen, onClose }: CartModalProps) => {
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [showGuestDetails, setShowGuestDetails] = useState(false);

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
        setBookingData(parsedData);
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

  // Calculate total with proper pricing logic
  const totalAmount = bookingData?.items.reduce((sum, item) => {
    let itemTotal = 0;
    const nights = item.nights || bookingData.nights || 1;
    
    if (item.roomType === 'dorm') {
      // For dorms: price per person per night
      itemTotal = item.price * item.quantity * (item.guests || bookingData.guests) * nights;
    } else {
      // For luxury rooms: price per room per night
      itemTotal = item.price * item.quantity * nights;
    }
    
    return sum + itemTotal;
  }, 0) || 0;
  
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
          guests: bookingData.guests,
          nights: bookingData.nights || 1
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

            {/* Booking Summary - Fixed date display */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Check-in:</span>
                  <span className="text-gray-900 font-medium">{formatDate(bookingData.checkIn)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Check-out:</span>
                  <span className="text-gray-900 font-medium">{formatDate(bookingData.checkOut)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Nights:</span>
                  <span className="text-gray-900 font-medium">{bookingData.nights || 1}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Guests:</span>
                  <span className="text-gray-900 font-medium">{bookingData.guests}</span>
                </div>
              </div>
            </div>

            {/* Selected Rooms - Fixed pricing calculations */}
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
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{item.roomName}</h4>
                        <p className="text-gray-600 text-sm">
                          {item.roomType === 'dorm' ? (
                            <>₹{item.price} x {item.quantity} x {item.guests || bookingData.guests} guest{(item.guests || bookingData.guests) > 1 ? 's' : ''} x {nights} night{nights > 1 ? 's' : ''}</>
                          ) : (
                            <>₹{item.price} x {item.quantity} room{item.quantity > 1 ? 's' : ''} x {nights} night{nights > 1 ? 's' : ''}</>
                          )}
                        </p>
                      </div>
                      <div className="text-right">
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
