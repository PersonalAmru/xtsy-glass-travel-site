import { createFileRoute } from "@tanstack/react-router";
import DestinationDetail from "@/pages/destinations/DestinationDetail";

export const Route = createFileRoute("/places-to-visit/$slug")({
  component: DestinationDetail,
});
