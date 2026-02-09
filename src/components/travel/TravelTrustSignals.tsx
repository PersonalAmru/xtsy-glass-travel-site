import { Users, Eye, Leaf, Shield } from "lucide-react";

const signals = [
  { icon: Users, title: "Curated by locals & explorers", desc: "Every journey designed by people who've lived it." },
  { icon: Shield, title: "Small groups only", desc: "Intimate experiences, never mass tourism." },
  { icon: Eye, title: "Transparent pricing", desc: "No hidden costs — what you see is what you pay." },
  { icon: Leaf, title: "Sustainable & community-led", desc: "Travel that gives back to the places you visit." },
];

const TravelTrustSignals = () => (
  <section className="py-12 sm:py-16 bg-muted/30">
    <div className="container mx-auto px-4 sm:px-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {signals.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 text-amber-600 mb-4">
              <Icon className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-foreground mb-1 text-sm sm:text-base">{title}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TravelTrustSignals;
