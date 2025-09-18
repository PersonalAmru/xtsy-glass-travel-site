
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route } from "react-router-dom";
import { useState, useEffect, Suspense } from "react";
import LoadingScreen from "./components/LoadingScreen";
import PerformanceMonitor from "./components/PerformanceMonitor";
import SecurityHeadersProvider from "./components/SecurityHeadersProvider";
import { logger } from "./utils/piiRedactedLogger";
import Index from "./pages/Index";
import { LazyAbout } from "./pages/lazy/LazyAbout";
import { LazyGallery } from "./pages/lazy/LazyGallery";
import { LazyTravel } from "./pages/lazy/LazyTravel";
import { LazyXTSY270 } from "./pages/lazy/LazyXTSY270";
import { LazyAdmin } from "./pages/lazy/LazyAdmin";
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

    // Log security initialization
    logger.security('app_initialized', {
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
      security_headers_enabled: true,
      pii_redaction_enabled: true
    });

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
    <SecurityHeadersProvider config={{ 
      isDevelopment: process.env.NODE_ENV === 'development',
      enableHSTS: process.env.NODE_ENV === 'production'
    }}>
      <div className="dark">
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
            <Route path="/admin" element={
              <Suspense fallback={<LoadingScreen />}>
                <LazyAdmin />
              </Suspense>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </div>
    </SecurityHeadersProvider>
  );
}

export default App;
