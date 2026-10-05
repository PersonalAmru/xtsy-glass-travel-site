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
