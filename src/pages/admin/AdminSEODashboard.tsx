/**
 * SEO Monitoring Dashboard — tracks health of all travel pages
 */
import { useState, useMemo } from 'react';
import { UnifiedAdminLayout } from '@/layouts/UnifiedAdminLayout';
import { AppleCard, AppleSectionHeader } from '@/components/admin/AppleCard';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, CheckCircle, AlertTriangle, XCircle, ExternalLink } from 'lucide-react';
import { ALL_SEO_PAGES, type SEOPageData, type SEOPageCategory } from '@/data/seoPages';
import GSCRecoveryPanel from '@/components/admin/seo/GSCRecoveryPanel';

const CATEGORY_LABELS: Record<string, string> = {
  'hostels': 'Hostel',
  'hotels': 'Hotel',
  'homestays': 'Homestay',
  'glamping': 'Glamping',
  'accommodation': 'Accommodation',
  'rentals': 'Rentals',
  'tours': 'Tours',
  'travel-guides': 'Travel Guide',
  'destinations': 'Destination',
  'attractions': 'Attraction',
  'itineraries': 'Itinerary',
  'activities': 'Activity',
  'hospitals': 'Hospital',
  'restaurants': 'Restaurant',
  'weddings': 'Wedding',
  'transport': 'Transport',
  'competitor-capture': 'Competitor',
  'food-dining': 'Dining',
  'seasonal': 'Seasonal',
  'events': 'Event',
  'travel-agency': 'Agency',
};

function auditPage(page: SEOPageData) {
  const issues: string[] = [];
  if (page.title.length > 60) issues.push('Title > 60 chars');
  if (page.title.length < 30) issues.push('Title < 30 chars');
  if (page.metaDescription.length > 160) issues.push('Meta desc > 160 chars');
  if (page.metaDescription.length < 80) issues.push('Meta desc < 80 chars');
  if (!page.keywords?.length) issues.push('No keywords');
  if (page.sections.length < 2) issues.push('Too few sections');
  if (page.faqs.length === 0) issues.push('No FAQs');
  if (page.relatedSlugs.length < 2) issues.push('Weak internal links');
  return issues;
}

const AdminSEODashboard = () => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const rows = useMemo(() => {
    return ALL_SEO_PAGES.map(page => {
      const issues = auditPage(page);
      const status = issues.length === 0 ? 'healthy' : issues.length <= 2 ? 'warning' : 'critical';
      const isDestination = page.category === 'destinations' || page.category === 'attractions';
      const url = isDestination ? `/places-to-visit/${page.slug}` : `/${page.slug}`;
      return { page, issues, status, url };
    });
  }, []);

  const filtered = useMemo(() => {
    return rows.filter(r => {
      if (categoryFilter !== 'all' && r.page.category !== categoryFilter) return false;
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return r.page.slug.includes(q) || r.page.title.toLowerCase().includes(q) || r.page.keywords.some(k => k.includes(q));
      }
      return true;
    });
  }, [rows, search, categoryFilter, statusFilter]);

  const stats = useMemo(() => ({
    total: rows.length,
    healthy: rows.filter(r => r.status === 'healthy').length,
    warning: rows.filter(r => r.status === 'warning').length,
    critical: rows.filter(r => r.status === 'critical').length,
  }), [rows]);

  const categories = useMemo(() => {
    const cats = new Set(ALL_SEO_PAGES.map(p => p.category));
    return Array.from(cats).sort();
  }, []);

  return (
    <UnifiedAdminLayout>
      <div className="space-y-6 p-4 md:p-6">
        <AppleSectionHeader
          title="SEO Health Dashboard"
          subtitle={`Monitoring ${stats.total} pages across ${categories.length} categories`}
        />

        {/* GSC Recovery Panel — Apr 2026 fix for "Discovered – not indexed" */}
        <div className="flex flex-wrap justify-end gap-4">
          <a href="/admin/seo/recovery" className="text-sm text-primary hover:underline">
            → Coverage Recovery & Redirect Manager
          </a>
          <a href="/admin/seo/gsc-errors" className="text-sm text-primary hover:underline">
            → Search Console crawl/indexing errors
          </a>
        </div>
        <GSCRecoveryPanel />

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <AppleCard className="p-4 text-center">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-xs text-muted-foreground">Total Pages</div>
          </AppleCard>
          <AppleCard className="p-4 text-center">
            <div className="text-2xl font-bold text-green-500">{stats.healthy}</div>
            <div className="text-xs text-muted-foreground">Healthy</div>
          </AppleCard>
          <AppleCard className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-500">{stats.warning}</div>
            <div className="text-xs text-muted-foreground">Warnings</div>
          </AppleCard>
          <AppleCard className="p-4 text-center">
            <div className="text-2xl font-bold text-red-500">{stats.critical}</div>
            <div className="text-xs text-muted-foreground">Critical</div>
          </AppleCard>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by slug, title, or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(c => (
                <SelectItem key={c} value={c}>{CATEGORY_LABELS[c] || c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="healthy">Healthy</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <AppleCard className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                <th className="text-left p-3 font-medium text-muted-foreground">URL</th>
                <th className="text-left p-3 font-medium text-muted-foreground hidden md:table-cell">Type</th>
                <th className="text-left p-3 font-medium text-muted-foreground hidden lg:table-cell">Primary Keyword</th>
                <th className="text-left p-3 font-medium text-muted-foreground hidden lg:table-cell">Title</th>
                <th className="text-left p-3 font-medium text-muted-foreground hidden xl:table-cell">Meta Desc</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Issues</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.page.slug} className="border-b border-border/20 hover:bg-muted/30 transition-colors">
                  <td className="p-3">
                    {row.status === 'healthy' && <CheckCircle className="h-4 w-4 text-green-500" />}
                    {row.status === 'warning' && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                    {row.status === 'critical' && <XCircle className="h-4 w-4 text-red-500" />}
                  </td>
                  <td className="p-3">
                    <a 
                      href={row.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-1 max-w-[200px] truncate"
                    >
                      {row.url}
                      <ExternalLink className="h-3 w-3 shrink-0" />
                    </a>
                  </td>
                  <td className="p-3 hidden md:table-cell">
                    <Badge variant="outline" className="text-xs">
                      {CATEGORY_LABELS[row.page.category] || row.page.category}
                    </Badge>
                  </td>
                  <td className="p-3 hidden lg:table-cell text-muted-foreground text-xs max-w-[150px] truncate">
                    {row.page.keywords[0] || '—'}
                  </td>
                  <td className="p-3 hidden lg:table-cell max-w-[200px] truncate">
                    <span className={row.page.title.length > 60 ? 'text-red-400' : ''}>
                      {row.page.title} <span className="text-muted-foreground text-xs">({row.page.title.length})</span>
                    </span>
                  </td>
                  <td className="p-3 hidden xl:table-cell max-w-[200px] truncate">
                    <span className={row.page.metaDescription.length > 160 ? 'text-red-400' : ''}>
                      {row.page.metaDescription.length} chars
                    </span>
                  </td>
                  <td className="p-3">
                    {row.issues.length === 0 ? (
                      <span className="text-green-500 text-xs">All good</span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {row.issues.map((issue, i) => (
                          <Badge key={i} variant="destructive" className="text-[10px] px-1.5 py-0">
                            {issue}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">No pages match your filters</div>
          )}
        </AppleCard>
      </div>
    </UnifiedAdminLayout>
  );
};

export default AdminSEODashboard;
