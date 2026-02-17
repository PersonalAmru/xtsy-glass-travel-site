

# Google Hotel Ads XML Feed Infrastructure

## Overview

Two new Supabase Edge Functions that generate Google Hotel Center-compliant XML feeds, pulling live data from your booking database. A cron job refreshes a cached version every 15 minutes to keep feeds fast and fresh.

---

## Architecture

```text
+-------------------+       +---------------------------+
|  Google Hotel     | <---- | Edge Function:            |
|  Center Crawler   |       | google-hotel-feed         |
+-------------------+       | ?type=hotel-list          |
                            | ?type=price-availability  |
                            +---------------------------+
                                      |
                            +---------v---------+
                            | edge_function_cache|
                            | (DB-backed cache)  |
                            +---------+---------+
                                      |
                  +-------------------+-------------------+
                  |                   |                   |
          +-------v------+   +-------v------+   +--------v-------+
          | room_types   |   | room_inventory|   | blocked_dates  |
          | (rates, tax) |   | (availability)|   | (sold-out)     |
          +--------------+   +--------------+   +----------------+
```

---

## What Gets Built

### 1. Edge Function: `google-hotel-feed`

A single function serving two feed types via query parameter `?type=hotel-list` or `?type=price-availability`.

**Hotel List Feed** (`?type=hotel-list`)
- Lists your two properties (XTSY Travellers Hostel, XTSY Luxury)
- Includes property name, address, phone, category, and room type mappings
- Output: XML per Google's Hotel List Feed spec

**Price/Availability Feed** (`?type=price-availability`)
- Queries `room_types` for active rooms and base prices
- Queries `room_inventory` for next 90 days of availability
- Queries `blocked_dates` to mark sold-out dates
- Includes GST (12%) in pricing
- Includes occupancy, length-of-stay defaults
- Output: XML per Google's Hotel Prices (OTA_HotelRateAmountNotifRQ / Transaction format)

### 2. Cron Job: Feed Cache Refresh

- Runs every 15 minutes via `pg_cron` + `pg_net`
- Calls the edge function with a `?refresh=true` flag
- Stores generated XML in `edge_function_cache` table (already exists)
- Live requests serve from cache; cache miss triggers live generation

### 3. Config Updates

- `supabase/config.toml`: Add `[functions.google-hotel-feed]` with `verify_jwt = false` (Google crawler cannot authenticate)

---

## XML Output Samples

**Hotel List (simplified):**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<listings>
  <listing>
    <id>xtsy-travellers-hostel</id>
    <name>XTSY Travellers Hostel</name>
    <address format="simple">
      <component name="addr1">Manali, Himachal Pradesh</component>
      <component name="country">IN</component>
    </address>
    <category>hostel</category>
  </listing>
  <listing>
    <id>xtsy-luxury</id>
    <name>XTSY Luxury</name>
    ...
  </listing>
</listings>
```

**Price/Availability (simplified):**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<Transaction timestamp="2026-02-17T10:00:00Z" id="txn_...">
  <Result>
    <Property>xtsy-travellers-hostel</Property>
    <Checkin>2026-02-18</Checkin>
    <Nights>1</Nights>
    <RoomID>king-double-room</RoomID>
    <Baserate currency="INR">2016.00</Baserate>
    <Tax currency="INR">216.00</Tax>
    <OtherFees currency="INR">0</OtherFees>
    <AllowablePointsOfSale>
      <PointOfSale id="xtsy_direct"/>
    </AllowablePointsOfSale>
  </Result>
</Transaction>
```

---

## Technical Details

### Edge Function File
- **Path:** `supabase/functions/google-hotel-feed/index.ts`
- Uses `createOptimizedClient({ useServiceRole: true })` for DB access
- Rate-limited (existing `checkRateLimit` shared util)
- Cache key: `google_hotel_list_xml` and `google_price_feed_xml`
- Cache TTL: 900 seconds (15 min), matching cron interval
- Content-Type: `application/xml`

### Property-to-Room Mapping (hardcoded, matching your DB)
```text
xtsy-travellers-hostel:
  - king-double-room
  - 4-bed-mixed-female-dorm
  - 4-bed-female-only-dorm
  - 6-bed-mixed-dorm
  - 6-bed-mixed-female-dorm
  - 8-bed-mixed-dorm

xtsy-luxury:
  - xtsy-270
```

### Price Calculation
- `base_price` from `room_types` table (already GST-inclusive per your memory)
- Baserate = base_price (inclusive)
- Tax = base_price * 12/112 (extract GST component for Google's separate tax field)
- Availability: `room_inventory.available_count`, defaulting to `total_units` when no inventory row exists; 0 when date is in `blocked_dates`

### Cron SQL (to be inserted via Supabase SQL editor)
```sql
SELECT cron.schedule(
  'refresh-google-hotel-feed',
  '*/15 * * * *',
  $$
  SELECT net.http_post(
    url:='https://oidnydyyjyjfnyadhyzn.supabase.co/functions/v1/google-hotel-feed?type=price-availability&refresh=true',
    headers:='{"Content-Type":"application/json","Authorization":"Bearer <ANON_KEY>"}'::jsonb,
    body:='{}'::jsonb
  );
  SELECT net.http_post(
    url:='https://oidnydyyjyjfnyadhyzn.supabase.co/functions/v1/google-hotel-feed?type=hotel-list&refresh=true',
    headers:='{"Content-Type":"application/json","Authorization":"Bearer <ANON_KEY>"}'::jsonb,
    body:='{}'::jsonb
  );
  $$
);
```

### Config Addition
```toml
[functions.google-hotel-feed]
verify_jwt = false
```

---

## Files Changed

| File | Action |
|------|--------|
| `supabase/functions/google-hotel-feed/index.ts` | Create |
| `supabase/config.toml` | Edit - add function entry |

No frontend changes. No new dependencies. Uses existing shared utilities and cache table.

