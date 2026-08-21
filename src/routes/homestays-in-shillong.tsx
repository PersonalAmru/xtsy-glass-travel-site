import { createFileRoute } from "@tanstack/react-router";
import HomestaysInShillong from "@/pages/HomestaysInShillong";
import { buildRouteHead } from "@/lib/seo-head";

export const Route = createFileRoute("/homestays-in-shillong")({
  head: () =>
    buildRouteHead({
      path: "/homestays-in-shillong",
      title: "Homestays in Shillong: Options & Prices | XTSY",
      description:
        "Compare homestays in Shillong with hostel and hotel stays on price, privacy and location, plus what a Rs 369 dorm bed at XTSY includes for solo travellers.",
    }),
  component: HomestaysInShillong,
});
