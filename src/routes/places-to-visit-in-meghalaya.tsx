import { createFileRoute } from "@tanstack/react-router";
import PlacesToVisitMeghalaya from "@/pages/destinations/PlacesToVisitMeghalaya";

export const Route = createFileRoute("/places-to-visit-in-meghalaya")({
  component: PlacesToVisitMeghalaya,
});
