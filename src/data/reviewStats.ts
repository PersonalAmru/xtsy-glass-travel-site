/**
 * SINGLE SOURCE OF TRUTH — verified guest review statistics.
 *
 * These numbers are the count of individually verifiable reviews held in the
 * repository (Google review exports + OTA review exports). Every schema block,
 * SEO copy string and UI component must read from here so the site never
 * publishes a review count it cannot evidence.
 *
 * Google review entries : 128 (src/data/googleReviews.ts)
 * OTA review entries    :  33 (src/data/otaReviews.ts)
 */
export const VERIFIED_REVIEW_COUNT = 161;
export const VERIFIED_REVIEW_COUNT_LABEL = '161';
export const VERIFIED_RATING = '4.8';
