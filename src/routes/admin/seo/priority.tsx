import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo-head";
import AdminSEOPriority from "@/pages/admin/AdminSEOPriority";

export const Route = createFileRoute("/admin/seo/priority")({
  head: () =>
    buildRouteHead({
      path: "/admin/seo/priority",
      title: "Admin SEO Priority | XTSY",
      description: "Internal SEO page prioritisation queue for XTSY.",
      noIndex: true,
    }),
  component: AdminSEOPriority,
});
