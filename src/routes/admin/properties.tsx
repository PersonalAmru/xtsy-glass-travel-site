import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo-head";
import AdminPropertiesV2 from "@/pages/admin/AdminPropertiesV2";

export const Route = createFileRoute("/admin/properties")({
  head: () =>
    buildRouteHead({
      path: "/admin/properties",
      title: "Admin Properties | XTSY",
      description: "Internal property configuration console for XTSY.",
      noIndex: true,
    }),
  component: AdminPropertiesV2,
});
