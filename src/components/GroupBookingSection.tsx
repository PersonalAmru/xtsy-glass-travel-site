
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Building, Users } from "lucide-react";
import B2BBookingForm from "./B2BBookingForm";
import GroupBookingForm from "./GroupBookingForm";

const GroupBookingSection = () => {
  const [activeBookingType, setActiveBookingType] = useState<"b2b" | "group" | null>(null);

  return (
    <section className="py-16 sm:py-20 px-3 sm:px-4 bg-gradient-to-br from-slate-100 via-white to-slate-100 relative overflow-hidden">
      {/* Enhanced background animations */}
      <div className="absolute inset-0">
        {[...Array(7)].map((_, i) => (
          <div
            key={i}
            className="absolute w-28 h-28 bg-gradient-to-r from-orange-400/10 to-red-400/10 rounded-full blur-xl animate-pulse"
            style={{
              left: `${5 + i * 14}%`,
              bottom: `${10 + i * 12}%`,
              animationDelay: `${i * 0.6}s`,
              animationDuration: `${3.5 + i * 0.4}s`
            }}
          />
        ))}
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-3 sm:mb-4 font-serif-sans">
            Group & Entire Property Booking
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto font-seasons px-4">
            Choose from our range of accommodations designed for every traveler's needs and budget
          </p>
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
