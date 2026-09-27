/** Quoted pre-tax rates; decoration is charged once per stay. */
export const PANORAMA_STAY_ONLY = 5399;
export const PANORAMA_WITH_BREAKFAST = 5799;
export const PANORAMA_DECORATION = 2500;

export function panoramaQuote(nights: number, breakfast: boolean, decoration: boolean) {
  const nightly = breakfast ? PANORAMA_WITH_BREAKFAST : PANORAMA_STAY_ONLY;
  const accommodation = nightly * nights;
  const addOn = decoration ? PANORAMA_DECORATION : 0;
  const accommodationGst = Math.round(accommodation * 0.05);
  const decorationGst = Math.round(addOn * 0.18);
  return { nightly, accommodation, addOn, accommodationGst, decorationGst, subtotal: accommodation + addOn, gst: accommodationGst + decorationGst, total: accommodation + addOn + accommodationGst + decorationGst };
}