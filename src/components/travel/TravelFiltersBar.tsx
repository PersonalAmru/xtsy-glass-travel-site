import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, X } from "lucide-react";
import type { TravelFilters, TravelTheme, TravelDestination, DurationRange, BudgetRange, SeasonFilter } from "@/data/travelData";

interface Props {
  filters: TravelFilters;
  onChange: (filters: TravelFilters) => void;
}

const TravelFiltersBar = memo(({ filters, onChange }: Props) => {
  const update = (key: keyof TravelFilters, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  const isActive = Object.values(filters).some(v => v !== "all");

  return (
    <div className="sticky top-16 z-30 bg-background/95 backdrop-blur-xs border-b border-border py-3 sm:py-4">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-1">
          <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground flex-shrink-0">
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
          </div>

          <Select value={filters.destination} onValueChange={(v) => update("destination", v)}>
            <SelectTrigger className="w-[120px] sm:w-[140px] h-9 text-xs sm:text-sm flex-shrink-0">
              <SelectValue placeholder="Destination" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Destinations</SelectItem>
              <SelectItem value="india">India</SelectItem>
              <SelectItem value="international">International</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.theme} onValueChange={(v) => update("theme", v)}>
            <SelectTrigger className="w-[120px] sm:w-[130px] h-9 text-xs sm:text-sm flex-shrink-0">
              <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Themes</SelectItem>
              <SelectItem value="adventure">Adventure</SelectItem>
              <SelectItem value="cultural">Cultural</SelectItem>
              <SelectItem value="leisure">Leisure</SelectItem>
              <SelectItem value="educational">Educational</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.duration} onValueChange={(v) => update("duration", v)}>
            <SelectTrigger className="w-[110px] sm:w-[130px] h-9 text-xs sm:text-sm flex-shrink-0">
              <SelectValue placeholder="Duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Duration</SelectItem>
              <SelectItem value="short">1–3 Days</SelectItem>
              <SelectItem value="medium">4–7 Days</SelectItem>
              <SelectItem value="long">8+ Days</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.budget} onValueChange={(v) => update("budget", v)}>
            <SelectTrigger className="w-[110px] sm:w-[130px] h-9 text-xs sm:text-sm flex-shrink-0">
              <SelectValue placeholder="Budget" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Budget</SelectItem>
              <SelectItem value="budget">Under ₹20K</SelectItem>
              <SelectItem value="mid">₹20K – ₹50K</SelectItem>
              <SelectItem value="premium">₹50K+</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.season} onValueChange={(v) => update("season", v)}>
            <SelectTrigger className="w-[110px] sm:w-[120px] h-9 text-xs sm:text-sm flex-shrink-0">
              <SelectValue placeholder="Season" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Season</SelectItem>
              <SelectItem value="winter">Winter (Oct-Mar)</SelectItem>
              <SelectItem value="spring">Spring (Mar-Apr)</SelectItem>
              <SelectItem value="summer">Summer (Apr-May)</SelectItem>
              <SelectItem value="monsoon">Monsoon (Jun-Sep)</SelectItem>
            </SelectContent>
          </Select>

          {isActive && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onChange({ destination: "all", theme: "all", duration: "all", budget: "all", season: "all" })}
              className="flex-shrink-0 text-xs h-9"
            >
              <X className="h-3 w-3 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>
    </div>
  );
});

TravelFiltersBar.displayName = "TravelFiltersBar";

export default TravelFiltersBar;
