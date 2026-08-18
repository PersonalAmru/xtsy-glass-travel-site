import { createFileRoute } from "@tanstack/react-router";
import TourDetail from "@/pages/TourDetail";
import { buildRouteHead } from "@/lib/seo-head";
import { getAllTours, mergeItinerary } from "@/data/travelData";
import { getSignaturePackageBySlug, signaturePackageToTourPackage } from "@/data/signaturePackages";

const toSlug = (title: string) =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

function resolveTour(slug: string) {
  const found = getAllTours().find((t) => toSlug(t.title) === slug);
  if (found) return mergeItinerary(found);
  const sig = getSignaturePackageBySlug(slug);
  return sig ? signaturePackageToTourPackage(sig) : null;
}

export const Route = createFileRoute("/tours/$slug")({
  head: ({ params }) => {
    const slug = params.slug;
    const tour = resolveTour(slug);
    const url = `/tours/${slug}`;

    if (!tour) {
      return buildRouteHead({
        path: url,
        title: "Tour not found | XTSY Travel",
        description: "This tour is no longer available. Browse 30+ Northeast India tour packages by XTSY Travel.",
        noIndex: true,
      });
    }

    const numericPrice = parseInt(String(tour.price).replace(/[^\d]/g, ""), 10) || undefined;
    const absolute = `https://xtsy.one${url}`;
    const images = tour.images?.length ? [tour.image, ...tour.images] : [tour.image];

    const tourSchema: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "TouristTrip",
      name: tour.title,
      description: tour.description,
      image: images,
      url: absolute,
      touristType: tour.category,
      ...(tour.itinerary?.length
        ? {
            itinerary: {
              "@type": "ItemList",
              numberOfItems: tour.itinerary.length,
              itemListElement: tour.itinerary.map((day, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: day.title,
              })),
            },
          }
        : {}),
      provider: { "@type": "TravelAgency", name: "XTSY Travel", url: "https://xtsy.one/tours" },
      ...(numericPrice
        ? {
            offers: {
              "@type": "Offer",
              price: numericPrice,
              priceCurrency: "INR",
              url: absolute,
            },

          }
        : {}),
    };

    const breadcrumb = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://xtsy.one/" },
        { "@type": "ListItem", position: 2, name: "Tours", item: "https://xtsy.one/tours" },
        { "@type": "ListItem", position: 3, name: tour.title, item: absolute },
      ],
    };

    return buildRouteHead({
      path: url,
      title: `${tour.title} — ${tour.duration} from ${tour.price} | XTSY Travel`,
      description: String(tour.description).slice(0, 155),
      keywords: `${tour.title}, ${tour.location} tour, ${tour.category} tour, ${tour.duration} Meghalaya package, XTSY Travel`,
      image: tour.image,
      ogType: "product",
      jsonLd: [tourSchema, breadcrumb],
    });
  },
  component: TourDetail,
});
