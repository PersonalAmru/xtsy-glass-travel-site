
import { useState } from "react";
import { Mountain, Waves, TreePine, Camera, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const AdventureSection = () => {
  const [activeTab, setActiveTab] = useState("trekking");
  const [selectedAdventure, setSelectedAdventure] = useState<string | null>(null);

  const adventures = [
    {
      id: "trekking",
      icon: Mountain,
      title: "Trekking Expeditions",
      description: "Discover breathtaking mountain trails and hidden valleys",
      fullDescription: "Embark on unforgettable trekking adventures through Meghalaya's pristine landscapes. Our guided expeditions take you through lush green valleys, dense forests, and breathtaking mountain trails. Experience the thrill of conquering peaks while immersing yourself in the natural beauty of the Northeast. Perfect for both beginners and experienced trekkers, with routes ranging from easy day hikes to challenging multi-day expeditions.",
      highlights: [
        "Professional mountain guides",
        "All necessary trekking equipment provided",
        "Multiple difficulty levels available",
        "Scenic photography opportunities",
        "Local cultural interactions",
        "Safety equipment and first aid support"
      ],
      duration: "Half-day to 7-day expeditions",
      difficulty: "Easy to Challenging",
      includes: "Guide, equipment, meals, permits",
      gradient: "from-green-500 to-emerald-600"
    },
    {
      id: "water-sports",
      icon: Waves,
      title: "Water Adventures",
      description: "Thrilling water sports and river expeditions",
      fullDescription: "Dive into exciting water adventures across Meghalaya's pristine rivers and lakes. From white-water rafting to kayaking and boating, experience the rush of navigating crystal-clear waters surrounded by stunning landscapes. Our water sports activities are designed for all skill levels, with professional instructors ensuring your safety while maximizing the fun.",
      highlights: [
        "White-water rafting on pristine rivers",
        "Kayaking in calm lakes and rivers",
        "Boating excursions to hidden spots",
        "Swimming in natural pools",
        "Certified water sports instructors",
        "All safety equipment provided"
      ],
      duration: "2 hours to full day",
      difficulty: "Beginner to Advanced",
      includes: "Instructor, equipment, safety gear, transport",
      gradient: "from-blue-500 to-cyan-600"
    },
    {
      id: "nature-walks",
      icon: TreePine,
      title: "Nature & Wildlife",
      description: "Guided nature walks and wildlife spotting tours",
      fullDescription: "Explore Meghalaya's rich biodiversity through guided nature walks and wildlife spotting tours. Discover rare flora and fauna, learn about local ecosystems, and witness the incredible variety of birds and animals that call this region home. Our expert naturalists will help you understand and appreciate the delicate balance of nature in this biodiversity hotspot.",
      highlights: [
        "Expert naturalist guides",
        "Bird watching opportunities",
        "Flora and fauna identification",
        "Photography workshops",
        "Eco-system education",
        "Visit to conservation areas"
      ],
      duration: "2-6 hours",
      difficulty: "Easy to Moderate",
      includes: "Naturalist guide, binoculars, field guides",
      gradient: "from-green-600 to-teal-600"
    },
    {
      id: "photography",
      icon: Camera,
      title: "Photography Tours",
      description: "Capture stunning landscapes and cultural moments",
      fullDescription: "Join our specialized photography tours designed to capture the best of Meghalaya's natural beauty and cultural richness. Whether you're a professional photographer or an enthusiast, our tours take you to the most photogenic locations at optimal times for lighting. Learn techniques, composition, and post-processing while creating a stunning portfolio of your Northeast adventure.",
      highlights: [
        "Professional photography guidance",
        "Best time and location scouting",
        "Landscape and portrait techniques",
        "Cultural photography opportunities",
        "Equipment recommendations",
        "Post-processing workshops"
      ],
      duration: "Half-day to multi-day tours",
      difficulty: "All levels welcome",
      includes: "Photography guide, location access, tips & techniques",
      gradient: "from-purple-500 to-pink-600"
    }
  ];

  const activeAdventure = adventures.find(adventure => adventure.id === activeTab);
  const selectedAdventureDetails = adventures.find(adventure => adventure.id === selectedAdventure);

  const handleBookAdventure = () => {
    const message = `Hi XTSY! I'm interested in booking the ${selectedAdventureDetails?.title} adventure. Please check availability and provide more details.`;
    const whatsappUrl = `https://wa.me/918837317070?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section className="py-16 sm:py-20 px-3 sm:px-4 bg-gradient-to-br from-slate-100 via-white to-slate-100 relative overflow-hidden">
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-3 sm:mb-4 font-serif-sans">
            Curated Meghalaya Itineraries
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto font-seasons px-4">
            Choose from our range of accommodations designed for every traveler's needs and budget
          </p>
        </div>

        {/* Horizontal Tab Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-0 mb-12 sm:mb-16 px-4">
          {adventures.map((adventure, index) => (
            <Button
              key={adventure.id}
              variant={activeTab === adventure.id ? "default" : "outline"}
              onClick={() => setActiveTab(adventure.id)}
              className={`px-4 sm:px-6 lg:px-8 py-3 sm:py-4 font-bold transition-all duration-300 text-sm sm:text-base flex-1 sm:flex-none ${
                index === 0 ? 'sm:rounded-r-none' : 
                index === adventures.length - 1 ? 'sm:rounded-l-none' : 
                'sm:rounded-none'
              } ${
                activeTab === adventure.id
                  ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-xl border-orange-400"
                  : "border-orange-300/60 text-gray-800 bg-white hover:bg-orange-50 hover:border-orange-400/80 hover:text-orange-600"
              } font-seasons border-2`}
            >
              <adventure.icon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
              <span className="text-xs sm:text-sm lg:text-base whitespace-nowrap">{adventure.title}</span>
            </Button>
          ))}
        </div>

        {/* Active Adventure Content */}
        {activeAdventure && (
          <Card className="bg-white border-2 border-gray-200 max-w-4xl mx-auto transform hover:scale-105 transition-all duration-300 shadow-xl mx-3 sm:mx-auto">
            <CardHeader className="text-center pb-3 sm:pb-4">
              <div className={`mx-auto w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-gradient-to-r ${activeAdventure.gradient} rounded-2xl sm:rounded-3xl flex items-center justify-center mb-4 sm:mb-6 shadow-2xl relative transform hover:rotate-3 transition-transform duration-300`}>
                <div className={`absolute inset-0 bg-gradient-to-r ${activeAdventure.gradient} rounded-2xl sm:rounded-3xl blur-xl opacity-60 scale-110`}></div>
                <div className={`absolute inset-0 bg-gradient-to-br from-white/40 to-transparent rounded-2xl sm:rounded-3xl`}></div>
                <div className={`absolute inset-1 bg-gradient-to-tl from-black/20 to-transparent rounded-2xl sm:rounded-3xl`}></div>
                <activeAdventure.icon className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 text-white relative z-10 drop-shadow-lg" />
              </div>
              <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-2 font-serif-sans px-4">
                {activeAdventure.title}
              </CardTitle>
              <CardDescription className="text-gray-600 text-sm sm:text-base lg:text-lg font-seasons px-4">
                {activeAdventure.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center px-4 sm:px-6">
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-seasons mb-6">
                {activeAdventure.fullDescription.substring(0, 200)}...
              </p>
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={() => setSelectedAdventure(activeAdventure.id)}
                  variant="outline"
                  className="border-orange-300 text-orange-600 hover:bg-orange-50 font-seasons"
                >
                  Read More Details
                </Button>
                <Button
                  onClick={() => {
                    setSelectedAdventure(activeAdventure.id);
                    setTimeout(handleBookAdventure, 100);
                  }}
                  className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-seasons"
                >
                  Book This Adventure
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Adventure Details Modal */}
      <Dialog open={!!selectedAdventure} onOpenChange={() => setSelectedAdventure(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              {selectedAdventureDetails && (
                <>
                  <selectedAdventureDetails.icon className="h-6 w-6 text-orange-500" />
                  {selectedAdventureDetails.title}
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          
          {selectedAdventureDetails && (
            <div className="space-y-6">
              <p className="text-gray-600 leading-relaxed">
                {selectedAdventureDetails.fullDescription}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-1">Duration</h4>
                  <p className="text-gray-600">{selectedAdventureDetails.duration}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-1">Difficulty</h4>
                  <p className="text-gray-600">{selectedAdventureDetails.difficulty}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-1">Includes</h4>
                  <p className="text-gray-600">{selectedAdventureDetails.includes}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Highlights</h4>
                <ul className="space-y-2">
                  {selectedAdventureDetails.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-center gap-2 text-gray-600">
                      <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></div>
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  onClick={() => setSelectedAdventure(null)}
                  variant="outline"
                  className="flex-1"
                >
                  Close
                </Button>
                <Button
                  onClick={handleBookAdventure}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
                >
                  Book This Adventure
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default AdventureSection;
