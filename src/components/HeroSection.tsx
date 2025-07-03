
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Users, ChevronDown } from "lucide-react";
import BookingModal from "./BookingModal";

const HeroSection = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  const handleSearch = () => {
    if (!checkIn || !checkOut) {
      alert("Please select check-in and check-out dates");
      return;
    }
    setIsBookingOpen(true);
  };

  const scrollToBooking = () => {
    const bookingSection = document.getElementById('booking-calendar');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Multiple greetings in English
  const greetings = [
    "Hello", "Welcome", "Greetings", "Hi there", "Good day", 
    "Salutations", "Howdy", "Hey", "Good morning", "Welcome friends"
  ];

  return (
    <>
      <section id="home" className="relative min-h-screen flex items-center justify-center text-white overflow-hidden">
        {/* Enhanced Background Image with better brightness and contrast */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/image-assets/Header/Color%20logo%20-%20no%20background.png')`,
            filter: 'brightness(1.4) contrast(1.2) saturate(1.3)',
          }}
        />
        
        {/* Optimized overlay for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/50" />
        
        {/* Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl">
          {/* Animated Greeting */}
          <div className="mb-4 sm:mb-6">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-seasons text-white drop-shadow-lg animate-pulse">
              {greetings[Math.floor(Math.random() * greetings.length)]}!
            </h2>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight mb-4 sm:mb-6 font-serif-sans">
            <span className="block text-white drop-shadow-2xl">Live the</span>
            <span className="block bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg">
              Shillong Vibe
            </span>
          </h1>

          <div className="mb-8 sm:mb-12">
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold font-seasons text-white drop-shadow-lg">
              XTSY
            </p>
          </div>

          {/* Search Form */}
          <div id="booking-calendar" className="bg-white/95 backdrop-blur-md p-4 sm:p-6 lg:p-8 rounded-2xl shadow-2xl max-w-4xl mx-auto border border-white/20">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {/* Check-in */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  <Calendar className="h-4 w-4 mr-2 text-orange-500" />
                  Check-in
                </label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                  placeholder="dd-mm-yyyy"
                />
              </div>

              {/* Check-out */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  <Calendar className="h-4 w-4 mr-2 text-orange-500" />
                  Check-out
                </label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  min={checkIn || new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                  placeholder="dd-mm-yyyy"
                />
              </div>

              {/* Guests */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  <Users className="h-4 w-4 mr-2 text-orange-500" />
                  Guests
                </label>
                <div className="relative">
                  <select
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value))}
                    className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white transition-all duration-200"
                  >
                    {Array.from({length: 25}, (_, i) => i + 1).map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Search Button */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-transparent">Search</label>
                <Button
                  onClick={handleSearch}
                  className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold text-lg rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  Search
                </Button>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="mt-8 sm:mt-12">
            <Button
              onClick={scrollToBooking}
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-8 py-4 text-lg font-bold rounded-full shadow-2xl hover:shadow-orange-500/25 transform hover:scale-105 transition-all duration-300"
            >
              Book Your Stay
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-8 w-8 text-white opacity-70" />
        </div>
      </section>

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        checkIn={checkIn}
        checkOut={checkOut}
        guests={guests}
      />
    </>
  );
};

export default HeroSection;
