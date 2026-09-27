import { createFileRoute } from "@tanstack/react-router";
import ExperienceByXtsy, { experienceSchema } from "@/pages/v2/ExperienceByXtsy";
import { buildRouteHead } from "@/lib/seo-head";

export const Route = createFileRoute("/xtsy-270")({
  head: () =>
    buildRouteHead({
      path: "/xtsy-270",
      ogType: "product",
      jsonLd: [experienceSchema()],
      title: "Experience by XTSY — India's First Stargaze Glamp, Shillong",
      description:
        "Stay at Experience by XTSY, India's first stargaze glamp — a 270° panoramic glass suite in New Shillong Township. See photos, what's included, rates and availability, and book direct.",
    }),
  component: ExperienceByXtsy,
});
