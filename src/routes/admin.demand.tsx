import { createFileRoute } from "@tanstack/react-router";
import AdminDemand from "@/pages/admin/AdminDemand";

export const Route = createFileRoute("/admin/demand")({
  component: AdminDemand,
});
