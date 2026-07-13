import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { SIGNATURE_PACKAGES } from "../../../data/signaturePackages";

const REGIONS = ["Meghalaya", "Arunachal Pradesh", "Assam & Meghalaya"] as const;

export default defineTool({
  name: "list_tour_packages",
  title: "List tour packages",
  description:
    "List XTSY signature tour packages across Meghalaya and Northeast India, with per-person prices in INR, duration and highlights. Optionally filter by region.",
  inputSchema: {
    region: z.enum(REGIONS).optional().describe("Filter packages by region."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ region }) => {
    const list = SIGNATURE_PACKAGES.filter((p) => (region ? p.region === region : true));
    const packages = list.map((p) => ({
      title: p.title,
      slug: p.slug,
      region: p.region,
      duration: p.duration,
      pricePerPersonInr: p.pricePerPerson,
      minGroup: p.minGroup ?? null,
      shortDescription: p.shortDescription,
      highlights: p.highlights,
      url: `https://xtsy.one/tours/${p.slug}`,
    }));
    const text =
      `${packages.length} tour package(s):\n` +
      packages
        .map(
          (p) =>
            `- ${p.title} (${p.region}, ${p.duration}) — ₹${p.pricePerPersonInr.toLocaleString(
              "en-IN",
            )}/person`,
        )
        .join("\n");
    return {
      content: [{ type: "text", text }],
      structuredContent: { packages },
    };
  },
});
