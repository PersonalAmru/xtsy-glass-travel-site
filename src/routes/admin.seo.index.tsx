import { createFileRoute } from "@tanstack/react-router";
import AdminSEODashboard from "@/pages/admin/AdminSEODashboard";

export const Route = createFileRoute("/admin/seo/")({
  component: AdminSEODashboard,
});
