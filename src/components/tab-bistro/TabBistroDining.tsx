import { memo } from "react";
import { Flame, Heart, Sunset, Globe, TreePine } from "lucide-react";

const experiences = [
  {
    title: "Pine Forest BBQ Nights",
    desc: "Open-fire BBQ dining surrounded by pine forests.",
    icon: <Flame className="w-5 h-5" />,
  },
  {
    title: "Romantic Forest Dinner",
    desc: "Private candlelight dinner in a serene forest setting.",
    icon: <Heart className="w-5 h-5" />,
  },
  {
    title: "Rooftop Dining",
    desc: "Sunset rooftop dining with panoramic views and curated menus.",
    icon: <Sunset className="w-5 h-5" />,
    badge: "Upcoming",
  },
  {
    title: "Traveller's Feast",
    desc: "Multi-cuisine dining designed for travellers exploring North East India.",
    icon: <Globe className="w-5 h-5" />,
  },
];

const TabBistroDining = memo(() => (
  <section>
    <div className="flex items-center gap-2 text-amber-400 mb-2">
      <TreePine className="w-5 h-5" />
      <span className="text-xs uppercase tracking-[0.15em] font-semibold">Experiences</span>
    </div>
    <h2 className="text-2xl sm:text-3xl font-bold text-foreground font-playfair mb-2">Dining Experiences</h2>
    <p className="text-muted-foreground text-sm mb-8">Curated culinary moments set against nature.</p>

    <div className="grid sm:grid-cols-2 gap-4">
      {experiences.map((exp) => (
        <div
          key={exp.title}
          className="relative p-5 rounded-xl bg-card border border-border hover:border-amber-500/30 transition-colors"
        >
          {exp.badge && (
            <span className="absolute top-4 right-4 text-[10px] uppercase tracking-wider bg-amber-500/15 text-amber-400 px-2 py-0.5 rounded-full font-semibold">
              {exp.badge}
            </span>
          )}
          <span className="text-amber-400 mb-2 block">{exp.icon}</span>
          <h3 className="text-base font-semibold text-foreground mb-1">{exp.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{exp.desc}</p>
        </div>
      ))}
    </div>
  </section>
));

TabBistroDining.displayName = "TabBistroDining";
export default TabBistroDining;
