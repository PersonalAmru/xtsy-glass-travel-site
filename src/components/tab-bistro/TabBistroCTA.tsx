import { memo } from "react";
import { Button } from "@/components/ui/button";

const WHATSAPP = "https://wa.me/918837317070?text=";

const TabBistroCTA = memo(() => (
  <section className="rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-900/10 border border-amber-500/20 p-8 sm:p-12 text-center">
    <h2 className="text-2xl sm:text-3xl font-bold text-foreground font-playfair mb-3">
      Ready to Experience TAB Bistro?
    </h2>
    <p className="text-muted-foreground mb-8 max-w-xl mx-auto text-sm sm:text-base">
      Whether it's a romantic dinner for two or a grand wedding feast — we bring the mountain flavour to every plate.
    </p>
    <div className="flex flex-wrap justify-center gap-3">
      <Button
        size="lg"
        className="bg-amber-500 hover:bg-amber-600 text-black font-semibold"
        onClick={() => window.open(`${WHATSAPP}Hi, I'd like to reserve a table at TAB Bistro.`, "_blank")}
      >
        Reserve Table
      </Button>
      <Button
        size="lg"
        variant="outline"
        className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
        onClick={() => window.open(`${WHATSAPP}Hi, I'd like to enquire about wedding catering by TAB Bistro.`, "_blank")}
      >
        Wedding Catering
      </Button>
      <Button
        size="lg"
        variant="outline"
        className="border-border text-foreground hover:bg-accent"
        onClick={() => window.open(`${WHATSAPP}Hi, I'd like to plan an event with TAB Bistro catering.`, "_blank")}
      >
        Plan an Event
      </Button>
    </div>
  </section>
));

TabBistroCTA.displayName = "TabBistroCTA";
export default TabBistroCTA;
