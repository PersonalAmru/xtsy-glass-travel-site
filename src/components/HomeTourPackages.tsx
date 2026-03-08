import React, { useState, useMemo, memo } from "react";
import { motion } from "framer-motion";
import { OptimizedFocusRail, FocusRailItem } from "@/components/OptimizedFocusRail";
import { Button } from "@/components/ui/button";
import { ArrowRight, Globe, MapPin, Compass, Heart, Bike } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { LazyTourPackageModal } from "@/components/lazy/LazyTourPackageModal";
import { useApp } from "@/contexts/AppContext";
import { useComponentTracking } from "@/hooks/useComponentTracking";

// Use URL references instead of eager imports - Vite handles these as separate assets
// This prevents bundling 12 large images into the JS chunk
const imgUrl = (path: string) => new URL(`../assets/${path}`, import.meta.url).href;


// Domestic tour packages
const domesticPackages = [
  {
    id: 204, title: "Wari Chora - Hidden Gem of Meghalaya",
    description: "Trek through untamed forests, rappel down pristine waterfalls, and experience extreme wilderness camping",
    duration: "5 Days", difficulty: "Challenging", price: "₹48,500",
    image: imgUrl("wari-chora-authentic.jpg"), rating: 4.9, category: "adventure", location: "Meghalaya",
    highlights: ["Waterfall Rappelling", "Wilderness Camping", "Night Trek"],
  },
  {
    id: 1, title: "Double Decker Root Bridge & Cherrapunji",
    description: "Trek through pristine winter forests to discover 500-year-old living bridges",
    duration: "5 Days", difficulty: "Moderate", price: "₹29,500",
    image: imgUrl("double-decker-bridge-new.jpg"), rating: 4.8, category: "adventure", location: "Meghalaya",
    highlights: ["Double Decker Root Bridge", "Rainbow Falls", "Bio-Luminescent Cave"],
  },
  {
    id: 4, title: "Dawki Crystal Waters Winter Escape",
    description: "Experience the world's clearest river — boat rides reveal the riverbed 20 feet below",
    duration: "3 Days", difficulty: "Easy", price: "₹16,500",
    image: imgUrl("dawki-crystal-clear-authentic.jpg"), rating: 4.9, category: "leisure", location: "Meghalaya",
    highlights: ["Transparent River Boating", "Indo-Bangladesh Border"],
  },
  {
    id: 206, title: "Krem Chympe Cave Expedition",
    description: "Underground adventure through India's fifth longest cave system with Moopun Falls trek",
    duration: "4 Days", difficulty: "Challenging", price: "₹36,500",
    image: imgUrl("krem-chympe-cave-expedition.jpg"), rating: 5.0, category: "adventure", location: "Meghalaya",
    highlights: ["Cave System", "Underground River", "Moopun Falls"],
  },
  {
    id: 21, title: "Arunachal Winter Cultural Festival",
    description: "Immerse in vibrant tribal traditions with dances, crafts, and mountain vistas",
    duration: "6 Days", difficulty: "Moderate", price: "₹36,500",
    image: imgUrl("arunachal-cultural-festival.jpg"), rating: 4.8, category: "cultural", location: "Arunachal Pradesh",
    highlights: ["Tribal Dance", "Traditional Crafts", "Mountain Monastery"],
  },
  {
    id: 55, title: "North Sikkim Winter Expedition",
    description: "Adventure through snow-kissed valleys and pristine winter landscapes",
    duration: "7 Days", difficulty: "Challenging", price: "₹42,500",
    image: imgUrl("gurudongmar-lake-high-altitude-stock.jpg"), rating: 4.9, category: "adventure", location: "Sikkim",
    highlights: ["Gurudongmar Lake", "Yumthang Valley", "Zero Point Snow"],
  },
  {
    id: 71, title: "Kerala Winter Backwaters Paradise",
    description: "Luxurious houseboat cruises through tranquil winter backwaters",
    duration: "5 Days", difficulty: "Easy", price: "₹29,500",
    image: imgUrl("kerala-backwaters-authentic.jpg"), rating: 4.8, category: "leisure", location: "Kerala",
    highlights: ["Traditional Houseboat", "Ayurvedic Spa", "Kerala Cuisine"],
  },
  {
    id: 81, title: "Grand Tamil Nadu Temple Circuit",
    description: "Ultimate 10-day spiritual odyssey through magnificent Dravidian temples",
    duration: "10 Days", difficulty: "Moderate", price: "₹62,500",
    image: imgUrl("tamil-nadu-meenakshi-temple.jpg"), rating: 4.9, category: "cultural", location: "Tamil Nadu",
    highlights: ["Meenakshi Temple", "Brihadeeswara Temple", "Heritage Hotels"],
  },
];

