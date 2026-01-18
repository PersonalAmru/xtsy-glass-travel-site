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
import { EnhancedAnalyticsProvider } from "./hooks/useEnhancedAnalytics";
import { HappyGuestsProvider } from "./contexts/HappyGuestsContext";

import { UserAuthProvider } from "./contexts/UserAuthContext";
import ConsentBanner from "./components/consent/ConsentBanner";
import { TrafficAnalyticsProvider } from "./hooks/useTrafficAnalytics";

// Optimized lazy loading with faster retry and better chunk handling
const createLazyComponent = (importFn: () => Promise<any>) => {
  return lazy(() => 
    importFn().catch((err) => {
      console.warn('Chunk load failed, retrying...', err.message);
      // Faster retry - 100ms then 250ms
      return new Promise(resolve => setTimeout(resolve, 100))
        .then(importFn)
        .catch(() => {
          return new Promise(resolve => setTimeout(resolve, 250)).then(importFn);
        });
    })
  );
};

// XTSY Prime pages - frequently accessed, preload on hover
const LazyXTSY270 = createLazyComponent(() => import("./pages/XTSY270"));
const LazyPetFriendly = createLazyComponent(() => import("./pages/PetFriendly"));
const LazyXTSYvsZostel = createLazyComponent(() => import("./pages/XTSYvsZostel"));
const LazyFemaleTravellers = createLazyComponent(() => import("./pages/FemaleTravellers"));
const LazyWorkFromHome = createLazyComponent(() => import("./pages/WorkFromHome"));
const LazyXTSYRentals = createLazyComponent(() => import("./pages/XTSYRentals"));

// Other lazy pages
const LazyAbout = createLazyComponent(() => import("./pages/About"));
const LazyGallery = createLazyComponent(() => import("./pages/Gallery"));
const LazyTravel = createLazyComponent(() => import("./pages/Travel"));
const LazyPrivacyPolicy = createLazyComponent(() => import("./pages/PrivacyPolicy"));
const LazyTermsOfService = createLazyComponent(() => import("./pages/TermsOfService"));
const AdminLogin = createLazyComponent(() => import("./pages/AdminLogin"));
const BookingFlow = createLazyComponent(() => import("./pages/BookingFlow"));

// User auth pages
const UserAuth = createLazyComponent(() => import("./pages/user/UserAuth"));
const UserProfile = createLazyComponent(() => import("./pages/user/UserProfile"));

// Admin pages - Unified layout with hamburger menu
const AdminOverview = createLazyComponent(() => import("./pages/admin/AdminOverview"));
const AdminAnalytics = createLazyComponent(() => import("./pages/admin/AdminAnalytics"));
const AdminInventory = createLazyComponent(() => import("./pages/admin/AdminInventory"));
const AdminActivity = createLazyComponent(() => import("./pages/admin/AdminActivity"));
const AdminPropertiesV2 = createLazyComponent(() => import("./pages/admin/AdminPropertiesV2"));
const AdminFranchisesV2 = createLazyComponent(() => import("./pages/admin/AdminFranchisesV2"));
const AdminBookingsCalendar = createLazyComponent(() => import("./pages/admin/AdminBookingsCalendar"));
const AdminGuestChats = createLazyComponent(() => import("./pages/admin/AdminGuestChats"));
const AdminOTAs = createLazyComponent(() => import("./pages/admin/AdminOTAs"));
const AdminFinance = createLazyComponent(() => import("./pages/admin/AdminFinance"));
const AdminGST = createLazyComponent(() => import("./pages/admin/AdminGST"));
const AdminReviews = createLazyComponent(() => import("./pages/admin/AdminReviews"));
const AdminAuditLogs = createLazyComponent(() => import("./pages/admin/AdminAuditLogs"));
const AdminChannels = createLazyComponent(() => import("./pages/admin/AdminChannels"));
const AdminDemand = createLazyComponent(() => import("./pages/admin/AdminDemand"));
const AdminWhatsAppTemplates = createLazyComponent(() => import("./pages/admin/AdminWhatsAppTemplates"));
const LiveTrafficCommandCenter = createLazyComponent(() => import("./pages/admin/LiveTrafficCommandCenter"));

// Franchise pages
const FranchiseLogin = createLazyComponent(() => import("./pages/franchise/FranchiseLogin"));
const FranchiseDashboard = createLazyComponent(() => import("./pages/franchise/FranchiseDashboard"));

// Fast route wrapper with minimal loading state
const LazyRoute = memo(({ children }: { children: ReactNode }) => (
  <ErrorBoundary>
    <Suspense fallback={<XTSYRouteLoader />}>
      {children}
    </Suspense>
  </ErrorBoundary>
));

LazyRoute.displayName = 'LazyRoute';

