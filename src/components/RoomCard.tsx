
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
  };
  propertyType: "hostel" | "luxury" | "economy";
  onSelectRoom: () => void;
  isLuxury?: boolean;
}

const RoomCard = ({ room, propertyType, onSelectRoom, isLuxury = false }: RoomCardProps) => {
  const buttonText = propertyType === "hostel" ? "Select Bed" : propertyType === "luxury" ? "Select Suite" : "Select Bed";
  const badgeColor = propertyType === "hostel" ? "bg-blue-500" : propertyType === "luxury" ? "bg-purple-500" : "bg-green-500";
  const badgeText = propertyType === "hostel" ? "Hostel" : propertyType === "luxury" ? "Luxury" : "Economy";

  if (isLuxury) {
    return (
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-400 hover:shadow-lg transition-all duration-300 shadow-md w-full min-h-[600px] flex flex-col">
        {/* Floating Images Display */}
        <div className="relative h-96 mb-6 rounded-lg overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
            <div className="text-center">
              <TreePine className="h-16 w-16 text-gray-400 dark:text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-300 text-lg">Luxury Suite Images</p>
              <p className="text-gray-400 dark:text-gray-400 text-sm">270° Panoramic Views</p>
            </div>
          </div>
          <div className="absolute top-4 right-4">
            <Badge className={`${badgeColor} text-white text-sm px-4 py-2`}>
              {badgeText}
            </Badge>
          </div>
        </div>

        {/* Bottom Section for Description */}
        <CardHeader className="pb-3 flex-1">
          <div className="flex justify-between items-start mb-2">
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white font-serif-sans leading-tight flex items-center gap-2">
              {room.name}
              <RotateCcw className="h-6 w-6 text-orange-500" />
            </CardTitle>
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-lg px-4 py-2 whitespace-nowrap">
              ₹{room.price}/night
            </Badge>
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
    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-400 hover:shadow-lg transition-all duration-300 shadow-md flex-shrink-0 w-80 h-[550px] flex flex-col">
      <CardHeader className="pb-3">
        <div className="w-full h-40 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-lg mb-4 flex items-center justify-center border border-gray-300 dark:border-gray-600">
          <div className="text-center">
            <TreePine className="h-8 w-8 text-gray-400 dark:text-gray-300 mx-auto mb-1" />
            <p className="text-gray-500 dark:text-gray-300 text-xs">Room Image</p>
            <p className="text-gray-400 dark:text-gray-400 text-xs">Supabase Ready</p>
          </div>
        </div>
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-lg font-bold text-gray-900 dark:text-white font-serif-sans leading-tight flex items-center gap-2">
            {room.name}
            <Badge className={`${badgeColor} text-white text-xs`}>
              {badgeText}
            </Badge>
          </CardTitle>
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-sm whitespace-nowrap ml-2">
            ₹{room.price}/night
          </Badge>
        </div>
        <CardDescription className="text-gray-600 dark:text-gray-300 text-sm font-seasons line-clamp-2">
          {room.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-3 flex-1 flex flex-col">
        <div className="flex-1">
          <div className="flex flex-wrap gap-1 mb-3 max-h-16 overflow-hidden">
            {room.features.slice(0, 6).map((feature, index) => (
              <Badge key={index} variant="outline" className="text-xs border-orange-300 dark:border-orange-400 text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20">
                {feature}
              </Badge>
            ))}
          </div>
          
          <div className="hidden">
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              Max {room.maxGuests} guest{room.maxGuests > 1 ? 's' : ''}
            </span>
          </div>
        </div>
        
        <div className="mt-auto">
          <Button 
            onClick={onSelectRoom}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 font-seasons py-2"
          >
            {buttonText}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoomCard;
