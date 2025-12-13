import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route } from "react-router-dom";
import { useState, useEffect, Suspense, lazy, ReactNode, memo } from "react";
import LoadingScreen from "./components/LoadingScreen";
import PerformanceMonitor from "./components/PerformanceMonitor";
import SecurityHeadersProvider from "./components/SecurityHeadersProvider";
import ErrorBoundary from "./components/ErrorBoundary";
import { logger } from "./utils/piiRedactedLogger";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { preloadCriticalResources, optimizeFontLoading, registerServiceWorker } from "./utils/bundleOptimization";
import { performGlobalCleanup } from "./utils/performanceCleanup";
import { cleanupUnifiedImage } from "./components/UnifiedImage";

// Lazy loaded pages with retry logic for mobile (exponential backoff)
const createLazyComponent = (importFn: () => Promise<any>) => {
  return lazy(() => 
    importFn().catch((err) => {
      console.warn('Chunk load failed, retrying...', err.message);
      // First retry after 300ms
      return new Promise(resolve => setTimeout(resolve, 300))
        .then(importFn)
        .catch(() => {
          // Second retry after 800ms if first fails
          return new Promise(resolve => setTimeout(resolve, 800)).then(importFn);
        });
    })
  );
};

const LazyAbout = createLazyComponent(() => import("./pages/About"));
const LazyGallery = createLazyComponent(() => import("./pages/Gallery"));
const LazyTravel = createLazyComponent(() => import("./pages/Travel"));
const LazyXTSY270 = createLazyComponent(() => import("./pages/XTSY270"));
const LazyPetFriendly = createLazyComponent(() => import("./pages/PetFriendly"));
const LazyXTSYvsZostel = createLazyComponent(() => import("./pages/XTSYvsZostel"));
const LazyFemaleTravellers = createLazyComponent(() => import("./pages/FemaleTravellers"));
const LazyWorkFromHome = createLazyComponent(() => import("./pages/WorkFromHome"));
const LazyPrivacyPolicy = createLazyComponent(() => import("./pages/PrivacyPolicy"));
const AdminLogin = createLazyComponent(() => import("./pages/AdminLogin"));
const AdminDashboard = createLazyComponent(() => import("./pages/AdminDashboard"));
const BookingFlow = createLazyComponent(() => import("./pages/BookingFlow"));

// Memoized route wrapper with error boundary for mobile stability
const LazyRoute = memo(({ children }: { children: ReactNode }) => (
  <ErrorBoundary>
    <Suspense fallback={<LoadingScreen minimal />}>
      {children}
    </Suspense>
  </ErrorBoundary>
));

LazyRoute.displayName = 'LazyRoute';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize performance optimizations immediately
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

    // Fast loading: Skip artificial delay on fast connections
    const connection = (navigator as any).connection;
    const isSlowConnection = connection?.effectiveType === '2g' || connection?.effectiveType === 'slow-2g';
    const loadTime = isSlowConnection ? 200 : 50; // Reduced for faster mobile loading

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, loadTime);

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
            <Route path="/about" element={<LazyRoute><LazyAbout /></LazyRoute>} />
            <Route path="/gallery" element={<LazyRoute><LazyGallery /></LazyRoute>} />
            <Route path="/travel" element={<LazyRoute><LazyTravel /></LazyRoute>} />
            <Route path="/xtsy-270" element={<LazyRoute><LazyXTSY270 /></LazyRoute>} />
            <Route path="/pet-friendly" element={<LazyRoute><LazyPetFriendly /></LazyRoute>} />
            <Route path="/xtsy-vs-zostel" element={<LazyRoute><LazyXTSYvsZostel /></LazyRoute>} />
            <Route path="/female-travellers" element={<LazyRoute><LazyFemaleTravellers /></LazyRoute>} />
            <Route path="/work-from-home" element={<LazyRoute><LazyWorkFromHome /></LazyRoute>} />
            <Route path="/privacy-policy" element={<LazyRoute><LazyPrivacyPolicy /></LazyRoute>} />
            <Route path="/admin-login" element={<LazyRoute><AdminLogin /></LazyRoute>} />
            <Route path="/admin/dashboard" element={<LazyRoute><AdminDashboard /></LazyRoute>} />
            <Route path="/booking" element={<LazyRoute><BookingFlow /></LazyRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </div>
    </SecurityHeadersProvider>
  );
}

export default App;
