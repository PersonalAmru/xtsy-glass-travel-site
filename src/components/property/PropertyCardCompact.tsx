/**
 * PropertyCardCompact - Compact property card for inline display
 * Shows: Cover image, name, starting price, rating, tags
 * Rating can be overridden dynamically (e.g. from live reviews)
 */

import { motion } from 'framer-motion';
import { Star, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Property } from '@/data/properties';
import UnifiedImage from '@/components/UnifiedImage';

interface PropertyCardCompactProps {
  property: Property;
  onViewDetails: (property: Property) => void;
  /** Dynamic rating override — when provided, replaces the static property.rating */
  dynamicRating?: number;
  /** Dynamic review count override */
  dynamicReviewCount?: number;
}

const getCategoryTags = (category: Property['category']): string[] => {
  switch (category) {
    case 'luxury':
      return ['Luxury', 'Views', 'Breakfast'];
    case 'hostel':
      return ['Hostel', 'Social', 'Backpacker'];
    default:
      return ['Budget'];
  }
};

export const PropertyCardCompact = ({ property, onViewDetails, dynamicRating, dynamicReviewCount }: PropertyCardCompactProps) => {
  const tags = getCategoryTags(property.category);

  // Use dynamic rating from reviews if available, otherwise fall back to static
  const displayRating = dynamicRating !== undefined && dynamicRating > 0
    ? dynamicRating
    : property.rating;
  const displayReviewCount = dynamicReviewCount !== undefined
    ? dynamicReviewCount
    : property.reviewCount;

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={() => onViewDetails(property)}
      className="w-full h-full text-left group"
    >
      <div className={cn(
        "h-full flex flex-col rounded-2xl overflow-hidden border transition-shadow duration-300",
        "bg-card/50 border-border/30",
        "hover:border-border/50 hover:bg-card/70",
        "hover:shadow-xl hover:shadow-primary/5",
        "hover:-translate-y-0.5 transition-transform duration-300"
      )}>
        {/* Image Section */}
        <div className="relative w-full flex-shrink-0 overflow-hidden" style={{ aspectRatio: '16/10' }}>
          <UnifiedImage
            src={property.heroImage}
            alt={`${property.name} - ${property.category} accommodation in Shillong, Meghalaya`}
            className="absolute inset-0 w-full h-full object-cover"
            priority
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          
          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className={cn(
              "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-xs",
              property.category === 'luxury' 
                ? "bg-amber-500/90 text-white" 
                : "bg-emerald-500/90 text-white"
            )}>
              {property.category === 'luxury' ? 'Luxury' : 'Hostel'}
            </span>
          </div>

          {/* Rating Badge — only show if there are reviews */}
          {displayReviewCount > 0 && (
            <div className="absolute top-3 right-3">
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-black/60 backdrop-blur-xs">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span className="text-xs font-semibold text-white">{displayRating}</span>
              </div>
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Property name */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-base sm:text-lg font-bold text-white mb-1 line-clamp-1">
              {property.name}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-white/80">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Shillong, Meghalaya</span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col flex-grow p-4">
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tags.slice(0, 3).map((tag, i) => (
              <span 
                key={i}
                className="px-2 py-1 rounded-md bg-muted/50 text-[11px] text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex-grow" />

          {/* Price & CTA */}
          <div className="flex flex-col gap-3">
            <div className="flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-bold text-foreground">
                ₹{property.priceRange.min.toLocaleString()}
              </span>
              <span className="text-xs text-muted-foreground">/night</span>
            </div>
            <span className={cn(
              "w-full text-center py-3 rounded-xl text-sm font-semibold transition-all duration-200",
              "bg-primary/20 text-primary",
              "group-hover:bg-primary group-hover:text-primary-foreground"
            )}>
              View Details
            </span>
          </div>
        </div>
      </div>
    </motion.button>
  );
};

export default PropertyCardCompact;
