
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import GroupBookingCard from "./GroupBookingCard";
import GroupBookingForm from "./GroupBookingForm";
import B2BBookingForm from "./B2BBookingForm";

const GroupBookingSection = () => {
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [showB2BForm, setShowB2BForm] = useState(false);

  return (
    <section id="group-booking-section" className="pt-12 pb-16 bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 relative overflow-hidden -mt-1">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-100/30 via-transparent to-red-100/30" />
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <div className="glass-card inline-block px-4 py-3 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 shadow-xl mb-6 max-w-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-1 font-playfair">
              Group & Entire Property Booking
            </h2>
            <p className="text-sm text-gray-600 font-medium">
              Perfect for corporate events and group adventures
            </p>
            <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto mt-2 rounded-full" />
          </div>
        </div>

        {/* Main Booking Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12 max-w-4xl mx-auto">
          <GroupBookingCard
            type="corporate"
            onBookingClick={() => setShowB2BForm(true)}
          />
          <GroupBookingCard
            type="group"
            onBookingClick={() => setShowGroupForm(true)}
          />
        </div>

        {/* Additional Info */}
        <div className="text-center space-y-4">
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-lg px-6 py-3">
              🎯 Best Value Guaranteed
            </Badge>
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-lg px-6 py-3">
              ✅ 100% Fulfillment
            </Badge>
          </div>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            Perfect for corporate events, family gatherings, and group adventures! Book your entire space today!
          </p>
        </div>
      </div>

      {/* Modals */}
      <GroupBookingForm 
        isOpen={showGroupForm}
        onClose={() => setShowGroupForm(false)}
      />
      
      <B2BBookingForm 
        isOpen={showB2BForm}
        onClose={() => setShowB2BForm(false)}
      />
    </section>
  );
};

export default GroupBookingSection;
