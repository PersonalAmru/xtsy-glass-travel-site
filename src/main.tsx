import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./styles/tailwind.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "@/contexts/AppContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { initializePerformanceOptimizations } from "./utils/performanceOptimizer";
import { initializeImageOptimizations } from "./utils/imageOptimization";
import { initializePerformanceEnhancements } from "./utils/performanceEnhancer";
import { initializeAdvancedLazyLoading } from "./utils/lazyLoadingOptimizer";
import { initializeNetworkOptimizations } from "./utils/networkOptimizer";
import { performGlobalCleanup } from "./utils/performanceCleanup";
import { cleanupUnifiedImage } from "./components/UnifiedImage";

// Initialize only essential optimizations
if (process.env.NODE_ENV === 'development') {
  initializeImageOptimizations();
} else {
  // Production: minimal optimizations only
  initializeImageOptimizations();
}

// Add cleanup on app exit
window.addEventListener('beforeunload', () => {
  performGlobalCleanup();
  cleanupUnifiedImage();
});

// Optimize QueryClient for high traffic
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 2,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </AppProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
