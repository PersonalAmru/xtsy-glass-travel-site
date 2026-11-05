/**
 * Plain facts shown under the date picker on /book, so guests (and search engines) see the
 * rooms, prices and policies before choosing dates. Prices are the owner-approved, all-inclusive
 * rates; keep them in sync with the room data if they ever change.
 */
import { inr, roomPrice } from '@/components/v2/pricing';
import { PANORAMA_STAY_ONLY } from '@/data/panoramaPricing';

const ROOMS = [
  { name: '8-bed dorm', price: inr(roomPrice('8-bed-mixed-dorm').now), note: 'per bed per night' },
  { name: '6-bed dorm', price: inr(roomPrice('6-bed-mixed-dorm').now), note: 'per bed per night' },
  { name: '4-bed women-only dorm', price: inr(roomPrice('4-bed-female-only-dorm').now), note: 'per bed per night' },
  { name: 'King Double', price: inr(roomPrice('king-double-room').now), note: 'per room per night' },
  { name: 'Experience by XTSY', price: inr(PANORAMA_STAY_ONLY), note: 'per night, stay only' },
];

export default function BookingFacts() {
  return (
    <section
      aria-labelledby="booking-facts"
      className="bg-[hsl(220,25%,6%)] px-4 pb-16 pt-10 text-white/80"
    >
      <div className="mx-auto max-w-md space-y-8">
        <div>
          <h2 id="booking-facts" className="text-lg font-semibold text-white">Before you book</h2>
          <p className="mt-2 text-sm">
            XTSY Travellers Hostel is on Mawdiangdiang Road, New Shillong Township, near NIFT and IIM Shillong.
            Every price below is an indicative live-inventory rate, all inclusive. Final availability and total are calculated for your selected dates before you submit the enquiry.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Rooms and prices</h3>
          <ul className="mt-3 divide-y divide-white/10 rounded-xl border border-white/10">
            {ROOMS.map((r) => (
              <li key={r.name} className="flex items-baseline justify-between gap-4 px-4 py-3 text-sm">
                <span className="text-white">{r.name}</span>
                <span className="text-right">
                  <span className="font-semibold text-white">{r.price}</span>{' '}
                  <span className="text-white/60">{r.note}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Booking and arrival</h3>
          <p className="mt-2 text-sm">Choose your property and dates, select the room or dorm beds available for that stay, review the total including applicable taxes, and submit your guest details. The XTSY Booking Desk follows up to confirm the reservation. The hostel is at Mawdiangdiang Road, New Shillong Township, Shillong, Meghalaya 793018; it is outside Police Bazaar, so allow road-transfer time when planning arrival.</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white">House policies</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
            <li>Check-in from 11:00 AM; check-out strictly by 10:00 AM.</li>
            <li>There is no free cancellation: the booking amount is non-refundable.</li>
            <li>The 4-bed dorm is for women only.</li>
            <li>Cats and birds are most welcome; dogs depending on breed and size. Ask the XTSY desk about any extra charges.</li>
            <li>Experience by XTSY decorations are available for +₹2,500 + ₹450 GST.</li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Questions?</h3>
          <p className="mt-2 text-sm">
            Email <a className="underline" href="mailto:booking@xtsy.one">booking@xtsy.one</a> for bookings, or{' '}
            <a className="underline" href="mailto:admin@xtsy.one">admin@xtsy.one</a> for policies. You can also read the{' '}
            <a className="underline" href="/faq">FAQs</a> and the{' '}
            <a className="underline" href="/pricing-cancellation-policy">pricing and cancellation policy</a>.
          </p>
        </div>
      </div>
    </section>
  );
}
