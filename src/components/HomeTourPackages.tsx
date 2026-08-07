import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Globe, MapPin, Compass, Heart, Bike } from "lucide-react";
import { Link } from "react-router-dom";
import { LazyTourPackageModal } from "@/components/lazy/LazyTourPackageModal";
import { useApp } from "@/contexts/AppContext";
import { useComponentTracking } from "@/hooks/useComponentTracking";
import TravelTourCard from "@/components/travel/TravelTourCard";
import type { TourPackage } from "@/data/travelData";
import {
  northeastTours,
  coupleLuxuryTours,
  soloAndBikeTours,
  internationalTours,
  mergeItinerary,
} from "@/data/travelData";

// NE India locations for filtering
const NE_LOCATIONS = ["Meghalaya", "Arunachal Pradesh", "Sikkim", "Assam", "Manipur", "Mizoram", "Tripura", "Nagaland"];

// Build domestic packages from NE tours — pick best from each state, Meghalaya first
const domesticPackages: TourPackage[] = (() => {
  const allNE = Object.values(northeastTours).flat().map(mergeItinerary);
  // Curated selection: pick top-rated from Meghalaya first, then other NE states
  const meghalaya = allNE.filter(t => t.location === "Meghalaya");
  const otherNE = allNE.filter(t => t.location !== "Meghalaya");
  // Take top 4 Meghalaya + top 2 other NE
  const sorted = (arr: TourPackage[]) => [...arr].sort((a, b) => b.rating - a.rating);
  return [...sorted(meghalaya).slice(0, 4), ...sorted(otherNE).slice(0, 2)];
})();

// Couple packages from travelData
const couplePackages: TourPackage[] = coupleLuxuryTours;

// Solo & Bike packages from travelData
const soloPackages: TourPackage[] = soloAndBikeTours;

// International packages — pick top from each region
const internationalPackages: TourPackage[] = (() => {
  const all = Object.values(internationalTours).flat().map(mergeItinerary);
  return [...all].sort((a, b) => b.rating - a.rating).slice(0, 6);
})();

type TabKey = "domestic" | "couples" | "solo" | "international";

const TAB_CONFIG: { key: TabKey; label: string; icon: React.ElementType; packages: TourPackage[] }[] = [
  { key: "domestic", label: "Domestic", icon: MapPin, packages: domesticPackages },
  { key: "couples", label: "Couples", icon: Heart, packages: couplePackages },
  { key: "solo", label: "Solo & Bike", icon: Bike, packages: soloPackages },
  { key: "international", label: "International", icon: Globe, packages: internationalPackages },
];

interface HomeTourPackagesProps {
  className?: string;
}

const HomeTourPackages: React.FC<HomeTourPackagesProps> = ({ className }) => {
  const { formatPrice } = useApp();
  const [activeTab, setActiveTab] = useState<TabKey>("domestic");
  const [selectedPackage, setSelectedPackage] = useState<TourPackage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { trackButton, trackCTA, trackCardClick, trackModalOpen } = useComponentTracking({ section: "tour_packages" });

  const currentConfig = TAB_CONFIG.find(t => t.key === activeTab)!;
  const currentPackages = currentConfig.packages;

  const handlePackageSelect = (tour: TourPackage) => {
    trackCardClick(tour.title, "tour_package", {
      package_id: String(tour.id),
      package_category: tour.category,
      package_price: tour.price,
    });
    trackModalOpen(`package_${tour.id}`);
    setSelectedPackage({
      ...tour,
      images: tour.images || [tour.image],
    });
    setIsModalOpen(true);
  };

  const handleTabChange = (tab: TabKey) => {
    trackButton(`tab_${tab}`, { previous_tab: activeTab });
    setActiveTab(tab);
  };

  return (
    <section className={`relative py-8 md:py-12 bg-background ${className}`}>
      <div className="container mx-auto px-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Compass className="w-4 h-4" />
            Curated Travel Experiences
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Explore Tour Packages
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Handpicked adventures across Meghalaya & Northeast India. Every journey tells a story.
          </p>
        </motion.div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex flex-wrap justify-center bg-muted/50 backdrop-blur-sm rounded-full p-1.5 border border-border/50 gap-1">
            {TAB_CONFIG.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => handleTabChange(key)}
                className={`flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === key
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Couple discount banner */}
        {activeTab === "couples" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-gradient-to-r from-rose-500/10 to-pink-500/10 border border-rose-500/20 rounded-2xl p-4 text-center"
          >
            <span className="inline-flex items-center gap-1.5 bg-rose-500 text-white px-3 py-1 rounded-full text-xs font-bold">
              <Heart className="h-3 w-3 fill-white" /> 15% Exclusive Couple Discount
            </span>
            <p className="text-xs text-muted-foreground mt-2">
              Includes XTSY 270 Panorama Glass Ensuite stay • Private touring • Romantic add-ons
            </p>
          </motion.div>
        )}

        {activeTab === "solo" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-gradient-to-r from-violet-500/10 to-indigo-500/10 border border-violet-500/20 rounded-2xl p-4 text-center"
          >
            <span className="inline-flex items-center gap-1.5 bg-violet-500 text-white px-3 py-1 rounded-full text-xs font-bold">
              <Bike className="h-3 w-3" /> Solo Traveller Pass
            </span>
            <p className="text-xs text-muted-foreground mt-2">
              24/7 safety support • Women-only batches • Royal Enfield included on bike tours • GPS tracked
            </p>
          </motion.div>
        )}

        {/* Tour Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {currentPackages.map(pkg => (
            <TravelTourCard key={pkg.id} tour={pkg} onSelect={handlePackageSelect} />
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link to="/travel" onClick={() => trackCTA("view_all_packages", { tab: activeTab, package_count: currentPackages.length })}>
            <Button
              variant="outline"
              size="lg"
              className="group border-primary/30 hover:border-primary hover:bg-primary/5"
            >
              View All Tour Packages
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>

      {isModalOpen && selectedPackage && (
        <LazyTourPackageModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          tourPackage={selectedPackage}
        />
      )}
    </section>
  );
};

export default HomeTourPackages;
