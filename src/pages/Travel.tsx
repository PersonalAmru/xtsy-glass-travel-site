import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Define TourPackage interface
interface TourPackage {
  id: number;
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  price: string;
  rating: number;
  category: string;
  location: string;
  highlights: string[];
  bestSeason: string;
  image: string;
  exclusive?: boolean;
}
import TourPackageCard from '@/components/TourPackageCard';
import TourPackageModal from '@/components/TourPackageModal';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useNavigate, useLocation } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import OptimizedLazyImage from '@/components/OptimizedLazyImage';

// Import available image assets (including new authentic sourced images)
import meghalayaHiddenGemsImg from "@/assets/meghalaya-hidden-gems-new.jpg";
import shillongCulturalImg from "@/assets/shillong-meghalaya-real.jpg";
import cherrapunjiMonsoonImg from "@/assets/nohkalikai-falls-real.jpg";
import dawkiRiverImg from "@/assets/umngot-river-dawki-real.jpg";
import mawlynnongVillageImg from "@/assets/mawlynnong-village.jpg";
import garoHillsTribalImg from "@/assets/garo-hills-tribal.jpg";
import jaintiaCavesImg from "@/assets/jaintia-caves.jpg";
import photographyTourImg from "@/assets/photography-tour.jpg";
const wellnessRetreatImg = "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/Travel%20DOM/1/download%20(26).jpg";
import offbeatCircuitImg from "@/assets/offbeat-circuit.jpg";
import khasiHillsTrekImg from "@/assets/khasi-hills-trek.jpg";
import tribalCircuitImg from "@/assets/tribal-circuit.jpg";
import livingRootBridgesImg from "@/assets/living-root-bridges.jpg";
import monsoonChallengeImg from "@/assets/monsoon-challenge.jpg";
import cavesCanyonsImg from "@/assets/caves-canyons.jpg";
import highAltitudeTrekImg from "@/assets/high-altitude-trek.jpg";
import remoteVillagesImg from "@/assets/remote-villages.jpg";
import researchExpeditionImg from "@/assets/research-expedition.jpg";
import meghalayaBiodiversityAuthenticImg from "@/assets/meghalaya-biodiversity-authentic.jpg";
import wildernessSurvivalImg from "@/assets/wilderness-survival-authentic.jpg";
import northeastBikeExpeditionImg from "@/assets/royal-enfield-himalayan-group.jpg";
import arunachalTribalImg from "@/assets/arunachal-tribal-premium.jpg";
import livingRootBridgesAuthenticImg from "@/assets/living-root-bridges-authentic.jpg";
import dawkiCrystalClearImg from "@/assets/dawki-crystal-clear-authentic.jpg";
import teaGardensImg from "@/assets/tea-gardens-authentic.jpg";

