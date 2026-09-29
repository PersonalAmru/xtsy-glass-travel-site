/**
 * Guide page data (/$slug and /guides), loaded on demand by the route loaders.
 *
 * The guide text (~480 pages), tour itineraries and package data used to be imported by the
 * route files' head(), which TanStack does not code-split — so ~1 MB of text shipped in the main
 * JavaScript bundle to every visitor on every page. The route loaders import these modules
 * dynamically: on the first (server-rendered) load they run on the server only and the result is
 * embedded in the HTML; on in-app navigation the browser fetches this chunk on demand.
 */
import type { RouteHeadInput } from '@/lib/seo-head';
import { programmaticModel, schemaFor, isThinSEOPage, guideDirectory, CATEGORY_LABELS, townOf, goesBeyondShillong, SEO_CONTENT_UPDATED } from './programmaticSeo';
import { getRelatedPages, getPagesByCategory } from '@/data/seoPages';
import { RECOVERY_REDIRECTS } from '@/data/seoAffectedSlugs';
import { CANONICAL_TWIN } from '@/data/seoIndexPolicy';
import { getWheelLinks } from '@/data/seoLinkingWheel';

// ---------- Guide pages (/$slug) ----------

export type ProgrammaticPayload =
  | { status: 'missing' | 'thin' }
  | { status: 'redirect'; to: string }
  | {
      status: 'ok';
      head: RouteHeadInput;
      model: NonNullable<ReturnType<typeof programmaticModel>>;
      label: string;
      town: string | null;
      beyond: boolean;
      updated: string;
      related: { slug: string; h1: string }[];
      sameCat: { slug: string; h1: string }[];
      wheel: { slug: string; label: string }[];
    };

export function programmaticPayload(slug: string): ProgrammaticPayload {
  const model = programmaticModel(slug);
  if (!model) {
    const to = RECOVERY_REDIRECTS[slug];
    return to ? { status: 'redirect', to } : { status: 'missing' };
  }
  if (isThinSEOPage(model.page)) return { status: 'thin' };
  const { page, hero } = model;
  const head: RouteHeadInput = {
    path: `/${CANONICAL_TWIN[page.slug] ?? page.slug}`,
    title: page.title,
    description: page.metaDescription,
    keywords: page.keywords?.join(', '),
    // Near-duplicate "hostel in <other town> tonight" pages: visible, but not indexed.
    noIndex: model.noindex,
    noIndexFollow: model.noindex,
    image: `https://xtsy.one${hero.src}`,
    ogType: page.schemaType === 'Article' || page.schemaType === 'TravelGuide' ? 'article' : 'website',
    preloadImage: hero.src,
    preloadImageSrcSet: hero.srcSet,
    preloadImageSizes: hero.srcSet ? '(max-width: 1024px) 100vw, 40vw' : undefined,
    // All structured data is server-rendered so AI crawlers that don't run JS still see it.
    jsonLd: schemaFor(page),
  };
  return {
    status: 'ok',
    head,
    model,
    label: CATEGORY_LABELS[page.category] ?? 'Guides',
    town: townOf(page),
    beyond: goesBeyondShillong(page),
    updated: SEO_CONTENT_UPDATED,
    related: getRelatedPages(page.slug).map((p) => ({ slug: p.slug, h1: p.h1 })),
    sameCat: getPagesByCategory(page.category).filter((p) => p.slug !== page.slug).slice(0, 9).map((p) => ({ slug: p.slug, h1: p.h1 })),
    wheel: getWheelLinks(page.slug).map((l) => ({ slug: l.slug, label: l.label })),
  };
}

// ---------- A–Z directory (/guides) ----------

export function guidesPayload() {
  return { groups: guideDirectory() };
}

