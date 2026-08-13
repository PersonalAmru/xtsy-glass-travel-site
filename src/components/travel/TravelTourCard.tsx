import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock, TrendingUp, Globe, Users } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import type { TourPackage } from "@/data/travelData";

interface TravelTourCardProps {
  tour: TourPackage;
  onSelect: (tour: TourPackage) => void;
}

const TravelTourCard = ({ tour, onSelect }: TravelTourCardProps) => {
  const { currency, formatPrice } = useApp();

  const displayPrice = () => {
    const basePrice = parseInt(tour.price.replace(/[^\d]/g, ''));
    const adjusted = currency.code !== 'INR' ? Math.round(basePrice * 1.10) : basePrice;
    return formatPrice(adjusted);
  };

  const categoryColors: Record<string, string> = {
    adventure: "bg-destructive/90 text-destructive-foreground",
    cultural: "bg-purple-600/90 text-white",
    leisure: "bg-success/90 text-success-foreground",
    educational: "bg-brand-verified/90 text-white",
  };

  return (
    <Card
      className="group cursor-pointer bg-card border border-border/50 shadow-md hover:shadow-xl hover:border-primary/30 transition-shadow duration-300 rounded-2xl overflow-hidden h-full flex flex-col"
      onClick={() => onSelect(tour)}
    >
      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={tour.image}
          alt={`${tour.title} — ${tour.location}`}
          className="w-full h-36 sm:h-44 md:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          <Badge className={`text-xs px-2.5 py-1 font-medium backdrop-blur-xs border-0 ${categoryColors[tour.category] || "bg-muted text-muted-foreground"}`}>
            {tour.category}
          </Badge>
          <div className="flex gap-1.5">
            {tour.exclusive && (
              <Badge className="bg-gradient-to-r from-brand-gold to-primary text-primary-foreground text-xs px-2 py-1 font-semibold shadow-lg border-0">
                ⭐ Premium
              </Badge>
            )}
            {tour.international && (
              <Badge className="bg-gradient-to-r from-brand-verified to-indigo-600 text-white text-xs px-2 py-1 font-semibold shadow-lg border-0">
                <Globe className="h-3 w-3 mr-1" />
                International
              </Badge>
            )}
          </div>
        </div>

        {/* Rating */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-card/95 backdrop-blur-xs text-foreground px-2.5 py-1 rounded-full text-sm font-semibold shadow-lg">
          <Star className="h-3.5 w-3.5 fill-brand-gold text-brand-gold" />
          <span>{tour.rating}</span>
        </div>

        {/* Duration */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-card/95 backdrop-blur-xs text-muted-foreground px-2.5 py-1 rounded-full text-xs font-medium shadow-lg">
          <Clock className="h-3 w-3" />
          <span>{tour.duration}</span>
        </div>
      </div>

      <CardContent className="p-4 flex-grow flex flex-col">
        <h3 className="font-semibold text-foreground mb-2 text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {tour.title}
        </h3>

        <div className="flex items-center gap-1.5 text-muted-foreground mb-3 text-xs sm:text-sm">
          <MapPin className="h-3.5 w-3.5 text-primary flex-shrink-0" />
          <span className="truncate">{tour.location}</span>
          {tour.visaInfo && (
            <span className="ml-auto text-xs text-success font-medium whitespace-nowrap">{tour.visaInfo}</span>
          )}
        </div>

        {/* Highlights */}
        <div className="mb-4 flex-grow">
          <div className="space-y-1.5">
            {tour.highlights.slice(0, 3).map((h, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-gradient-to-r from-brand-gold to-primary rounded-full mt-1.5 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-muted-foreground leading-tight line-clamp-1">{h}</span>
              </div>
            ))}
            {tour.highlights.length > 3 && (
              <span className="text-xs text-primary font-medium">+{tour.highlights.length - 3} more</span>
            )}
          </div>
        </div>

        {/* Group size */}
        {tour.groupSize && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
            <Users className="h-3 w-3" />
            <span>Small groups: {tour.groupSize}</span>
          </div>
        )}

        {/* Price & CTA */}
        <div className="mt-auto pt-3 border-t border-border">
          <div className="flex items-end justify-between mb-3">
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Starting from</p>
              <div className="flex items-baseline gap-1">
                <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-brand-gold to-primary bg-clip-text text-transparent">{displayPrice()}</span>
                <span className="text-xs text-muted-foreground">/person</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-success text-xs font-medium">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>Best Value</span>
            </div>
          </div>

          <button
            className="w-full bg-gradient-to-r from-primary to-brand-ember hover:from-primary/90 hover:to-brand-ember/90 text-primary-foreground font-semibold py-2.5 px-4 rounded-xl text-sm transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/35 hover:scale-[1.02]"
            onClick={(e) => { e.stopPropagation(); onSelect(tour); }}
          >
            View Details →
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TravelTourCard;
