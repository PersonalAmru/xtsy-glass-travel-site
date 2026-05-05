/**
 * Contentsquare / Hotjar consent-gated loader (hardened)
 *
 * Loads https://t.contentsquare.net/uxa/8a1781ba2e7b5.js ONLY after the user
 * has granted analytics consent. The loader is fully fault-tolerant:
 *
 *   • If localStorage is unavailable or `xtsy_consent_v2` is missing/malformed,
 *     we fall back to Google Consent Mode v2 signals (gtag('get', ...) /
 *     window.dataLayer scan for the most recent `analytics_storage` value).
 *   • If the script is blocked by an ad blocker, fails CORS, or 4xx/5xx,
 *     we capture the error to Sentry, push a `cs_loader_error` dataLayer
 *     event, log to console, and the rest of the app continues normally
 *     (no throws bubble up — wrapped in try/catch).
 *   • Status is exposed on `window.__csLoader` for the in-app debug panel.
 *
 * Diagnostics: every step logs to console with the [CS-Loader] prefix.
 */

const SCRIPT_URL = 'https://t.contentsquare.net/uxa/8a1781ba2e7b5.js';
const LOG = '[CS-Loader]';

export type CSLoaderStatus = 'idle' | 'queued' | 'loading' | 'loaded' | 'blocked' | 'error';

export interface CSLoaderState {
  status: CSLoaderStatus;
  consentSource: 'localStorage' | 'consent-mode' | 'none' | 'unknown';
  analyticsConsent: boolean;
  lastError?: string;
  loadedAt?: number;
  durationMs?: number;
  attempts?: number;
  lastAttemptAt?: number;
}

declare global {
  interface Window {
    __cs_uxa_loaded?: boolean;
    _uxa?: unknown[];
    __csLoader?: CSLoaderState;
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

const state: CSLoaderState = {
  status: 'idle',
  consentSource: 'unknown',
  analyticsConsent: false,
};

function publish(patch: Partial<CSLoaderState>) {
  Object.assign(state, patch);
  if (typeof window !== 'undefined') {
    window.__csLoader = { ...state };
    try {
      window.dispatchEvent(new CustomEvent('cs-loader-state', { detail: { ...state } }));
    } catch { /* noop */ }
  }
}

/**
 * Hardened consent resolution.
 *  1. Try localStorage `xtsy_consent_v2` — accept multiple shapes:
 *       { analytics: boolean }
 *       { preferences: { analytics: boolean } }
 *       { analytics_storage: 'granted' | 'denied' }
 *  2. Fallback: scan `window.dataLayer` for the most recent
 *     `analytics_storage` consent signal (Google Consent Mode v2).
 *  3. Fallback: return `{ granted: false, source: 'none' }`.
 */
function resolveAnalyticsConsent(): { granted: boolean; source: CSLoaderState['consentSource'] } {
  // 1. localStorage
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem('xtsy_consent_v2') : null;
    if (raw) {
      const parsed = JSON.parse(raw);
      const granted =
        parsed?.analytics === true ||
        parsed?.preferences?.analytics === true ||
        parsed?.analytics_storage === 'granted' ||
        parsed?.analytics_storage === true;
      if (typeof granted === 'boolean') {
        return { granted, source: 'localStorage' };
      }
    }
  } catch (e) {
    console.warn(`${LOG} localStorage parse failed`, e);
  }

  // 2. Google Consent Mode v2 — scan dataLayer for latest signal
  try {
    const dl = (typeof window !== 'undefined' && window.dataLayer) || [];
    for (let i = dl.length - 1; i >= 0; i--) {
      const entry = dl[i];
      if (!entry) continue;
      // gtag arguments style: ['consent', 'update'|'default', { analytics_storage: ... }]
      if (Array.isArray(entry) && (entry[0] === 'consent') && entry[2]?.analytics_storage) {
        return { granted: entry[2].analytics_storage === 'granted', source: 'consent-mode' };
      }
      // Object style pushed by consentManagementService
      if (typeof entry === 'object' && entry.analytics_storage) {
        return { granted: entry.analytics_storage === 'granted', source: 'consent-mode' };
      }
    }
  } catch (e) {
    console.warn(`${LOG} dataLayer scan failed`, e);
  }

  return { granted: false, source: 'none' };
}

function reportFailure(reason: string, extra?: Record<string, unknown>) {
  const payload = {
    event: 'cs_loader_error',
    error_message: reason.slice(0, 200),
    consent_source: state.consentSource,
    analytics_consent: state.analyticsConsent,
    src: SCRIPT_URL,
    ...extra,
  };

  // 1. dataLayer (visible to GTM / GA4 debug)
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
  } catch { /* noop */ }

  // 2. Sentry (loaded lazily — may not yet be initialised, that's fine)
  try {
    import('@sentry/react')
      .then((Sentry) => {
        Sentry.captureMessage(`[CS-Loader] ${reason}`, {
          level: 'warning',
          tags: { component: 'contentsquare-loader' },
          extra: payload,
        });
      })
      .catch(() => { /* Sentry not available — non-fatal */ });
  } catch { /* noop */ }

  console.error(
    `%c${LOG} ✗ ${reason}`,
    'background:#ef4444;color:#fff;padding:2px 8px;border-radius:4px;',
    payload
  );
}

