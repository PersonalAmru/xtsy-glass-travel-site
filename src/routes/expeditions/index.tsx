import { createFileRoute } from "@tanstack/react-router";
import ExpeditionsIndex from "@/pages/expeditions/ExpeditionsIndex";
import { buildRouteHead } from "@/lib/seo-head";

export const Route = createFileRoute("/expeditions/")({
  head: () =>
    buildRouteHead({
      path: "/expeditions",
      title: "Northeast India Motorbike & 4x4 Expeditions | XTSY",
      description:
        "Motorbike and 4x4 expedition routes across Northeast India — Guwahati to Shillong, Tawang, Kohima and the Meghalaya loop. Routes, seasons and logistics.",
      noIndex: true,
    }),
  component: ExpeditionsIndex,
});
