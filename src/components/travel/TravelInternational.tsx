import { useState } from "react";
import { internationalTours, reHimalayanExpedition, type TourPackage } from "@/data/travelData";
import TravelSectionHeader from "./TravelSectionHeader";
import TravelTourCard from "./TravelTourCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe } from "lucide-react";
import { useApp } from "@/contexts/AppContext";

interface Props {
  onSelect: (tour: TourPackage) => void;
}

const regions = Object.keys(internationalTours);

const TravelInternational = ({ onSelect }: Props) => {
  const [activeRegion, setActiveRegion] = useState("all");
  const { formatPrice } = useApp();

  const tours = activeRegion === "all"
    ? Object.values(internationalTours).flat()
    : internationalTours[activeRegion] || [];

  return (
    <section id="travel-international" className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-background to-muted/30 relative">
      <div className="container mx-auto px-4 sm:px-6">
        <TravelSectionHeader
          title="International Journeys — Curated the XTSY Way"
          subtitle="Neighbourhoods, nature, and culture — not checklist tourism."
          badge="🌍 International"
        />

        {/* RE Himalayan Expedition — Premium Feature Card */}
        <div className="mb-10 sm:mb-14">
          <Card
            className="group overflow-hidden border-2 border-amber-200 bg-gradient-to-br from-amber-50/80 to-orange-50/80 cursor-pointer hover:shadow-2xl transition-all duration-500"
            onClick={() => onSelect(reHimalayanExpedition)}
          >
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative h-64 md:h-auto overflow-hidden">
                  <img
                    src={reHimalayanExpedition.image}
                    alt="Royal Enfield Himalayan Tri-Nation Expedition"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-bold shadow-lg">⭐ PREMIUM</Badge>
                    <Badge className="bg-emerald-600 text-white text-xs font-bold shadow-lg">🎯 NOW BOOKING</Badge>
                  </div>
                </div>
                <div className="p-6 sm:p-8 flex flex-col justify-center">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-3">
                    Tri-Nation Himalayan Motorbike Expedition
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground mb-4 leading-relaxed">
                    The ultimate cross-border adventure on a <strong>Royal Enfield Himalayan</strong> through <strong>Northeast India</strong>, <strong>Nepal</strong>, and <strong>Bhutan</strong>. 12–15 days of mountain passes, monasteries, and pristine valleys.
                  </p>
                  <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                    <div><span className="text-muted-foreground">Duration:</span> <span className="font-semibold">12-15 Days</span></div>
                    <div><span className="text-muted-foreground">Difficulty:</span> <span className="font-semibold">Challenging</span></div>
                    <div><span className="text-muted-foreground">Countries:</span> <span className="font-semibold">India, Nepal, Bhutan</span></div>
                    <div><span className="text-muted-foreground">From:</span> <span className="font-bold text-amber-600">{formatPrice(185000)}</span></div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {reHimalayanExpedition.highlights.slice(0, 4).map((h, i) => (
                      <Badge key={i} variant="outline" className="text-xs">{h}</Badge>
                    ))}
                  </div>
                  <button className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold py-2.5 px-6 rounded-xl text-sm shadow-lg transition-all">
                    View Full Expedition →
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Region filter */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-10">
          <Button
            size="sm"
            variant={activeRegion === "all" ? "default" : "outline"}
            onClick={() => setActiveRegion("all")}
            className="rounded-full text-xs sm:text-sm"
          >
            <Globe className="h-3 w-3 mr-1" />
            All Destinations
          </Button>
          {regions.map(r => (
            <Button
              key={r}
              size="sm"
              variant={activeRegion === r ? "default" : "outline"}
              onClick={() => setActiveRegion(r)}
              className="rounded-full text-xs sm:text-sm"
            >
              {r}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {tours.map(tour => (
            <TravelTourCard key={tour.id} tour={tour} onSelect={onSelect} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TravelInternational;
