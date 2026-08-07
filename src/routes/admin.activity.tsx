import { createFileRoute } from "@tanstack/react-router";
import AdminActivity from "@/pages/admin/AdminActivity";

export const Route = createFileRoute("/admin/activity")({
  component: AdminActivity,
});
