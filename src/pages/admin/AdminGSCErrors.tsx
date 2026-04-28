/**
 * Admin · Search Console — Crawl & Indexing Errors
 *
 * Lets the operator paste or upload an export from Google Search Console
 * (Coverage / Indexing → Pages → Export → CSV) and instantly see:
 *   - Every reported error/warning + status (Excluded, Crawled-not-indexed, etc.)
 *   - Which internal route each affected URL maps to (so you can fix the source)
 *   - Whether that URL is in our prerender registry, sitemap, or RECOVERY_REDIRECTS
 *   - One-click "Open URL" + "Copy as bulk re-indexing list"
 *
 * Why client-side import (no GSC API)?
 *   The Search Console API requires OAuth scopes the project can't store
 *   securely yet. CSV import gives 100% coverage today; a future GCP service
 *   account can populate the same `gsc_issues` table later without changing
 *   this UI.
 *
 * Persists the last import in localStorage so reloads don't lose context.
 */
import { useEffect, useMemo, useState } from 'react';
import { UnifiedAdminLayout } from '@/layouts/UnifiedAdminLayout';
import { AppleCard, AppleSectionHeader } from '@/components/admin/AppleCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  Upload, AlertTriangle, AlertCircle, CheckCircle2, ExternalLink,
  Copy, Trash2, Search as SearchIcon, FileWarning, Link as LinkIcon, RefreshCw,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ALL_RESOLVABLE_SLUGS } from '@/utils/seoSlugRegistry';
import { RECOVERY_REDIRECTS } from '@/data/seoAffectedSlugs';
import { GONE_SLUGS } from '@/data/seoGoneSlugs';

const STORAGE_KEY = 'xtsy_gsc_issues_v1';
const SITE = 'https://xtsy.one';

interface GSCIssue {
  url: string;
  status: string;       // e.g. "Crawled - currently not indexed"
  type: 'error' | 'warning' | 'excluded' | 'valid';
  lastCrawled?: string;
  source: 'csv' | 'paste' | 'manual';
}

interface MappedIssue extends GSCIssue {
  route: string;            // pathname
  isInRegistry: boolean;
  hasRedirect: boolean;
  redirectTarget?: string;
  isGone: boolean;
  matchedFile: 'static' | 'programmatic' | 'destination' | 'tour' | 'unknown';
}

const TYPE_FROM_STATUS = (s: string): GSCIssue['type'] => {
  const x = s.toLowerCase();
  if (/error|server|404|not found|soft 404|redirect error|blocked/.test(x)) return 'error';
  if (/excluded|noindex|duplicate|alternate|crawled.*not indexed|discovered.*not indexed/.test(x)) return 'excluded';
  if (/warning|indexed.*blocked/.test(x)) return 'warning';
  return 'valid';
};

const TYPE_BADGE: Record<GSCIssue['type'], { label: string; cls: string; icon: any }> = {
  error: { label: 'Error', cls: 'bg-red-500/10 text-red-400 border-red-500/30', icon: AlertCircle },
  warning: { label: 'Warning', cls: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30', icon: AlertTriangle },
  excluded: { label: 'Excluded', cls: 'bg-orange-500/10 text-orange-400 border-orange-500/30', icon: FileWarning },
  valid: { label: 'Valid', cls: 'bg-green-500/10 text-green-400 border-green-500/30', icon: CheckCircle2 },
};

function parseCSV(text: string): GSCIssue[] {
  // GSC export columns vary; handle: URL, Last crawled, Status / Coverage / Indexing
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const header = lines[0].split(',').map(h => h.replace(/^"|"$/g, '').toLowerCase().trim());
  const urlIdx = header.findIndex(h => /^url|address|page$/.test(h));
  const statusIdx = header.findIndex(h => /status|coverage|indexing|reason/.test(h));
  const dateIdx = header.findIndex(h => /crawl|last/.test(h));
  if (urlIdx === -1) return [];

  const rows: GSCIssue[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g)?.map(c => c.replace(/^"|"$/g, '').trim()) || [];
    const url = cols[urlIdx];
    if (!url || !/^https?:/i.test(url)) continue;
    const status = (statusIdx >= 0 ? cols[statusIdx] : 'Unknown') || 'Unknown';
    rows.push({
      url,
      status,
      type: TYPE_FROM_STATUS(status),
      lastCrawled: dateIdx >= 0 ? cols[dateIdx] : undefined,
      source: 'csv',
    });
  }
  return rows;
}

