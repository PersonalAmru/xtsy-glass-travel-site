import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo-head";
import AdminEnquiries from "@/pages/admin/AdminEnquiries";

export const Route = createFileRoute("/admin/enquiries")({
  head: () =>
    buildRouteHead({
      path: "/admin/enquiries",
      title: "Admin Enquiries | XTSY",
      description: "Internal tour and catering enquiry management for XTSY.",
      noIndex: true,
    }),
  component: AdminEnquiries,
});
