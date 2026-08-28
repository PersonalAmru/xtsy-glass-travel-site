import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo-head";
import AdminSearchConsole from "@/pages/admin/AdminSearchConsole";

export const Route = createFileRoute("/admin/search")({
  head: () =>
    buildRouteHead({
      path: "/admin/search",
      title: "Admin Search Console | XTSY",
      description: "Internal Google Search Console reporting for XTSY.",
      noIndex: true,
    }),
  component: AdminSearchConsole,
});
