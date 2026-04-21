import { Sparkles, TreePine, Droplets, Flame, Star } from "lucide-react";

const EXPERIENCES = [
  {
    icon: Star,
    title: "270° Glasshouse Stargazing",
    desc: "India's first panoramic glass suite under the stars",
    gradient: "from-indigo-500 to-purple-600",
  },
  {
    icon: TreePine,
    title: "Pine Forest Glamping",
    desc: "Luxury camping beneath ancient Khasi pine canopies",
    gradient: "from-emerald-500 to-green-600",
  },
  {
    icon: Droplets,
    title: "Hidden Waterfall Expeditions",
    desc: "Trek to cascades only locals know about",
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    icon: Flame,
    title: "Tribal Food Experiences",
    desc: "Authentic Naga, Khasi & Jaintia cuisine journeys",
    gradient: "from-orange-500 to-red-600",
  },
  {
    icon: Sparkles,
    title: "Bonfire Night Sessions",
    desc: "Mountain campfires with music & storytelling",
    gradient: "from-amber-500 to-orange-600",
  },
];

const UniqueExperiences = () => (
  <section className="py-12 sm:py-16 bg-gradient-to-b from-background to-card/50">
    <div className="container mx-auto px-4 sm:px-6">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full mb-4">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          <span className="text-xs text-amber-400 font-medium uppercase tracking-wider">Only at XTSY</span>
        </div>
        <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-white mb-3">
          Unique Experience by XTSYs
        </h2>
        <p className="text-muted-foreground max-w-lg mx-auto text-sm">
          Proprietary experiences you won't find anywhere else
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {EXPERIENCES.map(exp => (
          <div
            key={exp.title}
            className="group bg-card/30 backdrop-blur-sm border border-border/30 rounded-2xl p-5 hover:border-amber-500/30 transition-all"
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${exp.gradient} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
              <exp.icon className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-semibold text-white text-sm mb-1">{exp.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{exp.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default UniqueExperiences;
