import { createFileRoute } from "@tanstack/react-router";
import HostelNearMe from "@/pages/HostelNearMe";
import { buildRouteHead } from "@/lib/seo-head";

export const Route = createFileRoute("/hostel-near-me")({
  head: () =>
    buildRouteHead({
      path: "/hostel-near-me",
      title: "Hostel Near Me in Shillong — XTSY, New Shillong Township",
      description:
        "Hostel near you in Shillong? XTSY is on Mawdiangdiang Road, New Shillong Township, near NIFT and IIM: dorms from ₹389, 4.8★ from 161 Google reviews.",
      keywords:
        "hostel near me, hostel near me shillong, hostel near police bazar, closest hostel shillong",
    }),
  component: HostelNearMe,
});
