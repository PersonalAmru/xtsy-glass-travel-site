import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { OptimizedFocusRail, FocusRailItem } from "@/components/OptimizedFocusRail";
import { Button } from "@/components/ui/button";
import { ArrowRight, Globe, MapPin, Compass } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { LazyTourPackageModal } from "@/components/lazy/LazyTourPackageModal";
import { useApp } from "@/contexts/AppContext";
import { useComponentTracking } from "@/hooks/useComponentTracking";

// Import all tour package images from Travel.tsx
import meghalayaBiodiversityAuthenticImg from "@/assets/meghalaya-biodiversity-authentic.jpg";
import wildernessSurvivalImg from "@/assets/wilderness-survival-authentic.jpg";
import wariChoraAuthenticImg from "@/assets/wari-chora-authentic.jpg";
import doubleDeckerBridgeNewImg from "@/assets/double-decker-bridge-new.jpg";
import himachalYogaRetreatImg from "@/assets/himachal-yoga-retreat.jpg";
import kremChympeCaveImg from "@/assets/krem-chympe-cave-expedition.jpg";
import dawkiCrystalClearImg from "@/assets/dawki-crystal-clear-authentic.jpg";
import assamTeaGardensImg from "@/assets/assam-tea-gardens-premium.jpg";
import krangSuriWaterfallImg from "@/assets/krang-suri-waterfall.jpg";
import phiPhiWaterfallMeghalayaImg from "@/assets/phi-phi-waterfall-meghalaya.jpg";
import moopunWaterfallImg from "@/assets/moopun-waterfall.jpg";
import manipurLoktakImg from "@/assets/manipur-loktak-premium.jpg";
import arunachalCulturalFestivalImg from "@/assets/arunachal-cultural-festival.jpg";
import tripuraBambooHeritageImg from "@/assets/tripura-bamboo-heritage.jpg";
import bumlaPassBikeExpeditionImg from "@/assets/bumla-pass-bike-expedition.jpg";
import tawangMonasteryMountainsImg from "@/assets/tawang-monastery-mountains.jpg";
import keralaBackwatersImg from "@/assets/kerala-backwaters-authentic.jpg";
import thekkadyWildlifeImg from "@/assets/thekkady-wildlife.jpg";
import pellingKanchenjungaImg from "@/assets/pelling-kanchenjunga.jpg";
import gurudongmarLakeImg from "@/assets/gurudongmar-lake-high-altitude-stock.jpg";
import sikkimRhododendronImg from "@/assets/sikkim-rhododendrons-premium.jpg";
import nainitalLakeImg from "@/assets/nainital-lake-district.jpg";
import charDhamYatraImg from "@/assets/char-dham-yatra.jpg";
import kulluValleyAdventureImg from "@/assets/kullu-valley-adventure-stock.jpg";
import dharamshalaMcleodGanjImg from "@/assets/dharamshala-mcleod-ganj-stock.jpg";
import tamilNaduMeenakshiTempleImg from "@/assets/tamil-nadu-meenakshi-temple.jpg";
import tamilNaduKanchipuramTempleImg from "@/assets/tamil-nadu-kanchipuram-temple.jpg";
import ootyKodaikanalImg from "@/assets/ooty-kodaikanal.jpg";
import shillongCherryBlossomImg from "@/assets/shillong-cherry-blossom.jpg";
// Removed: hornbillFestivalHeroImg import (Hornbill Festival card removed)

