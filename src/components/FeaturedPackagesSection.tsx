/**
 * Featured Tour Packages Section
 * Displays curated travel packages above the fold on homepage
 * Replaces room-first approach with experience-first discovery
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  MapPin, 
  Clock, 
  Star, 
  ArrowRight, 
  Mountain, 
  Compass,
  Camera,
  Tent,
  Sparkles 
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import UnifiedImage from './UnifiedImage';
import TourPackageModal from './TourPackageModal';
import { trackPackageViewed, trackPackageSelected } from '@/utils/dataLayerService';
import { routeGTMEvent } from '@/utils/gtmEventRouter';

// Import package images
import meghalayaHiddenGemsImg from '@/assets/meghalaya-hidden-gems-new.jpg';
import shillongCulturalImg from '@/assets/shillong-meghalaya-real.jpg';
import cherrapunjiMonsoonImg from '@/assets/nohkalikai-falls-real.jpg';
import dawkiRiverImg from '@/assets/umngot-river-dawki-real.jpg';
import livingRootBridgesImg from '@/assets/living-root-bridges.jpg';
import offbeatCircuitImg from '@/assets/offbeat-circuit.jpg';

// Featured packages data (curated selection)
const featuredPackages = [
  {
    id: 'pkg-meghalaya-gems',
    title: 'Meghalaya Hidden Gems',
    tagline: 'Waterfalls, caves & living bridges',
    duration: '5 Days / 4 Nights',
    startingPrice: 12999,
    image: meghalayaHiddenGemsImg,
    rating: 4.8,
    category: 'Adventure',
    highlights: ['Double Decker Root Bridge', 'Rainbow Falls', 'Crystal Pools'],
    bestSeason: 'Oct-Mar',
    difficulty: 'Moderate',
    description: 'Discover the unexplored waterfalls and living root bridges of Meghalaya',
  },
  {
    id: 'pkg-shillong-culture',
    title: 'Shillong Cultural Experience',
    tagline: 'Music, markets & Khasi traditions',
    duration: '3 Days / 2 Nights',
    startingPrice: 8999,
    image: shillongCulturalImg,
    rating: 4.6,
    category: 'Cultural',
    highlights: ['Police Bazaar', 'Don Bosco Museum', 'Local Food Tour'],
    bestSeason: 'Year Round',
    difficulty: 'Easy',
    description: 'Immerse yourself in Khasi culture, local markets, and traditional cuisine',
  },
  {
    id: 'pkg-cherrapunji',
    title: 'Cherrapunji Explorer',
    tagline: 'Wettest place on earth',
    duration: '4 Days / 3 Nights',
    startingPrice: 15999,
    image: cherrapunjiMonsoonImg,
    rating: 4.9,
    category: 'Adventure',
    highlights: ['Nohkalikai Falls', 'Mawsmai Caves', 'Living Root Bridges'],
    bestSeason: 'Jun-Sep',
    difficulty: 'Challenging',
    description: 'Experience the wettest place on earth during monsoon season',
  },
  {
    id: 'pkg-dawki',
    title: 'Dawki River Adventure',
    tagline: 'Crystal clear waters at the border',
    duration: '2 Days / 1 Night',
    startingPrice: 6999,
    image: dawkiRiverImg,
    rating: 4.7,
    category: 'Leisure',
    highlights: ['Umngot River', 'Transparent Water Boating', 'Border Views'],
    bestSeason: 'Nov-May',
    difficulty: 'Easy',
    description: 'Crystal clear waters and boating experience at Indo-Bangladesh border',
  },
];

// Category filters
const categories = [
  { id: 'all', label: 'All Experiences', icon: Compass },
  { id: 'adventure', label: 'Adventure', icon: Mountain },
  { id: 'cultural', label: 'Culture & Heritage', icon: Camera },
  { id: 'leisure', label: 'Nature & Views', icon: Tent },
];

interface PackageCardProps {
  pkg: typeof featuredPackages[0];
  onSelect: () => void;
}

const PackageCard = ({ pkg, onSelect }: PackageCardProps) => {
  const { formatPrice } = useApp();
  
  const handleClick = () => {
    trackPackageViewed(pkg.id, pkg.title, pkg.category, pkg.startingPrice);
    // Fire view_package for GTM trigger
    routeGTMEvent({
      eventName: 'view_package',
      params: {
        package_id: pkg.id,
        package_name: pkg.title,
        duration_days: pkg.duration || 1,
        base_price: pkg.startingPrice || 0,
        page_path: window.location.pathname,
      },
    });
    onSelect();
  };
  
  return (
    <Card 
      className="group cursor-pointer overflow-hidden border-0 bg-card/80 backdrop-blur-xs hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 h-full"
      onClick={handleClick}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <UnifiedImage
          src={pkg.image}
          alt={pkg.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          threshold={0.2}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Category Badge */}
        <Badge 
          className="absolute top-3 left-3 bg-background/90 text-foreground backdrop-blur-xs border-border"
        >
          {pkg.category}
        </Badge>
        
        {/* Rating */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-background/90 backdrop-blur-xs px-2 py-1 rounded-full">
          <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
          <span className="text-xs font-medium">{pkg.rating}</span>
        </div>
        
        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-lg font-bold text-white mb-1">{pkg.title}</h3>
          <p className="text-sm text-white/80">{pkg.tagline}</p>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{pkg.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Mountain className="h-4 w-4" />
            <span>{pkg.difficulty}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {pkg.highlights.slice(0, 2).map((highlight, idx) => (
            <Badge key={idx} variant="outline" className="text-xs">
              {highlight}
            </Badge>
          ))}
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-muted-foreground">Starting from</span>
            <p className="text-lg font-bold text-primary">
              {formatPrice(pkg.startingPrice)}
            </p>
          </div>
          <Button 
            size="sm" 
            className="group/btn"
            onClick={(e) => {
              e.stopPropagation();
              trackPackageSelected(pkg.id, pkg.title, 'medium');
              onSelect();
            }}
          >
            Explore
            <ArrowRight className="h-4 w-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const FeaturedPackagesSection = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPackage, setSelectedPackage] = useState<typeof featuredPackages[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const filteredPackages = selectedCategory === 'all' 
    ? featuredPackages 
    : featuredPackages.filter(p => p.category.toLowerCase() === selectedCategory);
  
  const handlePackageSelect = (pkg: typeof featuredPackages[0]) => {
    setSelectedPackage(pkg);
    setIsModalOpen(true);
  };
  
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Curated Experiences</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary via-orange-500 to-rose-500 bg-clip-text text-transparent">
              Explore Meghalaya
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover handcrafted travel experiences that combine adventure, culture, and unforgettable stays
          </p>
        </div>
        
        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map(cat => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? 'default' : 'outline'}
              size="sm"
              className="gap-2"
              onClick={() => setSelectedCategory(cat.id)}
            >
              <cat.icon className="h-4 w-4" />
              {cat.label}
            </Button>
          ))}
        </div>
        
        {/* Package Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {filteredPackages.map(pkg => (
            <PackageCard
              key={pkg.id}
              pkg={pkg}
              onSelect={() => handlePackageSelect(pkg)}
            />
          ))}
        </div>
        
        {/* View All CTA */}
        <div className="text-center">
          <Button 
            size="lg" 
            variant="outline"
            className="group"
            onClick={() => navigate('/travel')}
          >
            View All {featuredPackages.length}+ Tour Packages
            <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
      
      {/* Package Modal */}
      {selectedPackage && (
        <TourPackageModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedPackage(null);
          }}
          tourPackage={{
            id: parseInt(selectedPackage.id.replace(/\D/g, '')) || 1,
            title: selectedPackage.title,
            description: selectedPackage.description,
            duration: selectedPackage.duration.split('/')[0].trim(),
            difficulty: selectedPackage.difficulty,
            price: selectedPackage.startingPrice.toString(),
            image: selectedPackage.image,
            rating: selectedPackage.rating,
            category: selectedPackage.category.toLowerCase(),
            highlights: selectedPackage.highlights,
            bestSeason: selectedPackage.bestSeason,
            location: 'Meghalaya, India',
          }}
        />
      )}
    </section>
  );
};

export default FeaturedPackagesSection;
