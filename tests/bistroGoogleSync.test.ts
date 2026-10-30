import { describe, expect, it, vi } from 'vitest';
import { buildBistroGoogleFields, matchingBistroGoogleFields, reconcileBistroGoogleProfile } from '../src/lib/bistroGoogleProfile';

describe('Bistro Google sync rules', () => {
  // These are deliberate literals, not derived from tabBistroHours.ts. The point of this test is
  // to pin the exact hours that would reach the live Google listing, so changing the hours has to
  // be a conscious two-file edit rather than something that rides along with a copy change.
  it('publishes 8:45–12:00 breakfast and 17:00–23:00 dinner on all seven days, never lunch hours', () => {
    const periods = buildBistroGoogleFields().regularHours?.periods ?? [];
    expect(periods).toHaveLength(14);
    for (const day of ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY']) {
      expect(periods.filter(p => p.openDay === day).map(p => [p.openTime, p.closeTime])).toEqual([
        [{ hours: 8, minutes: 45 }, { hours: 12, minutes: 0 }],
        [{ hours: 17, minutes: 0 }, { hours: 23, minutes: 0 }],
      ]);
    }
  });
  it('performs no mutation when Google already matches, including omitted zero minutes', async () => {
    const current = buildBistroGoogleFields();
    current.regularHours?.periods?.reverse().forEach(p => { if (p.closeTime.minutes === 0) delete p.closeTime.minutes; });
    const call = vi.fn().mockResolvedValue(current);
    expect(await reconcileBistroGoogleProfile(call)).toBe('unchanged');
    expect(call.mock.calls).toEqual([['GET']]);
  });
  it('validates before applying only hours and profile, then reads back', async () => {
    const desired = buildBistroGoogleFields();
    const call = vi.fn().mockResolvedValueOnce({}).mockResolvedValueOnce({}).mockResolvedValueOnce(desired).mockResolvedValueOnce(desired);
    expect(await reconcileBistroGoogleProfile(call)).toBe('updated');
    expect(call.mock.calls).toEqual([['GET'], ['PATCH', true, desired], ['PATCH', false, desired], ['GET']]);
    expect(Object.keys(desired).sort()).toEqual(['profile','regularHours']);
  });
  it('stops after failed validation rather than sending the update', async () => {
    const call = vi.fn().mockResolvedValueOnce({}).mockRejectedValueOnce(new Error('Google rejected update'));
    await expect(reconcileBistroGoogleProfile(call)).rejects.toThrow('Google rejected update');
    expect(call).toHaveBeenCalledTimes(2);
  });
  it('does not report success if readback differs', async () => {
    const call = vi.fn().mockResolvedValue({});
    await expect(reconcileBistroGoogleProfile(call)).rejects.toThrow('Google has not returned');
    expect(matchingBistroGoogleFields({}, buildBistroGoogleFields())).toBe(false);
  });
});