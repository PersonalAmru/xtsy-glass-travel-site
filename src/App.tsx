import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect, Suspense, lazy, ReactNode, memo } from "react";
import { Navigate } from "react-router-dom";
// LoadingScreen removed from initial render gate — content renders immediately for faster LCP
import PerformanceMonitor from "./components/PerformanceMonitor";
import SecurityHeadersProvider from "./components/SecurityHeadersProvider";
import ErrorBoundary from "./components/ErrorBoundary";
import RouteErrorBoundary from "./components/RouteErrorBoundary";
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
const ConsentDebugPanel = lazy(() => import("./components/debug/ConsentDebugPanel"));
import { TrafficAnalyticsProvider } from "./hooks/useTrafficAnalytics";
import { ConversionSignalsProvider } from "./providers/ConversionSignalsProvider";
import FloatingWhatsApp from "./components/FloatingWhatsApp";
import { useWebVitalsReporter } from "./hooks/useWebVitalsReporter";
// StickyBookingBar removed — was creating footer "Check Availability Now" CTA per stakeholder feedback

// Wave 1J/K — Hardened lazy loading: 3 retries with backoff, then hard reload
// to pull fresh chunk hashes after a deploy invalidates the user's stale bundle.
const createLazyComponent = (importFn: () => Promise<any>) => {
  return lazy(() =>
    importFn()
      .catch(() => new Promise(r => setTimeout(r, 250)).then(importFn))
      .catch(() => new Promise(r => setTimeout(r, 750)).then(importFn))
      .catch(() => new Promise(r => setTimeout(r, 2000)).then(importFn))
      .catch((err) => {
        console.error('Chunk load failed after 3 retries — forcing reload', err?.message);
        // Avoid infinite reload loops with a session flag
        const RELOAD_KEY = '__xtsy_chunk_reload';
        if (!sessionStorage.getItem(RELOAD_KEY)) {
          sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
          window.location.reload();
        }
        // Return a placeholder component so React doesn't crash mid-reload
        return { default: () => null };
      })
  );
};

// Clear reload guard once user successfully navigates
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    setTimeout(() => sessionStorage.removeItem('__xtsy_chunk_reload'), 5000);
  });
}

// XTSY Prime pages - frequently accessed, preload on hover
const LazyXTSY270 = createLazyComponent(() => import("./pages/XTSY270"));
const LazyPetFriendly = createLazyComponent(() => import("./pages/PetFriendly"));
const LazyXTSYvsZostel = createLazyComponent(() => import("./pages/XTSYvsZostel"));
const LazyFemaleTravellers = createLazyComponent(() => import("./pages/FemaleTravellers"));
const LazyWorkFromHome = createLazyComponent(() => import("./pages/WorkFromHome"));
const LazyXTSYRentals = createLazyComponent(() => import("./pages/XTSYRentals"));
const LazyTabBistro = createLazyComponent(() => import("./pages/TabBistro"));
const LazyTabBistroCatering = createLazyComponent(() => import("./pages/TabBistroCatering"));
const LazyDawkiCampsite = createLazyComponent(() => import("./pages/XTSYAdventureCampsiteDawki"));
const LazyPropertySelector = createLazyComponent(() => import("./pages/PropertySelector"));
const LazyCampsiteBooking = createLazyComponent(() => import("./pages/CampsiteBookingFlow"));

// Other lazy pages
const LazyAbout = createLazyComponent(() => import("./pages/About"));
const LazyGallery = createLazyComponent(() => import("./pages/Gallery"));
const LazyTravel = createLazyComponent(() => import("./pages/Travel"));
const LazyTours = createLazyComponent(() => import("./pages/Tours"));
const LazyTourDetail = createLazyComponent(() => import("./pages/TourDetail"));
const AdminTours = createLazyComponent(() => import("./pages/admin/AdminTours"));
const LazyPrivacyPolicy = createLazyComponent(() => import("./pages/PrivacyPolicy"));
const LazyTermsOfService = createLazyComponent(() => import("./pages/TermsOfService"));
const LazyPricingCancellationPolicy = createLazyComponent(() => import("./pages/PricingCancellationPolicy"));
const LazyContact = createLazyComponent(() => import("./pages/Contact"));
const LazyUnsubscribe = createLazyComponent(() => import("./pages/Unsubscribe"));
const AdminLogin = createLazyComponent(() => import("./pages/AdminLogin"));
const SimplifiedBookingFlow = createLazyComponent(() => import("./pages/SimplifiedBookingFlow"));

