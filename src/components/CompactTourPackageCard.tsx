
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock, TrendingUp } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import UnifiedImage from "./UnifiedImage"; // Updated to UnifiedImage
import { getRelevantTourImage, type TourPackage } from "@/utils/imageSelection";

// Remove interface declaration since it's imported from utils
// Updated component to use UnifiedImage for better performance

interface CompactTourPackageCardProps {
  tourPackage: TourPackage;
  onPackageClick: (tourPackage: TourPackage) => void;
}

const CompactTourPackageCard: React.FC<CompactTourPackageCardProps> = ({ 
  tourPackage, 
  onPackageClick 
}) => {
  const { currency, formatPrice } = useApp();

  // Calculate display price with exact same logic as modal
  const calculateDisplayPrice = () => {
    const basePrice = parseInt(tourPackage.price.replace(/[^\d]/g, ''));
    let displayPrice = basePrice;
    
    // For USD/EUR guests: Add 10% base hike
    if (currency.code !== 'INR') {
      displayPrice = Math.round(basePrice * 1.10);
    }
    
    return formatPrice(displayPrice);
  };

  const displayPrice = calculateDisplayPrice();

  // Get intelligent image selection
  const imageUrl = getRelevantTourImage(tourPackage);
  
  // Generate descriptive alt text based on tour content
  const generateAltText = () => {
    const title = tourPackage.title.toLowerCase();
    
    if (title.includes('biodiversity') || title.includes('research')) {
      return "Black bear in Meghalaya forest during biodiversity research expedition";
    }
    if (title.includes('living root bridge')) {
      return "Living root bridge spanning across Meghalaya valley";
    }
    if (title.includes('cherrapunji') || title.includes('monsoon')) {
      return "Nohkalikai Falls cascading through Cherrapunji's misty landscape";
    }
    if (title.includes('dawki') || title.includes('crystal clear')) {
      return "Crystal clear Umngot River in Dawki with visible riverbed";
    }
    if (title.includes('shillong')) {
      return "Shillong cultural landscape with traditional Khasi architecture";
    }
    if (title.includes('mawlynnong')) {
      return "Clean village of Mawlynnong with bamboo walkways and lush greenery";
    }
    
    // Default descriptive alt text
    return `${tourPackage.title} - ${tourPackage.location} travel experience showing ${tourPackage.category} activities`;
  };

  return (
    <Card 
      className="group cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] bg-white border border-gray-200 hover:border-orange-300 h-full flex flex-col"
      onClick={() => onPackageClick(tourPackage)}
    >
      <div className="relative overflow-hidden rounded-t-lg">
        <UnifiedImage
          src={imageUrl}
          alt={generateAltText()}
          className="w-full h-20 sm:h-24 object-cover group-hover:scale-110 transition-transform duration-300"
          threshold={0.05}
          priority={false}
        />
        
        {/* Compact badges */}
        <div className="absolute top-1 left-1">
          <Badge 
            variant={tourPackage.category === 'adventure' ? 'destructive' : 
                    tourPackage.category === 'cultural' ? 'default' : 'secondary'}
            className="text-xs px-1 py-0 bg-white/90 text-black"
          >
            {tourPackage.category}
          </Badge>
        </div>
        
        {tourPackage.exclusive && (
          <div className="absolute top-1 right-1">
            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs px-1 py-0">
              ⭐
            </Badge>
          </div>
        )}
        
        {/* Compact rating */}
        <div className="absolute bottom-1 right-1 flex items-center gap-0.5 bg-black/70 text-white px-1 py-0.5 rounded text-xs">
          <Star className="h-2 w-2 fill-yellow-400 text-yellow-400" />
          <span>{tourPackage.rating}</span>
        </div>
      </div>

      <CardContent className="p-2 flex-grow flex flex-col">
        {/* Compact title */}
        <h3 className="font-semibold text-gray-900 mb-1 text-xs leading-tight line-clamp-2">
          {tourPackage.title.replace(/^XTSY Exclusive:\s*/, '')}
        </h3>
        
        {/* Ultra-compact info grid */}
        <div className="grid grid-cols-2 gap-1 mb-1 text-xs">
          <div className="flex items-center gap-1 text-gray-500">
            <Clock className="h-2 w-2" />
            <span className="truncate">{tourPackage.duration}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-500">
            <MapPin className="h-2 w-2" />
            <span className="truncate">{tourPackage.location}</span>
          </div>
        </div>

        {/* Compact highlights - show only first 2 */}
        <div className="mb-1 flex-grow">
          <div className="space-y-0.5">
            {tourPackage.highlights.slice(0, 2).map((highlight, index) => (
              <div key={index} className="flex items-start gap-1">
                <div className="w-1 h-1 bg-orange-500 rounded-full mt-1.5 flex-shrink-0" />
                <span className="text-xs text-gray-600 leading-tight line-clamp-1">{highlight}</span>
              </div>
            ))}
            {tourPackage.highlights.length > 2 && (
              <span className="text-xs text-gray-400">+{tourPackage.highlights.length - 2} more</span>
            )}
          </div>
        </div>

        {/* Compact price and CTA */}
        <div className="mt-auto">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span className="text-sm font-bold text-gray-900">{displayPrice}</span>
            </div>
            <span className="text-xs text-gray-500">per person</span>
          </div>
          
          <button 
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium py-1 px-2 rounded text-xs transition-all duration-200 transform hover:scale-105"
            onClick={(e) => {
              e.stopPropagation();
              onPackageClick(tourPackage);
            }}
          >
            View Details
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompactTourPackageCard;
