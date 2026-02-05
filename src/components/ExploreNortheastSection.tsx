 import { Badge } from "@/components/ui/badge";
 import { Card, CardContent } from "@/components/ui/card";
 import { MapPin, Compass, Mountain, Camera, Users, Shield } from "lucide-react";
 
 const highlights = [
   {
     icon: Mountain,
     title: "Living Root Bridges",
     description: "Trek to the iconic double-decker living root bridges in Cherrapunji, a UNESCO World Heritage marvel."
   },
   {
     icon: Camera,
     title: "Cleanest Village in Asia",
     description: "Visit Mawlynnong, known for its pristine beauty and unique community-driven cleanliness."
   },
   {
     icon: Compass,
     title: "Wettest Place on Earth",
     description: "Experience Cherrapunji's legendary rainfall and breathtaking waterfalls year-round."
   },
   {
     icon: MapPin,
     title: "Scotland of the East",
     description: "Explore Shillong's rolling hills, pine forests, and vibrant Khasi culture."
   }
 ];
 
 const travelTips = [
   { icon: Shield, text: "Indian e-Visa accepted • No special permits for Meghalaya" },
   { icon: Users, text: "English widely spoken • Safe for solo travelers" },
 ];
 
 const ExploreNortheastSection = () => {
   return (
     <section className="py-12 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 relative overflow-hidden">
       <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/30 via-transparent to-teal-100/30" />
       <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
       
       <div className="container mx-auto px-4 relative z-10">
         {/* Header */}
         <div className="text-center mb-10">
           <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm px-4 py-2 mb-4">
             🌏 Explore Northeast India with XTSY
           </Badge>
           <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 font-playfair">
             Meghalaya: The Abode of Clouds
           </h2>
           <p className="text-gray-600 max-w-2xl mx-auto">
             Discover India's hidden gem — pristine landscapes, living root bridges, and warm Khasi hospitality await international travelers.
           </p>
         </div>
 
         {/* Highlights Grid */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
           {highlights.map((item, index) => (
             <Card key={index} className="bg-white/80 backdrop-blur-sm border-white/50 hover:shadow-lg transition-shadow">
               <CardContent className="p-5 text-center">
                 <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                   <item.icon className="h-6 w-6 text-white" />
                 </div>
                 <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                 <p className="text-sm text-gray-600">{item.description}</p>
               </CardContent>
             </Card>
           ))}
         </div>
 
         {/* Travel Tips for Foreigners */}
         <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg max-w-3xl mx-auto">
           <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
             🛂 Travel Tips for International Visitors
           </h3>
           <div className="grid sm:grid-cols-2 gap-4">
             {travelTips.map((tip, index) => (
               <div key={index} className="flex items-center gap-3 text-gray-700">
                 <tip.icon className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                 <span className="text-sm">{tip.text}</span>
               </div>
             ))}
           </div>
           <p className="text-center text-sm text-gray-500 mt-4">
             XTSY is your gateway to authentic Northeast India experiences — from our Shillong hostel base, explore waterfalls, caves, and cultural wonders.
           </p>
         </div>
       </div>
     </section>
   );
 };
 
 export default ExploreNortheastSection;