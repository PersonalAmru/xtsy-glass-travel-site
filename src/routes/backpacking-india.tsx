import { createFileRoute } from "@tanstack/react-router";
import BackpackingIndia from "@/pages/BackpackingIndia";

export const Route = createFileRoute("/backpacking-india")({
  component: BackpackingIndia,
});
