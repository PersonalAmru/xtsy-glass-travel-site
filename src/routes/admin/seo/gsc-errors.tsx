import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo-head";
import AdminGSCErrors from "@/pages/admin/AdminGSCErrors";

export const Route = createFileRoute("/admin/seo/gsc-errors")({
  head: () =>
    buildRouteHead({
      path: "/admin/seo/gsc-errors",
      title: "Admin GSC Errors | XTSY",
      description: "Internal Search Console coverage error triage for XTSY.",
      noIndex: true,
    }),
  component: AdminGSCErrors,
});
