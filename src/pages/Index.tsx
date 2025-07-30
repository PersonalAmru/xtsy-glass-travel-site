
import { useState, useEffect, Suspense } from "react";
import HeroSection from "@/components/HeroSection";
import RoomsSection from "@/components/RoomsSection";
import ServicesSection from "@/components/ServicesSection";
import ReviewsSection from "@/components/ReviewsSection";
import GroupBookingSection from "@/components/GroupBookingSection";
import AdventureCallToAction from "@/components/AdventureCallToAction";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GuestDetails from "@/components/GuestDetails";
import LazyWrapper from "@/components/LazyWrapper";
import SEOContent from "@/components/SEOContent";

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
      <SEOContent page="home" />
      <Header />
      <main>
        <HeroSection />
        <LazyWrapper fallback={<div className="h-96 bg-gray-100 animate-pulse rounded-lg mx-4"></div>}>
          <RoomsSection />
        </LazyWrapper>
        <LazyWrapper fallback={<div className="h-64 bg-gray-100 animate-pulse rounded-lg mx-4 my-8"></div>}>
          <ServicesSection />
        </LazyWrapper>
        <LazyWrapper fallback={<div className="h-64 bg-gray-100 animate-pulse rounded-lg mx-4 my-8"></div>}>
          <ReviewsSection />
        </LazyWrapper>
        <LazyWrapper fallback={<div className="h-48 bg-gray-100 animate-pulse rounded-lg mx-4 my-8"></div>}>
          <GroupBookingSection />
        </LazyWrapper>
        <LazyWrapper fallback={<div className="h-48 bg-gray-100 animate-pulse rounded-lg mx-4 my-8"></div>}>
          <AdventureCallToAction />
        </LazyWrapper>
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
