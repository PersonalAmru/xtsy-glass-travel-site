import { createFileRoute } from "@tanstack/react-router";
import CityHub from "@/pages/destinations/CityHub";
import { buildRouteHead } from "@/lib/seo-head";
import { fitTitle } from "@/lib/seo/fitTitle";
import { getStateBySlug, getCityBySlug } from "@/data/neTaxonomy";
import { NEARBY_ADVENTURES } from "@/data/nearbyAdventures";

/** Meta descriptions end on a whole word, at most 155 characters. */
const clip = (d: string) => (d.length <= 155 ? d.trim() : d.slice(0, 155).replace(/\s+\S*$/, ''));

export const Route = createFileRoute("/destinations/$state/$city/")({
  head: ({ params }) => {
    const state = getStateBySlug(params.state);
    const city = getCityBySlug(params.state, params.city);
    const hasNearby = (params.state === "assam" || params.state === "meghalaya") && Boolean(NEARBY_ADVENTURES[params.city]);
    const short = city?.name.replace(/\s*\(.*?\)\s*/g, "").trim();
    const title = city
      ? fitTitle([
          `Places to Visit in ${city.name}, ${state?.name} | XTSY`,
          `Places to Visit in ${short}, ${state?.name} | XTSY`,
          `Places to Visit in ${short} | XTSY`,
        ])
      : "Places to Visit in Northeast India | XTSY";
    return buildRouteHead({
      path: `/destinations/${params.state}/${params.city}`,
      title,
      description:
        city ? clip(`${city.blurb} ${hasNearby ? `Explore nearby adventure activities from ${city.name}.` : `Permits, routes and trips arranged by XTSY with trusted partners.`}`) :
        "Attractions, viewpoints and day trips around Northeast India base towns.",
      keywords: hasNearby ? `adventure activities near ${city?.name}, adventures near me ${city?.name}, ${city?.name} day trips` : undefined,
      noIndex: !city,
    });
  },
  component: CityHub,
});
