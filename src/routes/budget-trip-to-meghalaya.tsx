import { createFileRoute } from "@tanstack/react-router";
import BlogBudgetTrip from "@/pages/destinations/BlogBudgetTrip";

export const Route = createFileRoute("/budget-trip-to-meghalaya")({
  component: BlogBudgetTrip,
});
