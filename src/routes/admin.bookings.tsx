import { createFileRoute } from "@tanstack/react-router";
import AdminBookingsCalendar from "@/pages/admin/AdminBookingsCalendar";

export const Route = createFileRoute("/admin/bookings")({
  component: AdminBookingsCalendar,
});
