import { createFileRoute } from "@tanstack/react-router";
import AdminSEOPriority from "@/pages/admin/AdminSEOPriority";

export const Route = createFileRoute("/admin/seo/priority")({
  component: AdminSEOPriority,
});
