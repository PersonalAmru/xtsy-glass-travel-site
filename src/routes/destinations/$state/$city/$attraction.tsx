import { createFileRoute } from "@tanstack/react-router";
import DestinationDetail from "@/pages/destinations/DestinationDetail";

export const Route = createFileRoute("/destinations/$state/$city/$attraction")({
  component: DestinationDetail,
});
