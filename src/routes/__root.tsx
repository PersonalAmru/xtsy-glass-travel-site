/**
 * Root route — ported from pre-migration index.html (head) + main.tsx / App.tsx
 * (provider stack, init code) during the TanStack Start migration.
 *
 * Notes:
 * - LCP skeleton + noscript SEO fallback from index.html were dropped: SSR now
 *   streams real HTML, which supersedes both.
 * - registerServiceWorker() is intentionally NOT called — public/sw.js is the
 *   migration kill-switch and must not be re-registered on fresh visits.
 * - Per-page canonical/meta remains owned by React Helmet (SEOHead.tsx) on the
 *   client; the head() below carries the site-wide defaults.
 */
import { lazy, Suspense, useEffect, useState } from "react";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
  useRouter,
} from "@tanstack/react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import type { QueryClient } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import type { ReactNode } from "react";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "@/components/ErrorBoundary";
import RouteErrorBoundary from "@/components/RouteErrorBoundary";
import PerformanceMonitor from "@/components/PerformanceMonitor";
import SecurityHeadersProvider from "@/components/SecurityHeadersProvider";
import ConsentModal from "@/components/consent/ConsentModal";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import NotFound from "@/pages/NotFound";
import { AppProvider } from "@/contexts/AppContext";
import { HappyGuestsProvider } from "@/contexts/HappyGuestsContext";
import { UserAuthProvider } from "@/contexts/UserAuthContext";
import { TrafficAnalyticsProvider } from "@/hooks/useTrafficAnalytics";
import { ConversionSignalsProvider } from "@/providers/ConversionSignalsProvider";
import { EnhancedAnalyticsProvider } from "@/hooks/useEnhancedAnalytics";
import { useWebVitalsReporter } from "@/hooks/useWebVitalsReporter";
import { logger } from "@/utils/piiRedactedLogger";
import { preloadCriticalResources, optimizeFontLoading } from "@/utils/bundleOptimization";
import { performGlobalCleanup } from "@/utils/performanceCleanup";
import { cleanupUnifiedImage } from "@/components/UnifiedImage";
import { initNonCriticalClient } from "@/lib/client-init";
import { reportLovableError } from "@/lib/lovable-error-reporting";

import appCss from "../styles.css?url";

const ConsentDebugPanel = lazy(() => import("@/components/debug/ConsentDebugPanel"));

const SITE_TITLE = "XTSY — Best Hostel in Shillong, Meghalaya";
const SITE_DESC =
  "India's biggest hostel in Shillong, Meghalaya. Budget dorms from ₹369, luxury 270° glass suite & curated Northeast India tours. Book direct.";
const OG_IMAGE =
  "https://storage.googleapis.com/gpt-engineer-file-uploads/1WJsBBRRZpg9MH8fICqqeJ2sC6q1/social-images/social-1765259372136-with_padding.png";

// Critical above-the-fold styles — ported verbatim from index.html
const CRITICAL_CSS = `*{margin:0;padding:0;box-sizing:border-box}
html{font-family:system-ui,-apple-system,BlinkMacSystemFont,sans-serif;-webkit-font-smoothing:antialiased;text-rendering:optimizeSpeed}
body{background:#faf7f2;color:#0f172a;min-height:100vh;overflow-x:hidden;overflow-y:auto;scrollbar-width:none;-ms-overflow-style:none}
body::-webkit-scrollbar{display:none}
#root{min-height:100vh;contain:style;background:#faf7f2}
.dark{color-scheme:dark}
img,video{max-width:100%;height:auto;display:block}
@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
body.initial-load *{transition:none!important;animation-duration:.001ms!important;animation-delay:0ms!important}
@supports (-webkit-touch-callout:none){input,select,textarea{font-size:16px!important}}
.hero-bg{background:linear-gradient(135deg,#020617 0%,#0f172a 50%,#020617 100%)}
:root{--primary:25 95% 53%;--primary-foreground:0 0% 100%}
.hero-mountain-decoration::after{content:'';position:absolute;bottom:0;left:0;right:0;height:30%;opacity:.04;pointer-events:none;background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%23ffffff' d='M0,224L48,213.3C96,203,192,181,288,186.7C384,192,480,224,576,218.7C672,213,768,171,864,165.3C960,160,1056,192,1152,197.3C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'/%3E%3C/svg%3E") no-repeat bottom center;background-size:cover}`;

