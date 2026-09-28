import { createFileRoute } from "@tanstack/react-router";
import LuxuryGlampingShillong from "@/pages/LuxuryGlampingShillong";
import { buildRouteHead } from "@/lib/seo-head";

export const Route = createFileRoute("/luxury-glamping-shillong")({
  head: () =>
    buildRouteHead({
      path: "/luxury-glamping-shillong",
      title: "Luxury Glamping in Shillong & Meghalaya | XTSY",
      description:
        "Glamping near Shillong with proper beds, private washrooms and mountain views, including Experience by XTSY, India's first stargaze glamp, for couples.",
    }),
  component: LuxuryGlampingShillong,
});
