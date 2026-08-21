import { createFileRoute } from "@tanstack/react-router";
import BackpackingIndia from "@/pages/BackpackingIndia";
import { buildRouteHead } from "@/lib/seo-head";

export const Route = createFileRoute("/backpacking-india")({
  head: () =>
    buildRouteHead({
      path: "/backpacking-india",
      title: "Backpacking India: Routes, Budget & Hostels | XTSY",
      description:
        "Backpacking India guide with regional routes, daily budgets, transport tips and hostel picks, plus how to add Meghalaya and Northeast India to your trip.",
    }),
  component: BackpackingIndia,
});
