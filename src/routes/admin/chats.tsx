import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo-head";
import AdminGuestChats from "@/pages/admin/AdminGuestChats";

export const Route = createFileRoute("/admin/chats")({
  head: () =>
    buildRouteHead({
      path: "/admin/chats",
      title: "Admin Guest Chats | XTSY",
      description: "Internal guest chat inbox for XTSY support staff.",
      noIndex: true,
    }),
  component: AdminGuestChats,
});
