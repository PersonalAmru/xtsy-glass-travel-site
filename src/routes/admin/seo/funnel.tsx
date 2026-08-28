import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo-head";
import AdminDestinationFunnel from "@/pages/admin/AdminDestinationFunnel";

export const Route = createFileRoute("/admin/seo/funnel")({
  head: () =>
    buildRouteHead({
      path: "/admin/seo/funnel",
      title: "Admin Destination Funnel | XTSY",
      description: "Internal destination-to-booking funnel report for XTSY.",
      noIndex: true,
    }),
  component: AdminDestinationFunnel,
});
