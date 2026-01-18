/**
 * HeroSection - Apple-grade scroll-expand hero with glassmorphic calendar
 * Redesigned with premium animations and modern design
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { Calendar, Users, Search, ChevronDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import { useMediaQuery } from "@/hooks/use-mobile";
import { useHappyGuestsContext } from "@/contexts/HappyGuestsContext";
import { useUserAuth } from "@/contexts/UserAuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import BookingModal from "@/components/BookingModal";

const HeroSection = () => {
  const navigate = useNavigate();
  const { user } = useUserAuth();
  const [checkIn, setCheckIn] = useState(new Date().toISOString().split('T')[0]);
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("4");
  const [currentLanguageIndex, setCurrentLanguageIndex] = useState(0);
  const [averageRating, setAverageRating] = useState(4.9);
  const [tourCount, setTourCount] = useState<number>(22);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  // Removed scroll-based fade transforms - hero stays visible

  // Supabase-backed counter (deduplicated via context)
  const { happyGuestsCount, incrementHappyGuests, isLoading: happyGuestsLoading } = useHappyGuestsContext();

  // Responsive helpers
  const isMobile = useMediaQuery('(max-width: 767px)');
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  // Languages
  const languages = ["Hello", "नमस्ते", "হ্যালো", "Hola", "Bonjour", "Hallo", "Ciao", "こんにちは", "안녕하세요", "Olá", "Привет", "مرحبا"];

  // Language rotation - slower on mobile, pauses when hidden, respects reduced motion
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

        if (error) {
          setAverageRating(4.9);
          return;
        }

        if (reviews && reviews.length > 0) {
          const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
          const avgRating = totalRating / reviews.length;
          const finalRating = Number(avgRating.toFixed(1));
          setAverageRating(finalRating);
          sessionStorage.setItem('averageRating', finalRating.toString());
          sessionStorage.setItem('averageRatingTime', Date.now().toString());
        } else {
          setAverageRating(4.9);
        }
      } catch (err) {
        setAverageRating(4.9);
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
    if (!checkIn || !checkOut || !guests) {
      console.log('[HeroSection] Validation failed: missing fields', { checkIn, checkOut, guests });
      alert("Please fill in all search fields");
      return;
    }
    if (checkIn === checkOut) {
      console.log('[HeroSection] Validation failed: same dates');
      alert("Check-out date cannot be the same as check-in date. Please select a different date.");
      return;
    }
    const guestCount = parseInt(guests);
    if (guestCount > 20) {
      console.log('[HeroSection] Too many guests:', guestCount);
      alert("For more than 20 guests, please use B2B Corporate Booking or Group Booking options available below.");
      const el = document.querySelector('#group-booking-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    // Open booking modal directly - no login required
    console.log('[HeroSection] Opening booking modal');
    setBookingModalOpen(true);
  };

  const scrollToContent = () => {
    const roomsSection = document.querySelector('#rooms-section');
    if (roomsSection) {
      roomsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <section 
        ref={heroRef}
        id="home" 
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Gradient orbs */}
          <motion.div 
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px]"
            animate={{ 
              x: [0, 30, 0], 
              y: [0, -20, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/15 rounded-full blur-[100px]"
            animate={{ 
              x: [0, -20, 0], 
              y: [0, 30, 0],
              scale: [1, 1.15, 1]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute top-1/2 right-1/3 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px]"
            animate={{ 
              x: [0, 40, 0], 
              y: [0, -30, 0]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
        </div>

        {/* Main Content */}
        <div 
          className="relative z-10 text-center text-white w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 pt-20 md:pt-0"
        >
          {/* Language Greeting & Symbol */}
          <motion.div 
            className="mb-8 sm:mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-white/70">Premium Stays in Northeast India</span>
            </motion.div>

            <div className="relative h-16 flex items-center justify-center mb-4">
              <AnimatePresence mode="wait">
                <motion.span 
                  key={currentLanguageIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent"
                >
                  {languages[currentLanguageIndex]}
                </motion.span>
              </AnimatePresence>
            </div>

            {/* LCP ELEMENT - Brand Symbol */}
            <motion.div 
              className="flex items-center justify-center mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
            >
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
                />
                <div className="absolute -inset-4 bg-primary/20 rounded-full blur-2xl -z-10" />
              </div>
            </motion.div>

            <motion.h1 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-orange-400 to-rose-400 bg-clip-text text-transparent mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              Live the XTSY Vibe
            </motion.h1>
          </motion.div>

          {/* Glassmorphic Search Card */}
          <motion.div 
            className={cn(
              "max-w-4xl mx-auto rounded-3xl p-6 sm:p-8 border shadow-2xl",
              "bg-white/5 backdrop-blur-2xl border-white/10",
              "ring-1 ring-inset ring-white/5"
            )}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, type: "spring" }}
          >
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-6 text-white/90">
              Find Your Perfect Stay
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Check-in */}
              <div className="space-y-2">
                <label className="block text-xs sm:text-sm font-medium text-white/60">Check-in</label>
                <div className="relative group">
                  <Input
                    type="date"
                    value={checkIn}
                    onChange={e => setCheckIn(e.target.value)}
                    className={cn(
                      "pl-10 h-12 rounded-xl transition-all",
                      "bg-white/5 border-white/10 text-white placeholder-white/40",
                      "focus:bg-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/30",
                      "[&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-50"
                    )}
                    min={new Date().toISOString().split('T')[0]}
                    style={{ colorScheme: 'dark' }}
                  />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40 group-focus-within:text-primary transition-colors" />
                </div>
              </div>

              {/* Check-out */}
              <div className="space-y-2">
                <label className="block text-xs sm:text-sm font-medium text-white/60">Check-out</label>
                <div className="relative group">
                  <Input
                    type="date"
                    value={checkOut}
                    onChange={e => setCheckOut(e.target.value)}
                    className={cn(
                      "pl-10 h-12 rounded-xl transition-all",
                      "bg-white/5 border-white/10 text-white placeholder-white/40",
                      "focus:bg-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/30",
                      "[&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-50"
                    )}
                    min={checkIn ? new Date(new Date(checkIn).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] : undefined}
                    style={{ colorScheme: 'dark' }}
                  />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40 group-focus-within:text-primary transition-colors" />
                </div>
              </div>

              {/* Guests */}
              <div className="space-y-2">
                <label className="block text-xs sm:text-sm font-medium text-white/60">Guests</label>
                <div className="relative group">
                  <Input
                    type="number"
                    value={guests}
                    onChange={e => setGuests(e.target.value)}
                    min="1"
                    max="20"
                    className={cn(
                      "pl-10 h-12 rounded-xl transition-all",
                      "bg-white/5 border-white/10 text-white placeholder-white/40",
                      "focus:bg-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
                    )}
                    placeholder="4"
                  />
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40 group-focus-within:text-primary transition-colors" />
                </div>
              </div>

              {/* Search Button */}
              <div className="flex items-end col-span-1 sm:col-span-2 lg:col-span-1">
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
            </div>

            <div className="flex items-center justify-center gap-4 text-xs text-white/40">
              <span className="flex items-center gap-1">🏨 3 Property Types</span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span className="flex items-center gap-1">🌟 Premium Amenities</span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span className="flex items-center gap-1">🎯 Best Rates</span>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div 
            className="mt-10 sm:mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
          >
            {[
              { value: `${3000 + happyGuestsCount}+`, label: 'Happy Guests', gradient: 'from-primary to-orange-400' },
              { value: '30+', label: 'Tour Packages', gradient: 'from-rose-400 to-pink-500' },
              { value: averageRating.toString(), label: 'Guest Reviews', gradient: 'from-amber-400 to-orange-500' },
              { value: '24/7', label: 'Travel Support', gradient: 'from-emerald-400 to-teal-500' },
            ].map((stat, index) => (
              <motion.div 
                key={stat.label}
                className="text-center p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.1 }}
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.08)' }}
              >
                <div className={cn("text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent", stat.gradient)}>
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-white/50 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Scroll indicator */}
          <motion.button
            onClick={scrollToContent}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 hover:text-white/70 transition-colors"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 8, 0] }}
            transition={{ delay: 1.5, y: { duration: 2, repeat: Infinity } }}
          >
            <ChevronDown className="w-6 h-6" />
          </motion.button>
        </div>
      </section>

      {/* Booking Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        initialCheckIn={checkIn ? new Date(checkIn) : undefined}
        initialCheckOut={checkOut ? new Date(checkOut) : undefined}
        initialGuests={parseInt(guests) || 1}
      />
    </>
  );
};

export default HeroSection;
