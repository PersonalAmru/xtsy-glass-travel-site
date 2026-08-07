import { createFileRoute } from "@tanstack/react-router";
import AdminSearchConsole from "@/pages/admin/AdminSearchConsole";

export const Route = createFileRoute("/admin/search")({
  component: AdminSearchConsole,
});
