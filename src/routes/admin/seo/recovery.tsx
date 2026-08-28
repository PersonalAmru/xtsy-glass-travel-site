import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo-head";
import AdminSEORecovery from "@/pages/admin/AdminSEORecovery";

export const Route = createFileRoute("/admin/seo/recovery")({
  head: () =>
    buildRouteHead({
      path: "/admin/seo/recovery",
      title: "Admin SEO Recovery | XTSY",
      description: "Internal SEO recovery tracker for XTSY affected URLs.",
      noIndex: true,
    }),
  component: AdminSEORecovery,
});
