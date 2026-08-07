import { createFileRoute } from "@tanstack/react-router";
import BlogHiddenPlaces from "@/pages/destinations/BlogHiddenPlaces";

export const Route = createFileRoute("/hidden-places-in-meghalaya")({
  component: BlogHiddenPlaces,
});
