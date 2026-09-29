/**
 * Server-only page data for the heaviest route families.
 *
 * The guide text (~480 pages), tour itineraries and package data used to be imported by the
 * route files' head(), which TanStack does not code-split — so ~1 MB of text shipped in the main
 * JavaScript bundle to every visitor on every page. These builders run only on the server
 * (through the server functions in pageData.functions.ts); each page receives just its own data.
 */
import type { RouteHeadInput } from '@/lib/seo-head';
import { programmaticModel, schemaFor, isThinSEOPage, guideDirectory, CATEGORY_LABELS, townOf, goesBeyondShillong, SEO_CONTENT_UPDATED } from './programmaticSeo';
import { getRelatedPages, getPagesByCategory } from '@/data/seoPages';
import { RECOVERY_REDIRECTS } from '@/data/seoAffectedSlugs';
import { CANONICAL_TWIN } from '@/data/seoIndexPolicy';
import { getWheelLinks } from '@/data/seoLinkingWheel';
import { fitTitle } from './fitTitle';
import { getAllTours, mergeItinerary } from '@/data/travelData';
import { getSignaturePackageBySlug, signaturePackageToTourPackage } from '@/data/signaturePackages';
import { reviewedPhoto } from '@/data/tourPhotos';
import { photoFor } from '@/data/v2TourImages';
import { responsiveImage } from '@/data/cdnImages';

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

// ---------- Tour pages (/tours/$slug) ----------

const toSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

function resolveTour(slug: string) {
  const found = getAllTours().find((t) => toSlug(t.title) === slug);
  if (found) return mergeItinerary(found);
  const sig = getSignaturePackageBySlug(slug);
  return sig ? signaturePackageToTourPackage(sig) : null;
}

/** The hero photo exactly as TourDetailV2 renders it, so the preload fetches the same file. */
function heroPhoto(slug: string, tour: { id: string | number; title: string; location?: string }) {
  const key = getSignaturePackageBySlug(slug) ? `sig-${slug}` : `tour-${tour.id}`;
  const src = reviewedPhoto(key) || photoFor(tour.title, tour.location);
  return { src, responsive: responsiveImage(src) };
}

export function tourHead(slug: string): RouteHeadInput {
  const tour = resolveTour(slug);
  const url = `/tours/${slug}`;
  if (!tour) {
    return {
      path: url,
      title: 'Tour not found | XTSY Travel',
      description: 'This tour is no longer available. Browse 30+ Northeast India tour packages by XTSY Travel.',
      noIndex: true,
    };
  }
  const numericPrice = parseInt(String(tour.price).replace(/[^\d]/g, ''), 10) || undefined;
  const absolute = `https://xtsy.one${url}`;
  const images = tour.images?.length ? [tour.image, ...tour.images] : [tour.image];
  const tourSchema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: tour.title,
    description: tour.description,
    image: images,
    url: absolute,
    touristType: tour.category,
    ...(tour.itinerary?.length
      ? {
          itinerary: {
            '@type': 'ItemList',
            numberOfItems: tour.itinerary.length,
            itemListElement: tour.itinerary.map((day, i) => ({ '@type': 'ListItem', position: i + 1, name: day.title })),
          },
        }
      : {}),
    provider: { '@type': 'TravelAgency', name: 'XTSY Travel', url: 'https://xtsy.one/tours' },
    ...(numericPrice
      ? { offers: { '@type': 'Offer', price: numericPrice, priceCurrency: 'INR', availability: 'https://schema.org/InStock', url: absolute } }
      : {}),
  };
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://xtsy.one/' },
      { '@type': 'ListItem', position: 2, name: 'Tours', item: 'https://xtsy.one/tours' },
      { '@type': 'ListItem', position: 3, name: tour.title, item: absolute },
    ],
  };
  const h = heroPhoto(slug, tour);
  return {
    path: url,
    title: fitTitle([
      `${tour.title} — ${tour.duration} from ${tour.price} | XTSY`,
      `${tour.title} — ${tour.duration} | XTSY`,
      `${tour.title} | XTSY Tours`,
      `${tour.title} | XTSY`,
      tour.title,
    ]),
    description: String(tour.description).slice(0, 155),
    keywords: `${tour.title}, ${tour.location} tour, ${tour.category} tour, ${tour.duration} Meghalaya package, XTSY Travel`,
    image: tour.image,
    // Same file, srcset and sizes as the page's <Photo> (default sizes), or phones download it twice.
    ...(h.responsive
      ? { preloadImage: h.responsive.src, preloadImageSrcSet: h.responsive.srcSet, preloadImageSizes: '(max-width: 768px) 100vw, 50vw' }
      : { preloadImage: h.src }),
    ogType: 'product',
    jsonLd: [tourSchema, breadcrumb],
  };
}
