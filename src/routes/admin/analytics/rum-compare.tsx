import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo-head";
import AdminRUMCompare from "@/pages/admin/AdminRUMCompare";

export const Route = createFileRoute("/admin/analytics/rum-compare")({
  head: () =>
    buildRouteHead({
      path: "/admin/analytics/rum-compare",
      title: "Admin RUM Comparison | XTSY",
      description: "Internal real-user-monitoring comparison for XTSY pages.",
      noIndex: true,
    }),
  component: AdminRUMCompare,
});