function parseManual(text: string): GSCIssue[] {
  // Tab/space separated: URL <tab> Status (status optional)
  return text.trim().split(/\r?\n/).flatMap(line => {
    const m = line.trim().match(/^(\S+)\s*(.*)$/);
    if (!m) return [];
    const url = m[1];
    if (!/^https?:/i.test(url)) return [];
    const status = m[2] || 'Manually added';
    return [{ url, status, type: TYPE_FROM_STATUS(status), source: 'paste' as const }];
  });
}

function mapToInternal(issues: GSCIssue[]): MappedIssue[] {
  const registrySet = new Set(ALL_RESOLVABLE_SLUGS.map(s => s.replace(/^\/|\/$/g, '')));
  return issues.map(i => {
    let route = '/';
    try { route = new URL(i.url).pathname || '/'; } catch { route = i.url; }
    const slug = route.replace(/^\/|\/$/g, '');
    const redirectTarget = (RECOVERY_REDIRECTS as Record<string, string>)[slug];
    const isGone = GONE_SLUGS.has(slug);
    const isInRegistry = registrySet.has(slug) || slug === '';
    let matchedFile: MappedIssue['matchedFile'] = 'unknown';
    if (isInRegistry) {
      if (route.startsWith('/places-to-visit/')) matchedFile = 'destination';
      else if (route.startsWith('/tours/')) matchedFile = 'tour';
      else if (slug.includes('-')) matchedFile = 'programmatic';
      else matchedFile = 'static';
    }
    return { ...i, route, isInRegistry, hasRedirect: !!redirectTarget, redirectTarget, isGone, matchedFile };
  });
}

