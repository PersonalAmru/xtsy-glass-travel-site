import { createFileRoute } from "@tanstack/react-router";
import AdminFranchisesV2 from "@/pages/admin/AdminFranchisesV2";

export const Route = createFileRoute("/admin/franchises")({
  component: AdminFranchisesV2,
});
