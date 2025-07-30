
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, TreePine, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useApp } from "@/contexts/AppContext";

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
  const { formatPrice } = useApp();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const buttonText = propertyType === "hostel" ? `Select Bed - ${formatPrice(room.price)}/night` : propertyType === "luxury" ? `Select Suite - ${formatPrice(room.price)}/night` : `Select Room - ${formatPrice(room.price)}/night`;
  
  const images = room.images && room.images.length > 0 ? room.images : [room.image];
  const hasMultipleImages = images.length > 1;

  const nextImage = () => {
    if (isTransitioning) return; // Prevent rapid clicking
    setIsTransitioning(true);
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
    setImageError(false);
    setTimeout(() => setIsTransitioning(false), 150); // Short debounce
  };

  const prevImage = () => {
    if (isTransitioning) return; // Prevent rapid clicking
    setIsTransitioning(true);
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    setImageError(false);
    setTimeout(() => setIsTransitioning(false), 150); // Short debounce
  };

  const handleImageError = () => {
    setImageError(true);
  };

  if (isLuxury) {
    return (
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-400 hover:shadow-lg transition-all duration-300 shadow-md w-full max-w-4xl mx-auto min-h-[500px] sm:min-h-[550px] md:min-h-[600px] flex flex-col">
        {/* Luxury Suite Image Display */}
        <div className="relative h-96 mb-6 rounded-lg overflow-hidden group">
          {!imageError && images[currentImageIndex] ? (
            <img 
              src={images[currentImageIndex]} 
              alt={room.name}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={handleImageError}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
              <div className="text-center">
                <TreePine className="h-16 w-16 text-gray-400 dark:text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-300 text-lg">Luxury Suite Images</p>
                <p className="text-gray-400 dark:text-gray-400 text-sm">270° Panoramic Views</p>
              </div>
            </div>
          )}
          
          {hasMultipleImages && !imageError && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
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
    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-400 hover:shadow-lg transition-all duration-300 shadow-md w-full min-w-0 flex-1 min-h-[500px] sm:min-h-[550px] md:min-h-[600px] lg:min-h-[650px] flex flex-col">
      <CardHeader className="pb-2 sm:pb-3">
        <div className="w-full h-48 sm:h-56 md:h-64 lg:h-72 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-lg mb-2 sm:mb-4 flex items-center justify-center border border-gray-300 dark:border-gray-600 overflow-hidden relative group">
          {!imageError && images[currentImageIndex] ? (
            <img 
              src={images[currentImageIndex]} 
              alt={room.name}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={handleImageError}
            />
          ) : (
            <div className="text-center">
              <TreePine className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-gray-400 dark:text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 dark:text-gray-300 text-sm">Room Image</p>
              <p className="text-gray-400 dark:text-gray-400 text-xs">Supabase Ready</p>
            </div>
          )}
          
          {hasMultipleImages && !imageError && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft className="h-3 w-3" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight className="h-3 w-3" />
              </button>
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-1.5 h-1.5 rounded-full ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        <div className="flex justify-between items-start mb-1 sm:mb-2">
          <CardTitle className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white font-serif-sans leading-tight">
            <span className="truncate">{room.name}</span>
          </CardTitle>
        </div>
        <CardDescription className="text-gray-600 dark:text-gray-300 text-sm font-seasons line-clamp-2">
          {room.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-3 flex-1 flex flex-col p-3 sm:p-6">
        <div className="flex-1">
          <div className="flex flex-wrap gap-1 mb-3 max-h-20 overflow-hidden">
            {room.features.slice(0, 8).map((feature, index) => (
              <Badge key={index} variant="outline" className="text-xs border-orange-300 dark:border-orange-400 text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-2 py-1">
                {feature}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="mt-auto">
          <Button 
            onClick={onSelectRoom}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 font-seasons py-3 text-sm hover-lift"
          >
            {buttonText}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoomCard;
