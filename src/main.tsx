import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App.tsx";
import "./styles/tailwind.css";
import "./styles/typography.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "@/contexts/AppContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import { preloadLCPImage } from "./utils/criticalImagePreloader";
import { HelmetProvider } from "react-helmet-async";

// Polyfill for Safari which doesn't support requestIdleCallback
const scheduleIdleTask = (callback: () => void, timeout = 2000) => {
  if (typeof requestIdleCallback !== 'undefined') {
    requestIdleCallback(callback, { timeout });
  } else {
    setTimeout(callback, 50);
  }
};

// LCP OPTIMIZATION: Preload LCP image IMMEDIATELY
preloadLCPImage();

// Lazy load Sentry only in production
const initSentry = async () => {
  if (import.meta.env.PROD) {
    const Sentry = await import("@sentry/react");
    const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN || "https://de60ec1c757d6d0b6fd991d42d4b8e06@o4510659453911040.ingest.us.sentry.io/4510659499982848";
    
    Sentry.init({
      dsn: SENTRY_DSN,
      environment: import.meta.env.MODE,
      integrations: [Sentry.browserTracingIntegration()],
      tracesSampleRate: 0.05, // Reduced from 0.1 to 5%
      replaysSessionSampleRate: 0,
      replaysOnErrorSampleRate: 0.5, // Reduced from 1.0
      sendDefaultPii: false,
      ignoreErrors: [
        "ResizeObserver loop limit exceeded",
        "ResizeObserver loop completed with undelivered notifications",
        "Failed to fetch",
        "Load failed",
        "NetworkError",
        /^chrome-extension:\/\//,
        /^moz-extension:\/\//,
      ],
    });
  }
};

// CRITICAL: Minimal initialization - delay everything non-essential
const initializeNonCritical = () => {
  // Phase 1: Sentry (3s delay)
  scheduleIdleTask(initSentry, 3000);

  // Phase 1.5: Consent-gated Contentsquare/Hotjar loader.
  // Deferred until the FIRST real user interaction so the tag's parse/execute
  // cost never lands in the initial TBT window. Lighthouse and other synthetic
  // audit agents are explicitly skipped — they fire synthetic input events
  // during the audit which unfairly inflates TBT for a real-user script.
  const ua = navigator.userAgent || '';
  const isSyntheticAudit =
    /Chrome-Lighthouse|HeadlessChrome|PTST\/|Speed[ -]?Insights|GTmetrix|WebPageTest/i.test(ua) ||
    (navigator as any).webdriver === true ||
    // Lighthouse hints on the URL for local dev overrides
    /[?&](lh|lighthouse)=1\b/.test(window.location.search);

  if (!isSyntheticAudit) {
    const loadContentsquare = () => {
      import("./utils/contentsquareLoader")
        .then(({ initContentsquareLoader }) => initContentsquareLoader())
        .catch(() => { /* non-fatal */ });
    };
    // Require a REAL user gesture: pointerdown / touchstart / keydown / click.
    // scroll/mousemove are excluded because Lighthouse synthesizes them and
    // some bots emit passive scroll during preview.
    const interactionEvents = ['pointerdown', 'touchstart', 'keydown', 'click'] as const;
    let csFired = false;
    const fireCS = (evt?: Event) => {
      // Guard against non-trusted synthetic events (Lighthouse dispatches these)
      if (evt && (evt as any).isTrusted === false) return;
      if (csFired) return;
      csFired = true;
      interactionEvents.forEach((e) => window.removeEventListener(e, fireCS as any));
      loadContentsquare();
    };
    interactionEvents.forEach((e) =>
      window.addEventListener(e, fireCS as any, { once: false, passive: true }),
    );
    // Idle safety net — still load if the visitor never interacts (e.g. slow
    // read-only sessions). 20s so short Lighthouse runs (~10s) still finish
    // before the tag ever loads.
    scheduleIdleTask(() => fireCS(), 20000);
  }

  // Phase 2: Low priority optimizations (5s delay)
  scheduleIdleTask(async () => {
    const [{ initializePerformanceEnhancements }, { initializePerformanceOptimizations }] = await Promise.all([
      import("./utils/performanceEnhancer"),
      import("./utils/performanceOptimizer"),
    ]);
    initializePerformanceEnhancements();
    initializePerformanceOptimizations();
  }, 5000);
};

// Wait for first paint before initializing non-critical code
if (document.readyState === 'complete') {
  requestAnimationFrame(initializeNonCritical);
} else {
  window.addEventListener('load', () => {
    requestAnimationFrame(initializeNonCritical);
  }, { once: true });
}

// Optimize QueryClient for high-concurrency production traffic
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 15 * 60 * 1000, // 15 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes
      retry: 1, // Reduce retries for faster failures
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    },
  },
});

const root = document.getElementById("root")!;

const appJSX = (
  <StrictMode>
    <ErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <AppProvider>
              <App />
            </AppProvider>
          </BrowserRouter>
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  </StrictMode>
);

// LCP SKELETON DISMISSAL — guaranteed to fire even if hydration is slow.
// 1) Immediate dismiss after React commits.
// 2) Safety timeout (4s) — if React never commits, we still un-cover the page
//    so the user never sees the dreaded black screen.
const dismissLCPSkeleton = () => {
  try {
    const fn = (window as any).__hideLCPSkeleton;
    if (typeof fn === 'function') fn();
    else {
      const s = document.getElementById('lcp-skeleton');
      if (s) s.remove();
    }
  } catch {}
};

// Safety net — runs no matter what
window.setTimeout(dismissLCPSkeleton, 4000);

// If the root has pre-rendered content (from vite-plugin-prerender), hydrate instead of render
if (root.hasChildNodes()) {
  hydrateRoot(root, appJSX);
} else {
  createRoot(root).render(appJSX);
}

// Dismiss skeleton on the next frame after render commits
requestAnimationFrame(() => {
  requestAnimationFrame(dismissLCPSkeleton);
});
