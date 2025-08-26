
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route } from "react-router-dom";
import { useState, useEffect, Suspense } from "react";
import LoadingScreen from "./components/LoadingScreen";
import PerformanceMonitor from "./components/PerformanceMonitor";
import SecurityHeaders from "./components/SecurityHeaders";
import Index from "./pages/Index";
import { LazyAbout } from "./pages/lazy/LazyAbout";
import { LazyGallery } from "./pages/lazy/LazyGallery";
import { LazyDeals } from "./pages/lazy/LazyDeals";
import { LazyTravel } from "./pages/lazy/LazyTravel";
import { LazyXTSY270 } from "./pages/lazy/LazyXTSY270";
import BookingFlow from "./pages/BookingFlow";
import NotFound from "./pages/NotFound";
import { preloadCriticalResources, optimizeFontLoading, registerServiceWorker } from "./utils/bundleOptimization";
import { performGlobalCleanup } from "./utils/performanceCleanup";
import { cleanupUnifiedImage } from "./components/UnifiedImage";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize performance optimizations
    preloadCriticalResources();
    optimizeFontLoading();
    registerServiceWorker();

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // Reduced loading time

    // Cleanup function for app unmount
    return () => {
      clearTimeout(timer);
      performGlobalCleanup();
      cleanupUnifiedImage();
    };
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="dark">
      <SecurityHeaders />
      <PerformanceMonitor />
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={
            <Suspense fallback={<LoadingScreen />}>
              <LazyAbout />
            </Suspense>
          } />
          <Route path="/gallery" element={
            <Suspense fallback={<LoadingScreen />}>
              <LazyGallery />
            </Suspense>
          } />
          <Route path="/deals" element={
            <Suspense fallback={<LoadingScreen />}>
              <LazyDeals />
            </Suspense>
          } />
          <Route path="/travel" element={
            <Suspense fallback={<LoadingScreen />}>
              <LazyTravel />
            </Suspense>
          } />
          <Route path="/xtsy-270" element={
            <Suspense fallback={<LoadingScreen />}>
              <LazyXTSY270 />
            </Suspense>
          } />
          <Route path="/booking" element={
            <Suspense fallback={<LoadingScreen />}>
              <BookingFlow />
            </Suspense>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </div>
  );
}

export default App;
