import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo-head";
import AdminFinance from "@/pages/admin/AdminFinance";

export const Route = createFileRoute("/admin/finance")({
  head: () =>
    buildRouteHead({
      path: "/admin/finance",
      title: "Admin Finance | XTSY",
      description: "Internal revenue, settlement and payout reporting for XTSY.",
      noIndex: true,
    }),
  component: AdminFinance,
});
