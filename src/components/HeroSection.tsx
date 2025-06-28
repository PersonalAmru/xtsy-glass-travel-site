
import { useState, useEffect } from "react";
import { Calendar, Users, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BookingModal from "./BookingModal";

const HeroSection = () => {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("1");
  const [currentHelloIndex, setCurrentHelloIndex] = useState(0);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const helloMessages = [
    "Hello!",
    "¡Hola!",
    "Bonjour!",
    "Hallo!",
    "Ciao!",
    "こんにちは!",
    "안녕하세요!",
    "Привет!",
    "नमस्ते!",
    "مرحبا!"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHelloIndex((prev) => (prev + 1) % helloMessages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = () => {
    if (checkIn && checkOut && guests) {
      setIsBookingModalOpen(true);
    } else {
      alert("Please fill in all booking details");
    }
  };

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  
  // Get tomorrow's date for minimum checkout
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  return (
    <>
      <section id="home" className="relative min-h-screen flex flex-col justify-between px-3 sm:px-4 pt-14 sm:pt-16 pb-6 sm:pb-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
        {/* Enhanced Background with animations */}
        <div className="absolute inset-0">
          <img 
            src="https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/image-assets/Hero/DJI_20250324_105854_074.jpg"
            alt="Hero Background"
            className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/30 via-orange-400/25 to-red-400/30 backdrop-blur-[0.5px]"></div>
          {/* Floating particles effect */}
          <div className="absolute inset-0">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-yellow-400/40 to-orange-400/40 rounded-full animate-bounce shadow-lg"
                style={{
                  left: `${15 + i * 12}%`,
                  top: `${25 + i * 8}%`,
                  animationDelay: `${i * 0.4}s`,
                  animationDuration: `${2.5 + i * 0.3}s`
                }}
              />
            ))}
          </div>
          {/* Tropical leaves effect */}
          <div className="absolute inset-0 opacity-20">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="absolute w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-400/60 to-emerald-500/60 rounded-full blur-xl animate-pulse"
                style={{
                  right: `${10 + i * 20}%`,
                  bottom: `${20 + i * 15}%`,
                  animationDelay: `${i * 0.8}s`,
                  animationDuration: `${4 + i * 0.5}s`
                }}
              />
            ))}
          </div>
        </div>

        <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col justify-between min-h-[calc(100vh-120px)]">
          {/* Tagline - Top Center with Wildera font */}
          <div className="text-center mt-4 sm:mt-8">
            <h2 
              className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent animate-pulse font-wildera px-4"
            >
              Live the Shillong Vibe
            </h2>
          </div>

          {/* Hero Text - Center */}
          <div className="text-center flex-1 flex flex-col justify-center">
            <div className="mb-3 sm:mb-4">
              <span 
                className="text-xl sm:text-2xl md:text-3xl font-bold text-white transition-all duration-700 ease-in-out transform hover:scale-110 font-safira" 
                style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.5)' }}
              >
                {helloMessages[currentHelloIndex]}
              </span>
            </div>
            <h1 
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 bg-gradient-to-r from-teal-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-pulse font-serif-sans px-4" 
              style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.3)' }}
            >
              XTSY
            </h1>
          </div>

          {/* Booking Form - Bottom aligned and mobile optimized */}
          <div className="bg-gradient-to-r from-orange-500/20 to-red-600/20 border border-orange-400/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-2xl max-w-full sm:max-w-3xl mx-auto backdrop-blur-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 items-end">
              <div className="space-y-1 sm:space-y-2">
                <label className="text-xs font-bold text-white flex items-center gap-1 sm:gap-2 font-seasons">
                  <Calendar className="h-3 w-3" />
                  CHECK-IN
                </label>
                <Input
                  type="date"
                  value={checkIn}
                  min={today}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="bg-white/95 border-orange-300/60 text-black placeholder-gray-600 h-8 sm:h-10 text-xs sm:text-sm font-semibold rounded-lg"
                />
              </div>
              
              <div className="space-y-1 sm:space-y-2">
                <label className="text-xs font-bold text-white flex items-center gap-1 sm:gap-2 font-seasons">
                  <Calendar className="h-3 w-3" />
                  CHECK-OUT
                </label>
                <Input
                  type="date"
                  value={checkOut}
                  min={checkIn ? (new Date(new Date(checkIn).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]) : tomorrowStr}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="bg-white/95 border-orange-300/60 text-black placeholder-gray-600 h-8 sm:h-10 text-xs sm:text-sm font-semibold rounded-lg"
                />
              </div>
              
              <div className="space-y-1 sm:space-y-2">
                <label className="text-xs font-bold text-white flex items-center gap-1 sm:gap-2 font-seasons">
                  <Users className="h-3 w-3" />
                  GUESTS
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full px-2 sm:px-3 py-2 h-8 sm:h-10 bg-white/95 border-2 border-orange-300/60 rounded-lg text-black text-xs sm:text-sm font-semibold"
                >
                  {Array.from({length: 50}, (_, i) => i + 1).map(num => (
                    <option key={num} value={num} className="bg-white text-black font-semibold">{num}</option>
                  ))}
                </select>
              </div>
              
              <Button 
                onClick={handleSearch}
                className="h-8 sm:h-10 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold text-xs sm:text-sm px-4 sm:px-6 border-2 border-orange-400/70 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 rounded-lg font-seasons mt-2 sm:mt-0"
              >
                <Search className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      <BookingModal 
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        checkIn={checkIn}
        checkOut={checkOut}
        guests={parseInt(guests)}
      />
    </>
  );
};

export default HeroSection;
