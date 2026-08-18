import { createFileRoute } from "@tanstack/react-router";
import Gallery from "@/pages/Gallery";
import { buildRouteHead } from "@/lib/seo-head";

export const Route = createFileRoute("/gallery")({
  head: () =>
    buildRouteHead({
      path: "/gallery",
      title: "XTSY Photo Gallery — Hostel, Glass Suite & Meghalaya Photos",
      description:
        "See inside XTSY Shillong — 270° glass suite, dormitories, common areas and mountain views. Real photos from India's biggest hostel in Meghalaya.",
      keywords: "XTSY photos, Shillong hostel gallery, glass suite photos, hostel rooms Meghalaya",
    }),
  component: Gallery,
});
