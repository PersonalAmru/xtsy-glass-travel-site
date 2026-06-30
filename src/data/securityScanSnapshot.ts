/**
 * Security Scan Snapshot
 *
 * Latest persisted results from the platform security scanners, kept in sync by
 * the maintainer after each scan/remediation pass. The admin Security page reads
 * this to display findings and highlight any NEW `vulnerable_dependencies_*`
 * (supply-chain / SCA) findings by their internal_id.
 *
 * NOTE: The platform security scanner runs outside the app runtime, so this is a
 * committed snapshot rather than a live query. Update `capturedAt`, the scanner
 * `findings`, and `dependencyHistory` whenever a scan is re-run.
 */

export type ScanLevel = 'critical' | 'high' | 'medium' | 'low' | 'warn' | 'info';
export type FindingStatus = 'open' | 'fixed' | 'ignored';

export interface ScannerSummary {
  /** Scanner identifier as reported by the platform. */
  scannerName: string;
  /** Human label for the admin UI. */
  label: string;
  /** ISO timestamp of the scanner's last run. */
  timestamp: string;
  /** Whether the scanner result is current. */
  upToDate: boolean;
  /** Number of open findings for this scanner. */
  openFindings: number;
}

export interface DependencyFinding {
  /** Stable id used to detect NEW findings across snapshots. */
  internalId: string;
  scannerName: string;
  level: ScanLevel;
  status: FindingStatus;
  title: string;
  /** Packages involved in this finding. */
  packages: string[];
  /** Short note on remediation. */
  remediation: string;
  /** ISO date the finding was resolved (if fixed). */
  resolvedAt?: string;
}

/** When this snapshot was captured (most recent re-scan). */
export const SCAN_CAPTURED_AT = '2026-06-30T09:20:00Z';

/** Per-scanner roll-up shown as cards on the admin page. */
export const SCANNER_SUMMARIES: ScannerSummary[] = [
  {
    scannerName: 'supply_chain',
    label: 'Supply Chain (SCA)',
    timestamp: '2026-06-30T09:20:00Z',
    upToDate: true,
    openFindings: 0,
  },
  {
    scannerName: 'supabase',
    label: 'Database / RLS',
    timestamp: '2026-06-30T09:01:49Z',
    upToDate: false,
    openFindings: 0,
  },
  {
    scannerName: 'connector_security_scan',
    label: 'Connectors',
    timestamp: '2026-06-30T09:01:49Z',
    upToDate: false,
    openFindings: 0,
  },
  {
    scannerName: 'agent_security',
    label: 'Agent Security',
    timestamp: '2026-06-06T10:18:03Z',
    upToDate: false,
    openFindings: 0,
  },
];

/**
 * Vulnerable-dependency (SCA) findings tracked by internal_id.
 * The admin page flags any entry whose internalId is not in
 * KNOWN_DEPENDENCY_FINDING_IDS as NEW and needing attention.
 */
export const DEPENDENCY_FINDINGS: DependencyFinding[] = [
  {
    internalId: 'vulnerable_dependencies_high',
    scannerName: 'supply_chain',
    level: 'high',
    status: 'fixed',
    title: 'High-severity vulnerable dependencies',
    packages: ['react-router-dom', 'recharts', 'react-simple-maps'],
    remediation:
      'Bumped react-router-dom → ^6.30.4, recharts → ^2.15.4; pinned d3-color → ^3.1.0 via overrides.',
    resolvedAt: '2026-06-30',
  },
  {
    internalId: 'vulnerable_dependencies_medium',
    scannerName: 'supply_chain',
    level: 'medium',
    status: 'fixed',
    title: 'Medium-severity vulnerable dependencies',
    packages: ['@radix-ui/*', 'cmdk', 'vaul', 'recharts', '@babel/runtime'],
    remediation:
      'Pinned @babel/runtime → ^7.26.10 via overrides (ReDoS fix propagates to Radix UI, cmdk, vaul, recharts).',
    resolvedAt: '2026-06-30',
  },
];

/**
 * internal_ids we have already triaged. Any DEPENDENCY_FINDINGS entry not in
 * this set — or any future finding fed in — is highlighted as NEW.
 */
export const KNOWN_DEPENDENCY_FINDING_IDS: ReadonlySet<string> = new Set([
  'vulnerable_dependencies_high',
  'vulnerable_dependencies_medium',
]);

export const isNewDependencyFinding = (f: DependencyFinding): boolean =>
  f.status === 'open' && !KNOWN_DEPENDENCY_FINDING_IDS.has(f.internalId);

export const totalOpenFindings = (): number =>
  SCANNER_SUMMARIES.reduce((sum, s) => sum + s.openFindings, 0);
