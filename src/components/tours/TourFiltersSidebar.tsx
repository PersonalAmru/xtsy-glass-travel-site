import { memo } from "react";
import { Filter, X, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface MarketplaceFilters {
  destination: string;
  duration: string;
  priceRange: string;
  experience: string;
  sortBy: string;
}

const DEFAULTS: MarketplaceFilters = {
  destination: "all",
  duration: "all",
  priceRange: "all",
  experience: "all",
  sortBy: "popularity",
};

interface Props {
  filters: MarketplaceFilters;
  onChange: (f: MarketplaceFilters) => void;
  tourCount: number;
}

const FilterGroup = ({ title, options, value, onSelect }: {
  title: string;
  options: { value: string; label: string }[];
  value: string;
  onSelect: (v: string) => void;
}) => (
  <div className="mb-5">
    <h4 className="text-xs font-semibold text-white/80 uppercase tracking-wider mb-2.5">{title}</h4>
    <div className="flex flex-wrap gap-1.5">
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onSelect(opt.value)}
          className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
            value === opt.value
              ? "bg-emerald-600 border-emerald-500 text-white"
              : "bg-white/5 border-white/10 text-white/60 hover:border-white/30 hover:text-white/80"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  </div>
);

const TourFiltersSidebar = memo(({ filters, onChange, tourCount }: Props) => {
  const update = (key: keyof MarketplaceFilters, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  const isFiltering = Object.entries(filters).some(
    ([k, v]) => v !== DEFAULTS[k as keyof MarketplaceFilters]
  );

  const activeCount = Object.entries(filters).filter(
    ([k, v]) => k !== "sortBy" && v !== "all"
  ).length;

  return (
    <div className="bg-card/30 backdrop-blur-sm border border-border/30 rounded-2xl p-4 sm:p-5 sticky top-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-emerald-500" />
          <h3 className="font-semibold text-white text-sm">Filters</h3>
          {activeCount > 0 && (
            <Badge className="bg-emerald-600 text-white text-[10px] px-1.5 py-0 h-5 border-0">
              {activeCount}
            </Badge>
          )}
        </div>
        {isFiltering && (
          <button
            onClick={() => onChange(DEFAULTS)}
            className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            <X className="h-3 w-3" /> Clear
          </button>
        )}
      </div>

      <FilterGroup
        title="Destination"
        value={filters.destination}
        onSelect={v => update("destination", v)}
        options={[
          { value: "all", label: "All" },
          { value: "Meghalaya", label: "Meghalaya" },
          { value: "Nagaland", label: "Nagaland" },
          { value: "Assam", label: "Assam" },
          { value: "Arunachal Pradesh", label: "Arunachal" },
          { value: "Sikkim", label: "Sikkim" },
          { value: "Manipur", label: "Manipur" },
        ]}
      />

      <FilterGroup
        title="Duration"
        value={filters.duration}
        onSelect={v => update("duration", v)}
        options={[
          { value: "all", label: "Any" },
          { value: "short", label: "1–3 Days" },
          { value: "medium", label: "4–6 Days" },
          { value: "long", label: "7–10 Days" },
        ]}
      />

      <FilterGroup
        title="Price Range"
        value={filters.priceRange}
        onSelect={v => update("priceRange", v)}
        options={[
          { value: "all", label: "Any" },
          { value: "budget", label: "Under ₹15K" },
          { value: "mid", label: "₹15K–₹35K" },
          { value: "premium", label: "₹35K+" },
        ]}
      />

      <FilterGroup
        title="Experience Type"
        value={filters.experience}
        onSelect={v => update("experience", v)}
        options={[
          { value: "all", label: "All" },
          { value: "adventure", label: "Adventure" },
          { value: "cultural", label: "Culture" },
          { value: "leisure", label: "Nature" },
          { value: "educational", label: "Wildlife" },
        ]}
      />

      <div className="border-t border-border/30 pt-4 mt-2">
        <h4 className="text-xs font-semibold text-white/80 uppercase tracking-wider mb-2.5">Sort By</h4>
        <div className="space-y-1.5">
          {[
            { value: "popularity", label: "Popularity" },
            { value: "price-low", label: "Price: Low to High" },
            { value: "price-high", label: "Price: High to Low" },
            { value: "rating", label: "Top Rated" },
          ].map(opt => (
            <button
              key={opt.value}
              onClick={() => update("sortBy", opt.value)}
              className={`w-full text-left text-xs px-3 py-2 rounded-lg transition-all ${
                filters.sortBy === opt.value
                  ? "bg-emerald-600/20 text-emerald-400 font-medium"
                  : "text-white/50 hover:text-white/70 hover:bg-white/5"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Result count */}
      <div className="mt-5 pt-4 border-t border-border/30 text-center">
        <span className="text-sm text-muted-foreground">
          <span className="text-emerald-400 font-semibold">{tourCount}</span> tours found
        </span>
      </div>
    </div>
  );
});

TourFiltersSidebar.displayName = "TourFiltersSidebar";

export { DEFAULTS as DEFAULT_MARKETPLACE_FILTERS };
export default TourFiltersSidebar;
