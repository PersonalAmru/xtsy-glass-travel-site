import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo-head";
import AdminTourPricing from "@/pages/admin/AdminTourPricing";

export const Route = createFileRoute("/admin/tour-pricing")({
  head: () =>
    buildRouteHead({
      path: "/admin/tour-pricing",
      title: "Admin Tour Pricing | XTSY",
      description: "Internal tour package pricing and margin controls for XTSY.",
      noIndex: true,
    }),
  component: AdminTourPricing,
});
