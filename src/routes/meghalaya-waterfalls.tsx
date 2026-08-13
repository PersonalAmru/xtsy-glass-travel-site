import { createFileRoute } from "@tanstack/react-router";
import CategoryPage from "@/pages/destinations/CategoryPage";

export const Route = createFileRoute("/meghalaya-waterfalls")({
  component: CategoryPage,
});
