import { memo } from "react";
import { Link } from "react-router-dom";
import { PartyPopper, Heart, Sparkles, Star, ArrowRight } from "lucide-react";

const cateringServices = [
  "Wedding Catering",
  "Destination Wedding Dining",
  "Event Catering",
  "Corporate Catering",
  "Private Parties",
  "Birthday Celebrations",
  "Group Dining",
  "Bulk Food Orders",
];

const weddingOfferings = [
  "Custom Wedding Menus",
  "Live BBQ Stations",
  "Multi-Cuisine Buffet",
  "Dessert Counters",
  "Mocktail Bars",
  "Outdoor Dining Setups",
];

const TabBistroCatering = memo(() => (
  <>
    <section id="catering">
      <div className="flex items-center gap-2 text-amber-400 mb-2">
        <PartyPopper className="w-5 h-5" />
        <span className="text-xs uppercase tracking-[0.15em] font-semibold">Events</span>
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold text-foreground font-playfair mb-2">Catering, Weddings & Events</h2>
      <p className="text-muted-foreground text-sm mb-8 max-w-2xl">
        Large-scale catering and dining services for weddings, celebrations, and corporate gatherings across Shillong and Meghalaya.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {cateringServices.map((s) => (
          <div key={s} className="flex items-center gap-2 p-3.5 rounded-xl bg-card border border-border">
            <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span className="text-sm text-foreground">{s}</span>
          </div>
        ))}
      </div>
      <Link
        to="/tab-bistro/catering"
        className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-600 text-black font-semibold text-sm transition-colors"
      >
        Catering & Bulk Orders — Get a Quote <ArrowRight className="w-4 h-4" />
      </Link>
    </section>

    <section>
      <div className="flex items-center gap-2 text-amber-400 mb-2">
        <Heart className="w-5 h-5" />
        <span className="text-xs uppercase tracking-[0.15em] font-semibold">Weddings</span>
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold text-foreground font-playfair mb-2">Wedding Dining by XTSY</h2>
      <p className="text-muted-foreground text-sm mb-8">Custom menus, live stations, and outdoor setups for unforgettable feasts.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {weddingOfferings.map((w) => (
          <div key={w} className="flex items-center gap-2 p-3.5 rounded-xl bg-card border border-border">
            <Star className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span className="text-sm text-foreground">{w}</span>
          </div>
        ))}
      </div>
    </section>
  </>
));

TabBistroCatering.displayName = "TabBistroCatering";
export default TabBistroCatering;
