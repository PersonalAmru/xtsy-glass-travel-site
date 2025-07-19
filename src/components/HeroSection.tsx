

import { useState, useEffect } from "react";
import { Calendar, Users, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import EnhancedBookingModal from "./EnhancedBookingModal";

const HeroSection = () => {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

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

  const handleSearch = () => {
    if (!checkIn || !checkOut || !guests) {
      alert("Please fill in all search fields");
      return;
    }
    setIsBookingModalOpen(true);
  };

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/lovable-uploads/6a7b3dad-87a3-49d9-98fa-919ff7b09dd0.png')",
          }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="floating-element absolute top-1/4 left-1/4 w-64 h-64 bg-orange-500/10 rounded-full blur-xl animate-pulse"></div>
          <div className="floating-element absolute top-3/4 right-1/4 w-48 h-48 bg-red-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="floating-element absolute bottom-1/4 left-1/3 w-32 h-32 bg-yellow-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          {/* Hero Text */}
          <div className="mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent animate-fade-in">
              XTSY Travellers Hostel
            </h1>
            <p className="text-xl sm:text-2xl lg:text-3xl mb-4 opacity-90 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              Hello XTSY • नमस्ते XTSY • হ্যালো XTSY • Hola XTSY • Bonjour XTSY
            </p>
            <p className="text-lg sm:text-xl mb-8 opacity-80 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.6s' }}>
              أهلاً XTSY • こんにちは XTSY • 안녕하세요 XTSY • Ciao XTSY • Привет XTSY
            </p>
          </div>

          {/* Search Form */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl animate-fade-in" style={{ animationDelay: '0.9s' }}>
            <h2 className="text-2xl font-semibold mb-6 text-center">Find Your Perfect Stay</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-200">Check-in</label>
                <div className="relative">
                  <Input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="pl-10 bg-white/20 border-white/30 text-white placeholder-gray-300"
                    min={new Date().toISOString().split('T')[0]}
                  />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-300" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-200">Check-out</label>
                <div className="relative">
                  <Input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="pl-10 bg-white/20 border-white/30 text-white placeholder-gray-300"
                    min={checkIn || new Date().toISOString().split('T')[0]}
                  />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-300" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-200">Guests</label>
                <div className="relative">
                  <Input
                    type="number"
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    min="1"
                    max="20"
                    className="pl-10 bg-white/20 border-white/30 text-white placeholder-gray-300"
                    placeholder="2"
                  />
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-300" />
                </div>
              </div>

              <div className="flex items-end">
                <Button
                  onClick={handleSearch}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <Search className="mr-2 h-4 w-4" />
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
      />
    </>
  );
};

export default HeroSection;

