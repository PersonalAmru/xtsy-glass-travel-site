/**
 * ConsentDebugPanel
 * Floating debug widget showing:
 *   - Current consent preferences (xtsy_consent_v2)
 *   - Google Consent Mode v2 last signal
 *   - Contentsquare/Hotjar loader status (queued/loading/loaded/blocked/error)
 *   - WHY a tag was blocked (consent / offline / extension-or-dns / csp)
 *   - A one-click copyable diagnostic report
 *
 * Visibility (any of):
 *   • URL has `?debug=consent` or `?debug=hotjar`
 *   • localStorage `xtsy_debug_consent` / `xtsy_debug_hotjar` === 'true'
 *   • dev mode (import.meta.env.DEV)
 */
import { useEffect, useState } from 'react';
import {
  getCSLoaderState,
  describeBlockReason,
  type CSLoaderState,
} from '@/utils/contentsquareLoader';

const STATUS_COLORS: Record<CSLoaderState['status'], string> = {
  idle: 'bg-slate-400',
  queued: 'bg-amber-400',
  loading: 'bg-blue-400 animate-pulse',
  loaded: 'bg-emerald-500',
  blocked: 'bg-rose-500',
  error: 'bg-rose-600',
};

function readConsent(): unknown {
  try {
    const raw = localStorage.getItem('xtsy_consent_v2');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function readGCMSignal(): string {
  try {
    const dl = (window as any).dataLayer || [];
    for (let i = dl.length - 1; i >= 0; i--) {
      const e = dl[i];
      if (e?.analytics_storage) return String(e.analytics_storage);
      if (Array.isArray(e) && e[0] === 'consent' && e[2]?.analytics_storage) {
        return String(e[2].analytics_storage);
      }
    }
  } catch { /* noop */ }
  return 'unknown';
}

function shouldShow(): boolean {
  if (typeof window === 'undefined') return false;
  if (import.meta.env.DEV) return true;
  try {
    const url = new URL(window.location.href);
    const dbg = url.searchParams.get('debug');
    if (dbg === 'consent' || dbg === 'hotjar') return true;
    if (localStorage.getItem('xtsy_debug_consent') === 'true') return true;
    if (localStorage.getItem('xtsy_debug_hotjar') === 'true') return true;
  } catch { /* noop */ }
  return false;
}

export default function ConsentDebugPanel() {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [loader, setLoader] = useState<CSLoaderState>(getCSLoaderState());
  const [consent, setConsent] = useState<unknown>(readConsent());
  const [gcm, setGcm] = useState<string>(readGCMSignal());
  const [copied, setCopied] = useState(false);
  const [csvDone, setCsvDone] = useState(false);
  /** When true, only include non-empty diagnostic fields in the CSV. */
  const [csvFilterEmpty, setCsvFilterEmpty] = useState(true);

  useEffect(() => {
    setVisible(shouldShow());
    if (!shouldShow()) return;

    const tick = () => {
      setLoader(getCSLoaderState());
      setConsent(readConsent());
      setGcm(readGCMSignal());
    };

    const onLoaderState = () => tick();
    const onConsent = () => tick();
    window.addEventListener('cs-loader-state', onLoaderState);
    window.addEventListener('consent-update', onConsent);
    const id = window.setInterval(tick, 2000);
    tick();

    return () => {
      window.removeEventListener('cs-loader-state', onLoaderState);
      window.removeEventListener('consent-update', onConsent);
      window.clearInterval(id);
    };
  }, []);

  const buildReport = (): string => {
    const scriptInDom = !!document.querySelector(
      'script[src*="t.contentsquare.net"], script[src*="/cs/uxa/"]'
    );
    const report = {
      generatedAt: new Date().toISOString(),
      page: window.location.href,
      loaderStatus: loader.status,
      blockReason: loader.blockReason,
      blockReasonExplained: describeBlockReason(loader.blockReason),
      usedFirstParty: loader.usedFirstParty,
      activeUrl: loader.activeUrl ?? null,
      consentSource: loader.consentSource,
      analyticsConsent: loader.analyticsConsent,
      gcmAnalyticsStorage: gcm,
      attempts: loader.attempts ?? null,
      durationMs: loader.durationMs ?? null,
      lastError: loader.lastError ?? null,
      scriptInDom,
      online: navigator.onLine,
      userAgent: navigator.userAgent,
      consentRecord: consent,
    };
    return JSON.stringify(report, null, 2);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildReport());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Fallback: select-all in a temporary textarea
      try {
        const ta = document.createElement('textarea');
        ta.value = buildReport();
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      } catch { /* noop */ }
    }
  };

  /** Flatten the diagnostic report into [field, value] rows (filtered). */
  const buildCsvRows = (): Array<[string, string]> => {
    const scriptInDom = !!document.querySelector(
      'script[src*="t.contentsquare.net"], script[src*="/cs/uxa/"]'
    );
    const consentRecord = (consent && typeof consent === 'object') ? (consent as Record<string, unknown>) : {};
    const raw: Array<[string, unknown]> = [
      ['generatedAt', new Date().toISOString()],
      ['page', window.location.href],
      ['loaderStatus', loader.status],
      ['blockReason', loader.blockReason],
      ['blockReasonExplained', describeBlockReason(loader.blockReason)],
      ['usedFirstParty', loader.usedFirstParty],
      ['activeUrl', loader.activeUrl ?? ''],
      ['consentSource', loader.consentSource],
      ['analyticsConsent', loader.analyticsConsent],
      ['gcmAnalyticsStorage', gcm],
      ['attempts', loader.attempts ?? ''],
      ['durationMs', loader.durationMs ?? ''],
      ['lastError', loader.lastError ?? ''],
      ['scriptInDom', scriptInDom],
      ['online', navigator.onLine],
      ['userAgent', navigator.userAgent],
      ['consent.necessary', consentRecord['necessary'] ?? ''],
      ['consent.analytics', consentRecord['analytics'] ?? ''],
      ['consent.marketing', consentRecord['marketing'] ?? ''],
      ['consent.personalization', consentRecord['personalization'] ?? ''],
      ['consent.timestamp', consentRecord['timestamp'] ?? ''],
      ['consent.version', consentRecord['version'] ?? ''],
    ];
    return raw
      .filter(([, v]) => !csvFilterEmpty || (v !== '' && v !== null && v !== undefined))
      .map(([k, v]) => [k, String(v)] as [string, string]);
  };

  const buildCsv = (): string => {
    const esc = (s: string) => `"${s.replace(/"/g, '""')}"`;
    const rows = [['field', 'value'], ...buildCsvRows()];
    return rows.map((r) => r.map(esc).join(',')).join('\r\n');
  };

  const handleDownloadCsv = () => {
    try {
      const blob = new Blob([buildCsv()], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const stamp = new Date().toISOString().replace(/[:.]/g, '-');
      a.href = url;
      a.download = `cs-loader-diagnostic-${stamp}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setCsvDone(true);
      window.setTimeout(() => setCsvDone(false), 1800);
    } catch { /* noop */ }
  };

  const isBlocked = loader.status === 'blocked' || loader.status === 'error';

  return (
    <div
      style={{ position: 'fixed', bottom: 12, left: 12, zIndex: 999999, fontFamily: 'ui-monospace, monospace' }}
      aria-label="Consent & CS-Loader debug"
    >
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-full bg-slate-900/90 text-white text-xs px-3 py-2 shadow-lg hover:bg-slate-800"
        >
          <span className={`inline-block w-2 h-2 rounded-full ${STATUS_COLORS[loader.status]}`} />
          CS: {loader.status}
        </button>
      ) : (
        <div className="w-[340px] rounded-lg bg-slate-900/95 text-slate-100 text-xs shadow-2xl border border-slate-700">
          <div className="flex items-center justify-between px-3 py-2 border-b border-slate-700">
            <strong className="text-[11px] uppercase tracking-wider">Consent & CS Loader</strong>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-slate-400 hover:text-white"
              aria-label="Close debug panel"
            >
              ×
            </button>
          </div>
          <div className="p-3 space-y-2">
            <div className="flex items-center gap-2">
              <span className={`inline-block w-2 h-2 rounded-full ${STATUS_COLORS[loader.status]}`} />
              <span className="font-semibold">Loader:</span>
              <span>{loader.status}</span>
            </div>

            {/* WHY blocked — the key diagnostic */}
            {isBlocked && (
              <div className="rounded border border-rose-700/60 bg-rose-950/40 p-2 space-y-1">
                <div className="text-rose-300 font-semibold">
                  Reason: {loader.blockReason}
                </div>
                <div className="text-rose-200/90 text-[11px] leading-snug">
                  {describeBlockReason(loader.blockReason)}
                </div>
              </div>
            )}

            <div>
              <span className="text-slate-400">Served from:</span>{' '}
              {loader.usedFirstParty ? 'first-party /cs/' : 'CDN'}
            </div>
            <div><span className="text-slate-400">Active URL:</span> <span className="break-all">{loader.activeUrl ?? '—'}</span></div>
            <div><span className="text-slate-400">Consent source:</span> {loader.consentSource}</div>
            <div><span className="text-slate-400">Analytics consent:</span> {String(loader.analyticsConsent)}</div>
            <div><span className="text-slate-400">GCM analytics_storage:</span> {gcm}</div>
            {loader.attempts != null && (
              <div><span className="text-slate-400">Attempts:</span> {loader.attempts}</div>
            )}
            {loader.durationMs != null && (
              <div><span className="text-slate-400">Load time:</span> {loader.durationMs}ms</div>
            )}
            {loader.lastError && (
              <div className="text-rose-300 break-words">err: {loader.lastError}</div>
            )}
            <div>
              <span className="text-slate-400">Script in DOM:</span>{' '}
              {String(!!document.querySelector('script[src*="t.contentsquare.net"], script[src*="/cs/uxa/"]'))}
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="mt-1 w-full rounded bg-slate-700 hover:bg-slate-600 text-white text-[11px] py-1.5 transition-colors"
            >
              {copied ? '✓ Copied report' : 'Copy diagnostic report'}
            </button>

            <details className="mt-2">
              <summary className="cursor-pointer text-slate-400">xtsy_consent_v2</summary>
              <pre className="mt-1 max-h-40 overflow-auto whitespace-pre-wrap break-words text-[10px] bg-slate-950/60 p-2 rounded">
{JSON.stringify(consent, null, 2) || 'null'}
              </pre>
            </details>
            <div className="pt-2 text-[10px] text-slate-500">
              Toggle with <code>?debug=hotjar</code>, <code>?debug=consent</code>, or <code>localStorage.xtsy_debug_hotjar='true'</code>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