// User auth pages
const UserAuth = createLazyComponent(() => import("./pages/user/UserAuth"));
const UserProfile = createLazyComponent(() => import("./pages/user/UserProfile"));

// Admin pages - Unified layout with hamburger menu
const AdminOverview = createLazyComponent(() => import("./pages/admin/AdminOverview"));
const AdminAnalytics = createLazyComponent(() => import("./pages/admin/AdminAnalytics"));
const AdminSearchConsole = createLazyComponent(() => import("./pages/admin/AdminSearchConsole"));
const AdminGSCErrors = createLazyComponent(() => import("./pages/admin/AdminGSCErrors"));
const AdminSchemaResults = createLazyComponent(() => import("./pages/admin/AdminSchemaResults"));
const AdminInventory = createLazyComponent(() => import("./pages/admin/AdminInventory"));
const AdminActivity = createLazyComponent(() => import("./pages/admin/AdminActivity"));
const AdminPropertiesV2 = createLazyComponent(() => import("./pages/admin/AdminPropertiesV2"));
const AdminFranchisesV2 = createLazyComponent(() => import("./pages/admin/AdminFranchisesV2"));
const AdminBookingsCalendar = createLazyComponent(() => import("./pages/admin/AdminBookingsCalendar"));
const AdminEnquiries = createLazyComponent(() => import("./pages/admin/AdminEnquiries"));
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

// Destination / SEO pages
const ThingsToDoInMeghalaya = createLazyComponent(() => import("./pages/destinations/ThingsToDoInMeghalaya"));
const DestinationDetail = createLazyComponent(() => import("./pages/destinations/DestinationDetail"));
const CategoryPage = createLazyComponent(() => import("./pages/destinations/CategoryPage"));
const MeghalayaTourPackages = createLazyComponent(() => import("./pages/destinations/MeghalayaTourPackages"));
const MeghalayaCoupleTourPackage = createLazyComponent(() => import("./pages/destinations/MeghalayaCoupleTourPackage"));
const ShillongTourPackage = createLazyComponent(() => import("./pages/destinations/ShillongTourPackage"));
const BlogBestTimeToVisit = createLazyComponent(() => import("./pages/destinations/BlogBestTimeToVisit"));
const BlogHiddenPlaces = createLazyComponent(() => import("./pages/destinations/BlogHiddenPlaces"));
const BlogItinerary3Day = createLazyComponent(() => import("./pages/destinations/BlogItinerary3Day"));
const BlogItinerary5Day = createLazyComponent(() => import("./pages/destinations/BlogItinerary5Day"));
const BlogBudgetTrip = createLazyComponent(() => import("./pages/destinations/BlogBudgetTrip"));
const MeghalayaPhotoGallery = createLazyComponent(() => import("./pages/destinations/MeghalayaPhotoGallery"));

// Programmatic SEO engine
const ProgrammaticSEOPage = createLazyComponent(() => import("./pages/seo/ProgrammaticSEOPage"));
const AllPages = createLazyComponent(() => import("./pages/AllPages"));

// High-intent SEO landing pages
const BestHostelShillong = createLazyComponent(() => import("./pages/BestHostelShillong"));
const HotelsInShillong = createLazyComponent(() => import("./pages/HotelsInShillong"));
const HomestaysInShillong = createLazyComponent(() => import("./pages/HomestaysInShillong"));
const LuxuryGlampingShillong = createLazyComponent(() => import("./pages/LuxuryGlampingShillong"));
const DestinationWeddingShillong = createLazyComponent(() => import("./pages/DestinationWeddingShillong"));

// PWA Install pages
const UserInstall = createLazyComponent(() => import("./pages/install/UserInstall"));
const AdminInstall = createLazyComponent(() => import("./pages/install/AdminInstall"));
const FranchiseInstall = createLazyComponent(() => import("./pages/install/FranchiseInstall"));

