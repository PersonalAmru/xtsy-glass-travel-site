import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo-head";
import AdminTours from "@/pages/admin/AdminTours";

export const Route = createFileRoute("/admin/tours")({
  head: () =>
    buildRouteHead({
      path: "/admin/tours",
      title: "Admin Tours | XTSY",
      description: "Internal tour package management console for XTSY.",
      noIndex: true,
    }),
  component: AdminTours,
});
