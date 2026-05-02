import { memo } from "react";
import { UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";

const WHATSAPP = "https://wa.me/918837317070?text=";

const TabBistroHero = memo(() => (
  <section className="bg-background pt-20 pb-16 sm:pt-28 sm:pb-20 px-4 sm:px-8">
    <div className="max-w-5xl mx-auto text-center">
      <span className="inline-flex items-center gap-2 text-amber-400 font-medium text-xs tracking-[0.2em] uppercase mb-4">
        <UtensilsCrossed className="w-4 h-4" /> Forest Dining Experience
      </span>
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4 font-playfair leading-tight">
        TAB Bistro <span className="text-amber-400">by XTSY</span>
      </h1>
      <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-2">
        Multi-cuisine forest dining in the pine forests of Shillong. Global flavours, handcrafted beverages, and curated culinary experiences.
      </p>
      <p className="text-xs text-muted-foreground tracking-widest uppercase mb-8">
        Flavour · Food · Fusion
      </p>


      <div className="flex flex-wrap justify-center gap-3">
        <Button
          size="lg"
          className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-base px-8 animate-pulse hover:animate-none"
          onClick={() => window.open(`${WHATSAPP}Hi, I'm an in-house guest at XTSY. I'd like to book a table at TAB Bistro with the 15%25 in-house guest discount.`, "_blank")}
        >
          Book Now — Before the Crave is Gone
        </Button>
        <Button
          size="lg"
          className="bg-amber-500 hover:bg-amber-600 text-black font-semibold"
          onClick={() => window.open(`${WHATSAPP}Hi, I'd like to reserve a table at TAB Bistro.`, "_blank")}
        >
          Reserve a Table
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="border-border text-foreground hover:bg-accent"
          onClick={() => document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" })}
        >
          View Menu
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="border-border text-foreground hover:bg-accent"
          onClick={() => document.getElementById("catering")?.scrollIntoView({ behavior: "smooth" })}
        >
          Catering & Events
        </Button>
      </div>
    </div>
  </section>
));

TabBistroHero.displayName = "TabBistroHero";
export default TabBistroHero;
