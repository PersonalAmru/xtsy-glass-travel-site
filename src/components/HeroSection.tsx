import { useState, useEffect } from "react";
import { Calendar, Users, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import EnhancedBookingModal from "./EnhancedBookingModal";

const HeroSection = () => {
  const [checkIn, setCheckIn] = useState(new Date().toISOString().split('T')[0]);
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [currentLanguageIndex, setCurrentLanguageIndex] = useState(0);

  const languages = ["Hello", "नमस्ते", "হ্যালো", "Hola", "こんにちは"];

  useEffect(() => {
    const interval = setInterval(() => {
      const elements = document.querySelectorAll('.floating-element');
      elements.forEach((element, index) => {
        const randomX = Math.random() * 20 - 10;
        const randomY = Math.random() * 20 - 10;
        (element as HTMLElement).style.transform = `translate(${randomX}px, ${randomY}px)`;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const languageInterval = setInterval(() => {
      setCurrentLanguageIndex((prev) => (prev + 1) % languages.length);
    }, 2000);

    return () => clearInterval(languageInterval);
  }, [languages.length]);

  const handleSearch = () => {
    if (!checkIn || !checkOut || !guests) {
      alert("Please fill in all search fields");
      return;
    }
    
    // Validate checkout date is not same as checkin
    if (checkIn === checkOut) {
      alert("Check-out date cannot be the same as check-in date. Please select a different date.");
      return;
    }

    const guestCount = parseInt(guests);
    if (guestCount > 25) {
      alert("For more than 25 guests, please use B2B Corporate Booking or Group Booking options available below.");
      // Scroll to group booking section
      const groupBookingElement = document.querySelector('#group-booking-section');
      if (groupBookingElement) {
        groupBookingElement.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }
    
    setIsBookingModalOpen(true);
  };

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900">
        {/* Background Image with Overlay - Ready for Supabase URL */}
        {/* 
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('SUPABASE_IMAGE_URL_HERE')",
          }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        */}

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="floating-element absolute top-1/4 left-1/4 w-64 h-64 bg-orange-500/10 rounded-full blur-xl animate-pulse"></div>
          <div className="floating-element absolute top-3/4 right-1/4 w-48 h-48 bg-red-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="floating-element absolute bottom-1/4 left-1/3 w-32 h-32 bg-yellow-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          {/* Hero Text with Floating Languages */}
          <div className="mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-12 bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent animate-fade-in">
              Live the Shillong Vibe
            </h1>
            
            {/* Floating Languages Section */}
            <div className="relative h-32 flex flex-col items-center justify-center">
              {/* Animated Language Text */}
              <div className="relative h-16 flex items-center justify-center mb-4">
                <span 
                  key={currentLanguageIndex}
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white animate-fade-in transition-opacity duration-500"
                >
                  {languages[currentLanguageIndex]}
                </span>
              </div>
              
              {/* Fixed XTSY Text */}
              <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-orange-400">
                XTSY
              </div>
            </div>
          </div>

          {/* Search Form */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl animate-fade-in max-w-5xl mx-auto" style={{ animationDelay: '0.9s' }}>
            <h2 className="text-2xl font-semibold mb-8 text-center">Find Your Perfect Stay</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-200">Check-in</label>
                <div className="relative">
                  <Input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="pl-12 h-12 bg-white/20 border-white/30 text-white placeholder-gray-300 text-base"
                    min={new Date().toISOString().split('T')[0]}
                  />
                  <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-300" />
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-200">Check-out</label>
                <div className="relative">
                  <Input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="pl-12 h-12 bg-white/20 border-white/30 text-white placeholder-gray-300 text-base"
                    min={checkIn ? new Date(new Date(checkIn).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] : new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                    placeholder="dd-mm-yyyy"
                  />
                  <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-300" />
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-200">Guests</label>
                <div className="relative">
                  <Input
                    type="number"
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    min="1"
                    max="25"
                    className="pl-12 h-12 bg-white/20 border-white/30 text-white placeholder-gray-300 text-base"
                    placeholder="2"
                  />
                  <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-300" />
                </div>
              </div>

              <div className="flex items-end">
                <Button
                  onClick={handleSearch}
                  className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg text-base"
                >
                  <Search className="mr-2 h-5 w-5" />
                  Search Rooms
                </Button>
              </div>
            </div>

            <div className="text-center text-sm text-gray-300">
              <p>🏨 3 Room Types Available • 🌟 Premium Amenities • 🎯 Best Rates Guaranteed</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 animate-fade-in" style={{ animationDelay: '1.2s' }}>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400">500+</div>
              <div className="text-sm text-gray-300">Happy Guests</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-400">50+</div>
              <div className="text-sm text-gray-300">Adventure Tours</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">4.8</div>
              <div className="text-sm text-gray-300">Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">24/7</div>
              <div className="text-sm text-gray-300">Support</div>
            </div>
          </div>
        </div>
      </section>

      <EnhancedBookingModal 
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        initialData={{
          checkIn,
          checkOut,
          guests: parseInt(guests) || 1
        }}
      />
    </>
  );
};

export default HeroSection;
