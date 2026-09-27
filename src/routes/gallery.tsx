import { createFileRoute } from "@tanstack/react-router";
import Gallery from "@/pages/v2/GalleryV2";
import { buildRouteHead } from "@/lib/seo-head";

export const Route = createFileRoute("/gallery")({
  head: () =>
    buildRouteHead({
      path: "/gallery",
      title: "XTSY Photo Gallery — Hostel, Experience by XTSY & Meghalaya Photos",
      description:
        "See inside XTSY Shillong — Experience by XTSY, dormitories, common areas and mountain views. Real photos from India's biggest hostel in Meghalaya.",
      keywords: "XTSY photos, Shillong hostel gallery, glass suite photos, hostel rooms Meghalaya",
    }),
  component: Gallery,
});
