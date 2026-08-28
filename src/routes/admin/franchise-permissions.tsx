import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo-head";
import AdminFranchisePermissions from "@/pages/admin/AdminFranchisePermissions";

export const Route = createFileRoute("/admin/franchise-permissions")({
  head: () =>
    buildRouteHead({
      path: "/admin/franchise-permissions",
      title: "Admin Franchise Permissions | XTSY",
      description: "Internal franchise role and permission management for XTSY.",
      noIndex: true,
    }),
  component: AdminFranchisePermissions,
});
