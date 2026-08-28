import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo-head";
import AdminSearchConsole from "@/pages/admin/AdminSearchConsole";

export const Route = createFileRoute("/admin/analytics/search")({
  head: () =>
    buildRouteHead({
      path: "/admin/analytics/search",
      title: "Admin Analytics Search Console | XTSY",
      description: "Internal Search Console analytics view for XTSY.",
      noIndex: true,
    }),
  component: AdminSearchConsole,
});
