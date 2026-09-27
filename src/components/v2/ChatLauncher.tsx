/**
 * Site-wide "Plan a trip with AI" button and pop-up assistant.
 * Any button can open it with openTripChat() from TripChat.
 */
import { lazy, Suspense, useEffect, useState } from 'react';
import { useLocation } from '@/lib/router-compat';
import { OPEN_EVENT } from './tripChatEvents';

const TripChat = lazy(() => import('./TripChat'));
const HIDDEN = /^\/(admin|franchise|admin-login|book\/|plan-trip-with-ai)/;

export default function ChatLauncher() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState<string | undefined>();

  useEffect(() => {
    const onOpen = (e: Event) => { setPrompt((e as CustomEvent<{ prompt?: string }>).detail?.prompt); setOpen(true); };
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, []);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  if (HIDDEN.test(pathname)) return null;

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => { setPrompt(undefined); setOpen(true); }}
          className="xt-btn fixed bottom-20 left-4 z-50 flex h-14 items-center gap-2.5 rounded-full bg-xt-ink pl-3 pr-5 text-[15px] font-extrabold text-white shadow-[0_18px_40px_-14px_rgba(31,34,48,0.8)] ring-2 ring-xt-crimson md:bottom-6"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-xt-crimson" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.8 4.7L18.5 9.5 13.8 11.3 12 16l-1.8-4.7L5.5 9.5l4.7-1.8z" /><path d="M19 15l.8 2.2 2.2.8-2.2.8L19 21l-.8-2.2-2.2-.8 2.2-.8z" /></svg>
          </span>
          Plan a trip with AI
        </button>
      )}
      {open && (
        <div role="dialog" aria-modal="true" aria-label="Plan a trip with AI" className="fixed inset-0 z-[70] flex items-end justify-end bg-black/40 sm:items-end sm:p-5" onClick={(e) => e.target === e.currentTarget && setOpen(false)}>
          <div className="h-[100dvh] w-full sm:h-[min(760px,calc(100dvh-40px))] sm:w-[460px] sm:overflow-hidden sm:rounded-[28px]">
            <Suspense fallback={<div className="h-full w-full bg-xt-ink" />}>
              <TripChat variant="panel" onClose={() => setOpen(false)} initialPrompt={prompt} />
            </Suspense>
          </div>
        </div>
      )}
    </>
  );
}
