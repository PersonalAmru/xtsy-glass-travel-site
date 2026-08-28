import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo-head";
import AdminSEODashboard from "@/pages/admin/AdminSEODashboard";

export const Route = createFileRoute("/admin/seo/")({
  head: () =>
    buildRouteHead({
      path: "/admin/seo/",
      title: "Admin SEO Dashboard | XTSY",
      description: "Internal SEO health dashboard for XTSY pages.",
      noIndex: true,
    }),
  component: AdminSEODashboard,
});
