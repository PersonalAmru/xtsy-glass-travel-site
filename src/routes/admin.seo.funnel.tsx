import { createFileRoute } from "@tanstack/react-router";
import AdminDestinationFunnel from "@/pages/admin/AdminDestinationFunnel";

export const Route = createFileRoute("/admin/seo/funnel")({
  component: AdminDestinationFunnel,
});
