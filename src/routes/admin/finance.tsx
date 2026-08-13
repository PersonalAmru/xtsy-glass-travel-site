import { createFileRoute } from "@tanstack/react-router";
import AdminFinance from "@/pages/admin/AdminFinance";

export const Route = createFileRoute("/admin/finance")({
  component: AdminFinance,
});
