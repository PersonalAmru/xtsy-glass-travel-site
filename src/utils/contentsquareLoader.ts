/**
 * Contentsquare / Hotjar consent-gated loader
 *
 * Loads https://t.contentsquare.net/uxa/8a1781ba2e7b5.js ONLY after the user
 * has granted analytics consent (Google Consent Mode v2 — analytics_storage).
 *
 * Designed for projects whose analytics architecture uses GTM as the sole
 * routing authority (see project-knowledge). Two install paths are supported:
 *
 *   1. (Preferred) Add the same script as a Custom HTML tag inside GTM
 *      (container GTM-5FXJ9QBK), with the Trigger:
 *        - Trigger Type: Consent Initialization / All Pages
 *        - Built-in "Consent" -> Require additional consent: analytics_storage
 *      GTM will then handle gating natively. This loader becomes a no-op
 *      because it dedupes via window.__cs_uxa_loaded.
 *
 *   2. (Fallback / dev) This loader injects the script in the page after a
 *      `consent-update` event with analytics === true. Useful for local
 *      previews where GTM tags aren't published yet.
 *
 * Diagnostics: every step logs to console with the [CS-Loader] prefix so
 * it's easy to verify in DevTools whether/why the script loaded.
 */

const SCRIPT_URL = 'https://t.contentsquare.net/uxa/8a1781ba2e7b5.js';
const LOG = '[CS-Loader]';

declare global {
  interface Window {
    __cs_uxa_loaded?: boolean;
    _uxa?: unknown[];
  }
}

function hasAnalyticsConsent(): boolean {
  try {
    const stored = localStorage.getItem('xtsy_consent_v2');
    if (!stored) return false;
    const parsed = JSON.parse(stored);
    return parsed?.analytics === true;
  } catch {
    return false;
  }
}

function injectScript(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  if (window.__cs_uxa_loaded) {
    console.info(`${LOG} Skipped — already loaded (probably by GTM).`);
    return;
  }

  // If GTM has already injected the same src, skip.
  const existing = document.querySelector(`script[src="${SCRIPT_URL}"]`);
  if (existing) {
    window.__cs_uxa_loaded = true;
    console.info(`${LOG} Skipped — script tag already present in DOM.`);
    return;
  }

  window._uxa = window._uxa || [];
  const s = document.createElement('script');
  s.src = SCRIPT_URL;
  s.async = true;
  s.crossOrigin = 'anonymous';

  const t0 = performance.now();
  s.onload = () => {
    window.__cs_uxa_loaded = true;
    const dt = Math.round(performance.now() - t0);
    console.info(
      `%c${LOG} ✓ Contentsquare/Hotjar tag loaded`,
      'background:#22c55e;color:#fff;padding:2px 8px;border-radius:4px;',
      { src: SCRIPT_URL, ms: dt }
    );
  };
  s.onerror = (err) => {
    console.error(
      `%c${LOG} ✗ Failed to load Contentsquare/Hotjar tag`,
      'background:#ef4444;color:#fff;padding:2px 8px;border-radius:4px;',
      { src: SCRIPT_URL, error: err }
    );
  };

  document.head.appendChild(s);
  console.info(`${LOG} Injecting script (analytics consent granted).`);
}

/**
 * Initialise the consent-gated loader. Call once during app bootstrap.
 */
export function initContentsquareLoader(): void {
  if (typeof window === 'undefined') return;

  // Case 1: consent already granted from a previous session.
  if (hasAnalyticsConsent()) {
    injectScript();
  } else {
    console.info(`${LOG} Waiting — no analytics consent yet.`);
  }

  // Case 2: react when consent changes during the session.
  window.addEventListener('consent-update', (e: Event) => {
    const detail = (e as CustomEvent).detail;
    const granted = detail?.preferences?.analytics === true;
    console.info(`${LOG} consent-update received`, { analytics: granted });
    if (granted) injectScript();
  });
}
