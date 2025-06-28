
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Minus, ShoppingCart, CheckCircle } from "lucide-react";

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
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});

  const roomTypes = [
    {
      id: "8_bed",
      name: "Bed In 8 Bed Mixed Dormitory",
      price: 555,
      capacity: 8,
      type: "Mixed",
      property: "XTSY Travellers Hostel",
      amenities: ["XL Comfy Beds", "Reading lights", "Charging point", "Attached Bathroom", "High speed Wi-Fi", "Hot Water", "Locker", "Balcony", "Toiletries"],
      availability: 1,
      totalGuests: 8,
    },
    {
      id: "6_bed",
      name: "Bed In 6 Bed Female/Mixed Dormitory",
      price: 666,
      capacity: 6,
      type: "Female/Mixed",
      property: "XTSY Travellers Hostel",
      amenities: ["XL Comfy Beds", "Reading lights", "Charging point", "Attached Bathroom", "High speed Wi-Fi", "Hot Water", "Locker", "Balcony", "Toiletries"],
      availability: 5,
      totalGuests: 30,
    },
    {
      id: "4_bed_mixed",
      name: "Bed In 4 Bed Female/Mixed Dormitory",
      price: 777,
      capacity: 4,
      type: "Female/Mixed",
      property: "XTSY Travellers Hostel",
      amenities: ["XL Comfy Beds", "Reading lights", "Charging point", "Attached Bathroom", "High speed Wi-Fi", "Hot Water", "Locker", "Balcony", "Toiletries"],
      availability: 1,
      totalGuests: 4,
    },
    {
      id: "4_bed_female",
      name: "Bed In 4 Bed Female Dormitory",
      price: 888,
      capacity: 4,
      type: "Female Only",
      property: "XTSY Travellers Hostel",
      amenities: ["XL Comfy Beds", "Reading lights", "Charging point", "Attached Bathroom", "High speed Wi-Fi", "Hot Water", "Locker", "Balcony", "Toiletries"],
      availability: 1,
      totalGuests: 4,
    },
    {
      id: "king_double",
      name: "King Double Room",
      price: 3333,
      capacity: 2,
      type: "Private",
      property: "XTSY Luxury",
      amenities: ["Charging point", "Attached Bathroom", "High speed Wi-Fi", "Privacy", "Hot Water", "Mountain View", "River View (Seasonal)", "Kettle", "Toiletries", "Seating Area"],
      availability: 2,
      totalGuests: 2,
    },
    {
      id: "king_triple",
      name: "King Triple Room",
      price: 4444,
      capacity: 3,
      type: "Private",
      property: "XTSY Luxury",
      amenities: ["Charging point", "Attached Bathroom", "High speed Wi-Fi", "Privacy", "Hot Water", "Mountain View", "River View (Seasonal)", "Kettle", "Toiletries", "Seating Area"],
      availability: 1,
      totalGuests: 3,
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

    // Show visual feedback
    setAddedItems(prev => ({ ...prev, [room.id]: true }));
    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [room.id]: false }));
    }, 2000);
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
    
    // Show success feedback
    alert("Booking saved to cart successfully!");
  };

  const proceedToCheckout = () => {
    saveToCart();
    setTimeout(() => {
      alert("Proceeding to payment gateway...");
    }, 500);
  };

  const totalAmount = bookingItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const advanceAmount = Math.round(totalAmount * 0.22);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto backdrop-blur-xl bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 border border-white/20 text-white mx-2 sm:mx-4">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold text-center bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent font-serif-sans">
            Select Your Rooms
          </DialogTitle>
          <DialogDescription className="text-gray-400 text-center font-seasons text-sm sm:text-base">
            Check-in: {checkIn} | Check-out: {checkOut} | Guests: {guests}
          </DialogDescription>
        </DialogHeader>

        {/* Property Groups */}
        <div className="space-y-6 sm:space-y-8">
          {/* XTSY Travellers Hostel */}
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 font-serif-sans">XTSY Travellers Hostel</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
              {roomTypes.filter(room => room.property === "XTSY Travellers Hostel").map((room) => (
                <Card key={room.id} className="backdrop-blur-lg bg-white/10 border border-white/20 transition-all duration-300 hover:bg-white/15">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base sm:text-lg text-white font-serif-sans">{room.name}</CardTitle>
                    <CardDescription className="text-gray-300 font-seasons text-sm">
                      {room.type} • {room.capacity} guests • ₹{room.price}/night
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-1">
                      {room.amenities.slice(0, 4).map((amenity, i) => (
                        <Badge key={i} variant="outline" className="border-white/20 text-gray-300 text-xs font-seasons">
                          {amenity}
                        </Badge>
                      ))}
                      {room.amenities.length > 4 && (
                        <Badge variant="outline" className="border-white/20 text-gray-300 text-xs font-seasons">
                          +{room.amenities.length - 4} more
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="bg-teal-500/20 text-teal-300 font-seasons text-xs">
                        {room.availability} room(s) - {room.totalGuests} guests
                      </Badge>
                      <Button
                        onClick={() => addRoom(room)}
                        size="sm"
                        className={`transition-all duration-300 transform font-seasons text-xs sm:text-sm ${
                          addedItems[room.id] 
                            ? "bg-green-500 hover:bg-green-600 scale-110" 
                            : "bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 hover:scale-105"
                        }`}
                      >
                        {addedItems[room.id] ? (
                          <>
                            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            Added!
                          </>
                        ) : (
                          "Add Bed"
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* XTSY Luxury */}
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 font-serif-sans">XTSY Luxury</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
              {roomTypes.filter(room => room.property === "XTSY Luxury").map((room) => (
                <Card key={room.id} className="backdrop-blur-lg bg-white/10 border border-white/20 transition-all duration-300 hover:bg-white/15">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base sm:text-lg text-white font-serif-sans">{room.name}</CardTitle>
                    <CardDescription className="text-gray-300 font-seasons text-sm">
                      {room.type} • {room.capacity} guests • ₹{room.price}/night
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-1">
                      {room.amenities.slice(0, 4).map((amenity, i) => (
                        <Badge key={i} variant="outline" className="border-white/20 text-gray-300 text-xs font-seasons">
                          {amenity}
                        </Badge>
                      ))}
                      {room.amenities.length > 4 && (
                        <Badge variant="outline" className="border-white/20 text-gray-300 text-xs font-seasons">
                          +{room.amenities.length - 4} more
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="bg-teal-500/20 text-teal-300 font-seasons text-xs">
                        {room.availability} available
                      </Badge>
                      <Button
                        onClick={() => addRoom(room)}
                        size="sm"
                        className={`transition-all duration-300 transform font-seasons text-xs sm:text-sm ${
                          addedItems[room.id] 
                            ? "bg-green-500 hover:bg-green-600 scale-110" 
                            : "bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 hover:scale-105"
                        }`}
                      >
                        {addedItems[room.id] ? (
                          <>
                            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            Added!
                          </>
                        ) : (
                          "Add Room"
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {bookingItems.length > 0 && (
          <div className="bg-white/10 rounded-lg p-4 sm:p-6 mb-4 backdrop-blur-lg border border-white/20">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2 font-serif-sans">
              <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
              Your Booking Summary
            </h3>
            <div className="space-y-2 sm:space-y-3">
              {bookingItems.map((item) => (
                <div key={item.roomId} className="flex items-center justify-between bg-white/5 rounded-lg p-3 sm:p-4 backdrop-blur-sm">
                  <div className="flex-1 min-w-0 mr-3">
                    <p className="text-white font-medium font-seasons text-sm sm:text-base truncate">{item.roomName}</p>
                    <p className="text-gray-400 text-xs sm:text-sm font-seasons">₹{item.price} x {item.quantity} room(s)</p>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateQuantity(item.roomId, -1)}
                      className="border-white/20 text-white hover:bg-white/10 transition-all duration-200 h-8 w-8 p-0"
                    >
                      <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                    <span className="text-white min-w-[2rem] text-center font-bold text-sm">{item.quantity}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateQuantity(item.roomId, 1)}
                      className="border-white/20 text-white hover:bg-white/10 transition-all duration-200 h-8 w-8 p-0"
                    >
                      <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeRoom(item.roomId)}
                      className="ml-1 sm:ml-2 transition-all duration-200 hover:scale-105 text-xs"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-white/20 pt-3 sm:pt-4 mt-3 sm:mt-4">
              <div className="flex justify-between text-base sm:text-lg font-bold text-white font-serif-sans">
                <span>Total Amount:</span>
                <span>₹{totalAmount}</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm text-gray-400 font-seasons">
                <span>Advance Payment (22%):</span>
                <span>₹{advanceAmount}</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4 sm:mt-6">
              <Button
                onClick={saveToCart}
                variant="outline"
                className="flex-1 border-white/40 text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-105 font-seasons bg-white/5 border-2"
              >
                Save for Later
              </Button>
              <Button
                onClick={proceedToCheckout}
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 transition-all duration-300 hover:scale-105 font-seasons shadow-lg"
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
