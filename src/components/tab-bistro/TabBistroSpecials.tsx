import { memo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Star, Soup, Beef, Pizza, Fish, Salad, Drumstick, Globe2, Leaf, ShoppingBag, PartyPopper,
} from "lucide-react";

/**
 * XTSY Specials — multi-cuisine showcase with cuisine-based filter / tabbed
 * browsing so visitors can quickly find their preferred cuisine for dine-in,
 * food orders and catering. Built to own Shillong's thin food keyword space.
 */
interface Cuisine {
  title: string;
  desc: string;
  icon: React.ReactNode;
  tags: string[]; // filter groups
}

const cuisines: Cuisine[] = [
  {
    title: "North Indian & Tandoor",
    desc: "Paneer Butter Masala, Kadhai Chicken, Dal Makhani, Murgh Malai Tikka and clay-oven naans — the best North Indian restaurant flavours in Shillong.",
    icon: <Drumstick className="w-5 h-5" />,
    tags: ["indian", "veg"],
  },
  {
    title: "Indo-Chinese",
    desc: "Chilli Chicken, Hakka noodles, Schezwan fried rice, Manchurian and Kung Pao — Shillong's go-to Chinese food, wok-tossed to order.",
    icon: <Soup className="w-5 h-5" />,
    tags: ["chinese", "veg"],
  },
  {
    title: "Thai & Pan-Asian",
    desc: "Thai basil chicken, Thai curries and Bangkok fusion plates — rare pan-Asian dining you won't easily find elsewhere in Shillong.",
    icon: <Globe2 className="w-5 h-5" />,
    tags: ["thai", "veg"],
  },
  {
    title: "Continental & Grills",
    desc: "Fish & Chips, Chicken Stroganoff, Schnitzel, grilled fish and steaks with sauces — proper continental food in the pines.",
    icon: <Beef className="w-5 h-5" />,
    tags: ["continental"],
  },
  {
    title: "Italian — Pizza & Pasta",
    desc: "Wood-style pizzas, Alfredo and Arrabiata pastas, lasagne-rich flavours — the cosy Italian corner of TAB Bistro.",
    icon: <Pizza className="w-5 h-5" />,
    tags: ["italian", "veg"],
  },
  {
    title: "Seafood & Sizzlers",
    desc: "Butter-garlic prawns, chilli fish, grilled prawns and live sizzlers served on cast iron — a seafood menu that's hard to find in the hills.",
    icon: <Fish className="w-5 h-5" />,
    tags: ["seafood"],
  },
  {
    title: "Northeast & Khasi Flavours",
    desc: "Smoked, fiery local-style plates and regional specials that celebrate Northeast India's cuisine alongside global favourites.",
    icon: <Star className="w-5 h-5" />,
    tags: ["northeast"],
  },
  {
    title: "Salads, Café & Breakfast",
    desc: "Caesar and loaded salads, all-day café bites, breakfast spreads, shakes and mocktails — light, fresh and made for slow mornings.",
    icon: <Salad className="w-5 h-5" />,
    tags: ["cafe", "veg"],
  },
];

const filters: { key: string; label: string; icon?: React.ReactNode }[] = [
  { key: "all", label: "All Cuisines" },
  { key: "veg", label: "Veg-Friendly", icon: <Leaf className="w-3.5 h-3.5" /> },
  { key: "indian", label: "North Indian" },
  { key: "chinese", label: "Chinese" },
  { key: "thai", label: "Thai" },
  { key: "continental", label: "Continental" },
  { key: "italian", label: "Italian" },
  { key: "seafood", label: "Seafood" },
  { key: "northeast", label: "Northeast" },
  { key: "cafe", label: "Café & Breakfast" },
];

const TabBistroSpecials = memo(() => {
  const [active, setActive] = useState("all");
  const list = active === "all" ? cuisines : cuisines.filter((c) => c.tags.includes(active));

  return (
    <section id="xtsy-specials">
      <div className="flex items-center gap-2 text-amber-400 mb-2">
        <Star className="w-5 h-5" />
        <span className="text-xs uppercase tracking-[0.15em] font-semibold">XTSY Specials</span>
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold text-foreground font-playfair mb-2">
        Multi-Cuisine Dining in Shillong — XTSY Specials
      </h2>
      <p className="text-muted-foreground text-sm mb-6 max-w-3xl leading-relaxed">
        One kitchen, every craving. TAB Bistro by XTSY brings North Indian, Indo-Chinese, Thai,
        Continental, Italian, seafood and Northeast flavours together — making it one of the most
        versatile multi-cuisine restaurants in Shillong. Filter by cuisine to find your favourite for
        dine-in, food orders or catering.
      </p>

      {/* Cuisine filter / tab bar */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 -mx-1 px-1 scrollbar-none" role="tablist" aria-label="Filter by cuisine">
        {filters.map((f) => {
          const isActive = active === f.key;
          return (
            <button
              key={f.key}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(f.key)}
              className={`flex items-center gap-1.5 whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                isActive
                  ? "bg-amber-500 text-black border-amber-500"
                  : "bg-card text-muted-foreground border-border hover:border-amber-500/40"
              }`}
            >
              {f.icon}
              {f.label}
            </button>
          );
        })}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((c) => (
          <div
            key={c.title}
            className="p-5 rounded-xl bg-card border border-border hover:border-amber-500/30 transition-colors"
          >
            <span className="text-amber-400 mb-2 block">{c.icon}</span>
            <h3 className="text-base font-semibold text-foreground mb-1">{c.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
          </div>
        ))}
      </div>

      {/* Order / cater CTAs */}
      <div className="flex flex-wrap gap-3 mt-8">
        <a
          href="https://wa.me/918837317070?text=Hi,%20I'd%20like%20to%20place%20a%20food%20order%20from%20TAB%20Bistro%20XTSY%20Specials."
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-black font-semibold text-sm transition-colors"
        >
          <ShoppingBag className="w-4 h-4" /> Order / Takeaway on WhatsApp
        </a>
        <Link
          to="/tab-bistro/catering"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-card border border-border hover:border-amber-500/40 text-foreground font-semibold text-sm transition-colors"
        >
          <PartyPopper className="w-4 h-4 text-amber-400" /> Catering & Bulk Orders
        </Link>
      </div>
    </section>
  );
});

TabBistroSpecials.displayName = "TabBistroSpecials";
export default TabBistroSpecials;
