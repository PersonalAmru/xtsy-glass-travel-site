import { createFileRoute } from "@tanstack/react-router";
import AdminSEOPositionTracking from "@/pages/admin/AdminSEOPositionTracking";

export const Route = createFileRoute("/admin/seo/tracking")({
  component: AdminSEOPositionTracking,
});
