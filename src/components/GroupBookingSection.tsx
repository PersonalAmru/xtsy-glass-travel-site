
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Building, Users } from "lucide-react";
import B2BBookingForm from "./B2BBookingForm";
import GroupBookingForm from "./GroupBookingForm";

const GroupBookingSection = () => {
  const [activeBookingType, setActiveBookingType] = useState<"b2b" | "group" | null>(null);

  return (
    <section className="py-16 sm:py-20 px-3 sm:px-4 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-100/30 via-transparent to-orange-100/30" />
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500" />
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-200/30 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-orange-200/30 rounded-full blur-3xl" />
      
      {/* Enhanced background animations */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-32 h-32 bg-gradient-to-r from-amber-300/20 to-orange-300/20 rounded-full blur-xl animate-pulse"
            style={{
              left: `${3 + i * 12}%`,
              bottom: `${8 + i * 11}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3.8 + i * 0.3}s`
            }}
          />
        ))}
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-block p-6 bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl mb-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent mb-4 font-playfair">
              Group & Entire Property Booking
            </h2>
            <div className="w-40 h-1 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto rounded-full" />
          </div>
          <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            Perfect for corporate events, family gatherings, and group adventures! Book your entire space today!
          </p>
          
          {/* Perks Section */}
          <div className="mt-8 bg-gradient-to-r from-orange-100 to-red-100 rounded-xl p-6 shadow-lg max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="flex items-center gap-2 text-orange-600 font-semibold">
                <span className="text-lg">🎯</span>
                <span>Price Match Guarantee</span>
              </div>
              <div className="hidden sm:block w-1 h-6 bg-orange-300 rounded-full"></div>
              <div className="flex items-center gap-2 text-red-600 font-semibold">
                <span className="text-lg">✅</span>
                <span>100% Fulfillment</span>
              </div>
            </div>
          </div>
        </div>

        {!activeBookingType ? (
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-2xl mx-auto">
            <Button
              onClick={() => setActiveBookingType("b2b")}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold px-12 py-6 text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl font-seasons"
            >
              <Building className="h-6 w-6 mr-3" />
              B2B Corporate Booking
            </Button>
            <Button
              onClick={() => setActiveBookingType("group")}
              className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold px-12 py-6 text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl font-seasons"
            >
              <Users className="h-6 w-6 mr-3" />
              Group Booking
            </Button>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <Button
                onClick={() => setActiveBookingType(null)}
                variant="outline"
                className="border-gray-300 text-gray-600 hover:bg-gray-50 font-seasons"
              >
                ← Back to Options
              </Button>
            </div>
            
            {activeBookingType === "b2b" ? (
              <B2BBookingForm />
            ) : (
              <GroupBookingForm />
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default GroupBookingSection;
