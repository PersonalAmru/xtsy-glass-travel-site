/**
 * ConsentDebugPanel
 * Floating debug widget showing:
 *   - Current consent preferences (xtsy_consent_v2)
 *   - Google Consent Mode v2 last signal
 *   - Contentsquare/Hotjar loader status (queued/loading/loaded/blocked/error)
 *
 * Visibility (any of):
 *   • URL has `?debug=consent`
 *   • localStorage `xtsy_debug_consent` === 'true'
 *   • dev mode (import.meta.env.DEV)
 */
import { useEffect, useState } from 'react';
import { getCSLoaderState, type CSLoaderState } from '@/utils/contentsquareLoader';

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
    if (url.searchParams.get('debug') === 'consent') return true;
    if (localStorage.getItem('xtsy_debug_consent') === 'true') return true;
  } catch { /* noop */ }
  return false;
}

export default function ConsentDebugPanel() {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [loader, setLoader] = useState<CSLoaderState>(getCSLoaderState());
  const [consent, setConsent] = useState<unknown>(readConsent());
  const [gcm, setGcm] = useState<string>(readGCMSignal());

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

  if (!visible) return null;

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
        <div className="w-[320px] rounded-lg bg-slate-900/95 text-slate-100 text-xs shadow-2xl border border-slate-700">
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
            <div><span className="text-slate-400">Consent source:</span> {loader.consentSource}</div>
            <div><span className="text-slate-400">Analytics consent:</span> {String(loader.analyticsConsent)}</div>
            <div><span className="text-slate-400">GCM analytics_storage:</span> {gcm}</div>
            {loader.durationMs != null && (
              <div><span className="text-slate-400">Load time:</span> {loader.durationMs}ms</div>
            )}
            {loader.lastError && (
              <div className="text-rose-300 break-words">err: {loader.lastError}</div>
            )}
            <details className="mt-2">
              <summary className="cursor-pointer text-slate-400">xtsy_consent_v2</summary>
              <pre className="mt-1 max-h-40 overflow-auto whitespace-pre-wrap break-words text-[10px] bg-slate-950/60 p-2 rounded">
{JSON.stringify(consent, null, 2) || 'null'}
              </pre>
            </details>
            <div className="pt-2 text-[10px] text-slate-500">
              Toggle with <code>?debug=consent</code> or <code>localStorage.xtsy_debug_consent='true'</code>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
