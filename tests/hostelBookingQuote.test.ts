import { describe, expect, it } from 'vitest';
import { resolveBookingQuote } from '../src/utils/bookingCatalogue';
import { HOSTEL_POLICIES } from '../src/data/hostelPolicies';

describe('approved dorm quotes', () => {
  for (const [beds, rate] of [[8, 399], [6, 499], [4, 599]]) {
    const gender = beds === 4 ? 'Female' : 'Mixed';
    it(`${beds}-bed ${gender} stays at ₹${rate}, including GST`, () => {
      const quote = resolveBookingQuote([{ id: `dorm-${beds}`, name: `${beds}-Bed ${gender} Dorm`, base_price: rate, is_active: true }],
        [{ name: `Bed in ${beds}-Bed ${gender} Dormitory`, quantity: 2, kind: 'dorm', capacity: beds }], 3);
      expect(quote.total).toBe(rate * 6);
      expect(quote.taxes).toBe(Math.round(rate * 6 * 5 / 105));
      expect(quote.subtotal + quote.taxes).toBe(quote.total);
      expect(quote.guests).toBe(2);
    });
  }
  it('rejects the discontinued 4-bed mixed dorm', () => {
    expect(() => resolveBookingQuote([{ id: 'closed', name: 'Bed in 4-Bed Mixed Dormitory', base_price: 399, is_active: true }],
      [{ name: 'Bed in 4-Bed Mixed Dormitory', quantity: 1, kind: 'dorm', capacity: 4 }], 1)).toThrow('not currently available');
  });
  it('uses the catalogue rate instead of a stale cached quote', () => {
    expect(resolveBookingQuote([{ id: 'eight', name: '8-Bed Mixed Dorm', base_price: 399, is_active: true }],
      [{ name: 'Bed in 8-Bed Mixed Dormitory', quantity: 1, kind: 'dorm', capacity: 8 }], 1).total).toBe(399);
  });
});
describe('published hostel times', () => {
  it('checks in at 11 AM', () => expect(HOSTEL_POLICIES.checkIn).toBe('11 AM'));
  it('checks out strictly at 10 AM', () => expect(HOSTEL_POLICIES.checkOut).toBe('10 AM'));
  it('keeps quiet hours from 10 PM to 7 AM', () => expect(HOSTEL_POLICIES.quietHours).toBe('10 PM – 7 AM'));
});