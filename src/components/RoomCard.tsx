
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { useNavigate } from "react-router-dom";
import MobileImageCarousel from "./MobileImageCarousel";

interface RoomCardProps {
  room: {
    id: string;
    name: string;
    price: number;
    description: string;
    features: string[];
    maxGuests: number;
    maxRooms: number;
    image: string;
    images?: string[];
  };
  propertyType: "hostel" | "luxury" | "economy";
  onSelectRoom: () => void;
  isLuxury?: boolean;
}

const RoomCard = ({ room, propertyType, onSelectRoom, isLuxury = false }: RoomCardProps) => {
  const { formatPrice, currency } = useApp();
  const navigate = useNavigate();
  
  // Apply weekend/weekday hike for USD/EUR guests to the displayed price
  const getDisplayPrice = () => {
    let price = room.price;
    if (currency.code !== 'INR') {
      // Check if current date is weekend (approximate for pricing display)
      const today = new Date();
      const isWeekend = [0, 6].includes(today.getDay());
      const hike = isWeekend ? 1.15 : 1.10; // 15% weekend, 10% weekday
      price = Math.round(price * hike);
    }
    return price;
  };

  const handleRoomSelection = () => {
    // Navigate to booking flow with pre-selected room and property type
    const params = new URLSearchParams({
      checkIn: new Date().toISOString().split('T')[0],
      checkOut: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
      guests: '1',
      roomType: room.id,
      propertyType: propertyType
    });
    navigate(`/booking?${params.toString()}`);
  };
  
  const displayPrice = getDisplayPrice();
  const buttonText = propertyType === "hostel" ? `Select Bed - ${formatPrice(displayPrice)}/night` : propertyType === "luxury" ? `Select Suite - ${formatPrice(displayPrice)}/night` : `Select Room - ${formatPrice(displayPrice)}/night`;
  
  const images = room.images && room.images.length > 0 ? room.images : [room.image];

  if (isLuxury) {
    return (
      <Card className="group bg-black text-white hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-gray-700 overflow-hidden min-h-[580px] h-auto flex flex-col mobile-carousel">
        <MobileImageCarousel
          images={images}
          alt={room.name}
          className="h-72"
          aspectRatio="photo"
          showIndicators={true}
          showArrows={true}
        />
        
        <CardHeader className="pb-2 px-4">
          <CardTitle className="text-lg font-bold text-white mb-1 font-playfair">
            {room.name}
          </CardTitle>
          <CardDescription className="text-gray-300 text-sm font-josefin line-clamp-2">
            {room.description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="px-4 pb-4 flex-1 flex flex-col">
          <div className="mb-4">
            <h4 className="font-semibold text-white mb-2 font-josefin">Premium Features:</h4>
            <div className="flex flex-wrap gap-1">
              {room.features.slice(0, 6).map((feature, index) => (
                <Badge key={index} variant="secondary" className="text-xs bg-gradient-to-r from-orange-800 to-red-900 text-orange-200 border-orange-600">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="mt-auto">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-300" />
                <span className="text-sm text-gray-300 font-josefin">{room.maxGuests} guests</span>
              </div>
              <span className="text-lg font-bold text-orange-400 font-playfair">{formatPrice(displayPrice)}/night</span>
            </div>
            <Button 
              onClick={handleRoomSelection}
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-josefin mobile-button"
            >
              {buttonText.split(' - ')[0]}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Standard room card
  return (
    <Card className="group bg-black text-white hover:shadow-lg transition-all duration-300 border-gray-700 overflow-hidden h-auto flex flex-col mobile-carousel">
      <MobileImageCarousel
        images={images}
        alt={room.name}
        className="h-48"
        aspectRatio="photo"
        showIndicators={true}
        showArrows={true}
      />
      
      <CardHeader className="pb-3 flex-grow">
        <CardTitle className="text-lg font-bold text-white mb-2 line-clamp-2 font-playfair">
          {room.name}
        </CardTitle>
        <CardDescription className="text-gray-300 text-sm line-clamp-2 font-josefin">
          {room.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-3 flex-grow flex flex-col">
        <div className="flex-grow">
          <h4 className="font-semibold text-white mb-2 font-josefin">Features:</h4>
          <div className="flex flex-wrap gap-1">
            {room.features.slice(0, 4).map((feature, index) => (
              <Badge key={index} variant="outline" className="text-xs border-gray-600 text-gray-200 bg-gray-800">
                {feature}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="mt-auto pt-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-300" />
              <span className="text-sm text-gray-300 font-josefin">{room.maxGuests} guests</span>
            </div>
            <span className="text-lg font-bold text-orange-400 font-playfair">{formatPrice(displayPrice)}/night</span>
          </div>
          <Button 
            onClick={handleRoomSelection}
            className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-josefin mobile-button"
          >
            {buttonText.split(' - ')[0]}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoomCard;