// Lovable-admin detection + GDPR/DPDP Consent Mode v2 defaults — MUST run before GTM
const CONSENT_INIT_SCRIPT = `window.dataLayer = window.dataLayer || [];
(function() {
  var params = new URLSearchParams(window.location.search);
  var isLovable = params.has('__lovable_token') || params.has('forceHideBadge') || params.has('__lovable');
  if (sessionStorage.getItem('xtsy_is_lovable_session') === 'true') { isLovable = true; }
  if (!isLovable && document.referrer) {
    try {
      var ref = new URL(document.referrer);
      if (ref.hostname.indexOf('lovable.dev') !== -1 || ref.hostname.indexOf('lovable.app') !== -1 || ref.hostname.indexOf('gptengineer.app') !== -1) { isLovable = true; }
    } catch(e) {}
  }
  window.__isLovableAdmin = isLovable;
  if (isLovable) { sessionStorage.setItem('xtsy_is_lovable_session', 'true'); }
  dataLayer.push({
    'event': 'xtsy_init',
    'is_admin_session': isLovable,
    'page_path': window.location.pathname,
    'page_url': window.location.href,
    'page_title': document.title,
    'timestamp': new Date().toISOString(),
    'user_agent': navigator.userAgent,
    'screen_resolution': screen.width + 'x' + screen.height,
    'viewport_size': window.innerWidth + 'x' + window.innerHeight
  });
  dataLayer.push({
    'event': 'consent_default',
    'analytics_storage': 'denied',
    'ad_storage': 'denied',
    'ad_user_data': 'denied',
    'ad_personalization': 'denied',
    'functionality_storage': 'granted',
    'security_storage': 'granted',
    'wait_for_update': 2000
  });
  try {
    var storedConsent = localStorage.getItem('xtsy_consent_v2');
    if (storedConsent) {
      var prefs = JSON.parse(storedConsent);
      dataLayer.push({
        'event': 'consent_update',
        'analytics_storage': 'granted',
        'ad_storage': prefs.marketing ? 'granted' : 'denied',
        'ad_user_data': prefs.marketing ? 'granted' : 'denied',
        'ad_personalization': prefs.personalization ? 'granted' : 'denied',
        'functionality_storage': 'granted',
        'security_storage': 'granted'
      });
    }
  } catch(e) {}
})();`;

// GTM — interaction-gated for LCP/TBT protection (GTM-5FXJ9QBK single authority)
const GTM_LOADER_SCRIPT = `(function(w,d,s,l){
  var loaded = false;
  function loadGTM(){
    if (loaded) return; loaded = true;
    cleanup();
    var containerId = w.__isLovableAdmin ? 'GTM-MS23NHMF' : 'GTM-5FXJ9QBK';
    w.__activeGTMContainer = containerId;
    w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
    var f=d.getElementsByTagName(s)[0],j=d.createElement(s),
    dl=l!='dataLayer'?'&l='+l:'';j.async=true;
    j.src='https://www.googletagmanager.com/gtm.js?id='+containerId+dl;
    f.parentNode.insertBefore(j,f);
  }
  var events = ['pointerdown','touchstart','keydown','scroll','mousemove','visibilitychange'];
  var opts = { once: true, passive: true, capture: true };
  function cleanup(){ events.forEach(function(e){ try { w.removeEventListener(e, loadGTM, opts); } catch(_){} }); }
  events.forEach(function(e){ w.addEventListener(e, loadGTM, opts); });
  setTimeout(loadGTM, 10000);
})(window,document,'script','dataLayer');`;

const RAZORPAY_LOADER_SCRIPT = `window.loadRazorpay=function(c){if(window.Razorpay){c();return}var s=document.createElement('script');s.src='https://checkout.razorpay.com/v1/checkout.js';s.onload=c;document.head.appendChild(s)};`;

