import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo-head";
import AdminAuditLogs from "@/pages/admin/AdminAuditLogs";

export const Route = createFileRoute("/admin/audit")({
  head: () =>
    buildRouteHead({
      path: "/admin/audit",
      title: "Admin Audit Logs | XTSY",
      description: "Internal audit log viewer for XTSY admin actions.",
      noIndex: true,
    }),
  component: AdminAuditLogs,
});
