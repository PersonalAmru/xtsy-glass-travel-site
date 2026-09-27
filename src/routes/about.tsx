import { createFileRoute } from "@tanstack/react-router";
import AboutV2 from "@/pages/v2/AboutV2";
import { buildRouteHead } from "@/lib/seo-head";

export const Route = createFileRoute("/about")({
  head: () =>
    buildRouteHead({
      path: "/about",
      title: "About XTSY — India's Biggest Hostel in Northeast India",
      description:
        "XTSY Travellers Hostel, Shillong: Experience by XTSY, India's first stargaze glamp, NEITA 2025 nominated, 2.5 hrs from Guwahati airport. Read the story behind XTSY.",
      keywords: "XTSY about, biggest hostel northeast, Shillong hostel story, NEITA 2025",
    }),
  component: AboutV2,
});
