import { MessageCircle, Phone } from "lucide-react";

const TravelFinalCTA = () => (
  <section className="py-16 sm:py-20 bg-gradient-to-br from-card to-background relative overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_hsl(var(--primary)_/_0.08),transparent_60%)]" />
    <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
      <h2 className="font-playfair text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
        Not seeing your kind of journey?
      </h2>
      <p className="text-muted-foreground text-sm sm:text-base md:text-lg mb-8 max-w-xl mx-auto">
        We design bespoke itineraries for travelers who want something truly unique.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <a
          href="https://wa.me/919366074889?text=Hi%20XTSY%20Voyage!%20I%27d%20like%20to%20discuss%20a%20custom%20trip."
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-brand-ember hover:from-primary/90 hover:to-brand-ember/90 text-primary-foreground font-semibold rounded-full shadow-lg shadow-primary/25 transition-all hover:scale-105 text-sm sm:text-base"
        >
          <MessageCircle className="h-5 w-5" />
          Request a Custom Trip
        </a>
        <a
          href="https://wa.me/918837317070?text=Hi!%20I%27d%20like%20to%20talk%20to%20an%20XTSY%20Travel%20Curator."
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 border border-primary/40 text-primary hover:bg-primary/10 rounded-full transition-all text-sm sm:text-base"
        >
          <Phone className="h-5 w-5" />
          Talk to an XTSY Travel Curator
        </a>
      </div>
    </div>
  </section>
);

export default TravelFinalCTA;
