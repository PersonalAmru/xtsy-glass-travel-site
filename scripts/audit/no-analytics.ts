/**
 * Keep automated browser runs (CI audits, smoke tests, screenshots) out of XTSY's analytics.
 *
 * The analytics scripts still download and run, so page weight and timings stay comparable
 * with earlier runs, but the hits they send (Lovable analytics, Google Analytics, the site's own
 * track-analytics function) are aborted. An aborted request reports net::ERR_ABORTED, which the
 * audits already ignore.
 */
import type { BrowserContext } from '@playwright/test';

const ANALYTICS = /\/(~flock|__l5e)\b|google-analytics\.com|analytics\.google\.com|googletagmanager\.com\/(g|collect)|\/functions\/v1\/track-analytics|doubleclick\.net/;

export async function blockAnalytics(ctx: BrowserContext): Promise<void> {
  await ctx.route(ANALYTICS, (route) => {
    const req = route.request();
    if (req.resourceType() === 'script') return route.continue();
    return route.abort('aborted');
  });
}
