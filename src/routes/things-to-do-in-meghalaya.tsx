import { createFileRoute } from "@tanstack/react-router";
import ThingsToDoInMeghalaya from "@/pages/destinations/ThingsToDoInMeghalaya";
import { buildRouteHead } from "@/lib/seo-head";

export const Route = createFileRoute("/things-to-do-in-meghalaya")({
  head: () =>
    buildRouteHead({
      path: "/things-to-do-in-meghalaya",
      title: "Things to Do in Meghalaya: 20 Ideas | XTSY",
      description:
        "Explore adventure activities in Meghalaya: root bridge treks, caving, Umngot kayaking and nearby outings from Shillong, with routes and seasonal tips.",
      keywords: "adventure activities in Meghalaya, adventure activities in Shillong, things to do in Meghalaya, trekking and kayaking Meghalaya",
    }),
  component: ThingsToDoInMeghalaya,
});
