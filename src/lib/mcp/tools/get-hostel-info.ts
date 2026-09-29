import { defineTool } from "@lovable.dev/mcp-js";

const HOSTEL_INFO = {
  brand: "XTSY",
  poweredBy: "Powered by XTSY Ventures Private Limited",
  location: "Shillong, Meghalaya, Northeast India",
  whatsapp: "+91 88373 17070",
  bookingUrl: "https://xtsy.one/book",
  properties: [
    {
      name: "XTSY Travellers Hostel",
      tagline: "Northeast India's Best Budget Accommodation",
      about:
        "India's biggest backpacker hostel in Northeast India — NEITA 2025 nominee, female-safe, 24/7 check-in.",
    },
    {
      name: "Experience by XTSY (XTSY 270°)",
      tagline: "India's First 270° Stargaze Glamping Ensuite",
      about:
        "A first-of-its-kind panoramic glass suite designed for stargazing, anniversaries and slow luxury — built and operated in Shillong.",
    },
  ],
  awards: [
    "Nominated: Best Budget-Friendly Accommodation, Northeast India Tourism Awards (NEITA 2025)",
    "Highest-rated hostel in Northeast India on Google (4.8★, 161 Google reviews)",
    "India's first 270° stargaze glamping ensuite (Experience by XTSY)",
  ],
};

export default defineTool({
  name: "get_hostel_info",
  title: "Get XTSY hostel & brand info",
  description:
    "Get an overview of XTSY's Shillong properties (XTSY Travellers Hostel and Experience by XTSY), awards, contact WhatsApp and the online booking link.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const text =
      `${HOSTEL_INFO.brand} — ${HOSTEL_INFO.location}\n${HOSTEL_INFO.poweredBy}\n\n` +
      HOSTEL_INFO.properties
        .map((p) => `${p.name} — ${p.tagline}\n${p.about}`)
        .join("\n\n") +
      `\n\nAwards:\n${HOSTEL_INFO.awards.map((a) => `- ${a}`).join("\n")}\n\n` +
      `WhatsApp: ${HOSTEL_INFO.whatsapp}\nBook online: ${HOSTEL_INFO.bookingUrl}`;
    return {
      content: [{ type: "text", text }],
      structuredContent: HOSTEL_INFO,
    };
  },
});
