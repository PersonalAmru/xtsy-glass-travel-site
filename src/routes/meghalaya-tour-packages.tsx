import { createFileRoute } from "@tanstack/react-router";
import MeghalayaTourPackages from "@/pages/destinations/MeghalayaTourPackages";
import { buildRouteHead } from "@/lib/seo-head";

export const Route = createFileRoute("/meghalaya-tour-packages")({
  head: () =>
    buildRouteHead({
      path: "/meghalaya-tour-packages",
      title: "Meghalaya Tour Packages 2026 — Starting ₹7,999 | XTSY",
      description:
        "Meghalaya tour packages from ₹7,999: Shillong, Cherrapunji, Dawki and the living root bridges, with stays, meals and transport included. Book direct.",
      keywords:
        "Meghalaya tour package, Meghalaya adventure tour, adventure tours in Northeast India, Shillong tour, Cherrapunji tour, Dawki trip",
    }),
  component: MeghalayaTourPackages,
});
