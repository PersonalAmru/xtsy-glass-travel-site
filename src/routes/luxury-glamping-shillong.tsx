import { createFileRoute } from "@tanstack/react-router";
import LuxuryGlampingShillong from "@/pages/LuxuryGlampingShillong";
import { buildRouteHead } from "@/lib/seo-head";

export const Route = createFileRoute("/luxury-glamping-shillong")({
  head: () =>
    buildRouteHead({
      path: "/luxury-glamping-shillong",
      title: "Luxury Glamping in Shillong & Meghalaya | XTSY",
      description:
        "Glamping near Shillong with proper beds, private washrooms and mountain views, plus the XTSY 270 degree glass suite for couples wanting comfort outdoors.",
    }),
  component: LuxuryGlampingShillong,
});
