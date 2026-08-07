import { createFileRoute } from "@tanstack/react-router";
import AdminInventory from "@/pages/admin/AdminInventory";

export const Route = createFileRoute("/admin/inventory")({
  component: AdminInventory,
});
