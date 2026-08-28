import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo-head";
import AdminWhatsAppTemplates from "@/pages/admin/AdminWhatsAppTemplates";

export const Route = createFileRoute("/admin/whatsapp")({
  head: () =>
    buildRouteHead({
      path: "/admin/whatsapp",
      title: "Admin WhatsApp Templates | XTSY",
      description: "Internal WhatsApp message template manager for XTSY.",
      noIndex: true,
    }),
  component: AdminWhatsAppTemplates,
});
