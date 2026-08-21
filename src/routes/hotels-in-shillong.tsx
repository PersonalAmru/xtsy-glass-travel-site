import { createFileRoute } from "@tanstack/react-router";
import HotelsInShillong from "@/pages/HotelsInShillong";
import { buildRouteHead } from "@/lib/seo-head";

export const Route = createFileRoute("/hotels-in-shillong")({
  head: () =>
    buildRouteHead({
      path: "/hotels-in-shillong",
      title: "Hotels in Shillong: Areas, Prices & Alternatives | XTSY",
      description:
        "Where to stay in Shillong by area and budget, honest hotel price ranges, and when a hostel dorm or private room at XTSY works out better value.",
    }),
  component: HotelsInShillong,
});
