import { createFileRoute } from "@tanstack/react-router";
import UserInstall from "@/pages/install/UserInstall";
import { buildRouteHead } from "@/lib/seo-head";

export const Route = createFileRoute("/install")({
  head: () =>
    buildRouteHead({
      path: "/install",
      title: "Install the XTSY App on Your Phone",
      description:
        "Add the XTSY app to your home screen for faster booking, offline trip details, booking updates and member-only direct rates on Shillong stays.",
    }),
  component: UserInstall,
});
