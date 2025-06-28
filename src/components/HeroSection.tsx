
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
      <section id="home" className="relative min-h-screen flex flex-col justify-end px-4 pt-16 pb-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
        {/* Enhanced Background with animations */}
        <div className="absolute inset-0">
          <img 
            src="https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/image-assets/Hero/DJI_20250324_105854_074.jpg"
            alt="Hero Background"
            className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/70 via-slate-800/50 to-slate-900/70 animate-pulse"></div>
          {/* Floating particles effect */}
          <div className="absolute inset-0">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white/20 rounded-full animate-bounce"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${30 + i * 10}%`,
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: `${2 + i * 0.3}s`
                }}
              />
            ))}
          </div>
        </div>

        <div className="relative z-10 w-full max-w-6xl mx-auto">
          {/* Tagline - Top Center */}
          <div className="text-center mb-8">
            <h2 
              className="text-2xl md:text-3xl font-bold text-white mb-8 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent animate-pulse"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Live the Shillong Vibe
            </h2>
          </div>

          {/* Hero Text - Smaller and centered */}
          <div className="text-center mb-12">
            <div className="mb-4">
              <span 
                className="text-3xl md:text-4xl font-bold text-white transition-all duration-700 ease-in-out transform hover:scale-110" 
                style={{ fontFamily: "'Josefin Sans', sans-serif", textShadow: '2px 2px 8px rgba(0,0,0,0.5)' }}
              >
                {helloMessages[currentHelloIndex]}
              </span>
            </div>
            <h1 
              className="text-5xl md:text-6xl font-bold text-white mb-6 bg-gradient-to-r from-teal-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-pulse" 
              style={{ fontFamily: "'Cormorant Garmond', serif", textShadow: '2px 2px 8px rgba(0,0,0,0.3)' }}
            >
              XTSY
            </h1>
          </div>

          {/* Booking Form - Smaller and bottom aligned */}
          <div className="bg-gradient-to-r from-orange-500/20 to-red-600/20 border border-orange-400/30 rounded-2xl p-6 shadow-2xl max-w-4xl mx-auto backdrop-blur-sm">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="space-y-2">
                <label className="text-xs font-bold text-white flex items-center gap-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                  <Calendar className="h-4 w-4" />
                  CHECK-IN
                </label>
                <Input
                  type="date"
                  value={checkIn}
                  min={today}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="bg-white/95 border-orange-300/60 text-black placeholder-gray-600 h-12 text-sm font-semibold rounded-lg"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-white flex items-center gap-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                  <Calendar className="h-4 w-4" />
                  CHECK-OUT
                </label>
                <Input
                  type="date"
                  value={checkOut}
                  min={checkIn ? (new Date(new Date(checkIn).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]) : tomorrowStr}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="bg-white/95 border-orange-300/60 text-black placeholder-gray-600 h-12 text-sm font-semibold rounded-lg"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-white flex items-center gap-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                  <Users className="h-4 w-4" />
                  GUESTS
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full px-3 py-3 h-12 bg-white/95 border-2 border-orange-300/60 rounded-lg text-black text-sm font-semibold"
                >
                  {Array.from({length: 50}, (_, i) => i + 1).map(num => (
                    <option key={num} value={num} className="bg-white text-black font-semibold">{num}</option>
                  ))}
                </select>
              </div>
              
              <Button 
                onClick={handleSearch}
                className="h-12 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold text-lg px-8 border-2 border-orange-400/70 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 rounded-lg"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                <Search className="h-5 w-5 mr-2" />
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
