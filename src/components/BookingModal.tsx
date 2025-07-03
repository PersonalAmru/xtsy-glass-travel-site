import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  checkIn: string;
  checkOut: string;
  guests: number;
}

const BookingModal = ({ isOpen, onClose, checkIn, checkOut, guests }: BookingModalProps) => {
  const [selectedRooms, setSelectedRooms] = useState<{ [key: string]: number }>({});

  // Mock room data - this should come from your actual data source
  const rooms = [
    {
      id: 'xtsy-travellers-hostel',
      name: 'XTSY Travellers Hostel',
      price: 1500,
      image: '', // Ready for Supabase URL
      amenities: ['Free WiFi', 'Shared Kitchen', 'Common Area', 'Lockers'],
      description: 'Budget-friendly hostel with shared facilities'
    },
    {
      id: 'xtsy-luxury',
      name: 'XTSY Luxury',
      price: 3500,
      image: '', // Ready for Supabase URL
      amenities: ['Private Bathroom', 'AC', 'Room Service', 'Balcony'],
      description: 'Luxury accommodation with premium amenities'
    }
  ];

  const handleRoomQuantityChange = (roomId: string, quantity: number) => {
    setSelectedRooms(prev => ({
      ...prev,
      [roomId]: quantity
    }));
  };

  const addToCart = () => {
    const selectedItems = rooms
      .filter(room => selectedRooms[room.id] > 0)
      .map(room => ({
        roomId: room.id,
        roomName: room.name,
        price: room.price,
        quantity: selectedRooms[room.id],
        guests: guests
      }));

    if (selectedItems.length === 0) {
      alert("Please select at least one room");
      return;
    }

    const bookingData = {
      checkIn,
      checkOut,
      guests,
      items: selectedItems,
      timestamp: new Date().getTime()
    };

    localStorage.setItem('xtsy_booking_cart', JSON.stringify(bookingData));
    alert("Rooms added to cart!");
    onClose();
  };

  const totalRooms = Object.values(selectedRooms).reduce((sum, qty) => sum + qty, 0);
  const totalAmount = rooms.reduce((sum, room) => {
    const quantity = selectedRooms[room.id] || 0;
    return sum + (room.price * quantity);
  }, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl backdrop-blur-xl bg-white/95 border border-gray-300 text-gray-900 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-gray-900">
            Select Your Rooms
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            Choose from our available accommodations
          </DialogDescription>
        </DialogHeader>

        {/* Booking Info */}
        <div className="bg-gray-100 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Check-in:</span>
              <p className="font-semibold text-gray-900">{checkIn}</p>
            </div>
            <div>
              <span className="text-gray-600">Check-out:</span>
              <p className="font-semibold text-gray-900">{checkOut}</p>
            </div>
            <div>
              <span className="text-gray-600">Guests:</span>
              <p className="font-semibold text-gray-900">{guests}</p>
            </div>
            <div>
              <span className="text-gray-600">Booking Date:</span>
              <p className="font-semibold text-gray-900">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {rooms.map((room) => (
            <div key={room.id} className="border border-gray-200 rounded-lg p-6 bg-white">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Room Image Placeholder */}
                <div className="w-full md:w-48 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                  {room.image ? (
                    <img src={room.image} alt={room.name} className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <span className="text-gray-500 text-sm">Image Ready for Supabase URL</span>
                  )}
                </div>

                {/* Room Details */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{room.name}</h3>
                  <p className="text-gray-600 mb-3">{room.description}</p>
                  
                  {/* Amenities */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {room.amenities.map((amenity, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {amenity}
                      </span>
                    ))}
                  </div>

                  {/* Price and Quantity */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">₹{room.price}</span>
                      <span className="text-gray-600 text-sm ml-2">per night</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <label className="text-sm font-medium text-gray-700">Quantity:</label>
                      <select
                        value={selectedRooms[room.id] || 0}
                        onChange={(e) => handleRoomQuantityChange(room.id, parseInt(e.target.value))}
                        className="px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                      >
                        {Array.from({length: 6}, (_, i) => (
                          <option key={i} value={i}>{i}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        {totalRooms > 0 && (
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center text-lg font-bold text-gray-900">
              <span>Total ({totalRooms} room{totalRooms > 1 ? 's' : ''}):</span>
              <span>₹{totalAmount}</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={addToCart}
            className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
          >
            Add to Cart
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
