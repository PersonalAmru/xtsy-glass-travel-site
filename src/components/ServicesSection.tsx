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

// ---- Card-specific backgrounds (no images; Tailwind-only) -------------------
function cardBg(tone: ServiceCard["tone"]) {
  switch (tone) {
    case "hostel":
      // Bold & elegant deep purples with subtle radial highlight
      return (
        "relative overflow-hidden " +
        "bg-gradient-to-br from-violet-900/70 via-purple-800/70 to-indigo-900/70 " +
        "border-white/15 " +
        "before:absolute before:inset-0 before:bg-[radial-gradient(75%_50%_at_20%_0%,rgba(255,255,255,0.08),transparent)] before:pointer-events-none"
      );
    case "luxury":
      // Stunning: vivid gradient, soft conic shimmer, gentle glow
      return (
        "relative overflow-hidden " +
        "bg-gradient-to-br from-fuchsia-500/35 via-rose-500/30 to-amber-400/35 " +
        "border-white/30 " +
        "before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.28),_transparent_60%)] before:pointer-events-none " +
        "after:absolute after:-inset-28 after:bg-[conic-gradient(from_180deg,_rgba(255,255,255,0.18),_transparent_30%,_rgba(255,255,255,0.18))] after:blur-2xl after:animate-pulse after:pointer-events-none"
      );
    case "economy":
    default:
      // Average / neutral: soft gray gradient with a faint radial
      return (
        "relative overflow-hidden " +
        "bg-gradient-to-br from-zinc-200/80 via-zinc-100/80 to-zinc-200/80 " +
        "border-white/40 " +
        "before:absolute before:inset-0 before:bg-[radial-gradient(70%_50%_at_10%_0%,rgba(0,0,0,0.05),transparent)] before:pointer-events-none"
      );
  }
}

const Line: React.FC<EmojiItem> = ({ e, t }) => (
  <li className="flex items-start gap-2">
    <span className="leading-none select-none text-lg sm:text-xl">{e}</span>
    <span className="text-gray-900/90 dark:text-gray-100/90">{t}</span>
  </li>
);

const ServicesSection = () => {
  const services: ServiceCard[] = [
    {
      // XTSY Travellers Hostel — bold & elegant
      tone: "hostel",
      icon: <BedSingle className="h-5 w-5" />,
      title: "XTSY Travellers Hostel",
      badge: "Preferred",
      highlights: [
        { e: "📶", t: "FREE WIFI [WFH MODE]" },
        { e: "🅿️", t: "FREE PARKING" },
        { e: "🛋️", t: "SHARED LOUNGE" },
        { e: "🕹️", t: "GAMES ROOM" },
        { e: "🧺", t: "LAUNDRY [50% off]" },
        { e: "🛒", t: "24/7 travellers MRP store" },
        { e: "🛡️", t: "24/7 SECURITY" },
        { e: "🧭", t: "TOUR ASSISTANCE" },
        { e: "👥", t: "GROUP BOOKING [50+ GUESTS]" },
        { e: "🔥🍖", t: "BONFIRE & BBQ [PAID]" },
        { e: "📞", t: "24/7 SUPPORT" },
        { e: "🕛", t: "FLEXIBLE CHECK-IN 24/7" },
      ],
    },
    {
      // XTSY Luxury — stunning card
      tone: "luxury",
      icon: <Gem className="h-5 w-5" />,
      title: "XTSY Luxury",
      badge: "Premium",
      highlights: [
        { e: "🧾✨", t: "EVERYTHING IS INCLUDED WITH PREMIUM SERVICE" },
        { e: "🔥🍖🚌", t: "ONE DAY SHILLONG TOUR + BBQ & BONFIRE INCLUDED" },
        { e: "📸", t: "Your dream Instagram photo spot" },
      ],
    },
    {
      // XTSY Economy — average/neutral card
      tone: "economy",
      icon: <PiggyBank className="h-5 w-5" />,
      title: "XTSY Economy",
      badge: "Ultra-Budget",
      highlights: [
        { e: "📶", t: "FREE WIFI" },
        { e: "🛡️", t: "24/7 SECURITY" },
        { e: "🧼", t: "Clean & comfort" },
        { e: "🛒", t: "24/7 travellers MRP store" },
        { e: "🅿️", t: "PAID PARKING [BASED ON AVL.]" },
        { e: "🧺", t: "LAUNDRY - [PAID]" },
        { e: "👥", t: "BOOKING [MAX 8 PER GROUP]" },
        { e: "🕐", t: "11AM – 9PM SUPPORT" },
        { e: "🕘", t: "12PM – 9PM CHECK-IN" },
        { e: "⬆️", t: "Room upgrade available" },
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
                  <div
                    className={
                      s.tone === "luxury"
                        ? "text-white/90"
                        : s.tone === "hostel"
                        ? "text-violet-100"
                        : "text-purple-600 group-hover:text-pink-600 transition-colors duration-300"
                    }
                  >
                    {s.icon}
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      s.tone === "luxury"
                        ? "text-xs border-white/70 text-white/90 bg-white/20 backdrop-blur-sm px-2 py-1 font-medium"
                        : s.tone === "hostel"
                        ? "text-xs border-violet-300/60 text-violet-100 bg-violet-950/30 backdrop-blur-sm px-2 py-1 font-medium"
                        : "text-xs border-zinc-400/60 text-zinc-700 bg-white/40 backdrop-blur-sm px-2 py-1 font-medium"
                    }
                  >
                    {s.badge}
                  </Badge>
                </div>

                <CardTitle
                  className={
                    s.tone === "luxury"
                      ? "font-bold text-white drop-shadow-sm text-base sm:text-lg"
                      : s.tone === "hostel"
                      ? "font-bold text-violet-50 drop-shadow-sm text-base sm:text-lg"
                      : "font-bold text-gray-900 text-base sm:text-lg"
                  }
                >
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
