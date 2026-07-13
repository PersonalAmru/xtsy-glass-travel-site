import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import {
  meghalayaDestinations,
  getDestinationsByCategory,
  getDestinationsByRegion,
} from "../../../data/meghalayaDestinations";

const CATEGORIES = [
  "waterfall",
  "cave",
  "village",
  "viewpoint",
  "lake",
  "adventure",
  "wildlife",
  "river",
  "peak",
  "cultural",
] as const;

export default defineTool({
  name: "list_destinations",
  title: "List Meghalaya destinations",
  description:
    "List Meghalaya (Northeast India) travel destinations XTSY covers — waterfalls, caves, living-root bridges, rivers, viewpoints and villages. Optionally filter by category or region.",
  inputSchema: {
    category: z.enum(CATEGORIES).optional().describe("Filter by destination category."),
    region: z.string().optional().describe("Filter by region, e.g. 'Cherrapunji & Sohra', 'Near Shillong'."),
    featuredOnly: z.boolean().optional().describe("Return only featured destinations."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ category, region, featuredOnly }) => {
    let list = category
      ? getDestinationsByCategory(category)
      : region
        ? getDestinationsByRegion(region as never)
        : meghalayaDestinations;
    if (featuredOnly) list = list.filter((d) => d.featured);

    const results = list.map((d) => ({
      name: d.name,
      slug: d.slug,
      category: d.category,
      region: d.region,
      shortDescription: d.shortDescription,
      featured: !!d.featured,
      url: `https://xtsy.one/destinations/${d.slug}`,
    }));

    const text =
      `${results.length} destination(s):\n` +
      results
        .map((d) => `- ${d.name} (${d.category}, ${d.region}) — ${d.shortDescription}`)
        .join("\n");

    return {
      content: [{ type: "text", text }],
      structuredContent: { destinations: results },
    };
  },
});