// Couple & Luxury packages
const couplePackages = [
  {
    id: 601, title: "XTSY 270 Romantic Meghalaya Escape",
    description: "Panorama Glass Ensuite + curated couple experiences with 15% couple discount",
    duration: "4 Days", difficulty: "Easy", price: "₹38,500",
    image: xtsy270StargazingImg,
    rating: 4.9, category: "leisure", location: "Meghalaya",
    highlights: ["XTSY 270 Suite", "Private Waterfall Trek", "Stargazing"],
  },
  {
    id: 602, title: "XTSY 270 Honeymoon Cloud Retreat",
    description: "Ultimate honeymoon — panoramic glass ensuite with Dawki boating & dining under stars",
    duration: "5 Days", difficulty: "Easy", price: "₹52,500",
    image: imgUrl("shillong-cherry-blossom.jpg"), rating: 5.0, category: "leisure", location: "Meghalaya",
    highlights: ["XTSY 270 Suite", "Dawki Boating", "Couple Photography"],
  },
  {
    id: 603, title: "XTSY 270 Adventure Couple Circuit",
    description: "XTSY 270 luxury base camp with root bridge trek & jungle camping",
    duration: "6 Days", difficulty: "Moderate", price: "₹62,500",
    image: imgUrl("double-decker-bridge-new.jpg"), rating: 4.9, category: "adventure", location: "Meghalaya",
    highlights: ["XTSY 270 Base Camp", "Root Bridge Trek", "Milky Way Night"],
  },
];

// Solo & Bike tours
const soloPackages = [
  {
    id: 701, title: "Solo Traveller Pass — Meghalaya",
    description: "Safe solo exploration with local buddy system & 24/7 support",
    duration: "5 Days", difficulty: "Easy", price: "₹22,500",
    image: imgUrl("dawki-crystal-clear-authentic.jpg"), rating: 4.8, category: "adventure", location: "Meghalaya",
    highlights: ["Local Buddy System", "Verified Homestays", "Women Batch Available"],
  },
  {
    id: 702, title: "NE India Solo Bike Circuit",
    description: "Royal Enfield expedition with mechanic support & all gear included",
    duration: "6 Days", difficulty: "Challenging", price: "₹35,500",
    image: imgUrl("bumla-pass-bike-expedition.jpg"), rating: 4.9, category: "adventure", location: "Meghalaya",
    highlights: ["RE Himalayan Provided", "Support Vehicle", "GPS Tracked"],
  },
  {
    id: 703, title: "Arunachal Bike Expedition — Solo Friendly",
    description: "Solo-friendly motorcycle journey — Sela Pass, Tawang, Bumla Pass",
    duration: "8 Days", difficulty: "Challenging", price: "₹48,500",
    image: imgUrl("tawang-monastery-mountains.jpg"), rating: 4.9, category: "adventure", location: "Arunachal Pradesh",
    highlights: ["Sela Pass 13,700 ft", "Tawang Monastery", "Bumla Pass Border"],
  },
];

