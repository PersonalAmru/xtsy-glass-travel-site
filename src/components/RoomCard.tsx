import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
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
  
  const displayPrice = getDisplayPrice();
  const buttonText = propertyType === "hostel" ? `Select Bed - ${formatPrice(displayPrice)}/night` : propertyType === "luxury" ? `Select Suite - ${formatPrice(displayPrice)}/night` : `Select Room - ${formatPrice(displayPrice)}/night`;
  
  const images = room.images && room.images.length > 0 ? room.images : [room.image];

  if (isLuxury) {
    return (
      <Card className="group bg-white hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-0 overflow-hidden h-[500px] flex flex-col mobile-carousel">
        <MobileImageCarousel
          images={images}
          alt={room.name}
          className="h-80"
          aspectRatio="photo"
          showIndicators={true}
          showArrows={true}
        />
        
        <CardHeader className="pb-3 flex-grow">
          <CardTitle className="text-xl font-bold text-gray-900 mb-2 font-playfair">
            {room.name}
          </CardTitle>
          <CardDescription className="text-gray-600 text-sm font-josefin">
            {room.description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4 flex-grow flex flex-col">
          <div className="flex-grow">
            <h4 className="font-semibold text-gray-900 mb-2 font-josefin">Premium Features:</h4>
            <div className="flex flex-wrap gap-1">
              {room.features.slice(0, 6).map((feature, index) => (
                <Badge key={index} variant="secondary" className="text-xs bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 border-orange-200">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="mt-auto pt-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-600" />
                <span className="text-sm text-gray-600 font-josefin">Max {room.maxGuests} guests</span>
              </div>
              <span className="text-lg font-bold text-orange-600 font-playfair">{formatPrice(displayPrice)}/night</span>
            </div>
            <Button 
              onClick={onSelectRoom}
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
    <Card className="group bg-white hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden h-auto flex flex-col mobile-carousel">
      <MobileImageCarousel
        images={images}
        alt={room.name}
        className="h-48"
        aspectRatio="photo"
        showIndicators={true}
        showArrows={true}
      />
      
      <CardHeader className="pb-3 flex-grow">
        <CardTitle className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 font-playfair">
          {room.name}
        </CardTitle>
        <CardDescription className="text-gray-600 text-sm line-clamp-2 font-josefin">
          {room.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-3 flex-grow flex flex-col">
        <div className="flex-grow">
          <h4 className="font-semibold text-gray-900 mb-2 font-josefin">Features:</h4>
          <div className="flex flex-wrap gap-1">
            {room.features.slice(0, 4).map((feature, index) => (
              <Badge key={index} variant="outline" className="text-xs border-gray-300 text-gray-600 bg-gray-50">
                {feature}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="mt-auto pt-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-600 font-josefin">Max {room.maxGuests} guests</span>
            </div>
            <span className="text-lg font-bold text-orange-600 font-playfair">{formatPrice(displayPrice)}/night</span>
          </div>
          <Button 
            onClick={onSelectRoom}
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