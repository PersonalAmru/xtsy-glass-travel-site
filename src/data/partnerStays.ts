/**
 * Partner stays outside New Shillong.
 *
 * XTSY owns one property, in New Shillong Township. Everywhere else, stays are arranged with
 * local homestays and guest houses we have stayed in ourselves, so the money stays with them and
 * XTSY is not competing with the people who live there.
 *
 * Add a partner here only once terms are agreed with the owner. Until then the list stays empty
 * and the site says, truthfully, that stays are arranged through trusted local partners rather
 * than naming places we have no agreement with.
 */
export interface PartnerStay {
  /** Name as the owner wants it shown. */
  name: string;
  /** Town or village, e.g. "Tyrna, near Sohra". */
  place: string;
  /** One line on what the stay is like. */
  note: string;
  /** Which trips use it, by package slug. */
  usedBy: string[];
}

export const PARTNER_STAYS: PartnerStay[] = [];

export const partnerStaysFor = (packageSlug: string): PartnerStay[] =>
  PARTNER_STAYS.filter((s) => s.usedBy.includes(packageSlug));
