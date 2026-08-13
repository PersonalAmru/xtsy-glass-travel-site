import React from "react";
import { motion } from "framer-motion";
import { Award, TrendingUp, MapPin, Star, Users, Globe } from "lucide-react";
import neitaAwardCertificate from "@/assets/neita-award-certificate.jpeg";

const AboutXTSYSection: React.FC = () => {
  const stats = [
    { icon: Star, value: "9.4", label: "Rating on Booking.com", color: "text-yellow-500" },
    { icon: Users, value: "15,000+", label: "Happy Travellers", color: "text-blue-500" },
    { icon: Globe, value: "50+", label: "Tour Destinations", color: "text-green-500" },
    { icon: Award, value: "NEITA 2025", label: "Award Nominated", color: "text-amber-500" },
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-2 rounded-full text-sm font-bold mb-6">
              <TrendingUp className="w-4 h-4" />
              India's Fastest-Growing Travel & Hospitality Brand
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              About <span className="text-primary">XTSY</span> Travellers Hostel & Luxury
            </h2>

            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              <strong className="text-foreground">XTSY is where innovation meets exploration.</strong> Based in Shillong and powered by{" "}
              <strong className="text-foreground">XTSY ONE</strong>, we are redefining how India travels — 
              with experiences that feel personal, architectural, immersive, and unforgettable.
            </p>

            <p className="text-muted-foreground mb-8 leading-relaxed">
              From India's first <strong className="text-foreground">270° panoramic glass suite</strong> to Northeast India's 
              biggest and highest-rated hostel, we combine luxury, adventure, and community in ways 
              that transform ordinary trips into extraordinary memories.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center p-4 rounded-xl bg-card/50 backdrop-blur-xs border border-border/50 hover:border-primary/30 transition-colors"
                >
                  <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
                  <p className="text-xl md:text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-5 h-5 text-primary" />
              <span>Shillong, Meghalaya - The Scotland of the East</span>
            </div>
          </motion.div>

          {/* NEITA Award Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-amber-100/50">
              <img
                src={neitaAwardCertificate}
                alt="XTSY NEITA 2025 Award Certificate - Best Budget-Friendly Accommodation and Service Excellence Award"
                className="w-full h-auto"
                loading="lazy"
              />
              {/* Overlay Badge */}
              <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg">
                <Award className="w-4 h-4" />
                NEITA 2025 Nominated
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-4 italic">
              Northeast India Tourism Awards 2025 - Official Nomination Certificate
            </p>

            {/* Decorative Elements */}
            <div className="absolute -z-10 -top-4 -right-4 w-full h-full bg-gradient-to-br from-primary/20 to-amber-500/20 rounded-2xl blur-xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutXTSYSection;
