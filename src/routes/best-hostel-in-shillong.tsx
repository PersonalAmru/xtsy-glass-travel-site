import { createFileRoute } from "@tanstack/react-router";
import BestHostelShillong from "@/pages/BestHostelShillong";
import { buildRouteHead } from "@/lib/seo-head";

export const Route = createFileRoute("/best-hostel-in-shillong")({
  head: () =>
    buildRouteHead({
      path: "/best-hostel-in-shillong",
      title: "Hostels in Shillong — Cheap Dorm Beds from ₹369 | XTSY",
      description:
        "Looking for cheap hostels in Shillong? XTSY has backpacker dorm beds from ₹369, female-only dorms, private rooms and a 270° glass suite. Central, safe, 4.8★. Book direct.",
      keywords:
        "hostels in shillong, cheap hostels shillong, backpacker hostel shillong, dorm beds shillong, female dorm shillong",
    }),
  component: BestHostelShillong,
});
