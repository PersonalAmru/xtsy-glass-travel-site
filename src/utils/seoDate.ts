const MIN_VALID_SEO_YEAR = 2026;
const MAX_VALID_SEO_YEAR = 2100;

const runtimeYear = new Date().getUTCFullYear();

/**
 * Stable year for public SEO copy. Some publish workers can expose an epoch
 * clock while evaluating modules; clamp that invalid value to the verified
 * editorial baseline rather than shipping 1970 in titles and descriptions.
 */
export const SEO_YEAR =
  runtimeYear >= MIN_VALID_SEO_YEAR && runtimeYear <= MAX_VALID_SEO_YEAR
    ? runtimeYear
    : MIN_VALID_SEO_YEAR;

export const SEO_UPDATED_DATE = `${SEO_YEAR}-04-01`;
