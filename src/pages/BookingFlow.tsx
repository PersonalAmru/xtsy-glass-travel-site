import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Room {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  maxGuests: number;
	maxRooms: number;
  image: string;
  propertyType: "hostel" | "luxury" | "economy";
}

interface BookingDetails {
  roomName: string;
  price: number;
  checkInDate: Date | undefined;
  checkOutDate: Date | undefined;
  guests: number;
  rooms: number;
  features: string[];
}

interface FastRoomCardProps {
  room: Room;
  onSelect: (room: Room) => void;
}

const FastRoomCard: React.FC<FastRoomCardProps> = ({ room, onSelect }) => {
  return (
    <Card className="bg-white shadow-md rounded-lg overflow-hidden">
      <img src={room.image} alt={room.name} className="w-full h-48 object-cover" />
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{room.name}</CardTitle>
        <CardDescription>{room.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">Price: ${room.price}</p>
        <p className="text-gray-600">Max Guests: {room.maxGuests}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={() => onSelect(room)}>Select Room</Button>
      </CardFooter>
    </Card>
  );
};

const BookingFlow = () => {
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [guests, setGuests] = useState<number>(1);
  const [roomsCount, setRoomsCount] = useState<number>(1);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    // Fetch rooms data here
    const fetchRooms = async () => {
      try {
        const response = await fetch('/api/rooms');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setRooms(data);
      } catch (error) {
        console.error("Could not fetch rooms:", error);
        toast({
          title: "Error fetching rooms",
          description: "Failed to load available rooms. Please try again.",
          variant: "destructive",
        });
      }
    };

    fetchRooms();
  }, [toast]);

  const handleRoomSelect = (room: Room) => {
    setSelectedRoom(room);
    toast({
      title: "Room Selected",
      description: `${room.name} has been selected. Continue to confirm your booking.`,
    });
  };

  const handleOpenBookingModal = () => {
    if (!selectedRoom || !date?.from || !date?.to) {
      toast({
        title: "Missing Information",
        description: "Please select a room and check-in/check-out dates to continue.",
        variant: "destructive",
      });
      return;
    }
    setIsBookingModalOpen(true);
  };

  const handleCloseBookingModal = () => {
    setIsBookingModalOpen(false);
  };

  const confirmBooking = () => {
    if (!selectedRoom || !date?.from || !date?.to) {
      toast({
        title: "Booking Failed",
        description: "Missing details. Please ensure all information is provided.",
        variant: "destructive",
      });
      return;
    }

    // Here you would typically send the booking data to your backend
    const bookingDetails: BookingDetails = {
      roomName: selectedRoom.name,
      price: selectedRoom.price,
      checkInDate: date.from,
      checkOutDate: date.to,
      guests: guests,
      rooms: roomsCount,
      features: selectedRoom.features,
    };

    console.log("Booking Details:", bookingDetails);
    toast({
      title: "Booking Confirmed!",
      description: `Your stay at ${selectedRoom.name} from ${format(date.from, 'PPP')} to ${format(date.to, 'PPP')} is confirmed.`,
    });
    setIsBookingModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Updated heading with PropertySection styling */}
        <div className="section-header mb-8">
          <div className="glass-card inline-block px-6 py-4 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg max-w-2xl">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 font-playfair text-center">
              Book Your Perfect Stay
            </h1>
            <p className="text-sm sm:text-base text-gray-600 text-center font-medium">
              Choose from our curated selection of accommodations
            </p>
            <div className="w-16 sm:w-24 h-0.5 bg-gradient-to-r from-orange-500 to-red-600 mx-auto mt-3 rounded-full" />
          </div>
        </div>

        {/* Date Selection Section */}
        <div className="mb-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Select Dates</h2>
          <div className="flex items-center space-x-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={format(date?.from || new Date(), 'PPP')}
                >
                  {date?.from ? (
                    date.to ? (
                      `${format(date.from, "PPP")} - ${format(date.to, "PPP")}`
                    ) : (
                      format(date.from, "PPP")
                    )
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center">
                <Calendar
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                  pagedNavigation
                />
              </PopoverContent>
            </Popover>
            <div>
              <Label htmlFor="guests">Guests</Label>
              <Input
                type="number"
                id="guests"
                defaultValue={1}
                min="1"
                onChange={(e) => setGuests(parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="rooms">Rooms</Label>
              <Input
                type="number"
                id="rooms"
                defaultValue={1}
                min="1"
                onChange={(e) => setRoomsCount(parseInt(e.target.value))}
              />
            </div>
          </div>
        </div>

        {/* Room Selection */}
        {rooms.length > 0 && (
          <>
            {/* XTSY Luxury Section */}
            <div className="mb-12">
              <div className="section-header mb-8">
                <div className="glass-card inline-block px-4 py-3 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg max-w-lg">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1 font-playfair text-center">
                    XTSY Luxury
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 text-center font-medium">
                    Premium accommodations with exclusive amenities
                  </p>
                  <div className="w-12 sm:w-16 h-0.5 bg-gradient-to-r from-orange-500 to-red-600 mx-auto mt-2 rounded-full" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.filter(room => room.propertyType === 'luxury').map((room) => (
                  <FastRoomCard key={room.id} room={room} onSelect={handleRoomSelect} />
                ))}
              </div>
            </div>

            {/* XTSY Travellers Hostel Section */}
            <div className="mb-12">
              <div className="section-header mb-8">
                <div className="glass-card inline-block px-4 py-3 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg max-w-lg">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1 font-playfair text-center">
                    XTSY Travellers Hostel
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 text-center font-medium">
                    Comfortable stays for the modern traveller
                  </p>
                  <div className="w-12 sm:w-16 h-0.5 bg-gradient-to-r from-orange-500 to-red-600 mx-auto mt-2 rounded-full" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.filter(room => room.propertyType === 'hostel').map((room) => (
                  <FastRoomCard key={room.id} room={room} onSelect={handleRoomSelect} />
                ))}
              </div>
            </div>

            {/* XTSY Economy Dorms Section */}
            <div className="mb-12">
              <div className="section-header mb-8">
                <div className="glass-card inline-block px-4 py-3 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg max-w-lg">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1 font-playfair text-center">
                    XTSY Economy Dorms
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 text-center font-medium">
                    Budget-friendly options without compromising comfort
                  </p>
                  <div className="w-12 sm:w-16 h-0.5 bg-gradient-to-r from-orange-500 to-red-600 mx-auto mt-2 rounded-full" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.filter(room => room.propertyType === 'economy').map((room) => (
                  <FastRoomCard key={room.id} room={room} onSelect={handleRoomSelect} />
                ))}
              </div>
            </div>
          </>
        )}

        {/* Booking Summary Section */}
        {selectedRoom && date?.from && date?.to && (
          <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Booking Summary</h2>
            <p>Room: {selectedRoom.name}</p>
            <p>Check-in: {format(date.from, 'PPP')}</p>
            <p>Check-out: {format(date.to, 'PPP')}</p>
            <p>Guests: {guests}</p>
            <p>Rooms: {roomsCount}</p>
            <p>Total Price: ${selectedRoom.price * roomsCount}</p>
            <Button onClick={handleOpenBookingModal}>Confirm Booking</Button>
          </div>
        )}

        {/* Booking Confirmation Modal */}
        <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Confirm Your Booking</DialogTitle>
              <DialogDescription>
                Please review your booking details before confirming.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="roomName" className="text-right">
                  Room:
                </Label>
                <Input id="roomName" value={selectedRoom?.name || ''} className="col-span-3" disabled />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="checkIn" className="text-right">
                  Check-In:
                </Label>
                <Input id="checkIn" value={date?.from ? format(date.from, 'PPP') : ''} className="col-span-3" disabled />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="checkOut" className="text-right">
                  Check-Out:
                </Label>
                <Input id="checkOut" value={date?.to ? format(date.to, 'PPP') : ''} className="col-span-3" disabled />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="guestsCount" className="text-right">
                  Guests:
                </Label>
                <Input id="guestsCount" value={guests.toString()} className="col-span-3" disabled />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={handleCloseBookingModal}>
                Cancel
              </Button>
              <Button type="submit" onClick={confirmBooking}>Confirm Booking</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default BookingFlow;
