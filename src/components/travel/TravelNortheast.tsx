import { useState } from "react";
import { northeastTours, type TourPackage } from "@/data/travelData";
import TravelSectionHeader from "./TravelSectionHeader";
import TravelTourCard from "./TravelTourCard";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

interface Props {
  onSelect: (tour: TourPackage) => void;
}

const states = Object.keys(northeastTours);

const TravelNortheast = ({ onSelect }: Props) => {
  const [activeState, setActiveState] = useState("all");

  const tours = activeState === "all"
    ? Object.values(northeastTours).flat()
    : northeastTours[activeState] || [];

  return (
    <section id="travel-northeast" className="py-12 sm:py-16 md:py-20 bg-background relative">
      <div className="container mx-auto px-4 sm:px-6">
        <TravelSectionHeader
          title="Northeast India — Seven Sisters & Beyond"
          subtitle="The soul of XTSY Voyage. Pristine landscapes, living cultures, and adventures that define who we are."
          badge="Core Identity"
          badgeIcon="🏔️"
        />

        {/* State filter pills */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-10">
          <Button
            size="sm"
            variant={activeState === "all" ? "default" : "outline"}
            onClick={() => setActiveState("all")}
            className="rounded-full text-xs sm:text-sm"
          >
            All States
          </Button>
          {states.map(state => (
            <Button
              key={state}
              size="sm"
              variant={activeState === state ? "default" : "outline"}
              onClick={() => setActiveState(state)}
              className="rounded-full text-xs sm:text-sm"
            >
              <MapPin className="h-3 w-3 mr-1" />
              {state}
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

export default TravelNortheast;