// Define tour packages data
const domesticTours: TourPackage[] = [
  {
    id: 101,
    title: "Meghalaya Hidden Gems",
    description: "Explore the unexplored beauty of Meghalaya with our exclusive tour package.",
    duration: "7 Days",
    difficulty: "Moderate",
    price: "₹28,000",
    rating: 4.5,
    category: "Adventure",
    location: "Meghalaya",
    highlights: [
      "Living Root Bridges",
      "Crystal Clear Rivers",
      "Lush Green Landscapes"
    ],
    bestSeason: "Oct-Apr",
    image: meghalayaHiddenGemsImg
  },
  {
    id: 102,
    title: "Shillong Cultural Experience",
    description: "Immerse yourself in the vibrant culture and traditions of Shillong.",
    duration: "5 Days",
    difficulty: "Easy",
    price: "₹18,000",
    rating: 4.2,
    category: "Cultural",
    location: "Shillong",
    highlights: [
      "Local Cuisine",
      "Traditional Music",
      "Handicraft Markets"
    ],
    bestSeason: "Mar-Jun",
    image: shillongCulturalImg
  },
  {
    id: 103,
    title: "Cherrapunji Monsoon Trek",
    description: "Brave the rains and witness the majestic waterfalls of Cherrapunji during monsoon.",
    duration: "4 Days",
    difficulty: "Challenging",
    price: "₹22,000",
    rating: 4.0,
    category: "Adventure",
    location: "Cherrapunji",
    highlights: [
      "Nohkalikai Falls",
      "Mawsmai Cave",
      "Double Decker Root Bridge"
    ],
    bestSeason: "Jun-Sep",
    image: cherrapunjiMonsoonImg
  },
  {
    id: 104,
    title: "Dawki River Adventure",
    description: "Experience the thrill of boating in the crystal clear waters of Dawki River.",
    duration: "3 Days",
    difficulty: "Easy",
    price: "₹15,000",
    rating: 4.7,
    category: "Adventure",
    location: "Dawki",
    highlights: [
      "Umngot River",
      "India-Bangladesh Border",
      "Scenic Boat Ride"
    ],
    bestSeason: "Nov-Mar",
    image: dawkiRiverImg
  },
  {
    id: 105,
    title: "Mawlynnong Village Tour",
    description: "Visit Asia's cleanest village and witness the unique living root bridges.",
    duration: "2 Days",
    difficulty: "Easy",
    price: "₹12,000",
    rating: 4.9,
    category: "Cultural",
    location: "Mawlynnong",
    highlights: [
      "Cleanest Village",
      "Living Root Bridge",
      "Balancing Rock"
    ],
    bestSeason: "Oct-Apr",
    image: mawlynnongVillageImg
  },
  {
    id: 106,
    title: "Garo Hills Tribal Expedition",
    description: "Discover the rich tribal culture and traditions of Garo Hills.",
    duration: "6 Days",
    difficulty: "Moderate",
    price: "₹25,000",
    rating: 4.3,
    category: "Cultural",
    location: "Garo Hills",
    highlights: [
      "Tribal Villages",
      "Local Handicrafts",
      "Traditional Dance"
    ],
    bestSeason: "Nov-Feb",
    image: garoHillsTribalImg
  },
  {
    id: 107,
    title: "Jaintia Caves Exploration",
    description: "Explore the mysterious caves and underground passages of Jaintia Hills.",
    duration: "4 Days",
    difficulty: "Challenging",
    price: "₹20,000",
    rating: 4.1,
    category: "Adventure",
    location: "Jaintia Hills",
    highlights: [
      "Krem Liat Prah",
      "Synrang Pamiang",
      "Ancient Formations"
    ],
    bestSeason: "Dec-Mar",
    image: jaintiaCavesImg
  },
  {
    id: 108,
    title: "Meghalaya Photography Tour",
    description: "Capture the breathtaking landscapes and vibrant culture of Meghalaya.",
    duration: "8 Days",
    difficulty: "Moderate",
    price: "₹30,000",
    rating: 4.6,
    category: "Leisure",
    location: "Meghalaya",
    highlights: [
      "Scenic Viewpoints",
      "Cultural Events",
      "Photography Workshops"
    ],
    bestSeason: "Oct-Apr",
    image: photographyTourImg
  },
  {
    id: 109,
    title: "Wellness Retreat in Meghalaya",
    description: "Rejuvenate your mind, body, and soul with our wellness retreat in Meghalaya.",
    duration: "6 Days",
    difficulty: "Easy",
    price: "₹27,000",
    rating: 4.8,
    category: "Leisure",
    location: "Meghalaya",
    highlights: [
      "Yoga Sessions",
      "Meditation",
      "Spa Treatments"
    ],
    bestSeason: "Mar-Jun",
    image: wellnessRetreatImg
  },
  {
    id: 110,
    title: "Offbeat Circuit of Meghalaya",
    description: "Explore the hidden gems and offbeat destinations of Meghalaya.",
    duration: "9 Days",
    difficulty: "Moderate",
    price: "₹33,000",
    rating: 4.4,
    category: "Adventure",
    location: "Meghalaya",
    highlights: [
      "Hidden Waterfalls",
      "Remote Villages",
      "Unique Landscapes"
    ],
    bestSeason: "Oct-Apr",
    image: offbeatCircuitImg
  },
  {
    id: 111,
    title: "Khasi Hills Trekking Adventure",
    description: "Embark on an adventurous trekking expedition through the scenic Khasi Hills.",
    duration: "5 Days",
    difficulty: "Challenging",
    price: "₹24,000",
    rating: 4.2,
    category: "Adventure",
    location: "Khasi Hills",
    highlights: [
      "David Scott Trail",
      "Living Root Bridges",
      "Scenic Viewpoints"
    ],
    bestSeason: "Nov-Mar",
    image: khasiHillsTrekImg
  },
  {
    id: 112,
    title: "Tribal Circuit of Northeast India",
    description: "Discover the diverse tribal cultures and traditions of Northeast India.",
    duration: "12 Days",
    difficulty: "Moderate",
    price: "₹40,000",
    rating: 4.7,
    category: "Cultural",
    location: "Northeast India",
    highlights: [
      "Tribal Villages",
      "Local Festivals",
      "Traditional Handicrafts"
    ],
    bestSeason: "Oct-Apr",
    image: tribalCircuitImg
  },
  {
    id: 113,
    title: "Living Root Bridges Expedition",
    description: "Witness the unique and fascinating living root bridges of Meghalaya.",
    duration: "6 Days",
    difficulty: "Easy",
    price: "₹26,000",
    rating: 4.9,
    category: "Adventure",
    location: "Meghalaya",
    highlights: [
      "Double Decker Bridge",
      "Single Decker Bridge",
      "Natural Wonders"
    ],
    bestSeason: "Oct-Apr",
    image: livingRootBridgesAuthenticImg
  },
  {
    id: 114,
    title: "Monsoon Challenge in Meghalaya",
    description: "Brave the heavy rains and experience the thrill of monsoon in Meghalaya.",
    duration: "4 Days",
    difficulty: "Challenging",
    price: "₹21,000",
    rating: 4.0,
    category: "Adventure",
    location: "Meghalaya",
    highlights: [
      "Waterfalls",
      "Lush Greenery",
      "Adventure Activities"
    ],
    bestSeason: "Jun-Sep",
    image: monsoonChallengeImg
  },
  {
    id: 115,
    title: "Caves and Canyons of Meghalaya",
    description: "Explore the mysterious caves and breathtaking canyons of Meghalaya.",
    duration: "7 Days",
    difficulty: "Moderate",
    price: "₹29,000",
    rating: 4.3,
    category: "Adventure",
    location: "Meghalaya",
    highlights: [
      "Cave Exploration",
      "Canyoning",
      "Scenic Views"
    ],
    bestSeason: "Nov-Mar",
    image: cavesCanyonsImg
  },
  {
    id: 116,
    title: "High Altitude Trekking in Himalayas",
    description: "Challenge yourself with a high altitude trekking expedition in the Himalayas.",
    duration: "10 Days",
    difficulty: "Extreme",
    price: "₹35,000",
    rating: 4.6,
    category: "Adventure",
    location: "Himalayas",
    highlights: [
      "Mountain Peaks",
      "Glaciers",
      "High Altitude Passes"
    ],
    bestSeason: "May-Oct",
    image: highAltitudeTrekImg
  },
  {
    id: 117,
    title: "Remote Villages of Arunachal Pradesh",
    description: "Discover the untouched beauty and unique culture of remote villages in Arunachal Pradesh.",
    duration: "14 Days",
    difficulty: "Moderate",
    price: "₹45,000",
    rating: 4.8,
    category: "Cultural",
    location: "Arunachal Pradesh",
    highlights: [
      "Tribal Life",
      "Local Traditions",
      "Scenic Landscapes"
    ],
    bestSeason: "Oct-Apr",
    image: remoteVillagesImg
  },
  {
    id: 118,
    title: "Research Expedition in Northeast India",
    description: "Join a research expedition to study the biodiversity and ecology of Northeast India.",
    duration: "15 Days",
    difficulty: "Challenging",
    price: "₹50,000",
    rating: 4.1,
    category: "Adventure",
    location: "Northeast India",
    highlights: [
      "Biodiversity",
      "Ecology",
      "Research Activities"
    ],
    bestSeason: "Nov-Mar",
    image: researchExpeditionImg
  }
];

