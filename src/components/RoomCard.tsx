
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, TreePine, RotateCcw } from "lucide-react";

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
  const buttonText = propertyType === "hostel" ? `Select Bed - ₹${room.price}/night` : propertyType === "luxury" ? `Select Suite - ₹${room.price}/night` : `Select Room - ₹${room.price}/night`;

  if (isLuxury) {
    return (
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-400 hover:shadow-lg transition-all duration-300 shadow-md w-full max-w-4xl mx-auto min-h-[500px] sm:min-h-[550px] md:min-h-[600px] flex flex-col">
        {/* Luxury Suite Image Display */}
        <div className="relative h-96 mb-6 rounded-lg overflow-hidden">
          {room.image ? (
            <img 
              src={room.image} 
              alt={room.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className={`absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center ${room.image ? 'hidden' : ''}`}>
            <div className="text-center">
              <TreePine className="h-16 w-16 text-gray-400 dark:text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-300 text-lg">Luxury Suite Images</p>
              <p className="text-gray-400 dark:text-gray-400 text-sm">270° Panoramic Views</p>
            </div>
          </div>
        </div>

        {/* Bottom Section for Description */}
        <CardHeader className="pb-3 flex-1">
          <div className="flex justify-between items-start mb-2">
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white font-serif-sans leading-tight flex items-center gap-2">
              {room.name}
              <RotateCcw className="h-6 w-6 text-orange-500" />
            </CardTitle>
          </div>
          <CardDescription className="text-gray-600 dark:text-gray-300 text-lg font-seasons">
            {room.description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Features */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 dark:text-white text-lg">Premium Features:</h4>
            <div className="grid grid-cols-2 gap-2">
              {room.features.map((feature, index) => (
                <Badge key={index} variant="outline" className="text-sm border-orange-300 dark:border-orange-400 text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 p-2">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Guest Info - Hidden */}
          <div className="hidden">
            <span className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Max {room.maxGuests} guest{room.maxGuests > 1 ? 's' : ''}
            </span>
          </div>
          
          {/* Select Button */}
          <Button 
            onClick={onSelectRoom}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-seasons text-lg py-6"
          >
            {buttonText}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-400 hover:shadow-lg transition-all duration-300 shadow-md w-full min-w-0 flex-1 min-h-[400px] sm:min-h-[450px] md:min-h-[500px] lg:min-h-[550px] flex flex-col">
      <CardHeader className="pb-2 sm:pb-3">
        <div className="w-full h-24 sm:h-32 md:h-36 lg:h-40 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-lg mb-2 sm:mb-4 flex items-center justify-center border border-gray-300 dark:border-gray-600 overflow-hidden">
          {room.image ? (
            <img 
              src={room.image} 
              alt={room.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className={`text-center ${room.image ? 'hidden' : ''}`}>
            <TreePine className="h-4 w-4 sm:h-6 sm:w-6 md:h-8 md:w-8 text-gray-400 dark:text-gray-300 mx-auto mb-1" />
            <p className="text-gray-500 dark:text-gray-300 text-fluid-xs">Room Image</p>
            <p className="text-gray-400 dark:text-gray-400 text-fluid-xs">Supabase Ready</p>
          </div>
        </div>
        <div className="flex justify-between items-start mb-1 sm:mb-2">
          <CardTitle className="text-fluid-sm sm:text-fluid-base md:text-fluid-lg font-bold text-gray-900 dark:text-white font-serif-sans leading-tight flex items-center gap-1 sm:gap-2">
            <span className="truncate">{room.name}</span>
          </CardTitle>
        </div>
        <CardDescription className="text-gray-600 dark:text-gray-300 text-fluid-xs sm:text-fluid-sm font-seasons line-clamp-2">
          {room.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-2 sm:space-y-3 flex-1 flex flex-col p-3 sm:p-6">
        <div className="flex-1">
          <div className="flex flex-wrap gap-1 mb-2 sm:mb-3 max-h-12 sm:max-h-16 overflow-hidden">
            {room.features.slice(0, 6).map((feature, index) => (
              <Badge key={index} variant="outline" className="text-fluid-xs border-orange-300 dark:border-orange-400 text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-1 sm:px-2 py-0.5 sm:py-1">
                {feature}
              </Badge>
            ))}
          </div>
          
          <div className="hidden">
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3 sm:h-4 sm:w-4" />
              Max {room.maxGuests} guest{room.maxGuests > 1 ? 's' : ''}
            </span>
          </div>
        </div>
        
        <div className="mt-auto">
          <Button 
            onClick={onSelectRoom}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 font-seasons py-2 sm:py-3 text-fluid-xs sm:text-fluid-sm hover-lift"
          >
            {buttonText}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoomCard;
