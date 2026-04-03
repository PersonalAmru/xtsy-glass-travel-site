import { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import ToursHero from "@/components/tours/ToursHero";
import DestinationGrid from "@/components/tours/DestinationGrid";
import TourListingCard from "@/components/tours/TourListingCard";
import TourFiltersSidebar, { type MarketplaceFilters, DEFAULT_MARKETPLACE_FILTERS } from "@/components/tours/TourFiltersSidebar";
import ExperienceHighlights from "@/components/tours/ExperienceHighlights";
import UniqueExperiences from "@/components/tours/UniqueExperiences";
import SignatureExperiences from "@/components/tours/SignatureExperiences";
import ToursCTA from "@/components/tours/ToursCTA";
import { LazyTourPackageModal } from "@/components/lazy/LazyTourPackageModal";
import { getAllTours, mergeItinerary } from "@/data/travelData";
import type { TourPackage } from "@/data/travelData";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";

// Generate slug from tour title
const toSlug = (title: string) =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const Tours = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedPackage, setSelectedPackage] = useState<TourPackage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Initialize filters from URL params
  const [filters, setFilters] = useState<MarketplaceFilters>(() => ({
    destination: searchParams.get("destination") || "all",
    duration: searchParams.get("duration") || "all",
    priceRange: searchParams.get("price") || "all",
    experience: searchParams.get("type") || "all",
    sortBy: searchParams.get("sort") || "popularity",
  }));

  // Sync filters to URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.destination !== "all") params.set("destination", filters.destination);
    if (filters.duration !== "all") params.set("duration", filters.duration);
    if (filters.priceRange !== "all") params.set("price", filters.priceRange);
    if (filters.experience !== "all") params.set("type", filters.experience);
    if (filters.sortBy !== "popularity") params.set("sort", filters.sortBy);
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  const allTours = useMemo(() => getAllTours(), []);

  const filteredTours = useMemo(() => {
    let tours = [...allTours];

    // Destination
    if (filters.destination !== "all") {
      tours = tours.filter(t => t.location === filters.destination);
    }

    // Duration
    if (filters.duration !== "all") {
      tours = tours.filter(t => {
        const days = parseInt(t.duration);
        if (filters.duration === "short") return days <= 3;
        if (filters.duration === "medium") return days >= 4 && days <= 6;
        if (filters.duration === "long") return days >= 7;
        return true;
      });
    }

    // Price
    if (filters.priceRange !== "all") {
      tours = tours.filter(t => {
        const price = parseInt(t.price.replace(/[^\d]/g, ''));
        if (filters.priceRange === "budget") return price < 15000;
        if (filters.priceRange === "mid") return price >= 15000 && price <= 35000;
        if (filters.priceRange === "premium") return price > 35000;
        return true;
      });
    }

    // Experience type
    if (filters.experience !== "all") {
      tours = tours.filter(t => t.category === filters.experience);
    }

    // Sort
    if (filters.sortBy === "price-low") {
      tours.sort((a, b) => parseInt(a.price.replace(/[^\d]/g, '')) - parseInt(b.price.replace(/[^\d]/g, '')));
    } else if (filters.sortBy === "price-high") {
      tours.sort((a, b) => parseInt(b.price.replace(/[^\d]/g, '')) - parseInt(a.price.replace(/[^\d]/g, '')));
    } else if (filters.sortBy === "rating") {
      tours.sort((a, b) => b.rating - a.rating);
    } else {
      // Popularity: exclusives first, then by rating
      tours.sort((a, b) => {
        if (a.exclusive && !b.exclusive) return -1;
        if (!a.exclusive && b.exclusive) return 1;
        return b.rating - a.rating;
      });
    }

    return tours;
  }, [allTours, filters]);

  const handleSelect = useCallback((tour: TourPackage) => {
    const slug = toSlug(tour.title);
    navigate(`/tours/${slug}`, { state: { tour: mergeItinerary(tour) } });
  }, [navigate]);

  const handleHeroSearch = useCallback((heroFilters: { destination: string; duration: string; month: string; budget: string }) => {
    setFilters({
      destination: heroFilters.destination,
      duration: heroFilters.duration,
      priceRange: heroFilters.budget,
      experience: "all",
      sortBy: "popularity",
    });
    document.getElementById("tour-listings")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleDestinationClick = useCallback((dest: string) => {
    setFilters(prev => ({ ...prev, destination: dest }));
    document.getElementById("tour-listings")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead
        title="North East India Tour Packages 2026 | XTSY Travel"
        description="30+ curated tour packages across Meghalaya, Nagaland, Assam, Arunachal Pradesh & Sikkim. Living root bridges, wildlife safaris, tribal festivals. Starting ₹7,999."
        keywords="Northeast India tours, Meghalaya tour packages, Nagaland tours, Assam safari, Arunachal Pradesh trips, Sikkim tours, North East India travel"
        canonicalUrl="https://xtsy.one/tours"
      />
      <Header />

      <main className="flex-1">
        <ToursHero onSearch={handleHeroSearch} />
        <DestinationGrid onDestinationClick={handleDestinationClick} />

        {/* Tour Listings */}
        <section id="tour-listings" className="py-10 sm:py-14 tours-section-bg">
          <div className="container mx-auto px-4 sm:px-6">
            {/* Section header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-white mb-1">
                  All Tour Packages
                </h2>
                <p className="text-sm text-muted-foreground">
                  {filteredTours.length} curated experience{filteredTours.length !== 1 ? 's' : ''} available
                </p>
              </div>
              {/* Mobile filter toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden border-emerald-500/30 text-emerald-400"
              >
                <SlidersHorizontal className="h-4 w-4 mr-1.5" />
                Filters
              </Button>
            </div>

            <div className="flex gap-6">
              {/* Desktop sidebar */}
              <aside className="hidden lg:block w-64 flex-shrink-0">
                <TourFiltersSidebar
                  filters={filters}
                  onChange={setFilters}
                  tourCount={filteredTours.length}
                />
              </aside>

              {/* Tour grid */}
              <div className="flex-1">
                {filteredTours.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                    {filteredTours.map(tour => (
                      <TourListingCard key={tour.id} tour={tour} onSelect={handleSelect} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <p className="text-lg text-muted-foreground mb-4">No tours match your filters.</p>
                    <Button
                      variant="outline"
                      onClick={() => setFilters(DEFAULT_MARKETPLACE_FILTERS)}
                      className="border-emerald-500/30 text-emerald-400"
                    >
                      Clear all filters
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <SignatureExperiences />
        <ExperienceHighlights />
        <UniqueExperiences />
        <ToursCTA />
      </main>

      <Footer />

      {/* Mobile filters overlay */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowMobileFilters(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-background overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-border/30">
              <h3 className="font-semibold text-white">Filters</h3>
              <button onClick={() => setShowMobileFilters(false)}>
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
            <div className="p-4">
              <TourFiltersSidebar
                filters={filters}
                onChange={setFilters}
                tourCount={filteredTours.length}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tours;
