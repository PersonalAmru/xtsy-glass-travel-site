import { createFileRoute } from "@tanstack/react-router";
import CampsiteBookingFlow from "@/pages/CampsiteBookingFlow";

export const Route = createFileRoute("/book/campsite")({
  component: CampsiteBookingFlow,
});
