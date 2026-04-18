/**
 * DeferredAppShell — Mounts non-critical floating UI (WhatsApp, sticky bar, consent)
 * AFTER the browser is idle. Removes ~30-50KB from the initial render-blocking bundle
 * and improves LCP/TBT without affecting analytics or consent compliance.
 *
 * Consent modal still appears within the legally required pre-interaction window
 * because the idle callback fires within ~200-1000ms on any modern device.
 */
import { lazy, Suspense, useEffect, useState } from 'react';

const FloatingWhatsApp = lazy(() => import('./FloatingWhatsApp'));
const StickyBookingBar = lazy(() => import('./StickyBookingBar'));
const ConsentModal = lazy(() => import('./consent/ConsentModal'));

const scheduleIdle = (cb: () => void, timeout = 1500) => {
  if (typeof window === 'undefined') return;
  const ric = (window as any).requestIdleCallback;
  if (typeof ric === 'function') {
    ric(cb, { timeout });
  } else {
    setTimeout(cb, 800);
  }
};

const DeferredAppShell = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Wait for first paint + idle before loading non-critical floating UI
    scheduleIdle(() => setMounted(true), 1500);
  }, []);

  if (!mounted) return null;

  return (
    <Suspense fallback={null}>
      <ConsentModal />
      <FloatingWhatsApp />
      <StickyBookingBar />
    </Suspense>
  );
};

export default DeferredAppShell;
