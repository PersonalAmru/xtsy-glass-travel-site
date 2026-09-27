import { createFileRoute } from "@tanstack/react-router";
import XTSYAdventureCampsiteDawki from "@/pages/v2/CampsiteV2";
import { buildRouteHead } from "@/lib/seo-head";

export const Route = createFileRoute("/xtsy-adventure-campsite-dawki")({
  head: () =>
    buildRouteHead({
      path: "/xtsy-adventure-campsite-dawki",
      title: "Dawki Campsite by the Umngot River | XTSY",
      description:
        "Camp beside the Umngot river at XTSY's Dawki adventure campsite: riverside tents, kayaking, bonfires and meals, with rates and how to reach from Shillong.",
    }),
  component: XTSYAdventureCampsiteDawki,
});
