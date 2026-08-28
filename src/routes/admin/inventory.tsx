import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo-head";
import AdminInventory from "@/pages/admin/AdminInventory";

export const Route = createFileRoute("/admin/inventory")({
  head: () =>
    buildRouteHead({
      path: "/admin/inventory",
      title: "Admin Inventory Control | XTSY",
      description: "Internal room inventory and availability controls for XTSY.",
      noIndex: true,
    }),
  component: AdminInventory,
});
