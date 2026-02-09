import { exclusiveTours, type TourPackage } from "@/data/travelData";
import TravelSectionHeader from "./TravelSectionHeader";
import TravelTourCard from "./TravelTourCard";

interface Props {
  onSelect: (tour: TourPackage) => void;
}

const TravelExclusives = ({ onSelect }: Props) => (
  <section id="travel-exclusives" className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-stone-950 to-stone-900 relative">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(25_95%_53%_/_0.06),transparent_70%)]" />
    <div className="container mx-auto px-4 sm:px-6 relative z-10">
      <TravelSectionHeader
        title="XTSY Exclusive Experiences"
        subtitle="Limited-batch, handpicked journeys you won't find anywhere else. Educational, research-driven, and deeply immersive."
        badge="⭐ Premium Collection"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {exclusiveTours.map(tour => (
          <TravelTourCard key={tour.id} tour={tour} onSelect={onSelect} />
        ))}
      </div>
    </div>
  </section>
);

export default TravelExclusives;
