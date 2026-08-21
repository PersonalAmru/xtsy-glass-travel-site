import { createFileRoute } from "@tanstack/react-router";
import DestinationDetail from "@/pages/destinations/DestinationDetail";
import { buildRouteHead } from "@/lib/seo-head";
import { getDestinationBySlug } from "@/data/meghalayaDestinations";
import { getStateBySlug, getCityBySlug } from "@/data/neTaxonomy";

export const Route = createFileRoute("/destinations/$state/$city/$attraction")({
  head: ({ params }) => {
    const dest = getDestinationBySlug(params.attraction);
    const state = getStateBySlug(params.state);
    const city = getCityBySlug(params.state, params.city);
    const place = dest?.name ?? params.attraction.replace(/-/g, " ");
    const where = [city?.name, state?.name].filter(Boolean).join(", ") || "Meghalaya";

    const title = dest?.seoTitle ?? `${place}, ${where} — Guide, Timings & How to Reach`;
    const description =
      dest?.seoDescription ??
      dest?.shortDescription ??
      `Visit ${place} near ${where}: best time to go, how to reach, entry details and nearby stops, plus budget stays from XTSY.`;

    return buildRouteHead({
      path: `/destinations/${params.state}/${params.city}/${params.attraction}`,
      title: title.slice(0, 70),
      description: description.slice(0, 158),
      keywords: dest?.seoKeywords,
      noIndex: !dest,
    });
  },
  component: DestinationDetail,
});
