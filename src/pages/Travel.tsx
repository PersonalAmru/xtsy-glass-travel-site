import React, { useState, useEffect, Suspense } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Globe, Package, Bell, Mail, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CompactTourPackageCard from "@/components/CompactTourPackageCard";
import { LazyTourPackageModal } from "@/components/lazy/LazyTourPackageModal";
import { AuthModal } from "@/components/AuthModal";
import LazyWrapper from "@/components/LazyWrapper";
import SEOContent from "@/components/SEOContent";
import { TourPricingService } from "@/utils/tourPricingService";

// Import generated stock images
import arunachalEagleFestival from "@/assets/arunachal-eagle-festival-stock.jpg";
import dharamshalaMcleodGanj from "@/assets/dharamshala-mcleod-ganj-stock.jpg";
import kulluValleyAdventure from "@/assets/kullu-valley-adventure-stock.jpg";

// All image assets removed - Supabase ready
// Image arrays for future Supabase URL assignments
const meghalayaImages = ["", "", ""];
const himachalImages = ["", "", ""];
const keralImages = ["", "", ""];
const uttarakhandImages = ["", "", ""];
const sikkimImages = ["", "", ""];
const tamilNaduImages = ["", "", ""];

// Individual destination images - placeholders for Supabase URLs
const meghalayaHero = "";
const uttarakhandImage = "";
const sikkimImage = "";
const himachalImage = "";
const keralaImage = "";
const tamilNaduImage = "";

// Additional categorized images - placeholders for Supabase URLs
const waterfallImage = "";
const mountainImage = "";
const lakeImage = "";
const templeImage = "";
const forestImage = "";
const cultureImage = "";
const adventureImage = "";
const hillStationImage = "";

// International travel images - placeholders for Supabase URLs
const internationalTravelImage = "";
const asiaImage = "";
const merchandiseImage = "";

