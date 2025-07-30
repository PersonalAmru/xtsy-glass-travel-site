
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Users, Star, Calendar, Mountain, Camera, Compass } from "lucide-react";
import TourPackageModal from "./TourPackageModal";
import { useApp } from "@/contexts/AppContext";
import GalleryImage from "./GalleryImage";

// Import tour package images
import meghalayaHiddenGemsImg from "@/assets/meghalaya-hidden-gems.jpg";
import shillongCulturalImg from "@/assets/shillong-cultural.jpg";
import cherrapunjiMonsoonImg from "@/assets/cherrapunji-monsoon.jpg";
import dawkiRiverImg from "@/assets/dawki-river.jpg";
import mawlynnongVillageImg from "@/assets/mawlynnong-village.jpg";
import garoHillsTribalImg from "@/assets/garo-hills-tribal.jpg";
import jaintiaCavesImg from "@/assets/jaintia-caves.jpg";
import photographyTourImg from "@/assets/photography-tour.jpg";
import wellnessRetreatImg from "@/assets/wellness-retreat.jpg";
import offbeatCircuitImg from "@/assets/offbeat-circuit.jpg";
import khasiHillsTrekImg from "@/assets/khasi-hills-trek.jpg";
import tribalCircuitImg from "@/assets/tribal-circuit.jpg";
import livingRootBridgesImg from "@/assets/living-root-bridges.jpg";
import monsoonChallengeImg from "@/assets/monsoon-challenge.jpg";
import cavesCanyonsImg from "@/assets/caves-canyons.jpg";
import highAltitudeTrekImg from "@/assets/high-altitude-trek.jpg";
import remoteVillagesImg from "@/assets/remote-villages.jpg";
import researchExpeditionImg from "@/assets/research-expedition.jpg";
import heritageTrailImg from "@/assets/heritage-trail.jpg";
import extremeWeatherImg from "@/assets/extreme-weather.jpg";

