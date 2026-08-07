import { createFileRoute } from "@tanstack/react-router";
import AdminSEOHeroManager from "@/pages/admin/AdminSEOHeroManager";

export const Route = createFileRoute("/admin/seo/hero-manager")({
  component: AdminSEOHeroManager,
});
