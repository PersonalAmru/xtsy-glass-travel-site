import { useState, useCallback } from "react";
import HeroSection from "@/components/HeroSection";
import RoomsSection from "@/components/RoomsSection";
import ServicesSection from "@/components/ServicesSection";
import ReviewsSection from "@/components/ReviewsSection";
import GroupBookingSection from "@/components/GroupBookingSection";
import AdventureCallToAction from "@/components/AdventureCallToAction";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LazyWrapper from "@/components/LazyWrapper";
import SEOContent from "@/components/SEOContent";
import FAQSection from "@/components/FAQSection";
import { ExitSurveyModal, useExitIntent, ExitSurveyData } from "@/components/ExitSurveyModal";
import { useEnhancedAnalytics } from "@/hooks/useEnhancedAnalytics";

// Minimal mobile-friendly fallback
const SectionFallback = ({ height = 'h-64' }: { height?: string }) => (
  <div className={`${height} bg-muted/30 rounded-lg mx-4`} />
);

const Index = () => {
  const [showExitSurvey, setShowExitSurvey] = useState(false);
  const { submitExitSurvey } = useEnhancedAnalytics();

  // Check if user has already seen exit survey this session
  const hasSeenSurvey = sessionStorage.getItem('exit_survey_shown');
  // Check if user has interacted (scrolled, clicked)
  const [hasInteracted, setHasInteracted] = useState(false);

  // Track user interactions to only show exit survey to non-engaged users
  useState(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) setHasInteracted(true);
    };
    const handleClick = () => setHasInteracted(true);
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('click', handleClick);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClick);
    };
  });

  const handleExitIntent = useCallback(() => {
    // Only show if: not seen before, user hasn't engaged much, been on page >5 seconds
    if (!hasSeenSurvey && !hasInteracted) {
      sessionStorage.setItem('exit_survey_shown', 'true');
      setShowExitSurvey(true);
    }
  }, [hasSeenSurvey, hasInteracted]);

  useExitIntent(handleExitIntent);

  const handleSurveySubmit = (data: ExitSurveyData) => {
    submitExitSurvey(data);
    setShowExitSurvey(false);
  };

  const handleSurveyDismiss = () => {
    setShowExitSurvey(false);
  };

  return (
    <div className="min-h-screen">
      <SEOContent page="home" />
      <Header />
      <main style={{ contain: 'layout style' }}>
        <HeroSection />
        <LazyWrapper fallback={<SectionFallback height="h-96" />}>
          <RoomsSection />
        </LazyWrapper>
        <LazyWrapper fallback={<SectionFallback />}>
          <ServicesSection />
        </LazyWrapper>
        <LazyWrapper fallback={<SectionFallback />}>
          <ReviewsSection />
        </LazyWrapper>
        <LazyWrapper fallback={<SectionFallback height="h-48" />}>
          <GroupBookingSection />
        </LazyWrapper>
        <LazyWrapper fallback={<SectionFallback height="h-48" />}>
          <AdventureCallToAction />
        </LazyWrapper>
        <LazyWrapper fallback={<SectionFallback />}>
          <FAQSection />
        </LazyWrapper>
      </main>
      <Footer />

      {/* Exit Intent Survey for non-engaged visitors */}
      {showExitSurvey && (
        <ExitSurveyModal
          onSubmit={handleSurveySubmit}
          onDismiss={handleSurveyDismiss}
        />
      )}
    </div>
  );
};

export default Index;