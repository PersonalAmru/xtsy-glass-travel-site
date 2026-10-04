/**
 * The site's own visitor tracking (sessions, page views, interactions and web-vitals rows
 * written to the database, plus an IP-location lookup) is switched OFF.
 *
 * Its database writes were being refused (permission denied), so every page load made several
 * failed requests for no data. Google Analytics / Tag Manager tracking is separate and unaffected.
 * Set to true only after the database permissions have been fixed.
 */
export const SELF_TRACKING_ENABLED = false;
