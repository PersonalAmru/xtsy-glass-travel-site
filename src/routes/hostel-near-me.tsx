import { createFileRoute } from "@tanstack/react-router";
import HostelNearMe from "@/pages/HostelNearMe";

export const Route = createFileRoute("/hostel-near-me")({
  component: HostelNearMe,
});
