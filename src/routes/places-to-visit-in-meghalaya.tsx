import { createFileRoute } from "@tanstack/react-router";
import PlacesToVisitMeghalaya from "@/pages/destinations/PlacesToVisitMeghalaya";
import { buildRouteHead } from "@/lib/seo-head";

export const Route = createFileRoute("/places-to-visit-in-meghalaya")({
  head: () =>
    buildRouteHead({
      path: "/places-to-visit-in-meghalaya",
      title: "Places to Visit in Meghalaya: Top 25 Spots | XTSY",
      description:
        "Twenty-five places to visit in Meghalaya with distance from Shillong, entry fees, ideal season and how to string them into a 3 to 7 day route.",
    }),
  component: PlacesToVisitMeghalaya,
});
