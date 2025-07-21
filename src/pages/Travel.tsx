
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Users, Star, Calendar, Mountain, Camera, Compass, Globe, Package, Bell, Mail } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TourPackageModal from "@/components/TourPackageModal";
import { AuthModal } from "@/components/AuthModal";

const Travel = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'domestic' | 'international'>('domestic');
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Handle URL parameters
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

  // Tour packages data (moved from TravelItinerariesSection)
  const itineraries = [
    {
      id: 1,
      title: "Meghalaya Hidden Gems",
      description: "Discover the unexplored waterfalls and living root bridges of Meghalaya",
      duration: "5 Days",
      difficulty: "Moderate",
      price: "₹12,999",
      image: "",
      rating: 4.8,
      category: "adventure",
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
      image: "",
      rating: 4.6,
      category: "cultural",
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
      image: "",
      rating: 4.9,
      category: "adventure",
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
      image: "",
      rating: 4.7,
      category: "leisure",
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
      image: "",
      rating: 4.5,
      category: "cultural",
      highlights: ["Sky Walk", "Living Root Bridge", "Organic Gardens"],
      bestSeason: "Oct-Apr"
    },
    {
      id: 6,
      title: "Arunachal Pradesh Eagle Festival",
      description: "Experience the vibrant culture and traditions of Arunachal Pradesh",
      duration: "6 Days",
      difficulty: "Moderate",
      price: "₹18,999",
      image: "",
      rating: 4.7,
      category: "cultural",
      highlights: ["Traditional Dances", "Local Tribes", "Mountain Views"],
      bestSeason: "Dec-Feb"
    },
    {
      id: 7,
      title: "Nagaland Hornbill Festival",
      description: "Witness the spectacular Hornbill Festival showcasing Naga culture",
      duration: "5 Days",
      difficulty: "Easy",
      price: "₹16,999",
      image: "",
      rating: 4.8,
      category: "cultural",
      highlights: ["Hornbill Festival", "Naga Cuisine", "Traditional Crafts"],
      bestSeason: "Dec"
    },
    {
      id: 8,
      title: "Ziro Music Festival Experience",
      description: "Enjoy indie music amidst the beautiful Ziro Valley landscapes",
      duration: "4 Days",
      difficulty: "Easy",
      price: "₹14,999",
      image: "",
      rating: 4.9,
      category: "leisure",
      highlights: ["Music Festival", "Apatani Culture", "Valley Views"],
      bestSeason: "Sep"
    },
    {
      id: 9,
      title: "Assam Tea Garden Safari",
      description: "Explore the lush tea gardens and wildlife sanctuaries of Assam",
      duration: "7 Days",
      difficulty: "Moderate",
      price: "₹19,999",
      image: "",
      rating: 4.6,
      category: "adventure",
      highlights: ["Tea Plantation Tours", "Kaziranga National Park", "River Safari"],
      bestSeason: "Nov-Apr"
    },
    {
      id: 10,
      title: "Manipur Loktak Lake Adventure",
      description: "Discover the floating islands and unique ecosystem of Loktak Lake",
      duration: "4 Days",
      difficulty: "Easy",
      price: "₹12,999",
      image: "",
      rating: 4.5,
      category: "adventure",
      highlights: ["Floating Islands", "Phumdis", "Sangai Deer"],
      bestSeason: "Oct-Mar"
    }
  ];

  const categories = [
    { id: "all", label: "All Packages", icon: Compass },
    { id: "adventure", label: "Adventure", icon: Mountain },
    { id: "cultural", label: "Cultural", icon: Users },
    { id: "leisure", label: "Leisure", icon: Camera }
  ];

  const filteredItineraries = selectedCategory === "all" 
    ? itineraries 
    : itineraries.filter(item => item.category === selectedCategory);

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
                      🇮🇳 Exclusive Travel Plans - Assam & Meghalaya
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                      Discover the enchanting Northeast India with our curated travel packages
                    </p>
                  </div>

                  {/* Category Filter */}
                  <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {categories.map((category) => {
                      const IconComponent = category.icon;
                      return (
                        <Button
                          key={category.id}
                          variant={selectedCategory === category.id ? "default" : "outline"}
                          onClick={() => setSelectedCategory(category.id)}
                          className="flex items-center gap-2"
                        >
                          <IconComponent className="h-4 w-4" />
                          {category.label}
                        </Button>
                      );
                    })}
                  </div>

                  {/* Tour Packages Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredItineraries.map((itinerary) => (
                      <Card 
                        key={itinerary.id} 
                        className="group hover:shadow-2xl hover:scale-105 transition-all duration-500 overflow-hidden border-0 bg-white/90 backdrop-blur-md cursor-pointer"
                        onClick={() => handlePackageClick(itinerary)}
                      >
                        <div className="relative overflow-hidden">
                          <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border-b">
                            <div className="text-center">
                              <Camera className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                              <p className="text-gray-500 text-sm">Package Image</p>
                            </div>
                          </div>
                          <div className="absolute top-4 left-4">
                            <Badge variant="secondary" className="bg-white/90 text-gray-800">
                              {itinerary.category}
                            </Badge>
                          </div>
                          <div className="absolute top-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-sm font-bold">
                            {itinerary.price}
                          </div>
                        </div>
                        
                        <CardHeader>
                          <div className="flex justify-between items-start mb-2">
                            <CardTitle className="text-xl group-hover:text-orange-600 transition-colors">
                              {itinerary.title}
                            </CardTitle>
                            <div className="flex items-center gap-1 text-yellow-500">
                              <Star className="h-4 w-4 fill-current" />
                              <span className="text-sm font-medium text-gray-700">{itinerary.rating}</span>
                            </div>
                          </div>
                          <CardDescription className="text-gray-600">
                            {itinerary.description}
                          </CardDescription>
                        </CardHeader>
                        
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {itinerary.duration}
                            </div>
                            <div className="flex items-center gap-1">
                              <Mountain className="h-4 w-4" />
                              {itinerary.difficulty}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {itinerary.bestSeason}
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <h4 className="font-semibold text-gray-900">Highlights:</h4>
                            <div className="flex flex-wrap gap-1">
                              {itinerary.highlights.map((highlight, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {highlight}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div className="pt-4">
                            <Button 
                              className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePackageClick(itinerary);
                              }}
                            >
                              <MapPin className="h-4 w-4 mr-2" />
                              Book This Journey
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
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
                            <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                              Launching Soon
                            </Badge>
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
                            <Badge className="bg-gradient-to-r from-green-500 to-teal-600 text-white">
                              Coming Soon
                            </Badge>
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