// Admin Franchise Permissions
const AdminFranchisePermissions = createLazyComponent(() => import("./pages/admin/AdminFranchisePermissions"));
const AdminSEODashboard = createLazyComponent(() => import("./pages/admin/AdminSEODashboard"));
const AdminSEORecovery = createLazyComponent(() => import("./pages/admin/AdminSEORecovery"));
const AdminSEOPriority = createLazyComponent(() => import("./pages/admin/AdminSEOPriority"));
const AdminSEOHeroManager = createLazyComponent(() => import("./pages/admin/AdminSEOHeroManager"));

// Redirect /travel → /tours (fixes keyword cannibalization)
const TravelRedirect = () => <Navigate to="/tours" replace />;

/**
 * In-flow, non-blocking route loader.
 * Stability fix (Apr 2026): replaced the previous full-screen `position: fixed`
 * dark overlay (z-index 9999) which was flashing as a "black screen" during
 * any route/Suspense transition and intermittently during scroll on Safari/iOS.
 * Now renders a small in-flow skeleton so the existing page chrome (header,
 * background) stays visible while the chunk loads.
 */
const XTSYRouteLoader = memo(() => (
  <div
    role="status"
    aria-label="Loading page"
    style={{
      minHeight: '60vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column' as const,
      gap: 16,
      padding: 24,
      background: 'transparent',
    }}
  >
    <div style={{
      width: 56,
      height: 56,
      borderRadius: '50%',
      border: '3px solid hsl(28, 92%, 52% / 0.2)',
      borderTopColor: 'hsl(28, 92%, 52%)',
      animation: 'xtsy-spin 0.9s linear infinite',
    }} />
    <p style={{
      color: 'hsl(0, 0%, 100% / 0.6)',
      fontSize: 13,
      letterSpacing: '0.04em',
      margin: 0,
    }}>
      Loading…
    </p>
    <style>{`@keyframes xtsy-spin { to { transform: rotate(360deg); } }`}</style>
  </div>
));

XTSYRouteLoader.displayName = 'XTSYRouteLoader';

// Fast route wrapper with minimal loading state
const LazyRoute = memo(({ children }: { children: ReactNode }) => (
  <ErrorBoundary>
    <Suspense fallback={<XTSYRouteLoader />}>
      {children}
    </Suspense>
  </ErrorBoundary>
));

LazyRoute.displayName = 'LazyRoute';

