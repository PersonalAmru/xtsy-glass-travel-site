import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo-head";
import AdminDataLayerDebug from "@/pages/admin/AdminDataLayerDebug";

export const Route = createFileRoute("/admin/datalayer")({
  head: () =>
    buildRouteHead({
      path: "/admin/datalayer",
      title: "Admin DataLayer Debug | XTSY",
      description: "Internal GTM dataLayer debugging console for XTSY analytics.",
      noIndex: true,
    }),
  component: AdminDataLayerDebug,
});
