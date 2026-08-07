import { createFileRoute } from "@tanstack/react-router";
import AdminPropertiesV2 from "@/pages/admin/AdminPropertiesV2";

export const Route = createFileRoute("/admin/properties")({
  component: AdminPropertiesV2,
});