// Scroll to top on every route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// RUM (Real User Monitoring) — captures Web Vitals per route.
const WebVitalsBeacon = () => {
  useWebVitalsReporter();
  return null;
};

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
      environment: import.meta.env.MODE,
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
      isDevelopment: import.meta.env.MODE === 'development',
      enableHSTS: import.meta.env.MODE === 'production'
    }}>
      <div className="dark">
        <PerformanceMonitor />
        <HappyGuestsProvider>
          <UserAuthProvider>
            <TrafficAnalyticsProvider>
              <ConversionSignalsProvider>
              <EnhancedAnalyticsProvider>
                
                <ConsentModal />
                <Suspense fallback={null}><ConsentDebugPanel /></Suspense>
                <TooltipProvider>
                <Toaster />
              <Sonner />
              <ScrollToTop />
              <WebVitalsBeacon />
              <RouteErrorBoundary routeKey={typeof window !== 'undefined' ? window.location.pathname : ''}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<LazyRoute><LazyAbout /></LazyRoute>} />
                <Route path="/gallery" element={<LazyRoute><LazyGallery /></LazyRoute>} />
                {/* /travel → 301 redirect to /tours to fix keyword cannibalization */}
                <Route path="/travel" element={<TravelRedirect />} />
                <Route path="/tours" element={<LazyRoute><LazyTours /></LazyRoute>} />
                <Route path="/tours/:slug" element={<LazyRoute><LazyTourDetail /></LazyRoute>} />
                <Route path="/xtsy-270" element={<LazyRoute><LazyXTSY270 /></LazyRoute>} />
                <Route path="/pet-friendly" element={<LazyRoute><LazyPetFriendly /></LazyRoute>} />
                <Route path="/xtsy-vs-zostel" element={<LazyRoute><LazyXTSYvsZostel /></LazyRoute>} />
                <Route path="/female-travellers" element={<LazyRoute><LazyFemaleTravellers /></LazyRoute>} />
                <Route path="/work-from-home" element={<LazyRoute><LazyWorkFromHome /></LazyRoute>} />
                <Route path="/xtsy-rentals" element={<LazyRoute><LazyXTSYRentals /></LazyRoute>} />
                <Route path="/tab-bistro" element={<LazyRoute><LazyTabBistro /></LazyRoute>} />
                <Route path="/tab-bistro/catering" element={<LazyRoute><LazyTabBistroCatering /></LazyRoute>} />
                <Route path="/catering-shillong" element={<LazyRoute><LazyTabBistroCatering /></LazyRoute>} />
                <Route path="/xtsy-adventure-campsite-dawki" element={<LazyRoute><LazyDawkiCampsite /></LazyRoute>} />
                
                <Route path="/privacy-policy" element={<LazyRoute><LazyPrivacyPolicy /></LazyRoute>} />
                <Route path="/privacy" element={<Navigate to="/privacy-policy" replace />} />
                <Route path="/terms-of-service" element={<LazyRoute><LazyTermsOfService /></LazyRoute>} />
                <Route path="/terms" element={<Navigate to="/terms-of-service" replace />} />
                <Route path="/pricing-cancellation-policy" element={<LazyRoute><LazyPricingCancellationPolicy /></LazyRoute>} />
                <Route path="/refund-cancellation-policy" element={<Navigate to="/pricing-cancellation-policy" replace />} />
                <Route path="/contact" element={<LazyRoute><LazyContact /></LazyRoute>} />
                <Route path="/contact-us" element={<Navigate to="/contact" replace />} />
                <Route path="/unsubscribe" element={<LazyRoute><LazyUnsubscribe /></LazyRoute>} />
                <Route path="/admin-login" element={<LazyRoute><AdminLogin /></LazyRoute>} />
                <Route path="/book" element={<LazyRoute><SimplifiedBookingFlow /></LazyRoute>} />
                <Route path="/book/select" element={<LazyRoute><LazyPropertySelector /></LazyRoute>} />
                <Route path="/book/campsite" element={<LazyRoute><LazyCampsiteBooking /></LazyRoute>} />
                
                {/* User Auth Routes */}
                <Route path="/auth" element={<LazyRoute><UserAuth /></LazyRoute>} />
                <Route path="/profile" element={<LazyRoute><UserProfile /></LazyRoute>} />
                
                {/* Admin Routes - Unified layout with hamburger menu */}
                <Route path="/admin" element={<LazyRoute><AdminOverview /></LazyRoute>} />
                <Route path="/admin/dashboard" element={<LazyRoute><AdminOverview /></LazyRoute>} />
                <Route path="/admin/analytics" element={<LazyRoute><AdminAnalytics /></LazyRoute>} />
                <Route path="/admin/analytics/search" element={<LazyRoute><AdminSearchConsole /></LazyRoute>} />
                <Route path="/admin/search" element={<LazyRoute><AdminSearchConsole /></LazyRoute>} />
                <Route path="/admin/bookings" element={<LazyRoute><AdminBookingsCalendar /></LazyRoute>} />
                <Route path="/admin/enquiries" element={<LazyRoute><AdminEnquiries /></LazyRoute>} />
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
                <Route path="/admin/tours" element={<LazyRoute><AdminTours /></LazyRoute>} />
                {/* Franchise Routes */}
                <Route path="/franchise/login" element={<LazyRoute><FranchiseLogin /></LazyRoute>} />
                <Route path="/franchise" element={<LazyRoute><FranchiseDashboard /></LazyRoute>} />
                
                {/* PWA Install Routes */}
                <Route path="/install" element={<LazyRoute><UserInstall /></LazyRoute>} />
                <Route path="/admin/install" element={<LazyRoute><AdminInstall /></LazyRoute>} />
                <Route path="/franchise/install" element={<LazyRoute><FranchiseInstall /></LazyRoute>} />
                
                {/* Admin Franchise Permissions */}
                <Route path="/admin/franchise-permissions" element={<LazyRoute><AdminFranchisePermissions /></LazyRoute>} />
                <Route path="/admin/seo" element={<LazyRoute><AdminSEODashboard /></LazyRoute>} />
                <Route path="/admin/seo/priority" element={<LazyRoute><AdminSEOPriority /></LazyRoute>} />
                <Route path="/admin/seo/recovery" element={<LazyRoute><AdminSEORecovery /></LazyRoute>} />
                <Route path="/admin/seo/gsc-errors" element={<LazyRoute><AdminGSCErrors /></LazyRoute>} />
                <Route path="/admin/seo/schema-results" element={<LazyRoute><AdminSchemaResults /></LazyRoute>} />
                <Route path="/admin/seo/hero-manager" element={<LazyRoute><AdminSEOHeroManager /></LazyRoute>} />
                
                {/* Meghalaya SEO Pages */}
                <Route path="/things-to-do-in-meghalaya" element={<LazyRoute><ThingsToDoInMeghalaya /></LazyRoute>} />
                <Route path="/places-to-visit/:slug" element={<LazyRoute><DestinationDetail /></LazyRoute>} />
                <Route path="/meghalaya-waterfalls" element={<LazyRoute><CategoryPage /></LazyRoute>} />
                <Route path="/meghalaya-caves" element={<LazyRoute><CategoryPage /></LazyRoute>} />
                <Route path="/meghalaya-villages" element={<LazyRoute><CategoryPage /></LazyRoute>} />
                <Route path="/meghalaya-viewpoints" element={<LazyRoute><CategoryPage /></LazyRoute>} />
                <Route path="/meghalaya-tour-packages" element={<LazyRoute><MeghalayaTourPackages /></LazyRoute>} />
                <Route path="/meghalaya-couple-tour-package" element={<LazyRoute><MeghalayaCoupleTourPackage /></LazyRoute>} />
                <Route path="/shillong-tour-package" element={<LazyRoute><ShillongTourPackage /></LazyRoute>} />
                <Route path="/best-time-to-visit-meghalaya" element={<LazyRoute><BlogBestTimeToVisit /></LazyRoute>} />
                <Route path="/hidden-places-in-meghalaya" element={<LazyRoute><BlogHiddenPlaces /></LazyRoute>} />
                <Route path="/3-day-meghalaya-itinerary" element={<LazyRoute><BlogItinerary3Day /></LazyRoute>} />
                <Route path="/5-day-meghalaya-itinerary" element={<LazyRoute><BlogItinerary5Day /></LazyRoute>} />
                <Route path="/budget-trip-to-meghalaya" element={<LazyRoute><BlogBudgetTrip /></LazyRoute>} />
                <Route path="/meghalaya-photo-gallery" element={<LazyRoute><MeghalayaPhotoGallery /></LazyRoute>} />
                
                {/* High-Intent SEO Landing Pages */}
                <Route path="/best-hostel-in-shillong" element={<LazyRoute><BestHostelShillong /></LazyRoute>} />
                <Route path="/hotels-in-shillong" element={<LazyRoute><HotelsInShillong /></LazyRoute>} />
                <Route path="/homestays-in-shillong" element={<LazyRoute><HomestaysInShillong /></LazyRoute>} />
                <Route path="/luxury-glamping-shillong" element={<LazyRoute><LuxuryGlampingShillong /></LazyRoute>} />
                <Route path="/destination-wedding-shillong" element={<LazyRoute><DestinationWeddingShillong /></LazyRoute>} />
                <Route path="/restaurant-in-shillong" element={<LazyRoute><LazyTabBistro /></LazyRoute>} />
                
                {/* Crawl Hub — All Pages Directory */}
                <Route path="/all-pages" element={<LazyRoute><AllPages /></LazyRoute>} />
                
                {/* Programmatic SEO Pages — 300+ keyword-targeted landing pages */}
                <Route path="/:slug" element={<LazyRoute><ProgrammaticSEOPage /></LazyRoute>} />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
              </RouteErrorBoundary>
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
