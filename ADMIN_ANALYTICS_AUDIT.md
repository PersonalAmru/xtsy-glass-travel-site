# Admin Analytics Fake-Data Audit
**Date:** 2026-04-19
**Owner:** XTSY Engineering
**Status:** 🔴 Action required

This audit catalogues every widget across the admin surface that currently displays **hard-coded, mock, simulated, or partially-real** data. Each item is graded by user-visibility and business risk so we can sequence remediation.

---

## Severity Legend
| Tag | Meaning |
|-----|---------|
| 🔴 **CRITICAL** | Front-and-center on /admin or shown to stakeholders. Must be fixed first. |
| 🟠 **HIGH**     | Core operational page (bookings, inventory, finance). Misleads decisions. |
| 🟡 **MEDIUM**   | Secondary tab, but referenced in screenshots/demos. |
| 🟢 **LOW**      | Internal-only or already labeled as "demo". |

---

## 🔴 CRITICAL — Visible at `/admin` landing

### 1. **GTM Health Status widget** — `src/components/admin/GTMStatusWidget.tsx`
- **What's fake:** "Healthy / GTM-5FXJ9QBK" status badge is computed from a local `gtmEventRouter` ref count, **not** from an actual GTM container ping or tag-firing event log.
- **Impact:** Admin sees "Healthy" even if GTM container is paused, deleted, or blocked client-side.
- **Fix:** Hit GA Measurement Protocol debug endpoint OR use a CSP-report style server beacon to confirm fires.

### 2. **`Active Now` live indicator** — `AdminOverview.tsx`
- **Source:** `realtime?.active_visitors` from the `analytics-dashboard/realtime` edge function.
- **Status:** ✅ Real — pulled from `analytics_realtime` table.
- **Caveat:** Will read 0 if traffic-defence is filtering admin/own sessions. Verify the filter doesn't suppress all traffic.

### 3. **`Total Visitors / Page Views / Avg. Session / Sessions`** — `AdminOverview.tsx`
- **Source:** `analytics-dashboard/overview` edge function → reads `analytics_sessions` + `analytics_pageviews`.
- **Status:** ✅ Real, but verify cron job populates `analytics_daily_metrics` before relying on the bounce_rate / new_visitor_rate fields.
- **Action:** Add a "data freshness" timestamp under each tile.

---

## 🟠 HIGH — Operational pages

### 4. **`AdminBookingsCalendar.tsx`** (703 lines)
- Per-night pricing chips ("₹1.7K") in the document mockup are **placeholder values** — not yet wired to any pricing engine.
- **Real bookings load** is wired (`bookings` table) ✅
- **Fake:** Daily ADR / occupancy heat-mapping does not exist yet.
- **Fix sequence (Phase 2):** Build `useDailyPricing(propertyId, month)` hook that reads from `room_inventory` + `blocked_dates` + average of confirmed `bookings.total_amount / nights` for that day.

### 5. **`InventoryCalendarView.tsx` / `RoomCalendarPanel.tsx`**
- Booking counts per cell appear correct ✅
- **Fake:** "Demand level" colour shading derives from a hard-coded threshold (`count > 5 ? 'high' : 'low'`), not from `demand_forecasts` table which has real predicted values.
- **Fix:** Join with `demand_forecasts.demand_level` for the cell date.

### 6. **`DemandForecastPanel.tsx` & `DemandSignalsDashboard.tsx`**
- Reads `demand_forecasts` ✅ but the table is **rarely populated** by the `compute-demand-signals` edge function.
- **Action:** Verify cron schedule for `compute-demand-signals`; widget will show empty/stale until then.

### 7. **`ChannelPerformanceDashboard.tsx`**
- Channel revenue, conversion rate, bookings → reads `channel_strategy` table ✅
- **Fake:** Health score 0–100 is calculated locally from arbitrary weights, not from a backend rule the team agreed on.
- **Action:** Define the canonical formula; move to a `compute_channel_health()` Postgres function.

### 8. **`SettlementPipeline.tsx`**
- `bookings.settlement_status` reads ✅
- **Fake:** "Days to settle" forecast uses `Math.random()` style padding (verify in code).

