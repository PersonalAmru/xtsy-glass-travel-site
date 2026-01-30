
# Room Inventory Update Plan

## Summary
This plan updates pricing for XTSY Travellers Hostel rooms, removes the "XTSY Economy" category entirely (consolidating the 8-Bed Mixed Dorm into the Hostel category), and removes the King Triple Room.

---

## Price Changes

| Room Type | Current Price | New Price |
|-----------|---------------|-----------|
| 4-Bed Female Dorm | 550 | **400** |
| 4-Bed Mixed Dorm | 500 | **500** (no change) |
| 6-Bed Female Dorm | 450 | **350** |
| 6-Bed Mixed Dorm | 425 | **400** |
| King Double Room | 1800 | **1800** (no change) |
| 8-Bed Mixed Dorm | 350 | **300** (moved from Economy) |

---

## Structural Changes

1. **Remove "XTSY Economy" category completely**
   - Delete the entire economy category (`'economy'` type)
   - Remove `6-bed-mixed-economy-dorm` and `8-bed-mixed-economy-dorm` entries
   - Keep only `8-bed-mixed-dorm` under XTSY Travellers Hostel

2. **Remove King Triple Room**
   - Delete `king-triple-room` from all inventory files
   - Remove from properties.ts roomTypeIds

3. **Consolidate 8-Bed Mixed Dorm**
   - Single entry `8-bed-mixed-dorm` under XTSY Travellers Hostel at 300 INR

---

## Files to Modify

### 1. `src/config/roomTypes.ts`
**Changes:**
- Update `RoomCategory` type to only include `'luxury' | 'hostel'`
- Update prices for hostel rooms
- Remove economy room entries (`6-bed-mixed-economy-dorm`, `8-bed-mixed-economy-dorm`)
- Update `8-bed-mixed-dorm` price to 300
- Remove economy image entries from `ROOM_IMAGES`
- Update `ROOM_NAME_TO_ID` legacy mappings
- Update `PROPERTY_LABELS` to remove economy

### 2. `src/data/roomInventory.ts`
**Changes:**
- Update `RoomCategory` type to remove `'economy'`
- Update prices for all hostel rooms
- Remove economy room entries
- Update `8-bed-mixed-dorm` to 300 INR
- Remove economy from `CATEGORY_LABELS`

### 3. `src/data/properties.ts`
**Changes:**
- Remove `king-triple-room` from `xtsy-travellers-hostel` roomTypeIds
- Add `8-bed-mixed-dorm` to roomTypeIds if not already present
- Update `priceRange` to reflect new pricing (min: 300, max: 1800)

### 4. `src/components/RoomsSection.tsx`
**Changes:**
- Update hostelRooms array with new prices
- Remove king-triple-room entry
- Add 8-Bed Mixed Dorm at 300 INR
- Reorder rooms: King Double first, then dorms by size/price
- **Remove entire economyRooms array**
- **Remove XTSY Economy PropertySection rendering**

### 5. `src/utils/roomIdentifiers.ts`
**Changes:**
- Remove economy-related aliases
- Remove king-triple-room aliases
- Update 8-bed dorm to map to `8-bed-mixed-dorm` (not economy)

### 6. `src/components/FastRoomCard.tsx`
**Changes:**
- Remove economy dorm case handling
- Remove king-triple-room references

### 7. `src/components/RoomCard.tsx`
**Changes:**
- Remove economy propertyType handling
- Remove king-triple-room references

### 8. UI/Copy Files (minor updates)
- `src/components/AboutSection.tsx`: Update copy to remove "Economy Dorms" reference
- `src/components/SEOContent.tsx`: Update SEO copy to remove economy mentions
- `src/components/WhatsAppBookingForm.tsx`: Remove economy category filter (already filtering it out)
- `src/components/reviews/PremiumReviewCard.tsx`: Remove economy color mapping

---

## Database Update Required

A database update is needed to sync the `room_types` table:

```text
UPDATE room_types SET base_price = 400 WHERE id = '4-bed-female-only-dorm';
UPDATE room_types SET base_price = 500 WHERE id = '4-bed-mixed-female-dorm';
UPDATE room_types SET base_price = 350 WHERE id = '6-bed-mixed-female-dorm';
UPDATE room_types SET base_price = 400 WHERE id = '6-bed-mixed-dorm';
UPDATE room_types SET base_price = 1800 WHERE id = 'king-double-room';
UPDATE room_types SET base_price = 300, category = 'Hostel', kind = 'hostel' WHERE id = '8-bed-mixed-dorm';
DELETE FROM room_types WHERE id IN ('6-bed-mixed-economy-dorm', '8-bed-mixed-economy-dorm', 'king-triple-room');
```

---

## Final Room Inventory for XTSY Travellers Hostel

| Order | Room Type | Price | Tags |
|-------|-----------|-------|------|
| 1 | King Double Room | 1800/night | Couple Favourite |
| 2 | 4-Bed Female Dorm | 400/bed | Solo Traveller |
| 3 | 4-Bed Mixed Dorm | 500/bed | Solo Traveller |
| 4 | 6-Bed Female Dorm | 350/bed | Groups, Families |
| 5 | 6-Bed Mixed Dorm | 400/bed | Groups, Families |
| 6 | 8-Bed Mixed Dorm | 300/bed | Groups, Families, Best Value |

---

## Technical Notes

- The `RoomCategory` type will change from `'luxury' | 'hostel' | 'economy'` to `'luxury' | 'hostel'`
- All helper functions that filter by category will automatically work correctly after removing economy entries
- Property-level isolation remains intact (Luxury has only xtsy-270, Hostel has all dorm/private rooms)
- Admin console inventory controls remain functional for the hostel property
