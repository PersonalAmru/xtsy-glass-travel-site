import { Star, MapPin, Clock, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/contexts/AppContext";
import type { TourPackage } from "@/data/travelData";

interface TourListingCardProps {
  tour: TourPackage;
  onSelect: (tour: TourPackage) => void;
}

const TourListingCard = ({ tour, onSelect }: TourListingCardProps) => {
  const { currency, formatPrice } = useApp();

  const displayPrice = () => {
    const basePrice = parseInt(tour.price.replace(/[^\d]/g, ''));
    const adjusted = currency.code !== 'INR' ? Math.round(basePrice * 1.10) : basePrice;
    return formatPrice(adjusted);
  };

  const categoryColors: Record<string, string> = {
    adventure: "bg-orange-500/90",
    cultural: "bg-purple-500/90",
    leisure: "bg-emerald-500/90",
    educational: "bg-blue-500/90",
  };

  const difficultyColors: Record<string, string> = {
    Easy: "text-emerald-400",
    Moderate: "text-amber-400",
    Challenging: "text-red-400",
  };

  return (
    <div
      className="group cursor-pointer bg-card/50 backdrop-blur-sm border border-border/30 rounded-2xl overflow-hidden hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 flex flex-col h-full"
      onClick={() => onSelect(tour)}
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[16/10]">
        <img
          src={tour.image}
          alt={tour.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Top badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge className={`${categoryColors[tour.category]} text-white text-[10px] px-2 py-0.5 border-0 capitalize`}>
            {tour.category}
          </Badge>
          {tour.exclusive && (
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] px-2 py-0.5 border-0">
              ⭐ Exclusive
            </Badge>
          )}
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
          <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-lg">
            <Clock className="h-3 w-3 text-white/70" />
            <span className="text-white text-xs font-medium">{tour.duration}</span>
          </div>
          <div className="flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-lg">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="text-white text-xs font-semibold">{tour.rating}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-white text-sm sm:text-base mb-1.5 line-clamp-2 group-hover:text-emerald-400 transition-colors leading-snug">
          {tour.title}
        </h3>

        <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-3">
          <MapPin className="h-3 w-3 text-emerald-500 flex-shrink-0" />
          <span className="truncate">{tour.location}</span>
          <span className="mx-1 text-border">·</span>
          <span className={`font-medium ${difficultyColors[tour.difficulty]}`}>{tour.difficulty}</span>
        </div>

        {/* Highlights */}
        <div className="space-y-1 mb-4 flex-grow">
          {tour.highlights.slice(0, 3).map((h, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="w-1 h-1 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
              <span className="text-xs text-muted-foreground line-clamp-1">{h}</span>
            </div>
          ))}
        </div>

        {/* Group size */}
        {tour.groupSize && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
            <Users className="h-3 w-3" />
            <span>{tour.groupSize}</span>
          </div>
        )}

        {/* Price & CTA */}
        <div className="pt-3 border-t border-border/30 mt-auto">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] text-muted-foreground mb-0.5">Starting from</p>
              <span className="text-lg font-bold text-emerald-400">{displayPrice()}</span>
              <span className="text-xs text-muted-foreground ml-1">/person</span>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onSelect(tour); }}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              View Itinerary
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourListingCard;
