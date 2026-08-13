import { createFileRoute } from "@tanstack/react-router";
import HostelBookingShillong from "@/pages/HostelBookingShillong";

export const Route = createFileRoute("/hostel-booking")({
  component: HostelBookingShillong,
});
