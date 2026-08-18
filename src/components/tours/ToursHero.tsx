import { useState } from "react";
import { useNavigate } from "@/lib/router-compat";
import { Search, MapPin, Clock, Calendar, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import heroImg from "@/assets/tours-hero-mountains.jpg";
import hero900 from "@/assets/tours-hero-mountains-900.webp";
import hero1600 from "@/assets/tours-hero-mountains-1600.webp";

const DESTINATIONS = [
  { value: "all", label: "All Destinations" },
  { value: "Meghalaya", label: "Meghalaya" },
  { value: "Nagaland", label: "Nagaland" },
  { value: "Assam", label: "Assam" },
  { value: "Arunachal Pradesh", label: "Arunachal Pradesh" },
  { value: "Sikkim", label: "Sikkim" },
  { value: "Manipur", label: "Manipur" },
  { value: "Mizoram", label: "Mizoram" },
  { value: "Tripura", label: "Tripura" },
];

const DURATIONS = [
  { value: "all", label: "Any Duration" },
  { value: "short", label: "1–3 Days" },
  { value: "medium", label: "4–6 Days" },
  { value: "long", label: "7–10 Days" },
  { value: "extended", label: "10+ Days" },
];

const MONTHS = [
  { value: "all", label: "Any Month" },
  { value: "jan", label: "January" },
  { value: "feb", label: "February" },
  { value: "mar", label: "March" },
  { value: "apr", label: "April" },
  { value: "oct", label: "October" },
  { value: "nov", label: "November" },
  { value: "dec", label: "December" },
];

const BUDGETS = [
  { value: "all", label: "Any Budget" },
  { value: "budget", label: "Under ₹15,000" },
  { value: "mid", label: "₹15,000 – ₹35,000" },
  { value: "premium", label: "₹35,000+" },
];

interface SearchFilters {
  destination: string;
  duration: string;
  month: string;
  budget: string;
}

interface ToursHeroProps {
  onSearch: (filters: SearchFilters) => void;
}

const ToursHero = ({ onSearch }: ToursHeroProps) => {
  const [filters, setFilters] = useState<SearchFilters>({
    destination: "all",
    duration: "all",
    month: "all",
    budget: "all",
  });

  const update = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <section className="relative min-h-[520px] sm:min-h-[600px] flex items-center overflow-hidden">
      {/* Background */}
      <img
        src={heroImg}
        srcSet={`${hero900} 900w, ${hero1600} 1600w, ${heroImg} 1920w`}
        sizes="100vw"
        alt="Mountains and pine forests of Northeast India under starry skies"
        className="absolute inset-0 w-full h-full object-cover"
        fetchPriority="high"
        loading="eager"
        decoding="sync"
        width={1920}
        height={1080}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-16 sm:py-24">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs sm:text-sm font-medium text-white/90 tracking-wide">XTSY Travel — Curated Experiences</span>
        </div>

        {/* Headline */}
        <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-[1.1] max-w-3xl">
          Explore the Hidden Wonders of{" "}
          <span className="bg-gradient-to-r from-emerald-400 via-amber-300 to-orange-400 bg-clip-text text-transparent">
            North East India
          </span>
        </h1>

        {/* Subtext */}
        <p className="text-base sm:text-lg text-white/75 max-w-2xl mb-10 leading-relaxed">
          Curated travel experiences, stargazing stays, and authentic cultural journeys across the Eastern Himalayas.
        </p>

        {/* Search Bar */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-3 sm:p-4 max-w-4xl">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-3">
            {/* Destination */}
            <div className="space-y-1">
              <label className="text-[10px] sm:text-xs text-white/60 font-medium uppercase tracking-wider flex items-center gap-1">
                <MapPin className="h-3 w-3" /> Destination
              </label>
              <Select value={filters.destination} onValueChange={v => update("destination", v)}>
                <SelectTrigger className="h-10 bg-white/10 border-white/20 text-white text-sm hover:bg-white/15">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DESTINATIONS.map(d => (
                    <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Duration */}
            <div className="space-y-1">
              <label className="text-[10px] sm:text-xs text-white/60 font-medium uppercase tracking-wider flex items-center gap-1">
                <Clock className="h-3 w-3" /> Duration
              </label>
              <Select value={filters.duration} onValueChange={v => update("duration", v)}>
                <SelectTrigger className="h-10 bg-white/10 border-white/20 text-white text-sm hover:bg-white/15">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DURATIONS.map(d => (
                    <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Month */}
            <div className="space-y-1">
              <label className="text-[10px] sm:text-xs text-white/60 font-medium uppercase tracking-wider flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Travel Month
              </label>
              <Select value={filters.month} onValueChange={v => update("month", v)}>
                <SelectTrigger className="h-10 bg-white/10 border-white/20 text-white text-sm hover:bg-white/15">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map(d => (
                    <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Budget */}
            <div className="space-y-1">
              <label className="text-[10px] sm:text-xs text-white/60 font-medium uppercase tracking-wider flex items-center gap-1">
                <Wallet className="h-3 w-3" /> Budget
              </label>
              <Select value={filters.budget} onValueChange={v => update("budget", v)}>
                <SelectTrigger className="h-10 bg-white/10 border-white/20 text-white text-sm hover:bg-white/15">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BUDGETS.map(d => (
                    <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={() => onSearch(filters)}
            className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-semibold px-8 py-2.5 rounded-xl shadow-lg shadow-emerald-500/25"
          >
            <Search className="h-4 w-4 mr-2" />
            Explore Tours
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ToursHero;
