/**
 * Admin · Security
 *
 * Displays the latest platform security-scan snapshot and highlights any NEW
 * `vulnerable_dependencies_*` (SCA / supply-chain) findings by internal_id.
 *
 * Data source: src/data/securityScanSnapshot.ts — a committed snapshot kept in
 * sync after each re-scan (the platform scanner runs outside the app runtime).
 * CI guards (Dependency SCA workflow + Dependabot) keep the live dependency
 * tree clean between snapshots.
 */
import { useMemo } from 'react';
import { UnifiedAdminLayout } from '@/layouts/UnifiedAdminLayout';
import { AppleSectionHeader } from '@/components/admin/AppleCard';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  ShieldCheck, ShieldAlert, AlertTriangle, CheckCircle2, Clock,
  Package, ExternalLink, Wrench,
} from 'lucide-react';
import {
  SCAN_CAPTURED_AT,
  SCANNER_SUMMARIES,
  DEPENDENCY_FINDINGS,
  isNewDependencyFinding,
  totalOpenFindings,
  type ScanLevel,
  type FindingStatus,
} from '@/data/securityScanSnapshot';

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

const levelClass = (level: ScanLevel) => {
  switch (level) {
    case 'critical': return 'bg-red-500/15 text-red-300 border-red-500/30';
    case 'high': return 'bg-orange-500/15 text-orange-300 border-orange-500/30';
    case 'medium': return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
    case 'low': return 'bg-sky-500/15 text-sky-300 border-sky-500/30';
    default: return 'bg-slate-500/15 text-slate-300 border-slate-500/30';
  }
};

