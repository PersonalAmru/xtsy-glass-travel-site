
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock, TrendingUp } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
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
      className="group cursor-pointer bg-white border-0 shadow-md hover:shadow-2xl transition-all duration-500 rounded-2xl overflow-hidden h-full flex flex-col"
      onClick={() => onPackageClick(tourPackage)}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <img
          src={imageUrl}
          alt={generateAltText()}
          className="w-full h-36 sm:h-44 md:h-48 object-cover group-hover:scale-110 transition-transform duration-700"
          loading="eager"
          fetchPriority="high"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          <Badge 
            className={`text-xs px-2.5 py-1 font-medium backdrop-blur-sm border-0 ${
              tourPackage.category === 'adventure' 
                ? 'bg-red-500/90 text-white' 
                : tourPackage.category === 'cultural' 
                  ? 'bg-purple-500/90 text-white' 
                  : 'bg-emerald-500/90 text-white'
            }`}
          >
            {tourPackage.category}
          </Badge>
          
          {tourPackage.exclusive && (
            <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs px-2 py-1 font-semibold shadow-lg">
              ⭐ Premium
            </Badge>
          )}
        </div>
        
        {/* Rating Badge */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-white/95 backdrop-blur-sm text-gray-900 px-2.5 py-1 rounded-full text-sm font-semibold shadow-lg">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span>{tourPackage.rating}</span>
        </div>
        
        {/* Duration Badge */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/95 backdrop-blur-sm text-gray-700 px-2.5 py-1 rounded-full text-xs font-medium shadow-lg">
          <Clock className="h-3 w-3" />
          <span>{tourPackage.duration}</span>
        </div>
      </div>

      <CardContent className="p-4 flex-grow flex flex-col">
        {/* Title */}
        <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-orange-600 transition-colors">
          {tourPackage.title}
        </h3>
        
        {/* Location */}
        <div className="flex items-center gap-1.5 text-gray-500 mb-3 text-xs sm:text-sm">
          <MapPin className="h-3.5 w-3.5 text-orange-500" />
          <span>{tourPackage.location}</span>
        </div>

        {/* Highlights */}
        <div className="mb-4 flex-grow">
          <div className="space-y-1.5">
            {tourPackage.highlights.slice(0, 3).map((highlight, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-gradient-to-r from-orange-400 to-red-500 rounded-full mt-1.5 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-gray-600 leading-tight line-clamp-1">{highlight}</span>
              </div>
            ))}
            {tourPackage.highlights.length > 3 && (
              <span className="text-xs text-orange-500 font-medium">+{tourPackage.highlights.length - 3} more highlights</span>
            )}
          </div>
        </div>

        {/* Price Section */}
        <div className="mt-auto pt-3 border-t border-gray-100">
          <div className="flex items-end justify-between mb-3">
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Starting from</p>
              <div className="flex items-baseline gap-1">
                <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">{displayPrice}</span>
                <span className="text-xs text-gray-500">/person</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-emerald-600 text-xs font-medium">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>Best Value</span>
            </div>
          </div>
          
          <button 
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition-all duration-300 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.02]"
            onClick={(e) => {
              e.stopPropagation();
              onPackageClick(tourPackage);
            }}
          >
            View Details →
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompactTourPackageCard;
