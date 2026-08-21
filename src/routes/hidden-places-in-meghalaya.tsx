import { createFileRoute } from "@tanstack/react-router";
import BlogHiddenPlaces from "@/pages/destinations/BlogHiddenPlaces";
import { buildRouteHead } from "@/lib/seo-head";

export const Route = createFileRoute("/hidden-places-in-meghalaya")({
  head: () =>
    buildRouteHead({
      path: "/hidden-places-in-meghalaya",
      title: "Hidden Places in Meghalaya Tourists Miss | XTSY",
      description:
        "Lesser-known Meghalaya spots beyond Cherrapunji and Dawki: quiet waterfalls, canyons, village trails and viewpoints, with how to reach each from Shillong.",
    }),
  component: BlogHiddenPlaces,
});
