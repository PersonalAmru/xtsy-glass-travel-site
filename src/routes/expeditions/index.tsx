import { createFileRoute } from "@tanstack/react-router";
import ExpeditionsIndex from "@/pages/expeditions/ExpeditionsIndex";
import { buildRouteHead } from "@/lib/seo-head";

export const Route = createFileRoute("/expeditions/")({
  head: () =>
    buildRouteHead({
      path: "/expeditions",
      title: "Motorbike & 4x4 Expeditions in Northeast India | XTSY",
      description:
        "Plan motorbike expeditions across Northeast India and 4x4 expeditions in Meghalaya. Compare Guwahati, Tawang, Kohima and Shillong loops, permits and seasons.",
      keywords: "motorbike expedition Northeast India, 4x4 expedition Meghalaya, adventure tours in Northeast India",
    }),
  component: ExpeditionsIndex,
});
