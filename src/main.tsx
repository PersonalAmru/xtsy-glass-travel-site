import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
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
