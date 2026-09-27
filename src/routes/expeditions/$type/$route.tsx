import { createFileRoute } from "@tanstack/react-router";
import { ExpeditionRouteV2 as ExpeditionRoutePage } from "@/pages/v2/ExpeditionsV2";
import { buildRouteHead } from "@/lib/seo-head";
import { getExpeditionRoute, type ExpeditionType } from "@/data/neTaxonomy";

export const Route = createFileRoute("/expeditions/$type/$route")({
  head: ({ params }) => {
    const expedition = getExpeditionRoute(params.type, params.route);
    const path = `/expeditions/${params.type}/${params.route}`;
    const label = params.type === "4x4" ? "4x4" : "Motorbike";

    if (!expedition) {
      return buildRouteHead({
        path,
        title: "Expedition Route Not Found | XTSY",
        description: "This expedition route is not available. Browse XTSY motorbike and 4x4 routes across Northeast India.",
        noIndex: true,
      });
    }

    const detail = expedition.byType[params.type as ExpeditionType];
    const url = `https://xtsy.one${path}`;

    return buildRouteHead({
      path,
      title: expedition.slug === "meghalaya-loop" && params.type === "4x4"
        ? "4x4 Expedition Meghalaya: Loop, Season & Cost | XTSY"
        : `${expedition.name} ${label} Route: Permits, Season, Cost`.slice(0, 65),
      description:
        `${expedition.distanceKm} km ${label.toLowerCase()} expedition${detail ? ` in ${detail.duration}` : ""}. Permits, best season, altitude, road conditions and costs from Rs ${detail?.priceFrom.toLocaleString("en-IN") ?? "—"} per person.`.slice(0, 158),
      keywords: `${expedition.name} ${label.toLowerCase()} route, northeast india ${label.toLowerCase()} expedition, ${expedition.slug.replace(/-/g, " ")} permits${expedition.slug === "meghalaya-loop" && params.type === "4x4" ? ", 4x4 expedition Meghalaya" : ""}`,
      ogType: "article",
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "TouristTrip",
          name: `${expedition.name} — ${label} Expedition`,
          description: expedition.summary,
          url,
          touristType: `${label} expedition travellers`,
          provider: { "@type": "Organization", name: "XTSY Travel", url: "https://xtsy.one" },
          ...(detail
            ? {
                offers: {
                  "@type": "Offer",
                  price: detail.priceFrom,
                  priceCurrency: "INR",
                  url,
                  availability: "https://schema.org/InStock",
                },
              }
            : {}),
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://xtsy.one/" },
            { "@type": "ListItem", position: 2, name: "Expeditions", item: "https://xtsy.one/expeditions" },
            { "@type": "ListItem", position: 3, name: `${expedition.name} (${label})`, item: url },
          ],
        },
      ],
    });
  },
  component: ExpeditionRoutePage,
});
