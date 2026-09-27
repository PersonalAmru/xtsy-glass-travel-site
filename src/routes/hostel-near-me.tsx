import { createFileRoute } from "@tanstack/react-router";
import HostelNearMe from "@/pages/HostelNearMe";
import { buildRouteHead } from "@/lib/seo-head";

export const Route = createFileRoute("/hostel-near-me")({
  head: () =>
    buildRouteHead({
      path: "/hostel-near-me",
      title: "Hostel Near Me in Shillong — XTSY, New Shillong Township",
      description:
        "Looking for a hostel near you in Shillong? XTSY is on Mawdiangdiang Road, New Shillong Township, near NIFT and IIM Shillong — dorm beds from ₹369, 4.8★ from 161 verified guests.",
      keywords:
        "hostel near me, hostel near me shillong, hostel near police bazar, closest hostel shillong",
    }),
  component: HostelNearMe,
});
