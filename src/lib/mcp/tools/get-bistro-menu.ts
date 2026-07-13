import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { menuSections } from "../../../data/tabBistroMenu";

export default defineTool({
  name: "get_bistro_menu",
  title: "Get TAB Bistro menu",
  description:
    "Get the TAB Bistro by XTSY menu (Shillong) — beverages, food, fusion dishes and more, with INR prices. Optionally filter to one menu section.",
  inputSchema: {
    section: z
      .string()
      .optional()
      .describe("Optional section id or label to filter, e.g. 'beverages'."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ section }) => {
    const q = section?.trim().toLowerCase();
    const sections = q
      ? menuSections.filter(
          (s) => s.id.toLowerCase() === q || s.label.toLowerCase() === q,
        )
      : menuSections;

    if (q && sections.length === 0) {
      return {
        content: [{ type: "text", text: `No menu section matches "${section}".` }],
        isError: true,
      };
    }

    const text = sections
      .map((s) => {
        const cats = s.categories
          .map(
            (c) =>
              `  ${c.title}:\n` +
              c.items.map((it) => `    - ${it.name} — ${it.price}`).join("\n"),
          )
          .join("\n");
        return `${s.label}\n${cats}`;
      })
      .join("\n\n");

    return {
      content: [{ type: "text", text: `TAB Bistro by XTSY menu:\n\n${text}` }],
      structuredContent: { sections },
    };
  },
});
