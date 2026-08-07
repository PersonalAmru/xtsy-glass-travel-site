import { createFileRoute } from "@tanstack/react-router";
import PropertySelector from "@/pages/PropertySelector";

export const Route = createFileRoute("/book/select")({
  component: PropertySelector,
});
