import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo-head";
import AdminActivity from "@/pages/admin/AdminActivity";

export const Route = createFileRoute("/admin/activity")({
  head: () =>
    buildRouteHead({
      path: "/admin/activity",
      title: "Admin Live Activity | XTSY",
      description: "Internal real-time visitor activity feed for XTSY staff.",
      noIndex: true,
    }),
  component: AdminActivity,
});
