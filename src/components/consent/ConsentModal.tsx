/**
 * ConsentModal — privacy & cookie notice as a slim bar at the bottom of the screen
 * (GDPR / India DPDP Act 2023).
 *
 * - Does not cover the page or lock scrolling: visitors can read and book while it is open.
 * - Necessary and analytics cookies are always on (business requirement, stated plainly).
 * - Marketing and personalisation are the visitor's choice: "Reject non-essential" saves
 *   them off in one tap; "Settings" opens the switches.
 * - Consent is stored for 365 days under the same key and version as before, so visitors who
 *   already chose are not asked again, and the same consent_update event goes to GTM.
 */

import { useState, useEffect, useCallback } from 'react';
import { Switch } from '@/components/ui/switch';
import { Lock } from 'lucide-react';

interface ConsentPreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
  timestamp: string;
  version: string;
}

const CONSENT_KEY = 'xtsy_consent_v2';
const CONSENT_VERSION = '2.0';
// Consent valid for 365 days — returning visitors within this window never see the bar.
const CONSENT_VALIDITY_MS = 365 * 24 * 60 * 60 * 1000;

function hasValidConsent(): boolean {
  try {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) return false;
    const parsed = JSON.parse(stored);
    if (parsed.version === CONSENT_VERSION && parsed.timestamp) {
      const age = Date.now() - new Date(parsed.timestamp).getTime();
      if (age < CONSENT_VALIDITY_MS) {
        sessionStorage.setItem('xtsy_returning_user', 'true');
        return true;
      }
    }
    localStorage.removeItem(CONSENT_KEY);
  } catch {
    try { localStorage.removeItem(CONSENT_KEY); } catch { /* storage blocked */ }
  }
  return false;
}

export function ConsentModal() {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [marketing, setMarketing] = useState(true);
  const [personalization, setPersonalization] = useState(true);

  useEffect(() => {
    // Shown after the page has painted, so it never delays the first view.
    const timer = setTimeout(() => {
      if (!hasValidConsent()) setIsVisible(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const pushToDataLayer = useCallback((prefs: ConsentPreferences) => {
    const w = window as unknown as { dataLayer?: unknown[] };
    if (typeof window !== 'undefined' && w.dataLayer) {
      w.dataLayer.push({
        event: 'consent_update',
        analytics_storage: 'granted',
        ad_storage: prefs.marketing ? 'granted' : 'denied',
        ad_user_data: prefs.marketing ? 'granted' : 'denied',
        ad_personalization: prefs.personalization ? 'granted' : 'denied',
        functionality_storage: 'granted',
        security_storage: 'granted',
        personalization_storage: prefs.personalization ? 'granted' : 'denied',
      });
    }
  }, []);

  const saveConsent = useCallback((choice: { marketing: boolean; personalization: boolean }) => {
    const prefs: ConsentPreferences = {
      necessary: true,
      analytics: true,
      marketing: choice.marketing,
      personalization: choice.personalization,
      timestamp: new Date().toISOString(),
      version: CONSENT_VERSION,
    };
    try { localStorage.setItem(CONSENT_KEY, JSON.stringify(prefs)); } catch { /* storage blocked: ask again next visit */ }
    pushToDataLayer(prefs);
    setIsVisible(false);
  }, [pushToDataLayer]);

  if (!isVisible) return null;

  const btn = 'inline-flex h-10 items-center justify-center rounded-full px-4 text-[14px] font-extrabold transition-colors sm:h-11 sm:px-5 sm:text-[15px]';

  return (
    <section
      role="region"
      aria-label="Privacy and cookies"
      className="fixed inset-x-0 bottom-0 z-[2147483000] border-t border-xt-line bg-xt-paper text-xt-ink shadow-[0_-8px_24px_rgba(31,34,48,0.12)]"
    >
      <div className="mx-auto max-w-6xl px-4 py-2.5 sm:px-6 sm:py-4">
        {showSettings && (
          <div className="mb-3 grid max-h-[45vh] gap-2 overflow-y-auto sm:grid-cols-2">
            {[
              { name: 'Necessary', sub: 'Bookings, security, your settings', locked: true },
              { name: 'Analytics', sub: 'How visitors use the site (always on)', locked: true },
            ].map((row) => (
              <div key={row.name} className="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3">
                <div>
                  <p className="m-0 flex items-center gap-1.5 text-[14px] font-extrabold">{row.name} <Lock className="h-3.5 w-3.5 text-xt-mute" aria-hidden="true" /></p>
                  <p className="m-0 text-[13px] text-xt-mute">{row.sub}</p>
                </div>
                <Switch checked disabled aria-label={`${row.name} cookies always on`} />
              </div>
            ))}
            <div className="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3">
              <div>
                <p className="m-0 text-[14px] font-extrabold">Marketing</p>
                <p className="m-0 text-[13px] text-xt-mute">Relevant ads on other sites</p>
              </div>
              <Switch checked={marketing} onCheckedChange={setMarketing} aria-label="Marketing cookies" />
            </div>
            <div className="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3">
              <div>
                <p className="m-0 text-[14px] font-extrabold">Personalisation</p>
                <p className="m-0 text-[13px] text-xt-mute">Remember your preferences</p>
              </div>
              <Switch checked={personalization} onCheckedChange={setPersonalization} aria-label="Personalisation cookies" />
            </div>
          </div>
        )}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-6">
          <p className="m-0 flex-1 text-[13px] leading-snug sm:text-[14px]">
            We use cookies to run the site and understand visits, and, with your OK, for ads and personalisation.{' '}
            <a href="/privacy-policy" className="font-bold text-xt-crimson underline">Privacy Policy</a>
            {' · '}
            <button
              type="button"
              aria-expanded={showSettings}
              onClick={() => setShowSettings((v) => !v)}
              className="inline-flex min-h-6 items-center font-bold text-xt-ink underline underline-offset-2 hover:text-xt-crimson"
            >
              {showSettings ? 'Hide settings' : 'Settings'}
            </button>
          </p>
          <div className="flex flex-wrap gap-2">
            {showSettings ? (
              <button type="button" onClick={() => saveConsent({ marketing, personalization })} className={`${btn} bg-xt-crimson text-white hover:bg-xt-crimson-dark`}>
                Save choices
              </button>
            ) : (
              <>
                <button type="button" onClick={() => saveConsent({ marketing: true, personalization: true })} className={`${btn} bg-xt-crimson text-white hover:bg-xt-crimson-dark`}>
                  Accept all
                </button>
                <button type="button" onClick={() => saveConsent({ marketing: false, personalization: false })} className={`${btn} border-[1.5px] border-xt-ink bg-transparent text-xt-ink hover:bg-white`}>
                  Reject non-essential
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ConsentModal;
