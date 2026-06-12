import { Sparkles, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import romanticForestDining from "@/assets/romantic-forest-dining.jpg";
import hiddenWaterfallExpedition from "@/assets/hidden-waterfall-expedition.jpg";
import { ROOM_IMAGES } from "@/config/roomTypes";

const EXPERIENCES = [
  {
    title: "Glasshouse Stargazing Experience",
    description: "Sleep under the stars inside a transparent glass glamping dome surrounded by pine forests.",
    duration: "Overnight",
    includes: ["Stargazing session", "Bonfire night", "Dinner at TAB Bistro"],
    image: ROOM_IMAGES["xtsy-270"][0],
  },
  {
    title: "Pine Forest Bonfire Nights",
    description: "An evening experience in a peaceful pine forest with warm bonfires and BBQ dining.",
    duration: "Evening Experience",
    includes: ["Bonfire setup", "BBQ dinner", "Mocktails and beverages", "Local storytelling"],
    image: "/__l5e/assets-v1/d91fa8ec-2fb5-40dc-8712-13c320a69653/dawki-campsite-5.jpeg",
  },
  {
    title: "Romantic Forest Dining",
    description: "A private candlelight dinner experience set inside a forest environment.",
    duration: "2–3 hours",
    includes: ["Multi-course dinner", "Decorated dining setup", "Desserts and sweets", "Signature mocktails"],
    image: ROOM_IMAGES["xtsy-270"][3],
  },
  {
    title: "Hidden Waterfall Expedition",
    description: "Guided journey exploring hidden waterfalls and nature trails around Shillong.",
    duration: "Half-day or full-day",
    includes: ["Local guide", "Packed meals from TAB Bistro", "Photography stops"],
    image: hiddenWaterfallExpedition,
  },
];

const SignatureExperiences = () => (
  <section className="py-12 sm:py-16 tours-section-bg">
    <div className="container mx-auto px-4 sm:px-6">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full mb-4">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs text-primary font-medium uppercase tracking-wider">Exclusive</span>
        </div>
        <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-foreground mb-3">
          Only at XTSY — Signature Experiences
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
          Exclusive experiences curated by XTSY combining stays, dining, and immersive local adventures in North East India.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        {EXPERIENCES.map((exp) => (
          <Card
            key={exp.title}
            className="group cursor-pointer bg-card border border-border/50 shadow-md hover:shadow-xl hover:border-primary/30 transition-shadow duration-300 rounded-2xl overflow-hidden h-full flex flex-col"
          >
            {/* Image */}
            <div className="relative overflow-hidden">
              <img
                src={exp.image}
                alt={exp.title}
                className="w-full h-36 sm:h-44 md:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

              {/* Badge */}
              <div className="absolute top-3 left-3">
                <Badge className="bg-gradient-to-r from-brand-gold to-primary text-primary-foreground text-xs px-2.5 py-1 font-semibold shadow-lg border-0">
                  ⭐ XTSY Exclusive
                </Badge>
              </div>

              {/* Duration */}
              <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-card/95 backdrop-blur-sm text-muted-foreground px-2.5 py-1 rounded-full text-xs font-medium shadow-lg">
                <Clock className="h-3 w-3" />
                <span>{exp.duration}</span>
              </div>
            </div>

            <CardContent className="p-4 flex-grow flex flex-col">
              <h3 className="font-semibold text-foreground mb-2 text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                {exp.title}
              </h3>

              <p className="text-xs sm:text-sm text-muted-foreground mb-4 line-clamp-2">
                {exp.description}
              </p>

              {/* Includes */}
              <div className="mb-4 flex-grow">
                <div className="space-y-1.5">
                  {exp.includes.slice(0, 3).map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-gradient-to-r from-brand-gold to-primary rounded-full mt-1.5 flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-muted-foreground leading-tight line-clamp-1">{item}</span>
                    </div>
                  ))}
                  {exp.includes.length > 3 && (
                    <span className="text-xs text-primary font-medium">+{exp.includes.length - 3} more</span>
                  )}
                </div>
              </div>

              {/* CTA */}
              <div className="mt-auto pt-3 border-t border-border">
                <button className="w-full bg-gradient-to-r from-primary to-brand-ember hover:from-primary/90 hover:to-brand-ember/90 text-primary-foreground font-semibold py-2.5 px-4 rounded-xl text-sm transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/35 hover:scale-[1.02]">
                  View Experience →
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

export default SignatureExperiences;
