import { createFileRoute } from "@tanstack/react-router";
import XTSYvsZostel from "@/pages/v2/ZostelV2";
import { buildRouteHead } from "@/lib/seo-head";

export const Route = createFileRoute("/xtsy-vs-zostel")({
  head: () =>
    buildRouteHead({
      path: "/xtsy-vs-zostel",
      title: "XTSY vs Zostel Shillong: Honest Comparison",
      description:
        "A side-by-side look at XTSY and Zostel in Shillong on dorm price, room types, location, food and facilities, so you can pick the right hostel.",
    }),
  component: XTSYvsZostel,
});
