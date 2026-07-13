import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { MCP_ROOMS, BOOKING_URL } from "../data/rooms";

export default defineTool({
  name: "list_rooms",
  title: "List rooms & dorm beds",
  description:
    "List bookable rooms and dorm beds at XTSY Travellers Hostel and Experience by XTSY in Shillong, with starting prices in INR. Optionally filter by category.",
  inputSchema: {
    category: z
      .enum(["luxury", "hostel"])
      .optional()
      .describe("Filter by 'luxury' (Experience by XTSY) or 'hostel' (dorms & private rooms)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ category }) => {
    const rooms = MCP_ROOMS.filter((r) => (category ? r.category === category : true));
    const lines = rooms.map(
      (r) =>
        `- ${r.name} (${r.property}) — from ₹${r.fromPriceInr.toLocaleString("en-IN")} ${r.perUnit}` +
        `, sleeps ${r.capacity}${r.bookable ? "" : " — currently unavailable"}`,
    );
    const text =
      `Rooms & dorm beds${category ? ` (${category})` : ""}:\n${lines.join("\n")}\n\n` +
      `Book online: ${BOOKING_URL}`;
    return {
      content: [{ type: "text", text }],
      structuredContent: { rooms, bookingUrl: BOOKING_URL },
    };
  },
});