const internationalTours: TourPackage[] = [
  {
    id: 201,
    title: "Exotic Thailand Beaches",
    description: "Experience the sun, sand, and sea on the exotic beaches of Thailand.",
    duration: "7 Days",
    difficulty: "Easy",
    price: "₹60,000",
    rating: 4.6,
    category: "Leisure",
    location: "Thailand",
    highlights: [
      "Phuket",
      "Phi Phi Islands",
      "White Sand Beaches"
    ],
    bestSeason: "Nov-Apr",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhY2h8ZW58MHx8MHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60"
  },
  {
    id: 202,
    title: "Cultural Tour of Japan",
    description: "Immerse yourself in the rich culture and traditions of Japan.",
    duration: "10 Days",
    difficulty: "Moderate",
    price: "₹80,000",
    rating: 4.8,
    category: "Cultural",
    location: "Japan",
    highlights: [
      "Tokyo",
      "Kyoto",
      "Traditional Temples"
    ],
    bestSeason: "Mar-May",
    image: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dG9reW98ZW58MHx8MHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60"
  },
  {
    id: 203,
    title: "Adventure in New Zealand",
    description: "Experience the thrill of adventure in the stunning landscapes of New Zealand.",
    duration: "12 Days",
    difficulty: "Challenging",
    price: "₹90,000",
    rating: 4.9,
    category: "Adventure",
    location: "New Zealand",
    highlights: [
      "Queenstown",
      "Fiordland National Park",
      "Adventure Sports"
    ],
    bestSeason: "Dec-Feb",
    image: "https://images.unsplash.com/photo-1505515859645-8404a8949576?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bmV3JTIwemVhbGFuZCUyMGxhbmRzY2FwZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60"
  },
  {
    id: 204,
    title: "Safari in Africa",
    description: "Witness the wildlife and natural beauty of Africa on an unforgettable safari.",
    duration: "14 Days",
    difficulty: "Moderate",
    price: "₹100,000",
    rating: 4.7,
    category: "Adventure",
    location: "Africa",
    highlights: [
      "Serengeti National Park",
      "Masai Mara",
      "Wildlife Viewing"
    ],
    bestSeason: "Jun-Oct",
    image: "https://images.unsplash.com/photo-1534778253921-c9ca8ba9abc5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c2FmYXJpJTIwYWZyaWNhfGVufDB8fDB8fHww&auto=format&fit=crop&w=600&q=60"
  },
  {
    id: 205,
    title: "European Heritage Trail",
    description: "Explore the historical landmarks and cultural heritage of Europe.",
    duration: "15 Days",
    difficulty: "Easy",
    price: "₹110,000",
    rating: 4.8,
    category: "Cultural",
    location: "Europe",
    highlights: [
      "Paris",
      "Rome",
      "London"
    ],
    bestSeason: "Apr-Jun",
    image: "https://images.unsplash.com/photo-1493571776196-1c3bdd6441aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGFyaXN8ZW58MHx8MHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60"
  },
  {
    id: 206,
    title: "South American Adventure",
    description: "Discover the diverse landscapes and vibrant cultures of South America.",
    duration: "16 Days",
    difficulty: "Moderate",
    price: "₹120,000",
    rating: 4.9,
    category: "Adventure",
    location: "South America",
    highlights: [
      "Machu Picchu",
      "Rio de Janeiro",
      "Amazon Rainforest"
    ],
    bestSeason: "May-Sep",
    image: "https://images.unsplash.com/photo-1505873242700-e15495256052?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWFjaHUlMjBwaWNjaHUlMjBwZXJ1fGVufDB8fDB8fHww&auto=format&fit=crop&w=600&q=60"
  },
  {
    id: 207,
    title: "Australian Outback Expedition",
    description: "Experience the rugged beauty and unique wildlife of the Australian Outback.",
    duration: "14 Days",
    difficulty: "Challenging",
    price: "₹130,000",
    rating: 4.7,
    category: "Adventure",
    location: "Australia",
    highlights: [
      "Uluru",
      "Great Barrier Reef",
      "Outback Adventures"
    ],
    bestSeason: "Apr-Sep",
    image: "https://images.unsplash.com/photo-1544829967-f1ff87517c0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8b3V0YmFjayUyMGF1c3RyYWxpYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60"
  },
  {
    id: 208,
    title: "XTSY Exclusive: Assam - Arunachal - Meghalaya Royal Enfield Himalayan Expedition",
    description: "Epic Royal Enfield Himalayan adventure across Northeast India's three jewels - from Assam's tea gardens through Arunachal's mighty Himalayas to Meghalaya's living bridges on authentic mountain rides",
    duration: "12 Days",
    difficulty: "Extreme",
    price: "₹95,000",
    rating: 4.9,
    category: "Adventure",
    location: "Northeast India",
    highlights: [
      "Royal Enfield Himalayan Group Rides",
      "Himalayan Mountain Passes",
      "Authentic Mountain Terrain",
      "Professional Riding Support",
      "Traditional Hill Tribes",
      "High-Altitude Adventures"
        ],
    bestSeason: "Oct-Mar",
    image: northeastBikeExpeditionImg,
    exclusive: true
  },
];

