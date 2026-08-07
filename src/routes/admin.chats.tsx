import { createFileRoute } from "@tanstack/react-router";
import AdminGuestChats from "@/pages/admin/AdminGuestChats";

export const Route = createFileRoute("/admin/chats")({
  component: AdminGuestChats,
});
