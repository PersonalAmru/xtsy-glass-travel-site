import { createFileRoute } from "@tanstack/react-router";
import GuwahatiToShillongTransport from "@/pages/GuwahatiToShillongTransport";
import { buildRouteHead } from "@/lib/seo-head";

export const Route = createFileRoute("/travel-guide/guwahati-to-shillong-transport")({
  head: () =>
    buildRouteHead({
      path: "/travel-guide/guwahati-to-shillong-transport",
      title: "Guwahati to Shillong: Cab, Bus & Shared Taxi",
      description:
        "All ways to get from Guwahati to Shillong with 2026 fares, journey times, pickup points and booking tips for cabs, buses, shared sumos and helicopter.",
    }),
  component: GuwahatiToShillongTransport,
});
