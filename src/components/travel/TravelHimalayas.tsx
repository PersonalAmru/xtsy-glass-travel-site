import { useState } from "react";
import { heartlandTours, type TourPackage } from "@/data/travelData";
import TravelSectionHeader from "./TravelSectionHeader";
import TravelTourCard from "./TravelTourCard";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

interface Props {
  onSelect: (tour: TourPackage) => void;
}

const regions = Object.keys(heartlandTours);

const TravelHimalayas = ({ onSelect }: Props) => {
  const [activeRegion, setActiveRegion] = useState("all");

  const tours = activeRegion === "all"
    ? Object.values(heartlandTours).flat()
    : heartlandTours[activeRegion] || [];

  return (
    <section id="travel-himalayas" className="py-12 sm:py-16 md:py-20 bg-muted/30 relative">
      <div className="container mx-auto px-4 sm:px-6">
        <TravelSectionHeader
          title="Mountains, Mindfulness & Heritage India"
          subtitle="Balanced leisure, culture, and soft adventure — ideal for couples, families, and slow travelers."
          badge="Indian Heartland"
          badgeIcon="🕉️"
        />

        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-10">
          <Button
            size="sm"
            variant={activeRegion === "all" ? "default" : "outline"}
            onClick={() => setActiveRegion("all")}
            className="rounded-full text-xs sm:text-sm"
          >
            All Regions
          </Button>
          {regions.map(r => (
            <Button
              key={r}
              size="sm"
              variant={activeRegion === r ? "default" : "outline"}
              onClick={() => setActiveRegion(r)}
              className="rounded-full text-xs sm:text-sm"
            >
              <MapPin className="h-3 w-3 mr-1" />
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

export default TravelHimalayas;
