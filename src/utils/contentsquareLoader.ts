/**
 * Contentsquare / Hotjar consent-gated loader (hardened, first-party aware)
 *
 * Loads the Contentsquare/Hotjar UXA tag ONLY after the user has granted
 * analytics consent. The loader is fully fault-tolerant:
 *
 *   • FIRST-PARTY FIRST: on the production domain it loads the tag from
 *     `/cs/uxa/<id>.js` (proxied by the Cloudflare Worker → cs-proxy edge
 *     function). This defeats domain-based blocklists that target
 *     `contentsquare.net`. If the first-party path fails it falls back to the
 *     direct CDN URL.
 *   • Consent resolution falls back from localStorage `xtsy_consent_v2` to
 *     Google Consent Mode v2 signals on `window.dataLayer`.
 *   • Every terminal outcome (loaded / blocked / error) is classified with a
 *     `blockReason` (consent / offline / extension-or-dns / csp / unknown) and
 *     recorded to Supabase (`analytics_loader_events`) for admin review.
 *   • Status is exposed on `window.__csLoader` for the in-app debug panel.
 *
 * Diagnostics: every step logs to console with the [CS-Loader] prefix.
 */
import { SELF_TRACKING_ENABLED } from '@/lib/selfTracking';

const TAG_ID = '8a1781ba2e7b5';
const CDN_URL = `https://t.contentsquare.net/uxa/${TAG_ID}.js`;
const FIRST_PARTY_PATH = `/cs/uxa/${TAG_ID}.js`;
const LOG = '[CS-Loader]';

export type CSLoaderStatus = 'idle' | 'queued' | 'loading' | 'loaded' | 'blocked' | 'error';
export type CSBlockReason = 'none' | 'consent' | 'offline' | 'extension-or-dns' | 'csp' | 'unknown';

export interface CSLoaderState {
  status: CSLoaderStatus;
  consentSource: 'localStorage' | 'consent-mode' | 'none' | 'unknown';
  analyticsConsent: boolean;
  blockReason: CSBlockReason;
  usedFirstParty: boolean;
  activeUrl?: string;
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
  blockReason: 'none',
  usedFirstParty: false,
};

// Set true if a CSP violation is observed for one of our script URLs.
let cspViolationSeen = false;

function publish(patch: Partial<CSLoaderState>) {
  Object.assign(state, patch);
  if (typeof window !== 'undefined') {
    window.__csLoader = { ...state };
    try {
      window.dispatchEvent(new CustomEvent('cs-loader-state', { detail: { ...state } }));
    } catch { /* noop */ }
  }
}

/** Is the first-party `/cs/...` proxy available for this host? */
function firstPartyAvailable(): boolean {
  try {
    const h = window.location.hostname;
    return h === 'xtsy.one' || h.endsWith('.xtsy.one');
  } catch {
    return false;
  }
}

/** Ordered list of candidate script URLs to try. */
function candidateUrls(): Array<{ url: string; firstParty: boolean }> {
  const list: Array<{ url: string; firstParty: boolean }> = [];
  if (firstPartyAvailable()) list.push({ url: FIRST_PARTY_PATH, firstParty: true });
  list.push({ url: CDN_URL, firstParty: false });
  return list;
}

