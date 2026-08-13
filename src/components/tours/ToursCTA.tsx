import { Button } from "@/components/ui/button";
import { Compass, MessageCircle } from "lucide-react";
import { useNavigate } from "@/lib/router-compat";

const ToursCTA = () => {
  const navigate = useNavigate();

  const handleWhatsApp = () => {
    window.open(
      "https://wa.me/918787389783?text=Hi%20XTSY!%20I%20want%20to%20plan%20a%20North%20East%20India%20trip.%20Can%20you%20help%3F",
      "_blank"
    );
  };

  return (
    <section className="py-16 sm:py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-background to-amber-900/20" />
      <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center">
        <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-white mb-4">
          Plan Your North East Adventure
        </h2>
        <p className="text-muted-foreground max-w-lg mx-auto mb-8">
          Let our travel experts craft the perfect itinerary for you. Custom trips, private groups, and exclusive access.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-semibold px-8 rounded-xl shadow-lg shadow-emerald-500/25"
          >
            <Compass className="h-5 w-5 mr-2" />
            View Tours
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={handleWhatsApp}
            className="border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 px-8 rounded-xl bg-transparent"
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            Talk to Travel Expert
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ToursCTA;