// Minimal inline route loader - no external CSS, instant render
const XTSYRouteLoader = memo(() => (
  <div style={{
    position: 'fixed',
    inset: 0,
    // Match hero gradient background for seamless transition
    background: 'linear-gradient(135deg, #020617 0%, #0f172a 50%, #020617 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999
  }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{
        width: 48,
        height: 48,
        margin: '0 auto 12px',
        borderRadius: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'pulse 1.5s ease-in-out infinite',
        boxShadow: '0 4px 20px rgba(163, 21, 69, 0.3)',
        overflow: 'hidden'
      }}>
        <img 
          src="/xtsy-favicon.png" 
          alt="XTSY" 
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain'
          }}
        />
      </div>
      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; box-shadow: 0 0 20px rgba(163, 21, 69, 0.4); } 50% { opacity: 0.85; box-shadow: 0 0 30px rgba(163, 21, 69, 0.6); } }`}</style>
    </div>
  </div>
));

XTSYRouteLoader.displayName = 'XTSYRouteLoader';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Add initial-load class to disable transitions during first paint
    document.body.classList.add('initial-load');
    
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

    // Ultra-fast loading - minimize artificial delay
    const connection = (navigator as any).connection;
    const isSlowConnection = connection?.effectiveType === '2g' || connection?.effectiveType === 'slow-2g';
    const loadTime = isSlowConnection ? 100 : 10; // Near-instant for fast connections

    const timer = setTimeout(() => {
      setIsLoading(false);
      // Remove initial-load class after first paint
      requestAnimationFrame(() => {
        document.body.classList.remove('initial-load');
        // Hide LCP skeleton after React has hydrated
        if (typeof (window as any).__hideLCPSkeleton === 'function') {
          (window as any).__hideLCPSkeleton();
        }
      });
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
        <HappyGuestsProvider>
          <UserAuthProvider>
            <TrafficAnalyticsProvider>
              <EnhancedAnalyticsProvider>
                
                <ConsentBanner />
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
                <Route path="/xtsy-rentals" element={<LazyRoute><LazyXTSYRentals /></LazyRoute>} />
                <Route path="/privacy-policy" element={<LazyRoute><LazyPrivacyPolicy /></LazyRoute>} />
                <Route path="/terms-of-service" element={<LazyRoute><LazyTermsOfService /></LazyRoute>} />
                <Route path="/admin-login" element={<LazyRoute><AdminLogin /></LazyRoute>} />
                <Route path="/booking" element={<LazyRoute><BookingFlow /></LazyRoute>} />
                
                {/* User Auth Routes */}
                <Route path="/auth" element={<LazyRoute><UserAuth /></LazyRoute>} />
                <Route path="/profile" element={<LazyRoute><UserProfile /></LazyRoute>} />
                
                {/* Admin Routes - Unified layout with hamburger menu */}
                <Route path="/admin" element={<LazyRoute><AdminOverview /></LazyRoute>} />
                <Route path="/admin/dashboard" element={<LazyRoute><AdminOverview /></LazyRoute>} />
                <Route path="/admin/analytics" element={<LazyRoute><AdminAnalytics /></LazyRoute>} />
                <Route path="/admin/bookings" element={<LazyRoute><AdminBookingsCalendar /></LazyRoute>} />
                <Route path="/admin/chats" element={<LazyRoute><AdminGuestChats /></LazyRoute>} />
                <Route path="/admin/inventory" element={<LazyRoute><AdminInventory /></LazyRoute>} />
                <Route path="/admin/activity" element={<LazyRoute><AdminActivity /></LazyRoute>} />
                <Route path="/admin/properties" element={<LazyRoute><AdminPropertiesV2 /></LazyRoute>} />
                <Route path="/admin/franchises" element={<LazyRoute><AdminFranchisesV2 /></LazyRoute>} />
                <Route path="/admin/otas" element={<LazyRoute><AdminOTAs /></LazyRoute>} />
                <Route path="/admin/finance" element={<LazyRoute><AdminFinance /></LazyRoute>} />
                <Route path="/admin/gst" element={<LazyRoute><AdminGST /></LazyRoute>} />
                <Route path="/admin/reviews" element={<LazyRoute><AdminReviews /></LazyRoute>} />
                <Route path="/admin/audit" element={<LazyRoute><AdminAuditLogs /></LazyRoute>} />
                <Route path="/admin/channels" element={<LazyRoute><AdminChannels /></LazyRoute>} />
                <Route path="/admin/demand" element={<LazyRoute><AdminDemand /></LazyRoute>} />
                <Route path="/admin/whatsapp" element={<LazyRoute><AdminWhatsAppTemplates /></LazyRoute>} />
                <Route path="/admin/traffic" element={<LazyRoute><LiveTrafficCommandCenter /></LazyRoute>} />
                {/* Franchise Routes */}
                <Route path="/franchise/login" element={<LazyRoute><FranchiseLogin /></LazyRoute>} />
                <Route path="/franchise" element={<LazyRoute><FranchiseDashboard /></LazyRoute>} />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
              </TooltipProvider>
              </EnhancedAnalyticsProvider>
            </TrafficAnalyticsProvider>
          </UserAuthProvider>
        </HappyGuestsProvider>
      </div>
    </SecurityHeadersProvider>
  );
}

export default App;