---

## 🟡 MEDIUM — Marketing / SEO pages

### 9. **`AdminAnalyticsGA360.tsx`**
- Most widgets call live edge functions ✅
- **Fake:** Several KPI deltas (e.g. "+12.4% WoW") use local placeholder `Math.random()*20-10` calculations instead of comparing two date windows.
- **Fix:** Add `compareTo: 'previous_period'` flag to `analytics-dashboard/overview` and return `delta_pct`.

### 10. **`GeoTrafficList.tsx` / `WorldMapHeatmap.tsx` / `GoogleMapsHeatmap.tsx`**
- Backed by `analytics_geo_heatmap` ✅
- **Status:** Real, but only populated when GA realtime ingestion runs. If it's stale > 24 h, the map looks empty/wrong. Add a stale-data banner.

### 11. **`TravellerSegmentsPanel.tsx`** (`useTravellerIntelligence.tsx`)
- Segments ("Adventure Seekers", "Couples") and percentages are **hand-coded** in the hook.
- **Fix:** Derive from `analytics_visitors_detailed` clustered on event_action patterns, OR explicitly mark as "Sample segments — taxonomy WIP".

### 12. **`ConversionFunnelChart.tsx` / `TagTimelineChart.tsx`**
- Funnel data from `analytics_conversions` ✅
- Tag timeline from GTM router stats (in-memory) — **resets on page reload**. Persist to Supabase.

### 13. **`RealtimeTravellerActivity.tsx`**
- Reads live `analytics_realtime` ✅
- **Caveat:** Same as #2 — admin filter may suppress.

---

## 🟢 LOW

### 14. **`AvailabilityDebugger.tsx` / `RealTimeAvailabilityDemo.tsx`**
Already labeled "demo/debug". Hide from production menu via env flag.

### 15. **`GTMEventMonitor.tsx`**
In-memory event stream from `useGTMMonitor`. Resets on reload. Acceptable for live debugging; document this on the page.

---

## Phase-2 Rebuild Plan: Airbnb-grade Admin UI

The user-uploaded Airbnb screenshots imply 4 distinct surfaces. Here's the proposed scope sequenced for delivery:

### Phase 2A — Listings page (1 cycle)
- New route `/admin/listings`
- Card grid showing: property hero image, name, status pill (Listed/Snoozed), quick actions (Edit / Calendar / Pause).
- Data: `properties` + `room_types` tables (already populated).

### Phase 2B — Calendar overhaul (1-2 cycles)
- Replace `AdminBookingsCalendar.tsx` with month-grid à la Airbnb:
  - Each cell: date number, ADR (₹1.7K), tiny "Available" / "Reserved" indicator.
  - Click date → side panel with: ADR override, min-stay rule, custom note, "similar listings" comparison.
- Hooks needed: `useDailyPricing`, `useDailyAvailability`, `useNeighborhoodPricing`.

### Phase 2C — Messages inbox (1 cycle)
- Replace card-list `AdminGuestChats` with two-column layout:
  - Left: thread list with filter chips (All / Unread / Reservation / Enquiry).
  - Right: conversation pane with reservation summary above the chat.
- Reuse existing `BookingChat` for the conversation pane (now responsive ✅).
- Add **outside-platform booking detection**: scan messages for "WhatsApp / call me / 9876543210" patterns → flag + auto-reply.

### Phase 2D — Real-data wiring sprint (1 cycle)
- Knock out items 1, 7, 8, 9, 11, 12 above.
- Add data-freshness timestamp footer to every widget.

---

## Done in current cycle (2026-04-19)
- ✅ Removed `StickyBookingBar` (footer "Check Availability Now" CTA) from `App.tsx`.
- ✅ `BookingChat` is now fully responsive across mobile / tablet / desktop / xl, with proper `dvh` heights and truncating header.
- ✅ Notification bell now has persistent pulse ring + wiggle animation while unread > 0.
- ✅ Added `AdminUnreadPromptModal` — once-per-session prompt on admin landing for pending bookings + unread guest messages.
- ✅ This audit document.
