import { createFileRoute } from "@tanstack/react-router";
import CategoryPage from "@/pages/destinations/CategoryPage";
import { buildRouteHead } from "@/lib/seo-head";

export const Route = createFileRoute("/meghalaya-waterfalls")({
  head: () =>
    buildRouteHead({
      path: "/meghalaya-waterfalls",
      title: "Meghalaya Waterfalls: Nohkalikai & More | XTSY",
      description:
        "The major Meghalaya waterfalls ranked by height and access: Nohkalikai, Seven Sisters, Elephant Falls and Krang Suri, with best season and entry details.",
    }),
  component: CategoryPage,
});
