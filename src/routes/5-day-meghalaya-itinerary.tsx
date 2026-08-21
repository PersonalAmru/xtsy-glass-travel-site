import { createFileRoute } from "@tanstack/react-router";
import BlogItinerary5Day from "@/pages/destinations/BlogItinerary5Day";
import { buildRouteHead } from "@/lib/seo-head";

export const Route = createFileRoute("/5-day-meghalaya-itinerary")({
  head: () =>
    buildRouteHead({
      path: "/5-day-meghalaya-itinerary",
      title: "5 Day Meghalaya Itinerary: Route, Cost, Stays | XTSY",
      description:
        "Five day Meghalaya plan covering Shillong, Cherrapunji, Mawlynnong, Dawki and the living root bridges, with day-by-day distances, budgets and where to stay.",
    }),
  component: BlogItinerary5Day,
});
