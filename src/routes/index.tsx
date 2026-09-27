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
        "India's biggest hostel in Shillong. Dorm beds from ₹369, Experience by XTSY ₹4,999 and curated Meghalaya tours. Book direct and save 20-30% vs OTAs.",
      keywords:
        "best hostel Shillong, biggest hostel northeast India, Shillong hostel, Meghalaya accommodation, budget stay Shillong",
      preloadImage: "/lovable-uploads/8059ea95-b64d-4eba-8b12-52e002c59567.avif",
      jsonLd: [HOSTEL_SCHEMA],
    }),
  component: Index,
});
