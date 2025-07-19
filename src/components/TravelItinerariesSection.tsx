
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Users, Star, Calendar, Mountain, Camera, Compass } from "lucide-react";

const TravelItinerariesSection = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

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
      title: "Garo Hills Tribal Experience",
      description: "Explore Garo tribal culture, traditional dances, and handicrafts",
      duration: "4 Days",
      difficulty: "Moderate", 
      price: "₹11,999",
      image: "",
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
      image: "",
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
      image: "",
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
      image: "",
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
      image: "",
      rating: 4.9,
      category: "adventure",
      highlights: ["Secret Waterfalls", "Untouched Villages", "Local Homestays"],
      bestSeason: "Nov-Apr"
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
    <section id="travel-itineraries" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Curated Travel Itineraries
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Discover Meghalaya's hidden treasures with our expertly crafted travel packages. 
            From thrilling adventures to cultural immersions, find your perfect journey.
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
            <Card key={itinerary.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-0 bg-white/80 backdrop-blur-sm">
              <div className="relative overflow-hidden">
                <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border-b">
                  <div className="text-center">
                    <Camera className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">Package Image</p>
                    <p className="text-gray-400 text-xs">Ready for Supabase URL</p>
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
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white">
                    <MapPin className="h-4 w-4 mr-2" />
                    Book This Journey
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="px-8">
            View All Packages
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TravelItinerariesSection;
