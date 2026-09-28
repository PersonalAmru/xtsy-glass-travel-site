import { createFileRoute } from "@tanstack/react-router";
import DestinationDetail from "@/pages/v2/DestinationV2";
import { buildRouteHead } from "@/lib/seo-head";
import { getDestinationBySlug } from "@/data/meghalayaDestinations";
import { getStateBySlug, getCityBySlug } from "@/data/neTaxonomy";
import { fitTitle } from "@/lib/seo/fitTitle";

export const Route = createFileRoute("/destinations/$state/$city/$attraction")({
  head: ({ params }) => {
    const dest = getDestinationBySlug(params.attraction);
    const state = getStateBySlug(params.state);
    const city = getCityBySlug(params.state, params.city);
    const place = dest?.name ?? params.attraction.replace(/-/g, " ");
    const where = [city?.name, state?.name].filter(Boolean).join(", ") || "Meghalaya";

    // Search results show ~60 characters: pick the most descriptive title that fits
    // whole, instead of cutting a long one mid-word.
    const cityShort = (city?.name ?? '').replace(/\s*\(.*?\)\s*/g, '').trim();
    const title = fitTitle([
      dest?.seoTitle ?? '',
      `${place}, ${cityShort || 'Meghalaya'} — Timings & How to Reach`,
      `${place}, ${cityShort || 'Meghalaya'}: How to Reach & Timings`,
      `${place}, ${cityShort || 'Meghalaya'} — Travel Guide`,
      `${place}, Meghalaya — Travel Guide`,
      `${place} — Travel Guide`,
    ]);
    const description =
      dest?.seoDescription ??
      dest?.shortDescription ??
      `Visit ${place} near ${where}: best time to go, how to reach, entry details and nearby stops, plus budget stays from XTSY.`;

    return buildRouteHead({
      path: `/destinations/${params.state}/${params.city}/${params.attraction}`,
      title,
      description: description.slice(0, 158),
      keywords: dest?.seoKeywords,
      noIndex: !dest,
    });
  },
  component: DestinationDetail,
});
