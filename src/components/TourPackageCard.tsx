
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Star, Calendar, Mountain, Camera } from "lucide-react";

interface TourPackageCardProps {
  tourPackage: {
    id: number;
    title: string;
    description: string;
    duration: string;
    difficulty: string;
    price: string;
    rating: number;
    category: string;
    location: string;
    highlights: string[];
    bestSeason: string;
  };
  onPackageClick: () => void;
}

const TourPackageCard = ({ tourPackage, onPackageClick }: TourPackageCardProps) => {
  return (
    <Card 
      className="group hover:shadow-2xl hover:scale-105 transition-all duration-500 overflow-hidden border-0 bg-white/90 backdrop-blur-md cursor-pointer h-full flex flex-col"
      onClick={onPackageClick}
    >
      <div className="relative overflow-hidden">
        <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border-b">
          <div className="text-center">
            <Camera className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">Package Image</p>
          </div>
        </div>
        <div className="absolute top-4 left-4">
          <Badge variant="secondary" className="bg-white/90 text-gray-800">
            {tourPackage.category}
          </Badge>
        </div>
        <div className="absolute top-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-sm font-bold">
          {tourPackage.price}
        </div>
      </div>
      
      <CardHeader className="flex-grow">
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-xl group-hover:text-orange-600 transition-colors line-clamp-2">
            {tourPackage.title}
          </CardTitle>
          <div className="flex items-center gap-1 text-yellow-500 flex-shrink-0">
            <Star className="h-4 w-4 fill-current" />
            <span className="text-sm font-medium text-gray-700">{tourPackage.rating}</span>
          </div>
        </div>
        <CardDescription className="text-gray-600 line-clamp-3 flex-grow">
          {tourPackage.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4 mt-auto">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {tourPackage.duration}
          </div>
          <div className="flex items-center gap-1">
            <Mountain className="h-4 w-4" />
            {tourPackage.difficulty}
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {tourPackage.bestSeason}
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-900">Highlights:</h4>
          <div className="flex flex-wrap gap-1">
            {tourPackage.highlights.slice(0, 3).map((highlight, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {highlight}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="pt-4">
          <Button 
            className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            onClick={(e) => {
              e.stopPropagation();
              onPackageClick();
            }}
          >
            <MapPin className="h-4 w-4 mr-2" />
            Book This Journey
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TourPackageCard;
