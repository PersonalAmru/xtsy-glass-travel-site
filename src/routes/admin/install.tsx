import { createFileRoute } from "@tanstack/react-router";
import AdminInstall from "@/pages/install/AdminInstall";

export const Route = createFileRoute("/admin/install")({
  component: AdminInstall,
});
