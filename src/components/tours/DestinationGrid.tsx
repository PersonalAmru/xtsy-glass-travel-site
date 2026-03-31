import { getAllTours } from "@/data/travelData";
import type { TourPackage } from "@/data/travelData";

interface DestinationGridProps {
  onDestinationClick: (destination: string) => void;
}

const DESTINATIONS = [
  {
    name: "Meghalaya",
    tagline: "Living Root Bridges & Crystal Waters",
    image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/Travel%20page/double%20decker.jpg",
    color: "from-emerald-900/80 to-emerald-700/40",
  },
  {
    name: "Nagaland",
    tagline: "Tribal Heritage & Hornbill Festival",
    image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/Travel%20page/nagaland.jpg",
    color: "from-amber-900/80 to-amber-700/40",
  },
  {
    name: "Assam",
    tagline: "Wildlife Safaris & Tea Gardens",
    image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/Travel%20DOM/1/Complete%20Guide%20To%20Backpacking%20In%20Arunachal%20Pradesh%20-%20Lost%20With%20Purpose.jpg",
    color: "from-green-900/80 to-green-700/40",
  },
  {
    name: "Arunachal Pradesh",
    tagline: "Monasteries & Mountain Passes",
    image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/Travel%20page/Tawang-Monastery.jpg",
    color: "from-blue-900/80 to-blue-700/40",
  },
  {
    name: "Sikkim",
    tagline: "Himalayan Peaks & Rhododendrons",
    image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/Travel%20page/kanchenjunga-mountain-pelling-sikkim-1-city-hero.jpg",
    color: "from-indigo-900/80 to-indigo-700/40",
  },
];

const DestinationGrid = ({ onDestinationClick }: DestinationGridProps) => {
  const allTours = getAllTours();

  const getTourCount = (dest: string) => {
    return allTours.filter(t => t.location === dest).length;
  };

  const getStartingPrice = (dest: string) => {
    const tours = allTours.filter(t => t.location === dest);
    if (tours.length === 0) return null;
    const prices = tours.map(t => parseInt(t.price.replace(/[^\d]/g, '')));
    return Math.min(...prices);
  };

  return (
    <section className="py-12 sm:py-16 tours-section-bg">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-white mb-3">
            Explore by Destination
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Discover handpicked experiences across the eight sisters of Northeast India
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {DESTINATIONS.map(dest => {
            const count = getTourCount(dest.name);
            const startingPrice = getStartingPrice(dest.name);

            return (
              <button
                key={dest.name}
                onClick={() => onDestinationClick(dest.name)}
                className="group relative rounded-2xl overflow-hidden aspect-[3/4] sm:aspect-[2/3] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                <img
                  src={dest.image}
                  alt={`${dest.name} tours`}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${dest.color}`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-left">
                  <h3 className="font-semibold text-white text-sm sm:text-base mb-0.5 group-hover:text-emerald-300 transition-colors">
                    {dest.name}
                  </h3>
                  <p className="text-white/60 text-[10px] sm:text-xs mb-2 line-clamp-1">{dest.tagline}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-400 text-xs font-semibold">
                      {count} tour{count !== 1 ? 's' : ''}
                    </span>
                    {startingPrice && (
                      <span className="text-white/80 text-[10px] sm:text-xs">
                        From ₹{startingPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DestinationGrid;