const AdminGSCErrors = () => {
  const { toast } = useToast();
  const [issues, setIssues] = useState<GSCIssue[]>([]);
  const [filter, setFilter] = useState('');
  const [tab, setTab] = useState<'all' | 'error' | 'warning' | 'excluded' | 'orphan'>('all');
  const [pasteText, setPasteText] = useState('');
  const [importedAt, setImportedAt] = useState<string | null>(null);

  // Load cached
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const j = JSON.parse(raw);
        setIssues(j.issues || []);
        setImportedAt(j.importedAt || null);
      }
    } catch {/* ignore */}
  }, []);

  const persist = (next: GSCIssue[]) => {
    const at = new Date().toISOString();
    setIssues(next);
    setImportedAt(at);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ issues: next, importedAt: at })); } catch {/* ignore */}
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const text = await f.text();
    const parsed = parseCSV(text);
    if (!parsed.length) {
      toast({ title: 'No rows parsed', description: 'Expected GSC CSV with URL + Status columns.', variant: 'destructive' });
      return;
    }
    persist(parsed);
    toast({ title: `Imported ${parsed.length} URLs`, description: 'Mapped against internal route registry.' });
  };

  const handlePaste = () => {
    const parsed = parseManual(pasteText);
    if (!parsed.length) {
      toast({ title: 'Nothing to import', description: 'Paste one URL per line (optionally followed by status).', variant: 'destructive' });
      return;
    }
    persist(parsed);
    setPasteText('');
    toast({ title: `Imported ${parsed.length} URLs` });
  };

  const mapped = useMemo(() => mapToInternal(issues), [issues]);

  const filtered = useMemo(() => {
    let list = mapped;
    if (tab === 'orphan') list = list.filter(m => !m.isInRegistry && !m.hasRedirect && !m.isGone);
    else if (tab !== 'all') list = list.filter(m => m.type === tab);
    if (filter.trim()) {
      const q = filter.toLowerCase();
      list = list.filter(m => m.url.toLowerCase().includes(q) || m.status.toLowerCase().includes(q) || m.route.toLowerCase().includes(q));
    }
    return list;
  }, [mapped, tab, filter]);

  const counts = useMemo(() => ({
    total: mapped.length,
    error: mapped.filter(m => m.type === 'error').length,
    warning: mapped.filter(m => m.type === 'warning').length,
    excluded: mapped.filter(m => m.type === 'excluded').length,
    orphan: mapped.filter(m => !m.isInRegistry && !m.hasRedirect && !m.isGone).length,
    redirected: mapped.filter(m => m.hasRedirect).length,
  }), [mapped]);

  const copyReindexList = () => {
    const fixable = mapped.filter(m => m.isInRegistry || m.hasRedirect).map(m => SITE + m.route).join('\n');
    navigator.clipboard.writeText(fixable);
    toast({ title: 'Copied', description: `${fixable.split('\n').length} URLs ready for GSC URL Inspection.` });
  };

  const clearAll = () => {
    if (!confirm('Clear all imported issues?')) return;
    localStorage.removeItem(STORAGE_KEY);
    setIssues([]);
    setImportedAt(null);
  };

  return (
    <UnifiedAdminLayout>
      <div className="space-y-6">
        <AppleSectionHeader
          title="Search Console · Crawl & Indexing Errors"
          subtitle={importedAt ? `Last import: ${new Date(importedAt).toLocaleString()}` : 'Import a CSV from GSC → Indexing → Pages → Export'}
        />

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {[
            { label: 'Total URLs', value: counts.total, cls: '' },
            { label: 'Errors', value: counts.error, cls: 'text-red-400' },
            { label: 'Warnings', value: counts.warning, cls: 'text-yellow-400' },
            { label: 'Excluded', value: counts.excluded, cls: 'text-orange-400' },
            { label: 'Orphan (no route)', value: counts.orphan, cls: 'text-rose-400' },
            { label: 'Has redirect', value: counts.redirected, cls: 'text-emerald-400' },
          ].map(k => (
            <AppleCard key={k.label} className="p-4">
              <p className="text-xs text-muted-foreground">{k.label}</p>
              <p className={`text-2xl font-semibold mt-1 ${k.cls}`}>{k.value}</p>
            </AppleCard>
          ))}
        </div>

        {/* Import */}
        <AppleCard className="p-5">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[260px]">
              <label className="text-sm font-medium block mb-2">Upload GSC CSV export</label>
              <Input type="file" accept=".csv,text/csv" onChange={handleFile} />
              <p className="text-xs text-muted-foreground mt-1">
                Search Console → <strong>Indexing → Pages</strong> → click any status → <strong>Export → CSV</strong>.
              </p>
            </div>
            <div className="flex-1 min-w-[260px]">
              <label className="text-sm font-medium block mb-2">Or paste URLs (one per line)</label>
              <Textarea rows={3} value={pasteText} onChange={e => setPasteText(e.target.value)} placeholder="https://xtsy.one/old-page    Crawled - currently not indexed" />
              <Button size="sm" className="mt-2" onClick={handlePaste}>Import pasted URLs</Button>
            </div>
            <div className="flex flex-col gap-2">
              <Button variant="outline" onClick={copyReindexList} disabled={!mapped.length}>
                <Copy className="w-4 h-4 mr-2" /> Copy re-indexing list
              </Button>
              <Button variant="ghost" onClick={clearAll} disabled={!mapped.length}>
                <Trash2 className="w-4 h-4 mr-2" /> Clear
              </Button>
            </div>
          </div>
        </AppleCard>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          <Tabs value={tab} onValueChange={v => setTab(v as any)}>
            <TabsList>
              <TabsTrigger value="all">All ({counts.total})</TabsTrigger>
              <TabsTrigger value="error">Errors ({counts.error})</TabsTrigger>
              <TabsTrigger value="warning">Warnings ({counts.warning})</TabsTrigger>
              <TabsTrigger value="excluded">Excluded ({counts.excluded})</TabsTrigger>
              <TabsTrigger value="orphan">Orphans ({counts.orphan})</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="relative flex-1 min-w-[220px]">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={filter} onChange={e => setFilter(e.target.value)} placeholder="Filter URL, route, or status" className="pl-9" />
          </div>
        </div>

        {/* Table */}
        <AppleCard className="p-0 overflow-hidden">
          {!filtered.length ? (
            <div className="p-12 text-center text-muted-foreground">
              {mapped.length ? 'No issues match the current filter.' : 'Import a GSC export to see crawl & indexing errors here.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="text-left px-4 py-3">Type</th>
                    <th className="text-left px-4 py-3">URL</th>
                    <th className="text-left px-4 py-3">Status</th>
                    <th className="text-left px-4 py-3">Internal route</th>
                    <th className="text-left px-4 py-3">Resolution</th>
                    <th className="text-right px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.slice(0, 500).map((m, i) => {
                    const t = TYPE_BADGE[m.type];
                    const Icon = t.icon;
                    return (
                      <tr key={i} className="border-t border-border hover:bg-muted/20">
                        <td className="px-4 py-2"><Badge variant="outline" className={t.cls}><Icon className="w-3 h-3 mr-1" />{t.label}</Badge></td>
                        <td className="px-4 py-2 font-mono text-xs max-w-[280px] truncate">{m.url}</td>
                        <td className="px-4 py-2 text-xs">{m.status}</td>
                        <td className="px-4 py-2 text-xs">
                          <code className="text-primary">{m.route}</code>
                          {m.matchedFile !== 'unknown' && <span className="ml-2 text-muted-foreground">({m.matchedFile})</span>}
                        </td>
                        <td className="px-4 py-2 text-xs">
                          {m.isGone ? <Badge variant="outline" className="bg-slate-500/10 text-slate-300 border-slate-500/30">410 Gone</Badge> :
                           m.hasRedirect ? <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">→ /{m.redirectTarget}</Badge> :
                           m.isInRegistry ? <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30">In registry</Badge> :
                           <Badge variant="outline" className="bg-rose-500/10 text-rose-400 border-rose-500/30">No route — fix or 410</Badge>}
                        </td>
                        <td className="px-4 py-2 text-right">
                          <Button asChild variant="ghost" size="sm">
                            <a href={m.url} target="_blank" rel="noopener noreferrer"><ExternalLink className="w-3 h-3" /></a>
                          </Button>
                          {m.isInRegistry && (
                            <Button asChild variant="ghost" size="sm">
                              <a href={m.route} target="_blank" rel="noopener noreferrer"><LinkIcon className="w-3 h-3" /></a>
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filtered.length > 500 && (
                <div className="p-3 text-xs text-center text-muted-foreground border-t">
                  Showing first 500 of {filtered.length} matches — refine filter to see more.
                </div>
              )}
            </div>
          )}
        </AppleCard>

        <AppleCard className="p-4 text-xs text-muted-foreground">
          <p>
            <strong className="text-foreground">How resolution is decided:</strong> URL is mapped to an internal route, then checked against
            our slug registry, <code>RECOVERY_REDIRECTS</code> table, and <code>GONE_SLUGS</code>. Use{' '}
            <strong>Copy re-indexing list</strong> to feed fixed URLs back into Search Console's URL Inspection tool for fresh crawls.
          </p>
        </AppleCard>
      </div>
    </UnifiedAdminLayout>
  );
};

export default AdminGSCErrors;