const TravelItinerariesSection = () => {
  const { formatPrice } = useApp();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePackageClick = (itinerary: any) => {
    setSelectedPackage(itinerary);
    setIsModalOpen(true);
  };

  const itineraries = [
    {
      id: 1,
      title: "Meghalaya Hidden Gems",
      description: "Discover the unexplored waterfalls and living root bridges of Meghalaya",
      duration: "5 Days",
      difficulty: "Moderate",
      price: 12999,
      image: meghalayaHiddenGemsImg,
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
      price: 8999,
      image: shillongCulturalImg,
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
      price: 15999,
      image: cherrapunjiMonsoonImg,
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
      price: 6999,
      image: dawkiRiverImg,
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
      price: 7499,
      image: mawlynnongVillageImg,
      rating: 4.5,
      category: "cultural",
      highlights: ["Sky Walk", "Living Root Bridge", "Organic Gardens"],
      bestSeason: "Oct-Apr"
    },
    {
      id: 6,
      title: "Garo Hills Tribal Experience",
      description: "Explore Garo tribal culture, traditional dances, and handicrafts",
      duration: "4 Days",
      difficulty: "Moderate", 
      price: "₹11,999",
      image: garoHillsTribalImg,
      rating: 4.4,
      category: "cultural",
      highlights: ["Nokrek National Park", "Tribal Villages", "Traditional Crafts"],
      bestSeason: "Nov-Mar"
    },
    {
      id: 7,
      title: "Jaintia Hills Cave Expedition",
      description: "Explore mysterious limestone caves and underground rivers",
      duration: "3 Days",
      difficulty: "Challenging",
      price: "₹10,999",
      image: jaintiaCavesImg,
      rating: 4.6,
      category: "adventure",
      highlights: ["Krem Liat Prah", "Underground Rivers", "Cave Photography"],
      bestSeason: "Dec-May"
    },
    {
      id: 8,
      title: "Meghalaya Photography Tour",
      description: "Capture stunning landscapes with professional photography guidance",
      duration: "6 Days",
      difficulty: "Easy",
      price: "₹18,999",
      image: photographyTourImg,
      rating: 4.8,
      category: "leisure",
      highlights: ["Golden Hour Shots", "Waterfall Photography", "Portrait Sessions"],
      bestSeason: "Oct-Feb"
    },
    {
      id: 9,
      title: "Meghalaya Wellness Retreat",
      description: "Yoga, meditation, and wellness activities in nature's lap",
      duration: "5 Days",
      difficulty: "Easy",
      price: "₹16,999",
      image: wellnessRetreatImg,
      rating: 4.7,
      category: "leisure",
      highlights: ["Morning Yoga", "Nature Meditation", "Organic Meals"],
      bestSeason: "Oct-Mar"
    },
    {
      id: 10,
      title: "Offbeat Meghalaya Circuit",
      description: "Explore lesser-known destinations and hidden treasures",
      duration: "7 Days",
      difficulty: "Moderate",
      price: "₹22,999",
      image: offbeatCircuitImg,
      rating: 4.9,
      category: "adventure",
      highlights: ["Secret Waterfalls", "Untouched Villages", "Local Homestays"],
      bestSeason: "Nov-Apr"
    },
    {
      id: 11,
      title: "Khasi Hills Trekking Expedition",
      description: "Multi-day trekking through pristine Khasi hills and valleys",
      duration: "6 Days",
      difficulty: "Moderate",
      price: "₹19,999",
      image: khasiHillsTrekImg,
      rating: 4.7,
      category: "adventure",
      highlights: ["Highland Trekking", "Camping Under Stars", "Local Guide"],
      bestSeason: "Oct-Mar"
    },
    {
      id: 12,
      title: "Meghalaya Tribal Circuit",
      description: "Deep dive into Khasi, Jaintia, and Garo tribal traditions",
      duration: "8 Days",
      difficulty: "Moderate",
      price: "₹24,999",
      image: tribalCircuitImg,
      rating: 4.6,
      category: "cultural",
      highlights: ["Three Tribal Communities", "Traditional Festivals", "Craft Workshops"],
      bestSeason: "Nov-Feb"
    },
    {
      id: 13,
      title: "Living Root Bridges Explorer",
      description: "Comprehensive journey to all major living root bridges",
      duration: "5 Days",
      difficulty: "Moderate",
      price: "₹17,999",
      image: livingRootBridgesImg,
      rating: 4.8,
      category: "adventure",
      highlights: ["Double Decker Bridge", "Single Root Bridges", "Village Stays"],
      bestSeason: "Dec-May"
    },
    {
      id: 14,
      title: "Meghalaya Monsoon Challenge",
      description: "Experience the ultimate monsoon adventure in wettest regions",
      duration: "6 Days",
      difficulty: "Challenging",
      price: "₹21,999",
      image: monsoonChallengeImg,
      rating: 4.9,
      category: "adventure",
      highlights: ["Extreme Weather", "Waterfall Rappelling", "Rain Forest Trek"],
      bestSeason: "Jun-Sep"
    },
    {
      id: 15,
      title: "Caves and Canyons Expedition",
      description: "Expert-level exploration of deep caves and hidden canyons",
      duration: "7 Days",
      difficulty: "Challenging",
      price: "₹26,999",
      image: cavesCanyonsImg,
      rating: 4.8,
      category: "adventure",
      highlights: ["Spelunking", "Canyon Descent", "Underground Rivers"],
      bestSeason: "Dec-Apr"
    },
    {
      id: 16,
      title: "High Altitude Meghalaya Trek",
      description: "Challenging trek to highest peaks with technical climbing",
      duration: "8 Days",
      difficulty: "Challenging",
      price: "₹29,999",
      image: highAltitudeTrekImg,
      rating: 4.7,
      category: "adventure",
      highlights: ["Technical Climbing", "High Altitude Camps", "Summit Views"],
      bestSeason: "Nov-Mar"
    },
    {
      id: 17,
      title: "Remote Villages Adventure",
      description: "Trek to isolated villages accessible only by foot",
      duration: "9 Days",
      difficulty: "Challenging",
      price: "₹32,999",
      image: remoteVillagesImg,
      rating: 4.9,
      category: "adventure",
      highlights: ["Multi-day Trek", "Remote Communities", "Survival Skills"],
      bestSeason: "Oct-Apr"
    },
    {
      id: 18,
      title: "Meghalaya Research Expedition",
      description: "Scientific exploration of biodiversity and ecology",
      duration: "10 Days",
      difficulty: "Moderate",
      price: "₹28,999",
      image: researchExpeditionImg,
      rating: 4.6,
      category: "cultural",
      highlights: ["Biodiversity Study", "Research Documentation", "Expert Guides"],
      bestSeason: "Nov-Feb"
    },
    {
      id: 19,
      title: "Heritage Trail Marathon",
      description: "Intensive cultural immersion across historical sites",
      duration: "6 Days",
      difficulty: "Moderate",
      price: "₹20,999",
      image: heritageTrailImg,
      rating: 4.5,
      category: "cultural",
      highlights: ["Historical Sites", "Archaeological Walks", "Heritage Stories"],
      bestSeason: "Oct-Mar"
    },
    {
      id: 20,
      title: "Extreme Weather Survival",
      description: "Ultimate test of endurance in Meghalaya's harshest conditions",
      duration: "5 Days",
      difficulty: "Challenging",
      price: "₹25,999",
      image: extremeWeatherImg,
      rating: 4.8,
      category: "adventure",
      highlights: ["Survival Training", "Extreme Weather", "Self-Reliance"],
      bestSeason: "Jun-Aug"
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
    <>
    <section id="travel-itineraries" className="py-20 bg-gradient-to-br from-slate-50 via-orange-50 to-red-50 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-100/30 via-transparent to-red-100/30" />
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500" />
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-200/30 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-red-200/30 rounded-full blur-3xl" />
      
      <div className="relative z-10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-playfair">
              Curated Travel Itineraries
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full" />
          </div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8 bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            Discover Meghalaya's hidden treasures with our expertly crafted travel packages. 
            From thrilling adventures to cultural immersions, find your perfect journey and create memories that last forever!
          </p>

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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItineraries.map((itinerary) => (
            <Card 
              key={itinerary.id} 
              className="group hover:shadow-2xl hover:scale-105 transition-all duration-500 overflow-hidden border-0 bg-white/90 backdrop-blur-md cursor-pointer"
              onClick={() => handlePackageClick(itinerary)}
            >
              <div className="relative overflow-hidden">
                <GalleryImage
                  src={itinerary.image} 
                  alt={itinerary.title}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  category="tour-destinations"
                  tag={itinerary.category === 'adventure' ? 'adventure-tours' : 
                       itinerary.category === 'cultural' ? 'cultural-tours' : 
                       'leisure-tours'}
                  title={`View ${itinerary.title} in Gallery`}
                  overlay={false}
                >
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary" className="bg-white/90 text-gray-800">
                      {itinerary.category}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-sm font-bold">
                    {typeof itinerary.price === 'number' ? formatPrice(itinerary.price) : itinerary.price}
                  </div>
                </GalleryImage>
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
      </div>
    </section>

    <TourPackageModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      tourPackage={selectedPackage}
    />
    </>
  );
};

export default TravelItinerariesSection;
