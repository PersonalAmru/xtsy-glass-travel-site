import { createFileRoute } from "@tanstack/react-router";
import AdminSchemaResults from "@/pages/admin/AdminSchemaResults";

export const Route = createFileRoute("/admin/seo/schema-results")({
  component: AdminSchemaResults,
});
