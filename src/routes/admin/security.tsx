import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo-head";
import AdminSecurity from "@/pages/admin/AdminSecurity";

export const Route = createFileRoute("/admin/security")({
  head: () =>
    buildRouteHead({
      path: "/admin/security",
      title: "Admin Security | XTSY",
      description: "Internal security posture and dependency scan dashboard for XTSY.",
      noIndex: true,
    }),
  component: AdminSecurity,
});