// JSON-LD — ported verbatim from index.html
const LD_WEBSITE = `{"@context":"https://schema.org","@type":"WebSite","name":"XTSY Travel","alternateName":"XTSY Travellers Hostel","url":"https://xtsy.one","potentialAction":{"@type":"SearchAction","target":{"@type":"EntryPoint","urlTemplate":"https://xtsy.one/search?q={search_term_string}"},"query-input":"required name=search_term_string"}}`;
const LD_HOSTEL = `{"@context":"https://schema.org","@type":"Hostel","name":"XTSY Travellers Hostel","url":"https://xtsy.one","logo":"https://xtsy.one/lovable-uploads/160f683c-a41c-41fd-8bdb-700d74a7e027.png","telephone":"+91-8837317070","priceRange":"₹369 - ₹4,999","address":{"@type":"PostalAddress","streetAddress":"Mawdiangdiang Road, New Shillong Township","addressLocality":"Shillong","addressRegion":"Meghalaya","addressCountry":"IN","postalCode":"793018"},"geo":{"@type":"GeoCoordinates","latitude":25.5788,"longitude":91.8933},"aggregateRating":{"@type":"AggregateRating","ratingValue":"4.8","ratingCount":"320","reviewCount":"189","bestRating":"5"}}`;
const LD_ORG = `{"@context":"https://schema.org","@type":"Organization","name":"XTSY ONE Ventures Pvt Ltd","alternateName":"XTSY","url":"https://xtsy.one","logo":"https://xtsy.one/lovable-uploads/160f683c-a41c-41fd-8bdb-700d74a7e027.png","email":"hello@xtsy.one","telephone":"+91-8837317070","address":{"@type":"PostalAddress","streetAddress":"Mawdiangdiang Road, New Shillong Township","addressLocality":"Shillong","addressRegion":"Meghalaya","postalCode":"793018","addressCountry":"IN"},"sameAs":["https://www.instagram.com/xtsy.one","https://www.facebook.com/xtsy.one","https://www.youtube.com/@xtsy-one"],"contactPoint":[{"@type":"ContactPoint","telephone":"+91-8837317070","contactType":"reservations","areaServed":"IN","availableLanguage":["en","hi"]}]}`;
const LD_RESTAURANT = `{"@context":"https://schema.org","@type":"Restaurant","name":"TAB Bistro by XTSY","url":"https://xtsy.one/tab-bistro","image":"https://xtsy.one/lovable-uploads/160f683c-a41c-41fd-8bdb-700d74a7e027.png","servesCuisine":["Indian","Continental","Khasi","Cafe"],"priceRange":"₹₹","telephone":"+91-8837317070","address":{"@type":"PostalAddress","streetAddress":"Mawdiangdiang Road, New Shillong Township","addressLocality":"Shillong","addressRegion":"Meghalaya","postalCode":"793018","addressCountry":"IN"},"geo":{"@type":"GeoCoordinates","latitude":25.5788,"longitude":91.8933},"openingHoursSpecification":[{"@type":"OpeningHoursSpecification","dayOfWeek":["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],"opens":"07:00","closes":"22:30"}],"acceptsReservations":true,"aggregateRating":{"@type":"AggregateRating","ratingValue":"4.7","reviewCount":"142","bestRating":"5"}}`;

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width,initial-scale=1,maximum-scale=5,viewport-fit=cover",
      },
      { name: "google-site-verification", content: "JLU2b52K22fmRO8ee75E59cZS03qghtetQtjo8h0oD8" },
      { title: SITE_TITLE },
      { name: "description", content: SITE_DESC },
      {
        name: "robots",
        content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
      },
      {
        name: "googlebot",
        content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
      },
      { property: "og:type", content: "website" },
      { property: "og:title", content: SITE_TITLE },
      { property: "og:description", content: SITE_DESC },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:url", content: "https://xtsy.one" },
      { property: "og:site_name", content: "XTSY Travel" },
      { property: "og:locale", content: "en_IN" },
      { property: "og:locale:alternate", content: "en_US" },
      { property: "og:locale:alternate", content: "en_GB" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: SITE_TITLE },
      { name: "twitter:description", content: SITE_DESC },
      { name: "twitter:image", content: OG_IMAGE },
      { name: "geo.region", content: "IN-ML" },
      { name: "geo.placename", content: "Shillong, Meghalaya, India" },
      { name: "geo.position", content: "25.5788;91.8933" },
      { name: "ICBM", content: "25.5788, 91.8933" },
      { name: "target", content: "all" },
      { name: "audience", content: "all" },
      { name: "coverage", content: "Worldwide" },
      { name: "distribution", content: "Global" },
      { name: "rating", content: "General" },
      { name: "author", content: "XTSY Travel" },
      { name: "publisher", content: "XTSY Travel" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "apple-mobile-web-app-title", content: "XTSY Hostel" },
      { name: "theme-color", content: "#000000" },
      { name: "msapplication-navbutton-color", content: "#000000" },
      {
        name: "screen-spanning",
        content: "single-fold-vertical | single-fold-horizontal | none",
      },
      { httpEquiv: "Accept-CH", content: "DPR,Width,Viewport-Width" },
    ],
    links: [
      // Preconnects (max 3, Lighthouse guidance)
      { rel: "preconnect", href: "https://kzhsxemkntfwsakhkylt.supabase.co", crossOrigin: "anonymous" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      // LCP CRITICAL: hero brand symbol
      {
        rel: "preload",
        as: "image",
        href: "/lovable-uploads/8059ea95-b64d-4eba-8b12-52e002c59567.avif",
        fetchPriority: "high",
        type: "image/avif",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Josefin+Sans:wght@300;400;500;600&display=swap",
      },
      { rel: "stylesheet", href: appCss },
      {
        rel: "icon",
        type: "image/png",
        href: "https://storage.googleapis.com/gpt-engineer-file-uploads/1WJsBBRRZpg9MH8fICqqeJ2sC6q1/uploads/1765259352370-with_padding.png",
      },
      { rel: "apple-touch-icon", href: "/xtsy-favicon.png" },
      { rel: "dns-prefetch", href: "//www.googletagmanager.com" },
      { rel: "dns-prefetch", href: "//checkout.razorpay.com" },
      { rel: "dns-prefetch", href: "//wa.me" },
      { rel: "alternate", hrefLang: "en", href: "https://xtsy.one/" },
      { rel: "alternate", hrefLang: "en-IN", href: "https://xtsy.one/" },
      { rel: "alternate", hrefLang: "x-default", href: "https://xtsy.one/" },
    ],
    styles: [{ children: CRITICAL_CSS }],
    scripts: [
      { children: "document.documentElement.classList.add('hydrated');" },
      { children: CONSENT_INIT_SCRIPT },
      { children: GTM_LOADER_SCRIPT },
      { children: RAZORPAY_LOADER_SCRIPT },
      { type: "application/ld+json", children: LD_WEBSITE },
      { type: "application/ld+json", children: LD_HOSTEL },
      { type: "application/ld+json", children: LD_ORG },
      { type: "application/ld+json", children: LD_RESTAURANT },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFound,
  errorComponent: RootErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {/* Skip to content link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[99999] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md focus:text-sm focus:font-medium"
        >
          Skip to content
        </a>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5FXJ9QBK"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="gtm"
          />
        </noscript>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

// RUM (Real User Monitoring) — captures Web Vitals per route.
function WebVitalsBeacon() {
  useWebVitalsReporter();
  return null;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const [hydrated, setHydrated] = useState(false);

  // ported from App.tsx — first-paint bootstrapping
  useEffect(() => {
    setHydrated(true);
    document.body.classList.add("initial-load");

    preloadCriticalResources();
    optimizeFontLoading();
    // registerServiceWorker() intentionally omitted — public/sw.js is now the
    // PWA kill-switch; the browser's own SW update polling delivers it.

    logger.security("app_initialized", {
      environment: import.meta.env.MODE,
      timestamp: new Date().toISOString(),
      security_headers_enabled: true,
      pii_redaction_enabled: true,
    });

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.body.classList.remove("initial-load");
      });
    });

    // ported from main.tsx — Sentry, Contentsquare gating, perf enhancers
    initNonCriticalClient();

    return () => {
      performGlobalCleanup();
      cleanupUnifiedImage();
    };
  }, []);

  return (
    <ErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <AppProvider>
            <SecurityHeadersProvider
              config={{
                isDevelopment: import.meta.env.MODE === "development",
                enableHSTS: import.meta.env.MODE === "production",
              }}
            >
              <div className="dark" id="main-content">
                <PerformanceMonitor />
                <HappyGuestsProvider>
                  <UserAuthProvider>
                    <TrafficAnalyticsProvider>
                      <ConversionSignalsProvider>
                        <EnhancedAnalyticsProvider>
                          <ConsentModal />
                          {hydrated && (
                            <Suspense fallback={null}>
                              <ConsentDebugPanel />
                            </Suspense>
                          )}
                          <TooltipProvider>
                            <Toaster />
                            <Sonner />
                            <WebVitalsBeacon />
                            <RouteErrorBoundary
                              routeKey={typeof window !== "undefined" ? window.location.pathname : ""}
                            >
                              <Outlet />
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
          </AppProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

function RootErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-6">
      <div className="max-w-md w-full text-center space-y-4">
        <h1 className="text-2xl font-bold">This page didn't load</h1>
        <p className="text-sm text-muted-foreground break-words">
          {error?.message?.slice(0, 200) || "An unexpected error occurred."}
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium"
            onClick={() => {
              router.invalidate();
              reset();
            }}
          >
            Try again
          </button>
          <a
            href="/"
            className="px-4 py-2 rounded-md border border-border text-sm font-medium"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}
