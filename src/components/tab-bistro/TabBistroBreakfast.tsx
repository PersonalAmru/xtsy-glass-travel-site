import { memo } from "react";
import { Coffee, Sunrise, Building2, Mountain } from "lucide-react";

const highlights = [
  {
    title: "Breakfast in Shillong",
    desc: "One of the best breakfast places in Shillong — fresh Assam tea, filter coffee, English breakfast, parathas, eggs to order and pancakes, served from 8 AM in a calm pine-forest setting.",
    icon: <Sunrise className="w-5 h-5" />,
  },
  {
    title: "Rooftop Dining",
    desc: "An upcoming rooftop restaurant in Shillong with panoramic pine-valley views — sunset platters, grills and handcrafted beverages above the treeline.",
    icon: <Building2 className="w-5 h-5" />,
    badge: "Upcoming",
  },
  {
    title: "All-Day Café",
    desc: "A relaxed rooftop cafe in Shillong vibe for remote workers and travellers — espresso, cold brew, fast WiFi corners and light bites through the day.",
    icon: <Coffee className="w-5 h-5" />,
  },
  {
    title: "Forest Setting",
    desc: "Every meal is framed by Shillong's pine forests — the calmest place in the city to start your morning or end your day.",
    icon: <Mountain className="w-5 h-5" />,
  },
];

const TabBistroBreakfast = memo(() => (
  <section id="breakfast">
    <div className="flex items-center gap-2 text-amber-400 mb-2">
      <Coffee className="w-5 h-5" />
      <span className="text-xs uppercase tracking-[0.15em] font-semibold">Breakfast &amp; Café</span>
    </div>
    <h2 className="text-2xl sm:text-3xl font-bold text-foreground font-playfair mb-2">
      Breakfast Places &amp; Rooftop Dining in Shillong
    </h2>
    <p className="text-muted-foreground text-sm mb-8 max-w-3xl leading-relaxed">
      Looking for breakfast places in Shillong or a rooftop cafe with a view? TAB Bistro by XTSY serves a
      multi-cuisine breakfast from 8 AM and is opening a rooftop dining deck overlooking the pine valley —
      a calm, scenic alternative to the city's crowded cafés.
    </p>

    <div className="grid sm:grid-cols-2 gap-4">
      {highlights.map((h) => (
        <div
          key={h.title}
          className="relative p-5 rounded-xl bg-card border border-border hover:border-amber-500/30 transition-colors"
        >
          {h.badge && (
            <span className="absolute top-4 right-4 text-[10px] uppercase tracking-wider bg-amber-500/15 text-amber-400 px-2 py-0.5 rounded-full font-semibold">
              {h.badge}
            </span>
          )}
          <span className="text-amber-400 mb-2 block">{h.icon}</span>
          <h3 className="text-base font-semibold text-foreground mb-1">{h.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{h.desc}</p>
        </div>
      ))}
    </div>
  </section>
));

TabBistroBreakfast.displayName = "TabBistroBreakfast";
export default TabBistroBreakfast;
