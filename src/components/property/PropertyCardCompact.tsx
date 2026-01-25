/**
 * PropertyCardCompact - Compact property card for inline display
 * Shows: Cover image, name, starting price, rating, tags
 */

import { motion } from 'framer-motion';
import { Star, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Property } from '@/data/properties';
import UnifiedImage from '@/components/UnifiedImage';

interface PropertyCardCompactProps {
  property: Property;
  onViewDetails: (property: Property) => void;
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

export const PropertyCardCompact = ({ property, onViewDetails }: PropertyCardCompactProps) => {
  const tags = getCategoryTags(property.category);

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={() => onViewDetails(property)}
      className="w-full text-left group"
    >
      <div className={cn(
        "rounded-2xl overflow-hidden border transition-all duration-300",
        "bg-white/5 border-white/10 hover:border-white/20",
        "hover:bg-white/[0.07] hover:shadow-xl hover:shadow-primary/5",
        "min-w-[280px] md:min-w-[320px] lg:min-w-[360px]"
      )}>
        {/* Image Section */}
        <div className="relative aspect-[4/3] md:aspect-[16/10]">
          <UnifiedImage
            src={property.heroImage}
            alt={property.name}
            className="w-full h-full object-cover"
          />
          
          {/* Category Badge */}
          <div className="absolute top-2 left-2">
            <span className={cn(
              "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm",
              property.category === 'luxury' 
                ? "bg-amber-500/90 text-white" 
                : "bg-emerald-500/90 text-white"
            )}>
              {property.category === 'luxury' ? 'Luxury' : 'Hostel'}
            </span>
          </div>

          {/* Rating Badge */}
          <div className="absolute top-2 right-2">
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span className="text-xs font-semibold text-white">{property.rating}</span>
            </div>
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

          {/* Bottom Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h3 className="text-sm font-bold text-white truncate mb-1">
              {property.name}
            </h3>
            <div className="flex items-center gap-1 text-xs text-white/70">
              <MapPin className="w-3 h-3" />
              <span>Shillong</span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-3">
          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {tags.slice(0, 2).map((tag, i) => (
              <span 
                key={i}
                className="px-1.5 py-0.5 rounded bg-white/5 text-[10px] text-white/60"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Price & CTA */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex-shrink-0">
              <p className="text-[10px] text-white/40 uppercase">From</p>
              <p className="text-base sm:text-lg font-bold text-white leading-tight">
                ₹{property.priceRange.min.toLocaleString()}
              </p>
              <p className="text-[10px] text-white/40">/night</p>
            </div>
            <span className={cn(
              "px-3 py-1.5 rounded-full text-xs font-semibold transition-colors whitespace-nowrap flex-shrink-0",
              "bg-primary/20 text-primary group-hover:bg-primary group-hover:text-white"
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