// International packages
const internationalPackages = [
  {
    id: 101, title: "Thailand Cultural & Beach Escape",
    description: "Ancient temples, vibrant markets, and pristine islands in one incredible journey",
    duration: "8 Days", difficulty: "Easy", price: "₹78,000",
    image: "https://images.unsplash.com/photo-1528181304800-259b08848526?w=800&auto=format&fit=crop&q=80",
    rating: 4.8, category: "leisure", location: "Thailand",
    highlights: ["Bangkok Temples", "Phi Phi Islands", "Thai Cooking Class"],
  },
  {
    id: 102, title: "Vietnam Heritage Trail",
    description: "From Hanoi's Old Quarter to Ha Long Bay's limestone karsts and Hoi An's lanterns",
    duration: "10 Days", difficulty: "Moderate", price: "₹88,000",
    image: "https://images.unsplash.com/photo-1557750255-c76072a7aad1?w=800&auto=format&fit=crop&q=80",
    rating: 4.7, category: "cultural", location: "Vietnam",
    highlights: ["Ha Long Bay Cruise", "Hoi An Old Town", "Cu Chi Tunnels"],
  },
  {
    id: 104, title: "Bhutan - Land of Thunder Dragon",
    description: "Mystical monasteries, pristine valleys and traditional Bhutanese hospitality",
    duration: "7 Days", difficulty: "Moderate", price: "₹95,000",
    image: "https://images.unsplash.com/photo-1553856622-d1b352e9a211?w=800&auto=format&fit=crop&q=80",
    rating: 4.9, category: "cultural", location: "Bhutan",
    highlights: ["Tiger's Nest", "Punakha Dzong", "Paro Valley"],
  },
  {
    id: 105, title: "Nepal Himalayan Adventure",
    description: "From Kathmandu's temples to Pokhara's lakeside serenity and mountain vistas",
    duration: "8 Days", difficulty: "Moderate", price: "₹72,000",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80",
    rating: 4.8, category: "adventure", location: "Nepal",
    highlights: ["Everest View", "Annapurna Base Camp", "Boudhanath Stupa"],
  },
];

type TabKey = 'domestic' | 'couples' | 'solo' | 'international';

const TAB_CONFIG: { key: TabKey; label: string; icon: React.ElementType; packages: typeof domesticPackages }[] = [
  { key: 'domestic', label: 'Domestic', icon: MapPin, packages: domesticPackages },
  { key: 'couples', label: 'Couples', icon: Heart, packages: couplePackages },
  { key: 'solo', label: 'Solo & Bike', icon: Bike, packages: soloPackages },
  { key: 'international', label: 'International', icon: Globe, packages: internationalPackages },
];

interface HomeTourPackagesProps {
  className?: string;
}

const HomeTourPackages: React.FC<HomeTourPackagesProps> = ({ className }) => {
  const navigate = useNavigate();
  const { formatPrice } = useApp();
  const [activeTab, setActiveTab] = useState<TabKey>('domestic');
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { trackButton, trackCTA, trackCardClick, trackModalOpen } = useComponentTracking({ section: 'tour_packages' });

  const currentConfig = TAB_CONFIG.find(t => t.key === activeTab)!;
  const currentPackages = currentConfig.packages;

  const focusRailItems: FocusRailItem[] = useMemo(() => 
    currentPackages.map(pkg => ({
      id: pkg.id,
      title: pkg.title,
      description: pkg.description,
      imageSrc: pkg.image,
      meta: pkg.location,
      duration: pkg.duration,
      difficulty: pkg.difficulty,
      price: pkg.price,
      rating: pkg.rating,
      highlights: pkg.highlights,
      category: pkg.category,
    })),
    [currentPackages]
  );

  const handlePackageClick = (item: FocusRailItem) => {
    const pkg = currentPackages.find(p => p.id === item.id);
    if (pkg) {
      trackCardClick(pkg.title, 'tour_package', {
        package_id: String(pkg.id),
        package_category: pkg.category,
        package_price: pkg.price,
      });
      trackModalOpen(`package_${pkg.id}`);

      setSelectedPackage({
        ...pkg,
        images: [pkg.image, pkg.image, pkg.image],
        bestSeason: "Oct-Mar",
      });
      setIsModalOpen(true);
    }
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
            Handpicked adventures across India and beyond. Every journey tells a story.
          </p>
        </motion.div>

        {/* Tab Switcher — 4 tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex flex-wrap justify-center bg-muted/50 backdrop-blur-sm rounded-full p-1.5 border border-border/50 gap-1">
            {TAB_CONFIG.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => handleTabChange(key)}
                className={`flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === key
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Couple discount banner */}
        {activeTab === 'couples' && (
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

        {activeTab === 'solo' && (
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
      </div>

      <OptimizedFocusRail
        items={focusRailItems}
        autoPlay={true}
        interval={5000}
        loop={true}
        onItemClick={handlePackageClick}
      />

      <div className="container mx-auto px-4 mt-8 text-center">
        <Link to="/travel" onClick={() => trackCTA('view_all_packages', { tab: activeTab, package_count: currentPackages.length })}>
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
