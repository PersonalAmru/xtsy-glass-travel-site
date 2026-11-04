/**
 * Operator coverage disclosure for the current trip planner.
 *
 * The repository does not yet contain a verified-Operator directory. Therefore
 * regions outside XTSY's own Shillong base are treated as "not verified in the
 * platform", never as proof that no local guide or host exists.
 *
 * Replace this conservative fallback with the live operator-coverage query
 * when the regional Operator registry is introduced.
 */
import { CLUSTERS, PLACE_BY_ID } from './places';

export interface OperatorCoverageNotice {
  state: string;
  destinations: string[];
}

export function getOperatorCoverageNotices(placeIds: string[]): OperatorCoverageNotice[] {
  const byState = new Map<string, Set<string>>();

  for (const id of [...new Set(placeIds)]) {
    const place = PLACE_BY_ID[id];
    if (!place || place.cluster === 'shillong') continue;

    const state = CLUSTERS[place.cluster].state;
    const destinations = byState.get(state) ?? new Set<string>();
    destinations.add(place.name);
    byState.set(state, destinations);
  }

  return [...byState.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([state, destinations]) => ({
      state,
      destinations: [...destinations].sort((a, b) => a.localeCompare(b)),
    }));
}

export function formatOperatorCoverageNotice(notices: OperatorCoverageNotice[]): string {
  if (!notices.length) return '';

  const regions = notices
    .map(({ state, destinations }) => `**${state}:** ${destinations.join(', ')}`)
    .join('\n');

  return [
    '**Local Operator coverage needs verification**',
    `XTSY AI does not yet have a live verified-Operator listing for these regions:\n${regions}`,
    'The XTSY Booking Desk will check its current local network. If a suitable verified Operator is not yet available, we will ask the team to identify and coordinate appropriate local support for this destination. The Booking Desk will update you shortly after checking feasibility and availability. This is a platform coverage check, not a claim that local providers do not exist.',
  ].join('\n\n');
}
