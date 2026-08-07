import { createFileRoute } from "@tanstack/react-router";
import HotelsInShillong from "@/pages/HotelsInShillong";

export const Route = createFileRoute("/hotels-in-shillong")({
  component: HotelsInShillong,
});
