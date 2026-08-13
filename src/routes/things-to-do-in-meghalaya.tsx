import { createFileRoute } from "@tanstack/react-router";
import ThingsToDoInMeghalaya from "@/pages/destinations/ThingsToDoInMeghalaya";

export const Route = createFileRoute("/things-to-do-in-meghalaya")({
  component: ThingsToDoInMeghalaya,
});
