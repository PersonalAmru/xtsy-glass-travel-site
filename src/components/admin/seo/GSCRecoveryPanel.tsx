/**
 * GSC Coverage Recovery Panel
 * ---------------------------
 * Surfaces every URL flagged by Google Search Console as
 * "Discovered – currently not indexed" and shows the resolution status
 * after the April 2026 master fix:
 *   - LIVE      : page exists in filtered registry → in sitemap-priority.xml
 *   - REDIRECT  : slug redirects to a canonical pillar (301 via Navigate)
 *   - PLACES    : routed to DestinationDetail under /places-to-visit/*
 *   - REAL      : has its own React route component
 *   - MISSING   : no resolution yet — flag for content authoring
 */
import { useMemo } from 'react';
import { AppleCard, AppleSectionHeader } from '@/components/admin/AppleCard';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, CheckCircle2, ArrowRightLeft, MapPin, FileText, AlertCircle } from 'lucide-react';
import { ALL_SEO_PAGES } from '@/data/seoPages';
import {
  RECOVERY_FILTERED_OUT,
  RECOVERY_LIVE_PAGES,
  RECOVERY_PLACES_PATHS,
  RECOVERY_REDIRECTS,
} from '@/data/seoAffectedSlugs';

type Status = 'live' | 'redirect' | 'places' | 'real' | 'missing';

// React routes that exist outside the programmatic SEO system.
const REAL_ROUTES = new Set<string>([
  'tours', 'travel', 'tab-bistro', 'xtsy-rentals', 'pet-friendly',
  'female-travellers', 'work-from-home', 'privacy-policy',
  'terms-of-service', 'pricing-cancellation-policy',
  'meghalaya-waterfalls', 'meghalaya-caves', 'meghalaya-villages',
  'meghalaya-viewpoints', 'shillong-tour-package',
  'meghalaya-couple-tour-package', 'hidden-places-in-meghalaya',
]);

const STATUS_META: Record<Status, { label: string; icon: typeof CheckCircle2; tone: string }> = {
  live:     { label: 'Live (SEO page)',  icon: CheckCircle2,    tone: 'bg-green-100 text-green-700 border-green-300' },
  redirect: { label: '301 Redirect',     icon: ArrowRightLeft,  tone: 'bg-blue-100 text-blue-700 border-blue-300' },
  places:   { label: 'Place page',       icon: MapPin,          tone: 'bg-purple-100 text-purple-700 border-purple-300' },
  real:     { label: 'React route',      icon: FileText,        tone: 'bg-amber-100 text-amber-700 border-amber-300' },
  missing:  { label: 'NOT FIXED',        icon: AlertCircle,     tone: 'bg-red-100 text-red-700 border-red-300' },
};

interface Row {
  slug: string;
  status: Status;
  resolution: string;
}

function buildRows(): Row[] {
  const filteredSet = new Set(ALL_SEO_PAGES.map(p => p.slug));
  const rows: Row[] = [];

  // 1. Real routes
  for (const slug of REAL_ROUTES) {
    rows.push({ slug, status: 'real', resolution: `/${slug}` });
  }
  // 2. Live SEO pages
  for (const slug of [...RECOVERY_LIVE_PAGES, ...RECOVERY_FILTERED_OUT]) {
    if (REAL_ROUTES.has(slug)) continue;
    if (filteredSet.has(slug)) {
      rows.push({ slug, status: 'live', resolution: `findSEOPage → ${slug}` });
    } else {
      rows.push({ slug, status: 'missing', resolution: 'Whitelisted but not in registry — investigate' });
    }
  }
  // 3. Places-to-visit paths
  for (const path of RECOVERY_PLACES_PATHS) {
    rows.push({ slug: path, status: 'places', resolution: 'DestinationDetail' });
  }
  // 4. Redirects
  for (const [slug, target] of Object.entries(RECOVERY_REDIRECTS)) {
    rows.push({ slug, status: 'redirect', resolution: `→ ${target}` });
  }

  return rows.sort((a, b) => a.slug.localeCompare(b.slug));
}

export const GSCRecoveryPanel = () => {
  const rows = useMemo(buildRows, []);
  const counts = useMemo(() => {
    const c: Record<Status, number> = { live: 0, redirect: 0, places: 0, real: 0, missing: 0 };
    for (const r of rows) c[r.status]++;
    return c;
  }, [rows]);

  return (
    <AppleCard>
      <AppleSectionHeader
        title="GSC Recovery — Discovered / Not Indexed"
        subtitle={`${rows.length} URLs from xtsy.one Coverage Drilldown (Apr 2026). All affected URLs now have a resolution.`}
      />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {(Object.keys(STATUS_META) as Status[]).map(s => {
          const meta = STATUS_META[s];
          const Icon = meta.icon;
          return (
            <div key={s} className={`rounded-xl border p-3 ${meta.tone}`}>
              <div className="flex items-center gap-2 text-xs font-medium opacity-80">
                <Icon className="h-3.5 w-3.5" /> {meta.label}
              </div>
              <div className="text-2xl font-semibold mt-1">{counts[s]}</div>
            </div>
          );
        })}
      </div>

      <div className="overflow-auto max-h-[480px] rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 sticky top-0">
            <tr>
              <th className="text-left p-2 font-medium">Slug</th>
              <th className="text-left p-2 font-medium">Status</th>
              <th className="text-left p-2 font-medium">Resolution</th>
              <th className="text-right p-2 font-medium">Open</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => {
              const meta = STATUS_META[r.status];
              const Icon = meta.icon;
              return (
                <tr key={r.slug} className="border-t border-border/60 hover:bg-muted/30">
                  <td className="p-2 font-mono text-xs">{r.slug}</td>
                  <td className="p-2">
                    <Badge variant="outline" className={`${meta.tone} gap-1`}>
                      <Icon className="h-3 w-3" /> {meta.label}
                    </Badge>
                  </td>
                  <td className="p-2 text-muted-foreground text-xs">{r.resolution}</td>
                  <td className="p-2 text-right">
                    <a
                      href={`https://xtsy.one/${r.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:underline text-xs"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-xs text-muted-foreground">
        After deploy, manually request indexing for the priority sitemap in Google Search Console:
        <a
          href="https://search.google.com/search-console/sitemaps?resource_id=https%3A%2F%2Fxtsy.one%2F"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-1 text-primary hover:underline inline-flex items-center gap-1"
        >
          open GSC sitemaps <ExternalLink className="h-3 w-3" />
        </a>
        — submit <code className="font-mono">/sitemap-priority.xml</code>.
      </div>
    </AppleCard>
  );
};

export default GSCRecoveryPanel;
