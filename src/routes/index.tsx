import { createFileRoute } from "@tanstack/react-router";
import Index from "@/pages/Index";
import { buildRouteHead } from "@/lib/seo-head";
import { HOSTEL_SCHEMA } from "@/data/siteSchemas";
import { HERO_IMAGE } from "@/data/v2Images";
import { responsive } from "@/components/v2/primitives";

const hero = responsive(HERO_IMAGE.src);

export const Route = createFileRoute("/")({
  head: () =>
    buildRouteHead({
      path: "/",
      title: "XTSY Travellers Hostel in New Shillong Township | Stays & Tours",
      description:
        "Stay in New Shillong Township: mixed dorm beds from ₹399, King Double ₹2,200 and Panorama stay-only ₹5,399 or breakfast-for-two ₹5,799 per night. Check-in 11 AM, check-out 10 AM.",
      keywords:
        "best hostel Shillong, biggest hostel northeast India, Shillong hostel, Meghalaya accommodation, budget stay Shillong",
      // Preload the real hero photo (responsive WebP) so it is the first image the browser fetches.
      preloadImage: hero?.src ?? HERO_IMAGE.src,
      preloadImageSrcSet: hero?.srcSet,
      preloadImageSizes: hero ? "100vw" : undefined,
      jsonLd: [HOSTEL_SCHEMA],
    }),
  component: Index,
});
