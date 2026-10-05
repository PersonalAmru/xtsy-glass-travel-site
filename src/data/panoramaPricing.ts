/**
 * Experience by XTSY and the shared booking quote.
 *
 * Room rates are ALL INCLUSIVE (GST included) from Oct 2026: the price a guest sees is the price
 * they pay for the room. The GST inside it is shown for the invoice only. The breakfast plan for
 * Experience by XTSY was withdrawn; the decoration add-on stays at ₹2,500 + 18% GST, once per stay.
 *
 * quoteStay() mirrors the database function public.create_whatsapp_enquiry exactly (same
 * rounding), so the subtotal / taxes / total the site sends always match the server's check.
 */
export const PANORAMA_STAY_ONLY = 5999;

/**
 * Same rule as the database function public.current_room_rate: the room price table cannot be
 * edited right now, so the two rooms whose prices changed on 5 Oct 2026 are mapped here — only
 * while the table still holds the old value. Once room_types is updated, this passes it through.
 */
const RATE_FIXES: Record<string, { from: number; to: number }> = {
  '3746fd14-8fa7-4b27-b285-38855b447964': { from: 2200, to: 2399 }, // King Double Room
  '3b10c81d-ad5f-441f-9b56-5ab9a7a00544': { from: 5399, to: 5999 }, // Experience by XTSY
};
export function currentRoomRate(roomId: string, basePrice: number): number {
  const fix = RATE_FIXES[roomId];
  return fix && Number(basePrice) === fix.from ? fix.to : Number(basePrice);
}
export const PANORAMA_DECORATION = 2500;
export const PANORAMA_DECORATION_GST = 450;

/** GST percentage for a room at this nightly rate (Indian hotel GST slabs used by XTSY). */
export const gstPercentFor = (nightlyRate: number) => (nightlyRate >= 7500 ? 18 : 5);

/** GST already contained in an all-inclusive amount (integer maths, same as the database). */
export const includedGst = (inclusiveAmount: number, percent: number) => Math.round((inclusiveAmount * percent) / (100 + percent));

export interface QuoteLine { nightlyRate: number; quantity: number }

/**
 * subtotal = room charges before GST (+ decoration), taxes = GST inside the rooms + decoration GST,
 * total = what the guest pays (all-inclusive rooms + decoration with its GST).
 */
export function quoteStay(lines: QuoteLine[], nights: number, decoration = false) {
  let roomsInclusive = 0;
  let roomsGst = 0;
  for (const l of lines) {
    const gross = l.nightlyRate * l.quantity * nights;
    roomsInclusive += gross;
    roomsGst += includedGst(gross, gstPercentFor(l.nightlyRate));
  }
  const decorationNet = decoration ? PANORAMA_DECORATION : 0;
  const decorationGst = decoration ? PANORAMA_DECORATION_GST : 0;
  return {
    roomsInclusive,
    roomsGst,
    decorationNet,
    decorationGst,
    subtotal: roomsInclusive - roomsGst + decorationNet,
    taxes: roomsGst + decorationGst,
    total: roomsInclusive + decorationNet + decorationGst,
  };
}

/** Experience by XTSY quote (stay only; decoration optional). */
export function panoramaQuote(nights: number, decoration: boolean) {
  const q = quoteStay([{ nightlyRate: PANORAMA_STAY_ONLY, quantity: 1 }], nights, decoration);
  return { nightly: PANORAMA_STAY_ONLY, ...q };
}
