import { createFileRoute } from "@tanstack/react-router";
import TabBistro from "@/pages/TabBistro";
import { buildRouteHead } from "@/lib/seo-head";

export const Route = createFileRoute("/restaurant-in-shillong")({
  head: () =>
    buildRouteHead({
      path: "/restaurant-in-shillong",
      title: "Restaurant in Shillong: TAB Bistro by XTSY",
      description:
        "TAB Bistro by XTSY serves Khasi-inspired plates, cafe classics and late breakfasts in New Shillong Township. See the menu, timings and how to reserve a table.",
    }),
  component: TabBistro,
});
