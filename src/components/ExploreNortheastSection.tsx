import { motion } from "framer-motion";
import { MapPin, Compass, Mountain, Camera, Shield, Plane } from "lucide-react";
 
 const highlights = [
   {
     icon: Mountain,
     title: "Living Root Bridges",
    description: "Trek to UNESCO-recognized natural wonders in Cherrapunji"
   },
   {
     icon: Camera,
     title: "Cleanest Village in Asia",
    description: "Experience Mawlynnong's pristine beauty & Khasi culture"
   },
   {
     icon: Compass,
     title: "Wettest Place on Earth",
    description: "Witness legendary waterfalls in Cherrapunji"
   },
   {
     icon: MapPin,
     title: "Scotland of the East",
    description: "Explore Shillong's rolling hills & pine forests"
   }
 ];
 
 const ExploreNortheastSection = () => {
   return (
    <section className="py-8 md:py-12 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Compact Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-full text-xs font-semibold mb-3 border border-emerald-500/20">
            <Plane className="w-3 h-3" />
            For International Travelers
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Explore <span className="text-emerald-600 dark:text-emerald-400">Northeast India</span> with XTSY
          </h2>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">
            Meghalaya: The Abode of Clouds — pristine landscapes, living root bridges & warm Khasi hospitality
          </p>
        </motion.div>
 
        {/* Compact Highlights Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
           {highlights.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-card/50 backdrop-blur-xs border border-border/50 rounded-xl p-4 hover:bg-card/80 hover:border-emerald-500/30 transition-all group"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500/20 transition-colors">
                  <item.icon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-foreground text-sm mb-1">{item.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </div>
            </motion.div>
           ))}
         </div>
 
        {/* Compact Travel Info Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          viewport={{ once: true }}
          className="bg-card/60 backdrop-blur-xs border border-border/50 rounded-xl p-4 max-w-2xl mx-auto"
        >
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-xs md:text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Shield className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Indian e-Visa accepted</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-border" />
            <div className="flex items-center gap-2 text-muted-foreground">
              <span>No special permits needed</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-border" />
            <div className="flex items-center gap-2 text-muted-foreground">
              <span>English widely spoken</span>
            </div>
           </div>
        </motion.div>
       </div>
     </section>
   );
 };
 
 export default ExploreNortheastSection;