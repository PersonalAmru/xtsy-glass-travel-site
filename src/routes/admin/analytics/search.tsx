import { createFileRoute } from "@tanstack/react-router";
import AdminSearchConsole from "@/pages/admin/AdminSearchConsole";

export const Route = createFileRoute("/admin/analytics/search")({
  component: AdminSearchConsole,
});
