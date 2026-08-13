import { createFileRoute } from "@tanstack/react-router";
import AdminSEORecovery from "@/pages/admin/AdminSEORecovery";

export const Route = createFileRoute("/admin/seo/recovery")({
  component: AdminSEORecovery,
});
