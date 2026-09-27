import { createFileRoute } from "@tanstack/react-router";
import PlanTripV2, { planTripSchema } from "@/pages/v2/PlanTripV2";
import { buildRouteHead } from "@/lib/seo-head";

export const Route = createFileRoute("/plan-trip-with-ai")({
  head: () =>
    buildRouteHead({
      path: "/plan-trip-with-ai",
      jsonLd: planTripSchema(),
      title: "Plan a Meghalaya & Northeast India Trip with AI | XTSY",
      description:
        "Free trip planner for Shillong, Meghalaya and Northeast India: day-by-day plans with real drive times and XTSY Travellers Hostel in New Shillong as your base.",
      keywords: "meghalaya trip planner, shillong itinerary, northeast india itinerary, ai trip planner",
    }),
  component: PlanTripV2,
});
