/**
 * HeroSection - Clean, lightweight hero with location dropdown, guest stepper
 * Shows inline property cards after "Check Availability" click
 */

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Search, ChevronDown, Sparkles, MapPin, Minus, Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useMediaQuery } from "@/hooks/use-mobile";
import { useHappyGuestsContext } from "@/contexts/HappyGuestsContext";
import { cn } from "@/lib/utils";
import { getLocationOptions, getPropertiesByLocation, Property } from "@/data/properties";
import { PropertyCardCompact } from "@/components/property/PropertyCardCompact";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const HeroSection = () => {
  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState(new Date().toISOString().split('T')[0]);
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(4);
  const [location, setLocation] = useState("shillong");
  const [currentLanguageIndex, setCurrentLanguageIndex] = useState(0);
  const [averageRating, setAverageRating] = useState(4.9);
  const [showProperties, setShowProperties] = useState(false);
  const [availableProperties, setAvailableProperties] = useState<Property[]>([]);
  const heroRef = useRef<HTMLDivElement>(null);
  const propertySectionRef = useRef<HTMLDivElement>(null);

  const { happyGuestsCount, incrementHappyGuests } = useHappyGuestsContext();
  const isMobile = useMediaQuery('(max-width: 767px)');
  
  const locationOptions = getLocationOptions();

  const languages = ["Hello", "नमस्ते", "হ্যালো", "Hola", "Bonjour", "Hallo", "Ciao", "こんにちは", "안녕하세요", "Olá", "Привет", "مرحبا"];

  // Language rotation
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    
    const delay = isMobile ? 8000 : 5000;
    const languageInterval = setInterval(() => {
      if (document.hidden) return;
      setCurrentLanguageIndex(prev => (prev + 1) % languages.length);
    }, delay);
    return () => clearInterval(languageInterval);
  }, [languages.length, isMobile]);

  // Fetch average rating
  useEffect(() => {
    const fetchAverageRating = async () => {
      try {
        const cachedRating = sessionStorage.getItem('averageRating');
        const cacheTime = sessionStorage.getItem('averageRatingTime');
        const fiveMinutes = 5 * 60 * 1000;
        if (cachedRating && cacheTime && (Date.now() - parseInt(cacheTime)) < fiveMinutes) {
          setAverageRating(Number(cachedRating));
          return;
        }

        const { data: reviews, error } = await supabase
          .from('reviews')
          .select('rating')
          .limit(100);

        if (!error && reviews && reviews.length > 0) {
          const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
          const avgRating = totalRating / reviews.length;
          const finalRating = Number(avgRating.toFixed(1));
          setAverageRating(finalRating);
          sessionStorage.setItem('averageRating', finalRating.toString());
          sessionStorage.setItem('averageRatingTime', Date.now().toString());
        }
      } catch (err) {
        console.error('Error fetching rating:', err);
      }
    };

    const timeoutId = setTimeout(fetchAverageRating, 100);
    return () => clearTimeout(timeoutId);
  }, []);

  const handleSearch = () => {
    console.log('[HeroSection] handleSearch triggered');
    
    // Anti-spam cooldown
    const COOLDOWN_MS = 1500;
    const LAST_KEY = 'xtsy_hg_last_inc';
    const now = Date.now();
    const last = Number(localStorage.getItem(LAST_KEY) || 0);
    if (now - last >= COOLDOWN_MS) {
      try { incrementHappyGuests(); } catch (_) {}
      localStorage.setItem(LAST_KEY, String(now));
    }

    // Validate fields
    if (!checkIn || !checkOut || !location) {
      alert("Please fill in all search fields");
      return;
    }
    if (checkIn === checkOut) {
      alert("Check-out date cannot be the same as check-in date.");
      return;
    }
    if (guests > 20) {
      alert("For more than 20 guests, please use B2B Corporate Booking or Group Booking options available below.");
      const el = document.querySelector('#group-booking-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    // Store search params in sessionStorage
    sessionStorage.setItem('xtsy_search_params', JSON.stringify({
      location,
      checkIn,
      checkOut,
      guests,
    }));

    // Get properties for location and show inline
    const properties = getPropertiesByLocation(location);
    setAvailableProperties(properties);
    setShowProperties(true);

    // Scroll to property section after a short delay
    setTimeout(() => {
      propertySectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleViewDetails = (property: Property) => {
    // Navigate to property detail page
    navigate(`/properties/${property.id}`);
  };

  const scrollToContent = () => {
    const roomsSection = document.querySelector('#rooms-section');
    if (roomsSection) {
      roomsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleGuestIncrement = () => {
    if (guests < 20) setGuests(guests + 1);
  };

  const handleGuestDecrement = () => {
    if (guests > 1) setGuests(guests - 1);
  };

  const stats = [
    { value: `${3000 + happyGuestsCount}+`, label: 'Happy Guests', gradient: 'from-primary to-orange-400' },
    { value: '30+', label: 'Tour Packages', gradient: 'from-rose-400 to-pink-500' },
    { value: averageRating.toString(), label: 'Guest Reviews', gradient: 'from-amber-400 to-orange-500' },
    { value: '24/7', label: 'Travel Support', gradient: 'from-emerald-400 to-teal-500' },
  ];

  return (
    <>
      <section 
        ref={heroRef}
        id="home" 
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
      >
        {/* Static Background Elements - no transforms */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/15 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
        </div>

        {/* Main Content - no transforms */}
        <div className="relative z-10 text-center text-white w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 pt-4 md:pt-0">
          {/* Language Greeting & Symbol */}
          <div className="mb-6 sm:mb-10 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-white/70">Premium Stays in Northeast India</span>
            </div>

            <div className="relative h-16 flex items-center justify-center mb-4">
              <span className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent transition-opacity duration-500">
                {languages[currentLanguageIndex]}
              </span>
            </div>

            {/* LCP ELEMENT - Brand Symbol - matches skeleton for instant swap */}
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <img
                  src="/lovable-uploads/8059ea95-b64d-4eba-8b12-52e002c59567.png"
                  alt="XTSY Brand Symbol"
                  className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 object-contain drop-shadow-2xl"
                  loading="eager"
                  decoding="sync"
                  // @ts-expect-error - React 18.3 uses fetchPriority
                  fetchpriority="high"
                  width={128}
                  height={128}
                  // Dimensions match skeleton for zero layout shift
                  style={{ aspectRatio: '1/1' }}
                />
                <div className="absolute -inset-4 bg-primary/20 rounded-full blur-2xl -z-10" />
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-orange-400 to-rose-400 bg-clip-text text-transparent mb-4">
              Live the XTSY Vibe
            </h1>
          </div>

          {/* Search Card - Fixed size container */}
          <div className={cn(
            "max-w-md mx-auto rounded-3xl p-6 border shadow-2xl animate-fade-in",
            "bg-white/5 backdrop-blur-2xl border-white/10",
            "ring-1 ring-inset ring-white/5"
          )}
          style={{ animationDelay: '0.2s' }}
          >
            <h2 className="text-lg sm:text-xl font-semibold mb-6 text-white/90">
              Find Your Perfect Stay
            </h2>

            <div className="space-y-4 mb-6">
              {/* Location Dropdown */}
              <div className="space-y-2">
                <label className="block text-xs sm:text-sm font-medium text-white/60 text-center">Location</label>
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger className={cn(
                    "w-full h-12 rounded-xl",
                    "bg-white/5 border-white/10 text-white",
                    "focus:ring-1 focus:ring-primary/30"
                  )}>
                    <div className="flex items-center justify-center gap-2 w-full">
                      <MapPin className="w-4 h-4 text-white/40" />
                      <SelectValue placeholder="Select location" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10">
                    {locationOptions.map((opt) => (
                      <SelectItem 
                        key={opt.value} 
                        value={opt.value}
                        className="text-white hover:bg-white/10 focus:bg-white/10"
                      >
                        <div className="flex flex-col items-center text-center">
                          <span>{opt.label}</span>
                          <span className="text-xs text-white/50">{opt.sublabel}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Check-in */}
              <div className="space-y-2">
                <label className="block text-xs sm:text-sm font-medium text-white/60 text-center">Check-in</label>
                <div className="relative group flex items-center justify-center">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 group-focus-within:text-primary transition-colors z-10" />
                  <Input
                    type="date"
                    value={checkIn}
                    onChange={e => setCheckIn(e.target.value)}
                    className={cn(
                      "pl-10 pr-10 h-12 rounded-xl transition-all text-center",
                      "bg-white/5 border-white/10 text-white placeholder-white/40",
                      "focus:bg-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/30",
                      "[&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-50"
                    )}
                    min={new Date().toISOString().split('T')[0]}
                    style={{ colorScheme: 'dark' }}
                  />
                </div>
              </div>

              {/* Check-out */}
              <div className="space-y-2">
                <label className="block text-xs sm:text-sm font-medium text-white/60 text-center">Check-out</label>
                <div className="relative group flex items-center justify-center">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 group-focus-within:text-primary transition-colors z-10" />
                  <Input
                    type="date"
                    value={checkOut}
                    onChange={e => setCheckOut(e.target.value)}
                    className={cn(
                      "pl-10 pr-10 h-12 rounded-xl transition-all text-center",
                      "bg-white/5 border-white/10 text-white placeholder-white/40",
                      "focus:bg-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/30",
                      "[&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-50"
                    )}
                    min={checkIn ? new Date(new Date(checkIn).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] : undefined}
                    style={{ colorScheme: 'dark' }}
                  />
                </div>
              </div>

              {/* Guests - Modern +/- Stepper */}
              <div className="space-y-2">
                <label className="block text-xs sm:text-sm font-medium text-white/60 text-center">Guests</label>
                <div className={cn(
                  "flex items-center justify-center gap-4",
                  "bg-white/5 border border-white/10 rounded-xl h-12 px-3"
                )}>
                  <Users className="w-4 h-4 text-white/40" />
                  <button
                    onClick={handleGuestDecrement}
                    disabled={guests <= 1}
                    className={cn(
                      "w-9 h-9 rounded-full flex items-center justify-center transition-all",
                      guests > 1
                        ? "bg-white/10 hover:bg-white/20 text-white active:scale-95"
                        : "bg-white/5 text-white/20 cursor-not-allowed"
                    )}
                    aria-label="Decrease guests"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-lg font-bold text-white tabular-nums min-w-[2rem] text-center">
                    {guests}
                  </span>
                  <button
                    onClick={handleGuestIncrement}
                    disabled={guests >= 20}
                    className={cn(
                      "w-9 h-9 rounded-full flex items-center justify-center transition-all",
                      guests < 20
                        ? "bg-white/10 hover:bg-white/20 text-white active:scale-95"
                        : "bg-white/5 text-white/20 cursor-not-allowed"
                    )}
                    aria-label="Increase guests"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Search Button */}
              <Button
                onClick={handleSearch}
                className={cn(
                  "w-full h-12 rounded-xl font-semibold transition-all",
                  "bg-gradient-to-r from-primary to-orange-500",
                  "hover:from-primary/90 hover:to-orange-500/90",
                  "hover:shadow-lg hover:shadow-primary/25",
                  "active:scale-[0.98]"
                )}
              >
                <Search className="mr-2 h-4 w-4" />
                Check Availability
              </Button>
            </div>

            <div className="flex items-center justify-center gap-4 text-xs text-white/40">
              <span className="flex items-center gap-1">🏨 2 Properties</span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span className="flex items-center gap-1">🌟 Premium Amenities</span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span className="flex items-center gap-1">🎯 Best Rates</span>
            </div>
          </div>

          {/* Stats - no transforms */}
          <div className="mt-10 sm:mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-3xl mx-auto">
            {stats.map((stat, index) => (
              <div 
                key={stat.label}
                className="text-center p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/5 hover:bg-white/10 transition-colors animate-fade-in"
                style={{ animationDelay: `${0.3 + index * 0.1}s` }}
              >
                <div className={cn("text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent", stat.gradient)}>
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-white/50 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Scroll indicator */}
          <button
            onClick={scrollToContent}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 hover:text-white/70 transition-colors animate-bounce"
            aria-label="Scroll to content"
          >
            <ChevronDown className="w-6 h-6" />
          </button>
        </div>
      </section>

      {/* Inline Property Cards Section */}
      <AnimatePresence>
        {showProperties && availableProperties.length > 0 && (
          <motion.section
            ref={propertySectionRef}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12 px-4"
          >
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
              >
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  Available Properties
                </h2>
                <p className="text-white/60">
                  {availableProperties.length} properties in {location.charAt(0).toUpperCase() + location.slice(1)}
                </p>
              </motion.div>

              {/* Property Cards Grid - Stack on mobile, 2 cols on tablet/desktop */}
              <div className="flex flex-col gap-6 sm:grid sm:grid-cols-2 lg:gap-8">
                {availableProperties.map((property, index) => (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="w-full"
                  >
                    <PropertyCardCompact
                      property={property}
                      onViewDetails={handleViewDetails}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
};

export default HeroSection;
