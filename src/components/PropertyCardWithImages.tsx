import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, TreePine, MapPin, Star } from "lucide-react";
import PerformantImage from "./PerformantImage";

// Real property images for XTSY
import xtsy270Image from "@/assets/xtsy-brand-logo.png";

interface PropertyCardProps {
  property: {
    id: string;
    name: string;
    description: string;
    image: string;
    rating: number;
    amenities: string[];
    showBanner?: boolean;
  };
  onSelectProperty: () => void;
}

const PropertyCardWithImages = ({ property, onSelectProperty }: PropertyCardProps) => {
  // Get appropriate property image
  const getPropertyImage = () => {
    const propertyName = property.name.toLowerCase();
    
    // For XTSY 270 specifically
    if (propertyName.includes('xtsy') || propertyName.includes('270')) {
      return xtsy270Image;
    }
    
    // Default fallback
    return property.image || xtsy270Image;
  };

  const propertyImage = getPropertyImage();

  return (
    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-400 hover:shadow-lg transition-all duration-300 transform hover:scale-105 shadow-md h-full flex flex-col">
      {!property.showBanner && (
        <div className="relative overflow-hidden h-48">
          <PerformantImage
            src={propertyImage}
            alt={`${property.name} - Property Image`}
            className="w-full h-full object-cover"
            priority={false}
          />
        </div>
      )}
      
      {property.showBanner && (
        <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-t-lg flex items-center justify-center border-b border-gray-300 dark:border-gray-600">
          <div className="text-center">
            <MapPin className="h-12 w-12 text-gray-400 dark:text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500 dark:text-gray-300 text-sm">Live the Shillong Vibe</p>
            <p className="text-gray-400 dark:text-gray-400 text-xs">XTSY Luxury Banner</p>
          </div>
        </div>
      )}
      
      <CardHeader className="pb-3 flex-grow">
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white font-serif-sans leading-tight">
            {property.name}
          </CardTitle>
          <div className="flex items-center gap-1 text-yellow-500">
            <Star className="h-4 w-4 fill-current" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{property.rating}</span>
          </div>
        </div>
        <CardDescription className="text-gray-600 dark:text-gray-300 text-sm font-seasons">
          {property.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4 flex-grow flex flex-col">
        <div className="flex-grow">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Amenities:</h4>
          <div className="flex flex-wrap gap-1">
            {property.amenities.map((amenity, index) => (
              <Badge key={index} variant="outline" className="text-xs border-orange-300 dark:border-orange-400 text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20">
                {amenity}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="mt-auto pt-4">
          <Button 
            onClick={onSelectProperty}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-seasons"
          >
            View Rooms
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCardWithImages;