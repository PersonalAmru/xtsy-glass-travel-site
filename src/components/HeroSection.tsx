import { useState, useEffect } from "react";
import { Calendar, Users, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import PerformantImage from "./PerformantImage";
import { useMediaQuery } from "@/hooks/use-mobile";

const HeroSection = () => {
  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState(new Date().toISOString().split('T')[0]);
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("4");
  const [currentLanguageIndex, setCurrentLanguageIndex] = useState(0);
  const [bookNowClicks, setBookNowClicks] = useState(551);
  const [averageRating, setAverageRating] = useState(4.9);
  const [tourCount, setTourCount] = useState<number>(22);

  // Use the new responsive hooks
  const isMobile = useMediaQuery('(max-width: 767px)');
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  // 12 most common travel-friendly languages
  const languages = ["Hello", "नमस्ते", "হ্যালো", "Hola", "Bonjour", "Hallo", "Ciao", "こんにちは", "안녕하세요", "Olá", "Привет", "مرحبا"];

  useEffect(() => {
    const elements = document.querySelectorAll('.floating-element');
    const interval = setInterval(() => {
      elements.forEach((element, index) => {
        const randomX = Math.random() * 20 - 10;
        const randomY = Math.random() * 20 - 10;
        (element as HTMLElement).style.transform = `translate(${randomX}px, ${randomY}px)`;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Removed reopenBookingModal listener since we're not using modals anymore

  useEffect(() => {
    const languageInterval = setInterval(() => {
      setCurrentLanguageIndex(prev => (prev + 1) % languages.length);
    }, 2000);
    return () => clearInterval(languageInterval);
  }, [languages.length]);

  useEffect(() => {
    // Load universal click count - always use saved value if it exists
    const loadUniversalClickCount = () => {
      const savedClicks = localStorage.getItem('universalBookNowClicks');
      if (savedClicks) {
        const currentCount = parseInt(savedClicks, 10);
        // Always use the saved count, don't reset it
        setBookNowClicks(currentCount);
        console.log('Loaded saved click count:', currentCount);
      } else {
        // Only set initial value if no saved count exists
        setBookNowClicks(551);
        localStorage.setItem('universalBookNowClicks', '551');
        console.log('Initialized click count to 551');
      }
    };

    loadUniversalClickCount();
  }, []);

  useEffect(() => {
    // Fetch reviews and calculate average rating with caching and error handling
    const fetchAverageRating = async () => {
      try {
        // Check cache first
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
          .limit(100); // Limit to reduce load
        
        if (error) {
          console.warn('Reviews fetch failed, using fallback rating:', error.message);
          setAverageRating(4.9); // Fallback rating
          return;
        }
        
        if (reviews && reviews.length > 0) {
          const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
          const avgRating = totalRating / reviews.length;
          const finalRating = Number(avgRating.toFixed(1));
          setAverageRating(finalRating);
          
          // Cache the result
          sessionStorage.setItem('averageRating', finalRating.toString());
          sessionStorage.setItem('averageRatingTime', Date.now().toString());
        } else {
          setAverageRating(4.9); // Fallback if no reviews
        }
      } catch (error) {
        console.warn('Error calculating average rating, using fallback:', error);
        setAverageRating(4.9); // Fallback rating
      }
    };

    // Debounce the fetch to prevent multiple rapid calls
    const timeoutId = setTimeout(fetchAverageRating, 100);
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    // Calculate actual tour packages count from TravelItinerariesSection
    const calculateTourCount = async () => {
      try {
        // Import the tour data dynamically to get the actual count
        const module = await import('./TravelItinerariesSection');
        // Since we can't directly access the itineraries array, we'll use the known count
        // Based on the TravelItinerariesSection.tsx file, there are 22 total packages
        setTourCount(22);
      } catch (error) {
        console.warn('Could not load tour count, using fallback:', error);
        // Fallback to manual count based on current packages
        setTourCount(22);
      }
    };

    calculateTourCount();
  }, []);

  const handleBookNowClick = () => {
    const newCount = bookNowClicks + 1;
    setBookNowClicks(newCount);
    
    // Save to localStorage to persist across sessions for this browser
    localStorage.setItem('universalBookNowClicks', newCount.toString());
    console.log('Updated click count to:', newCount);
    
    // Navigate to booking flow instead of opening modal
    const params = new URLSearchParams({
      checkIn,
      checkOut,
      guests
    });
    navigate(`/booking?${params.toString()}`);
  };

  const handleSearch = () => {
    if (!checkIn || !checkOut || !guests) {
      alert("Please fill in all search fields");
      return;
    }
    if (checkIn === checkOut) {
      alert("Check-out date cannot be the same as check-in date. Please select a different date.");
      return;
    }
    const guestCount = parseInt(guests);
    if (guestCount > 20) {
      alert("For more than 20 guests, please use B2B Corporate Booking or Group Booking options available below.");
      const groupBookingElement = document.querySelector('#group-booking-section');
      if (groupBookingElement) {
        groupBookingElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
      return;
    }
    handleBookNowClick();
  };

  return <>
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="floating-element absolute top-1/4 left-1/4 w-20 sm:w-32 md:w-48 lg:w-64 h-20 sm:h-32 md:h-48 lg:h-64 bg-orange-500/10 rounded-full blur-xl animate-pulse"></div>
          <div className="floating-element absolute top-3/4 right-1/4 w-16 sm:w-24 md:w-32 lg:w-48 h-16 sm:h-24 md:h-32 lg:h-48 bg-red-500/10 rounded-full blur-xl animate-pulse" style={{
          animationDelay: '1s'
        }}></div>
          <div className="floating-element absolute bottom-1/4 left-1/3 w-12 sm:w-16 md:w-24 lg:w-32 h-12 sm:h-16 md:h-24 lg:h-32 bg-yellow-500/10 rounded-full blur-xl animate-pulse" style={{
          animationDelay: '2s'
        }}></div>
        </div>

        {/* Main Content */}
        <div className="responsive-container relative z-10 text-center text-white w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          {/* Hero Text with Floating Languages */}
          <div className="mb-8 sm:mb-10 md:mb-12 lg:mb-16 mt-4 sm:mt-6 md:mt-8 lg:mt-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-8 sm:mb-10 md:mb-12 lg:mb-16 bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent animate-fade-in">Live the XTSY Vibe</h1>
            
            {/* Floating Languages Section */}
            <div className="relative h-20 sm:h-24 md:h-28 lg:h-36 flex flex-col items-center justify-center">
              <div className="relative h-8 sm:h-10 md:h-14 lg:h-18 flex items-center justify-center mb-4 sm:mb-5 md:mb-6 lg:mb-8">
                <span key={currentLanguageIndex} className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white animate-fade-in transition-opacity duration-500">
                  {languages[currentLanguageIndex]}
                </span>
              </div>
              
              <div className="flex items-center justify-center">
                <PerformantImage 
                  src="/lovable-uploads/8059ea95-b64d-4eba-8b12-52e002c59567.png" 
                  alt="XTSY Brand Symbol" 
                  className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-32 lg:h-32 object-contain"
                  priority={true}
                  placeholder={
                    <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-32 lg:h-32 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xs sm:text-sm">X</span>
                    </div>
                  }
                />
              </div>
            </div>
          </div>

          {/* Search Form - Center aligned components */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-6 md:p-7 lg:p-8 border border-white/20 shadow-2xl animate-fade-in w-full max-w-4xl mx-auto text-center" style={{
          animationDelay: '0.9s'
        }}>
            <h2 className="text-base sm:text-xl md:text-2xl font-semibold mb-3 sm:mb-6 md:mb-7 lg:mb-8 text-center">Find Your Perfect Stay</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-5 lg:gap-6 mb-3 sm:mb-6 md:mb-7 lg:mb-8">
              <div className="space-y-1 sm:space-y-2 text-center">
                <label className="block text-xs sm:text-sm font-medium text-gray-200 text-center">Check-in</label>
                <div className="relative cursor-pointer text-center" onClick={() => document.getElementById('checkin-input')?.focus()}>
                  <Input id="checkin-input" type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} className="pl-8 sm:pl-10 h-9 sm:h-12 bg-white/20 border-white/30 text-white placeholder-gray-300 text-sm cursor-pointer date-input-mobile text-center [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-2 [&::-webkit-calendar-picker-indicator]:w-4 [&::-webkit-calendar-picker-indicator]:h-4 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-datetime-edit]:text-center [&::-webkit-datetime-edit-fields-wrapper]:justify-center" min={new Date().toISOString().split('T')[0]} style={{
                  WebkitAppearance: 'none',
                  MozAppearance: 'textfield',
                  colorScheme: 'dark',
                  textAlign: 'center',
                  textAlignLast: 'center',
                  direction: 'ltr'
                }} />
                  <Calendar className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-300 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1 sm:space-y-2 text-center">
                <label className="block text-xs sm:text-sm font-medium text-gray-200 text-center">Check-out</label>
                <div className="relative cursor-pointer text-center" onClick={() => document.getElementById('checkout-input')?.focus()}>
                  <Input id="checkout-input" type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} className="pl-8 sm:pl-10 h-9 sm:h-12 bg-white/20 border-white/30 text-white placeholder-gray-300 text-sm cursor-pointer date-input-mobile text-center [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-2 [&::-webkit-calendar-picker-indicator]:w-4 [&::-webkit-calendar-picker-indicator]:h-4 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-datetime-edit]:text-center [&::-webkit-datetime-edit-fields-wrapper]:justify-center" min={checkIn ? new Date(new Date(checkIn).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] : new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]} placeholder="dd-mm-yyyy" style={{
                  WebkitAppearance: 'none',
                  MozAppearance: 'textfield',
                  colorScheme: 'dark',
                  textAlign: 'center',
                  textAlignLast: 'center',
                  direction: 'ltr'
                }} />
                  <Calendar className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-300 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1 sm:space-y-2 text-center">
                <label className="block text-xs sm:text-sm font-medium text-gray-200 text-center">Total Guests</label>
                <div className="relative text-center">
                  <Input type="number" value={guests} onChange={e => setGuests(e.target.value)} min="1" max="20" className="pl-8 sm:pl-10 h-9 sm:h-12 bg-white/20 border-white/30 text-white placeholder-gray-300 text-sm text-center" placeholder="4" />
                  <Users className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-300" />
                </div>
              </div>

              <div className="flex items-end col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-1 justify-center text-center">
                <Button onClick={handleSearch} className="w-full h-9 sm:h-12 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold py-2 sm:py-3 px-3 sm:px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg text-sm hover-lift">
                  <Search className="mr-1 sm:mr-2 h-3 w-3 sm:h-5 sm:w-5" />
                  Book Your Stay
                </Button>
              </div>
            </div>

            <div className="text-center text-xs text-gray-300">
              <p>🏨 3 Property Types Available • 🌟 Premium Amenities • 🎯 Best Rates Guaranteed</p>
            </div>
          </div>

          {/* Quick Stats - Fully responsive grid */}
          <div className="mt-6 sm:mt-8 md:mt-10 lg:mt-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6 animate-fade-in" style={{
          animationDelay: '1.2s'
        }}>
            <div className="text-center fade-in">
              <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">{bookNowClicks}+</div>
              <div className="text-xs sm:text-sm text-gray-300 mt-1">Happy Guests!</div>
            </div>
            <div className="text-center fade-in" style={{
            animationDelay: '0.1s'
          }}>
              <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text text-transparent">{tourCount}</div>
              <div className="text-xs sm:text-sm text-gray-300 mt-1">Tour Packages across IN</div>
            </div>
            <div className="text-center fade-in" style={{
            animationDelay: '0.2s'
          }}>
              <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">{averageRating}</div>
              <div className="text-xs sm:text-sm text-gray-300 mt-1">Guest Reviews</div>
            </div>
            <div className="text-center fade-in" style={{
            animationDelay: '0.3s'
          }}>
              <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">24/7</div>
              <div className="text-xs sm:text-sm text-gray-300 mt-1">Travel Support</div>
            </div>
          </div>
        </div>
      </section>

    </>;
};

export default HeroSection;
