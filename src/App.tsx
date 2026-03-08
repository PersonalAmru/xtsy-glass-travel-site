import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route } from "react-router-dom";
import { useState, useEffect, Suspense, lazy, ReactNode, memo } from "react";
// LoadingScreen removed from initial render gate — content renders immediately for faster LCP
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
import ConsentModal from "./components/consent/ConsentModal";
import { TrafficAnalyticsProvider } from "./hooks/useTrafficAnalytics";
import { ConversionSignalsProvider } from "./providers/ConversionSignalsProvider";
import FloatingWhatsApp from "./components/FloatingWhatsApp";

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
const LazyPricingCancellationPolicy = createLazyComponent(() => import("./pages/PricingCancellationPolicy"));
const AdminLogin = createLazyComponent(() => import("./pages/AdminLogin"));
const BookingFlow = createLazyComponent(() => import("./pages/BookingFlow"));
const SimplifiedBookingFlow = createLazyComponent(() => import("./pages/SimplifiedBookingFlow"));
const PropertySelection = createLazyComponent(() => import("./pages/PropertySelection"));
const PropertyBookingFlow = createLazyComponent(() => import("./pages/PropertyBookingFlow"));
const PropertyDetail = createLazyComponent(() => import("./pages/PropertyDetail"));
const SearchResults = createLazyComponent(() => import("./pages/SearchResults"));

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
const AdminDataLayerDebug = createLazyComponent(() => import("./pages/admin/AdminDataLayerDebug"));

const FranchiseLogin = createLazyComponent(() => import("./pages/franchise/FranchiseLogin"));
const FranchiseDashboard = createLazyComponent(() => import("./pages/franchise/FranchiseDashboard"));

// PWA Install pages
const UserInstall = createLazyComponent(() => import("./pages/install/UserInstall"));
const AdminInstall = createLazyComponent(() => import("./pages/install/AdminInstall"));
const FranchiseInstall = createLazyComponent(() => import("./pages/install/FranchiseInstall"));

// Admin Franchise Permissions
const AdminFranchisePermissions = createLazyComponent(() => import("./pages/admin/AdminFranchisePermissions"));

// Fast route wrapper with minimal loading state
const LazyRoute = memo(({ children }: { children: ReactNode }) => (
  <ErrorBoundary>
    <Suspense fallback={<XTSYRouteLoader />}>
      {children}
    </Suspense>
  </ErrorBoundary>
));

LazyRoute.displayName = 'LazyRoute';

// Branded route loader matching XTSY identity
const XTSYRouteLoader = memo(() => (
  <div style={{
    position: 'fixed',
    inset: 0,
    background: 'linear-gradient(135deg, hsl(225, 40%, 3%) 0%, hsl(225, 28%, 7%) 50%, hsl(225, 40%, 3%) 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    flexDirection: 'column' as const,
    gap: 24
  }}>
    {/* Logo */}
    <div style={{
      width: 100,
      height: 100,
      animation: 'xtsy-loader-pulse 2s ease-in-out infinite',
      overflow: 'hidden'
    }}>
      <img 
        src="/xtsy-favicon.png" 
        alt="XTSY" 
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
    </div>
    {/* Brand text */}
    <div style={{ textAlign: 'center' }}>
      <h2 style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: 28,
        fontWeight: 700,
        background: 'linear-gradient(90deg, hsl(28, 92%, 52%), hsl(0, 72%, 51%))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        margin: '0 0 8px 0',
        letterSpacing: '-0.02em'
      }}>
        Live the XTSY Vibe
      </h2>
      <p style={{
        color: 'rgba(255,255,255,0.5)',
        fontSize: 14,
        fontWeight: 400,
        margin: 0,
        letterSpacing: '0.05em'
      }}>
        Premium Stays in Northeast India
      </p>
    </div>
    {/* Progress bar */}
    <div style={{
      width: 100,
      height: 3,
      backgroundColor: 'rgba(255,255,255,0.1)',
      borderRadius: 9999,
      overflow: 'hidden'
    }}>
      <div style={{
        height: '100%',
        background: 'linear-gradient(90deg, hsl(28, 92%, 52%), hsl(12, 85%, 48%))',
        borderRadius: 9999,
        animation: 'xtsy-loader-progress 1.2s ease-in-out infinite'
      }} />
    </div>
    <style>{`
      @keyframes xtsy-loader-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
      @keyframes xtsy-loader-progress { 0% { width: 0%; margin-left: 0; } 50% { width: 60%; margin-left: 20%; } 100% { width: 0%; margin-left: 100%; } }
    `}</style>
  </div>
));

