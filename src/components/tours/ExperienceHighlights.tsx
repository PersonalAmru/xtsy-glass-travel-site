import { Home, Car, Palette, TreePine, Users } from "lucide-react";

const HIGHLIGHTS = [
  { icon: Home, label: "Handpicked Local Stays", desc: "Verified homestays & boutique properties" },
  { icon: Car, label: "Private Transportation", desc: "Comfortable door-to-door transfers" },
  { icon: Palette, label: "Cultural Experiences", desc: "Authentic local immersion programs" },
  { icon: TreePine, label: "Nature Immersion", desc: "Pristine forests, rivers & mountains" },
  { icon: Users, label: "Local Expert Guides", desc: "Knowledgeable regional storytellers" },
];

const ExperienceHighlights = () => (
  <section className="py-12 sm:py-16 tours-section-bg">
    <div className="container mx-auto px-4 sm:px-6">
      <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-white text-center mb-10">
        Why Travel With XTSY
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
        {HIGHLIGHTS.map(h => (
          <div key={h.label} className="text-center group">
            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
              <h.icon className="h-6 w-6 text-emerald-400" />
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">{h.label}</h3>
            <p className="text-xs text-muted-foreground">{h.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ExperienceHighlights;
