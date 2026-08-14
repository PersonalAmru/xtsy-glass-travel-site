/**
 * AdminTourPricing — admin-editable pricing table for tour packages.
 *
 * Scope: public.tour_pricing ONLY. This screen never reads or writes room
 * inventory, room types, or room rate tables — tour pricing is a completely
 * separate source of truth.
 */

import { useEffect, useMemo, useState } from "react";
import { UnifiedAdminLayout } from "@/layouts/UnifiedAdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Save, RefreshCw, Search, TrendingDown, TrendingUp } from "lucide-react";

interface PriceRow {
  id: string;
  slug: string;
  title: string;
  region: string | null;
  duration: string | null;
  price_per_person: number;
  compare_at_price: number | null;
  competitor_name: string | null;
  competitor_price: number | null;
  min_group: number | null;
  sort_order: number;
  is_active: boolean;
  notes: string | null;
}

const inr = (n: number | null | undefined) =>
  n == null ? "—" : `₹${Number(n).toLocaleString("en-IN")}`;

const AdminTourPricing = () => {
  const [rows, setRows] = useState<PriceRow[]>([]);
  const [draft, setDraft] = useState<Record<string, Partial<PriceRow>>>({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("tour_pricing" as never)
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) {
      toast({ title: "Could not load tour pricing", description: error.message, variant: "destructive" });
    } else {
      setRows((data ?? []) as unknown as PriceRow[]);
      setDraft({});
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const edit = (id: string, patch: Partial<PriceRow>) =>
    setDraft((d) => ({ ...d, [id]: { ...d[id], ...patch } }));

  const save = async (row: PriceRow) => {
    const patch = draft[row.id];
    if (!patch) return;
    setSavingId(row.id);
    const { error } = await supabase
      .from("tour_pricing" as never)
      .update(patch as never)
      .eq("id", row.id);
    setSavingId(null);
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Price updated", description: `${row.title} saved.` });
    setRows((rs) => rs.map((r) => (r.id === row.id ? { ...r, ...patch } : r)));
    setDraft((d) => {
      const next = { ...d };
      delete next[row.id];
      return next;
    });
  };

  const filtered = useMemo(
    () =>
      rows.filter((r) =>
        `${r.title} ${r.slug} ${r.region ?? ""}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [rows, query],
  );

  const value = (row: PriceRow, key: keyof PriceRow) =>
    (draft[row.id]?.[key] ?? row[key] ?? "") as string | number;

  return (
    <UnifiedAdminLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Tour Pricing</h1>
            <p className="text-sm text-muted-foreground">
              Per-person package prices for /tours. Separate from room inventory and room rates.
            </p>
          </div>
          <Button variant="outline" onClick={load} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search packages…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {filtered.length} package{filtered.length === 1 ? "" : "s"}
            </CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead>
                <tr className="border-b text-left text-xs uppercase text-muted-foreground">
                  <th className="py-2 pr-3">Package</th>
                  <th className="py-2 pr-3">Our price (₹/person)</th>
                  <th className="py-2 pr-3">Compare-at</th>
                  <th className="py-2 pr-3">Competitor</th>
                  <th className="py-2 pr-3">Competitor price</th>
                  <th className="py-2 pr-3">Min group</th>
                  <th className="py-2 pr-3">Position</th>
                  <th className="py-2" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => {
                  const ours = Number(value(row, "price_per_person")) || 0;
                  const comp = Number(value(row, "competitor_price")) || 0;
                  const cheaper = comp > 0 && ours < comp;
                  const dirty = Boolean(draft[row.id]);
                  return (
                    <tr key={row.id} className="border-b last:border-0 align-top">
                      <td className="py-3 pr-3">
                        <p className="font-medium">{row.title}</p>
                        <p className="text-xs text-muted-foreground">
                          /tours/{row.slug} · {row.region ?? "—"} · {row.duration ?? "—"}
                        </p>
                      </td>
                      <td className="py-3 pr-3">
                        <Input
                          type="number"
                          className="w-28"
                          value={value(row, "price_per_person")}
                          onChange={(e) => edit(row.id, { price_per_person: Number(e.target.value) })}
                        />
                      </td>
                      <td className="py-3 pr-3">
                        <Input
                          type="number"
                          className="w-28"
                          value={value(row, "compare_at_price")}
                          onChange={(e) =>
                            edit(row.id, {
                              compare_at_price: e.target.value === "" ? null : Number(e.target.value),
                            })
                          }
                        />
                      </td>
                      <td className="py-3 pr-3">
                        <Input
                          className="w-32"
                          placeholder="Zostel"
                          value={value(row, "competitor_name")}
                          onChange={(e) =>
                            edit(row.id, { competitor_name: e.target.value || null })
                          }
                        />
                      </td>
                      <td className="py-3 pr-3">
                        <Input
                          type="number"
                          className="w-28"
                          value={value(row, "competitor_price")}
                          onChange={(e) =>
                            edit(row.id, {
                              competitor_price: e.target.value === "" ? null : Number(e.target.value),
                            })
                          }
                        />
                      </td>
                      <td className="py-3 pr-3">
                        <Input
                          type="number"
                          className="w-20"
                          value={value(row, "min_group")}
                          onChange={(e) =>
                            edit(row.id, { min_group: e.target.value === "" ? null : Number(e.target.value) })
                          }
                        />
                      </td>
                      <td className="py-3 pr-3">
                        {comp > 0 ? (
                          <Badge variant={cheaper ? "secondary" : "outline"} className="gap-1">
                            {cheaper ? (
                              <TrendingDown className="h-3 w-3" />
                            ) : (
                              <TrendingUp className="h-3 w-3" />
                            )}
                            {cheaper ? `${inr(comp - ours)} cheaper` : `${inr(ours - comp)} higher`}
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">No benchmark</span>
                        )}
                      </td>
                      <td className="py-3">
                        <Button size="sm" disabled={!dirty || savingId === row.id} onClick={() => save(row)}>
                          <Save className="mr-1.5 h-3.5 w-3.5" />
                          Save
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </UnifiedAdminLayout>
  );
};

export default AdminTourPricing;
