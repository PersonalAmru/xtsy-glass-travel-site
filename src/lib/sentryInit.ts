/**
 * Sentry error monitoring, loaded after the page has finished loading.
 * Named imports (not `import * as Sentry`) so the bundler drops what we don't use —
 * session replay and the feedback widget were ~160 KB of unused code.
 */
import { init, browserTracingIntegration, captureMessage } from '@sentry/react';

export function initSentry() {
  const dsn =
    import.meta.env.VITE_SENTRY_DSN ||
    'https://de60ec1c757d6d0b6fd991d42d4b8e06@o4510659453911040.ingest.us.sentry.io/4510659499982848';
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
