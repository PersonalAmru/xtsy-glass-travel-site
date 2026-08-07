import { createFileRoute } from "@tanstack/react-router";
import AdminLoaderEvents from "@/pages/admin/AdminLoaderEvents";

export const Route = createFileRoute("/admin/analytics/loader-events")({
  component: AdminLoaderEvents,
});
