import { memo } from "react";
import { Star, Soup, Beef, Pizza, Fish, Salad, Drumstick, Globe2 } from "lucide-react";

/**
 * XTSY Specials — multi-cuisine showcase. Built to own Shillong's thin
 * food/restaurant/cuisine keyword space (Indian, Chinese, Thai, Continental,
 * Tandoor, Italian, Northeast, seafood) under a single niche brand.
 */
const cuisines = [
  {
    title: "North Indian & Tandoor",
    desc: "Paneer Butter Masala, Kadhai Chicken, Dal Makhani, Murgh Malai Tikka and clay-oven naans — the best North Indian restaurant flavours in Shillong.",
    icon: <Drumstick className="w-5 h-5" />,
  },
  {
    title: "Indo-Chinese",
    desc: "Chilli Chicken, Hakka noodles, Schezwan fried rice, Manchurian and Kung Pao — Shillong's go-to Chinese food, wok-tossed to order.",
    icon: <Soup className="w-5 h-5" />,
  },
  {
    title: "Thai & Pan-Asian",
    desc: "Thai basil chicken, Thai curries and Bangkok fusion plates — rare pan-Asian dining you won't easily find elsewhere in Shillong.",
    icon: <Globe2 className="w-5 h-5" />,
  },
  {
    title: "Continental & Grills",
    desc: "Fish & Chips, Chicken Stroganoff, Schnitzel, grilled fish and steaks with sauces — proper continental food in the pines.",
    icon: <Beef className="w-5 h-5" />,
  },
  {
    title: "Italian — Pizza & Pasta",
    desc: "Wood-style pizzas, Alfredo and Arrabiata pastas, lasagne-rich flavours — the cosy Italian corner of TAB Bistro.",
    icon: <Pizza className="w-5 h-5" />,
  },
  {
    title: "Seafood & Sizzlers",
    desc: "Butter-garlic prawns, chilli fish, grilled prawns and live sizzlers served on cast iron — a seafood menu that's hard to find in the hills.",
    icon: <Fish className="w-5 h-5" />,
  },
  {
    title: "Northeast & Khasi Flavours",
    desc: "Smoked, fiery local-style plates and regional specials that celebrate Northeast India's cuisine alongside global favourites.",
    icon: <Star className="w-5 h-5" />,
  },
  {
    title: "Salads, Café & Breakfast",
    desc: "Caesar and loaded salads, all-day café bites, breakfast spreads, shakes and mocktails — light, fresh and made for slow mornings.",
    icon: <Salad className="w-5 h-5" />,
  },
];

const TabBistroSpecials = memo(() => (
  <section id="xtsy-specials">
    <div className="flex items-center gap-2 text-amber-400 mb-2">
      <Star className="w-5 h-5" />
      <span className="text-xs uppercase tracking-[0.15em] font-semibold">XTSY Specials</span>
    </div>
    <h2 className="text-2xl sm:text-3xl font-bold text-foreground font-playfair mb-2">
      Multi-Cuisine Dining in Shillong — XTSY Specials
    </h2>
    <p className="text-muted-foreground text-sm mb-8 max-w-3xl leading-relaxed">
      One kitchen, every craving. TAB Bistro by XTSY brings North Indian, Indo-Chinese, Thai,
      Continental, Italian, seafood and Northeast flavours together — making it one of the most
      versatile multi-cuisine restaurants in Shillong. Whether you want a Tandoori feast, a Thai
      curry, a wood-style pizza or a fresh café breakfast, the XTSY Specials menu has it.
    </p>

    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cuisines.map((c) => (
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
  </section>
));

TabBistroSpecials.displayName = "TabBistroSpecials";
export default TabBistroSpecials;
