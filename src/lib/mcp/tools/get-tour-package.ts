import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import {
  getSignaturePackageBySlug,
  getPackageItinerary,
} from "../../../data/signaturePackages";

export default defineTool({
  name: "get_tour_package",
  title: "Get a tour package",
  description:
    "Get full details and the day-by-day itinerary for a single XTSY tour package by its slug.",
  inputSchema: {
    slug: z.string().min(1).describe("Tour package slug, e.g. 'meghalaya-explorer'."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ slug }) => {
    const p = getSignaturePackageBySlug(slug.trim());
    if (!p) {
      return {
        content: [{ type: "text", text: `No tour package found for slug "${slug}".` }],
        isError: true,
      };
    }
    const itinerary = getPackageItinerary(p.slug) ?? [];
    const detail = {
      title: p.title,
      slug: p.slug,
      region: p.region,
      duration: p.duration,
      pricePerPersonInr: p.pricePerPerson,
      minGroup: p.minGroup ?? null,
      pickupDrop: p.pickupDrop,
      idealFor: p.idealFor,
      highlights: p.highlights,
      shortDescription: p.shortDescription,
      itinerary,
      url: `https://xtsy.one/tours/${p.slug}`,
    };
    const itineraryText = itinerary.length
      ? "\n\nItinerary:\n" +
        itinerary
          .map((d: { day?: number; title?: string; description?: string }, i: number) =>
            `Day ${d.day ?? i + 1}: ${d.title ?? ""}${d.description ? ` — ${d.description}` : ""}`,
          )
          .join("\n")
      : "";
    const text =
      `${p.title} (${p.region}, ${p.duration})\n₹${p.pricePerPerson.toLocaleString(
        "en-IN",
      )}/person\n\n${p.shortDescription}\n\n` +
      `Highlights:\n${p.highlights.map((h) => `- ${h}`).join("\n")}` +
      itineraryText +
      `\n\nEnquire: https://xtsy.one/tours/${p.slug}`;
    return {
      content: [{ type: "text", text }],
      structuredContent: detail,
    };
  },
});
