import { createFileRoute } from "@tanstack/react-router";
import XTSY270 from "@/pages/XTSY270";
import { buildRouteHead } from "@/lib/seo-head";

export const Route = createFileRoute("/xtsy-270")({
  head: () =>
    buildRouteHead({
      path: "/xtsy-270",
      title: "XTSY 270: India's 270 Degree Glass Suite, Shillong",
      description:
        "Stay in XTSY 270, a 270 degree glass suite overlooking the Shillong hills. See photos, what's included, rates and availability, and book direct.",
    }),
  component: XTSY270,
});
