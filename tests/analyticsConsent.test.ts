import { describe, expect, it } from 'vitest';
import { runInNewContext } from 'node:vm';
import { CONSENT_BOOTSTRAP_SCRIPT, CONSENT_VERSION, CONSENT_VALIDITY_MS, GTM_CONSENT_LOADER_SCRIPT, parseConsent } from '../src/lib/consent';

const record = (analytics: boolean, overrides = {}) => JSON.stringify({ necessary: true, analytics, marketing: false, personalization: false, version: CONSENT_VERSION, timestamp: new Date().toISOString(), ...overrides });

function browser(raw: string | null) {
  const scripts: string[] = [];
  const deleted: string[] = [];
  const events: Record<string, () => void> = {};
  const window = {
    dataLayer: [] as any[],
    localStorage: { getItem: () => raw, removeItem: (key: string) => deleted.push(key) },
    sessionStorage: { removeItem: (key: string) => deleted.push(key) },
    addEventListener: (event: string, handler: () => void) => { events[event] = handler; },
  };
  const document = { cookie: '_ga=test; _gcl_au=test', location: { hostname: 'xtsy.one', pathname: '/book' }, createElement: () => ({ src: '', async: false }), head: { appendChild: (script: { src: string }) => scripts.push(script.src) } };
  const context = { window, document };
  runInNewContext(CONSENT_BOOTSTRAP_SCRIPT, context);
  runInNewContext(GTM_CONSENT_LOADER_SCRIPT, context);
  return { window: window as typeof window & { __xtsyApplyConsent: (prefs: object) => void }, scripts, deleted, events };
}

describe('optional analytics consent', () => {
  it('loads no tracking tag before a choice, even after ordinary page load', () => {
    const result = browser(null);
    expect(result.scripts).toEqual([]);
    expect(result.window.dataLayer[0][0]).toBe('consent');
    expect(result.window.dataLayer[0][2].analytics_storage).toBe('denied');
  });
  it('keeps analytics denied for a returning rejection', () => {
    const result = browser(record(false));
    expect(result.scripts).toEqual([]);
    expect(result.window.dataLayer.at(-1).analytics_storage).toBe('denied');
    expect(result.deleted).toContain('xtsy_visitor_id');
  });
  it('does not restore the old forced analytics opt-in', () => {
    expect(parseConsent(record(true, { version: '2.0' }))).toBeNull();
    expect(browser(record(true, { version: '2.0' })).scripts).toEqual([]);
  });
  it('expires choices after 365 days', () => {
    expect(parseConsent(record(true, { timestamp: new Date(Date.now() - CONSENT_VALIDITY_MS).toISOString() }))).toBeNull();
  });
  it('rejects malformed and future-dated choices', () => {
    expect(parseConsent('{')).toBeNull();
    expect(parseConsent(record(true, { timestamp: new Date(Date.now() + 60000).toISOString() }))).toBeNull();
  });
  it('starts the existing container once after explicit analytics acceptance', () => {
    const result = browser(null);
    result.window.__xtsyApplyConsent({ analytics: true, marketing: false, personalization: false });
    result.events['consent-update']();
    result.events['consent-update']();
    expect(result.scripts).toEqual(['https://www.googletagmanager.com/gtm.js?id=GTM-5FXJ9QBK']);
    expect(result.window.dataLayer.findLast(event => event.event === 'consent_update').ad_storage).toBe('denied');
  });
});