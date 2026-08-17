import { createFileRoute } from "@tanstack/react-router";
import AdminTourPricing from "@/pages/admin/AdminTourPricing";

export const Route = createFileRoute("/admin/tour-pricing")({
  component: AdminTourPricing,
});
