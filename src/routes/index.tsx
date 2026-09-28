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
      title: "Best Hostel in Shillong | XTSY Travellers Hostel, from ₹389",
      description:
        "XTSY Travellers Hostel, New Shillong Township: dorms from ₹389, women-only dorm, King Double ₹2,200, glass suite ₹5,399 and TAB Bistro on site.",
      keywords:
        "best hostel in Shillong, hostel in Shillong, hostels in Shillong, cheap hostel Shillong, budget stay Shillong, dorm in Shillong, backpacker hostel Meghalaya",
      // Preload the real hero photo (responsive WebP) so it is the first image the browser fetches.
      preloadImage: hero?.src ?? HERO_IMAGE.src,
      preloadImageSrcSet: hero?.srcSet,
      preloadImageSizes: hero ? "100vw" : undefined,
      jsonLd: [HOSTEL_SCHEMA],
    }),
  component: Index,
});
