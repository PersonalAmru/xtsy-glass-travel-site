import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo-head";
import AdminFranchisesV2 from "@/pages/admin/AdminFranchisesV2";

export const Route = createFileRoute("/admin/franchises")({
  head: () =>
    buildRouteHead({
      path: "/admin/franchises",
      title: "Admin Franchises | XTSY",
      description: "Internal franchise partner management console for XTSY.",
      noIndex: true,
    }),
  component: AdminFranchisesV2,
});
