import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOContent from "@/components/SEOContent";
import { SEOHead } from "@/components/SEOHead";
import { LazyTourPackageModal } from "@/components/lazy/LazyTourPackageModal";
import type { TourPackage, TravelFilters } from "@/data/travelData";
import { getAllTours, filterTours, mergeItinerary } from "@/data/travelData";

// Modular sections
import TravelHero from "@/components/travel/TravelHero";
import TravelExclusives from "@/components/travel/TravelExclusives";
import TravelCoupleAndSolo from "@/components/travel/TravelCoupleAndSolo";
import TravelNortheast from "@/components/travel/TravelNortheast";
import TravelHimalayas from "@/components/travel/TravelHimalayas";
import TravelInternational from "@/components/travel/TravelInternational";
import TravelFiltersBar from "@/components/travel/TravelFiltersBar";
import TravelTrustSignals from "@/components/travel/TravelTrustSignals";
import TravelFinalCTA from "@/components/travel/TravelFinalCTA";
import TravelSectionHeader from "@/components/travel/TravelSectionHeader";
import TravelTourCard from "@/components/travel/TravelTourCard";
import TravelPromoBanners from "@/components/travel/TravelPromoBanners";

import incredibleIndiaLogo from "@/assets/incredible-india-logo.png";

const Travel = () => {
  const location = useLocation();
  const [selectedPackage, setSelectedPackage] = useState<TourPackage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState<TravelFilters>({
    destination: "all",
    theme: "all",
    duration: "all",
    budget: "all",
    season: "all",
  });

  const isFiltering = Object.values(filters).some(v => v !== "all");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.search]);

  const handleSelect = (tour: TourPackage) => {
    setSelectedPackage(mergeItinerary(tour));
    setIsModalOpen(true);
  };

  const filteredTours = isFiltering ? filterTours(getAllTours(), filters) : [];

  return (
    <div className="min-h-screen flex flex-col">
      <SEOContent page="travel" />
      <Header />

      <main className="flex-1">
        <TravelHero />
        <TravelFiltersBar filters={filters} onChange={setFilters} />

        {isFiltering ? (
          <section className="py-12 sm:py-16 bg-background">
            <div className="container mx-auto px-4 sm:px-6">
              <TravelSectionHeader
                title={`${filteredTours.length} Tour${filteredTours.length !== 1 ? 's' : ''} Found`}
                subtitle="Showing results matching your selected filters."
              />
              {filteredTours.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {filteredTours.map(tour => (
                    <TravelTourCard key={tour.id} tour={tour} onSelect={handleSelect} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-lg text-muted-foreground mb-4">No tours match your current filters.</p>
                  <button
                    onClick={() => setFilters({ destination: "all", theme: "all", duration: "all", budget: "all", season: "all" })}
                    className="text-primary font-semibold hover:underline"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </section>
        ) : (
          <>
            <TravelExclusives onSelect={handleSelect} />
            <TravelCoupleAndSolo onSelect={handleSelect} />
            <TravelNortheast onSelect={handleSelect} />
            <TravelHimalayas onSelect={handleSelect} />
            <TravelInternational onSelect={handleSelect} />
          </>
        )}

        <TravelTrustSignals />

        <section className="py-8 bg-background border-t border-border">
          <div className="container mx-auto px-4 text-center">
            <img
              src={incredibleIndiaLogo}
              alt="Incredible India — Official Tourism Partner"
              className="h-12 sm:h-16 w-auto mx-auto mb-2 object-contain"
              loading="lazy"
            />
            <p className="text-xs text-muted-foreground">Proud Partner of India Tourism</p>
          </div>
        </section>

        <TravelFinalCTA />
      </main>

      <Footer />

      <TravelPromoBanners />

      <LazyTourPackageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tourPackage={selectedPackage as any}
      />
    </div>
  );
};

export default Travel;
