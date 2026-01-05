import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import * as Sentry from "@sentry/react";
import App from "./App.tsx";
import "./styles/tailwind.css";
import "./styles/typography.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "@/contexts/AppContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import { initializePerformanceOptimizations } from "./utils/performanceOptimizer";
import { initializeImageOptimizations } from "./utils/imageOptimization";
import { initializePerformanceEnhancements } from "./utils/performanceEnhancer";
import { initializeAdvancedLazyLoading } from "./utils/lazyLoadingOptimizer";
import { initializeNetworkOptimizations } from "./utils/networkOptimizer";
import { prefetchRouteChunks } from "./utils/bundleOptimization";
import { performGlobalCleanup } from "./utils/performanceCleanup";
import { cleanupUnifiedImage } from "./components/UnifiedImage";
import { initializeCriticalImageLoading, preloadLCPImage } from "./utils/criticalImagePreloader";

// Initialize Sentry only in production
const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN || "https://de60ec1c757d6d0b6fd991d42d4b8e06@o4510659453911040.ingest.us.sentry.io/4510659499982848";

if (import.meta.env.PROD && SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: import.meta.env.MODE,
    
    // Integrations
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: true, // Mask all text to prevent PII leakage
        blockAllMedia: true, // Block media to prevent PII in images
      }),
    ],
    
    // Performance monitoring
    tracesSampleRate: 0.1, // 10% of transactions
    tracePropagationTargets: ["localhost", /^https:\/\/.*\.lovableproject\.com/, /^https:\/\/.*\.lovable\.app/],
    
    // Session replay - errors only
    replaysSessionSampleRate: 0, // Don't record normal sessions
    replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors
    
    // Privacy - do not log PII
    sendDefaultPii: false,
    
    // Custom tags
    initialScope: {
      tags: {
        app: "xtsy",
        surface: "bookingflow",
      },
    },
    
    // Ignore common noise errors
    ignoreErrors: [
      // ResizeObserver errors
      "ResizeObserver loop limit exceeded",
      "ResizeObserver loop completed with undelivered notifications",
      // Network errors
      "NetworkError when attempting to fetch resource",
      "Failed to fetch",
      "Load failed",
      "Network request failed",
      // Browser extension errors
      /^chrome-extension:\/\//,
      /^moz-extension:\/\//,
      // Common browser errors
      "Non-Error promise rejection captured",
      "cancelled",
    ],
    
    // Filter out noisy transactions
    beforeSend(event) {
      // Don't send events from browser extensions
      if (event.request?.url?.includes('chrome-extension://')) {
        return null;
      }
      return event;
    },
  });
}

// LCP OPTIMIZATION: Preload LCP image IMMEDIATELY before anything else
// This runs synchronously at module load time for fastest possible LCP
preloadLCPImage();

// Polyfill for Safari which doesn't support requestIdleCallback
const scheduleIdleTask = (callback: () => void) => {
  if (typeof requestIdleCallback !== 'undefined') {
    requestIdleCallback(callback);
  } else {
    setTimeout(callback, 1);
  }
};

// Initialize remaining critical images in idle time
scheduleIdleTask(() => {
  initializeCriticalImageLoading();
});

// Defer non-critical optimizations
if (document.readyState === 'complete') {
  initializeOptimizations();
} else {
  window.addEventListener('load', initializeOptimizations, { once: true });
}

function initializeOptimizations() {
  // Run after first paint for faster initial load
  scheduleIdleTask(() => {
    initializeImageOptimizations();
    initializePerformanceEnhancements();
    initializeAdvancedLazyLoading();
    initializeNetworkOptimizations();
    initializePerformanceOptimizations();
    // Prefetch common route chunks for faster navigation
    prefetchRouteChunks();
  });
}

// Add cleanup on app exit
window.addEventListener('beforeunload', () => {
  performGlobalCleanup();
  cleanupUnifiedImage();
});

// Optimize QueryClient for high-concurrency production traffic
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000, // 10 minutes - reduce refetching
      gcTime: 30 * 60 * 1000, // 30 minutes - keep data longer
      retry: 1, // Reduce retries for faster failures
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnMount: false, // Don't refetch on component mount
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AppProvider>
            <App />
          </AppProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>,
);
