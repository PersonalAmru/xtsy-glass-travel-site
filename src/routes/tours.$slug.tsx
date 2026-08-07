import { createFileRoute } from "@tanstack/react-router";
import TourDetail from "@/pages/TourDetail";

export const Route = createFileRoute("/tours/$slug")({
  component: TourDetail,
});
