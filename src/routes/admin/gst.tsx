import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo-head";
import AdminGST from "@/pages/admin/AdminGST";

export const Route = createFileRoute("/admin/gst")({
  head: () =>
    buildRouteHead({
      path: "/admin/gst",
      title: "Admin GST Reports | XTSY",
      description: "Internal GST filing and tax compliance reports for XTSY.",
      noIndex: true,
    }),
  component: AdminGST,
});