/** Lightweight device / browser classification (no fingerprinting). */
function deviceInfo(): { deviceType: string; browser: string } {
  let deviceType = 'desktop';
  let browser = 'unknown';
  try {
    const ua = navigator.userAgent || '';
    if (/iPad|Tablet/i.test(ua)) deviceType = 'tablet';
    else if (/Mobi|Android|iPhone/i.test(ua)) deviceType = 'mobile';

    if (/Edg\//i.test(ua)) browser = 'edge';
    else if (/OPR\/|Opera/i.test(ua)) browser = 'opera';
    else if (/Brave/i.test(ua) || (navigator as any).brave) browser = 'brave';
    else if (/Chrome\//i.test(ua)) browser = 'chrome';
    else if (/Firefox\//i.test(ua)) browser = 'firefox';
    else if (/Safari\//i.test(ua)) browser = 'safari';
  } catch { /* noop */ }
  return { deviceType, browser };
}

/**
 * Hardened consent resolution.
 *  1. localStorage `xtsy_consent_v2` (multiple shapes accepted).
 *  2. Google Consent Mode v2 — latest `analytics_storage` on dataLayer.
 *  3. `{ granted: false, source: 'none' }`.
 */
function resolveAnalyticsConsent(): { granted: boolean; source: CSLoaderState['consentSource'] } {
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

  try {
    const dl = (typeof window !== 'undefined' && window.dataLayer) || [];
    for (let i = dl.length - 1; i >= 0; i--) {
      const entry = dl[i];
      if (!entry) continue;
      if (Array.isArray(entry) && (entry[0] === 'consent') && entry[2]?.analytics_storage) {
        return { granted: entry[2].analytics_storage === 'granted', source: 'consent-mode' };
      }
      if (typeof entry === 'object' && entry.analytics_storage) {
        return { granted: entry.analytics_storage === 'granted', source: 'consent-mode' };
      }
    }
  } catch (e) {
    console.warn(`${LOG} dataLayer scan failed`, e);
  }

  return { granted: false, source: 'none' };
}

/** Classify why a load attempt failed. */
function classifyBlockReason(): CSBlockReason {
  if (!state.analyticsConsent) return 'consent';
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return 'offline';
  if (cspViolationSeen) return 'csp';
  // Online + consented + no CSP violation + onerror → almost always an
  // ad blocker / privacy extension or DNS-level filter dropped the request.
  return 'extension-or-dns';
}

/** Record a terminal loader outcome to Supabase (best-effort, never throws). */
let lastLoggedSignature = '';
function recordEvent(status: CSLoaderStatus, blockReason: CSBlockReason) {
  try {
    // De-dupe identical consecutive outcomes within a page view.
    const sig = `${status}:${blockReason}:${state.usedFirstParty}`;
    if (sig === lastLoggedSignature) return;
    lastLoggedSignature = sig;

    const { deviceType, browser } = deviceInfo();
    const payload = {
      tag: 'contentsquare',
      status,
      block_reason: blockReason === 'none' ? null : blockReason,
      consent_source: state.consentSource,
      analytics_consent: state.analyticsConsent,
      attempts: state.attempts ?? null,
      duration_ms: state.durationMs ?? null,
      source_url: state.activeUrl ?? null,
      used_first_party: state.usedFirstParty,
      user_agent: (navigator?.userAgent || '').slice(0, 500),
      device_type: deviceType,
      browser,
      online: navigator?.onLine ?? null,
      page_path: (window.location?.pathname || '').slice(0, 300),
      error_message: state.lastError ? state.lastError.slice(0, 300) : null,
    };

    if (!SELF_TRACKING_ENABLED) return;
    import('@/integrations/supabase/client')
      .then(({ supabase }) => supabase.from('analytics_loader_events').insert(payload))
      .then((res: any) => {
        if (res?.error) console.warn(`${LOG} event insert failed`, res.error.message);
      })
      .catch(() => { /* analytics logging is best-effort */ });
  } catch { /* noop */ }
}

function reportFailure(reason: string, extra?: Record<string, unknown>) {
  const payload = {
    event: 'cs_loader_error',
    error_message: reason.slice(0, 200),
    consent_source: state.consentSource,
    analytics_consent: state.analyticsConsent,
    block_reason: state.blockReason,
    used_first_party: state.usedFirstParty,
    src: state.activeUrl ?? CDN_URL,
    ...extra,
  };

  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
  } catch { /* noop */ }

  try {
    import('@/lib/sentryInit')
      .then(({ captureWarning }) => {
        captureWarning(`[CS-Loader] ${reason}`, { component: 'contentsquare-loader' }, payload as Record<string, unknown>);
      })
      .catch(() => { /* Sentry not available — non-fatal */ });
  } catch { /* noop */ }

  console.error(
    `%c${LOG} ✗ ${reason}`,
    'background:#ef4444;color:#fff;padding:2px 8px;border-radius:4px;',
    payload
  );
}

let candidateIndex = 0;
let totalAttempts = 0;

function injectScript(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  try {
    if (window.__cs_uxa_loaded) {
      console.info(`${LOG} Skipped — already loaded (probably by GTM).`);
      publish({ status: 'loaded' });
      return;
    }

    const existing = document.querySelector(
      `script[src="${CDN_URL}"], script[src="${FIRST_PARTY_PATH}"], script[src*="t.contentsquare.net"]`
    );
    if (existing) {
      window.__cs_uxa_loaded = true;
      console.info(`${LOG} Skipped — script tag already present in DOM.`);
      publish({ status: 'loaded' });
      return;
    }

    const candidates = candidateUrls();
    if (candidateIndex >= candidates.length) {
      const blockReason = classifyBlockReason();
      publish({
        status: blockReason === 'offline' ? 'error' : 'blocked',
        blockReason,
        lastError: `all ${candidates.length} candidate URL(s) failed (${blockReason})`,
      });
      reportFailure('Failed to load Contentsquare/Hotjar tag', {
        candidates: candidates.map((c) => c.url),
        attempts: totalAttempts,
        block_reason: blockReason,
      });
      recordEvent(state.status, blockReason);
      return;
    }

    const { url, firstParty } = candidates[candidateIndex];
    totalAttempts += 1;
    const attemptNum = totalAttempts;

    window._uxa = window._uxa || [];
    const s = document.createElement('script');
    s.src = url;
    s.async = true;

    const t0 = performance.now();
    publish({
      status: 'loading',
      attempts: attemptNum,
      lastAttemptAt: Date.now(),
      activeUrl: url,
      usedFirstParty: firstParty,
    });
    console.info(`${LOG} Attempt ${attemptNum} — injecting ${firstParty ? 'first-party' : 'CDN'} script: ${url}`);

    s.onload = () => {
      window.__cs_uxa_loaded = true;
      const dt = Math.round(performance.now() - t0);
      publish({ status: 'loaded', blockReason: 'none', loadedAt: Date.now(), durationMs: dt });
      console.info(
        `%c${LOG} ✓ Contentsquare/Hotjar tag loaded`,
        'background:#22c55e;color:#fff;padding:2px 8px;border-radius:4px;',
        { src: url, ms: dt, attempt: attemptNum, firstParty }
      );
      recordEvent('loaded', 'none');
    };

    s.onerror = (err) => {
      console.warn(`${LOG} ✗ Candidate failed: ${url}`, { firstParty, raw: String(err) });
      try { s.remove(); } catch { /* noop */ }
      candidateIndex += 1;
      publish({ lastError: `candidate "${url}" failed — trying next` });
      // Try the next candidate immediately (CDN fallback after first-party).
      injectScript();
    };

    document.head.appendChild(s);
  } catch (e: any) {
    publish({ status: 'error', blockReason: 'unknown', lastError: e?.message || String(e) });
    reportFailure('Unexpected exception during script injection', { stack: e?.stack });
    recordEvent('error', 'unknown');
  }
}

/** Watch for CSP violations targeting our script URLs (improves block reason). */
function installCspWatcher() {
  try {
    document.addEventListener('securitypolicyviolation', (e: SecurityPolicyViolationEvent) => {
      const uri = e.blockedURI || '';
      if (uri.includes('contentsquare.net') || uri.includes('/cs/uxa/') || uri.includes('/cs-proxy/')) {
        cspViolationSeen = true;
        console.warn(`${LOG} CSP violation observed for`, uri, '— directive:', e.violatedDirective);
        if (state.status === 'blocked' || state.status === 'error') {
          publish({ blockReason: 'csp' });
        }
      }
    });
  } catch { /* noop */ }
}

/**
 * Initialise the consent-gated loader. Call once during app bootstrap.
 * Wrapped end-to-end in try/catch — never throws, never blocks the app.
 */
export function initContentsquareLoader(): void {
  if (typeof window === 'undefined') return;

  try {
    installCspWatcher();
    const { granted, source } = resolveAnalyticsConsent();
    publish({ analyticsConsent: granted, consentSource: source, status: granted ? 'queued' : 'idle' });
    console.info(`${LOG} init — consent=${granted} source=${source} firstParty=${firstPartyAvailable()}`);

    if (granted) {
      injectScript();
    } else {
      console.info(`${LOG} Waiting — no analytics consent yet.`);
    }

    window.addEventListener('consent-update', (e: Event) => {
      try {
        const detail = (e as CustomEvent).detail;
        const grantedNow =
          detail?.preferences?.analytics === true ||
          detail?.analytics === true ||
          detail?.analytics_storage === 'granted';
        publish({ analyticsConsent: !!grantedNow, consentSource: 'localStorage' });
        console.info(`${LOG} consent-update received`, { analytics: grantedNow });
        if (grantedNow) {
          // Reset candidate cursor so a freshly-consented user gets a clean run.
          candidateIndex = 0;
          injectScript();
        }
      } catch (err: any) {
        reportFailure('consent-update handler crashed', { stack: err?.stack });
      }
    });
  } catch (e: any) {
    publish({ status: 'error', blockReason: 'unknown', lastError: e?.message || String(e) });
    reportFailure('init crashed', { stack: e?.stack });
  }
}

/** Read-only snapshot of loader state — used by the debug panel. */
export function getCSLoaderState(): CSLoaderState {
  return { ...state };
}

/** Human-readable explanation of the current block reason. */
export function describeBlockReason(reason: CSBlockReason): string {
  switch (reason) {
    case 'none': return 'Not blocked — tag loaded or pending.';
    case 'consent': return 'Analytics consent not granted (tag intentionally withheld).';
    case 'offline': return 'Device is offline — network unavailable.';
    case 'extension-or-dns': return 'Request dropped client-side — ad blocker / privacy extension (uBlock, Brave Shields, AdGuard) or DNS filter (Pi-hole, NextDNS).';
    case 'csp': return 'Blocked by Content Security Policy — the script origin is not allow-listed.';
    default: return 'Unknown — script onerror fired with no further signal.';
  }
}
