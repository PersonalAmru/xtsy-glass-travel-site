import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo-head";
import AdminChannels from "@/pages/admin/AdminChannels";

export const Route = createFileRoute("/admin/channels")({
  head: () =>
    buildRouteHead({
      path: "/admin/channels",
      title: "Admin Channel Strategy | XTSY",
      description: "Internal OTA channel performance and distribution controls.",
      noIndex: true,
    }),
  component: AdminChannels,
});
