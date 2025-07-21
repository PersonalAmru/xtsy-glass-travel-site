
import { useState, useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import RoomsSection from "@/components/RoomsSection";
import ServicesSection from "@/components/ServicesSection";
import ReviewsSection from "@/components/ReviewsSection";
import GroupBookingSection from "@/components/GroupBookingSection";
import AdventureCallToAction from "@/components/AdventureCallToAction";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GuestDetails from "@/components/GuestDetails";

const Index = () => {
  const [showGuestDetails, setShowGuestDetails] = useState(false);
  const [bookingData, setBookingData] = useState<any>(null);

  useEffect(() => {
    const handleOpenGuestDetails = (event: CustomEvent) => {
      setBookingData(event.detail);
      setShowGuestDetails(true);
    };

    window.addEventListener('openGuestDetails', handleOpenGuestDetails as EventListener);

    return () => {
      window.removeEventListener('openGuestDetails', handleOpenGuestDetails as EventListener);
    };
  }, []);

  const handleCloseGuestDetails = () => {
    setShowGuestDetails(false);
    setBookingData(null);
  };

  const handleBackToBooking = () => {
    setShowGuestDetails(false);
    // Reopen the booking modal
    window.dispatchEvent(new CustomEvent('reopenBookingModal', { 
      detail: bookingData 
    }));
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <RoomsSection />
        <ServicesSection />
        <ReviewsSection />
        <GroupBookingSection />
        <AdventureCallToAction />
      </main>
      <Footer />
      
      {showGuestDetails && bookingData && (
        <GuestDetails
          isOpen={true}
          onClose={handleCloseGuestDetails}
          onBack={handleBackToBooking}
          bookingData={bookingData}
        />
      )}
    </div>
  );
};

export default Index;
