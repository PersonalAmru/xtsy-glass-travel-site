
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import RoomsSection from "@/components/RoomsSection";
import ServicesSection from "@/components/ServicesSection";
import ReviewsSection from "@/components/ReviewsSection";
import GroupBookingSection from "@/components/GroupBookingSection";
import TravelItinerariesSection from "@/components/TravelItinerariesSection";
import Footer from "@/components/Footer";
import AIChatBot from "@/components/AIChatBot";
import TourAIChatBot from "@/components/TourAIChatBot";
import GuestDetails from "@/components/GuestDetails";

const Index = () => {
  const [showGuestDetails, setShowGuestDetails] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<any>(null);

  useEffect(() => {
    const handleOpenGuestDetails = (event: any) => {
      setCurrentBooking(event.detail);
      setShowGuestDetails(true);
    };

    window.addEventListener('openGuestDetails', handleOpenGuestDetails);

    return () => {
      window.removeEventListener('openGuestDetails', handleOpenGuestDetails);
    };
  }, []);

  const handleCloseGuestDetails = () => {
    setShowGuestDetails(false);
    setCurrentBooking(null);
  };

  const handleBackFromGuestDetails = () => {
    setShowGuestDetails(false);
    // Trigger the booking modal to reopen with the same booking data
    if (currentBooking) {
      setTimeout(() => {
        const event = new CustomEvent('reopenBookingModal', { detail: currentBooking });
        window.dispatchEvent(event);
      }, 100);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <Header />
      <HeroSection />
      <RoomsSection />
      <ServicesSection />
      <ReviewsSection />
      <GroupBookingSection />
      <TravelItinerariesSection />
      <Footer />
      <AIChatBot />
      
      {showGuestDetails && currentBooking && (
        <GuestDetails
          isOpen={showGuestDetails}
          onClose={handleCloseGuestDetails}
          onBack={handleBackFromGuestDetails}
          bookingData={currentBooking}
        />
      )}
    </div>
  );
};

export default Index;
