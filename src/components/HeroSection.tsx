
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
    "مرحبا!",
    "你好!",
    "Olá!",
    "Shwmae!",
    "Γεια σας!",
    "Merhaba!",
    "Sawubona!",
    "Hej!",
    "Kumusta!",
    "Saluton!"
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

  // Function to handle date input clicks - opens the calendar
  const handleDateInputClick = (inputRef: HTMLInputElement | null) => {
    if (inputRef) {
      inputRef.showPicker?.();
    }
  };

  return (
    <>
      <section id="home" className="relative min-h-screen flex flex-col px-3 sm:px-4 pt-14 sm:pt-16 pb-6 sm:pb-8 bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden">
        {/* Enhanced Background with improved brightness and saturation */}
        <div className="absolute inset-0">
          <img 
            src="https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/image-assets/Hero/DJI_20250324_105854_074.jpg"
            alt="Hero Background"
            className="w-full h-full object-cover opacity-60 transition-transform duration-1000 hover:scale-105 brightness-125 saturate-150 contrast-110"
            loading="eager"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-gray-900/30 to-black/50"></div>
          {/* Floating particles effect */}
          <div className="absolute inset-0">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-white/20 to-gray-300/20 rounded-full animate-bounce shadow-lg"
                style={{
                  left: `${15 + i * 12}%`,
                  top: `${25 + i * 8}%`,
                  animationDelay: `${i * 0.4}s`,
                  animationDuration: `${2.5 + i * 0.3}s`
                }}
              />
            ))}
          </div>
        </div>

        <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col min-h-[calc(100vh-120px)]">
          {/* Tagline - Top Center */}
          <div className="text-center mt-4 sm:mt-6 mb-8">
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white font-playfair drop-shadow-2xl">
              Live the Shillong Vibe
            </h2>
          </div>

          {/* Hero Text - Center */}
          <div className="text-center flex-1 flex flex-col justify-center mb-8">
            <div className="mb-6 sm:mb-8">
              <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white font-cormorant drop-shadow-2xl transition-all duration-700 ease-in-out transform hover:scale-110">
                {helloMessages[currentHelloIndex]}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white font-josefin drop-shadow-2xl transition-all duration-300 hover:scale-105">
              XTSY
            </h1>
          </div>

          {/* Booking Form - Bottom aligned and mobile optimized */}
          <div className="bg-white/95 backdrop-blur-sm border border-gray-300 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-2xl max-w-full sm:max-w-3xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 items-end">
              <div className="space-y-1 sm:space-y-2">
                <label className="text-xs font-bold text-black flex items-center gap-1 sm:gap-2 font-seasons">
                  <Calendar className="h-3 w-3" />
                  CHECK-IN
                </label>
                <div className="relative">
                  <Input
                    type="date"
                    value={checkIn}
                    min={today}
                    onChange={(e) => setCheckIn(e.target.value)}
                    onClick={(e) => handleDateInputClick(e.target as HTMLInputElement)}
                    className="bg-white border-gray-300 text-black placeholder-gray-600 h-8 sm:h-10 text-xs sm:text-sm font-semibold rounded-lg cursor-pointer"
                  />
                </div>
              </div>
              
              <div className="space-y-1 sm:space-y-2">
                <label className="text-xs font-bold text-black flex items-center gap-1 sm:gap-2 font-seasons">
                  <Calendar className="h-3 w-3" />
                  CHECK-OUT
                </label>
                <div className="relative">
                  <Input
                    type="date"
                    value={checkOut}
                    min={checkIn ? (new Date(new Date(checkIn).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]) : tomorrowStr}
                    onChange={(e) => setCheckOut(e.target.value)}
                    onClick={(e) => handleDateInputClick(e.target as HTMLInputElement)}
                    className="bg-white border-gray-300 text-black placeholder-gray-600 h-8 sm:h-10 text-xs sm:text-sm font-semibold rounded-lg cursor-pointer"
                  />
                </div>
              </div>
              
              <div className="space-y-1 sm:space-y-2">
                <label className="text-xs font-bold text-black flex items-center gap-1 sm:gap-2 font-seasons">
                  <Users className="h-3 w-3" />
                  GUESTS
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full px-2 sm:px-3 py-2 h-8 sm:h-10 bg-white border-2 border-gray-300 rounded-lg text-black text-xs sm:text-sm font-semibold cursor-pointer"
                >
                  {Array.from({length: 25}, (_, i) => i + 1).map(num => (
                    <option key={num} value={num} className="bg-white text-black font-semibold">{num}</option>
                  ))}
                </select>
              </div>
              
              <Button 
                onClick={handleSearch}
                className="h-8 sm:h-10 bg-black hover:bg-gray-800 text-white font-bold text-xs sm:text-sm px-4 sm:px-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 rounded-lg font-seasons mt-2 sm:mt-0"
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
