import { AlertTriangle, FileCheck, Mountain } from "lucide-react";

interface Advisory {
  key: string;
  title: string;
  body: string;
  icon: "permit" | "altitude";
}

/**
 * Tier 2 disclosures: Inner Line / Protected Area permit requirements and
 * high-altitude health warnings, keyed off the tour location and title.
 */
export function getTourAdvisories(location?: string, title?: string): Advisory[] {
  const hay = `${location ?? ""} ${title ?? ""}`.toLowerCase();
  const out: Advisory[] = [];

  if (hay.includes("nagaland") || hay.includes("kohima") || hay.includes("hornbill") || hay.includes("dzukou") || hay.includes("khonoma")) {
    out.push({
      key: "ilp-nagaland",
      icon: "permit",
      title: "Permit required: Nagaland Inner Line Permit",
      body:
        "Indian nationals need an Inner Line Permit (ILP) for Nagaland, issued online or at Dimapur. Foreign nationals do not need a Protected Area Permit but must register with the Foreigners Registration Officer within 24 hours of arrival. Carry photo ID — checkposts are frequent. XTSY arranges ILP paperwork when you book; allow 3–5 working days.",
    });
  }

  if (hay.includes("arunachal") || hay.includes("tawang") || hay.includes("bumla") || hay.includes("sela") || hay.includes("ziro") || hay.includes("dirang") || hay.includes("bomdila")) {
    out.push({
      key: "ilp-arunachal",
      icon: "permit",
      title: "Permit required: Arunachal Pradesh ILP / PAP",
      body:
        "Arunachal Pradesh requires an Inner Line Permit for Indian nationals and a Protected Area Permit (PAP) for foreign nationals, which needs prior clearance and, in most cases, a minimum group size. Bumla Pass needs a separate permit issued by the Indian Army at Tawang and can be withdrawn at short notice for weather or security reasons.",
    });
  }

  if (hay.includes("tawang") || hay.includes("bumla") || hay.includes("sela")) {
    out.push({
      key: "altitude-tawang",
      icon: "altitude",
      title: "High-altitude warning: Sela 13,700 ft · Bumla 15,200 ft",
      body:
        "Sela Pass sits at 4,170 m (13,700 ft) and Bumla Pass at 4,633 m (15,200 ft). Acute mountain sickness is a real risk. Break the climb with a night at Bomdila or Dirang, hydrate, avoid alcohol, and descend immediately if you get a persistent headache, breathlessness at rest, or vomiting. Travellers with heart or lung conditions, and pregnant travellers, should seek medical advice before booking. Sela can close without notice in snow between December and March.",
    });
  }

  return out;
}

const TourPermitAdvisory = ({ location, title }: { location?: string; title?: string }) => {
  const advisories = getTourAdvisories(location, title);
  if (!advisories.length) return null;

  return (
    <section aria-labelledby="tour-advisory-heading" className="mb-8">
      <h2 id="tour-advisory-heading" className="mb-3 font-playfair text-xl font-bold text-white">
        Permits &amp; safety you must know before booking
      </h2>
      <div className="space-y-3">
        {advisories.map((a) => {
          const Icon = a.icon === "altitude" ? Mountain : FileCheck;
          return (
            <div
              key={a.key}
              className="flex gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4"
            >
              <Icon className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" aria-hidden />
              <div>
                <h3 className="mb-1 text-sm font-semibold text-amber-300">{a.title}</h3>
                <p className="text-sm leading-relaxed text-white/80">{a.body}</p>
              </div>
            </div>
          );
        })}
        <p className="flex items-start gap-2 text-xs text-white/55">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
          Permit rules and pass openings change. Confirm current requirements with the relevant state
          authority before you travel.
        </p>
      </div>
    </section>
  );
};

export default TourPermitAdvisory;
