import { createFileRoute } from "@tanstack/react-router";
import XTSYRentals from "@/pages/XTSYRentals";

export const Route = createFileRoute("/xtsy-rentals")({
  component: XTSYRentals,
});
