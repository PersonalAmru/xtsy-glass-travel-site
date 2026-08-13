import { createFileRoute } from "@tanstack/react-router";
import AdminTours from "@/pages/admin/AdminTours";

export const Route = createFileRoute("/admin/tours")({
  component: AdminTours,
});
