/**
 * Tour page head data (title, schema, hero preload), imported dynamically by the /tours/$slug
 * loader so the full tour and package data never sits in the shared JavaScript bundle.
 */
import type { RouteHeadInput } from '@/lib/seo-head';
import { fitTitle } from './fitTitle';
import { getAllTours, mergeItinerary } from '@/data/travelData';
import { getSignaturePackageBySlug, signaturePackageToTourPackage } from '@/data/signaturePackages';
import { reviewedPhoto } from '@/data/tourPhotos';
import { photoFor } from '@/data/v2TourImages';
import { responsiveImage } from '@/data/cdnImages';

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
