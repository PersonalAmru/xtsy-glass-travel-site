import { createFileRoute } from "@tanstack/react-router";
import CateringV2 from "@/pages/v2/CateringV2";
import { buildRouteHead } from "@/lib/seo-head";

export const Route = createFileRoute("/catering-shillong")({
  head: () =>
    buildRouteHead({
      path: "/catering-shillong",
      title: "Catering in Shillong for Events & Groups | TAB Bistro",
      description:
        "TAB Bistro by XTSY handles catering in Shillong for weddings, corporate events, retreats and group stays, with set menus, live counters and per-plate pricing.",
    }),
  component: CateringShillong,
});

function CateringShillong() {
  return <CateringV2 canonical="https://xtsy.one/catering-shillong" />;
}
