import { createFileRoute } from "@tanstack/react-router";
import AdminWhatsAppTemplates from "@/pages/admin/AdminWhatsAppTemplates";

export const Route = createFileRoute("/admin/whatsapp")({
  component: AdminWhatsAppTemplates,
});
