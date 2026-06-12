/**
 * Run a callback only after the page has finished its critical render (post-LCP).
 *
 * Non-destructive performance helper: it defers low-priority work (analytics,
 * exchange-rate fetches) until the browser is idle AFTER the `load` event, so it
 * never competes with the LCP paint or blocks the main thread during first render.
 * The work still always runs — it is delayed, never dropped.
 */
export const deferUntilIdle = (cb: () => void, timeout = 3000): void => {
  if (typeof window === 'undefined') {
    cb();
    return;
  }

  const schedule = () => {
    const ric = (window as unknown as {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    }).requestIdleCallback;
    if (typeof ric === 'function') {
      ric(cb, { timeout });
    } else {
      setTimeout(cb, 200);
    }
  };

  if (document.readyState === 'complete') {
    schedule();
  } else {
    window.addEventListener('load', schedule, { once: true });
  }
};
