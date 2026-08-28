import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo-head";
import AdminOTAs from "@/pages/admin/AdminOTAs";

export const Route = createFileRoute("/admin/otas")({
  head: () =>
    buildRouteHead({
      path: "/admin/otas",
      title: "Admin OTA Connections | XTSY",
      description: "Internal OTA integration settings for XTSY properties.",
      noIndex: true,
    }),
  component: AdminOTAs,
});
