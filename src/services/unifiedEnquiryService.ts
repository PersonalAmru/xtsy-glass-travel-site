import { supabase } from "@/integrations/supabase/client";

/**
 * Unified Enquiry Service
 * ------------------------------------------------------------------
 * Aggregates every guest enquiry across the platform into ONE feed so
 * the admin can view + contact guests from a single panel:
 *  - stay      → public.enquiries        (Check-availability / room bookings)
 *  - tour      → public.tour_enquiries   (Tours & travel packages)
 *  - catering  → public.catering_enquiries (TAB Bistro catering / events / bulk)
 *
 * ENQ serials are kept clean & segregated by category prefix:
 *  - XTH-…  / XTSY-…   (stay, stored enquiry_id)
 *  - XTSY-T-…          (tour, stored enquiry_id)
 *  - XTSY-CAT-…        (catering, derived from row id)
 */

export type EnquiryCategory = "stay" | "tour" | "catering";

export interface UnifiedEnquiry {
  id: string;
  category: EnquiryCategory;
  /** Clean, segregated reference number shown to admin. */
  refId: string;
  guestName: string;
  email?: string | null;
  /** Best phone number for call / WhatsApp. */
  phone?: string | null;
  /** One-line title (room / package / event type). */
  summary: string;
  /** Secondary detail line (dates, travellers, guest count…). */
  detail: string;
  amount?: number | null;
  status: string;
  createdAt: string;
}

const CATEGORY_META: Record<
  EnquiryCategory,
  { label: string; table: string; serialPrefix: string }
> = {
  stay: { label: "Stay", table: "enquiries", serialPrefix: "XTH" },
  tour: { label: "Tour", table: "tour_enquiries", serialPrefix: "XTSY-T" },
  catering: {
    label: "Catering",
    table: "catering_enquiries",
    serialPrefix: "XTSY-CAT",
  },
};

export function categoryLabel(c: EnquiryCategory): string {
  return CATEGORY_META[c].label;
}

function fmtDate(d?: string | null): string {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return d;
  }
}

function deriveCateringSerial(id: string): string {
  return `XTSY-CAT-${id.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}

export async function fetchUnifiedEnquiries(): Promise<{
  data: UnifiedEnquiry[];
  errors: string[];
}> {
  const errors: string[] = [];

  const [stayRes, tourRes, cateringRes] = await Promise.all([
    supabase
      .from("enquiries")
      .select(
        "id, enquiry_id, guest_name, email, phone, room_name, room_type, check_in, check_out, nights, quantity, total_amount, status, created_at"
      )
      .order("created_at", { ascending: false }),
    (supabase as any)
      .from("tour_enquiries")
      .select(
        "id, enquiry_id, package_title, package_location, guest_name, email, whatsapp_number, travellers, preferred_date, total_amount, status, created_at"
      )
      .order("created_at", { ascending: false }),
    supabase
      .from("catering_enquiries")
      .select(
        "id, full_name, phone, email, event_type, event_date, guest_count, cuisine_preferences, status, created_at"
      )
      .order("created_at", { ascending: false }),
  ]);

  const out: UnifiedEnquiry[] = [];

  if (stayRes.error) errors.push(`Stay enquiries: ${stayRes.error.message}`);
  else
    for (const r of stayRes.data ?? []) {
      out.push({
        id: r.id,
        category: "stay",
        refId: r.enquiry_id || `XTH-${String(r.id).slice(0, 8).toUpperCase()}`,
        guestName: r.guest_name,
        email: r.email,
        phone: r.phone,
        summary: r.room_name || r.room_type || "Room enquiry",
        detail: `${fmtDate(r.check_in)} → ${fmtDate(r.check_out)} · ${
          r.quantity ?? 1
        } room(s) · ${r.nights ?? 1} night(s)`,
        amount: r.total_amount,
        status: r.status || "pending",
        createdAt: r.created_at,
      });
    }

  if (tourRes.error) errors.push(`Tour enquiries: ${tourRes.error.message}`);
  else
    for (const r of tourRes.data ?? []) {
      out.push({
        id: r.id,
        category: "tour",
        refId: r.enquiry_id || `XTSY-T-${String(r.id).slice(0, 8).toUpperCase()}`,
        guestName: r.guest_name,
        email: r.email,
        phone: r.whatsapp_number,
        summary: r.package_title || "Tour package",
        detail: `${r.package_location || "Northeast"} · ${
          r.travellers ?? 1
        } traveller(s) · ${r.preferred_date || "flexible"}`,
        amount: r.total_amount,
        status: r.status || "pending",
        createdAt: r.created_at,
      });
    }

  if (cateringRes.error)
    errors.push(`Catering enquiries: ${cateringRes.error.message}`);
  else
    for (const r of cateringRes.data ?? []) {
      out.push({
        id: r.id,
        category: "catering",
        refId: deriveCateringSerial(r.id),
        guestName: r.full_name,
        email: r.email,
        phone: r.phone,
        summary: r.event_type || "Catering / event",
        detail: `${fmtDate(r.event_date)} · ${
          r.guest_count ? `${r.guest_count} guests` : "guest count TBD"
        }${r.cuisine_preferences ? ` · ${r.cuisine_preferences}` : ""}`,
        amount: null,
        status: r.status || "new",
        createdAt: r.created_at,
      });
    }

  out.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return { data: out, errors };
}

/** Update the status of a catering enquiry (free-text workflow). */
export async function updateCateringStatus(
  id: string,
  status: "new" | "contacted" | "closed"
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from("catering_enquiries")
    .update({ status })
    .eq("id", id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

/** Build a normalised tel: / wa.me / mailto contact URL. */
export function contactLinks(e: UnifiedEnquiry) {
  const digits = (e.phone || "").replace(/[^0-9]/g, "");
  const waNumber = digits.length === 10 ? `91${digits}` : digits;
  const greeting = encodeURIComponent(
    `Hello ${e.guestName}, thank you for your ${categoryLabel(
      e.category
    ).toLowerCase()} enquiry (${e.refId}) with XTSY. How can we help you?`
  );
  return {
    tel: digits ? `tel:+${waNumber}` : null,
    whatsapp: digits ? `https://wa.me/${waNumber}?text=${greeting}` : null,
    email: e.email ? `mailto:${e.email}` : null,
  };
}
