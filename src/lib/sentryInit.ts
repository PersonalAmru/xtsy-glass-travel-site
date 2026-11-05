/**
 * Sentry error monitoring, loaded after the page has finished loading.
 * Named imports (not `import * as Sentry`) so the bundler drops what we don't use —
 * session replay and the feedback widget were ~160 KB of unused code.
 */
import { init, browserTracingIntegration, captureMessage } from '@sentry/react';

export function initSentry() {
  // Do not ship a fallback DSN: an invalid/stale project key produces repeated
  // 403s in production. Enable Sentry only when the deployment supplies a valid DSN.
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn) {
    if (import.meta.env.DEV) console.info('[Sentry] Disabled — VITE_SENTRY_DSN is not configured.');
    return;
  }
  init({
    dsn,
    environment: import.meta.env.MODE,
    integrations: [browserTracingIntegration()],
    tracesSampleRate: 0.05,
    sendDefaultPii: false,
    ignoreErrors: [
      'ResizeObserver loop limit exceeded',
      'ResizeObserver loop completed with undelivered notifications',
      'Failed to fetch',
      'Load failed',
      'NetworkError',
      /^chrome-extension:\/\//,
      /^moz-extension:\/\//,
    ],
  });
}

/** Report a non-fatal warning (no-op until Sentry has initialised). */
export function captureWarning(message: string, tags: Record<string, string>, extra: Record<string, unknown>) {
  captureMessage(message, { level: 'warning', tags, extra });
}
