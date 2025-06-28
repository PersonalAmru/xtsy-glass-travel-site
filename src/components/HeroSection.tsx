
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

  return (
    <>
      <section id="home" className="relative min-h-screen flex flex-col justify-end px-4 pt-16 pb-12">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/image-assets/Hero/DJI_20250324_105854_074.jpg"
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-900/40"></div>
        </div>

        <div className="relative z-10 w-full max-w-6xl mx-auto">
          {/* Hero Text - Centered with floating Hello and modern fonts */}
          <div className="text-center mb-8">
            <div className="mb-4">
              <span className="text-4xl md:text-6xl font-bold text-white transition-all duration-500 ease-in-out transform" style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif" }}>
                {helloMessages[currentHelloIndex]}
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent" style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}>
              XTSY
            </h1>
          </div>

          {/* Booking Form - Bottom Aligned, Simple without background blur */}
          <div className="bg-gradient-to-r from-orange-500/20 to-red-600/20 border border-orange-400/30 rounded-2xl p-6 shadow-xl max-w-5xl mx-auto backdrop-blur-none">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  CHECK-IN
                </label>
                <Input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="bg-white/90 border-orange-300/40 text-black placeholder-gray-600 h-12"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-white flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  CHECK-OUT
                </label>
                <Input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="bg-white/90 border-orange-300/40 text-black placeholder-gray-600 h-12"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-white flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  GUESTS
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full px-4 py-3 h-12 bg-white/90 border border-orange-300/40 rounded-md text-black"
                >
                  {Array.from({length: 50}, (_, i) => i + 1).map(num => (
                    <option key={num} value={num} className="bg-white text-black">{num}</option>
                  ))}
                </select>
              </div>
              
              <Button 
                onClick={handleSearch}
                className="h-12 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold text-lg px-8 border-2 border-orange-400/50 shadow-lg hover:shadow-xl transition-all duration-300"
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
