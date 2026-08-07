/**
 * Admin · SEO Workflow — approval-gated 7-phase revenue program.
 *
 * Each phase shows its findings and must be explicitly approved before the
 * next unlocks. Approvals persist in localStorage so the gate state survives
 * reloads. Revenue-generating phases are prioritised throughout.
 */
import { useState, useEffect, useCallback } from 'react';
import { UnifiedAdminLayout } from '@/layouts/UnifiedAdminLayout';
import { AppleSectionHeader } from '@/components/admin/AppleCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  CheckCircle2, Lock, ChevronRight, RotateCcw, CircleDot,
  TrendingUp, AlertTriangle, XCircle, Info, ArrowRight,
} from 'lucide-react';
import { SEO_WORKFLOW_PHASES, type FindingTone } from '@/data/seoWorkflowPhases';

const STORAGE_KEY = 'xtsy_seo_workflow_approvals_v1';

const toneStyles: Record<FindingTone, { icon: typeof Info; cls: string }> = {
  positive: { icon: CheckCircle2, cls: 'text-emerald-400' },
  warning: { icon: AlertTriangle, cls: 'text-amber-400' },
  critical: { icon: XCircle, cls: 'text-red-400' },
  neutral: { icon: Info, cls: 'text-sky-400' },
};

function loadApprovals(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as number[]) : [];
  } catch {
    return [];
  }
}

const AdminSEOWorkflow = () => {
  const navigate = useNavigate();
  const [approved, setApproved] = useState<number[]>([]);

  useEffect(() => { setApproved(loadApprovals()); }, []);

  const persist = useCallback((next: number[]) => {
    setApproved(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* ignore */ }
  }, []);

  const isApproved = (id: number) => approved.includes(id);
  // A phase is unlocked when all earlier phases are approved.
  const isUnlocked = (id: number) =>
    SEO_WORKFLOW_PHASES.filter(p => p.id < id).every(p => isApproved(p.id));

  const approve = (id: number) => {
    if (!isApproved(id)) persist([...approved, id].sort((a, b) => a - b));
  };
  const reopen = (id: number) => {
    // Reopening a phase also reopens everything after it.
    persist(approved.filter(pid => pid < id));
  };
  const reset = () => persist([]);

  const completed = approved.length;
  const total = SEO_WORKFLOW_PHASES.length;
  const activePhase = SEO_WORKFLOW_PHASES.find(p => !isApproved(p.id) && isUnlocked(p.id));

  return (
    <UnifiedAdminLayout>
      <div className="space-y-6">
        <AppleSectionHeader
          title="SEO Revenue Workflow"
          subtitle="Approval-gated · revenue pages prioritised · keyword-validated"
          action={
            <Button variant="outline" size="sm" onClick={reset} className="gap-2">
              <RotateCcw className="w-4 h-4" /> Reset
            </Button>
          }
        />

        {/* Progress bar */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-300">
              Phase {Math.min(completed + 1, total)} of {total}
              {activePhase ? ` · awaiting approval: ${activePhase.title}` : ' · all phases approved'}
            </span>
            <Badge variant="secondary" className="bg-primary/15 text-primary border-primary/20">
              {completed}/{total} approved
            </Badge>
          </div>
          <div className="h-2 rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-emerald-400 transition-all duration-500"
              style={{ width: `${(completed / total) * 100}%` }}
            />
          </div>
        </div>

        {/* Phases */}
        <div className="space-y-4">
          {SEO_WORKFLOW_PHASES.map((phase) => {
            const done = isApproved(phase.id);
            const unlocked = isUnlocked(phase.id);
            const active = !done && unlocked;
            const StatusIcon = done ? CheckCircle2 : unlocked ? CircleDot : Lock;

            return (
              <div
                key={phase.id}
                className={cn(
                  'rounded-2xl border p-5 transition-all duration-300',
                  done && 'border-emerald-500/30 bg-emerald-500/[0.04]',
                  active && 'border-primary/40 bg-primary/[0.05] shadow-lg shadow-primary/5',
                  !done && !unlocked && 'border-white/5 bg-white/[0.01] opacity-60',
                )}
              >
                {/* Header */}
                <div className="flex items-start gap-4">
                  <div className={cn(
                    'mt-0.5 w-9 h-9 rounded-xl flex items-center justify-center shrink-0',
                    done ? 'bg-emerald-500/15 text-emerald-400'
                      : active ? 'bg-primary/15 text-primary'
                      : 'bg-white/5 text-slate-500',
                  )}>
                    <StatusIcon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-white">
                        Phase {phase.id}: {phase.title}
                      </h3>
                      {done && <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/20">Approved</Badge>}
                      {active && <Badge className="bg-primary/15 text-primary border-primary/20">Awaiting approval</Badge>}
                      {!unlocked && !done && <Badge variant="secondary" className="bg-white/5 text-slate-500">Locked</Badge>}
                    </div>
                    <p className="text-sm text-slate-400 mt-1">{phase.objective}</p>
                  </div>
                </div>

                {/* Body — only render detail when unlocked */}
                {unlocked && (
                  <div className="mt-4 pl-0 sm:pl-13 space-y-4">
                    {/* Metrics */}
                    {phase.metrics.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {phase.metrics.map((m) => (
                          <div key={m.label} className="rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2">
                            <div className="text-xs text-slate-500">{m.label}</div>
                            <div className="text-base font-semibold text-white">{m.value}</div>
                            {m.sub && <div className="text-[10px] text-slate-500">{m.sub}</div>}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Findings */}
                    <div className="space-y-2">
                      {phase.findings.map((f, i) => {
                        const tone = toneStyles[f.tone ?? 'neutral'];
                        const Icon = tone.icon;
                        return (
                          <div key={i} className="flex gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3">
                            <Icon className={cn('w-4 h-4 mt-0.5 shrink-0', tone.cls)} />
                            <div>
                              <span className="text-sm font-medium text-white">{f.label}</span>
                              <span className="text-sm text-slate-400"> — {f.detail}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Deliverables */}
                    {phase.deliverables && (
                      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                        <div className="text-xs font-medium text-slate-300 mb-2 flex items-center gap-1.5">
                          <TrendingUp className="w-3.5 h-3.5 text-primary" /> Deliverables
                        </div>
                        <ul className="space-y-1">
                          {phase.deliverables.map((d, i) => (
                            <li key={i} className="text-sm text-slate-400 flex items-start gap-2">
                              <ChevronRight className="w-3.5 h-3.5 mt-0.5 text-slate-600 shrink-0" />{d}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-3 flex-wrap pt-1">
                      {phase.link && (
                        <Button variant="outline" size="sm" className="gap-2"
                          onClick={() => navigate(phase.link!.to)}>
                          {phase.link.label} <ArrowRight className="w-4 h-4" />
                        </Button>
                      )}
                      {!done ? (
                        <Button size="sm" className="gap-2" onClick={() => approve(phase.id)}>
                          <CheckCircle2 className="w-4 h-4" /> Approve & Continue
                        </Button>
                      ) : (
                        <Button variant="ghost" size="sm" className="gap-2 text-slate-400"
                          onClick={() => reopen(phase.id)}>
                          <RotateCcw className="w-4 h-4" /> Reopen
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </UnifiedAdminLayout>
  );
};

export default AdminSEOWorkflow;
