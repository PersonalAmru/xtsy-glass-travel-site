import { createFileRoute } from "@tanstack/react-router";
import AdminFranchisePermissions from "@/pages/admin/AdminFranchisePermissions";

export const Route = createFileRoute("/admin/franchise-permissions")({
  component: AdminFranchisePermissions,
});