// Domestic tour packages (same as Travel.tsx)
const domesticPackages = [
  {
    id: 204,
    title: "Wari Chora - Hidden Gem of Meghalaya",
    description: "Trek through untamed forests, rappel down pristine waterfalls, and experience extreme wilderness camping",
    duration: "5 Days",
    difficulty: "Challenging",
    price: "₹48,500",
    image: wariChoraAuthenticImg,
    rating: 4.9,
    category: "adventure",
    location: "Meghalaya",
    highlights: ["Waterfall Rappelling", "Wilderness Camping", "Night Trek"],
  },
  {
    id: 1,
    title: "Double Decker Root Bridge & Cherrapunji",
    description: "Trek through pristine winter forests to discover 500-year-old living bridges",
    duration: "5 Days",
    difficulty: "Moderate",
    price: "₹29,500",
    image: doubleDeckerBridgeNewImg,
    rating: 4.8,
    category: "adventure",
    location: "Meghalaya",
    highlights: ["Double Decker Root Bridge", "Rainbow Falls", "Bio-Luminescent Cave"],
  },
  {
    id: 4,
    title: "Dawki Crystal Waters Winter Escape",
    description: "Experience the world's clearest river - boat rides reveal the riverbed 20 feet below",
    duration: "3 Days",
    difficulty: "Easy",
    price: "₹16,500",
    image: dawkiCrystalClearImg,
    rating: 4.9,
    category: "leisure",
    location: "Meghalaya",
    highlights: ["Transparent River Boating", "Indo-Bangladesh Border"],
  },
  {
    id: 206,
    title: "Krem Chympe Cave Expedition",
    description: "Epic underground adventure through India's fifth longest cave system - UNESCO World Heritage Site",
    duration: "6 Days",
    difficulty: "Challenging",
    price: "₹36,500",
    image: kremChympeCaveImg,
    rating: 5.0,
    category: "adventure",
    location: "Meghalaya",
    highlights: ["UNESCO Cave System", "Underground River", "Speleology Training"],
  },
  {
    id: 21,
    title: "Arunachal Winter Cultural Festival",
    description: "Immerse in vibrant tribal traditions with dances, crafts, and mountain vistas",
    duration: "6 Days",
    difficulty: "Moderate",
    price: "₹36,500",
    image: arunachalCulturalFestivalImg,
    rating: 4.8,
    category: "cultural",
    location: "Arunachal Pradesh",
    highlights: ["Tribal Dance", "Traditional Crafts", "Mountain Monastery"],
  },
  {
    id: 28,
    title: "Bumla Pass Bike Expedition",
    description: "Epic motorcycle journey to Indo-China border at 15,200 feet",
    duration: "8 Days",
    difficulty: "Challenging",
    price: "₹48,500",
    image: bumlaPassBikeExpeditionImg,
    rating: 4.9,
    category: "adventure",
    location: "Arunachal Pradesh",
    highlights: ["Bumla Pass 15,200 ft", "Tawang Monastery", "Sela Pass"],
  },
  {
    id: 22,
    title: "Assam Wildlife & Tea Heritage",
    description: "Winter wildlife safaris in Kaziranga and aromatic tea garden tours",
    duration: "6 Days",
    difficulty: "Easy",
    price: "₹36,500",
    image: assamTeaGardensImg,
    rating: 4.6,
    category: "leisure",
    location: "Assam",
    highlights: ["Kaziranga Safari", "One-Horned Rhino", "Tea Estate Tours"],
  },
  {
    id: 71,
    title: "Kerala Winter Backwaters Paradise",
    description: "Luxurious houseboat cruises through tranquil winter backwaters",
    duration: "5 Days",
    difficulty: "Easy",
    price: "₹29,500",
    image: keralaBackwatersImg,
    rating: 4.8,
    category: "leisure",
    location: "Kerala",
    highlights: ["Traditional Houseboat", "Ayurvedic Spa", "Kerala Cuisine"],
  },
  {
    id: 55,
    title: "North Sikkim Winter Expedition",
    description: "Adventure through snow-kissed valleys and pristine winter landscapes",
    duration: "7 Days",
    difficulty: "Challenging",
    price: "₹42,500",
    image: gurudongmarLakeImg,
    rating: 4.9,
    category: "adventure",
    location: "Sikkim",
    highlights: ["Gurudongmar Lake", "Yumthang Valley", "Zero Point Snow"],
  },
  {
    id: 81,
    title: "Grand Tamil Nadu Temple Circuit",
    description: "Ultimate 10-day spiritual odyssey through magnificent Dravidian temples",
    duration: "10 Days",
    difficulty: "Moderate",
    price: "₹62,500",
    image: tamilNaduMeenakshiTempleImg,
    rating: 4.9,
    category: "cultural",
    location: "Tamil Nadu",
    highlights: ["Meenakshi Temple", "Brihadeeswara Temple", "Heritage Hotels"],
  },
];

