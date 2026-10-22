/**
 * Is this page view a real person, or one of our own robots?
 *
 * The October 2026 analytics review found most recorded "visitors" were automated: headless
 * browsers from our own CI (error sweep, smoke tests, speed runs) plus third-party crawlers.
 * Anything this function flags is excluded from our own analytics and marketing tags, so the
 * numbers we act on describe real travellers.
 *
 * It cannot switch off the hosting platform's own visit counter, which still records raw hits;
 * the daily growth forecast filters those by country and source instead.
 */
const SYNTHETIC_UA =
  /Chrome-Lighthouse|HeadlessChrome|Headless|PTST\/|Speed[ -]?Insights|GTmetrix|WebPageTest|Playwright|Puppeteer|xtsy-smoke-test|bot|crawler|spider/i;

export function isSyntheticVisit(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return true;
  try {
    const ua = navigator.userAgent || '';
    if (SYNTHETIC_UA.test(ua)) return true;
    if ((navigator as unknown as { webdriver?: boolean }).webdriver === true) return true;
    if (/[?&](lh|lighthouse|xtsy_no_track)=1\b/.test(window.location.search)) return true;
    // Our audit scripts set this before the page loads.
    if (window.localStorage?.getItem('xtsy_no_track') === '1') return true;
  } catch {
    /* storage or UA unavailable: fall through and treat as real */
  }
  return false;
}