const Travel = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'domestic' | 'international'>('domestic');
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tab = urlParams.get('tab');
    if (tab === 'domestic' || tab === 'international') {
      setActiveTab(tab);
    }
    // Scroll to top when navigating to this page
    window.scrollTo(0, 0);
  }, [location.search]);

  const handlePackageClick = (itinerary: any) => {
    setSelectedPackage(itinerary);
    setIsModalOpen(true);
  };

  const handleNewsletterClick = () => {
    setIsAuthModalOpen(true);
  };

  // Enhanced tour packages data organized by states
  const stateWiseTourPackages = {
    "XTSY Exclusive Tours": [
      {
        id: 201,
        title: "XTSY Exclusive: Meghalaya Biodiversity Research Program",
        description: "Educational wilderness expedition studying Northeast India's unique flora, fauna and ecosystems with expert naturalists",
        duration: "7 Days",
        difficulty: "Moderate",
        price: TourPricingService.calculatePrice("7 Days", "exclusive", "Moderate", "Northeast India", "Oct-Mar"),
        image: "",
        images: ["", "", ""],
        rating: 4.9,
        category: "cultural",
        location: "Northeast India",
        highlights: ["Expert Naturalist Guides", "Endemic Species Study", "Research Documentation", "Conservation Workshops", "Field Studies", "Night Safari", "Botanical Gardens"],
        bestSeason: "Oct-Mar",
        exclusive: true
      },
      {
        id: 202,
        title: "XTSY Exclusive: Wilderness Survival & Nature Immersion",
        description: "Ultimate wilderness education program teaching survival skills, nature connection and sustainable living practices",
        duration: "5 Days", 
        difficulty: "Challenging",
        price: TourPricingService.calculatePrice("5 Days", "exclusive", "Challenging", "Northeast India", "Nov-Apr"),
        image: "",
        images: ["", "", ""],
        rating: 4.8,
        category: "adventure",
        location: "Northeast India",
        highlights: ["Survival Skills Training", "Wilderness Navigation", "Natural Shelter Building", "Foraging Education", "Water Purification", "Fire Making", "Leave No Trace Principles"],
        bestSeason: "Nov-Apr",
        exclusive: true
      },
      {
        id: 203,
        title: "XTSY Exclusive: Northeast Ecological Education Program",
        description: "Comprehensive nature education course exploring biodiversity hotspots, endemic species, and conservation efforts",
        duration: "8 Days",
        difficulty: "Easy",
        price: TourPricingService.calculatePrice("8 Days", "exclusive", "Easy", "Northeast India", "Oct-Mar"),
        image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/Travel%20DOM/1/Complete%20Guide%20To%20Backpacking%20In%20Arunachal%20Pradesh%20-%20Lost%20With%20Purpose.jpg",
        images: ["", "", ""],
        rating: 4.9,
        category: "educational",
        location: "Northeast India",
        highlights: ["Environmental Science", "Wildlife Photography", "Plant Identification", "Ecosystem Mapping", "Citizen Science Projects", "Climate Change Studies", "Sustainable Practices"],
        bestSeason: "Oct-Mar",
        exclusive: true
      },
      {
        id: 204,
        title: "XTSY Exclusive: Traditional Knowledge & Ethnobotany Course",
        description: "Learn indigenous plant wisdom, traditional medicine, and sustainable harvesting practices from tribal communities",
        duration: "6 Days",
        difficulty: "Moderate",
        price: TourPricingService.calculatePrice("6 Days", "exclusive", "Moderate", "Northeast India", "Nov-Apr"),
        image: "",
        images: ["", "", ""],
        rating: 4.8,
        category: "cultural",
        location: "Northeast India",
        highlights: ["Medicinal Plant Studies", "Indigenous Knowledge", "Herbal Medicine Preparation", "Sacred Grove Visits", "Traditional Healing", "Cultural Exchange", "Documentation Methods"],
        bestSeason: "Nov-Apr",
        exclusive: true
      },
      {
        id: 207,
        title: "XTSY Exclusive: Arunachal Pradesh Mountain Yoga Retreat",
        description: "Experience profound peace and spiritual awakening amidst the pristine peaks of Arunachal Pradesh",
        duration: "8 Days",
        difficulty: "Moderate",
        price: TourPricingService.calculatePrice("8 Days", "exclusive", "Moderate", "Arunachal Pradesh", "Mar-Oct"),
        image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/Travel%20DOM/1/download%20(25).jpg",
        images: ["https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/Travel%20DOM/1/download%20(25).jpg", "", ""],
        rating: 4.9,
        category: "wellness",
        location: "Arunachal Pradesh",
        highlights: ["Alpine Yoga", "Buddhist Meditation", "Mountain Trekking", "Monastery Visits", "Tibetan Healing", "High Altitude Training", "Sunrise Sadhana"],
        bestSeason: "Mar-Oct",
        exclusive: true
      }
    ],
    
    "Meghalaya": [
      {
        id: 1,
        title: "Meghalaya Hidden Gems",
        description: "Discover the unexplored waterfalls and living root bridges of Meghalaya",
        duration: "5 Days",
        difficulty: "Moderate",
        price: TourPricingService.calculatePrice("5 Days", "adventure", "Moderate", "Meghalaya", "Oct-Mar"),
        image: "",
        images: ["", "", ""],
        rating: 4.8,
        category: "adventure",
        location: "Meghalaya",
        highlights: ["Double Decker Root Bridge", "Rainbow Falls", "Crystal Clear Pools"],
        bestSeason: "Oct-Mar"
      },
      {
        id: 4,
        title: "Dawki River Adventure",
        description: "Crystal clear waters and boating experience at Indo-Bangladesh border",
        duration: "2 Days",
        difficulty: "Easy",
        price: TourPricingService.calculatePrice("2 Days", "leisure", "Easy", "Meghalaya", "Nov-May"),
        image: "",
        images: ["", "", ""],
        rating: 4.7,
        category: "leisure",
        location: "Meghalaya",
        highlights: ["Umngot River", "Transparent Water Boating", "Border Views"],
        bestSeason: "Nov-May"
      },
    ],
    
    "Northeast States": [
      {
        id: 21,
        title: "Arunachal Pradesh Eagle Festival",
        description: "Experience the vibrant culture and traditions of Arunachal Pradesh",
        duration: "6 Days",
        difficulty: "Moderate",
        price: TourPricingService.calculatePrice("6 Days", "cultural", "Moderate", "Arunachal Pradesh", "Dec-Feb"),
        image: arunachalEagleFestival,
        images: [arunachalEagleFestival, "", ""],
        rating: 4.8,
        category: "cultural",
        location: "Arunachal Pradesh",
        highlights: ["Traditional Dances", "Local Crafts", "Mountain Views", "Cultural Immersion"],
        bestSeason: "Dec-Feb"
      },
      {
        id: 22,
        title: "Assam Tea Gardens & Wildlife",
        description: "Explore the famous tea gardens of Assam and spot wildlife in Kaziranga",
        duration: "7 Days",
        difficulty: "Easy",
        price: TourPricingService.calculatePrice("7 Days", "leisure", "Easy", "Assam", "Nov-Apr"),
        image: "",
        images: ["", "", ""],
        rating: 4.6,
        category: "leisure",
        location: "Assam",
        highlights: ["Tea Garden Tours", "Kaziranga National Park", "One Horn Rhinos"],
        bestSeason: "Nov-Apr"
      },
      {
        id: 24,
        title: "Manipur Loktak Lake & Floating Islands",
        description: "Discover the unique floating islands and phumdis of Loktak Lake",
        duration: "4 Days",
        difficulty: "Easy",
        price: TourPricingService.calculatePrice("4 Days", "leisure", "Easy", "Manipur", "Oct-Mar"),
        image: "",
        images: ["", "", ""],
        rating: 4.7,
        category: "leisure",
        location: "Manipur",
        highlights: ["Keibul Lamjao National Park", "Sangai Deer", "Floating Gardens"],
        bestSeason: "Oct-Mar"
      },
      {
        id: 26,
        title: "Tripura Heritage & Bamboo Trail",
        description: "Explore ancient kingdoms and sustainable bamboo crafts of Tripura",
        duration: "4 Days",
        difficulty: "Moderate",
        price: TourPricingService.calculatePrice("4 Days", "cultural", "Moderate", "Tripura", "Oct-Mar"),
        image: "",
        images: ["", "", ""],
        rating: 4.5,
        category: "cultural",
        location: "Tripura",
        highlights: ["Ujjayanta Palace", "Bamboo Handicrafts", "Tribal Museums"],
        bestSeason: "Oct-Mar"
      },
    ],
    
    "Uttarakhand": [
      {
        id: 31,
        title: "Char Dham Yatra",
        description: "Sacred pilgrimage to the four holy shrines in the Himalayas",
        duration: "12 Days",
        difficulty: "Challenging",
        price: TourPricingService.calculatePrice("12 Days", "cultural", "Challenging", "Uttarakhand", "May-Oct"),
        image: "",
        images: ["", "", ""],
        rating: 4.9,
        category: "cultural",
        location: "Uttarakhand",
        highlights: ["Yamunotri", "Gangotri", "Kedarnath", "Badrinath"],
        bestSeason: "May-Oct"
      },
      {
        id: 33,
        title: "Nainital Lake District",
        description: "Serene lakes, hill stations, and colonial charm in Kumaon hills",
        duration: "5 Days",
        difficulty: "Easy",
        price: TourPricingService.calculatePrice("5 Days", "leisure", "Easy", "Uttarakhand", "Mar-Jun, Sep-Nov"),
        image: "",
        images: ["", "", ""],
        rating: 4.6,
        category: "leisure",
        location: "Uttarakhand",
        highlights: ["Naini Lake", "Snow View Point", "Mall Road"],
        bestSeason: "Mar-Jun, Sep-Nov"
      },
    ],
    
    "Sikkim": [
      {
        id: 52,
        title: "Sikkim Rhododendron Trail",
        description: "Spectacular rhododendron blooms in the Himalayan foothills",
        duration: "4 Days",
        difficulty: "Moderate",
        price: TourPricingService.calculatePrice("4 Days", "leisure", "Moderate", "Sikkim", "Mar-May"),
        image: "",
        images: ["", "", ""],
        rating: 4.7,
        category: "leisure",
        location: "Sikkim",
        highlights: ["Rhododendron Forests", "Nature Walks", "Mountain Views"],
        bestSeason: "Mar-May"
      },
      {
        id: 53,
        title: "Pelling Kanchenjunga Views",
        description: "Magnificent views of Kanchenjunga peak from Pelling",
        duration: "3 Days",
        difficulty: "Easy",
        price: TourPricingService.calculatePrice("3 Days", "leisure", "Easy", "Sikkim", "Oct-May"),
        image: "",
        images: ["", "", ""],
        rating: 4.6,
        category: "leisure",
        location: "Sikkim",
        highlights: ["Kanchenjunga Views", "Monasteries", "Waterfalls"],
        bestSeason: "Oct-May"
      },
      {
        id: 55,
        title: "North Sikkim Adventure",
        description: "Remote mountain landscapes and pristine lakes of North Sikkim",
        duration: "6 Days",
        difficulty: "Challenging",
        price: TourPricingService.calculatePrice("6 Days", "adventure", "Challenging", "Sikkim", "Mar-Jun"),
        image: "",
        images: ["", "", ""],
        rating: 4.9,
        category: "adventure",
        location: "Sikkim",
        highlights: ["Yumthang Valley", "Zero Point", "Hot Springs"],
        bestSeason: "Mar-Jun"
      }
    ],
    
    "Himachal Pradesh": [
      {
        id: 63,
        title: "Dharamshala McLeod Ganj",
        description: "Dalai Lama's residence, Tibetan culture, and mountain trekking",
        duration: "5 Days",
        difficulty: "Moderate",
        price: TourPricingService.calculatePrice("5 Days", "cultural", "Moderate", "Himachal Pradesh", "Mar-Jun, Sep-Nov"),
        image: dharamshalaMcleodGanj,
        images: [dharamshalaMcleodGanj, "", ""],
        rating: 4.7,
        category: "cultural",
        location: "Himachal Pradesh",
        highlights: ["Dalai Lama Temple", "Tibetan Culture", "Triund Trek"],
        bestSeason: "Mar-Jun, Sep-Nov"
      },
      {
        id: 64,
        title: "Kullu Valley Adventure",
        description: "River rafting, paragliding, and mountain adventures in Kullu",
        duration: "4 Days",
        difficulty: "Moderate",
        price: TourPricingService.calculatePrice("4 Days", "adventure", "Moderate", "Himachal Pradesh", "Apr-Oct"),
        image: kulluValleyAdventure,
        images: [kulluValleyAdventure, "", ""],
        rating: 4.5,
        category: "adventure",
        location: "Himachal Pradesh",
        highlights: ["River Rafting", "Paragliding", "Apple Orchards"],
        bestSeason: "Apr-Oct"
      },
    ],
    
    "Kerala": [
      {
        id: 71,
        title: "Kerala Backwaters & Houseboats",
        description: "Serene backwater cruise through palm-fringed canals and lagoons",
        duration: "5 Days",
        difficulty: "Easy",
        price: TourPricingService.calculatePrice("5 Days", "leisure", "Easy", "Kerala", "Oct-Mar"),
        image: "",
        images: ["", "", ""],
        rating: 4.8,
        category: "leisure",
        location: "Kerala",
        highlights: ["Houseboat Cruise", "Coconut Lagoons", "Local Cuisine"],
        bestSeason: "Oct-Mar"
      },
      {
        id: 72,
        title: "Munnar Tea Gardens",
        description: "Rolling tea plantations, mountain views, and cool climate",
        duration: "4 Days",
        difficulty: "Easy",
        price: TourPricingService.calculatePrice("4 Days", "leisure", "Easy", "Kerala", "Sep-May"),
        image: "",
        images: ["", "", ""],
        rating: 4.7,
        category: "leisure",
        location: "Kerala",
        highlights: ["Tea Museums", "Eravikulam National Park", "Mountain Views"],
        bestSeason: "Sep-May"
      },
      {
        id: 73,
        title: "Thekkady Wildlife & Spice Gardens",
        description: "Periyar Wildlife Sanctuary and aromatic spice plantation tours",
        duration: "3 Days",
        difficulty: "Easy",
        price: TourPricingService.calculatePrice("3 Days", "leisure", "Easy", "Kerala", "Oct-Feb"),
        image: "",
        images: ["", "", ""],
        rating: 4.6,
        category: "leisure",
        location: "Kerala",
        highlights: ["Elephant Rides", "Spice Gardens", "Boat Safari"],
        bestSeason: "Oct-Feb"
      }
    ],
    
    "Tamil Nadu": [
      {
        id: 82,
        title: "Ooty Hill Station Experience", 
        description: "Queen of Hill Stations with botanical gardens, toy train, and tea plantations",
        duration: "3 Days",
        difficulty: "Easy",
        price: TourPricingService.calculatePrice("3 Days", "leisure", "Easy", "Tamil Nadu", "Apr-Jun, Sep-Nov"),
        image: "",
        images: ["", "", ""],
        rating: 4.6,
        category: "leisure",
        location: "Tamil Nadu",
        highlights: ["Nilgiri Toy Train", "Botanical Gardens", "Rose Garden", "Tea Factory Visit"],
        bestSeason: "Apr-Jun, Sep-Nov"
      },
      {
        id: 83,
        title: "Kodaikanal Princess of Hills",
        description: "Misty mountains, pristine lakes, and cool climate in the Western Ghats",
        duration: "3 Days", 
        difficulty: "Easy",
        price: TourPricingService.calculatePrice("3 Days", "leisure", "Easy", "Tamil Nadu", "Apr-Jun, Sep-Nov"),
        image: "",
        images: ["", "", ""],
        rating: 4.4,
        category: "leisure",
        location: "Tamil Nadu",
        highlights: ["Kodai Lake", "Coaker's Walk", "Bryant Park", "Pillar Rocks"],
        bestSeason: "Apr-Jun, Sep-Nov"
      }
    ]
  };

  // Flatten all packages for filtering
  const allItineraries = Object.values(stateWiseTourPackages).flat();

  const categories = [
    { id: "all", label: "All Packages" },
    { id: "adventure", label: "Adventure" },
    { id: "cultural", label: "Cultural" },
    { id: "leisure", label: "Leisure" }
  ];

  const locations = ["all", "Meghalaya", "Uttarakhand", "Sikkim", "Himachal Pradesh", "Kerala", "Tamil Nadu", "Assam", "Arunachal Pradesh", "Manipur", "Tripura"];

  const filteredItineraries = allItineraries.filter(item => {
    const categoryMatch = selectedCategory === "all" || item.category === selectedCategory;
    const locationMatch = locationFilter === "all" || item.location === locationFilter;
    
    return categoryMatch && locationMatch;
  });

  const meghalayaPackages = filteredItineraries.filter(item => item.location === "Meghalaya");
  const otherPackages = filteredItineraries.filter(item => item.location !== "Meghalaya");

  const clearFilters = () => {
    setSelectedCategory("all");
    setLocationFilter("all");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEOContent page="travel" />
      <Header />
      
      <main className="flex-1">
        <div className="bg-gradient-to-br from-slate-50 via-orange-50 to-red-50 relative overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-100/30 via-transparent to-red-100/30" />
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500" />
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-200/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-red-200/30 rounded-full blur-3xl" />
          
          {/* Optimized mobile padding */}
          <div className="relative z-10 py-4 sm:py-6">
            <div className="container mx-auto px-1 sm:px-2">
              {/* Mobile-optimized Header */}
              <div className="text-center mb-2 sm:mb-4">
                <div className="inline-block p-1.5 sm:p-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg mb-1 sm:mb-2">
                  <h1 className="text-base sm:text-lg font-bold text-gray-900 mb-1 font-playfair">
                    XTSY Travel
                  </h1>
                  <div className="w-10 sm:w-12 h-0.5 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full" />
                </div>
                <p className="text-xs sm:text-sm text-gray-700 max-w-2xl mx-auto mb-1 sm:mb-2 bg-white/60 backdrop-blur-sm rounded-lg p-1.5 sm:p-2 shadow-md mx-2">
                  Embark on extraordinary journeys with XTSY Travel - your gateway to incredible experiences.
                </p>
              </div>

              {/* Ultra-compact Tab Navigation */}
              <div className="flex justify-center mb-1 sm:mb-2">
                <div className="bg-white/80 backdrop-blur-sm rounded-md p-0.5 shadow-md flex w-full max-w-64">
                  <Button
                    onClick={() => setActiveTab('domestic')}
                    variant={activeTab === 'domestic' ? 'default' : 'ghost'}
                    className={`flex-1 px-1.5 py-0.5 rounded-sm text-xs font-medium transition-all duration-200 h-6 ${
                      activeTab === 'domestic' 
                        ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-orange-600 hover:to-red-700 shadow-sm' 
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100/80'
                    }`}
                  >
                    <MapPin className="h-2.5 w-2.5 mr-0.5" />
                    <span className="text-xs">DOM</span>
                  </Button>
                  <Button
                    onClick={() => setActiveTab('international')}
                    variant={activeTab === 'international' ? 'default' : 'ghost'}
                    className={`flex-1 px-1.5 py-0.5 rounded-sm text-xs font-medium transition-all duration-200 h-6 ${
                      activeTab === 'international' 
                        ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-orange-600 hover:to-red-700 shadow-sm' 
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100/80'
                    }`}
                  >
                    <Globe className="h-2.5 w-2.5 mr-0.5" />
                    <span className="text-xs">INT</span>
                  </Button>
                </div>
              </div>

              {/* Content */}
              {activeTab === 'domestic' && (
                <div>
                  {/* Ultra-compact Filters */}
                  <div className="mb-1 sm:mb-2 bg-white/80 backdrop-blur-sm rounded-md p-1.5 shadow-lg">
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-0.5">
                        <Filter className="h-2.5 w-2.5 text-gray-600" />
                        <span className="font-medium text-gray-900 text-xs">Filters:</span>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-0.5">
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                          <SelectTrigger className="w-full sm:w-28 bg-white text-gray-900 border-gray-300 text-xs h-5">
                            <SelectValue placeholder="Category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select value={locationFilter} onValueChange={setLocationFilter}>
                          <SelectTrigger className="w-full sm:w-28 bg-white text-gray-900 border-gray-300 text-xs h-5">
                            <SelectValue placeholder="Location" />
                          </SelectTrigger>
                          <SelectContent>
                            {locations.map((location) => (
                              <SelectItem key={location} value={location}>
                                {location === "all" ? "All Locations" : location}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        <Button 
                          variant="outline" 
                          onClick={clearFilters}
                          className="bg-white border border-orange-300 text-orange-700 hover:bg-orange-50 hover:border-orange-400 hover:text-orange-800 font-medium px-1.5 py-0.5 shadow-sm transition-all duration-200 text-xs w-full sm:w-auto h-5"
                        >
                          Clear
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Compact State-wise Packages */}
                  {Object.entries(stateWiseTourPackages).map(([state, packages]) => {
                    const filteredStatePackages = packages.filter(pkg => {
                      const categoryMatch = selectedCategory === "all" || pkg.category === selectedCategory;
                      const locationMatch = locationFilter === "all" || pkg.location === locationFilter;
                      
                      return categoryMatch && locationMatch;
                    });

                    if (filteredStatePackages.length === 0) return null;

                    // State-specific icons and descriptions
                    const stateInfo = {
                      "Meghalaya": { icon: "🏔️", desc: "The Abode of Clouds" },
                      "Uttarakhand": { icon: "🏔️", desc: "Land of the Gods" },
                      "Sikkim": { icon: "🗻", desc: "Gateway to the Himalayas" },
                      "Himachal Pradesh": { icon: "⛰️", desc: "Land of Snow" },
                      "Kerala": { icon: "🌴", desc: "God's Own Country" },
                      "Tamil Nadu": { icon: "🏛️", desc: "Land of Temples" },
                      "Northeast States": { icon: "🌿", desc: "Seven Sisters Region" },
                      "XTSY Exclusive Tours": { icon: "⭐", desc: "Premium Experiences" }
                    };

                    const info = stateInfo[state] || { icon: "🗺️", desc: "Incredible Destination" };

                    return (
                      <div key={state} className="mb-2 sm:mb-3">
                        <div className="text-center mb-1">
                          <div className="inline-flex items-center gap-0.5 p-1 bg-white/80 backdrop-blur-sm rounded-md shadow-md mb-0.5">
                            <span className="text-xs sm:text-sm">{info.icon}</span>
                            <h3 className="text-xs sm:text-sm font-bold text-gray-900">
                              {state}
                            </h3>
                          </div>
                          <p className="text-gray-600 text-xs">
                            {info.desc}
                          </p>
                        </div>
                        {/* Ultra-compact grid for mobile with CompactTourPackageCard */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-0.5 sm:gap-1">
                          {filteredStatePackages.map((itinerary) => (
                            <CompactTourPackageCard
                              key={itinerary.id}
                              tourPackage={itinerary}
                              onPackageClick={() => handlePackageClick(itinerary)}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}

                  {filteredItineraries.length === 0 && (
                    <div className="text-center py-3 sm:py-4">
                      <p className="text-gray-500 text-xs sm:text-sm">No packages found matching your filters.</p>
                      <Button 
                        onClick={clearFilters}
                        className="mt-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white text-xs px-2 py-0.5 h-6"
                      >
                        Clear All Filters
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'international' && (
                <div className="max-w-6xl mx-auto">
                  {/* Compact International Header */}
                  <div className="text-center mb-4 sm:mb-6">
                    <div className="inline-flex items-center gap-1 sm:gap-2 p-2 sm:p-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg mb-2 sm:mb-3">
                      <span className="text-lg sm:text-2xl">🌏</span>
                      <h2 className="text-base sm:text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                        XTSY Asia & Europe
                      </h2>
                      <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-1 sm:px-2 py-0.5 rounded-full text-xs font-bold">
                        Soon
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 max-w-2xl mx-auto px-2">
                      Get ready to explore the world with XTSY! We're expanding to bring you unforgettable experiences.
                    </p>
                  </div>

                  {/* Ultra-compact Asian Countries */}
                  <div className="mb-6 sm:mb-8">
                    <div className="text-center mb-3 sm:mb-4">
                      <h3 className="text-sm sm:text-lg font-bold text-gray-900 mb-1 flex items-center justify-center gap-1">
                        🏯 Asian Destinations
                      </h3>
                    </div>
                    
                     <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-1 sm:gap-2 mb-3 sm:mb-4 px-1">
                       {[
                         { country: "Japan", flag: "🇯🇵", highlight: "Cherry Blossoms" },
                         { country: "Thailand", flag: "🇹🇭", highlight: "Tropical Paradise" },
                         { country: "Vietnam", flag: "🇻🇳", highlight: "Street Food" },
                         { country: "Korea", flag: "🇰🇷", highlight: "K-Culture" },
                         { country: "Malaysia", flag: "🇲🇾", highlight: "Multicultural" },
                         { country: "Singapore", flag: "🇸🇬", highlight: "Modern City" },
                         { country: "Indonesia", flag: "🇮🇩", highlight: "Islands" },
                         { country: "Philippines", flag: "🇵🇭", highlight: "Beaches" }
                       ].map((item) => (
                         <Card key={item.country} className="group hover:shadow-md transition-all duration-300 bg-white/90 backdrop-blur-sm border border-gray-200">
                           <CardContent className="p-1 sm:p-2 text-center">
                               <div 
                                 className="text-lg sm:text-2xl mb-1 leading-none"
                                 style={{
                                   fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", sans-serif',
                                   fontSize: 'clamp(1rem, 3vw, 1.5rem)',
                                   lineHeight: '1'
                                 }}
                               >
                                 {item.flag}
                               </div>
                             <h4 className="font-medium text-gray-900 mb-0.5 text-xs">{item.country}</h4>
                             <p className="text-xs text-gray-600 mb-1 leading-tight">{item.highlight}</p>
                             <span className="text-xs bg-yellow-100 text-yellow-800 px-1 py-0.5 rounded-full">Soon</span>
                           </CardContent>
                         </Card>
                      ))}
                    </div>
                  </div>

                  {/* Ultra-compact European Countries */}
                  <div className="mb-6 sm:mb-8">
                    <div className="text-center mb-3 sm:mb-4">
                      <h3 className="text-sm sm:text-lg font-bold text-gray-900 mb-1 flex items-center justify-center gap-1">
                        🏰 European Destinations
                      </h3>
                    </div>
                    
                    <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-1 sm:gap-2 mb-3 sm:mb-4 px-1">
                       {[
                         { country: "France", flag: "🇫🇷", highlight: "Romance" },
                         { country: "Italy", flag: "🇮🇹", highlight: "Art & History" },
                         { country: "Spain", flag: "🇪🇸", highlight: "Festivals" },
                         { country: "Germany", flag: "🇩🇪", highlight: "Castles" },
                         { country: "Switzerland", flag: "🇨🇭", highlight: "Alps" },
                         { country: "Netherlands", flag: "🇳🇱", highlight: "Canals" },
                         { country: "UK", flag: "🇬🇧", highlight: "Royal Heritage" },
                         { country: "Austria", flag: "🇦🇹", highlight: "Music" }
                       ].map((item) => (
                         <Card key={item.country} className="group hover:shadow-md transition-all duration-300 bg-white/90 backdrop-blur-sm border border-gray-200">
                           <CardContent className="p-1 sm:p-2 text-center">
                               <div 
                                 className="text-lg sm:text-2xl mb-1 leading-none"
                                 style={{
                                   fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", sans-serif',
                                   fontSize: 'clamp(1rem, 3vw, 1.5rem)',
                                   lineHeight: '1'
                                 }}
                               >
                                 {item.flag}
                               </div>
                             <h4 className="font-medium text-gray-900 mb-0.5 text-xs">{item.country}</h4>
                             <p className="text-xs text-gray-600 mb-1 leading-tight">{item.highlight}</p>
                             <span className="text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded-full">Soon</span>
                           </CardContent>
                         </Card>
                      ))}
                    </div>
                  </div>

                  {/* Compact Newsletter Section */}
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-3 sm:p-4 text-center text-white mx-1">
                    <Bell className="h-8 sm:h-10 w-8 sm:w-10 mx-auto mb-2 opacity-90" />
                    <h3 className="text-sm sm:text-lg font-bold mb-2">Be the First to Know!</h3>
                    <p className="text-xs sm:text-sm mb-3 opacity-90">
                      Join our newsletter for exclusive early access and special discounts.
                    </p>
                    <Button 
                      onClick={handleNewsletterClick}
                      className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm"
                    >
                      <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      Join Newsletter
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {isModalOpen && (
        <Suspense fallback={<div className="fixed inset-0 bg-black/50 flex items-center justify-center"><div className="bg-white p-4 rounded">Loading...</div></div>}>
          <LazyTourPackageModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            tourPackage={selectedPackage}
          />
        </Suspense>
      )}

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultTab="newsletter"
      />
    </div>
  );
};

export default Travel;
