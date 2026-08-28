import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo-head";
import AdminOverview from "@/pages/admin/AdminOverview";

export const Route = createFileRoute("/admin/")({
  head: () =>
    buildRouteHead({
      path: "/admin/",
      title: "Admin Overview | XTSY",
      description: "Internal XTSY admin overview dashboard.",
      noIndex: true,
    }),
  component: AdminOverview,
});