XTSYRouteLoader.displayName = 'XTSYRouteLoader';

function App() {
  const [isReady, setIsReady] = useState(false);

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

    // Remove initial-load class after first paint using double-rAF
    // This ensures the browser has painted content before enabling animations
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.body.classList.remove('initial-load');
        setIsReady(true);
        // Hide LCP skeleton after React has hydrated
        if (typeof (window as any).__hideLCPSkeleton === 'function') {
          (window as any).__hideLCPSkeleton();
        }
      });
    });

    // Cleanup function for app unmount
    return () => {
      performGlobalCleanup();
      cleanupUnifiedImage();
    };
  }, []);

  // Render content immediately — no LoadingScreen gate
  // body.initial-load class suppresses animations until first paint completes

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
              <ConversionSignalsProvider>
              <EnhancedAnalyticsProvider>
                
                <ConsentModal />
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
                <Route path="/privacy" element={<LazyRoute><LazyPrivacyPolicy /></LazyRoute>} />
                <Route path="/terms-of-service" element={<LazyRoute><LazyTermsOfService /></LazyRoute>} />
                <Route path="/terms" element={<LazyRoute><LazyTermsOfService /></LazyRoute>} />
                <Route path="/pricing-cancellation-policy" element={<LazyRoute><LazyPricingCancellationPolicy /></LazyRoute>} />
                <Route path="/admin-login" element={<LazyRoute><AdminLogin /></LazyRoute>} />
                <Route path="/booking" element={<LazyRoute><BookingFlow /></LazyRoute>} />
                <Route path="/book" element={<LazyRoute><SimplifiedBookingFlow /></LazyRoute>} />
                <Route path="/search" element={<LazyRoute><SearchResults /></LazyRoute>} />
                <Route path="/properties" element={<LazyRoute><PropertySelection /></LazyRoute>} />
                <Route path="/properties/:propertyId" element={<LazyRoute><PropertyDetail /></LazyRoute>} />
                <Route path="/:locationSlug/:propertySlug/book" element={<LazyRoute><PropertyBookingFlow /></LazyRoute>} />
                
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
                <Route path="/admin/datalayer" element={<LazyRoute><AdminDataLayerDebug /></LazyRoute>} />
                {/* Franchise Routes */}
                <Route path="/franchise/login" element={<LazyRoute><FranchiseLogin /></LazyRoute>} />
                <Route path="/franchise" element={<LazyRoute><FranchiseDashboard /></LazyRoute>} />
                
                {/* PWA Install Routes */}
                <Route path="/install" element={<LazyRoute><UserInstall /></LazyRoute>} />
                <Route path="/admin/install" element={<LazyRoute><AdminInstall /></LazyRoute>} />
                <Route path="/franchise/install" element={<LazyRoute><FranchiseInstall /></LazyRoute>} />
                
                {/* Admin Franchise Permissions */}
                <Route path="/admin/franchise-permissions" element={<LazyRoute><AdminFranchisePermissions /></LazyRoute>} />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
              <FloatingWhatsApp />
               
              </TooltipProvider>
              </EnhancedAnalyticsProvider>
              </ConversionSignalsProvider>
            </TrafficAnalyticsProvider>
          </UserAuthProvider>
        </HappyGuestsProvider>
      </div>
    </SecurityHeadersProvider>
  );
}

export default App;
