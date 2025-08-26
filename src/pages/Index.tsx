
import { useState, useEffect, Suspense } from "react";
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

const Index = () => {
  return (
    <div className="min-h-screen">
      <SEOContent page="home" />
      <Header />
      <main>
        <HeroSection />
        <LazyWrapper fallback={<div className="h-96 bg-gray-100 animate-pulse rounded-lg mx-4"></div>}>
          <RoomsSection />
        </LazyWrapper>
        <div className="mt-12 sm:mt-16 md:mt-20">
          <LazyWrapper fallback={<div className="h-64 bg-gray-100 animate-pulse rounded-lg mx-4 my-8"></div>}>
            <ServicesSection />
          </LazyWrapper>
        </div>
        <div className="mt-12 sm:mt-16 md:mt-20">
          <LazyWrapper fallback={<div className="h-64 bg-gray-100 animate-pulse rounded-lg mx-4 my-8"></div>}>
            <ReviewsSection />
          </LazyWrapper>
        </div>
        <div className="mt-12 sm:mt-16 md:mt-20">
          <LazyWrapper fallback={<div className="h-48 bg-gray-100 animate-pulse rounded-lg mx-4 my-8"></div>}>
            <GroupBookingSection />
          </LazyWrapper>
        </div>
        <div className="mt-12 sm:mt-16 md:mt-20">
          <LazyWrapper fallback={<div className="h-48 bg-gray-100 animate-pulse rounded-lg mx-4 my-8"></div>}>
            <AdventureCallToAction />
          </LazyWrapper>
        </div>
        <div className="mt-12 sm:mt-16 md:mt-20">
          <LazyWrapper fallback={<div className="h-64 bg-gray-100 animate-pulse rounded-lg mx-4 my-8"></div>}>
            <FAQSection />
          </LazyWrapper>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
