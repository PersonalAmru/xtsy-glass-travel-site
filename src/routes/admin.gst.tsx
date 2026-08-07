import { createFileRoute } from "@tanstack/react-router";
import AdminGST from "@/pages/admin/AdminGST";

export const Route = createFileRoute("/admin/gst")({
  component: AdminGST,
});
