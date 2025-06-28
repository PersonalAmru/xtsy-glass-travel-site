
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

  return (
    <>
      <section id="home" className="relative min-h-screen flex flex-col justify-end px-4 pt-16 pb-12 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/image-assets/Hero/DJI_20250324_105854_074.jpg"
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-slate-800/40 to-slate-900/60"></div>
        </div>

        <div className="relative z-10 w-full max-w-6xl mx-auto">
          {/* Hero Text - Centered with floating Hello and modern fonts */}
          <div className="text-center mb-8">
            <div className="mb-6">
              <span className="text-5xl md:text-7xl font-bold text-white transition-all duration-700 ease-in-out transform hover:scale-110" style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif", textShadow: '2px 2px 8px rgba(0,0,0,0.5)' }}>
                {helloMessages[currentHelloIndex]}
              </span>
            </div>
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 bg-gradient-to-r from-teal-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-pulse" style={{ fontFamily: "'Playfair Display', 'Georgia', serif", textShadow: '2px 2px 8px rgba(0,0,0,0.3)' }}>
              XTSY
            </h1>
          </div>

          {/* Booking Form - Bottom Aligned, Simple without background blur */}
          <div className="bg-gradient-to-r from-orange-500/30 to-red-600/30 border-2 border-orange-400/50 rounded-3xl p-8 shadow-2xl max-w-5xl mx-auto backdrop-blur-sm">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
              <div className="space-y-3">
                <label className="text-sm font-bold text-white flex items-center gap-2 font-['Inter']">
                  <Calendar className="h-5 w-5" />
                  CHECK-IN
                </label>
                <Input
                  type="date"
                  value={checkIn}
                  min={today}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="bg-white/95 border-orange-300/60 text-black placeholder-gray-600 h-14 text-lg font-semibold rounded-xl"
                />
              </div>
              
              <div className="space-y-3">
                <label className="text-sm font-bold text-white flex items-center gap-2 font-['Inter']">
                  <Calendar className="h-5 w-5" />
                  CHECK-OUT
                </label>
                <Input
                  type="date"
                  value={checkOut}
                  min={checkIn || today}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="bg-white/95 border-orange-300/60 text-black placeholder-gray-600 h-14 text-lg font-semibold rounded-xl"
                />
              </div>
              
              <div className="space-y-3">
                <label className="text-sm font-bold text-white flex items-center gap-2 font-['Inter']">
                  <Users className="h-5 w-5" />
                  GUESTS
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full px-4 py-4 h-14 bg-white/95 border-2 border-orange-300/60 rounded-xl text-black text-lg font-semibold"
                >
                  {Array.from({length: 50}, (_, i) => i + 1).map(num => (
                    <option key={num} value={num} className="bg-white text-black font-semibold">{num}</option>
                  ))}
                </select>
              </div>
              
              <Button 
                onClick={handleSearch}
                className="h-14 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold text-xl px-10 border-3 border-orange-400/70 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 rounded-xl"
              >
                <Search className="h-6 w-6 mr-3" />
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
