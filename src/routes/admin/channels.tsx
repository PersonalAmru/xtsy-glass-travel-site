import { createFileRoute } from "@tanstack/react-router";
import AdminChannels from "@/pages/admin/AdminChannels";

export const Route = createFileRoute("/admin/channels")({
  component: AdminChannels,
});