const TravelPage: React.FC = () => {
  const [tourPackages, setTourPackages] = useState<TourPackage[]>(domesticTours);
  const [open, setOpen] = useState(false);
  const [selectedTourPackage, setSelectedTourPackage] = useState<TourPackage | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Function to handle tab changes
  const handleTabChange = (value: string) => {
    navigate(`/travel?tab=${value}`, { replace: true });
  };

  // Determine active tab based on URL parameters
  const activeTab = searchParams.get('tab') || 'domestic';

  // Load tour packages based on active tab
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      if (activeTab === 'international') {
        setTourPackages(internationalTours);
      } else {
        setTourPackages(domesticTours);
      }
      setIsLoading(false);
    }, 500);
  }, [activeTab]);

  // Open and close modal
  const onOpenChange = () => {
    setOpen(!open);
  };

  // Handle card click to open modal
  const handleCardClick = (tourPackage: TourPackage) => {
    setSelectedTourPackage(tourPackage);
    setOpen(true);
  };

  // Filter tour packages based on search query
  const filteredTourPackages = tourPackages.filter(tourPackage =>
    tourPackage.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tourPackage.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tourPackage.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Explore Our Tour Packages</h1>
        <div className="w-full md:w-1/2 flex items-center space-x-2">
          <Search className="h-5 w-5 text-gray-500" />
          <Input
            type="text"
            placeholder="Search for tour packages..."
            className="border-gray-300 focus:ring-0 focus:border-gray-400 shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue={activeTab} className="w-full mb-8" onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="domestic">Domestic</TabsTrigger>
          <TabsTrigger value="international">International</TabsTrigger>
        </TabsList>
        <TabsContent value="domestic">
          {/* Domestic Tour Packages */}
        </TabsContent>
        <TabsContent value="international">
          {/* International Tour Packages */}
        </TabsContent>
      </Tabs>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="relative overflow-hidden">
                <Skeleton className="w-full h-48" />
              </div>
              <CardHeader>
                <CardTitle><Skeleton /></CardTitle>
                <CardDescription><Skeleton /></CardDescription>
              </CardHeader>
              <CardContent>
                <Skeleton />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredTourPackages.map(tourPackage => (
            <TourPackageCard
              key={tourPackage.id}
              tourPackage={tourPackage}
              onPackageClick={() => handleCardClick(tourPackage)}
            />
          ))}
        </div>
      )}

      <TourPackageModal
        isOpen={open}
        onClose={onOpenChange}
        tourPackage={selectedTourPackage}
      />
    </div>
  );
};

export default TravelPage;
