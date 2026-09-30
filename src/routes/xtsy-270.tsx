import { createFileRoute } from "@tanstack/react-router";
import ExperienceByXtsy from "@/pages/v2/ExperienceByXtsy";
import { experienceSchema } from "@/pages/v2/experienceData";
import { buildRouteHead } from "@/lib/seo-head";

export const Route = createFileRoute("/xtsy-270")({
  head: () =>
    buildRouteHead({
      path: "/xtsy-270",
      ogType: "product",
      jsonLd: [experienceSchema()],
      title: "Experience by XTSY — India's First Stargaze Glamp, Shillong",
      description:
        "Experience by XTSY, India's first stargaze glamp: a 270° panoramic glass suite in New Shillong Township. Photos, what's included and rates. Book direct.",
    }),
  component: ExperienceByXtsy,
});