function injectScript(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  try {
    if (window.__cs_uxa_loaded) {
      console.info(`${LOG} Skipped — already loaded (probably by GTM).`);
      publish({ status: 'loaded' });
      return;
    }

    const existing = document.querySelector(`script[src="${SCRIPT_URL}"]`);
    if (existing) {
      window.__cs_uxa_loaded = true;
      console.info(`${LOG} Skipped — script tag already present in DOM.`);
      publish({ status: 'loaded' });
      return;
    }

    window._uxa = window._uxa || [];
    const s = document.createElement('script');
    s.src = SCRIPT_URL;
    s.async = true;
    s.crossOrigin = 'anonymous';

    const t0 = performance.now();
    publish({ status: 'loading' });

    s.onload = () => {
      window.__cs_uxa_loaded = true;
      const dt = Math.round(performance.now() - t0);
      publish({ status: 'loaded', loadedAt: Date.now(), durationMs: dt });
      console.info(
        `%c${LOG} ✓ Contentsquare/Hotjar tag loaded`,
        'background:#22c55e;color:#fff;padding:2px 8px;border-radius:4px;',
        { src: SCRIPT_URL, ms: dt }
      );
    };
    s.onerror = (err) => {
      // Most ad/script-blockers surface as an `error` event with no useful detail.
      const blocked = navigator?.onLine !== false; // online but blocked → likely blocker
      publish({
        status: blocked ? 'blocked' : 'error',
        lastError: 'script onerror (network/blocked/CORS)',
      });
      reportFailure('Failed to load Contentsquare/Hotjar tag', {
        navigator_online: navigator?.onLine,
        likely_blocker: blocked,
        raw: String(err),
      });
      // Graceful fallback — remove the broken tag so retries can happen later.
      try { s.remove(); } catch { /* noop */ }
    };

    document.head.appendChild(s);
    console.info(`${LOG} Injecting script (analytics consent granted).`);
  } catch (e: any) {
    publish({ status: 'error', lastError: e?.message || String(e) });
    reportFailure('Unexpected exception during script injection', { stack: e?.stack });
  }
}

/**
 * Initialise the consent-gated loader. Call once during app bootstrap.
 * Wrapped end-to-end in try/catch — never throws, never blocks the app.
 */
export function initContentsquareLoader(): void {
  if (typeof window === 'undefined') return;

  try {
    const { granted, source } = resolveAnalyticsConsent();
    publish({ analyticsConsent: granted, consentSource: source, status: granted ? 'queued' : 'idle' });
    console.info(`${LOG} init — consent=${granted} source=${source}`);

    if (granted) {
      injectScript();
    } else {
      console.info(`${LOG} Waiting — no analytics consent yet.`);
    }

    // React to runtime consent changes.
    window.addEventListener('consent-update', (e: Event) => {
      try {
        const detail = (e as CustomEvent).detail;
        const grantedNow =
          detail?.preferences?.analytics === true ||
          detail?.analytics === true ||
          detail?.analytics_storage === 'granted';
        publish({ analyticsConsent: !!grantedNow, consentSource: 'localStorage' });
        console.info(`${LOG} consent-update received`, { analytics: grantedNow });
        if (grantedNow) injectScript();
      } catch (err: any) {
        reportFailure('consent-update handler crashed', { stack: err?.stack });
      }
    });
  } catch (e: any) {
    // Absolute last-resort guard — the app must never break because of this loader.
    publish({ status: 'error', lastError: e?.message || String(e) });
    reportFailure('init crashed', { stack: e?.stack });
  }
}

/** Read-only snapshot of loader state — used by the debug panel. */
export function getCSLoaderState(): CSLoaderState {
  return { ...state };
}
