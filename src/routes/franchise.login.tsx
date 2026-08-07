import { createFileRoute } from "@tanstack/react-router";
import FranchiseLogin from "@/pages/franchise/FranchiseLogin";

export const Route = createFileRoute("/franchise/login")({
  component: FranchiseLogin,
});
