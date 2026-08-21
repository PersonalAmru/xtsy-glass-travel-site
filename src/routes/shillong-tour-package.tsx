import { createFileRoute } from "@tanstack/react-router";
import ShillongTourPackage from "@/pages/destinations/ShillongTourPackage";
import { buildRouteHead } from "@/lib/seo-head";

export const Route = createFileRoute("/shillong-tour-package")({
  head: () =>
    buildRouteHead({
      path: "/shillong-tour-package",
      title: "Shillong Tour Package with Stay & Cab | XTSY",
      description:
        "Shillong tour packages including hostel or private stay, cab, guide and key sightseeing, priced per person with no hidden extras. Book direct with XTSY.",
    }),
  component: ShillongTourPackage,
});
