import { createFileRoute } from "@tanstack/react-router";
import MeghalayaTourPackages from "@/pages/destinations/MeghalayaTourPackages";
import { buildRouteHead } from "@/lib/seo-head";

export const Route = createFileRoute("/meghalaya-tour-packages")({
  head: () =>
    buildRouteHead({
      path: "/meghalaya-tour-packages",
      title: "Meghalaya Tour Packages 2026 — Starting ₹7,999 | XTSY",
      description:
        "Book curated Meghalaya tour packages starting ₹7,999. Shillong, Cherrapunji, Dawki and living root bridges. Stays, meals and transport included. Best price guaranteed.",
      keywords:
        "Meghalaya tour package, Meghalaya trip, Shillong tour, Cherrapunji tour, Dawki trip, Northeast India tour",
    }),
  component: MeghalayaTourPackages,
});
