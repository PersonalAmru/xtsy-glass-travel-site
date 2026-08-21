import { createFileRoute } from "@tanstack/react-router";
import XTSYRentals from "@/pages/XTSYRentals";
import { buildRouteHead } from "@/lib/seo-head";

export const Route = createFileRoute("/xtsy-rentals")({
  head: () =>
    buildRouteHead({
      path: "/xtsy-rentals",
      title: "Bike & Gear Rentals in Shillong | XTSY",
      description:
        "Rent bikes, scooters, helmets and trekking gear in Shillong from XTSY, with daily rates, deposit terms, documents required and Meghalaya route suggestions.",
    }),
  component: XTSYRentals,
});
