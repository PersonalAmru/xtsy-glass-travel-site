import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo-head";
import AdminDemand from "@/pages/admin/AdminDemand";

export const Route = createFileRoute("/admin/demand")({
  head: () =>
    buildRouteHead({
      path: "/admin/demand",
      title: "Admin Demand Intelligence | XTSY",
      description: "Internal demand signals and pricing insights for XTSY.",
      noIndex: true,
    }),
  component: AdminDemand,
});
