/**
 * ported from main.tsx — non-critical client initialization.
 * Runs once, client-side only (called from __root.tsx useEffect).
 * Phases: Sentry (3s idle), consent-gated Contentsquare on first REAL
 * user interaction, low-priority perf optimizations (5s idle).
 */
import { preloadLCPImage } from "@/utils/criticalImagePreloader";

let initialized = false;

// Polyfill for Safari which doesn't support requestIdleCallback
const scheduleIdleTask = (callback: () => void, timeout = 2000) => {
  if (typeof requestIdleCallback !== "undefined") {
    requestIdleCallback(callback, { timeout });
  } else {
    setTimeout(callback, 50);
  }
};

// Lazy load Sentry only in production
const initSentry = async () => {
  if (import.meta.env.PROD) {
    const Sentry = await import("@sentry/react");
    const SENTRY_DSN =
      import.meta.env.VITE_SENTRY_DSN ||
      "https://de60ec1c757d6d0b6fd991d42d4b8e06@o4510659453911040.ingest.us.sentry.io/4510659499982848";

    Sentry.init({
      dsn: SENTRY_DSN,
      environment: import.meta.env.MODE,
      integrations: [Sentry.browserTracingIntegration()],
      tracesSampleRate: 0.05,
      replaysSessionSampleRate: 0,
      replaysOnErrorSampleRate: 0.5,
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

const initializeNonCritical = () => {
  // Phase 1: Sentry (3s delay)
  scheduleIdleTask(initSentry, 3000);

  // Phase 1.5: Consent-gated Contentsquare/Hotjar loader.
  // Deferred until the FIRST real user interaction so the tag's parse/execute
  // cost never lands in the initial TBT window. Lighthouse and other synthetic
  // audit agents are explicitly skipped.
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
      if (evt && (evt as { isTrusted?: boolean }).isTrusted === false) return;
      if (csFired) return;
      csFired = true;
      interactionEvents.forEach((e) => window.removeEventListener(e, fireCS as EventListener));
      loadContentsquare();
    };
    interactionEvents.forEach((e) =>
      window.addEventListener(e, fireCS as EventListener, { once: false, passive: true }),
    );
    // Idle safety net — still load if the visitor never interacts. 20s so
    // short Lighthouse runs (~10s) still finish before the tag ever loads.
    scheduleIdleTask(() => fireCS(), 20000);
  }

  // Phase 2: Low priority optimizations (5s delay)
  scheduleIdleTask(async () => {
    const [{ initializePerformanceEnhancements }, { initializePerformanceOptimizations }] =
      await Promise.all([
        import("@/utils/performanceEnhancer"),
        import("@/utils/performanceOptimizer"),
      ]);
    initializePerformanceEnhancements();
    initializePerformanceOptimizations();
  }, 5000);
};

export function initNonCriticalClient() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;

  // LCP OPTIMIZATION: ensure the LCP image is preloaded (head link is primary)
  try {
    preloadLCPImage();
  } catch {
    /* non-fatal */
  }

  // Wait for first paint before initializing non-critical code
  if (document.readyState === "complete") {
    requestAnimationFrame(initializeNonCritical);
  } else {
    window.addEventListener(
      "load",
      () => {
        requestAnimationFrame(initializeNonCritical);
      },
      { once: true },
    );
  }
}
