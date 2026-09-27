import { createFileRoute } from "@tanstack/react-router";
import TabBistroCatering from "@/pages/v2/CateringV2";
import { buildRouteHead } from "@/lib/seo-head";

export const Route = createFileRoute("/tab-bistro/catering")({
  head: () =>
    buildRouteHead({
      path: "/tab-bistro/catering",
      title: "TAB Bistro Catering in Shillong: Menus & Pricing",
      description:
        "Catering by TAB Bistro in Shillong for weddings, offices and group stays, with veg and non-veg menus, live counters and per-plate pricing on request.",
    }),
  component: TabBistroCatering,
});
