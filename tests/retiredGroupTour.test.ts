import { describe, expect, it } from 'vitest';
import { SIGNATURE_PACKAGES, getSignaturePackageBySlug } from '../src/data/signaturePackages';

describe('Retired Saturday group departure', () => {
  it('is not an available catalogue offer', () => {
    expect(getSignaturePackageBySlug('meghalaya-group-trip-6n-7d')).toBeUndefined();
    expect(SIGNATURE_PACKAGES.some((p) => p.slug === 'meghalaya-group-trip-6n-7d')).toBe(false);
  });

  // What this guards is that the seven-day Meghalaya tour is still the PRIVATE
  // package and did not quietly inherit the retired Saturday departure's shape:
  // it keeps a minimum group and has no fixed departure dates.
  //
  // The rate is owner-set and is expected to move. It was Rs 17,500 when the
  // group departure was retired on 30 Oct 2026, and Rs 21,000 from 31 Oct, when
  // the ten signature packages were benchmarked against published competitor
  // rates. The literal stays so an accidental change still fails here; update it
  // deliberately, with the owner's decision, rather than to make CI pass.
  it('preserves the private seven-day package, and its owner-set rate', () => {
    const tour = getSignaturePackageBySlug('6n-7d-meghalaya-tour');
    expect(tour?.pricePerPerson).toBe(21000);
    expect(tour?.minGroup).toBe(4);
    expect(tour?.departures).toBeUndefined();
  });
});