
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mountain, Waves, TreePine, Camera, Clock, Users, Star } from "lucide-react";

const AdventureSection = () => {
  const adventures = [
    {
      id: "trekking",
      icon: Mountain,
      title: "Trekking Expeditions",
      description: "Conquer Meghalaya's majestic peaks and trails",
      details: "Embark on thrilling trekking adventures through Meghalaya's pristine wilderness. From the challenging David Scott Trail to the scenic Living Root Bridges trek, experience the raw beauty of the Northeast. Our expert guides ensure safe and memorable journeys through cloud-kissed mountains and ancient forests.",
      gradient: "from-green-500 to-emerald-600",
      duration: "2-7 days",
      difficulty: "Medium to Hard",
      groupSize: "4-12 people"
    },
    {
      id: "water",
      icon: Waves,
      title: "Water Adventures",
      description: "Dive into crystal-clear rivers and waterfalls",
      details: "Experience the thrill of Meghalaya's pristine waters with our curated water adventures. From kayaking in the crystal-clear Umngot River to rappelling down majestic waterfalls, discover the aquatic wonders of the region. Perfect for adrenaline seekers and nature lovers alike.",
      gradient: "from-blue-500 to-cyan-600",
      duration: "1-3 days",
      difficulty: "Easy to Medium",
      groupSize: "2-10 people"
    },
    {
      id: "nature",
      icon: TreePine,
      title: "Nature & Wildlife",
      description: "Explore diverse ecosystems and rare wildlife",
      details: "Immerse yourself in Meghalaya's rich biodiversity with our nature and wildlife tours. Visit the sacred forests of Mawphlang, spot exotic birds in Balphakram National Park, and discover unique flora and fauna. Led by naturalist guides who share deep knowledge of the region's ecology.",
      gradient: "from-emerald-500 to-teal-600",
      duration: "1-4 days",
      difficulty: "Easy",
      groupSize: "2-15 people"
    },
    {
      id: "photography",
      icon: Camera,
      title: "Photography Tours",
      description: "Capture the beauty of Meghalaya's landscapes",
      details: "Perfect for photography enthusiasts, our tours are designed to capture Meghalaya's most photogenic locations. From golden sunrises to misty valleys, cascading waterfalls to traditional villages, we'll guide you to the best spots for that perfect shot. Equipment and technical guidance available.",
      gradient: "from-purple-500 to-pink-600",
      duration: "2-5 days",
      difficulty: "Easy to Medium",
      groupSize: "3-8 people"
    }
  ];

  return (
    <section id="adventures" className="py-16 sm:py-20 px-3 sm:px-4 bg-gradient-to-br from-slate-100 via-white to-slate-100 relative overflow-hidden">
      {/* Background animations */}
      <div className="absolute inset-0">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-r from-orange-400/10 to-red-400/10 rounded-full blur-xl animate-pulse"
            style={{
              left: `${15 + i * 18}%`,
              top: `${10 + i * 18}%`,
              animationDelay: `${i * 1.2}s`,
              animationDuration: `${3.5 + i * 0.3}s`
            }}
          />
        ))}
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4 font-serif-sans leading-tight" style={{ lineHeight: '1.2' }}>
            🏔️ Adventure Experiences
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto font-seasons px-4 leading-relaxed">
            Discover the breathtaking beauty of Meghalaya through our carefully crafted adventure experiences
          </p>
        </div>

        {/* All Adventure Cards in Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {adventures.map((adventure) => (
            <Card key={adventure.id} className="bg-white border-2 border-gray-200 hover:border-orange-300 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
              <CardHeader className="text-center pb-4">
                <div className={`mx-auto w-20 h-20 bg-gradient-to-r ${adventure.gradient} rounded-2xl flex items-center justify-center mb-4 shadow-xl relative transform hover:rotate-6 transition-transform duration-300`}>
                  <div className={`absolute inset-0 bg-gradient-to-r ${adventure.gradient} rounded-2xl blur-lg opacity-60 scale-110`}></div>
                  <adventure.icon className="h-10 w-10 text-white relative z-10 drop-shadow-lg" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-800 mb-2 font-serif-sans leading-tight">
                  {adventure.title}
                </CardTitle>
                <CardDescription className="text-gray-600 text-sm font-seasons">
                  {adventure.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4 text-orange-500" />
                    <span className="font-seasons">{adventure.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Star className="h-4 w-4 text-orange-500" />
                    <span className="font-seasons">{adventure.difficulty}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="h-4 w-4 text-orange-500" />
                    <span className="font-seasons">{adventure.groupSize}</span>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm leading-relaxed font-seasons">
                  {adventure.details.substring(0, 120)}...
                </p>
                
                <div className="space-y-2 pt-2">
                  <Button 
                    variant="outline"
                    className="w-full border-orange-300 text-orange-600 hover:bg-orange-50 font-seasons"
                  >
                    View Details 👁️
                  </Button>
                  <Button 
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-seasons"
                  >
                    Book This Adventure 🎯
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdventureSection;
