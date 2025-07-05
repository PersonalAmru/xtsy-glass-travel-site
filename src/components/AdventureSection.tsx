
import { useState } from "react";
import { Mountain, Waves, Camera, TreePine, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const AdventureSection = () => {
  const [activeTab, setActiveTab] = useState("trekking");
  const [selectedAdventure, setSelectedAdventure] = useState<string | null>(null);

  const adventures = [
    {
      id: "trekking",
      icon: Mountain,
      title: "Trekking Expeditions",
      description: "Explore scenic trails and mountain peaks",
      details: "Join us for unforgettable trekking experiences across Meghalaya's stunning landscapes. From easy nature walks to challenging mountain treks, we offer guided expeditions suitable for all fitness levels. Discover hidden waterfalls, panoramic viewpoints, and pristine forests while experiencing the natural beauty of the Northeast.",
      gradient: "from-green-500 to-emerald-500",
      itinerary: [
        "Day 1: Base camp setup and orientation",
        "Day 2: Trail exploration and waterfall visit",
        "Day 3: Summit attempt and panoramic views",
        "Day 4: Return journey and celebration"
      ]
    },
    {
      id: "water-adventures",
      icon: Waves,
      title: "Water Adventures",
      description: "River rafting, kayaking, and water sports",
      details: "Experience the thrill of Meghalaya's pristine rivers and water bodies. Our water adventure packages include river rafting, kayaking, cliff jumping, and swimming in crystal-clear natural pools. Perfect for adrenaline seekers and those looking to cool off in nature's playground.",
      gradient: "from-blue-500 to-cyan-500",
      itinerary: [
        "Day 1: Water safety briefing and basic training",
        "Day 2: River rafting expedition",
        "Day 3: Kayaking and cliff jumping",
        "Day 4: Relaxation at natural pools"
      ]
    },
    {
      id: "nature-wildlife",
      icon: TreePine,
      title: "Nature & Wildlife",
      description: "Bird watching, forest walks, and wildlife spotting",
      details: "Immerse yourself in Meghalaya's rich biodiversity. Our nature and wildlife tours take you through dense forests, sacred groves, and wildlife sanctuaries. Spot rare birds, exotic plants, and maybe even some elusive wildlife while learning about local conservation efforts.",
      gradient: "from-amber-500 to-orange-500",
      itinerary: [
        "Day 1: Forest orientation and bird watching",
        "Day 2: Sacred grove exploration",
        "Day 3: Wildlife sanctuary visit",
        "Day 4: Photography session and nature appreciation"
      ]
    },
    {
      id: "photography",
      icon: Camera,
      title: "Photography Tours",
      description: "Capture the beauty of Meghalaya's landscapes",
      details: "Perfect for photography enthusiasts, our tours are designed to capture Meghalaya's most photogenic locations. From golden sunrises to misty valleys, cascading waterfalls to traditional villages, we'll guide you to the best spots for that perfect shot.",
      gradient: "from-purple-500 to-pink-500",
      itinerary: [
        "Day 1: Sunrise photography at viewpoints",
        "Day 2: Waterfall and landscape photography",
        "Day 3: Cultural and village photography",
        "Day 4: Portfolio review and editing session"
      ]
    }
  ];

  const activeAdventure = adventures.find(adventure => adventure.id === activeTab);
  const popupAdventure = adventures.find(adventure => adventure.id === selectedAdventure);

  const handleBookAdventure = () => {
    window.open('https://wa.me/918837317070', '_blank');
  };

  return (
    <section id="adventure" className="py-16 sm:py-20 px-3 sm:px-4 bg-gray-50 relative overflow-hidden">
      {/* Background animations */}
      <div className="absolute inset-0">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-28 h-28 bg-gradient-to-r from-green-400/10 to-blue-400/10 rounded-full blur-xl animate-pulse"
            style={{
              left: `${5 + i * 18}%`,
              bottom: `${10 + i * 15}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${4 + i * 0.3}s`
            }}
          />
        ))}
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent font-serif-sans px-4">
            Curated Meghalaya Itineraries
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto font-seasons px-4">
            Discover the breathtaking beauty of Meghalaya with our expertly crafted adventure packages
          </p>
        </div>

        {/* Horizontal Tab Buttons - Mobile Optimized */}
        <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-0 mb-12 sm:mb-16 px-4">
          {adventures.map((adventure, index) => (
            <Button
              key={adventure.id}
              variant={activeTab === adventure.id ? "default" : "outline"}
              onClick={() => setActiveTab(adventure.id)}
              className={`px-3 sm:px-4 md:px-6 py-3 sm:py-4 font-bold transition-all duration-300 text-xs sm:text-sm lg:text-base flex-1 sm:flex-none ${
                index === 0 ? 'sm:rounded-r-none' : 
                index === adventures.length - 1 ? 'sm:rounded-l-none' : 
                'sm:rounded-none'
              } ${
                activeTab === adventure.id
                  ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-xl border-orange-400"
                  : "border-orange-300/60 text-gray-800 bg-white hover:bg-orange-50 hover:border-orange-400/80 hover:text-orange-600"
              } font-seasons border-2`}
            >
              <adventure.icon className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 mr-1 sm:mr-2" />
              <span className="whitespace-nowrap">{adventure.title}</span>
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
            <CardContent className="text-center px-4 sm:px-6 space-y-4">
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-seasons">
                {activeAdventure.details}
              </p>
              <div className="flex gap-4">
                <Button
                  onClick={() => setSelectedAdventure(activeAdventure.id)}
                  variant="outline"
                  className="flex-1 border-orange-300 text-orange-600 hover:bg-orange-50"
                >
                  View Details
                </Button>
                <Button
                  onClick={handleBookAdventure}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
                >
                  Book This Adventure
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Adventure Details Popup */}
      {popupAdventure && (
        <Dialog open={!!selectedAdventure} onOpenChange={() => setSelectedAdventure(null)}>
          <DialogContent className="max-w-2xl bg-white border border-gray-200 text-gray-900 shadow-lg">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center text-gray-900 flex items-center justify-center gap-2">
                <popupAdventure.icon className="h-6 w-6 text-orange-500" />
                {popupAdventure.title}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className={`mx-auto w-24 h-24 bg-gradient-to-r ${popupAdventure.gradient} rounded-2xl flex items-center justify-center shadow-xl`}>
                <popupAdventure.icon className="h-12 w-12 text-white" />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{popupAdventure.details}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Sample Itinerary</h3>
                <div className="space-y-2">
                  {popupAdventure.itinerary.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-600 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-4 pt-4">
                <Button
                  onClick={() => setSelectedAdventure(null)}
                  variant="outline"
                  className="flex-1 border-gray-300 text-gray-600 hover:bg-gray-50"
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
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
};

export default AdventureSection;
