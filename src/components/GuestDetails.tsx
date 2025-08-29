import React, { useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

/**
 * Supabase client
 * (Swap this for your shared client import if you already have one.)
 */
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

/** WhatsApp number in E.164 format (no +, no spaces) */
const WA_NUMBER = import.meta.env.VITE_WA_NUMBER ?? "918837317070";

/** Build a WhatsApp deep-link with a prefilled message */
function buildWhatsAppUrl(phoneE164: string, message: string) {
  return `https://wa.me/${phoneE164}?text=${encodeURIComponent(message)}`;
}

/** Silent CTA log → always redirect (even if logging fails) */
async function logAndRedirectWhatsApp(ctaName: string, waUrl: string) {
  try {
    await supabase.from("cta_logs").insert([{ cta_name: ctaName }]);
  } catch (err) {
    console.warn("CTA log failed (non-blocking):", err);
  } finally {
    window.open(waUrl, "_blank", "noopener,noreferrer");
  }
}

const GuestDetails: React.FC = () => {
  // Dates & counts
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [nights, setNights] = useState<number | "">("");
  const [guests, setGuests] = useState<number | "">("");

  // Contact
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // Address
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [stateVal, setStateVal] = useState("");
  const [pincode, setPincode] = useState("");

  // Notes
  const [specialRequests, setSpecialRequests] = useState("");

  // Compose a tidy message for WA
  const bookingMessage = useMemo(() => {
    const addressParts = [
      addressLine1,
      addressLine2,
      [city, stateVal].filter(Boolean).join(", "),
      pincode,
    ].filter(Boolean);

    return (
`🧳 *XTSY Booking Request*

Check-in: ${checkIn || "-"}
Check-out: ${checkOut || "-"}
Nights: ${nights || "-"}
Guests: ${guests || "-"}

Name: ${fullName || "-"}
Phone: ${phone || "-"}
Email: ${email || "-"}

Address:
${addressParts.join(", ")}

${specialRequests ? `Notes: ${specialRequests}` : ""}`.trim()
    );
  }, [
    checkIn,
    checkOut,
    nights,
    guests,
    fullName,
    phone,
    email,
    addressLine1,
    addressLine2,
    city,
    stateVal,
    pincode,
    specialRequests,
  ]);

  async function onCompleteBookingViaWhatsApp() {
    const url = buildWhatsAppUrl(WA_NUMBER, bookingMessage);
    await logAndRedirectWhatsApp("CompleteBookingViaWhatsApp", url);
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 rounded-2xl bg-white/70 dark:bg-neutral-900/60 shadow-md">
      <h2 className="text-xl sm:text-2xl font-semibold tracking-tight mb-4">
        Booking Summary and Guest Details
      </h2>

      <form
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          onCompleteBookingViaWhatsApp();
        }}
      >
        {/* Dates & counts */}
        <div>
          <label className="block text-sm mb-1">Check-in</label>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Check-out</label>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Nights</label>
          <input
            type="number"
            min={1}
            value={nights}
            onChange={(e) =>
              setNights(e.target.value ? Number(e.target.value) : "")
            }
            className="w-full rounded-lg border px-3 py-2"
            placeholder="e.g., 2"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Guests</label>
          <input
            type="number"
            min={1}
            value={guests}
            onChange={(e) =>
              setGuests(e.target.value ? Number(e.target.value) : "")
            }
            className="w-full rounded-lg border px-3 py-2"
            placeholder="e.g., 4"
          />
        </div>

        {/* Contact */}
        <div>
          <label className="block text-sm mb-1">Full Name</label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-lg border px-3 py-2"
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Phone</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-lg border px-3 py-2"
            placeholder="Your phone"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border px-3 py-2"
            placeholder="your@email.com"
          />
        </div>

        {/* Address */}
        <div className="sm:col-span-2">
          <label className="block text-sm mb-1">Address Line 1</label>
          <input
            value={addressLine1}
            onChange={(e) => setAddressLine1(e.target.value)}
            className="w-full rounded-lg border px-3 py-2"
            placeholder="Street address"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm mb-1">Address Line 2 (optional)</label>
          <input
            value={addressLine2}
            onChange={(e) => setAddressLine2(e.target.value)}
            className="w-full rounded-lg border px-3 py-2"
            placeholder="Apt, suite, building"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">City</label>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full rounded-lg border px-3 py-2"
            placeholder="Shillong"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">State</label>
          <input
            value={stateVal}
            onChange={(e) => setStateVal(e.target.value)}
            className="w-full rounded-lg border px-3 py-2"
            placeholder="Meghalaya"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Pincode</label>
          <input
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            className="w-full rounded-lg border px-3 py-2"
            placeholder="793001"
          />
        </div>

        {/* Notes */}
        <div className="sm:col-span-2">
          <label className="block text-sm mb-1">Emergency / Notes (optional)</label>
          <textarea
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 min-h-[88px]"
            placeholder="Any preferences or notes for your stay?"
          />
        </div>

        {/* Actions */}
        <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
          <button
            type="button"
            className="w-full rounded-xl px-4 py-3 font-semibold text-white shadow-lg bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
            onClick={onCompleteBookingViaWhatsApp}
          >
            Complete Booking via WhatsApp
          </button>

          <button
            type="button"
            className="w-full rounded-xl px-4 py-3 font-semibold border shadow-sm hover:bg-neutral-50 dark:hover:bg-neutral-800"
            onClick={() => {
              setCheckIn(""); setCheckOut(""); setNights(""); setGuests("");
              setFullName(""); setPhone(""); setEmail("");
              setAddressLine1(""); setAddressLine2("");
              setCity(""); setStateVal(""); setPincode("");
              setSpecialRequests("");
            }}
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default GuestDetails;
