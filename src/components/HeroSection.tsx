import { useState, useEffect } from "react";
import { Calendar, Users, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import EnhancedBookingModal from "./EnhancedBookingModal";
const HeroSection = () => {
  const [checkIn, setCheckIn] = useState(new Date().toISOString().split('T')[0]);
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("4");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [currentLanguageIndex, setCurrentLanguageIndex] = useState(0);
  const [bookNowClicks, setBookNowClicks] = useState(551);
  const [averageRating, setAverageRating] = useState(4.9);
  const [tourCount, setTourCount] = useState<number>(45);

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
  useEffect(() => {
    const handleReopenBookingModal = (event: any) => {
      const bookingData = event.detail;
      if (bookingData && bookingData.checkIn && bookingData.checkOut) {
        setCheckIn(bookingData.checkIn);
        setCheckOut(bookingData.checkOut);
        setGuests(bookingData.guests?.toString() || "4");
        setIsBookingModalOpen(true);
      }
    };
    window.addEventListener('reopenBookingModal', handleReopenBookingModal);
    return () => window.removeEventListener('reopenBookingModal', handleReopenBookingModal);
  }, []);
  useEffect(() => {
    const languageInterval = setInterval(() => {
      setCurrentLanguageIndex(prev => (prev + 1) % languages.length);
    }, 2000);
    return () => clearInterval(languageInterval);
  }, [languages.length]);
  useEffect(() => {
    // Load click count from localStorage on component mount
    const savedClicks = localStorage.getItem('bookNowClicks');
    if (savedClicks) {
      setBookNowClicks(parseInt(savedClicks, 10));
    }
  }, []);

  useEffect(() => {
    // Fetch reviews and calculate average rating
    const fetchAverageRating = async () => {
      try {
        const { data: reviews, error } = await supabase
          .from('reviews')
          .select('rating');
        
        if (error) {
          console.error('Error fetching reviews:', error);
          return;
        }
        
        if (reviews && reviews.length > 0) {
          const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
          const avgRating = totalRating / reviews.length;
          setAverageRating(Number(avgRating.toFixed(1)));
        }
      } catch (error) {
        console.error('Error calculating average rating:', error);
      }
    };

    fetchAverageRating();
  }, []);

  useEffect(() => {
    // Calculate total domestic tour packages count from static data
    const calculateTourCount = () => {
      // Static count based on the organized tour packages structure
      const packageCounts = {
        'XTSY Exclusives': 7,
        'Meghalaya': 5,
        'Northeast States': 8,
        'Uttarakhand': 6,
        'Sikkim': 5,
        'Himachal Pradesh': 5,
        'Kerala': 5,
        'Tamil Nadu': 4
      };
      
      const totalCount = Object.values(packageCounts).reduce((sum, count) => sum + count, 0);
      setTourCount(totalCount);
    };

    calculateTourCount();
  }, []);
  const handleBookNowClick = () => {
    const newCount = bookNowClicks + 1;
    setBookNowClicks(newCount);
    localStorage.setItem('bookNowClicks', newCount.toString());
    setIsBookingModalOpen(true);
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
        <div className="responsive-container relative z-10 text-center text-white w-full">
          {/* Hero Text with Floating Languages */}
          <div className="mb-8 sm:mb-10 md:mb-12 lg:mb-16 mt-4 sm:mt-6 md:mt-8 lg:mt-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-8 sm:mb-10 md:mb-12 lg:mb-16 bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent animate-fade-in">Live the XTSY Vibe</h1>
            
            {/* Floating Languages Section */}
            <div className="relative h-20 sm:h-24 md:h-28 lg:h-36 flex flex-col items-center justify-center">
              <div className="relative h-8 sm:h-10 md:h-14 lg:h-18 flex items-center justify-center mb-4 sm:mb-5 md:mb-6 lg:mb-8">
                <span key={currentLanguageIndex} className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white animate-fade-in transition-opacity duration-500">
                  {languages[currentLanguageIndex]}
                </span>
              </div>
              
              <div className="flex items-center justify-center">
                <img src="/lovable-uploads/8059ea95-b64d-4eba-8b12-52e002c59567.png" alt="XTSY Brand Symbol" className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-32 lg:h-32 object-contain" />
              </div>
            </div>
          </div>

          {/* Search Form - Enhanced with luxury design and improved mobile alignment */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-7 lg:p-8 border border-white/20 shadow-2xl animate-fade-in w-full max-w-4xl mx-auto" style={{
          animationDelay: '0.9s'
        }}>
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4 sm:mb-6 md:mb-7 lg:mb-8 text-center">Find Your Perfect Stay</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6 mb-4 sm:mb-6 md:mb-7 lg:mb-8">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-200">Check-in</label>
                <div className="relative cursor-pointer" onClick={() => document.getElementById('checkin-input')?.focus()}>
                  <Input id="checkin-input" type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} className="pl-10 h-10 sm:h-12 bg-white/20 border-white/30 text-white placeholder-gray-300 text-sm sm:text-base cursor-pointer date-input-mobile" min={new Date().toISOString().split('T')[0]} style={{
                  WebkitAppearance: 'none',
                  MozAppearance: 'textfield',
                  colorScheme: 'dark'
                }} />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-300 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-200">Check-out</label>
                <div className="relative cursor-pointer" onClick={() => document.getElementById('checkout-input')?.focus()}>
                  <Input id="checkout-input" type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} className="pl-10 h-10 sm:h-12 bg-white/20 border-white/30 text-white placeholder-gray-300 text-sm sm:text-base cursor-pointer date-input-mobile" min={checkIn ? new Date(new Date(checkIn).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] : new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]} placeholder="dd-mm-yyyy" style={{
                  WebkitAppearance: 'none',
                  MozAppearance: 'textfield',
                  colorScheme: 'dark'
                }} />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-300 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-200">Total Guests</label>
                <div className="relative">
                  <Input type="number" value={guests} onChange={e => setGuests(e.target.value)} min="1" max="20" className="pl-10 h-10 sm:h-12 bg-white/20 border-white/30 text-white placeholder-gray-300 text-sm sm:text-base" placeholder="4" />
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-300" />
                </div>
              </div>

              <div className="flex items-end col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-1">
                <Button onClick={handleSearch} className="w-full h-10 sm:h-12 md:h-12 lg:h-12 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base hover-lift">
                  <Search className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Book Your Stay
                </Button>
              </div>
            </div>

            <div className="text-center text-xs sm:text-sm text-gray-300">
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
              <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text text-transparent">{tourCount}+</div>
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

      <EnhancedBookingModal isOpen={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} initialData={{
      checkIn,
      checkOut,
      guests: parseInt(guests) || 1
    }} />
    </>;
};
export default HeroSection;