import { createFileRoute } from "@tanstack/react-router";
import ThingsToDoInMeghalaya from "@/pages/destinations/ThingsToDoInMeghalaya";
import { buildRouteHead } from "@/lib/seo-head";

export const Route = createFileRoute("/things-to-do-in-meghalaya")({
  head: () =>
    buildRouteHead({
      path: "/things-to-do-in-meghalaya",
      title: "Things to Do in Meghalaya: 20 Ideas | XTSY",
      description:
        "Twenty things to do in Meghalaya, from root bridge treks and caving to Umngot kayaking and Shillong food crawls, with cost and season for each.",
    }),
  component: ThingsToDoInMeghalaya,
});
