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

// Simplified glassmorphism with GPU optimization and mobile fallbacks
function cardBg(tone: ServiceCard["tone"]) {
  // Base glass classes with GPU optimization
  const baseClasses = "relative overflow-hidden glass-card-enhanced glass-transition ";
  
  // Tone-specific gradient overlays (simplified - single overlay instead of before/after)
  const toneOverlays: Record<ServiceCard["tone"], string> = {
    luxury: "ring-1 ring-purple-500/20",
    hostel: "ring-1 ring-blue-500/20",
    economy: "ring-1 ring-gray-500/20"
  };
  
  return baseClasses + toneOverlays[tone];
}

// Get gradient overlay for card (rendered as single div instead of pseudo-elements)
function getGradientOverlay(tone: ServiceCard["tone"]) {
  switch (tone) {
    case "luxury":
      return "bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10";
    case "hostel":
      return "bg-gradient-to-br from-blue-500/8 via-transparent to-indigo-500/8";
    case "economy":
    default:
      return "bg-gradient-to-br from-gray-500/6 via-transparent to-slate-500/6";
  }
}

const Line: React.FC<EmojiItem> = ({ e, t }) => (
  <li className="flex items-start gap-2">
    <span className="leading-none select-none text-lg sm:text-xl">{e}</span>
    <span className="text-foreground">{t}</span>
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
        { e: "🧺", t: "Laundry Service (Free)" },
        { e: "🛒", t: "Convenience Store (Free)" },
        { e: "🅿️", t: "Reserved + Valet Service" },
        { e: "🧭", t: "24/7 Concierge & Guided Itineraries" },
        { e: "🥾", t: "Guided Wellness Hikes & Private Trails" },
        { e: "🍖", t: "Curated Chef BBQ Experience Included" },
        { e: "🛋️", t: "Luxury Ensuite Lounge with Ultra 4k Netflix & Chill" },
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
        { e: "🧺", t: "Laundry Service (At Best Rates)" },
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
        { e: "🚫", t: "No Laundry Service" },
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
    <section className="pt-12 md:pt-16 lg:pt-20 pb-12 md:pb-16 lg:pb-20 safe-area-padding bg-gradient-to-br from-purple-200/60 via-pink-100/50 to-orange-100/60 relative overflow-hidden -mt-1">
      {/* Page ambience - GPU optimized, disabled on mobile */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/80 via-pink-50/70 to-orange-50/80" />
      <div className="absolute inset-0 bg-white/30 hidden md:block" style={{ backdropFilter: 'blur(64px)', WebkitBackdropFilter: 'blur(64px)' }} />
      {/* Decorative orbs - hidden on mobile for performance */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-300/40 rounded-full blur-3xl hidden md:block" />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-pink-300/40 rounded-full blur-3xl hidden md:block" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl hidden lg:block" />

      <div className="responsive-container relative z-10 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="text-center mb-12 sm:mb-16">
          <div className="glass-card-enhanced inline-block p-6 rounded-2xl shadow-2xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-purple-600 dark:text-purple-400 mb-1 font-playfair">
              Amenities &amp; Services
            </h2>
            <p className="text-lg sm:text-xl text-foreground font-medium mt-2">
              🐱 🐶 🦜 Pet Friendly
            </p>
          </div>
        </div>

        {/* 3-up equal grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((s) => (
            <Card
              key={s.title}
              className={
                "flex flex-col group " + cardBg(s.tone)
              }
            >
              {/* Simplified gradient overlay - single div instead of pseudo-elements */}
              <div className={`absolute inset-0 ${getGradientOverlay(s.tone)} pointer-events-none rounded-lg`} />
              
              <CardHeader className="p-5 pb-3 relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-foreground">
                    {s.icon}
                  </div>
                  <Badge
                    variant="outline"
                    className="text-xs border-border text-foreground bg-background/40 px-2 py-1 font-medium"
                  >
                    {s.badge}
                  </Badge>
                </div>

                <CardTitle className="font-bold text-foreground text-base sm:text-lg">
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
