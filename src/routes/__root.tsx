/**
 * Root route — TanStack Start migration of the old index.html <head>,
 * src/main.tsx init code, and src/App.tsx provider stack.
 */
import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import {
  ClientOnly,
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
  useLocation,
  useRouter,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { memo, Suspense, useEffect, type ReactNode } from "react";
import { trackAIReferral } from "@/utils/aiReferralTracking";
import { installChunkRecovery } from "@/utils/chunkRecovery";

import { HelmetProvider } from "react-helmet-async";

import appCss from "../styles.css?url";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import PerformanceMonitor from "@/components/PerformanceMonitor";
import SecurityHeadersProvider from "@/components/SecurityHeadersProvider";
import ErrorBoundary from "@/components/ErrorBoundary";
import RouteErrorBoundary from "@/components/RouteErrorBoundary";
import ConsentModal from "@/components/consent/ConsentModal";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import ChatLauncher from "@/components/v2/ChatLauncher";
import NotFound from "@/pages/NotFound";
import { AppProvider } from "@/contexts/AppContext";
import { HappyGuestsProvider } from "@/contexts/HappyGuestsContext";
import { UserAuthProvider } from "@/contexts/UserAuthContext";
import { EnhancedAnalyticsProvider } from "@/hooks/useEnhancedAnalytics";
import { TrafficAnalyticsProvider } from "@/hooks/useTrafficAnalytics";
import { ConversionSignalsProvider } from "@/providers/ConversionSignalsProvider";
import { useWebVitalsReporter } from "@/hooks/useWebVitalsReporter";
import { reportLovableError } from "@/lib/lovable-error-reporting";
import OptionalConsentDebugPanel from "@/components/debug/OptionalConsentDebugPanel";
import { CONSENT_BOOTSTRAP_SCRIPT, GTM_CONSENT_LOADER_SCRIPT } from "@/lib/consent";

// ---------------------------------------------------------------------------
// Inline head scripts ported verbatim from index.html
// ---------------------------------------------------------------------------

/** Loads the legacy Google Fonts stylesheet after first paint (it used to block every page). */
const LEGACY_FONTS_SCRIPT = `(function(){function add(){var l=document.createElement('link');l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Josefin+Sans:wght@300;400;500;600&display=swap';document.head.appendChild(l);}if(document.readyState==='complete')add();else window.addEventListener('load',add,{once:true});})();`;

const HYDRATED_CLASS_SCRIPT = `document.documentElement.classList.add('hydrated');`;

const DATALAYER_INIT_SCRIPT = `
window.dataLayer = window.dataLayer || [];
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

})();
`;

const JSONLD_WEBSITE = `{"@context":"https://schema.org","@type":"WebSite","name":"XTSY Travel","alternateName":"XTSY Travellers Hostel","url":"https://xtsy.one"}`;

const JSONLD_ORGANIZATION = `{"@context":"https://schema.org","@type":"Organization","@id":"https://xtsy.one/#organization","name":"XTSY Ventures Private Limited","alternateName":"XTSY","url":"https://xtsy.one","logo":"https://xtsy.one/lovable-uploads/160f683c-a41c-41fd-8bdb-700d74a7e027.png","email":"booking@xtsy.one","telephone":"+91-8837317070","address":{"@type":"PostalAddress","streetAddress":"Mawdiangdiang Road, New Shillong Township","addressLocality":"Shillong","addressRegion":"Meghalaya","postalCode":"793018","addressCountry":"IN"},"sameAs":["https://www.instagram.com/xtsy.one","https://www.facebook.com/xtsy.one","https://www.youtube.com/@xtsy-one","https://www.youtube.com/@XTSY_Voyage","https://www.tripadvisor.com/Hotel_Review-g15012368-d33031050-Reviews-Xtsy_Travellers_Hostel-Mawdiangdiang_East_Khasi_Hills_District_Meghalaya.html","https://www.hostelworld.com/hostels/p/333065/xtsy-travellers-hostel/"],"contactPoint":[{"@type":"ContactPoint","telephone":"+91-8837317070","contactType":"reservations","areaServed":"IN","availableLanguage":["en","hi"]}]}`;

// Critical above-the-fold CSS ported verbatim from index.html
const CRITICAL_CSS = `@layer base{*{margin:0;padding:0;box-sizing:border-box}html{font-family:system-ui,-apple-system,BlinkMacSystemFont,sans-serif;-webkit-font-smoothing:antialiased;text-rendering:optimizeSpeed}body{background:#faf7f2;color:#0f172a;min-height:100vh;overflow-x:hidden;overflow-y:auto;scrollbar-width:none;-ms-overflow-style:none}body::-webkit-scrollbar{display:none}#root{min-height:100vh;contain:style;background:#faf7f2}.dark{color-scheme:dark}img,video{max-width:100%;height:auto;display:block}@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}body.initial-load *{transition:none!important;animation-duration:.001ms!important;animation-delay:0ms!important}@supports (-webkit-touch-callout:none){input,select,textarea{font-size:16px!important}}.hero-bg{background:linear-gradient(135deg,#020617 0%,#0f172a 50%,#020617 100%)}:root{--primary:25 95% 53%;--primary-foreground:0 0% 100%}.hero-mountain-decoration::after{content:'';position:absolute;bottom:0;left:0;right:0;height:30%;opacity:.04;pointer-events:none;background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%23ffffff' d='M0,224L48,213.3C96,203,192,181,288,186.7C384,192,480,224,576,218.7C672,213,768,171,864,165.3C960,160,1056,192,1152,197.3C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'/%3E%3C/svg%3E") no-repeat bottom center;background-size:cover}}`;

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width,initial-scale=1,maximum-scale=5,viewport-fit=cover",
      },
      { name: "google-site-verification", content: "JLU2b52K22fmRO8ee75E59cZS03qghtetQtjo8h0oD8" },
      {
        name: "robots",
        content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
      },
      {
        name: "googlebot",
        content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
      },
      // NOTE: title/description/og:title/og:description/og:image/twitter:* are
      // intentionally NOT set here — each route owns its own via buildRouteHead.
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "XTSY Travel" },
      { property: "og:locale", content: "en_IN" },
      { property: "og:locale:alternate", content: "en_US" },
      { property: "og:locale:alternate", content: "en_GB" },
      { name: "twitter:card", content: "summary_large_image" },

      { name: "geo.region", content: "IN-ML" },
      { name: "geo.placename", content: "Shillong, Meghalaya, India" },
      { name: "geo.position", content: "25.6025457;91.9448902" },
      { name: "ICBM", content: "25.6025457, 91.9448902" },
      { name: "target", content: "all" },
      { name: "audience", content: "all" },
      { name: "coverage", content: "Worldwide" },
      { name: "distribution", content: "Global" },
      { name: "rating", content: "General" },
      { name: "author", content: "XTSY Travel" },
      { name: "publisher", content: "XTSY Travel" },
      { httpEquiv: "Accept-CH", content: "DPR,Width,Viewport-Width" },
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
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://kzhsxemkntfwsakhkylt.supabase.co", crossOrigin: "anonymous" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      // Brand fonts are self-hosted and preloaded so headlines render in Staatliches from the first paint.
      { rel: "preload", as: "font", type: "font/woff2", href: "/fonts/staatliches-latin.woff2", crossOrigin: "anonymous" },
      { rel: "preload", as: "font", type: "font/woff2", href: "/fonts/manrope-latin.woff2", crossOrigin: "anonymous" },
      // ₹ (U+20B9) lives in the latin-ext subset; every page shows prices, so
      // preload it too or the late swap shifts the layout (CLS).
      { rel: "preload", as: "font", type: "font/woff2", href: "/fonts/manrope-latin-ext.woff2", crossOrigin: "anonymous" },
      { rel: "preload", as: "font", type: "font/woff2", href: "/fonts/staatliches-latin-ext.woff2", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "/fonts/fonts.css" },
      // Legacy Playfair/Josefin fonts (older pages only) load after the page, not render-blocking:
      // see LEGACY_FONTS_SCRIPT.
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
    scripts: [
      { children: HYDRATED_CLASS_SCRIPT },
      { children: LEGACY_FONTS_SCRIPT },
      { children: CONSENT_BOOTSTRAP_SCRIPT },
      { children: DATALAYER_INIT_SCRIPT },
      { children: GTM_CONSENT_LOADER_SCRIPT },
      { type: "application/ld+json", children: JSONLD_WEBSITE },
      { type: "application/ld+json", children: JSONLD_ORGANIZATION },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: () => <NotFound statusCode={404} />,
  errorComponent: RootErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        <style dangerouslySetInnerHTML={{ __html: CRITICAL_CSS }} />
      </head>
      <body>
        {/* Skip to content link for accessibility (ported from index.html) */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[99999] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md focus:text-sm focus:font-medium"
        >
          Skip to content
        </a>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

// ported from main.tsx — deferred non-critical init (Sentry, Contentsquare, perf)
function initializeNonCritical() {
  // Non-critical work waits for the page's load event, then a delay, then an idle moment.
  // (A bare requestIdleCallback fires almost immediately on a slow connection — the main thread
  // is idle while images download — so this work used to compete with the hero image / LCP.)
  const scheduleIdleTask = (callback: () => void, delayAfterLoad = 2000) => {
    const idle = () =>
      typeof requestIdleCallback !== "undefined" ? requestIdleCallback(() => callback(), { timeout: 3000 }) : callback();
    const start = () => window.setTimeout(idle, delayAfterLoad);
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
  };

  const initSentry = async () => {
    if (import.meta.env.PROD) {
      const { initSentry: start } = await import("@/lib/sentryInit");
      start();
    }
  };

  scheduleIdleTask(initSentry, 3000);

  // Consent-gated Contentsquare loader — first REAL user interaction only;
  // synthetic audit agents (Lighthouse etc.) are skipped.
  const ua = navigator.userAgent || "";
  const isSyntheticAudit =
    /Chrome-Lighthouse|HeadlessChrome|PTST\/|Speed[ -]?Insights|GTmetrix|WebPageTest/i.test(ua) ||
    (navigator as unknown as { webdriver?: boolean }).webdriver === true ||
    /[?&](lh|lighthouse)=1\b/.test(window.location.search);

  if (!isSyntheticAudit) {
    const loadContentsquare = () => {
      import("@/utils/contentsquareLoader")
        .then(({ initContentsquareLoader }) => initContentsquareLoader())
        .catch(() => {
          /* non-fatal */
        });
    };
    const interactionEvents = ["pointerdown", "touchstart", "keydown", "click"] as const;
    let csFired = false;
    const fireCS = (evt?: Event) => {
      if (evt && evt.isTrusted === false) return;
      if (csFired) return;
      csFired = true;
      interactionEvents.forEach((e) => window.removeEventListener(e, fireCS as EventListener));
      loadContentsquare();
    };
    interactionEvents.forEach((e) =>
      window.addEventListener(e, fireCS as EventListener, { once: false, passive: true }),
    );
    scheduleIdleTask(() => fireCS(), 20000);
  }

  scheduleIdleTask(async () => {
    const [{ initializePerformanceEnhancements }, { initializePerformanceOptimizations }] =
      await Promise.all([
        import("@/utils/performanceEnhancer"),
        import("@/utils/performanceOptimizer"),
      ]);
    initializePerformanceEnhancements();
    initializePerformanceOptimizations();
  }, 5000);
}

let nonCriticalInitDone = false;

const WebVitalsBeacon = () => {
  useWebVitalsReporter();
  return null;
};

const RouteBoundary = memo(({ children }: { children: ReactNode }) => (
  <ErrorBoundary>
    <Suspense fallback={null}>{children}</Suspense>
  </ErrorBoundary>
));
RouteBoundary.displayName = "RouteBoundary";

function RootComponent() {
  const pathname = useLocation().pathname;
  // Every guest-facing surface (pages, account, consent, chat) uses the light
  // 2026 palette; admin and franchise consoles keep the dark theme.
  const isGuestPage = !/^\/(admin(?:\/|$)|admin-login(?:\/|$)|franchise(?:\/|$)|\.lovable(?:\/|$)|api(?:\/|$))/.test(pathname);
  // Recover from stale hashed chunks after a deploy (blank screen +
  // "Importing a module script failed"). Must run before anything lazy-loads.
  installChunkRecovery();

  // Label AI-assistant referrals (ChatGPT / Perplexity / Gemini …) for the
  // GA4 "AI assistant traffic" segment. Diagnostic only — never a conversion.
  useEffect(() => {
    trackAIReferral();
  }, []);


  useEffect(() => {
    if (nonCriticalInitDone) return;
    nonCriticalInitDone = true;
    const run = () => requestAnimationFrame(initializeNonCritical);
    if (document.readyState === "complete") {
      run();
    } else {
      window.addEventListener("load", run, { once: true });
    }
  }, []);

  return (
    <HelmetProvider>
      <AppProvider>
        <SecurityHeadersProvider
          config={{
            isDevelopment: import.meta.env.MODE === "development",
            enableHSTS: import.meta.env.MODE === "production",
          }}
        >
          <div className={isGuestPage ? "dark public-design" : "dark"} id="main-content">
            <ClientOnly fallback={null}>
              <PerformanceMonitor />
            </ClientOnly>
            <HappyGuestsProvider>
              <UserAuthProvider>
                <TrafficAnalyticsProvider>
                  <ConversionSignalsProvider>
                    <EnhancedAnalyticsProvider>
                      <ConsentModal />
                      <ClientOnly fallback={null}>
                        <Suspense fallback={null}>
                          <OptionalConsentDebugPanel />
                        </Suspense>
                      </ClientOnly>
                      <TooltipProvider>
                        <Toaster />
                        <Sonner />
                        <ClientOnly fallback={null}>
                          <WebVitalsBeacon />
                        </ClientOnly>
                        <RouteErrorBoundary
                          routeKey={typeof window !== "undefined" ? window.location.pathname : ""}
                        >
                          <RouteBoundary>
                             <div className={isGuestPage ? "public-design" : undefined}>
                               <Outlet />
                             </div>
                          </RouteBoundary>
                        </RouteErrorBoundary>
                        <FloatingWhatsApp />
                        {isGuestPage && <ChatLauncher />}
                      </TooltipProvider>
                    </EnhancedAnalyticsProvider>
                  </ConversionSignalsProvider>
                </TrafficAnalyticsProvider>
              </UserAuthProvider>
            </HappyGuestsProvider>
          </div>
        </SecurityHeadersProvider>
      </AppProvider>
    </HelmetProvider>
  );
}

function RootErrorComponent({ error, reset }: ErrorComponentProps) {
  const router = useRouter();

  console.error("[root-error]", error);

  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-2xl font-semibold">This page didn't load</h1>
      <p className="text-sm text-muted-foreground max-w-md text-center">
        {error instanceof Error ? error.message.slice(0, 200) : "An unexpected error occurred."}
      </p>
      <div className="flex gap-3">
        <button
          type="button"
          className="px-5 py-2.5 rounded-md bg-primary text-primary-foreground font-medium"
          onClick={() => {
            router.invalidate();
            reset();
          }}
        >
          Try again
        </button>
        <a href="/" className="px-5 py-2.5 rounded-md border border-border font-medium">
          Go home
        </a>
      </div>
    </div>
  );
}
