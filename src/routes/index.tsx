import { createFileRoute } from "@tanstack/react-router";
import Index from "@/pages/Index";
import { buildRouteHead } from "@/lib/seo-head";
import { HOSTEL_SCHEMA } from "@/data/siteSchemas";

export const Route = createFileRoute("/")({
  head: () =>
    buildRouteHead({
      path: "/",
      title: "XTSY Travellers Hostel in New Shillong Township | Stays & Tours",
      description:
        "Stay in New Shillong Township: mixed dorm beds from ₹399, King Double ₹2,200 and Panorama stay-only ₹5,399 or breakfast-for-two ₹5,799 per night. Check-in 11 AM, check-out 10 AM.",
      keywords:
        "best hostel Shillong, biggest hostel northeast India, Shillong hostel, Meghalaya accommodation, budget stay Shillong",
      preloadImage: "/lovable-uploads/8059ea95-b64d-4eba-8b12-52e002c59567.avif",
      jsonLd: [HOSTEL_SCHEMA],
    }),
  component: Index,
});
