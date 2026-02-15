import React from "react";
import { Heart, Bike, User, Shield, Star, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { TourPackage } from "@/data/travelData";
import { coupleLuxuryTours, soloAndBikeTours } from "@/data/travelData";
import TravelSectionHeader from "./TravelSectionHeader";
import TravelTourCard from "./TravelTourCard";

interface Props {
  onSelect: (tour: TourPackage) => void;
}

const TravelCoupleAndSolo = ({ onSelect }: Props) => (
  <>
    {/* Couple Luxury Section */}
    <section id="travel-couple-luxury" className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-rose-950/40 to-stone-950 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(340_80%_50%_/_0.08),transparent_60%)]" />
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Couple Discount Banner */}
        <div className="mb-8 bg-gradient-to-r from-rose-500/10 to-pink-500/10 border border-rose-500/20 rounded-2xl p-6 text-center">
          <div className="inline-flex items-center gap-2 bg-rose-500 text-white px-4 py-1.5 rounded-full text-sm font-bold mb-3">
            <Heart className="h-4 w-4 fill-white" />
            15% Exclusive Couple Discount
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">
            XTSY 270 Panorama Glass Ensuite + Curated Tour
          </h3>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">
            Premium couples packages with luxury stay at our signature XTSY 270° panoramic glass room.
            Wake up to uninterrupted mountain views and embark on handpicked romantic experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {coupleLuxuryTours.map(tour => (
            <TravelTourCard key={tour.id} tour={tour} onSelect={onSelect} />
          ))}
        </div>
      </div>
    </section>

    {/* Solo Traveller & Bike Tours Section */}
    <section id="travel-solo-bike" className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-stone-950 to-indigo-950/30 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_hsl(250_60%_50%_/_0.06),transparent_60%)]" />
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Solo Pass Banner */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-violet-500/10 to-indigo-500/10 border border-violet-500/20 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-violet-500/20 rounded-xl">
                <Shield className="h-5 w-5 text-violet-400" />
              </div>
              <div>
                <h4 className="font-bold text-foreground">XTSY Solo Traveller Pass</h4>
                <p className="text-xs text-muted-foreground">For solo female & male travellers</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              24/7 safety support • Verified homestays • Local buddy system • Women-only batches available
            </p>
          </div>
          <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-amber-500/20 rounded-xl">
                <Bike className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <h4 className="font-bold text-foreground">Bike Tours Across NE India</h4>
                <p className="text-xs text-muted-foreground">Royal Enfield expeditions</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Solo-friendly routes • Mechanic support vehicle • All gear included • GPS-tracked rides
            </p>
          </div>
        </div>

        <TravelSectionHeader
          title="Solo Adventures & Bike Expeditions"
          subtitle="Making solo travel easy, safe, and unforgettable. Designed for independent explorers — male & female."
          badge="🏍️ Solo-Friendly"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {soloAndBikeTours.map(tour => (
            <TravelTourCard key={tour.id} tour={tour} onSelect={onSelect} />
          ))}
        </div>
      </div>
    </section>
  </>
);

export default TravelCoupleAndSolo;
