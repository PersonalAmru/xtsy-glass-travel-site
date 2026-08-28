import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo-head";
import AdminSchemaResults from "@/pages/admin/AdminSchemaResults";

export const Route = createFileRoute("/admin/seo/schema-results")({
  head: () =>
    buildRouteHead({
      path: "/admin/seo/schema-results",
      title: "Admin Schema Results | XTSY",
      description: "Internal structured data validation results for XTSY.",
      noIndex: true,
    }),
  component: AdminSchemaResults,
});
