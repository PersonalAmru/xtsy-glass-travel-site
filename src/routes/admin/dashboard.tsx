import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo-head";
import AdminOverview from "@/pages/admin/AdminOverview";

export const Route = createFileRoute("/admin/dashboard")({
  head: () =>
    buildRouteHead({
      path: "/admin/dashboard",
      title: "Admin Dashboard | XTSY",
      description: "Internal XTSY admin dashboard with operational KPIs.",
      noIndex: true,
    }),
  component: AdminOverview,
});
