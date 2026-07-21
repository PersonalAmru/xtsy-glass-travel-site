/**
 * HeroSection - Clean, lightweight hero with modern booking form
 * Navigates to dedicated search results page on "Check Availability"
 * Integrated with GTM tracking for conversion optimization
 */

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { SearchHintBar } from "@/components/SearchHintBar";
import { supabase } from "@/integrations/supabase/client";
import { useMediaQuery } from "@/hooks/use-mobile";
import { useHappyGuestsContext } from "@/contexts/HappyGuestsContext";
import { cn } from "@/lib/utils";
import { formatLocalDateString } from "@/lib/date-utils";
import { getLocationOptions } from "@/data/properties";
import { ModernBookingForm } from "@/components/ui/modern-booking-form";
import { useComponentTracking } from "@/hooks/useComponentTracking";
import { useConversionSignalsContext } from "@/providers/ConversionSignalsProvider";
const HeroSection = () => {
  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState<Date | undefined>(new Date());
  const [checkOut, setCheckOut] = useState<Date | undefined>(undefined);
  const [guests, setGuests] = useState(4);
  const [location, setLocation] = useState("shillong");
  const [currentLanguageIndex, setCurrentLanguageIndex] = useState(0);
  const [averageRating, setAverageRating] = useState(4.9);
  const heroRef = useRef<HTMLDivElement>(null);
  

  const { happyGuestsCount, incrementHappyGuests } = useHappyGuestsContext();
  const isMobile = useMediaQuery('(max-width: 767px)');
  
  // GTM Tracking
  const { trackCTA, trackButton, trackFormSubmit } = useComponentTracking({ section: 'hero' });
  const { trackSearchAvailability } = useConversionSignalsContext();
  
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

  // Fetch average rating - deferred to avoid blocking initial render
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

    // Use requestIdleCallback to defer non-critical fetch
    if ('requestIdleCallback' in window) {
      const idleId = requestIdleCallback(() => fetchAverageRating(), { timeout: 3000 });
      return () => cancelIdleCallback(idleId);
    } else {
      const timeoutId = setTimeout(fetchAverageRating, 1500);
      return () => clearTimeout(timeoutId);
    }
  }, []);

  const handleSearch = () => {
    console.log('[HeroSection] handleSearch triggered');
    
    // Track CTA click
    trackCTA('check_availability', {
      location,
      guests,
      has_dates: Boolean(checkIn && checkOut),
    });
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
    
    // Use local date formatting to prevent timezone offset issues
    const checkInStr = formatLocalDateString(checkIn);
    const checkOutStr = formatLocalDateString(checkOut);
    
    if (checkInStr === checkOutStr) {
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
      checkIn: checkInStr,
      checkOut: checkOutStr,
      guests,
    }));
    
    // Track successful form submit
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    trackFormSubmit('booking_search', {
      location,
      nights,
      guests,
    });

    // Fire search_availability GTM event
    trackSearchAvailability({
      property_id: location,
      checkin_date: checkInStr,
      checkout_date: checkOutStr,
      guests,
      nights,
      estimated_revenue: nights * guests * 300, // Avg estimate
    });

    // Navigate to booking flow with search params
    const searchParams = new URLSearchParams({
      location,
      checkIn: checkInStr,
      checkOut: checkOutStr,
      guests: guests.toString(),
    });
    navigate(`/book/select?${searchParams.toString()}`);
  };

  const scrollToContent = () => {
    trackButton('scroll_to_rooms');
    const roomsSection = document.querySelector('#rooms-section');
    if (roomsSection) {
      roomsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Guest increment/decrement handlers - unused, handled by ModernBookingForm

  const stats = [
    { value: `${10786 + happyGuestsCount}+`, label: 'Happy Guests', gradient: 'from-primary to-orange-400' },
    { value: '30+', label: 'Tour Packages', gradient: 'from-rose-400 to-pink-500' },
    { value: '4.8', label: 'Guest Reviews', gradient: 'from-amber-400 to-orange-500' },
    { value: '24/7', label: 'Travel Support', gradient: 'from-emerald-400 to-teal-500' },
  ];

  return (
    <section 
        ref={heroRef}
        id="home" 
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-card to-background"
      >
        {/* Background layers */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none hero-mountain-decoration">
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
        </div>

        {/* Main Content - no transforms */}
        <div className="relative z-10 text-center text-white w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 pt-4 md:pt-0">
          {/* Language Greeting & Symbol */}
          <div className="mb-6 sm:mb-10">
            <SearchHintBar />

            <div className="relative h-16 flex items-center justify-center mb-4">
              <span className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent transition-opacity duration-500">
                {languages[currentLanguageIndex]}
              </span>
            </div>

            {/* LCP ELEMENT - Brand Symbol - optimized for sub-3s LCP */}
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32">
                <picture>
                  <source srcSet="/lovable-uploads/8059ea95-b64d-4eba-8b12-52e002c59567.avif" type="image/avif" />
                  <source srcSet="/lovable-uploads/8059ea95-b64d-4eba-8b12-52e002c59567.webp" type="image/webp" />
                  <img
                    src="/lovable-uploads/8059ea95-b64d-4eba-8b12-52e002c59567.png"
                    alt="XTSY Brand Symbol"
                    className="w-full h-full object-contain"
                    loading="eager"
                    decoding="sync"
                    fetchPriority="high"
                    width={128}
                    height={128}
                  />
                </picture>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-orange-400 to-rose-400 bg-clip-text text-transparent mb-4">
              Live the XTSY Vibe
            </h1>
          </div>

          {/* Modern Booking Form */}
          <ModernBookingForm
            locationOptions={locationOptions}
            location={location}
            onLocationChange={setLocation}
            checkIn={checkIn}
            onCheckInChange={setCheckIn}
            checkOut={checkOut}
            onCheckOutChange={setCheckOut}
            guests={guests}
            onGuestsChange={setGuests}
            onSubmit={handleSearch}
            className="animate-fade-in"
          />
          
          {/* Trust microcopy */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-white/70 text-xs">
            <span className="flex items-center gap-1.5">✓ Best price guaranteed</span>
            <span className="flex items-center gap-1.5">✓ Free WiFi</span>
            <span className="flex items-center gap-1.5">✓ Travel desk</span>
            <span className="flex items-center gap-1.5">✓ Community vibes</span>
          </div>

          {/* Stats - no transforms */}
          {/* Stats - no backdrop-blur for performance */}
          <div className="mt-10 sm:mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-3xl mx-auto">
            {stats.map((stat) => (
              <div 
                key={stat.label}
                className="text-center p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
              >
                <div className={cn("text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent", stat.gradient)}>
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-white/70 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Scroll indicator */}
          <button
            onClick={scrollToContent}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70 hover:text-white transition-colors animate-bounce"
            aria-label="Scroll to content"
          >
            <ChevronDown className="w-6 h-6" />
          </button>
        </div>
    </section>
  );
};

export default HeroSection;
