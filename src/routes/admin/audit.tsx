import { createFileRoute } from "@tanstack/react-router";
import AdminAuditLogs from "@/pages/admin/AdminAuditLogs";

export const Route = createFileRoute("/admin/audit")({
  component: AdminAuditLogs,
});
