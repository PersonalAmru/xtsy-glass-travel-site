import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { getDestinationBySlug } from "../../../data/meghalayaDestinations";

export default defineTool({
  name: "get_destination",
  title: "Get a Meghalaya destination",
  description:
    "Get full details for a single Meghalaya destination by its slug (e.g. 'dawki-umngot-river', 'nohkalikai-falls'): overview, best time to visit, how to reach, things to do, travel tips and nearby attractions.",
  inputSchema: {
    slug: z.string().min(1).describe("Destination slug, e.g. 'living-root-bridge' or 'umiam-lake'."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ slug }) => {
    const d = getDestinationBySlug(slug.trim());
    if (!d) {
      return {
        content: [{ type: "text", text: `No destination found for slug "${slug}".` }],
        isError: true,
      };
    }
    const detail = {
      name: d.name,
      slug: d.slug,
      category: d.category,
      region: d.region,
      description: d.description,
      bestTimeToVisit: d.bestTimeToVisit,
      howToReach: d.howToReach,
      thingsToDo: d.thingsToDo,
      travelTips: d.travelTips,
      nearbyAttractions: d.nearbyAttractions,
      url: `https://xtsy.one/destinations/${d.slug}`,
    };
    const text =
      `${d.name} (${d.category}, ${d.region})\n\n${d.description}\n\n` +
      `Best time: ${d.bestTimeToVisit}\n` +
      `How to reach: ${d.howToReach}\n\n` +
      `Things to do:\n${d.thingsToDo.map((t) => `- ${t}`).join("\n")}\n\n` +
      `Travel tips:\n${d.travelTips.map((t) => `- ${t}`).join("\n")}\n\n` +
      `Plan your stay in Shillong: https://xtsy.one/book`;
    return {
      content: [{ type: "text", text }],
      structuredContent: detail,
    };
  },
});
