import { createFileRoute } from "@tanstack/react-router";
import AdminDataLayerDebug from "@/pages/admin/AdminDataLayerDebug";

export const Route = createFileRoute("/admin/datalayer")({
  component: AdminDataLayerDebug,
});
