/**
 * The site's own visitor tracking (sessions, page views, interactions and web-vitals rows
 * written to the database, plus an IP-location lookup).
 *
 * It was switched off while its database writes were being refused (permission denied).
 * Those grants have since been fixed and a live-visitor write verified, so tracking is
 * back on. All tracking remains consent-gated: nothing is written before analytics
 * consent, and admin sessions are excluded.
 */
export const SELF_TRACKING_ENABLED = true;
