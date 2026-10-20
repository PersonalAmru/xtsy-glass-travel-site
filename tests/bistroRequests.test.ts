import { describe, expect, it } from 'vitest';
import { BISTRO_SLOT_RANGES, isValidBistroRequestTime } from '../src/data/tabBistroHours';

const tableTimes = BISTRO_SLOT_RANGES.flatMap(({ from, to }) => {
  const times: string[] = [];
  for (let minute = from; minute <= to; minute += 30) {
    times.push(`${String(Math.floor(minute / 60)).padStart(2, '0')}:${String(minute % 60).padStart(2, '0')}`);
  }
  return times;
});

describe('TAB Bistro lunch preorder requests', () => {
  it('accepts a requested lunch time without making lunch a table service window', () => {
    expect(isValidBistroRequestTime('lunch-preorder', '13:00', tableTimes)).toBe(true);
    expect(isValidBistroRequestTime('table', '13:00', tableTimes)).toBe(false);
  });
  it('requires a valid time for a lunch preorder', () => {
    expect(isValidBistroRequestTime('lunch-preorder', '', tableTimes)).toBe(false);
    expect(isValidBistroRequestTime('lunch-preorder', '25:00', tableTimes)).toBe(false);
  });
  it('keeps breakfast and dinner table requests available', () => {
    expect(isValidBistroRequestTime('table', '08:45', tableTimes)).toBe(true);
    expect(isValidBistroRequestTime('table', '16:30', tableTimes)).toBe(true);
  });
});