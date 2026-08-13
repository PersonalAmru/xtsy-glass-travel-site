import { createFileRoute } from "@tanstack/react-router";
import LiveTrafficCommandCenter from "@/pages/admin/LiveTrafficCommandCenter";

export const Route = createFileRoute("/admin/traffic")({
  component: LiveTrafficCommandCenter,
});
