import { createFileRoute } from "@tanstack/react-router";
import FranchiseDashboard from "@/pages/franchise/FranchiseDashboard";

export const Route = createFileRoute("/franchise/")({
  component: FranchiseDashboard,
});
