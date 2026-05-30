import { menuSections } from "./tabBistroMenu";

/**
 * Structured-data helpers for TAB Bistro by XTSY.
 * Builds a schema.org Menu (cuisines, dishes, prices) so Google can surface
 * the restaurant's offerings, and centralises restaurant constants.
 */

export const TAB_BISTRO_NAME = "TAB Bistro by XTSY";
export const TAB_BISTRO_URL = "https://xtsy.one/tab-bistro";
export const TAB_BISTRO_PHONE = "+918837317070";
export const TAB_BISTRO_OPENS = "09:00";
export const TAB_BISTRO_CLOSES = "22:30";

export const TAB_BISTRO_CUISINES = [
  "North Indian",
  "Tandoor",
  "Indo-Chinese",
  "Thai",
  "Continental",
  "Italian",
  "Seafood",
  "Northeast Indian",
  "Cafe",
  "Breakfast",
];

// "₹39" -> 39 ; "₹249/299/369" -> 249 ; "₹29/39" -> 29
function parsePrice(raw: string): number | null {
  const cleaned = raw.replace(/[^0-9/]/g, "");
  const first = cleaned.split("/")[0];
  const n = parseInt(first, 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}

/** schema.org Menu built from the live menu data. */
export function buildMenuSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: `${TAB_BISTRO_NAME} Menu`,
    url: TAB_BISTRO_URL,
    inLanguage: "en-IN",
    hasMenuSection: menuSections.map((section) => ({
      "@type": "MenuSection",
      name: section.label,
      hasMenuSection: section.categories.map((cat) => ({
        "@type": "MenuSection",
        name: cat.title,
        hasMenuItem: cat.items.map((item) => {
          const price = parsePrice(item.price);
          return {
            "@type": "MenuItem",
            name: item.name,
            ...(price
              ? {
                  offers: {
                    "@type": "Offer",
                    price,
                    priceCurrency: "INR",
                    availability: "https://schema.org/InStock",
                  },
                }
              : {}),
          };
        }),
      })),
    })),
  };
}

/** Full Restaurant schema, enriched with live aggregate rating + reviews. */
export function buildRestaurantSchema(opts: {
  ratingValue?: number;
  reviewCount?: number;
  reviews?: { name: string; rating: number; comment: string; date: string }[];
}) {
  const { ratingValue, reviewCount, reviews = [] } = opts;
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${TAB_BISTRO_URL}#restaurant`,
    name: TAB_BISTRO_NAME,
    description:
      "Multi-cuisine forest dining restaurant in Shillong serving North Indian, Tandoor, Indo-Chinese, Thai, Continental, Italian, seafood and Northeast cuisine. Breakfast, café, wedding catering, bulk & corporate orders.",
    url: TAB_BISTRO_URL,
    telephone: TAB_BISTRO_PHONE,
    servesCuisine: TAB_BISTRO_CUISINES,
    priceRange: "₹₹",
    acceptsReservations: "True",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Shillong",
      addressRegion: "Meghalaya",
      addressCountry: "IN",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: TAB_BISTRO_OPENS,
        closes: TAB_BISTRO_CLOSES,
      },
    ],
    hasMenu: TAB_BISTRO_URL,
    ...(ratingValue && reviewCount
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: ratingValue.toFixed(1),
            reviewCount,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
    ...(reviews.length
      ? {
          review: reviews.slice(0, 12).map((r) => ({
            "@type": "Review",
            author: { "@type": "Person", name: r.name },
            datePublished: r.date,
            reviewBody: r.comment,
            reviewRating: {
              "@type": "Rating",
              ratingValue: r.rating,
              bestRating: 5,
              worstRating: 1,
            },
          })),
        }
      : {}),
  };
}
