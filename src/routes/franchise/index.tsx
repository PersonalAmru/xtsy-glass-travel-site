import { createFileRoute } from "@tanstack/react-router";
import FranchiseDashboard from "@/pages/franchise/FranchiseDashboard";
import { buildRouteHead } from "@/lib/seo-head";

export const Route = createFileRoute("/franchise/")({
  head: () =>
    buildRouteHead({
      path: "/franchise",
      title: "XTSY Hostel Franchise Opportunities in Northeast India",
      description:
        "Partner with XTSY to run a hostel in Northeast India. See the franchise model, investment range, support provided and how to submit an enquiry.",
    }),
  component: FranchiseDashboard,
});
