
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Minus, ShoppingCart } from "lucide-react";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  checkIn: string;
  checkOut: string;
  guests: number;
}

interface BookingItem {
  roomId: string;
  roomName: string;
  price: number;
  quantity: number;
  guests: number;
}

const BookingModal = ({ isOpen, onClose, checkIn, checkOut, guests }: BookingModalProps) => {
  const [bookingItems, setBookingItems] = useState<BookingItem[]>([]);

  const roomTypes = [
    {
      id: "8_bed",
      name: "8 Bed Mixed Only Dormitory",
      price: 555,
      capacity: 8,
      type: "Mixed",
      amenities: ["Free WiFi", "AC", "Lockers", "Common Area"],
      availability: 3,
    },
    {
      id: "6_bed",
      name: "6 Bed Female/Mixed Dormitory",
      price: 666,
      capacity: 6,
      type: "Female/Mixed",
      amenities: ["Free WiFi", "AC", "Lockers", "Private Bathroom"],
      availability: 2,
    },
    {
      id: "4_bed_mixed",
      name: "4 Bed Female/Mixed Dormitory",
      price: 777,
      capacity: 4,
      type: "Female/Mixed",
      amenities: ["Free WiFi", "AC", "Lockers", "Premium Bedding"],
      availability: 1,
    },
    {
      id: "4_bed_female",
      name: "4 Bed Female Only Dormitory",
      price: 888,
      capacity: 4,
      type: "Female Only",
      amenities: ["Free WiFi", "AC", "Lockers", "Premium Bedding", "Privacy"],
      availability: 2,
    },
    {
      id: "king_double",
      name: "King Double Room",
      price: 3333,
      capacity: 2,
      type: "Private",
      amenities: ["King Bed", "Private Bathroom", "AC", "Mini Fridge", "Balcony"],
      availability: 2,
    },
    {
      id: "king_triple",
      name: "King Triple Room",
      price: 4444,
      capacity: 3,
      type: "Private",
      amenities: ["King Bed", "Single Bed", "Private Bathroom", "AC", "Sea View"],
      availability: 1,
    }
  ];

  const addRoom = (room: typeof roomTypes[0]) => {
    setBookingItems(prev => {
      const existing = prev.find(item => item.roomId === room.id);
      if (existing) {
        return prev.map(item => 
          item.roomId === room.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, {
        roomId: room.id,
        roomName: room.name,
        price: room.price,
        quantity: 1,
        guests: Math.min(room.capacity, guests)
      }];
    });
  };

  const removeRoom = (roomId: string) => {
    setBookingItems(prev => prev.filter(item => item.roomId !== roomId));
  };

  const updateQuantity = (roomId: string, change: number) => {
    setBookingItems(prev => 
      prev.map(item => {
        if (item.roomId === roomId) {
          const newQuantity = Math.max(0, item.quantity + change);
          return newQuantity === 0 ? null : { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(Boolean) as BookingItem[]
    );
  };

  const saveToCart = () => {
    const bookingData = {
      checkIn,
      checkOut,
      guests,
      items: bookingItems,
      timestamp: Date.now()
    };
    localStorage.setItem('xtsy_booking_cart', JSON.stringify(bookingData));
  };

  const proceedToCheckout = () => {
    saveToCart();
    // Here you would integrate with your payment gateway
    alert("Proceeding to payment gateway...");
  };

  const totalAmount = bookingItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const advanceAmount = Math.round(totalAmount * 0.22);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto backdrop-blur-xl bg-slate-900/95 border border-white/20 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
            Select Your Rooms
          </DialogTitle>
          <DialogDescription className="text-gray-400 text-center">
            Check-in: {checkIn} | Check-out: {checkOut} | Guests: {guests}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {roomTypes.map((room) => (
            <Card key={room.id} className="backdrop-blur-lg bg-white/10 border border-white/20">
              <CardHeader>
                <CardTitle className="text-lg text-white">{room.name}</CardTitle>
                <CardDescription className="text-gray-300">
                  {room.type} • {room.capacity} guests • ₹{room.price}/night
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1 mb-4">
                  {room.amenities.map((amenity, i) => (
                    <Badge key={i} variant="outline" className="border-white/20 text-gray-300 text-xs">
                      {amenity}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="bg-teal-500/20 text-teal-300">
                    {room.availability} available
                  </Badge>
                  <Button
                    onClick={() => addRoom(room)}
                    className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700"
                  >
                    Add Room
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {bookingItems.length > 0 && (
          <div className="bg-white/10 rounded-lg p-4 mb-4">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Your Booking Summary
            </h3>
            <div className="space-y-3">
              {bookingItems.map((item) => (
                <div key={item.roomId} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                  <div>
                    <p className="text-white font-medium">{item.roomName}</p>
                    <p className="text-gray-400 text-sm">₹{item.price} x {item.quantity} room(s)</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateQuantity(item.roomId, -1)}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-white min-w-[2rem] text-center">{item.quantity}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateQuantity(item.roomId, 1)}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeRoom(item.roomId)}
                      className="ml-2"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-white/20 pt-4 mt-4">
              <div className="flex justify-between text-lg font-bold text-white">
                <span>Total Amount:</span>
                <span>₹{totalAmount}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-400">
                <span>Advance Payment (22%):</span>
                <span>₹{advanceAmount}</span>
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <Button
                onClick={saveToCart}
                variant="outline"
                className="flex-1 border-white/20 text-white hover:bg-white/10"
              >
                Save for Later
              </Button>
              <Button
                onClick={proceedToCheckout}
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
              >
                Proceed to Checkout
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
