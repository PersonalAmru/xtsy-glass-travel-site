import { createFileRoute } from "@tanstack/react-router";
import BlogBudgetTrip from "@/pages/destinations/BlogBudgetTrip";
import { buildRouteHead } from "@/lib/seo-head";

export const Route = createFileRoute("/budget-trip-to-meghalaya")({
  head: () =>
    buildRouteHead({
      path: "/budget-trip-to-meghalaya",
      title: "Budget Trip to Meghalaya: Costs & Plan | XTSY",
      description:
        "What a Meghalaya trip really costs: transport, permits, food, entry fees and dorm beds from Rs 369, with a sample low-budget route from Guwahati.",
    }),
  component: BlogBudgetTrip,
});
