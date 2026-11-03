import { afterEach, describe, expect, it, vi } from 'vitest';
import { APPROVED_CONVERSION_EVENTS, canForwardExternalEvent, DIAGNOSTIC_ONLY_CONVERSION_EVENTS } from '../src/utils/conversionPolicy';

vi.mock('../src/lib/consent', () => ({ readConsent: vi.fn(() => ({ analytics: true, marketing: false })) }));
vi.mock('../src/lib/analytics/isSynthetic', () => ({ isSyntheticVisit: vi.fn(() => false) }));
vi.mock('../src/utils/analyticsFilters', () => ({ isLovableSession: vi.fn(() => false) }));
import { readConsent } from '../src/lib/consent';
import { isSyntheticVisit } from '../src/lib/analytics/isSynthetic';
import { isLovableSession } from '../src/utils/analyticsFilters';
import { pushToDataLayer } from '../src/utils/dataLayerService';
import { getConversionEvents, getEventStats, resetEventStats, routeGTMEvent } from '../src/utils/gtmEventRouter';

const evidence = { validated: true, intent_score: 60, intent_category: 'high', booking_status: 'confirmed', transaction_id: 'TEST-CONFIRMED' };
afterEach(() => { vi.unstubAllGlobals(); vi.clearAllMocks(); resetEventStats(); });

describe('approved conversion policy', () => {
  it('registers only the four owner-approved conversion names', () => {
    expect(getConversionEvents().sort()).toEqual([...APPROVED_CONVERSION_EVENTS].sort());
  });
  for (const name of APPROVED_CONVERSION_EVENTS) {
    it(`${name} requires validation and high/hot intent`, () => {
      expect(canForwardExternalEvent(name, evidence)).toBe(true);
      expect(canForwardExternalEvent(name, { ...evidence, validated: false })).toBe(false);
      expect(canForwardExternalEvent(name, { ...evidence, intent_score: 59, intent_category: 'medium' })).toBe(false);
      expect(canForwardExternalEvent(name, { ...evidence, intent_score: 80, intent_category: 'hot' })).toBe(true);
      expect(canForwardExternalEvent(name, { is_validated_conversion: true })).toBe(false);
    });
  }
  it('does not turn raw interactions or enquiry creation into external conversions', () => {
    for (const name of DIAGNOSTIC_ONLY_CONVERSION_EVENTS) expect(canForwardExternalEvent(name, evidence)).toBe(false);
    expect(canForwardExternalEvent('button_click', { is_conversion: true })).toBe(false);
  });
  it('does not treat a pending enquiry or absent booking reference as a confirmed booking', () => {
    expect(canForwardExternalEvent('booking_confirmed', { ...evidence, booking_status: 'pending' })).toBe(false);
    expect(canForwardExternalEvent('booking_confirmed', { ...evidence, transaction_id: '' })).toBe(false);
  });
});

function browser() {
  const storage = { getItem: () => null, setItem: vi.fn() };
  const window = { location: { pathname: '/', href: 'https://xtsy.one/' }, dataLayer: [] as Record<string, unknown>[], dispatchEvent: vi.fn() };
  vi.stubGlobal('window', window);
  vi.stubGlobal('document', { title: 'XTSY' });
  vi.stubGlobal('CustomEvent', class { constructor(public type: string, public options: unknown) {} });
  vi.stubGlobal('localStorage', storage);
  vi.stubGlobal('sessionStorage', storage);
  return window;
}

describe('shared data-layer boundary', () => {
  it('allows analytics-only events with stable names and no advertising permission', () => {
    const window = browser();
    pushToDataLayer({ event: 'scroll_depth', event_name: 'wrong', eventName: 'wrong' });
    expect(window.dataLayer).toHaveLength(1);
    expect(window.dataLayer[0]).toMatchObject({ event: 'scroll_depth', event_name: 'scroll_depth', eventName: 'scroll_depth', analytics_storage: 'granted', ad_storage: 'denied', is_conversion: false });
  });
  it('keeps rejected-consent events out of Google and creates no identifier', () => {
    const window = browser();
    vi.mocked(readConsent).mockReturnValueOnce(null);
    pushToDataLayer({ event: 'page_view' });
    expect(window.dataLayer).toHaveLength(0);
    expect(localStorage.setItem).not.toHaveBeenCalled();
  });
  it('excludes admin sessions', () => {
    const window = browser();
    vi.mocked(isLovableSession).mockReturnValueOnce(true);
    pushToDataLayer({ event: 'lead_qualified', ...evidence });
    expect(window.dataLayer).toHaveLength(0);
  });
  it('excludes synthetic visits', () => {
    const window = browser();
    vi.mocked(isSyntheticVisit).mockReturnValueOnce(true);
    pushToDataLayer({ event: 'page_view' });
    expect(window.dataLayer).toHaveLength(0);
  });
  it('blocks direct unvalidated conversion pushes', () => {
    const window = browser();
    pushToDataLayer({ event: 'lead_qualified', is_validated_conversion: true, intent_score: 80 });
    expect(window.dataLayer).toHaveLength(0);
  });
  it('retains blocked raw events for internal monitoring, without forwarding them', () => {
    const window = browser();
    expect(routeGTMEvent({ eventName: 'booking_initiated', params: { value: 399 } })).toBe(false);
    expect(getEventStats().booking_initiated.totalCount).toBe(1);
    expect(window.dispatchEvent).toHaveBeenCalled();
    expect(window.dataLayer).toHaveLength(0);
  });
});