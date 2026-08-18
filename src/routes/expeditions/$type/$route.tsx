import { createFileRoute } from "@tanstack/react-router";
import ExpeditionRoutePage from "@/pages/expeditions/ExpeditionRoutePage";

export const Route = createFileRoute("/expeditions/$type/$route")({
  component: ExpeditionRoutePage,
});
