# Localized Adventure Search Implementation

## Goal
Make the strongest existing XTSY pages the clear owners of high-intent adventure searches, including city-based “near me” phrasing for Assam and Meghalaya, without creating thin duplicate pages.

## Evidence and targeting
Semrush India estimates about 90 monthly searches for “adventure activities in Meghalaya,” 40 for “adventure activities in Shillong,” and 20 for “Meghalaya adventure tour.” Exact “near me” variants for Shillong and Guwahati had no reported data, so they will be supported naturally on relevant city pages rather than expanded into doorway pages.

## Implementation
1. **Assign one page to each search intent**
   - `/meghalaya-tour-packages`: Meghalaya adventure tours and Northeast India adventure tours.
   - `/things-to-do-in-meghalaya`: adventure activities in Meghalaya and Shillong.
   - `/expeditions`: Northeast India motorbike and 4x4 expedition overview.
   - Existing motorbike and 4x4 route pages: route-specific expedition searches.
   - Assam and Meghalaya state/city pages: nearby adventure discovery for Guwahati, Kaziranga, Majuli, Jorhat, Shillong, Cherrapunji, Dawki, Mawlynnong, Jowai, Mawsynram, Nongstoin, and Tura.

2. **Improve visible page wording and metadata**
   - Add the target phrases naturally to headings, introductions, summaries, FAQs, and page metadata.
   - Add a useful “adventure activities near [city]” section to Assam and Meghalaya city pages using known destinations and existing route data.
   - Use natural variants such as “nearby adventures,” “around Shillong,” and “from Guwahati,” rather than repetitive keyword blocks.

3. **Strengthen discovery and internal linking**
   - Add adventure-tour, motorbike, 4x4, and city-nearby terms to the on-site search index.
   - Link city and state pages to the relevant activity, tour, campsite, and expedition pages.
   - Make `/expeditions` indexable only after replacing its unfinished placeholder copy with complete useful content.

4. **Preserve SEO quality**
   - Do not generate a separate “near me” page for every city.
   - Keep one canonical owner per intent and avoid overlap with existing tour, activity, destination, and expedition pages.
   - Retain visible, useful content only; no hidden keyword text.

## Validation
- Run the TypeScript check and SEO slug/link audits.
- Search the rendered metadata and visible copy for all requested phrases and city variants.
- Verify the tour, activity, expedition, Assam, Meghalaya, Shillong, and Guwahati pages on desktop and mobile.
- Confirm no broken links, duplicate keyword-owner pages, or indexing of incomplete city content.
