

## Plan: Change "Netflix & Chill" Icon to TV Icon

The "Netflix & Chill" amenity currently uses the `Thermometer` icon (a thermometer SVG), which doesn't match the feature's meaning. It should use a television-related icon.

### Changes

**`src/data/rooms/xtsy270.ts`** (single file edit):
1. Add `Tv` (or `Monitor`) to the lucide-react import — lucide-react provides a `Tv` icon that looks like a television screen, visually consistent with the other flat-line icons used in the amenities grid.
2. Replace `Thermometer` with `Tv` in the `luxuryFeatures` array for the "Netflix & Chill" entry.
3. Remove `Thermometer` from the import if unused elsewhere.

No other files need changes — the icon is rendered dynamically from this data source.

