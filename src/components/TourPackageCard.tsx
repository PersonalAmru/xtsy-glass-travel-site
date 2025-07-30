
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Star, Calendar, Mountain, Camera } from "lucide-react";
import { useApp } from "@/contexts/AppContext";

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
    image?: string;
    images?: string[];
  };
  onPackageClick: () => void;
}

const TourPackageCard = ({ tourPackage, onPackageClick }: TourPackageCardProps) => {
  const { currency, formatPrice } = useApp();
  
  // Calculate proper pricing with currency conversion and weekend/weekday logic
  const calculateDisplayPrice = () => {
    const basePrice = parseInt(tourPackage.price.replace(/[^\d]/g, ''));
    let displayPrice = basePrice;
    
    // For USD/EUR guests: Add 10% base hike (15% on weekends handled in modal)
    if (currency.code !== 'INR') {
      displayPrice = Math.round(basePrice * 1.10);
    }
    
    return formatPrice(displayPrice);
  };

  return (
    <Card 
      className="group hover:shadow-2xl hover:scale-105 transition-all duration-500 overflow-hidden border-0 bg-card/90 backdrop-blur-md h-[600px] flex flex-col"
    >
      <div className="relative overflow-hidden">
        {(tourPackage.images?.length || tourPackage.image) ? (
          <img 
            src={tourPackage.images?.[0] || tourPackage.image} 
            alt={tourPackage.title}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center border-b border-border">
            <div className="text-center">
              <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground text-sm">Package Image</p>
            </div>
          </div>
        )}
        {tourPackage.images && tourPackage.images.length > 1 && (
          <div className="absolute top-4 left-4 bg-background/90 text-foreground px-2 py-1 rounded text-xs font-semibold border border-border">
            +{tourPackage.images.length - 1} more
          </div>
        )}
        <div className="absolute top-4 left-4">
          <Badge variant="secondary" className="bg-background/90 text-foreground border border-border">
            {tourPackage.category}
          </Badge>
        </div>
        <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-2 py-1 rounded text-sm font-bold">
          {calculateDisplayPrice()}
        </div>
      </div>
      
      <CardHeader className="flex-grow">
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">
            {tourPackage.title}
          </CardTitle>
          <div className="flex items-center gap-1 text-yellow-500 flex-shrink-0">
            <Star className="h-4 w-4 fill-current" />
            <span className="text-sm font-medium text-foreground">{tourPackage.rating}</span>
          </div>
        </div>
        <CardDescription className="text-muted-foreground line-clamp-3 flex-grow">
          {tourPackage.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4 mt-auto">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{tourPackage.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Mountain className="h-4 w-4" />
            <span>{tourPackage.difficulty}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{tourPackage.bestSeason}</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-semibold text-foreground">Highlights:</h4>
          <div className="flex flex-wrap gap-1">
            {tourPackage.highlights.slice(0, 3).map((highlight, index) => (
              <Badge key={index} variant="outline" className="text-xs border-border">
                {highlight}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="pt-4">
          <Button 
            className="w-full bg-gradient-to-r from-primary to-destructive hover:from-primary/80 hover:to-destructive/80 text-primary-foreground shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
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
