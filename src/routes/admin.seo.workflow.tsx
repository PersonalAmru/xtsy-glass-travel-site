import { createFileRoute } from "@tanstack/react-router";
import AdminSEOWorkflow from "@/pages/admin/AdminSEOWorkflow";

export const Route = createFileRoute("/admin/seo/workflow")({
  component: AdminSEOWorkflow,
});
