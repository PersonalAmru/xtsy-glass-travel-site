import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo-head";
import LiveTrafficCommandCenter from "@/pages/admin/LiveTrafficCommandCenter";

export const Route = createFileRoute("/admin/traffic")({
  head: () =>
    buildRouteHead({
      path: "/admin/traffic",
      title: "Admin Live Traffic | XTSY",
      description: "Internal live traffic command centre for XTSY analytics.",
      noIndex: true,
    }),
  component: LiveTrafficCommandCenter,
});
