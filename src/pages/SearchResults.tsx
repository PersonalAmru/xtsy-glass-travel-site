/**
 * SearchResults - Dedicated property search results page
 * Displays available properties based on search criteria
 * Allows inline modification of search params - the FINAL place for changes
 * Future-ready for channel manager integration
 */

import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Grid, List, Building2, Pencil, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { getPropertiesByLocation, getLocationById, Property, getAllActiveProperties } from "@/data/properties";
import { PropertyCardCompact } from "@/components/property/PropertyCardCompact";
import { ShinyButton } from "@/components/ui/shiny-button";
import { Button } from "@/components/ui/button";
import { useComponentTracking } from "@/hooks/useComponentTracking";
import { SearchEditBar } from "@/components/search/SearchEditBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const SearchResults = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [properties, setProperties] = useState<Property[]>([]);
  const [showEditBar, setShowEditBar] = useState(false);
  
  const { trackCTA, trackCardClick, trackButton } = useComponentTracking({ section: 'search_results' });

  // Parse search params - prefer URL, fallback to sessionStorage
  const getInitialParams = useCallback(() => {
    const urlLocation = searchParams.get('location');
    const urlCheckIn = searchParams.get('checkIn');
    const urlCheckOut = searchParams.get('checkOut');
    const urlGuests = searchParams.get('guests');

    // If URL has params, use them
    if (urlLocation && urlCheckIn && urlCheckOut) {
      return {
        location: urlLocation,
        checkIn: urlCheckIn,
        checkOut: urlCheckOut,
        guests: parseInt(urlGuests || '2', 10),
      };
    }

    // Fallback to sessionStorage
    try {
      const stored = sessionStorage.getItem('xtsy_search_params');
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          location: parsed.location || 'shillong',
          checkIn: parsed.checkIn || null,
          checkOut: parsed.checkOut || null,
          guests: parsed.guests || 2,
        };
      }
    } catch (e) {
      console.error('Error parsing session storage:', e);
    }

    return {
      location: 'shillong',
      checkIn: null,
      checkOut: null,
      guests: 2,
    };
  }, [searchParams]);

  const [currentSearch, setCurrentSearch] = useState(getInitialParams);

  const locationData = getLocationById(currentSearch.location);

  // Sync session storage on mount and when params change
  useEffect(() => {
    const params = getInitialParams();
    setCurrentSearch(params);
    
    // Store in sessionStorage for persistence
    if (params.checkIn && params.checkOut) {
      sessionStorage.setItem('xtsy_search_params', JSON.stringify(params));
    }
  }, [searchParams, getInitialParams]);

  useEffect(() => {
    // Fetch properties for location
    const locationProperties = getPropertiesByLocation(currentSearch.location);
    setProperties(locationProperties.length > 0 ? locationProperties : getAllActiveProperties());
  }, [currentSearch.location]);

  const handleSearchUpdate = useCallback((params: {
    location: string;
    checkIn: string;
    checkOut: string;
    guests: number;
  }) => {
    setCurrentSearch(params);
    // SessionStorage is updated in SearchEditBar
  }, []);

  const handleViewDetails = (property: Property) => {
    trackCardClick(property.name, 'property', {
      property_id: property.id,
      property_location: property.locationId,
      search_context: true,
    });

    // Ensure search context is stored for booking flow
    if (currentSearch.checkIn && currentSearch.checkOut) {
      sessionStorage.setItem('xtsy_search_params', JSON.stringify(currentSearch));
    }

    navigate(`/properties/${property.id}`);
  };

  const handleBackToHome = () => {
    trackButton('back_to_home');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Header />
      
      <main className="pt-20 pb-16">
        {/* Sticky Header with Edit Toggle */}
        <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-lg border-b border-border/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBackToHome}
                  className="text-muted-foreground hover:text-foreground hover:bg-accent"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                  <h1 className="text-lg font-semibold text-foreground">
                    {locationData?.name || 'All Locations'}
                    {locationData && <span className="text-muted-foreground font-normal ml-1">• {locationData.state}</span>}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {properties.length} {properties.length === 1 ? 'property' : 'properties'} available
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowEditBar(!showEditBar)}
                  className={cn(
                    "gap-2",
                    showEditBar && "bg-primary/10 border-primary/30 text-primary"
                  )}
                >
                  {showEditBar ? <X className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
                  {showEditBar ? 'Hide' : 'Edit Search'}
                </Button>

                <div className="flex items-center border border-border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      "p-2 transition-colors",
                      viewMode === 'grid' 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-background text-muted-foreground hover:text-foreground"
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
                        ? "bg-primary text-primary-foreground" 
                        : "bg-background text-muted-foreground hover:text-foreground"
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

        {/* Editable Search Bar - The FINAL place for modifications */}
        {showEditBar && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b border-border/30 bg-muted/30"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="mb-2">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                  ✏️ Modify your search — This is the final place to make changes before booking
                </p>
              </div>
              <SearchEditBar
                location={currentSearch.location}
                checkIn={currentSearch.checkIn}
                checkOut={currentSearch.checkOut}
                guests={currentSearch.guests}
                onSearchUpdate={handleSearchUpdate}
              />
            </div>
          </motion.div>
        )}

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
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                Available Properties
              </h2>
            </div>
            <p className="text-muted-foreground">
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
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                <Building2 className="w-10 h-10 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                No properties found
              </h2>
              <p className="text-muted-foreground mb-6">
                We couldn't find any properties matching your search criteria.
              </p>
              <ShinyButton onClick={() => setShowEditBar(true)}>
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
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    More Properties Coming Soon
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    We're expanding to new locations. Channel manager integration with Booking.com, MMT, Hostelworld & more.
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="bg-background border-primary/30 text-primary hover:bg-primary/10 whitespace-nowrap"
                  onClick={() => {
                    trackButton('notify_new_properties');
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
