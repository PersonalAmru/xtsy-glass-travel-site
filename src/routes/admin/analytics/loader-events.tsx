import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo-head";
import AdminLoaderEvents from "@/pages/admin/AdminLoaderEvents";

export const Route = createFileRoute("/admin/analytics/loader-events")({
  head: () =>
    buildRouteHead({
      path: "/admin/analytics/loader-events",
      title: "Admin Loader Events | XTSY",
      description: "Internal loader event diagnostics for XTSY analytics.",
      noIndex: true,
    }),
  component: AdminLoaderEvents,
});
