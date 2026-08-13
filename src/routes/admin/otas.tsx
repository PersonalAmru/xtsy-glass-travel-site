import { createFileRoute } from "@tanstack/react-router";
import AdminOTAs from "@/pages/admin/AdminOTAs";

export const Route = createFileRoute("/admin/otas")({
  component: AdminOTAs,
});
