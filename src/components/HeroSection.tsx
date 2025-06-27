
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
        <div className="absolute inset-0 bg-slate-900/50"></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto">
        {/* Hero Text - Centered Layout */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
            Book Your Stay
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-4">
            Welcome to XTSY - a great alpine chalet in the best Switzerland ski resort.
          </p>
        </div>

        {/* Booking Form - Horizontal Layout */}
        <Card className="backdrop-blur-xl bg-white/15 border border-white/20 shadow-2xl max-w-5xl mx-auto">
          <CardContent className="p-6">
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
                  className="bg-white/20 border-white/30 text-white placeholder-gray-300 h-12 backdrop-blur-sm"
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
                  className="bg-white/20 border-white/30 text-white placeholder-gray-300 h-12 backdrop-blur-sm"
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
                  className="w-full px-4 py-3 h-12 bg-white/20 border border-white/30 rounded-md text-white backdrop-blur-sm"
                >
                  {[1,2,3,4,5,6,7,8].map(num => (
                    <option key={num} value={num} className="bg-slate-800">{num}</option>
                  ))}
                </select>
              </div>
              
              <Button className="h-12 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white font-semibold text-lg px-8">
                <Search className="h-5 w-5 mr-2" />
                Search
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default HeroSection;
