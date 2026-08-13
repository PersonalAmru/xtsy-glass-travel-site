import { createFileRoute } from "@tanstack/react-router";
import FranchiseInstall from "@/pages/install/FranchiseInstall";

export const Route = createFileRoute("/franchise/install")({
  component: FranchiseInstall,
});
