import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo-head";
import AdminReviews from "@/pages/admin/AdminReviews";

export const Route = createFileRoute("/admin/reviews")({
  head: () =>
    buildRouteHead({
      path: "/admin/reviews",
      title: "Admin Reviews | XTSY",
      description: "Internal guest review moderation and owner replies for XTSY.",
      noIndex: true,
    }),
  component: AdminReviews,
});
