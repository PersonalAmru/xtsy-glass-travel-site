/**
 * Plain facts shown under the date picker on /book, so guests (and search engines) see the
 * rooms, prices and policies before choosing dates. Prices are the owner-approved, all-inclusive
 * rates; keep them in sync with the room data if they ever change.
 */
const ROOMS = [
  { name: '8-bed dorm', price: '₹399', note: 'per bed per night' },
  { name: '6-bed dorm', price: '₹499', note: 'per bed per night' },
  { name: '4-bed women-only dorm', price: '₹599', note: 'per bed per night' },
  { name: 'King Double', price: '₹2,399', note: 'per room per night' },
  { name: 'Experience by XTSY', price: '₹5,999', note: 'per night, stay only' },
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
            Every price below is all inclusive, with no booking-site mark-up when you book here.
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