const statusMeta: Record<FindingStatus, { label: string; cls: string }> = {
  fixed: { label: 'Fixed', cls: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
  open: { label: 'Open', cls: 'bg-red-500/15 text-red-300 border-red-500/30' },
  ignored: { label: 'Ignored', cls: 'bg-slate-500/15 text-slate-400 border-slate-500/30' },
};

export default function AdminSecurity() {
  const openCount = useMemo(() => totalOpenFindings(), []);
  const newFindings = useMemo(
    () => DEPENDENCY_FINDINGS.filter(isNewDependencyFinding),
    [],
  );
  const allClear = openCount === 0 && newFindings.length === 0;

  return (
    <UnifiedAdminLayout>
      <div className="space-y-6">
        <AppleSectionHeader
          title="Security"
          subtitle={`Latest scan snapshot · captured ${fmtDate(SCAN_CAPTURED_AT)}`}
        />

        {/* Overall status banner */}
        <div
          className={cn(
            'rounded-2xl border p-5 flex items-center gap-4 backdrop-blur-xl',
            allClear
              ? 'bg-emerald-500/10 border-emerald-500/25'
              : 'bg-red-500/10 border-red-500/25',
          )}
        >
          <div
            className={cn(
              'w-12 h-12 rounded-xl flex items-center justify-center',
              allClear ? 'bg-emerald-500/20' : 'bg-red-500/20',
            )}
          >
            {allClear
              ? <ShieldCheck className="w-6 h-6 text-emerald-300" />
              : <ShieldAlert className="w-6 h-6 text-red-300" />}
          </div>
          <div>
            <p className="text-white font-semibold">
              {allClear ? 'All clear — 0 open findings' : `${openCount} open finding(s) need attention`}
            </p>
            <p className="text-sm text-slate-400">
              {newFindings.length > 0
                ? `${newFindings.length} NEW vulnerable-dependency finding(s) detected`
                : 'No new vulnerable-dependency findings since last triage.'}
            </p>
          </div>
        </div>

        {/* NEW vulnerable_dependencies highlight */}
        {newFindings.length > 0 && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-5 space-y-3">
            <div className="flex items-center gap-2 text-red-300 font-semibold">
              <AlertTriangle className="w-5 h-5" />
              New vulnerable_dependencies findings
            </div>
            {newFindings.map((f) => (
              <div key={f.internalId} className="rounded-xl bg-slate-900/50 border border-red-500/20 p-4">
                <code className="text-xs text-red-300">{f.internalId}</code>
                <p className="text-white text-sm mt-1">{f.title}</p>
                <p className="text-slate-400 text-xs mt-1">{f.remediation}</p>
              </div>
            ))}
          </div>
        )}

        {/* Scanner summary cards */}
        <div>
          <h3 className="text-sm font-semibold text-slate-400 mb-3">Scanners</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {SCANNER_SUMMARIES.map((s) => (
              <div
                key={s.scannerName}
                className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium text-sm">{s.label}</span>
                  {s.openFindings === 0
                    ? <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    : <AlertTriangle className="w-4 h-4 text-red-400" />}
                </div>
                <p className="text-2xl font-bold text-white mt-2">{s.openFindings}</p>
                <p className="text-xs text-slate-500">open findings</p>
                <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
                  <Clock className="w-3 h-3" />
                  {fmtDate(s.timestamp)}
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    'mt-2 text-[10px]',
                    s.upToDate
                      ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                      : 'bg-slate-500/10 text-slate-400 border-slate-500/30',
                  )}
                >
                  {s.upToDate ? 'Up to date' : 'Re-scan pending'}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Dependency (SCA) findings table */}
        <div>
          <h3 className="text-sm font-semibold text-slate-400 mb-3">
            Vulnerable dependency findings (by internal_id)
          </h3>
          <div className="space-y-3">
            {DEPENDENCY_FINDINGS.map((f) => (
              <div
                key={f.internalId}
                className={cn(
                  'rounded-2xl border bg-slate-900/40 backdrop-blur-xl p-4',
                  isNewDependencyFinding(f) ? 'border-red-500/40' : 'border-white/10',
                )}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <code className="text-xs text-slate-300 bg-slate-800/60 px-2 py-1 rounded">
                    {f.internalId}
                  </code>
                  <Badge variant="outline" className={cn('text-[10px] uppercase', levelClass(f.level))}>
                    {f.level}
                  </Badge>
                  <Badge variant="outline" className={cn('text-[10px]', statusMeta[f.status].cls)}>
                    {statusMeta[f.status].label}
                  </Badge>
                  {isNewDependencyFinding(f) && (
                    <Badge variant="outline" className="text-[10px] bg-red-500/20 text-red-300 border-red-500/40">
                      NEW
                    </Badge>
                  )}
                  {f.resolvedAt && (
                    <span className="text-xs text-slate-500 ml-auto">Resolved {f.resolvedAt}</span>
                  )}
                </div>
                <p className="text-white text-sm font-medium mt-2">{f.title}</p>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <Package className="w-3.5 h-3.5 text-slate-500" />
                  {f.packages.map((p) => (
                    <span key={p} className="text-xs text-slate-400 bg-slate-800/40 px-2 py-0.5 rounded">
                      {p}
                    </span>
                  ))}
                </div>
                <div className="flex items-start gap-2 mt-2 text-xs text-slate-400">
                  <Wrench className="w-3.5 h-3.5 mt-0.5 shrink-0 text-slate-500" />
                  <span>{f.remediation}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Automation note */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/30 p-4 text-xs text-slate-400 space-y-1">
          <div className="flex items-center gap-2 text-slate-300 font-medium">
            <ExternalLink className="w-3.5 h-3.5" />
            Continuous protection
          </div>
          <p>• CI gate: the <code className="text-slate-300">Dependency SCA</code> workflow fails any build that introduces a high/critical vulnerable dependency.</p>
          <p>• Dependabot opens PRs for vulnerable + outdated packages and notifies maintainers of high/medium advisories.</p>
          <p>• Re-run the platform scan after each merge, then update this snapshot.</p>
        </div>
      </div>
    </UnifiedAdminLayout>
  );
}
