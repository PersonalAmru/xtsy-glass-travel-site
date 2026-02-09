import { Button } from "@/components/ui/button";
import { Compass, Star } from "lucide-react";

const TravelHero = () => {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative py-16 sm:py-20 md:py-28 lg:py-36 overflow-hidden">
      {/* Cinematic background */}
      <div className="absolute inset-0 bg-gradient-to-br from-stone-950 via-stone-900 to-stone-800" />
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=60')] bg-cover bg-center opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-transparent to-stone-950/60" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-6 sm:mb-8">
          <Compass className="h-4 w-4 text-amber-400" />
          <span className="text-xs sm:text-sm font-medium text-amber-200 tracking-wide uppercase">XTSY Voyage</span>
        </div>

        {/* Title */}
        <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-6 leading-[1.1] tracking-tight">
          Travel Beyond<br />
          <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-red-400 bg-clip-text text-transparent">the Map</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-stone-300 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed font-light">
          Curated journeys across India and the world — led by experience, not itineraries.
        </p>

        {/* Decorative divider */}
        <div className="flex items-center justify-center gap-3 mb-8 sm:mb-10">
          <div className="w-16 h-px bg-gradient-to-r from-transparent to-amber-500/50" />
          <div className="w-1.5 h-1.5 rotate-45 bg-amber-400" />
          <div className="w-16 h-px bg-gradient-to-l from-transparent to-amber-500/50" />
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            onClick={() => scrollTo("travel-northeast")}
            className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg shadow-amber-500/25 text-base"
          >
            <Compass className="h-5 w-5 mr-2" />
            Explore Tours
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => scrollTo("travel-exclusives")}
            className="border-amber-400/40 text-amber-200 hover:bg-amber-400/10 hover:text-amber-100 px-8 py-3 rounded-full text-base bg-transparent"
          >
            <Star className="h-5 w-5 mr-2" />
            XTSY Exclusives
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TravelHero;
