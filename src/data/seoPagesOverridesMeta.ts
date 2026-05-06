/**
 * Metadata about the AI-generated overrides — last update timestamp + the
 * canonical priority slug list. Surfaced in the admin SEO Priority dashboard.
 */
import { TOP20_SEO_OVERRIDES } from './seoPagesOverrides';

export const OVERRIDES_LAST_UPDATED = '2026-05-06';

export const OVERRIDE_SLUGS: string[] = TOP20_SEO_OVERRIDES.map((o) => o.slug);

export interface OverrideStatusRow {
  slug: string;
  url: string;
  title: string;
  metaDescription: string;
  inSitemapPriority: boolean;
  inPrerenderStatic: boolean;
  lastUpdated: string;
}
