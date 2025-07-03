
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Users, Wifi, Car, Coffee, Shield, Mountain, CreditCard, Tv, Activity } from "lucide-react";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  checkIn: string;
  checkOut: string;
  guests: number;
}

const BookingModal = ({ isOpen, onClose, checkIn, checkOut, guests }: BookingModalProps) => {
  const [selectedRooms, setSelectedRooms] = useState<{ [key: string]: number }>({});
  const [couponCode, setCouponCode] = useState("");

  // Mock room data with more detailed structure
  const rooms = [
    {
      id: 'standard-2-bed-female-dorm',
      name: 'Standard 2 Bed Female Dorm (shared attached washroom)',
      price: 899,
      image: '', // Ready for Supabase URL
      description: 'A bed in a snug female dorm with private lockers and a shared attached washroom.',
      maxGuests: 1,
      amenities: ['Mountain View', 'Card Payment Accepted', 'Cafe', 'Storage Facility', 'Laundry Services (Extra)', 'Free Wi-Fi', 'Common Television', 'Common hangout area', 'In-house Activities', 'Breakfast (Extra)', 'UPI Payment Accepted', 'Parking (private)'],
      availability: {
        'Jul 05': { available: false, price: 0 },
        'Jul 06': { available: false, price: 0 },
        'Jul 07': { available: false, price: 0 },
        'Jul 08': { available: false, price: 0 },
        'Jul 09': { available: true, price: 949, units: 2 },
        'Jul 10': { available: true, price: 949, units: 2 },
        'Jul 11': { available: false, price: 0 },
      }
    },
    {
      id: 'deluxe-room',
      name: 'Deluxe Room',
      price: 3299,
      image: '', // Ready for Supabase URL
      description: 'A snug room with a neat decor offering a private stay experience suitable for two. Comes with a doublebed, a closet, and an attached washroom.',
      maxGuests: 2,
      amenities: ['Mountain View', 'Card Payment Accepted', 'Cafe', 'Storage Facility', 'Laundry Services (Extra)', 'Free Wi-Fi', 'Common Television', 'Common hangout area', 'In-house Activities', 'Breakfast (Extra)', 'UPI Payment Accepted', 'Parking (private)'],
      availability: {
        'Jul 05': { available: true, price: 3299, units: 5 },
        'Jul 06': { available: true, price: 3299, units: 5 },
        'Jul 07': { available: true, price: 3299, units: 5 },
        'Jul 08': { available: true, price: 3299, units: 5 },
        'Jul 09': { available: true, price: 3299, units: 5 },
        'Jul 10': { available: true, price: 3299, units: 5 },
        'Jul 11': { available: true, price: 3299, units: 5 },
      }
    },
    {
      id: 'standard-4-bed-mixed-dorm',
      name: 'Standard 4 Bed Mixed Dorm',
      price: 749,
      image: '', // Ready for Supabase URL
      description: 'A bed in a cosy mixed dorm with private lockers and a shared ensuite.',
      maxGuests: 1,
      amenities: ['Mountain View', 'Card Payment Accepted', 'Cafe', 'Storage Facility', 'Laundry Services (Extra)', 'Free Wi-Fi', 'Common Television', 'Common hangout area', 'In-house Activities', 'Breakfast (Extra)', 'UPI Payment Accepted', 'Parking (private)'],
      availability: {
        'Jul 05': { available: false, price: 0 },
        'Jul 06': { available: true, price: 749, units: 2 },
        'Jul 07': { available: true, price: 749, units: 10 },
        'Jul 08': { available: true, price: 749, units: 12 },
        'Jul 09': { available: true, price: 749, units: 12 },
        'Jul 10': { available: true, price: 749, units: 8 },
        'Jul 11': { available: false, price: 0 },
      }
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

  const selectedRoom = rooms.find(room => selectedRooms[room.id] > 0);
  const totalAmount = selectedRoom ? selectedRoom.price * (selectedRooms[selectedRoom.id] || 0) : 0;
  const tax = Math.round(totalAmount * 0.12);
  const grandTotal = totalAmount + tax;
  const payableNow = Math.round(grandTotal * 0.21);

  const getAvailabilityDates = () => {
    const dates = ['Jul 05', 'Jul 06', 'Jul 07', 'Jul 08', 'Jul 09', 'Jul 10', 'Jul 11'];
    const days = ['SAT', 'SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI'];
    return dates.map((date, index) => ({ date, day: days[index] }));
  };

  const formatDate = (dateStr: string) => {
    const [day, month] = dateStr.split(' ');
    const months = {
      'Jul': 'July'
    };
    return `${day} ${months[month as keyof typeof months] || month}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl h-[90vh] bg-gray-50 border-0 p-0 overflow-hidden">
        <div className="flex h-full">
          {/* Left Panel - Room Selection */}
          <div className="flex-1 overflow-y-auto bg-white">
            <DialogHeader className="sticky top-0 bg-white z-10 p-6 border-b border-gray-200">
              <div className="mb-4">
                <div className="bg-orange-50 rounded-lg p-4 mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Know before you go</h3>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">😊</span>
                      <div>
                        <div className="text-gray-600">Check-in</div>
                        <div className="font-semibold">12:00 PM</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">👋</span>
                      <div>
                        <div className="text-gray-600">Check-out</div>
                        <div className="font-semibold">10:00 AM</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-red-100 text-red-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">18+</div>
                      <div>
                        <div className="text-gray-600">Guest Policy</div>
                        <div className="font-semibold">Only 18+</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">😢</span>
                      <div>
                        <div className="text-gray-600">Kids/Infants</div>
                        <div className="font-semibold">Not allowed</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">Book your stay</DialogTitle>
              <p className="text-gray-600">Select from a range of beautiful rooms</p>
              
              {/* Date Range Display */}
              <div className="flex items-center justify-center bg-gray-100 rounded-lg p-3 mt-4">
                <span className="text-gray-700 font-medium">{formatDate(checkIn)} → {formatDate(checkOut)}</span>
              </div>
            </DialogHeader>

            <div className="p-6 space-y-8">
              {rooms.map((room) => (
                <div key={room.id} className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                  <div className="flex">
                    {/* Room Image */}
                    <div className="w-64 h-48 bg-gray-200 flex items-center justify-center">
                      {room.image ? (
                        <img src={room.image} alt={room.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-gray-500 text-sm">Room Image</span>
                      )}
                    </div>

                    {/* Room Details */}
                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">{room.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <Users className="h-4 w-4" />
                            <span>x {room.maxGuests}</span>
                          </div>
                          <div className="flex items-center gap-1 text-lg font-bold text-gray-900">
                            <span>₹{room.price}</span>
                            <span className="text-sm font-normal text-gray-500">/ night</span>
                          </div>
                        </div>
                        
                        {selectedRooms[room.id] > 0 ? (
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={() => handleRoomQuantityChange(room.id, Math.max(0, (selectedRooms[room.id] || 0) - 1))}
                              variant="outline"
                              size="sm"
                              className="w-8 h-8 p-0 border-orange-300 text-orange-600 hover:bg-orange-50"
                            >
                              -
                            </Button>
                            <span className="w-8 text-center font-semibold">{selectedRooms[room.id]}</span>
                            <Button
                              onClick={() => handleRoomQuantityChange(room.id, (selectedRooms[room.id] || 0) + 1)}
                              variant="outline"
                              size="sm"
                              className="w-8 h-8 p-0 border-orange-300 text-orange-600 hover:bg-orange-50"
                            >
                              +
                            </Button>
                          </div>
                        ) : (
                          <Button
                            onClick={() => handleRoomQuantityChange(room.id, 1)}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-6"
                          >
                            Select Room
                          </Button>
                        )}
                      </div>

                      <p className="text-gray-600 text-sm mb-4">{room.description}</p>

                      {/* Amenity Icons */}
                      <div className="flex gap-3 mb-4">
                        <Mountain className="h-5 w-5 text-gray-400" title="Mountain View" />
                        <CreditCard className="h-5 w-5 text-gray-400" title="Card Payment" />
                        <Coffee className="h-5 w-5 text-gray-400" title="Cafe" />
                        <Wifi className="h-5 w-5 text-gray-400" title="Free Wi-Fi" />
                        <Tv className="h-5 w-5 text-gray-400" title="Television" />
                        <Activity className="h-5 w-5 text-gray-400" title="Activities" />
                        <Shield className="h-5 w-5 text-gray-400" title="Storage" />
                        <Car className="h-5 w-5 text-gray-400" title="Parking" />
                      </div>

                      {/* Availability Calendar */}
                      <div className="border-t border-gray-200 pt-4">
                        <div className="flex items-center justify-between">
                          <button className="text-orange-500 text-sm font-medium flex items-center gap-1">
                            Availability calendar ⌄
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-7 gap-2 mt-3 text-center text-xs">
                          {getAvailabilityDates().map(({ date, day }) => {
                            const availability = room.availability[date];
                            return (
                              <div key={date} className="p-2">
                                <div className="font-medium text-gray-600">{day}</div>
                                <div className="text-gray-500 mb-1">{date}</div>
                                {availability?.available ? (
                                  <div>
                                    <div className="text-green-600 font-bold">₹{availability.price}</div>
                                    <div className="text-gray-500">{availability.units} units</div>
                                  </div>
                                ) : (
                                  <div>
                                    <div className="text-gray-400">✗</div>
                                    <div className="text-gray-400">No units</div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Amenities Section */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Amenities</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { icon: Mountain, label: 'Mountain View' },
                    { icon: CreditCard, label: 'Card Payment Accepted' },
                    { icon: Coffee, label: 'Cafe' },
                    { icon: Shield, label: 'Storage Facility' },
                    { icon: Activity, label: 'Laundry Services (Extra)' },
                    { icon: Wifi, label: 'Free Wi-Fi' },
                    { icon: Tv, label: 'Common Television' },
                    { icon: Users, label: 'Common hangout area' },
                    { icon: Car, label: 'Parking (private)' }
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-gray-600" />
                      <span className="text-gray-700 text-sm">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Section */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Us</h3>
                <div className="flex gap-6">
                  <Button variant="outline" className="flex items-center gap-2 text-orange-600 border-orange-300 hover:bg-orange-50">
                    📞 Call the Property
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2 text-green-600 border-green-300 hover:bg-green-50">
                    💬 WhatsApp Us
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Booking Summary (Fixed) */}
          <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-gray-900">Booking <span className="text-orange-500">Summary</span></h3>
                <div className="flex items-center gap-1">
                  <span className="text-lg font-bold">INR</span>
                  <button className="text-gray-400">⌄</button>
                </div>
              </div>
              <p className="text-sm text-gray-600">1 night starting from {formatDate(checkIn)}</p>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {selectedRoom && selectedRooms[selectedRoom.id] > 0 ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{selectedRoom.name}</h4>
                      <div className="text-sm text-gray-600">
                        ₹{selectedRoom.price} x {selectedRooms[selectedRoom.id]} night
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">₹{totalAmount}</div>
                      <button className="text-gray-400 text-sm">🗑</button>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Tax</span>
                      <span>₹{tax}</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>Grand Total (tax incl.)</span>
                      <span>₹{grandTotal}</span>
                    </div>
                    <div className="flex justify-between text-green-600 font-bold">
                      <span>Payable Now</span>
                      <span>₹{payableNow}</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <p className="font-medium text-gray-900 mb-3">Have a discount coupon?</p>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1"
                      />
                      <Button variant="outline" className="border-orange-300 text-orange-600 hover:bg-orange-50">
                        Apply
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">For 18+ guests only. Infants/Kids/Minors not allowed</p>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <p>Select a room to see booking summary</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200">
              <Button
                onClick={addToCart}
                disabled={!selectedRoom || selectedRooms[selectedRoom?.id] === 0}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 font-semibold"
              >
                Book now
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
