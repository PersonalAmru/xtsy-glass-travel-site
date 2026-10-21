- [x] Verify stale duplicate metadata: homepage, About and 3-day itinerary have one title, description and self-canonical in server HTML and browser DOM; finding recorded as fixed.
- [x] Expand the existing 10-day Meghalaya itinerary with overnight logistics, trek preparation and weather alternatives; preview verified, SEO finding recorded as fixed awaiting rescan and publishing. Redirect tests: 52 passed; legacy SEO regression suite cannot load because it references removed index.html and obsolete rates.
- [x] Update existing /faq and add /safety-house-rules using current rates, published quiet hours and strict property times; verified rendering, FAQs and self-canonicals.
- [x] Harden dorm catalogue matching; verify real pending enquiries and WhatsApp messages for all three dorms at ₹399/₹499/₹599, with server GST checks preserved.
- [x] Verify India search volumes; broad terms have demand, exact priority question volumes remain unknown (research recorded).
- [x] Update ownership footer including Travel by XTSY and budget wording, preserving URLs, verbatim reviews and hidden search keywords.
- [x] Finish four adventure guides with itinerary, safety, logistics and visible FAQs; verify page rendering and single self-canonicals.
- [x] Submit live adventure sitemap to Google and verify recorded submission; processing pending, inspected Northeast guide discovered but not indexed.
- [x] Check budget-page canonicals and legacy redirects: one self-canonical per hub, duplicate aliases redirect 301.
- [x] Check analytics scripts and rejection flow: both GTM scripts return 200, GA4 script returns 404; rejecting non-essential still grants analytics and creates Google cookies.
- [ ] Publish expanded adventure content and corrected absolute cover-image metadata (awaiting publishing).
- [x] Fix optional analytics consent: six tests pass; fresh visits and returning rejection create no cookies, tracking requests or identifiers; analytics-only acceptance starts existing tags. Publish pending; GA4 property configuration remains separate.
- [ ] Fix remaining uploaded-checklist P0 priorities: duplicate budget-hostel canonicals and GA4 loading error, preserving consent and validation.
- [ ] Verify fixes and record external blockers for tour photos and manual Google re-indexing.
- [ ] Align existing adventure tour, activity, expedition, and local city pages with approved search terms.
- [ ] Improve on-site search discovery and relevant internal links without creating doorway pages.
- [ ] Keep sitemap coverage accurate and validate metadata, links, desktop/mobile views, and type safety.
- [x] Use the existing TAB Bistro cover consistently wherever Bistro is featured.
- [x] Carry the current homepage palette and typography across guest-facing pages without changing admin tools or booking logic.
- [x] Verify representative public pages on desktop and mobile.
- [ ] Panorama package and decoration pricing match summary, tax, WhatsApp and saved enquiry.
- [ ] Persist guest WhatsApp, room and campsite enquiries with dates, guests and totals; verify with real rooms.
- [x] Add distinct detailed Northeast adventure landing pages and submit their live sitemap to Google; direct indexing requests require Search Console UI.
- [x] Refresh homepage in selected photographic editorial direction without changing room rates.
- [ ] Normalize New Shillong Township address and strict 11 AM / 10 AM property times in SEO and AEO.
- [ ] Flat nightly price for unspecified room: waiting on room name and amount from owner.
- [x] Improve /best-hostel-in-shillong search title, description and contextual FAQ, safety and arrival links; verified single self-canonical, working destinations, unchanged displayed rates/policies and desktop/mobile rendering. Eight booking quote tests pass; publish needed for the live URL.
- [x] Investigate the two open live error findings: published room list and realtime writes now work; marked historical findings stale. Restore missing backend-only cache/rate-limit grants; verify exchange-rate cache hits. Review measured weekly traffic without identifying anonymous visitors or treating visits as conversions.

## Done 2026-10-17
- [x] Restored step-by-step booking funnel tracking (booking_step_view per step; re-enabled self-tracking; granted traffic_* table access incl. trigger owner sandbox_exec)
- [x] Added "Book / Enquire" button on /xtsy-270 leading to /book?property=xtsy-experience

## Done 2026-10-19
- [x] Move affected admin/booking functions and trigger dependencies off the restricted owner; no remaining restricted SECURITY DEFINER routines directly call auth. Preserve validation, bind admin actors, restrict OTP execution to backend. Thirteen tests pass; authenticated role check and forged-actor denial verified; real table enquiry XTH-ENQ-002 saved and shown in the UI. Full admin approval/settlement mutations were not executed on live guest bookings.
- [x] Added a clear "Book a table" action on /tab-bistro (hero primary + phone sticky bar) opening an on-page table request form: date, time, guests, name, WhatsApp, email, notes. Request is saved as a pending enquiry (XTH-ENQ ref, time and page source kept) and WhatsApp opens with the same details; a request is not a confirmed table. Verified end to end in the preview.
- [x] Repaired create_enquiry and role helpers owned by the restricted migration role; completed the remaining affected booking/admin handover above.
- [ ] QA table enquiry XTH-ENQ-001 ("QA Table Test", qa.table@example.com) is still pending in the enquiries list — delete when convenient.
- [ ] QA table enquiry XTH-ENQ-002 ("QA Ownership Repair") remains pending; cleanup awaits owner authorization.
- [x] Add lunch preorder-only requests to the TAB Bistro table form, preserving existing hours and saving before WhatsApp confirmation; three tests passed and real request XTH-ENQ-004 saved with matching lunch time, order and reference in the captured WhatsApp redirect. Preview build clean; publish pending.
- [ ] QA lunch requests XTH-ENQ-003 and XTH-ENQ-004 ("QA Lunch Preorder", explicitly marked test-only) remain pending; cleanup awaits owner authorization.

## Current request 2026-10-21
- [x] Improve existing Umiam Lake title, description and 10 contextual planning links; verified single self-canonical, unchanged activity/cab rates and working destinations. Publish pending.
- [x] Improve existing TAB Bistro introduction, meal-planning content and links for restaurants in Shillong; hours/menu unchanged, table-form action verified. 63 booking/redirect tests pass; preview has no page errors. Publish pending.
