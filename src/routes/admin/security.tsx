import { createFileRoute } from "@tanstack/react-router";
import AdminSecurity from "@/pages/admin/AdminSecurity";

export const Route = createFileRoute("/admin/security")({
  component: AdminSecurity,
});
