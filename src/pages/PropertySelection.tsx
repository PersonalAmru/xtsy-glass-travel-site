/**
 * PropertySelection - Property display page after location selection
 * Shows all properties in the selected location as a booking engine
 */

import { useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { 
  ChevronLeft, 
  MapPin, 
  Star, 
  Users, 
  Calendar, 
  Sparkles,
  ChevronRight,
  Building2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getPropertiesByLocation, getLocationById, Property } from '@/data/properties';
import UnifiedImage from '@/components/UnifiedImage';

const PropertySelection = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const locationId = searchParams.get('location') || 'shillong';
  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');
  const guests = parseInt(searchParams.get('guests') || '2');

  const location = getLocationById(locationId);
  const properties = useMemo(() => getPropertiesByLocation(locationId), [locationId]);

  // Format dates for display
  const formattedCheckIn = checkIn ? format(parseISO(checkIn), 'EEE, MMM d') : '';
  const formattedCheckOut = checkOut ? format(parseISO(checkOut), 'EEE, MMM d') : '';

  const handlePropertySelect = (property: Property) => {
    // Navigate to property-specific booking flow
    const params = new URLSearchParams({
      ...(checkIn && { checkIn }),
      ...(checkOut && { checkOut }),
      guests: guests.toString(),
    });
    navigate(`/${locationId}/${property.slug}/book?${params.toString()}`);
  };

  const handleBack = () => {
    navigate('/');
  };

  if (!location) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <p className="text-white/60">Location not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="flex items-center justify-between px-4 h-16 max-w-4xl mx-auto">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleBack}
            className="flex items-center gap-1 text-white/80 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </motion.button>

          <div className="text-center">
            <div className="flex items-center gap-2 text-white">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="font-semibold">{location.name}</span>
            </div>
            <p className="text-xs text-white/50">{location.state}</p>
          </div>

          <div className="w-16" />
        </div>
      </header>

      {/* Search Summary */}
      {(checkIn && checkOut) && (
        <div className="px-4 py-4 border-b border-white/5">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full text-white/70">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formattedCheckIn} → {formattedCheckOut}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full text-white/70">
                <Users className="w-3.5 h-3.5" />
                <span>{guests} Guest{guests > 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="relative z-10 px-4 py-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Choose Your Property
          </h1>
          <p className="text-white/60">
            {properties.length} {properties.length === 1 ? 'property' : 'properties'} available in {location.name}
          </p>
        </motion.div>

        {/* Property Cards */}
        <div className="space-y-6">
          {properties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => handlePropertySelect(property)}
                className="w-full text-left"
              >
                <div className={cn(
                  "rounded-3xl overflow-hidden border transition-all duration-300",
                  "bg-white/5 border-white/10 hover:border-white/20",
                  "hover:bg-white/[0.07] hover:shadow-xl hover:shadow-primary/5"
                )}>
                  {/* Image Section */}
                  <div className="relative aspect-[16/9] sm:aspect-[21/9]">
                    <UnifiedImage
                      src={property.heroImage}
                      alt={property.name}
                      className="w-full h-full object-cover"
                      priority={index === 0}
                    />
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className={cn(
                        "px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm",
                        property.category === 'luxury' 
                          ? "bg-amber-500/90 text-white" 
                          : "bg-emerald-500/90 text-white"
                      )}>
                        {property.category === 'luxury' ? 'Luxury' : 'Hostel'}
                      </span>
                    </div>

                    {/* Rating Badge */}
                    <div className="absolute top-4 right-4">
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span className="text-sm font-semibold text-white">{property.rating}</span>
                      </div>
                    </div>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>

                  {/* Content Section */}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h2 className="text-xl font-bold text-white mb-1 truncate">
                          {property.name}
                        </h2>
                        <p className="text-sm text-white/60 line-clamp-2 mb-3">
                          {property.description}
                        </p>
                        
                        {/* Amenities Preview */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {property.amenities.slice(0, 3).map((amenity, i) => (
                            <span 
                              key={i}
                              className="px-2 py-1 rounded-md bg-white/5 text-xs text-white/70"
                            >
                              {amenity}
                            </span>
                          ))}
                          {property.amenities.length > 3 && (
                            <span className="px-2 py-1 rounded-md bg-white/5 text-xs text-white/50">
                              +{property.amenities.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Price & CTA */}
                      <div className="text-right flex-shrink-0">
                        <div className="mb-3">
                          <p className="text-xs text-white/40">Starting from</p>
                          <p className="text-xl font-bold text-white">
                            ₹{property.priceRange.min.toLocaleString()}
                          </p>
                          <p className="text-xs text-white/40">per night</p>
                        </div>
                      </div>
                    </div>

                    {/* Select Button */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div className="flex items-center gap-2 text-sm text-white/50">
                        <Building2 className="w-4 h-4" />
                        <span>{property.roomTypeIds.length} room types</span>
                      </div>
                      <div className="flex items-center gap-2 text-primary font-semibold">
                        <span>View Rooms</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {properties.length === 0 && (
          <div className="text-center py-16">
            <Building2 className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/60">No properties available in this location</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default PropertySelection;
