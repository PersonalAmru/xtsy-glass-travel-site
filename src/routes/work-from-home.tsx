import { createFileRoute } from "@tanstack/react-router";
import WorkFromHome from "@/pages/WorkFromHome";

export const Route = createFileRoute("/work-from-home")({
  component: WorkFromHome,
});
