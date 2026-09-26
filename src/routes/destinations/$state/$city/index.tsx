import { createFileRoute } from "@tanstack/react-router";
import CityHub from "@/pages/destinations/CityHub";
import { buildRouteHead } from "@/lib/seo-head";
import { getStateBySlug, getCityBySlug } from "@/data/neTaxonomy";
import { NEARBY_ADVENTURES } from "@/data/nearbyAdventures";

export const Route = createFileRoute("/destinations/$state/$city/")({
  head: ({ params }) => {
    const state = getStateBySlug(params.state);
    const city = getCityBySlug(params.state, params.city);
    const hasNearby = (params.state === "assam" || params.state === "meghalaya") && Boolean(NEARBY_ADVENTURES[params.city]);
    const title = city
      ? `Places to Visit in ${city.name}, ${state?.name} | XTSY`
      : "Places to Visit in Northeast India | XTSY";
    return buildRouteHead({
      path: `/destinations/${params.state}/${params.city}`,
      title: title.slice(0, 65),
      description:
        city ? `${city.blurb} ${hasNearby ? `Explore nearby adventure activities from ${city.name}.` : ""}`.slice(0, 155) :
        "Attractions, viewpoints and day trips around Northeast India base towns.",
      keywords: hasNearby ? `adventure activities near ${city?.name}, adventures near me ${city?.name}, ${city?.name} day trips` : undefined,
      noIndex: !city,
    });
  },
  component: CityHub,
});
