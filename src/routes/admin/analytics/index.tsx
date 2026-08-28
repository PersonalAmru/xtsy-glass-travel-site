import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo-head";
import AdminAnalytics from "@/pages/admin/AdminAnalytics";

export const Route = createFileRoute("/admin/analytics/")({
  head: () =>
    buildRouteHead({
      path: "/admin/analytics/",
      title: "Admin Analytics | XTSY",
      description: "Internal validated traffic and conversion analytics for XTSY.",
      noIndex: true,
    }),
  component: AdminAnalytics,
});
