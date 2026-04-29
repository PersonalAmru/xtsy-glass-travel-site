/**
 * AdminSchemaResults — displays the latest post-deploy schema validation
 * results produced by `scripts/postDeploySchemaCheck.ts`.
 *
 * Data source priority:
 *   1. /seo-reports/post-deploy-schema.json (copied from dist/ at build time)
 *   2. Manual paste / file upload (offline review of CI artifact)
 *
 * Per-route rows show: HTTP status, JSON-LD count, FAQ question count,
 * meta tag completeness, and full error/warning lists.
 */
import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertCircle, CheckCircle2, Clock, FileJson, RefreshCw, Upload } from "lucide-react";

interface RouteResult {
  route: string;
  status: number;
  hasJsonLd: boolean;
  jsonLdCount: number;
  hasFAQ: boolean;
  faqQuestions: number;
  hasTitle: boolean;
  hasDescription: boolean;
  hasCanonical: boolean;
  hasH1: boolean;
  errors: string[];
  warnings: string[];
}

interface Report {
  generatedAt?: string;
  baseUrl?: string;
  summary?: {
    total: number;
    passed: number;
    failed: number;
    warnings: number;
  };
  results?: RouteResult[];
}

const REPORT_PATHS = [
  "/seo-reports/post-deploy-schema.json",
  "/dist/seo-reports/post-deploy-schema.json",
];

const AdminSchemaResults = () => {
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "errors" | "warnings" | "ok">("all");

  const load = async () => {
    setLoading(true);
    setError(null);
    for (const url of REPORT_PATHS) {
      try {
        const res = await fetch(`${url}?t=${Date.now()}`, { cache: "no-store" });
        if (res.ok) {
          const json = (await res.json()) as Report;
          setReport(json);
          setLoading(false);
          return;
        }
      } catch {/* try next */}
    }
    setError(
      "No report found. Run `npm run seo:postdeploy:live` and copy `dist/seo-reports/post-deploy-schema.json` to `public/seo-reports/`, or upload below."
    );
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const onUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try { setReport(JSON.parse(String(reader.result))); setError(null); }
      catch (e: any) { setError(`Invalid JSON: ${e.message}`); }
    };
    reader.readAsText(file);
  };

  const rows = useMemo(() => {
    const all = report?.results ?? [];
    return all.filter(r => {
      if (filter && !r.route.toLowerCase().includes(filter.toLowerCase())) return false;
      if (statusFilter === "errors") return r.errors.length > 0;
      if (statusFilter === "warnings") return r.warnings.length > 0 && r.errors.length === 0;
      if (statusFilter === "ok") return r.errors.length === 0 && r.warnings.length === 0;
      return true;
    });
  }, [report, filter, statusFilter]);

  const summary = report?.summary;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Helmet><title>Schema Validation Results | Admin</title></Helmet>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <FileJson className="h-6 w-6" /> Schema Validation Results
          </h1>
          <p className="text-sm text-muted-foreground">
            Latest post-deploy JSON-LD &amp; FAQPage validation
            {report?.generatedAt && (
              <> · <Clock className="inline h-3 w-3" /> {new Date(report.generatedAt).toLocaleString()}</>
            )}
            {report?.baseUrl && <> · {report.baseUrl}</>}
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={load} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" /> Reload
          </Button>
          <label className="inline-flex">
            <input type="file" accept="application/json" className="hidden"
              onChange={e => e.target.files?.[0] && onUpload(e.target.files[0])} />
            <Button asChild variant="outline" size="sm">
              <span><Upload className="mr-2 h-4 w-4" /> Upload report</span>
            </Button>
          </label>
        </div>
      </div>

      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <SummaryCard label="Total routes" value={summary.total} />
          <SummaryCard label="Passed" value={summary.passed} tone="ok" />
          <SummaryCard label="Failed" value={summary.failed} tone="error" />
          <SummaryCard label="Warnings" value={summary.warnings} tone="warn" />
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filters</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Input placeholder="Filter by route…" value={filter} onChange={e => setFilter(e.target.value)} className="max-w-xs" />
          <div className="flex gap-1">
            {(["all", "errors", "warnings", "ok"] as const).map(s => (
              <Button key={s} size="sm" variant={statusFilter === s ? "default" : "outline"} onClick={() => setStatusFilter(s)}>
                {s}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {loading && <p className="text-sm text-muted-foreground">Loading report…</p>}
      {error && (
        <Card className="border-destructive/50">
          <CardContent className="pt-6">
            <p className="flex items-start gap-2 text-sm"><AlertCircle className="h-4 w-4 mt-0.5 text-destructive" /> {error}</p>
          </CardContent>
        </Card>
      )}

      {rows.length > 0 && (
        <Card>
          <CardContent className="pt-6 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Route</TableHead>
                  <TableHead>HTTP</TableHead>
                  <TableHead className="text-center">JSON-LD</TableHead>
                  <TableHead className="text-center">FAQ</TableHead>
                  <TableHead className="text-center">Meta</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map(r => {
                  const metaOk = r.hasTitle && r.hasDescription && r.hasCanonical && r.hasH1;
                  const ok = r.errors.length === 0 && r.warnings.length === 0;
                  return (
                    <>
                      <TableRow key={r.route}>
                        <TableCell className="font-mono text-xs">
                          <a href={r.route} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{r.route}</a>
                        </TableCell>
                        <TableCell>
                          <Badge variant={r.status >= 200 && r.status < 400 ? "secondary" : "destructive"}>{r.status}</Badge>
                        </TableCell>
                        <TableCell className="text-center">{r.jsonLdCount}</TableCell>
                        <TableCell className="text-center">
                          {r.hasFAQ ? <Badge variant="secondary">{r.faqQuestions} Q</Badge> : <span className="text-muted-foreground text-xs">—</span>}
                        </TableCell>
                        <TableCell className="text-center text-xs">
                          <span className={r.hasTitle ? "text-emerald-600" : "text-destructive"}>T</span>{" "}
                          <span className={r.hasDescription ? "text-emerald-600" : "text-destructive"}>D</span>{" "}
                          <span className={r.hasCanonical ? "text-emerald-600" : "text-destructive"}>C</span>{" "}
                          <span className={r.hasH1 ? "text-emerald-600" : "text-destructive"}>H1</span>
                        </TableCell>
                        <TableCell>
                          {r.errors.length > 0 ? <Badge variant="destructive">{r.errors.length} error{r.errors.length > 1 ? "s" : ""}</Badge>
                            : r.warnings.length > 0 ? <Badge>{r.warnings.length} warn</Badge>
                            : ok ? <Badge variant="secondary"><CheckCircle2 className="h-3 w-3 mr-1" /> OK</Badge> : null}
                        </TableCell>
                      </TableRow>
                      {(r.errors.length > 0 || r.warnings.length > 0) && (
                        <TableRow className="bg-muted/30">
                          <TableCell colSpan={6} className="text-xs">
                            {r.errors.map((e, i) => <div key={`e${i}`} className="text-destructive">• {e}</div>)}
                            {r.warnings.map((w, i) => <div key={`w${i}`} className="text-amber-600">⚠ {w}</div>)}
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const SummaryCard = ({ label, value, tone }: { label: string; value: number; tone?: "ok" | "error" | "warn" }) => {
  const color = tone === "ok" ? "text-emerald-600" : tone === "error" ? "text-destructive" : tone === "warn" ? "text-amber-600" : "text-foreground";
  return (
    <Card>
      <CardContent className="pt-6">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className={`text-3xl font-semibold ${color}`}>{value}</p>
      </CardContent>
    </Card>
  );
};

export default AdminSchemaResults;
