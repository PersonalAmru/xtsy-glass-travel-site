import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Globe, Package, Bell, Mail, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TourPackageCard from "@/components/TourPackageCard";
import TourPackageModal from "@/components/TourPackageModal";
import { AuthModal } from "@/components/AuthModal";
// Optimized images for different destinations and activities
const meghalayaHero = "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&q=80";
const uttarakhandImage = "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80";
const sikkimImage = "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&q=80";
const himachalImage = "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=800&q=80";
const keralaImage = "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&q=80";
const tamilNaduImage = "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&q=80";

// Additional images for variety
const waterfallImage = "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80";
const mountainImage = "https://images.unsplash.com/photo-1464822759844-d150baec0494?w=800&q=80";
const lakeImage = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80";
const templeImage = "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80";
const forestImage = "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80";
const cultureImage = "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=800&q=80";
const adventureImage = "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80";
const hillStationImage = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80";

const Travel = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'domestic' | 'international'>('domestic');
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [daysFilter, setDaysFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tab = urlParams.get('tab');
    if (tab === 'domestic' || tab === 'international') {
      setActiveTab(tab);
    }
  }, [location.search]);

  const handlePackageClick = (itinerary: any) => {
    setSelectedPackage(itinerary);
    setIsModalOpen(true);
  };

  const handleNewsletterClick = () => {
    setIsAuthModalOpen(true);
  };

  // Enhanced tour packages data with more states
  const itineraries = [
    // Meghalaya packages
    {
      id: 1,
      title: "Meghalaya Hidden Gems",
      description: "Discover the unexplored waterfalls and living root bridges of Meghalaya",
      duration: "5 Days",
      difficulty: "Moderate",
      price: "₹12,999",
      image: meghalayaHero,
      rating: 4.8,
      category: "adventure",
      location: "Meghalaya",
      highlights: ["Double Decker Root Bridge", "Rainbow Falls", "Crystal Clear Pools"],
      bestSeason: "Oct-Mar"
    },
    {
      id: 2,
      title: "Shillong Cultural Experience",
      description: "Immerse yourself in Khasi culture, local markets, and traditional cuisine",
      duration: "3 Days",
      difficulty: "Easy",
      price: "₹8,999",
      image: cultureImage,
      rating: 4.6,
      category: "cultural",
      location: "Meghalaya",
      highlights: ["Police Bazaar", "Don Bosco Museum", "Local Food Tours"],
      bestSeason: "Year Round"
    },
    {
      id: 3,
      title: "Cherrapunji Monsoon Trek",
      description: "Experience the wettest place on earth during monsoon season",
      duration: "4 Days",
      difficulty: "Challenging",
      price: "₹15,999",
      image: waterfallImage,
      rating: 4.9,
      category: "adventure",
      location: "Meghalaya",
      highlights: ["Nohkalikai Falls", "Mawsmai Caves", "Living Root Bridges"],
      bestSeason: "Jun-Sep"
    },
    {
      id: 4,
      title: "Dawki River Adventure",
      description: "Crystal clear waters and boating experience at Indo-Bangladesh border",
      duration: "2 Days",
      difficulty: "Easy",
      price: "₹6,999",
      image: lakeImage,
      rating: 4.7,
      category: "leisure",
      location: "Meghalaya",
      highlights: ["Umngot River", "Transparent Water Boating", "Border Views"],
      bestSeason: "Nov-May"
    },
    {
      id: 5,
      title: "Mawlynnong Clean Village Tour",
      description: "Visit Asia's cleanest village and experience sustainable living",
      duration: "2 Days", 
      difficulty: "Easy",
      price: "₹7,499",
      image: forestImage,
      rating: 4.5,
      category: "cultural",
      location: "Meghalaya",
      highlights: ["Sky Walk", "Living Root Bridge", "Organic Gardens"],
      bestSeason: "Oct-Apr"
    },
    
    // Uttarakhand packages
    {
      id: 6,
      title: "Char Dham Yatra Complete",
      description: "Sacred pilgrimage to all four dhams - Kedarnath, Badrinath, Gangotri, and Yamunotri",
      duration: "12 Days",
      difficulty: "Challenging",
      price: "₹35,999",
      image: uttarakhandImage,
      rating: 4.9,
      category: "cultural",
      location: "Uttarakhand",
      highlights: ["Four Sacred Dhams", "Helicopter Options", "Guided Tours"],
      bestSeason: "May-Oct"
    },
    {
      id: 7,
      title: "Rishikesh Adventure Special",
      description: "World capital of yoga, river rafting, and spiritual experiences",
      duration: "4 Days",
      difficulty: "Moderate",
      price: "₹11,999",
      image: adventureImage,
      rating: 4.8,
      category: "adventure",
      location: "Uttarakhand",
      highlights: ["River Rafting", "Yoga Sessions", "Ganga Aarti"],
      bestSeason: "Oct-Mar"
    },
    {
      id: 8,
      title: "Nainital Lake District",
      description: "Explore the lake district of Uttarakhand with scenic hill stations",
      duration: "6 Days",
      difficulty: "Easy",
      price: "₹18,999",
      image: lakeImage,
      rating: 4.7,
      category: "leisure",
      location: "Uttarakhand",
      highlights: ["Naini Lake", "Bhimtal", "Mall Road"],
      bestSeason: "Mar-Jun"
    },
    {
      id: 9,
      title: "Valley of Flowers Trek",
      description: "UNESCO World Heritage site with rare alpine flowers and meadows",
      duration: "8 Days",
      difficulty: "Challenging",
      price: "₹24,999",
      image: mountainImage,
      rating: 4.9,
      category: "adventure",
      location: "Uttarakhand",
      highlights: ["Alpine Flowers", "Hemkund Sahib", "Ghangaria"],
      bestSeason: "Jul-Sep"
    },
    
    // Sikkim packages
    {
      id: 10,
      title: "Sikkim Himalayan Explorer",
      description: "Complete Sikkim tour covering all major attractions and monasteries",
      duration: "7 Days",
      difficulty: "Moderate",
      price: "₹22,999",
      image: sikkimImage,
      rating: 4.8,
      category: "cultural",
      location: "Sikkim",
      highlights: ["Gangtok", "Rumtek Monastery", "Tsomgo Lake"],
      bestSeason: "Mar-Jun"
    },
    {
      id: 11,
      title: "Gurudongmar Lake Expedition",
      description: "High altitude sacred lake adventure with breathtaking mountain views",
      duration: "5 Days",
      difficulty: "Challenging",
      price: "₹19,999",
      image: mountainImage,
      rating: 4.9,
      category: "adventure",
      location: "Sikkim",
      highlights: ["Gurudongmar Lake", "Lachung", "Yumthang Valley"],
      bestSeason: "Apr-Jun"
    },
    {
      id: 12,
      title: "Pelling Kanchenjunga View",
      description: "Witness the third highest peak in the world from scenic Pelling",
      duration: "4 Days",
      difficulty: "Easy",
      price: "₹13,999",
      image: hillStationImage,
      rating: 4.6,
      category: "leisure",
      location: "Sikkim",
      highlights: ["Kanchenjunga View", "Pemayangtse Monastery", "Khecheopalri Lake"],
      bestSeason: "Oct-Dec"
    },
    
    // Himachal Pradesh packages
    {
      id: 13,
      title: "Shimla Manali Honeymoon",
      description: "Romantic hill station package perfect for couples and honeymooners",
      duration: "6 Days",
      difficulty: "Easy",
      price: "₹16,999",
      image: himachalImage,
      rating: 4.7,
      category: "leisure",
      location: "Himachal Pradesh",
      highlights: ["Mall Road", "Rohtang Pass", "Solang Valley"],
      bestSeason: "Mar-Jun"
    },
    {
      id: 14,
      title: "Spiti Valley Circuit",
      description: "High altitude cold desert adventure through remote Spiti Valley",
      duration: "10 Days",
      difficulty: "Challenging",
      price: "₹32,999",
      image: mountainImage,
      rating: 4.9,
      category: "adventure",
      location: "Himachal Pradesh",
      highlights: ["Key Monastery", "Chandratal Lake", "Kaza"],
      bestSeason: "Jun-Sep"
    },
    {
      id: 15,
      title: "Dharamshala McLeod Ganj",
      description: "Explore the Dalai Lama's residence and Tibetan culture",
      duration: "4 Days",
      difficulty: "Easy",
      price: "₹12,999",
      image: templeImage,
      rating: 4.6,
      category: "cultural",
      location: "Himachal Pradesh",
      highlights: ["Dalai Lama Temple", "Bhagsu Waterfall", "Tibetan Market"],
      bestSeason: "Mar-Jun"
    },
    
    // Kerala packages
    {
      id: 16,
      title: "Kerala Backwaters & Beaches",
      description: "God's Own Country - backwaters, beaches, and hill stations",
      duration: "8 Days",
      difficulty: "Easy",
      price: "₹25,999",
      image: keralaImage,
      rating: 4.8,
      category: "leisure",
      location: "Kerala",
      highlights: ["Alleppey Houseboat", "Munnar Hills", "Kovalam Beach"],
      bestSeason: "Oct-Mar"
    },
    {
      id: 17,
      title: "Munnar Tea Garden Experience",
      description: "Explore the lush tea plantations and spice gardens of Munnar",
      duration: "5 Days",
      difficulty: "Easy",
      price: "₹14,999",
      image: keralaImage,
      rating: 4.7,
      category: "cultural",
      location: "Kerala",
      highlights: ["Tea Museum", "Mattupetty Dam", "Spice Plantations"],
      bestSeason: "Sep-Mar"
    },
    {
      id: 18,
      title: "Thekkady Wildlife Safari",
      description: "Wildlife adventure in Periyar National Park with boat safaris",
      duration: "3 Days",
      difficulty: "Easy",
      price: "₹9,999",
      image: forestImage,
      rating: 4.5,
      category: "adventure",
      location: "Kerala",
      highlights: ["Periyar National Park", "Boat Safari", "Spice Gardens"],
      bestSeason: "Dec-Apr"
    },
    
    // Tamil Nadu packages
    {
      id: 19,
      title: "Tamil Nadu Temple Circuit",
      description: "Spiritual journey through ancient temples and cultural heritage",
      duration: "7 Days",
      difficulty: "Easy",
      price: "₹17,999",
      image: tamilNaduImage,
      rating: 4.6,
      category: "cultural",
      location: "Tamil Nadu",
      highlights: ["Meenakshi Temple", "Brihadeeswarar Temple", "Kanyakumari"],
      bestSeason: "Oct-Mar"
    },
    {
      id: 20,
      title: "Ooty Kodaikanal Hill Stations",
      description: "Queen of hill stations with scenic beauty and pleasant weather",
      duration: "6 Days",
      difficulty: "Easy",
      price: "₹15,999",
      image: hillStationImage,
      rating: 4.7,
      category: "leisure",
      location: "Tamil Nadu",
      highlights: ["Ooty Lake", "Doddabetta Peak", "Kodai Lake"],
      bestSeason: "Oct-Jun"
    },
    
    // Other Northeast states
    {
      id: 21,
      title: "Arunachal Pradesh Eagle Festival",
      description: "Experience the vibrant culture and traditions of Arunachal Pradesh",
      duration: "6 Days",
      difficulty: "Moderate",
      price: "₹18,999",
      image: cultureImage,
      rating: 4.7,
      category: "cultural",
      location: "Arunachal Pradesh",
      highlights: ["Traditional Dances", "Local Tribes", "Mountain Views"],
      bestSeason: "Dec-Feb"
    },
    {
      id: 22,
      title: "Nagaland Hornbill Festival",
      description: "Witness the spectacular Hornbill Festival showcasing Naga culture",
      duration: "5 Days",
      difficulty: "Easy",
      price: "₹16,999",
      image: cultureImage,
      rating: 4.8,
      category: "cultural",
      location: "Nagaland",
      highlights: ["Hornbill Festival", "Naga Cuisine", "Traditional Crafts"],
      bestSeason: "Dec"
    },
    {
      id: 23,
      title: "Assam Tea Garden Safari",
      description: "Explore the lush tea gardens and wildlife sanctuaries of Assam",
      duration: "7 Days",
      difficulty: "Moderate",
      price: "₹19,999",
      image: keralaImage,
      rating: 4.6,
      category: "adventure",
      location: "Assam",
      highlights: ["Tea Plantation Tours", "Kaziranga National Park", "River Safari"],
      bestSeason: "Nov-Apr"
    },
    {
      id: 24,
      title: "Manipur Loktak Lake Adventure",
      description: "Discover the floating islands and unique ecosystem of Loktak Lake",
      duration: "4 Days",
      difficulty: "Easy",
      price: "₹12,999",
      image: lakeImage,
      rating: 4.5,
      category: "adventure",
      location: "Manipur",
      highlights: ["Floating Islands", "Phumdis", "Sangai Deer"],
      bestSeason: "Oct-Mar"
    }
  ];

  const categories = [
    { id: "all", label: "All Packages" },
    { id: "adventure", label: "Adventure" },
    { id: "cultural", label: "Cultural" },
    { id: "leisure", label: "Leisure" }
  ];

  const difficulties = ["all", "Easy", "Moderate", "Challenging"];
  const days = ["all", "1-3 Days", "4-6 Days", "7+ Days"];
  const locations = ["all", "Meghalaya", "Uttarakhand", "Sikkim", "Himachal Pradesh", "Kerala", "Tamil Nadu", "Assam", "Arunachal Pradesh", "Nagaland", "Manipur"];

  const filteredItineraries = itineraries.filter(item => {
    const categoryMatch = selectedCategory === "all" || item.category === selectedCategory;
    const difficultyMatch = difficultyFilter === "all" || item.difficulty === difficultyFilter;
    const locationMatch = locationFilter === "all" || item.location === locationFilter;
    
    let daysMatch = true;
    if (daysFilter !== "all") {
      const itemDays = parseInt(item.duration);
      if (daysFilter === "1-3 Days") daysMatch = itemDays >= 1 && itemDays <= 3;
      else if (daysFilter === "4-6 Days") daysMatch = itemDays >= 4 && itemDays <= 6;
      else if (daysFilter === "7+ Days") daysMatch = itemDays >= 7;
    }
    
    return categoryMatch && difficultyMatch && daysMatch && locationMatch;
  });

  const meghalayaPackages = filteredItineraries.filter(item => item.location === "Meghalaya");
  const otherPackages = filteredItineraries.filter(item => item.location !== "Meghalaya");

  const clearFilters = () => {
    setSelectedCategory("all");
    setDifficultyFilter("all");
    setDaysFilter("all");
    setLocationFilter("all");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="bg-gradient-to-br from-slate-50 via-orange-50 to-red-50 relative overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-100/30 via-transparent to-red-100/30" />
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500" />
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-200/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-red-200/30 rounded-full blur-3xl" />
          
          <div className="relative z-10 py-20">
            <div className="container mx-auto px-4">
              {/* Header */}
              <div className="text-center mb-12">
                <div className="inline-block p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl mb-6">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent mb-4 font-playfair">
                    XTSY Travel
                  </h1>
                  <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full" />
                </div>
                <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8 bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                  Embark on extraordinary journeys with XTSY Travel - your gateway to incredible experiences across India and beyond.
                </p>
              </div>

              {/* Tab Navigation */}
              <div className="flex justify-center mb-12">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-2 shadow-lg">
                  <Button
                    onClick={() => setActiveTab('domestic')}
                    variant={activeTab === 'domestic' ? 'default' : 'ghost'}
                    className="mr-2"
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Domestic Travel
                  </Button>
                  <Button
                    onClick={() => setActiveTab('international')}
                    variant={activeTab === 'international' ? 'default' : 'ghost'}
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    International Travel
                  </Button>
                </div>
              </div>

              {/* Content */}
              {activeTab === 'domestic' && (
                <div>
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                      🏔️ Discover Northeast India & Beyond - Incredible India Awaits
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                      Explore the mystical beauty of Northeast India and iconic destinations across the country with our specially curated travel experiences
                    </p>
                  </div>

                  {/* Filters */}
                  <div className="mb-8 bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Filter className="h-5 w-5 text-gray-600" />
                        <span className="font-semibold text-gray-900">Filters:</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-4">
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                          <SelectTrigger className="w-40">
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

                        <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                          <SelectTrigger className="w-40">
                            <SelectValue placeholder="Difficulty" />
                          </SelectTrigger>
                          <SelectContent>
                            {difficulties.map((difficulty) => (
                              <SelectItem key={difficulty} value={difficulty}>
                                {difficulty === "all" ? "All Levels" : difficulty}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select value={daysFilter} onValueChange={setDaysFilter}>
                          <SelectTrigger className="w-40">
                            <SelectValue placeholder="Duration" />
                          </SelectTrigger>
                          <SelectContent>
                            {days.map((day) => (
                              <SelectItem key={day} value={day}>
                                {day === "all" ? "Any Duration" : day}
                                </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select value={locationFilter} onValueChange={setLocationFilter}>
                          <SelectTrigger className="w-40">
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
                      </div>
                      
                      <Button 
                        variant="outline" 
                        onClick={clearFilters}
                        className="ml-auto"
                      >
                        Clear Filters
                      </Button>
                    </div>
                  </div>

                  {/* Meghalaya Packages Section */}
                  {meghalayaPackages.length > 0 && (
                    <div className="mb-16">
                      <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          🏔️ Meghalaya - The Abode of Clouds
                        </h3>
                        <p className="text-gray-600">
                          Experience the enchanting beauty of Meghalaya with our specialized packages
                        </p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {meghalayaPackages.map((itinerary) => (
                          <TourPackageCard
                            key={itinerary.id}
                            tourPackage={itinerary}
                            onPackageClick={() => handlePackageClick(itinerary)}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Other Destinations */}
                  {otherPackages.length > 0 && (
                    <div>
                      <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          🌟 Other Incredible Destinations
                        </h3>
                        <p className="text-gray-600">
                          Discover the diverse cultures and landscapes across India
                        </p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {otherPackages.map((itinerary) => (
                          <TourPackageCard
                            key={itinerary.id}
                            tourPackage={itinerary}
                            onPackageClick={() => handlePackageClick(itinerary)}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {filteredItineraries.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-gray-500 text-lg">No packages found matching your filters.</p>
                      <Button 
                        onClick={clearFilters}
                        className="mt-4 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
                      >
                        Clear All Filters
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'international' && (
                <div className="max-w-4xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* XTSY Asia */}
                    <Card className="group hover:shadow-2xl hover:scale-105 transition-all duration-500 overflow-hidden border-0 bg-white/90 backdrop-blur-md">
                      <div className="relative overflow-hidden">
                        <div className="w-full h-64 bg-gradient-to-br from-blue-100 to-purple-200 flex items-center justify-center">
                          <div className="text-center">
                            <Globe className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">XTSY Asia</h3>
                            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                              Launching Soon
                            </div>
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <h4 className="text-xl font-semibold mb-3 text-gray-900">Expanding Horizons</h4>
                        <p className="text-gray-600 mb-4">
                          Get ready to explore Asia like never before! XTSY Asia is bringing you authentic travel experiences across Southeast Asia, East Asia, and beyond.
                        </p>
                        <div className="space-y-2 text-sm text-gray-600">
                          <p>🏝️ Tropical Island Getaways</p>
                          <p>🏔️ Mountain Adventures</p>
                          <p>🏛️ Cultural Immersions</p>
                          <p>🍜 Culinary Journeys</p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* XTSY Merchandise */}
                    <Card className="group hover:shadow-2xl hover:scale-105 transition-all duration-500 overflow-hidden border-0 bg-white/90 backdrop-blur-md">
                      <div className="relative overflow-hidden">
                        <div className="w-full h-64 bg-gradient-to-br from-green-100 to-teal-200 flex items-center justify-center">
                          <div className="text-center">
                            <Package className="h-16 w-16 text-green-500 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">XTSY Merchandise</h3>
                            <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                              Coming Soon
                            </div>
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <h4 className="text-xl font-semibold mb-3 text-gray-900">Travel in Style</h4>
                        <p className="text-gray-600 mb-4">
                          Carry the XTSY vibe wherever you go! Our exclusive travel merchandise collection is designed for modern nomads who value quality and style.
                        </p>
                        <div className="space-y-2 text-sm text-gray-600">
                          <p>🎒 Premium Travel Gear</p>
                          <p>👕 Comfortable Apparel</p>
                          <p>☕ Lifestyle Accessories</p>
                          <p>🌿 Eco-Friendly Products</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Newsletter Subscription */}
                  <Card className="mt-12 bg-gradient-to-r from-orange-500 to-red-600 text-white border-0">
                    <CardContent className="p-8 text-center">
                      <Bell className="h-12 w-12 mx-auto mb-4 text-white/90" />
                      <h3 className="text-2xl font-bold mb-4">Stay in the Loop!</h3>
                      <p className="text-lg mb-6 text-white/90">
                        Be the first to know about XTSY Asia launches, new destinations, exclusive deals, and merchandise drops.
                      </p>
                      <Button 
                        onClick={handleNewsletterClick}
                        size="lg"
                        className="bg-white text-orange-600 hover:bg-gray-100 font-semibold px-8 py-3"
                      >
                        <Mail className="h-5 w-5 mr-2" />
                        Subscribe to Newsletter
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <TourPackageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tourPackage={selectedPackage}
      />

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultTab="newsletter"
      />
    </div>
  );
};

export default Travel;
