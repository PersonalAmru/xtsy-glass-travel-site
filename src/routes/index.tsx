import { createFileRoute } from "@tanstack/react-router";
import Index from "@/pages/Index";
import { buildRouteHead } from "@/lib/seo-head";
import { HOSTEL_SCHEMA } from "@/data/siteSchemas";

export const Route = createFileRoute("/")({
  head: () =>
    buildRouteHead({
      path: "/",
      title: "Best Hostel in Shillong from ₹369/night | XTSY",
      description:
        "India's biggest hostel in Shillong. Dorm beds from ₹369, 270° glass suite ₹4,999 and curated Meghalaya tours. Book direct and save 20-30% vs OTAs.",
      keywords:
        "best hostel Shillong, biggest hostel northeast India, Shillong hostel, Meghalaya accommodation, budget stay Shillong",
      jsonLd: [HOSTEL_SCHEMA],
    }),
  component: Index,
});
