import { createFileRoute } from "@tanstack/react-router";
import WorkFromHome from "@/pages/WorkFromHome";
import { buildRouteHead } from "@/lib/seo-head";

export const Route = createFileRoute("/work-from-home")({
  head: () =>
    buildRouteHead({
      path: "/work-from-home",
      title: "Work From Meghalaya: Wifi, Desks & Long Stays | XTSY",
      description:
        "Remote work from Shillong at XTSY: wifi speeds, dedicated desks, power backup, quiet hours and discounted weekly and monthly long-stay rates.",
    }),
  component: WorkFromHome,
});
