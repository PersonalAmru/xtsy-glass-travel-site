import { createFileRoute } from "@tanstack/react-router";
import AdminRUMCompare from "@/pages/admin/AdminRUMCompare";

export const Route = createFileRoute("/admin/analytics/rum-compare")({
  component: AdminRUMCompare,
});
