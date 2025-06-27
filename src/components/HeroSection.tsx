
import { useState } from "react";
import { Calendar, Users, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

const HeroSection = () => {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("1");

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center px-4 pt-16">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/image-assets/Hero/DJI_20250324_105854_074.jpg"
          alt="Hero Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-900/60"></div>
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto">
        {/* Main Hero Card */}
        <Card className="backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl">
          <CardContent className="p-8 md:p-12">
            {/* Hero Text */}
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
                Adventure Awaits at XTSY
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8">
                Book villa quickly & safely
              </p>
              <p className="text-lg text-gray-400">
                Check villas for the best vacation near the sea
              </p>
            </div>

            {/* Compact Booking Form */}
            <Card className="backdrop-blur-md bg-white/5 border border-white/10 max-w-4xl mx-auto">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Check-in
                    </label>
                    <Input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400 h-10"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Check-out
                    </label>
                    <Input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400 h-10"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Guests
                    </label>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      className="w-full px-3 py-2 h-10 bg-white/10 border border-white/20 rounded-md text-white"
                    >
                      {[1,2,3,4,5,6,7,8].map(num => (
                        <option key={num} value={num} className="bg-slate-800">{num}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <Button className="w-full bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white font-semibold py-3 text-lg">
                  <Search className="h-5 w-5 mr-2" />
                  Search
                </Button>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default HeroSection;
