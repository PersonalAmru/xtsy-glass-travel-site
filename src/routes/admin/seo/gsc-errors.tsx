import { createFileRoute } from "@tanstack/react-router";
import AdminGSCErrors from "@/pages/admin/AdminGSCErrors";

export const Route = createFileRoute("/admin/seo/gsc-errors")({
  component: AdminGSCErrors,
});
