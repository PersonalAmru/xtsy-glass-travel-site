import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo-head";
import AdminSEOPositionTracking from "@/pages/admin/AdminSEOPositionTracking";

export const Route = createFileRoute("/admin/seo/tracking")({
  head: () =>
    buildRouteHead({
      path: "/admin/seo/tracking",
      title: "Admin SEO Position Tracking | XTSY",
      description: "Internal keyword rank tracking dashboard for XTSY.",
      noIndex: true,
    }),
  component: AdminSEOPositionTracking,
});
