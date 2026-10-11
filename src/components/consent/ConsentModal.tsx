/** Optional analytics, ads and personalisation require explicit consent. */

import { useState, useEffect, useCallback } from 'react';
import { Switch } from '@/components/ui/switch';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { readConsent } from '@/lib/consent';
import { consentManager } from '@/services/consentManagementService';

export function ConsentModal() {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [personalization, setPersonalization] = useState(false);

  useEffect(() => {
    // Shown after the page has painted, so it never delays the first view.
    const timer = setTimeout(() => {
      consentManager.initialize();
      if (!readConsent()) setIsVisible(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const saveConsent = useCallback((choice: { analytics: boolean; marketing: boolean; personalization: boolean }) => {
    void consentManager.setPreferences(choice);
    setIsVisible(false);
  }, []);

  if (!isVisible) return null;

  const btn = 'inline-flex min-h-12 items-center justify-center rounded-full px-4 text-[14px] font-extrabold transition-colors sm:min-h-12 sm:px-5 sm:text-[15px]';

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
            ].map((row) => (
              <div key={row.name} className="flex items-center justify-between gap-3 rounded-2xl bg-background px-4 py-3">
                <div>
                  <p className="m-0 flex items-center gap-1.5 text-[14px] font-extrabold">{row.name} <Lock className="h-3.5 w-3.5 text-xt-mute" aria-hidden="true" /></p>
                  <p className="m-0 text-[13px] text-xt-mute">{row.sub}</p>
                </div>
                <Switch checked disabled aria-label={`${row.name} cookies always on`} />
              </div>
            ))}
            <div className="flex items-center justify-between gap-3 rounded-2xl bg-background px-4 py-3">
              <div><p className="m-0 text-[14px] font-extrabold">Analytics</p><p className="m-0 text-[13px] text-xt-mute">How visitors use the site</p></div>
              <Switch checked={analytics} onCheckedChange={setAnalytics} aria-label="Analytics cookies" />
            </div>
            <div className="flex items-center justify-between gap-3 rounded-2xl bg-background px-4 py-3">
              <div>
                <p className="m-0 text-[14px] font-extrabold">Marketing</p>
                <p className="m-0 text-[13px] text-xt-mute">Relevant ads on other sites</p>
              </div>
              <Switch checked={marketing} onCheckedChange={setMarketing} aria-label="Marketing cookies" />
            </div>
            <div className="flex items-center justify-between gap-3 rounded-2xl bg-background px-4 py-3">
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
            We use necessary cookies to run the site. With your permission, we also use cookies for analytics, ads and personalisation.{' '}
            <a href="/privacy-policy" className="font-bold text-xt-crimson underline">Privacy Policy</a>
            {' · '}
            <Button
              type="button"
              aria-expanded={showSettings}
              onClick={() => setShowSettings((v) => !v)}
              className="inline-flex min-h-12 items-center font-bold text-xt-ink underline underline-offset-2 hover:text-xt-crimson"
            >
              {showSettings ? 'Hide settings' : 'Settings'}
            </Button>
          </p>
          <div className="flex flex-wrap gap-2">
            {showSettings ? (
              <Button type="button" onClick={() => saveConsent({ analytics, marketing, personalization })} className={`${btn} bg-xt-crimson text-primary-foreground hover:bg-xt-crimson-dark`}>
                Save choices
              </Button>
            ) : (
              <>
                <Button type="button" onClick={() => saveConsent({ analytics: true, marketing: true, personalization: true })} className={`${btn} bg-xt-crimson text-primary-foreground hover:bg-xt-crimson-dark`}>
                  Accept all
                </Button>
                <Button type="button" onClick={() => saveConsent({ analytics: false, marketing: false, personalization: false })} className={`${btn} border-[1.5px] border-xt-ink bg-transparent text-xt-ink hover:bg-background`}>
                  Reject non-essential
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ConsentModal;