// International tour packages
const internationalPackages = [
  {
    id: 101,
    title: "Thailand Cultural & Beach Escape",
    description: "Ancient temples, vibrant markets, and pristine islands in one incredible journey",
    duration: "8 Days",
    difficulty: "Easy",
    price: "₹78,000",
    image: "https://images.unsplash.com/photo-1528181304800-259b08848526?w=800&auto=format&fit=crop&q=80",
    rating: 4.8,
    category: "leisure",
    location: "Thailand",
    highlights: ["Bangkok Temples", "Phi Phi Islands", "Thai Cooking Class"],
  },
  {
    id: 102,
    title: "Vietnam Heritage Trail",
    description: "From Hanoi's Old Quarter to Ha Long Bay's limestone karsts and Hoi An's lanterns",
    duration: "10 Days",
    difficulty: "Moderate",
    price: "₹88,000",
    image: "https://images.unsplash.com/photo-1557750255-c76072a7aad1?w=800&auto=format&fit=crop&q=80",
    rating: 4.7,
    category: "cultural",
    location: "Vietnam",
    highlights: ["Ha Long Bay Cruise", "Hoi An Old Town", "Cu Chi Tunnels"],
  },
  {
    id: 104,
    title: "Bhutan - Land of Thunder Dragon",
    description: "Mystical monasteries, pristine valleys and traditional Bhutanese hospitality",
    duration: "7 Days",
    difficulty: "Moderate",
    price: "₹95,000",
    image: "https://images.unsplash.com/photo-1553856622-d1b352e9a211?w=800&auto=format&fit=crop&q=80",
    rating: 4.9,
    category: "cultural",
    location: "Bhutan",
    highlights: ["Tiger's Nest", "Punakha Dzong", "Paro Valley"],
  },
  {
    id: 105,
    title: "Nepal Himalayan Adventure",
    description: "From Kathmandu's temples to Pokhara's lakeside serenity and mountain vistas",
    duration: "8 Days",
    difficulty: "Moderate",
    price: "₹72,000",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80",
    rating: 4.8,
    category: "adventure",
    location: "Nepal",
    highlights: ["Everest View", "Annapurna Base Camp", "Boudhanath Stupa"],
  },
];

interface HomeTourPackagesProps {
  className?: string;
}

const HomeTourPackages: React.FC<HomeTourPackagesProps> = ({ className }) => {
  const navigate = useNavigate();
  const { formatPrice } = useApp();
  const [activeTab, setActiveTab] = useState<'domestic' | 'international'>('domestic');
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // GTM Tracking
  const { trackButton, trackCTA, trackCardClick, trackModalOpen, trackCarousel, trackSectionView } = useComponentTracking({ section: 'tour_packages' });

  const currentPackages = activeTab === 'domestic' ? domesticPackages : internationalPackages;

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
      // Track card click
      trackCardClick(pkg.title, 'tour_package', {
        package_id: String(pkg.id),
        package_category: pkg.category,
        package_price: pkg.price,
      });
      
      // Track modal open
      trackModalOpen(`package_${pkg.id}`);

      setSelectedPackage({
        ...pkg,
        images: [pkg.image, pkg.image, pkg.image],
        bestSeason: "Oct-Mar",
      });
      setIsModalOpen(true);
    }
  };
  
  const handleTabChange = (tab: 'domestic' | 'international') => {
    trackButton(`tab_${tab}`, { previous_tab: activeTab });
    setActiveTab(tab);
  };

  return (
    <section className={`relative py-8 md:py-12 bg-background ${className}`}>
      {/* Section Header */}
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

        {/* Tab Switcher */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-muted/50 backdrop-blur-sm rounded-full p-1.5 border border-border/50">
            <button
              onClick={() => handleTabChange('domestic')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                activeTab === 'domestic'
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <MapPin className="w-4 h-4" />
              Domestic
            </button>
            <button
              onClick={() => handleTabChange('international')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                activeTab === 'international'
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Globe className="w-4 h-4" />
              International
            </button>
          </div>
        </div>
      </div>

      {/* Optimized Focus Rail Carousel */}
      <OptimizedFocusRail
        items={focusRailItems}
        autoPlay={true}
        interval={5000}
        loop={true}
        onItemClick={handlePackageClick}
      />

      {/* View All Button */}
      <div className="container mx-auto px-4 mt-8 text-center">
        <Link to={`/travel?tab=${activeTab}`} onClick={() => trackCTA('view_all_packages', { tab: activeTab, package_count: currentPackages.length })}>
          <Button
            variant="outline"
            size="lg"
            className="group border-primary/30 hover:border-primary hover:bg-primary/5"
          >
            View All {currentPackages.length}+ Tour Packages
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>

      {/* Tour Package Modal */}
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
