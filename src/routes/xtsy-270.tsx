import { createFileRoute } from "@tanstack/react-router";
import XTSY270 from "@/pages/XTSY270";
import { buildRouteHead } from "@/lib/seo-head";

export const Route = createFileRoute("/xtsy-270")({
  head: () =>
    buildRouteHead({
      path: "/xtsy-270",
      title: "Experience by XTSY — India's First Stargaze Glamp, Shillong",
      description:
        "Stay at Experience by XTSY, India's first stargaze glamp — a 270° panoramic glass suite in New Shillong Township. See photos, what's included, rates and availability, and book direct.",
    }),
  component: XTSY270,
});
