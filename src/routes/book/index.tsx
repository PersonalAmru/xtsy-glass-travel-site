import { createFileRoute } from "@tanstack/react-router";
import SimplifiedBookingFlow from "@/pages/SimplifiedBookingFlow";

export const Route = createFileRoute("/book")({
  component: SimplifiedBookingFlow,
});
