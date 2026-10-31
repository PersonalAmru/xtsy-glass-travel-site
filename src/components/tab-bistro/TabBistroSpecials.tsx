import { memo, useState } from "react";
import { Link } from "@/lib/router-compat";
import {
  Star, Soup, Salad, Drumstick, Globe2, Leaf, ShoppingBag, PartyPopper,
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
    desc: "Paneer Butter Masala, Kadhai Chicken, XTSY Chicken Kosha and Dal Makhani, with Tandoori Chicken, Paneer Tikka, Malai Broccoli and Tandoori Prawns off the live clay oven.",
    icon: <Drumstick className="w-5 h-5" />,
    tags: ["indian", "tandoor", "veg"],
  },
  {
    title: "Indo-Chinese",
    desc: "Chilli Chicken, Burned Garlic and Hot Schezwan Hakka noodles, fried rice, Manchurian and Kung Pao — wok-tossed to order, in veg, chicken or seafood.",
    icon: <Soup className="w-5 h-5" />,
    tags: ["chinese", "veg"],
  },
  {
    title: "XTSY Dum Biriyani",
    desc: "Veg, egg and chicken dum biriyani, plus Chicken Mandi in half and full portions that serve two or four — the thing to order for a table.",
    icon: <Star className="w-5 h-5" />,
    tags: ["biryani", "veg"],
  },
  {
    title: "South Indian",
    desc: "Masala and egg dosa, Kerala Parotta plain or with chicken gravy, steamed rice with tomato rasam, and curd rice with Chicken 65.",
    icon: <Globe2 className="w-5 h-5" />,
    tags: ["southindian", "veg"],
  },
  {
    title: "Hand-Crafted Pasta",
    desc: "Alfredo white and Al Arrabiata red, made to order in veg, chicken or seafood — the quiet favourite of the evening menu.",
    icon: <Salad className="w-5 h-5" />,
    tags: ["pasta", "veg"],
  },
  {
    title: "Soups & Appetizers",
    desc: "Manchow, Hot & Sour and Lemon Coriander soups; Paneer and Mushroom Manchurian, Crispy Chicken 65, Wings and Drums of Heaven, and Hot Chilli Prawns.",
    icon: <Leaf className="w-5 h-5" />,
    tags: ["veg", "chinese"],
  },
  {
    title: "Café & Breakfast",
    desc: "Assam tea, espresso and cappuccino, thick shakes and mojitos, with omelettes, parathas, poha, puri sabji and pancakes served 8:45 AM to 12 PM.",
    icon: <ShoppingBag className="w-5 h-5" />,
    tags: ["cafe", "veg"],
  },
  {
    title: "Desserts & Snack Corner",
    desc: "Ice cream, fruit bowls and fruit salad, with Peri Peri Fries, Peri Peri Cheesy Fries and veg, chicken or paneer pakoda alongside.",
    icon: <PartyPopper className="w-5 h-5" />,
    tags: ["cafe", "veg"],
  },
];

const filters: { key: string; label: string; icon?: React.ReactNode }[] = [
  { key: "all", label: "All Cuisines" },
  { key: "veg", label: "Veg-Friendly", icon: <Leaf className="w-3.5 h-3.5" /> },
  { key: "indian", label: "North Indian" },
  { key: "tandoor", label: "Tandoor" },
  { key: "chinese", label: "Indo-Chinese" },
  { key: "biryani", label: "Biriyani" },
  { key: "southindian", label: "South Indian" },
  { key: "pasta", label: "Pasta" },
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
