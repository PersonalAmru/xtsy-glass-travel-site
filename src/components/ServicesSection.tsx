import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BedSingle, Gem, PiggyBank } from "lucide-react";

type ServiceCard = {
  icon: React.ReactNode;
  title: string;
  badge: string;
  highlights: string[];
};

const ServicesSection = () => {
  const services: ServiceCard[] = [
    {
      // XTSY Travellers Hostel
      icon: <BedSingle className="h-5 w-5" />,
      title: "XTSY Travellers Hostel",
      badge: "Preferred",
      highlights: [
        "FREE WIFI [WFH MODE]",
        "FREE PARKING",
        "SHARED LOUNGE",
        "GAMES ROOM",
        "LAUNDRY [50% off]",
        "24/7 travellers MRP store",
        "24/7 SECURITY",
        "TOUR ASSISTANCE",
        "GROUP BOOKING [50+ GUESTS]",
        "BONFIRE & BBQ [PAID]",
        "24/7 SUPPORT",
        "FLEXIBLE CHECK-IN 24/7",
      ],
    },
    {
      // XTSY Luxury
      icon: <Gem className="h-5 w-5" />,
      title: "XTSY Luxury",
      badge: "Premium",
      highlights: [
        "EVERYTHING IS INCLUDED WITH PREMIUM SERVICE",
        "ONE DAY SHILLONG TOUR INCLUDED - FOR FREE BY XTSY",
        "Your dream Instagram photo spot ✨",
      ],
    },
    {
      // XTSY Economy
      icon: <PiggyBank className="h-5 w-5" />,
      title: "XTSY Economy",
      badge: "Ultra-Budget",
      highlights: [
        "FREE WIFI",
        "24/7 SECURITY",
        "Clean & comfort",
        "24/7 travellers MRP store",
        "PAID PARKING [BASED ON AVL.]",
        "LAUNDRY - [PAID]",
        "BOOKING [MAX 8 PER GROUP]",
        "11AM – 9PM SUPPORT",
        "12PM – 9PM CHECK-IN",
        "Room upgrade available",
      ],
    },
  ];

  return (
    <section className="pt-12 md:pt-16 lg:pt-20 pb-12 md:pb-16 lg:pb-20 safe-area-padding bg-gradient-to-br from-purple-900/20 via-pink-900/10 to-orange-900/20 relative overflow-hidden -mt-1">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-100/20 via-pink-100/10 to-orange-100/20" />
      <div className="absolute inset-0 backdrop-blur-3xl" />
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-pink-400/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-300/10 rounded-full blur-3xl" />

      <div className="responsive-container relative z-10 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="text-center mb-12 sm:mb-16">
          <div className="glass-card inline-block p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-purple-600 mb-1 font-playfair">
              Amenities &amp; Services
            </h2>
          </div>
        </div>

        {/* 3-up equal grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((s) => (
            <Card
              key={s.title}
              className="glass-card bg-white/10 backdrop-blur-md border border-white/20 hover:border-white/30 hover:bg-white/15 hover:shadow-xl transition-all duration-500 flex flex-col group"
            >
              <CardHeader className="p-5 pb-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-purple-600 group-hover:text-pink-600 transition-colors duration-300">
                    {s.icon}
                  </div>
                  <Badge
                    variant="outline"
                    className="text-xs border-purple-300/50 text-purple-700 bg-white/20 backdrop-blur-sm px-2 py-1 font-medium"
                  >
                    {s.badge}
                  </Badge>
                </div>
                <CardTitle className="font-bold text-gray-900 group-hover:text-purple-900 transition-colors duration-300 text-base sm:text-lg">
                  {s.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="px-5 pb-5 pt-0">
                <ul className="text-gray-800/90 text-sm sm:text-[0.95rem] leading-relaxed space-y-1.5">
                  {s.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-violet-500" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
