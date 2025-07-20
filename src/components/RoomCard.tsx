
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
  propertyType: "hostel" | "luxury";
  onSelectRoom: () => void;
}

const RoomCard = ({ room, propertyType, onSelectRoom }: RoomCardProps) => {
  const buttonText = propertyType === "hostel" ? "Select Bed" : "Select Room";
  const badgeColor = propertyType === "hostel" ? "bg-blue-500" : "bg-purple-500";
  const badgeText = propertyType === "hostel" ? "Hostel" : "Luxury";

  return (
    <Card className="bg-white border border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all duration-300 transform hover:scale-105 shadow-md flex-shrink-0 w-80 sm:w-72 lg:w-80">
      <CardHeader className="pb-3">
        <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-4 flex items-center justify-center border border-gray-300">
          <div className="text-center">
            <TreePine className="h-8 w-8 text-gray-400 mx-auto mb-1" />
            <p className="text-gray-500 text-xs">Room Image</p>
            <p className="text-gray-400 text-xs">Supabase Ready</p>
          </div>
        </div>
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-lg sm:text-xl font-bold text-gray-900 font-serif-sans leading-tight flex items-center gap-2">
            {room.name}
            {room.id === "signature-270-glass-suite" && (
              <RotateCcw className="h-5 w-5 text-orange-500" />
            )}
            <Badge className={`${badgeColor} text-white text-xs`}>
              {badgeText}
            </Badge>
          </CardTitle>
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold whitespace-nowrap ml-2">
            ₹{room.price}/night
          </Badge>
        </div>
        <CardDescription className="text-gray-600 text-sm font-seasons">
          {room.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-1">
          {room.features.map((feature, index) => (
            <Badge key={index} variant="outline" className="text-xs border-orange-300 text-orange-600 bg-orange-50">
              {feature}
            </Badge>
          ))}
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            Max {room.maxGuests} guest{room.maxGuests > 1 ? 's' : ''}
          </span>
        </div>
        
        <Button 
          onClick={onSelectRoom}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-seasons"
        >
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
};

export default RoomCard;
