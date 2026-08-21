import { createFileRoute } from "@tanstack/react-router";
import MeghalayaCoupleTourPackage from "@/pages/destinations/MeghalayaCoupleTourPackage";
import { buildRouteHead } from "@/lib/seo-head";

export const Route = createFileRoute("/meghalaya-couple-tour-package")({
  head: () =>
    buildRouteHead({
      path: "/meghalaya-couple-tour-package",
      title: "Meghalaya Couple Tour Package | XTSY Travel",
      description:
        "Romantic Meghalaya packages for couples: root bridges, Dawki boating, private cabs and a stay in the 270 degree glass suite, with transparent per-couple pricing.",
    }),
  component: MeghalayaCoupleTourPackage,
});
