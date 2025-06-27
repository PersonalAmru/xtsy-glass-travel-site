
import { useState, useEffect } from "react";
import { Calendar, Users, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const HeroSection = () => {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("1");
  const [currentHelloIndex, setCurrentHelloIndex] = useState(0);

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

  return (
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
        {/* Hero Text - Centered with floating Hello */}
        <div className="text-center mb-8">
          <div className="mb-4">
            <span className="text-4xl md:text-6xl font-bold text-white transition-all duration-500 ease-in-out transform">
              {helloMessages[currentHelloIndex]}
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
            XTSY
          </h1>
        </div>

        {/* Booking Form - Bottom Aligned, No Background Blur */}
        <div className="bg-white/20 border border-white/30 rounded-2xl p-6 backdrop-blur-none shadow-xl max-w-5xl mx-auto">
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
                className="bg-white/30 border-white/40 text-white placeholder-gray-200 h-12 text-black"
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
                className="bg-white/30 border-white/40 text-white placeholder-gray-200 h-12 text-black"
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
                className="w-full px-4 py-3 h-12 bg-white/30 border border-white/40 rounded-md text-black"
              >
                {[1,2,3,4,5,6,7,8].map(num => (
                  <option key={num} value={num} className="bg-white text-black">{num}</option>
                ))}
              </select>
            </div>
            
            <Button className="h-12 bg-gradient-to-r from-orange-500/80 to-red-600/80 hover:from-orange-600/90 hover:to-red-700/90 text-white font-semibold text-lg px-8 border border-white/20 backdrop-blur-sm">
              <Search className="h-5 w-5 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
