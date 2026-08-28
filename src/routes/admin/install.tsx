import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo-head";
import AdminInstall from "@/pages/install/AdminInstall";

export const Route = createFileRoute("/admin/install")({
  head: () =>
    buildRouteHead({
      path: "/admin/install",
      title: "Admin App Install | XTSY",
      description: "Internal install prompt for the XTSY admin PWA.",
      noIndex: true,
    }),
  component: AdminInstall,
});
