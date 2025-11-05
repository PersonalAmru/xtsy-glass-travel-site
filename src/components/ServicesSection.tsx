import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BedSingle, Gem, PiggyBank } from "lucide-react";
import React from "react";

type EmojiItem = { e: string; t: string };

type ServiceCard = {
  icon: React.ReactNode;
  title: string;
  badge: string;
  tone: "hostel" | "luxury" | "economy";
  highlights: EmojiItem[];
};

// ---- Apple-style glassmorphism backgrounds -------------------
function cardBg(tone: ServiceCard["tone"]) {
  const baseGlass = "relative overflow-hidden backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl ";
  
  switch (tone) {
    case "luxury":
      return (
        baseGlass +
        "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:via-white/5 before:to-transparent before:pointer-events-none " +
        "after:absolute after:inset-0 after:bg-gradient-to-t after:from-purple-500/10 after:via-transparent after:to-pink-500/10 after:pointer-events-none " +
        "hover:bg-white/15 hover:border-white/30 hover:shadow-3xl transition-all duration-500"
      );
    case "hostel":
      return (
        baseGlass +
        "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/15 before:via-white/5 before:to-transparent before:pointer-events-none " +
        "after:absolute after:inset-0 after:bg-gradient-to-t after:from-blue-500/8 after:via-transparent after:to-indigo-500/8 after:pointer-events-none " +
        "hover:bg-white/15 hover:border-white/30 hover:shadow-3xl transition-all duration-500"
      );
    case "economy":
    default:
      return (
        baseGlass +
        "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/12 before:via-white/4 before:to-transparent before:pointer-events-none " +
        "after:absolute after:inset-0 after:bg-gradient-to-t after:from-gray-500/6 after:via-transparent after:to-slate-500/6 after:pointer-events-none " +
        "hover:bg-white/15 hover:border-white/30 hover:shadow-3xl transition-all duration-500"
      );
  }
}

const Line: React.FC<EmojiItem> = ({ e, t }) => (
  <li className="flex items-start gap-2">
    <span className="leading-none select-none text-lg sm:text-xl">{e}</span>
    <span className="text-gray-900">{t}</span>
  </li>
);

const ServicesSection = () => {
const services: ServiceCard[] = [
    {
      // XTSY Luxury — premium everything included
      tone: "luxury",
      icon: <Gem className="h-5 w-5" />,
      title: "XTSY Luxury",
      badge: "Premium",
      highlights: [
        { e: "⚡", t: "Premium Ports & Fast Charging" },
        { e: "📶", t: "High Speed WiFi" },
        { e: "📸", t: "Glass Dome Photo + Extended Access + Private Photographer" },
        { e: "🍽️", t: "Gourmet Breakfast & Wellness Options" },
        { e: "🔌", t: "Every Bedside USB-C/Lightning Fast Chargers" },
        { e: "🧴", t: "Premium Toiletries & Wellness Kit" },
        { e: "🅿️", t: "Reserved + Valet Service" },
        { e: "🧭", t: "24/7 Concierge & Guided Itineraries" },
        { e: "🥾", t: "Guided Wellness Hikes & Private Trails" },
        { e: "🍖", t: "Curated Chef BBQ Experience Included" },
        { e: "🛋️", t: "Luxury Ensuite Lounge with Ultra 4k Netflix & Chill" },
        { e: "🎮", t: "XTSY Games Zone" },
        { e: "🏔️", t: "Candle Light Dinner - On request" },
        { e: "🔥", t: "Themed Bonfire Nights with Live Music - On request" },
        { e: "🎤", t: "Premium Karaoke Lounge with Acoustic Setup - On request" },
      ],
    },
    {
      // XTSY Travellers Hostel — comprehensive included features
      tone: "hostel",
      icon: <BedSingle className="h-5 w-5" />,
      title: "XTSY Travellers Hostel",
      badge: "Preferred",
      highlights: [
        { e: "⚡", t: "Common Charging Point (Included)" },
        { e: "📶", t: "High Speed Internet (WFH MODE)" },
        { e: "📸", t: "Glass Dome Photo Shoot (Free - On Request)" },
        { e: "🔌", t: "Personal Charging Point" },
        { e: "💡", t: "Personal Study Light" },
        { e: "🧴", t: "Toiletries Included" },
        { e: "🔐", t: "Personal Lockers" },
        { e: "🅿️", t: "Free Parking (Reserved)" },
        { e: "🧭", t: "24/7 Travel Assistance (Included)" },
        { e: "🥾", t: "Nearby Hiking/Trails (Free - On Request)" },
        { e: "🛋️", t: "Common Room Access (Included)" },
        { e: "🎮", t: "Games Room Access (Included)" },
        { e: "🏔️", t: "Terrace Access (Included)" },
        { e: "🔥", t: "Bonfire Nights (Included)" },
        { e: "🎤", t: "Karaoke space (Included)" },
        { e: "🍖", t: "BBQ Experience (Paid)" },
        { e: "🛒", t: "Convenience Store (10% Off)" },
      ],
    },
    {
      // XTSY Economy — basic features with limitations
      tone: "economy",
      icon: <PiggyBank className="h-5 w-5" />,
      title: "XTSY Economy Dorms",
      badge: "Ultra-Budget",
      highlights: [
        { e: "⚡", t: "Common Charging Point (Included)" },
        { e: "📶", t: "High Speed Internet (Included)" },
        { e: "📸", t: "Glass Dome Photo ₹1000/10 mins" },
        { e: "🚫", t: "No Personal Charging Point" },
        { e: "🚫", t: "No Personal Study Light" },
        { e: "🚫", t: "No Toiletries" },
        { e: "🔐", t: "Personal Lockers (Paid)" },
        { e: "🅿️", t: "Free Parking (Subject to availability)" },
        { e: "🧭", t: "Travel Assistance (Hostel Bookings Only)" },
        { e: "🚫", t: "No Nearby Hiking/Trails" },
        { e: "🚫", t: "No Common Room Access" },
        { e: "🚫", t: "No Games Room Access" },
        { e: "🚫", t: "No Terrace Access" },
        { e: "🚫", t: "No Bonfire Nights" },
        { e: "🚫", t: "No Karaoke Space" },
        { e: "🚫", t: "No BBQ Experience" },
        { e: "🛒", t: "Convenience Store (MRP)" },
      ],
    },
  ];

  return (
    <section className="pt-12 md:pt-16 lg:pt-20 pb-12 md:pb-16 lg:pb-20 safe-area-padding bg-gradient-to-br from-purple-900/20 via-pink-900/10 to-orange-900/20 relative overflow-hidden -mt-1">
      {/* page ambience */}
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
              className={
                "glass-card border hover:shadow-2xl hover:brightness-[1.03] transition-all duration-500 flex flex-col group " +
                cardBg(s.tone)
              }
            >
              <CardHeader className="p-5 pb-3 relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-gray-900">
                    {s.icon}
                  </div>
                  <Badge
                    variant="outline"
                    className="text-xs border-gray-400/60 text-gray-900 bg-white/40 backdrop-blur-sm px-2 py-1 font-medium"
                  >
                    {s.badge}
                  </Badge>
                </div>

                <CardTitle className="font-bold text-gray-900 text-base sm:text-lg">
                  {s.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="px-5 pb-6 pt-0 relative z-10">
                <ul className="space-y-1.5 text-sm sm:text-[0.95rem]">
                  {s.highlights.map((item) => (
                    <Line key={item.t} {...item} />
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
