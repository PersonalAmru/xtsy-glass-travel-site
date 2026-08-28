import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo-head";
import AdminSEOWorkflow from "@/pages/admin/AdminSEOWorkflow";

export const Route = createFileRoute("/admin/seo/workflow")({
  head: () =>
    buildRouteHead({
      path: "/admin/seo/workflow",
      title: "Admin SEO Workflow | XTSY",
      description: "Internal SEO workflow phases and task board for XTSY.",
      noIndex: true,
    }),
  component: AdminSEOWorkflow,
});
