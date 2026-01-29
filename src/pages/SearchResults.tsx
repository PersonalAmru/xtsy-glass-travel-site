/**
 * SearchResults - Dedicated property search results page
 * Displays available properties based on search criteria
 * Future-ready for channel manager integration
 */

import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Calendar, Users, Filter, Grid, List, Building2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { getPropertiesByLocation, getLocationById, Property, getAllActiveProperties } from "@/data/properties";
import { PropertyCardCompact } from "@/components/property/PropertyCardCompact";
import { ShinyButton } from "@/components/ui/shiny-button";
import { Button } from "@/components/ui/button";
import { useComponentTracking } from "@/hooks/useComponentTracking";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const SearchResults = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [properties, setProperties] = useState<Property[]>([]);
  
  const { trackCTA, trackCardClick, trackButton } = useComponentTracking({ section: 'search_results' });

  // Parse search params
  const location = searchParams.get('location') || 'shillong';
  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');
  const guests = parseInt(searchParams.get('guests') || '2', 10);

  const locationData = getLocationById(location);

  useEffect(() => {
    // Fetch properties for location
    const locationProperties = getPropertiesByLocation(location);
    setProperties(locationProperties.length > 0 ? locationProperties : getAllActiveProperties());
  }, [location]);

  const handleViewDetails = (property: Property) => {
    trackCardClick(property.name, 'property', {
      property_id: property.id,
      property_location: property.locationId,
      search_context: true,
    });

    // Store search context for booking flow
    if (checkIn && checkOut) {
      sessionStorage.setItem('xtsy_search_params', JSON.stringify({
        location,
        checkIn,
        checkOut,
        guests,
      }));
    }

    navigate(`/properties/${property.id}`);
  };

  const handleBackToHome = () => {
    trackButton('back_to_home');
    navigate('/');
  };

  const handleModifySearch = () => {
    trackButton('modify_search');
    navigate('/');
  };

  // Format dates for display
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Select date';
    try {
      return format(new Date(dateStr), 'MMM dd, yyyy');
    } catch {
      return 'Select date';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Header />
      
      <main className="pt-20 pb-16">
        {/* Search Summary Bar */}
        <div className="sticky top-16 z-40 bg-slate-900/95 backdrop-blur-lg border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              {/* Back button and search summary */}
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBackToHome}
                  className="text-white/70 hover:text-white hover:bg-white/10"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>

                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm">
                  <div className="flex items-center gap-1.5 text-white/80">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="font-medium">
                      {locationData?.name || 'All Locations'}
                      {locationData && <span className="text-white/50 ml-1">{locationData.state}</span>}
                    </span>
                  </div>

                  {checkIn && checkOut && (
                    <div className="flex items-center gap-1.5 text-white/60">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(checkIn)} - {formatDate(checkOut)}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 text-white/60">
                    <Users className="w-4 h-4" />
                    <span>{guests} Guest{guests !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleModifySearch}
                  className="bg-white/5 border-white/20 text-white hover:bg-white/10 flex-1 sm:flex-none"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Modify Search
                </Button>

                <div className="flex items-center border border-white/20 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      "p-2 transition-colors",
                      viewMode === 'grid' 
                        ? "bg-primary text-white" 
                        : "bg-white/5 text-white/60 hover:text-white"
                    )}
                    aria-label="Grid view"
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={cn(
                      "p-2 transition-colors",
                      viewMode === 'list' 
                        ? "bg-primary text-white" 
                        : "bg-white/5 text-white/60 hover:text-white"
                    )}
                    aria-label="List view"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Results Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <Building2 className="w-6 h-6 text-primary" />
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Available Properties
              </h1>
            </div>
            <p className="text-white/60">
              {properties.length} {properties.length === 1 ? 'property' : 'properties'} found
              {locationData && ` in ${locationData.name}, ${locationData.state}`}
            </p>
          </motion.div>

          {/* Property Grid/List */}
          {properties.length > 0 ? (
            <div className={cn(
              "gap-6",
              viewMode === 'grid' 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" 
                : "flex flex-col"
            )}>
              {properties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(viewMode === 'list' && "w-full")}
                >
                  <PropertyCardCompact
                    property={property}
                    onViewDetails={handleViewDetails}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
                <Building2 className="w-10 h-10 text-white/30" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">
                No properties found
              </h2>
              <p className="text-white/60 mb-6">
                We couldn't find any properties matching your search criteria.
              </p>
              <ShinyButton onClick={handleModifySearch}>
                Modify Search
              </ShinyButton>
            </motion.div>
          )}

          {/* Future Channel Manager Placeholder */}
          {properties.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-primary/10 to-orange-500/10 border border-primary/20"
            >
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    More Properties Coming Soon
                  </h3>
                  <p className="text-white/60 text-sm">
                    We're expanding to new locations. Channel manager integration with Booking.com, MMT, Hostelworld & more.
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="bg-white/5 border-primary/30 text-primary hover:bg-primary/10 whitespace-nowrap"
                  onClick={() => {
                    trackButton('notify_new_properties');
                    // Future: Open notification signup modal
                  }}
                >
                  Get Notified
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SearchResults;
