import { createFileRoute } from "@tanstack/react-router";
import CategoryPage from "@/pages/destinations/CategoryPage";
import { buildRouteHead } from "@/lib/seo-head";

export const Route = createFileRoute("/meghalaya-viewpoints")({
  head: () =>
    buildRouteHead({
      path: "/meghalaya-viewpoints",
      title: "Best Viewpoints in Meghalaya | XTSY Travel",
      description:
        "The best Meghalaya viewpoints for sunrise, valleys and canyons, including Laitlum, Mawdok and Nohkalikai, with timings, entry fees and how to reach each.",
    }),
  component: CategoryPage,
});
