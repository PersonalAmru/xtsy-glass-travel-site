import { createFileRoute } from "@tanstack/react-router";
import BlogItinerary3Day from "@/pages/destinations/BlogItinerary3Day";
import { buildRouteHead } from "@/lib/seo-head";

export const Route = createFileRoute("/3-day-meghalaya-itinerary")({
  head: () =>
    buildRouteHead({
      path: "/3-day-meghalaya-itinerary",
      title: "3 Day Meghalaya Itinerary from Shillong | XTSY",
      description:
        "A tested 3 day Meghalaya itinerary: Shillong, Cherrapunji waterfalls and Dawki's Umngot river, with travel times, costs and hostel stays from Rs 369.",
    }),
  component: BlogItinerary3Day,
});
