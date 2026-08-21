import { createFileRoute } from "@tanstack/react-router";
import FranchiseInstall from "@/pages/install/FranchiseInstall";
import { buildRouteHead } from "@/lib/seo-head";

export const Route = createFileRoute("/franchise/install")({
  head: () =>
    buildRouteHead({
      path: "/franchise/install",
      title: "Install the XTSY Franchise App",
      description:
        "Install the XTSY franchise partner app for property dashboards, inventory control and booking notifications on your phone.",
      noIndex: true,
    }),
  component: FranchiseInstall,
});
