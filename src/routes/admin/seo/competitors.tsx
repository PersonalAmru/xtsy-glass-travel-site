import { createFileRoute } from "@tanstack/react-router";
import AdminCompetitorAnalysis from "@/pages/admin/AdminCompetitorAnalysis";

export const Route = createFileRoute("/admin/seo/competitors")({
  component: AdminCompetitorAnalysis,
});
