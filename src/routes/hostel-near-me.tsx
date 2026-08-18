import { createFileRoute } from "@tanstack/react-router";
import HostelNearMe from "@/pages/HostelNearMe";
import { buildRouteHead } from "@/lib/seo-head";

export const Route = createFileRoute("/hostel-near-me")({
  head: () =>
    buildRouteHead({
      path: "/hostel-near-me",
      title: "Hostel Near Me in Shillong — Closest Backpacker Hostel to Police Bazar | XTSY",
      description:
        "Looking for a hostel near you in Shillong? XTSY is 1.2 km from Police Bazar — dorm beds from ₹369, 4.8★ from 320+ guests. Directions, distances and instant booking.",
      keywords:
        "hostel near me, hostel near me shillong, hostel near police bazar, closest hostel shillong",
    }),
  component: HostelNearMe,
});
