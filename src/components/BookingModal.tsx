
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, Wifi, Car, Coffee, Shield, Mountain, CreditCard, Tv, Activity } from "lucide-react";
import GuestDetails from "./GuestDetails";

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
  const [showGuestDetails, setShowGuestDetails] = useState(false);

  // Calculate number of nights
  const calculateNights = (checkInDate: string, checkOutDate: string) => {
    if (!checkInDate || !checkOutDate || checkInDate === 'undefined' || checkOutDate === 'undefined') {
      return 1;
    }
    try {
      const checkInObj = new Date(checkInDate);
      const checkOutObj = new Date(checkOutDate);
      if (isNaN(checkInObj.getTime()) || isNaN(checkOutObj.getTime())) {
        return 1;
      }
      const timeDiff = checkOutObj.getTime() - checkInObj.getTime();
      const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
      return nights > 0 ? nights : 1;
    } catch {
      return 1;
    }
  };

  const nights = calculateNights(checkIn, checkOut);

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

  // Complete room inventory and data for both properties
  const rooms = [
    // XTSY Travellers Hostel
    {
      id: '4-bed-female-only-dorm',
      name: '4 Bed Female Only Dorms',
      price: 850,
      image: '',
      description: 'A bed in a female-only dorm with private lockers and a shared attached washroom.',
      maxGuests: 1,
      inventory: 4, // 4 beds available
      roomType: 'dorm',
      propertyName: 'XTSY Travellers Hostel',
      amenities: ['Mountain View', 'Card Payment Accepted', 'Cafe', 'Storage Facility', 'Laundry Services (Extra)', 'Free Wi-Fi', 'Common Television', 'Common hangout area', 'In-house Activities', 'Breakfast (Extra)', 'UPI Payment Accepted', 'Parking (private)'],
      availability: {
        'Jul 05': { available: true, price: 850, units: 4 },
        'Jul 06': { available: true, price: 850, units: 4 },
        'Jul 07': { available: true, price: 850, units: 4 },
        'Jul 08': { available: true, price: 850, units: 4 },
        'Jul 09': { available: true, price: 850, units: 2 },
        'Jul 10': { available: true, price: 850, units: 2 },
        'Jul 11': { available: false, price: 0 },
      }
    },
    {
      id: '4-bed-mixed-female-dorm',
      name: '4 Bed Mixed/Female Dorms',
      price: 800,
      image: '',
      description: 'A bed in a mixed or female dorm with private lockers and a shared attached washroom.',
      maxGuests: 1,
      inventory: 4,
      roomType: 'dorm',
      propertyName: 'XTSY Travellers Hostel',
      amenities: ['Mountain View', 'Card Payment Accepted', 'Cafe', 'Storage Facility', 'Laundry Services (Extra)', 'Free Wi-Fi', 'Common Television', 'Common hangout area', 'In-house Activities', 'Breakfast (Extra)', 'UPI Payment Accepted', 'Parking (private)'],
      availability: {
        'Jul 05': { available: true, price: 800, units: 4 },
        'Jul 06': { available: true, price: 800, units: 4 },
        'Jul 07': { available: true, price: 800, units: 4 },
        'Jul 08': { available: true, price: 800, units: 4 },
        'Jul 09': { available: true, price: 800, units: 4 },
        'Jul 10': { available: true, price: 800, units: 4 },
        'Jul 11': { available: true, price: 800, units: 4 },
      }
    },
    {
      id: '6-bed-mixed-female-dorm',
      name: '6 Bed Mixed/Female Dorms',
      price: 700,
      image: '',
      description: 'A bed in a spacious mixed or female dorm with private lockers and a shared ensuite.',
      maxGuests: 1,
      inventory: 30,
      roomType: 'dorm',
      propertyName: 'XTSY Travellers Hostel',
      amenities: ['Mountain View', 'Card Payment Accepted', 'Cafe', 'Storage Facility', 'Laundry Services (Extra)', 'Free Wi-Fi', 'Common Television', 'Common hangout area', 'In-house Activities', 'Breakfast (Extra)', 'UPI Payment Accepted', 'Parking (private)'],
      availability: {
        'Jul 05': { available: false, price: 0 },
        'Jul 06': { available: true, price: 700, units: 28 },
        'Jul 07': { available: true, price: 700, units: 30 },
        'Jul 08': { available: true, price: 700, units: 30 },
        'Jul 09': { available: true, price: 700, units: 30 },
        'Jul 10': { available: true, price: 700, units: 28 },
        'Jul 11': { available: false, price: 0 },
      }
    },
    {
      id: '8-bed-mixed-dorm',
      name: '8 Bed Mixed Dorms',
      price: 600,
      image: '',
      description: 'A bed in a large mixed dormitory perfect for budget travelers.',
      maxGuests: 1,
      inventory: 8,
      roomType: 'dorm',
      propertyName: 'XTSY Travellers Hostel',
      amenities: ['Mountain View', 'Card Payment Accepted', 'Cafe', 'Storage Facility', 'Laundry Services (Extra)', 'Free Wi-Fi', 'Common Television', 'Common hangout area', 'In-house Activities', 'Breakfast (Extra)', 'UPI Payment Accepted', 'Parking (private)'],
      availability: {
        'Jul 05': { available: true, price: 600, units: 8 },
        'Jul 06': { available: true, price: 600, units: 8 },
        'Jul 07': { available: true, price: 600, units: 8 },
        'Jul 08': { available: true, price: 600, units: 8 },
        'Jul 09': { available: true, price: 600, units: 8 },
        'Jul 10': { available: true, price: 600, units: 8 },
        'Jul 11': { available: true, price: 600, units: 8 },
      }
    },
    // XTSY Luxury
    {
      id: 'king-double-room',
      name: 'King Double Room',
      price: 3200,
      image: '',
      description: 'A spacious room with a king bed offering a private stay experience suitable for two guests.',
      maxGuests: 2,
      inventory: 2,
      roomType: 'luxury',
      propertyName: 'XTSY Luxury',
      amenities: ['Mountain View', 'Card Payment Accepted', 'Cafe', 'Storage Facility', 'Laundry Services (Extra)', 'Free Wi-Fi', 'Common Television', 'Common hangout area', 'In-house Activities', 'Breakfast (Extra)', 'UPI Payment Accepted', 'Parking (private)'],
      availability: {
        'Jul 05': { available: true, price: 3200, units: 2 },
        'Jul 06': { available: true, price: 3200, units: 2 },
        'Jul 07': { available: true, price: 3200, units: 2 },
        'Jul 08': { available: true, price: 3200, units: 2 },
        'Jul 09': { available: true, price: 3200, units: 2 },
        'Jul 10': { available: true, price: 3200, units: 2 },
        'Jul 11': { available: true, price: 3200, units: 2 },
      }
    },
    {
      id: 'king-triple-room',
      name: 'King Triple Room',
      price: 4200,
      image: '',
      description: 'A luxurious room with king bed and extra bed accommodating up to three guests.',
      maxGuests: 3,
      inventory: 1,
      roomType: 'luxury',
      propertyName: 'XTSY Luxury',
      amenities: ['Mountain View', 'Card Payment Accepted', 'Cafe', 'Storage Facility', 'Laundry Services (Extra)', 'Free Wi-Fi', 'Common Television', 'Common hangout area', 'In-house Activities', 'Breakfast (Extra)', 'UPI Payment Accepted', 'Parking (private)'],
      availability: {
        'Jul 05': { available: true, price: 4200, units: 1 },
        'Jul 06': { available: true, price: 4200, units: 1 },
        'Jul 07': { available: true, price: 4200, units: 1 },
        'Jul 08': { available: true, price: 4200, units: 1 },
        'Jul 09': { available: true, price: 4200, units: 1 },
        'Jul 10': { available: true, price: 4200, units: 1 },
        'Jul 11': { available: true, price: 4200, units: 1 },
      }
    },
    {
      id: 'sky-glass-suite',
      name: 'Sky Glass Suite',
      price: 18000,
      image: '',
      description: 'Premium suite with panoramic views and luxury amenities.',
      maxGuests: 2,
      inventory: 1,
      roomType: 'luxury',
      propertyName: 'XTSY Luxury',
      amenities: ['Mountain View', 'Card Payment Accepted', 'Cafe', 'Storage Facility', 'Laundry Services (Extra)', 'Free Wi-Fi', 'Common Television', 'Common hangout area', 'In-house Activities', 'Breakfast (Extra)', 'UPI Payment Accepted', 'Parking (private)'],
      availability: {
        'Jul 05': { available: true, price: 18000, units: 1 },
        'Jul 06': { available: true, price: 18000, units: 1 },
        'Jul 07': { available: true, price: 18000, units: 1 },
        'Jul 08': { available: true, price: 18000, units: 1 },
        'Jul 09': { available: true, price: 18000, units: 1 },
        'Jul 10': { available: true, price: 18000, units: 1 },
        'Jul 11': { available: true, price: 18000, units: 1 },
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
        guests: guests,
        nights: nights,
        roomType: room.roomType
      }));

    if (selectedItems.length === 0) {
      alert("Please select at least one room");
      return;
    }

    const bookingData = {
      checkIn,
      checkOut,
      guests,
      nights,
      items: selectedItems,
      timestamp: new Date().getTime()
    };

    localStorage.setItem('xtsy_booking_cart', JSON.stringify(bookingData));
    setShowGuestDetails(true);
  };

  // Calculate totals for selected rooms with proper pricing logic and GST
  const calculateTotals = () => {
    let subtotal = 0;
    let totalGST = 0;
    
    rooms.forEach(room => {
      if (selectedRooms[room.id] > 0) {
        let roomTotal = 0;
        if (room.roomType === 'dorm') {
          // For dorms: price per person per night
          roomTotal = room.price * selectedRooms[room.id] * guests * nights;
        } else {
          // For luxury rooms: price per room per night
          roomTotal = room.price * selectedRooms[room.id] * nights;
        }
        subtotal += roomTotal;
        
        // Calculate GST for this room type
        const gstRate = calculateGSTRate(room.price);
        const roomGST = Math.round(roomTotal * gstRate);
        totalGST += roomGST;
      }
    });
    
    const grandTotal = subtotal + totalGST;
    const payableNow = Math.round(grandTotal * 0.21);
    
    return { subtotal, tax: totalGST, grandTotal, payableNow };
  };

  const { subtotal, tax, grandTotal, payableNow } = calculateTotals();

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

  const getAvailabilityDates = () => {
    const dates = ['Jul 05', 'Jul 06', 'Jul 07', 'Jul 08', 'Jul 09', 'Jul 10', 'Jul 11'];
    const days = ['SAT', 'SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI'];
    return dates.map((date, index) => ({ date, day: days[index] }));
  };

  // Group rooms by property
  const groupedRooms = rooms.reduce((acc, room) => {
    if (!acc[room.propertyName]) {
      acc[room.propertyName] = [];
    }
    acc[room.propertyName].push(room);
    return acc;
  }, {} as { [key: string]: typeof rooms });

  if (showGuestDetails) {
    return (
      <GuestDetails
        isOpen={true}
        onClose={() => {
          setShowGuestDetails(false);
          onClose();
        }}
        bookingData={{
          checkIn,
          checkOut,
          guests,
          nights
        }}
      />
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] bg-gray-50 border-0 p-0 overflow-hidden">
        <div className="flex h-full max-h-[95vh]">
          {/* Left Panel - Room Selection */}
          <div className="flex-1 flex flex-col bg-white">
            {/* Fixed Header */}
            <DialogHeader className="flex-shrink-0 bg-white z-10 p-6 border-b border-gray-200">
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
              
              {/* Date Range Display - Fixed */}
              <div className="flex items-center justify-center bg-blue-100 rounded-lg p-3 mt-4">
                <span className="text-blue-800 font-medium">
                  {formatDate(checkIn)} → {formatDate(checkOut)} ({nights} night{nights > 1 ? 's' : ''})
                </span>
              </div>
            </DialogHeader>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-6 space-y-8">
                  {/* Display rooms grouped by property */}
                  {Object.entries(groupedRooms).map(([propertyName, propertyRooms]) => (
                    <div key={propertyName} className="space-y-6">
                      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg p-4">
                        <h2 className="text-xl font-bold">{propertyName}</h2>
                      </div>
                      
                      {propertyRooms.map((room) => (
                        <div key={room.id} className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex">
                            {/* Room Image */}
                            <div className="w-64 h-48 bg-gray-200 flex items-center justify-center flex-shrink-0">
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
                                    <span>Max {room.maxGuests} guest{room.maxGuests > 1 ? 's' : ''}</span>
                                    <Badge variant="outline" className="ml-2">
                                      {room.roomType === 'dorm' ? 'Per Person' : 'Per Room'}
                                    </Badge>
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
                                <Mountain className="h-5 w-5 text-gray-400" />
                                <CreditCard className="h-5 w-5 text-gray-400" />
                                <Coffee className="h-5 w-5 text-gray-400" />
                                <Wifi className="h-5 w-5 text-gray-400" />
                                <Tv className="h-5 w-5 text-gray-400" />
                                <Activity className="h-5 w-5 text-gray-400" />
                                <Shield className="h-5 w-5 text-gray-400" />
                                <Car className="h-5 w-5 text-gray-400" />
                              </div>

                              {/* Availability Calendar */}
                              <div className="border-t border-gray-200 pt-4">
                                <div className="flex items-center justify-between mb-3">
                                  <h4 className="text-orange-500 text-sm font-medium">Availability Calendar</h4>
                                  <span className="text-xs text-gray-500">
                                    {room.roomType === 'dorm' ? 'Beds' : 'Rooms'} Available
                                  </span>
                                </div>
                                
                                <div className="grid grid-cols-7 gap-2 text-center text-xs">
                                  {getAvailabilityDates().map(({ date, day }) => {
                                    const availability = room.availability[date];
                                    return (
                                      <div key={date} className="p-2 border rounded">
                                        <div className="font-medium text-gray-600">{day}</div>
                                        <div className="text-gray-500 mb-1">{date}</div>
                                        {availability?.available ? (
                                          <div>
                                            <div className="text-green-600 font-bold">₹{availability.price}</div>
                                            <div className="text-gray-500">
                                              {availability.units} {room.roomType === 'dorm' ? 'beds' : 'rooms'}
                                            </div>
                                          </div>
                                        ) : (
                                          <div>
                                            <div className="text-red-400">✗</div>
                                            <div className="text-red-400">Sold out</div>
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
              </ScrollArea>
            </div>
          </div>

          {/* Right Panel - Booking Summary */}
          <div className="w-96 bg-white border-l border-gray-200 flex flex-col max-h-[95vh]">
            <div className="flex-shrink-0 p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-gray-900">Booking <span className="text-orange-500">Summary</span></h3>
                <div className="flex items-center gap-1">
                  <span className="text-lg font-bold">INR</span>
                  <button className="text-gray-400">⌄</button>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                {nights} night{nights > 1 ? 's' : ''} starting from {formatDate(checkIn)}
              </p>
            </div>

            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-6">
                  {Object.keys(selectedRooms).some(roomId => selectedRooms[roomId] > 0) ? (
                    <div className="space-y-4">
                      {rooms
                        .filter(room => selectedRooms[room.id] > 0)
                        .map(room => {
                          let itemTotal = 0;
                          if (room.roomType === 'dorm') {
                            itemTotal = room.price * selectedRooms[room.id] * guests * nights;
                          } else {
                            itemTotal = room.price * selectedRooms[room.id] * nights;
                          }
                          
                          return (
                            <div key={room.id} className="flex justify-between items-start border-b border-gray-100 pb-3">
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 mb-1">{room.name}</h4>
                                <div className="text-sm text-gray-600">
                                  {room.roomType === 'dorm' ? (
                                    <>₹{room.price} x {guests} guest{guests > 1 ? 's' : ''} x {nights} night{nights > 1 ? 's' : ''}</>
                                  ) : (
                                    <>₹{room.price} x {selectedRooms[room.id]} room{selectedRooms[room.id] > 1 ? 's' : ''} x {nights} night{nights > 1 ? 's' : ''}</>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold">₹{itemTotal}</div>
                                <button 
                                  onClick={() => handleRoomQuantityChange(room.id, 0)}
                                  className="text-gray-400 text-sm hover:text-red-500"
                                >
                                  🗑
                                </button>
                              </div>
                            </div>
                          );
                        })}

                      <div className="border-t border-gray-200 pt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Subtotal</span>
                          <span>₹{subtotal}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>GST</span>
                          <span>₹{tax}</span>
                        </div>
                        <div className="flex justify-between font-bold">
                          <span>Grand Total (tax incl.)</span>
                          <span>₹{grandTotal}</span>
                        </div>
                        <div className="flex justify-between text-green-600 font-bold">
                          <span>Payable Now (21%)</span>
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
              </ScrollArea>
            </div>

            <div className="flex-shrink-0 p-6 border-t border-gray-200">
              <Button
                onClick={addToCart}
                disabled={!Object.keys(selectedRooms).some(roomId => selectedRooms[roomId] > 0)}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white py-3 font-semibold"
              >
                Book Now
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
