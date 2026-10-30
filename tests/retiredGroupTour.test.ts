import { describe, expect, it } from 'vitest';
import { SIGNATURE_PACKAGES, getSignaturePackageBySlug } from '../src/data/signaturePackages';

describe('Retired Saturday group departure', () => {
  it('is not an available catalogue offer', () => {
    expect(getSignaturePackageBySlug('meghalaya-group-trip-6n-7d')).toBeUndefined();
    expect(SIGNATURE_PACKAGES.some((p) => p.slug === 'meghalaya-group-trip-6n-7d')).toBe(false);
  });

  it('preserves the existing private seven-day package and rate', () => {
    const tour = getSignaturePackageBySlug('6n-7d-meghalaya-tour');
    expect(tour?.pricePerPerson).toBe(17500);
    expect(tour?.minGroup).toBe(4);
    expect(tour?.departures).toBeUndefined();
  });
});