import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo-head";
import AdminCompetitorAnalysis from "@/pages/admin/AdminCompetitorAnalysis";

export const Route = createFileRoute("/admin/seo/competitors")({
  head: () =>
    buildRouteHead({
      path: "/admin/seo/competitors",
      title: "Admin Competitor Analysis | XTSY",
      description: "Internal Semrush competitor benchmarking for XTSY.",
      noIndex: true,
    }),
  component: AdminCompetitorAnalysis,
});
