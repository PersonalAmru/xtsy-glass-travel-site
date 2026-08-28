import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo-head";
import AdminSEOHeroManager from "@/pages/admin/AdminSEOHeroManager";

export const Route = createFileRoute("/admin/seo/hero-manager")({
  head: () =>
    buildRouteHead({
      path: "/admin/seo/hero-manager",
      title: "Admin SEO Hero Manager | XTSY",
      description: "Internal hero image manager for XTSY programmatic pages.",
      noIndex: true,
    }),
  component: AdminSEOHeroManager,
});
