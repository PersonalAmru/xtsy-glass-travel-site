/**
 * Admin Enquiry Review
 * ------------------------------------------------------------------
 * Unified panel for EVERY guest enquiry across the platform — stay
 * bookings, tour/travel packages and TAB Bistro catering/events — so
 * the admin can view + contact guests from one place. ENQ serials are
 * clean & segregated by category.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { UnifiedAdminLayout } from "@/layouts/UnifiedAdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import {
  fetchUnifiedEnquiries,
  updateCateringStatus,
  contactLinks,
  categoryLabel,
  type UnifiedEnquiry,
  type EnquiryCategory,
} from "@/services/unifiedEnquiryService";
import {
  Inbox,
  RefreshCw,
  Phone,
  MessageCircle,
  Mail,
  BedDouble,
  Mountain,
  UtensilsCrossed,
  Calendar,
  CheckCircle2,
  Loader2,
} from "lucide-react";

type FilterTab = "all" | EnquiryCategory;

const CATEGORY_ICON: Record<EnquiryCategory, typeof BedDouble> = {
  stay: BedDouble,
  tour: Mountain,
  catering: UtensilsCrossed,
};

const CATEGORY_ACCENT: Record<EnquiryCategory, string> = {
  stay: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  tour: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  catering: "bg-amber-500/15 text-amber-400 border-amber-500/30",
};

function statusBadge(status: string) {
  const s = status.toLowerCase();
  if (["approved", "confirmed", "closed", "completed"].includes(s))
    return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
  if (["rejected", "cancelled"].includes(s))
    return "bg-red-500/15 text-red-400 border-red-500/30";
  if (["contacted", "in_progress"].includes(s))
    return "bg-blue-500/15 text-blue-400 border-blue-500/30";
  return "bg-amber-500/15 text-amber-400 border-amber-500/30";
}

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState<UnifiedEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<FilterTab>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, errors } = await fetchUnifiedEnquiries();
    setEnquiries(data);
    if (errors.length) {
      errors.forEach((e) => console.error("[Enquiries]", e));
      toast.error("Some enquiry sources failed to load");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Realtime: refresh whenever any enquiry table changes
  useEffect(() => {
    const channel = supabase
      .channel("unified-enquiries")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "enquiries" },
        () => load()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tour_enquiries" },
        () => load()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "catering_enquiries" },
        () => load()
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [load]);

  const counts = useMemo(() => {
    const c = { all: enquiries.length, stay: 0, tour: 0, catering: 0 };
    enquiries.forEach((e) => (c[e.category] += 1));
    return c;
  }, [enquiries]);

  const visible = useMemo(
    () => (tab === "all" ? enquiries : enquiries.filter((e) => e.category === tab)),
    [enquiries, tab]
  );

  const newCount = useMemo(
    () =>
      enquiries.filter((e) =>
        ["pending", "new"].includes(e.status.toLowerCase())
      ).length,
    [enquiries]
  );

  const handleCateringStatus = async (
    e: UnifiedEnquiry,
    status: "contacted" | "closed"
  ) => {
    setUpdatingId(e.id);
    const res = await updateCateringStatus(e.id, status);
    if (res.success) {
      toast.success(`Marked as ${status}`);
      setEnquiries((prev) =>
        prev.map((x) => (x.id === e.id ? { ...x, status } : x))
      );
    } else {
      toast.error(res.error || "Failed to update");
    }
    setUpdatingId(null);
  };

  const tabs: { id: FilterTab; label: string; count: number }[] = [
    { id: "all", label: "All", count: counts.all },
    { id: "stay", label: "Stay", count: counts.stay },
    { id: "tour", label: "Tours", count: counts.tour },
    { id: "catering", label: "Catering", count: counts.catering },
  ];

  return (
    <UnifiedAdminLayout>
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-white">
              <Inbox className="w-6 h-6 text-primary" />
              Enquiry Review
            </h1>
            <p className="text-sm text-slate-400">
              Every guest enquiry — stay, tours & catering — in one place.
              {newCount > 0 && (
                <span className="ml-2 text-amber-400 font-medium">
                  {newCount} awaiting contact
                </span>
              )}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={load}
            disabled={loading}
            className="border-white/10 text-slate-300 hover:text-white"
          >
            <RefreshCw className={cn("w-4 h-4 mr-2", loading && "animate-spin")} />
            Refresh
          </Button>
        </header>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium border transition-all",
                tab === t.id
                  ? "bg-primary/15 text-primary border-primary/30"
                  : "bg-white/5 text-slate-400 border-white/10 hover:text-white"
              )}
            >
              {t.label}
              <span className="ml-2 text-xs opacity-70">{t.count}</span>
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400 gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading enquiries…
          </div>
        ) : visible.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Inbox className="w-12 h-12 text-white/15 mb-3" />
            <p className="text-slate-400">No enquiries in this category yet.</p>
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {visible.map((e) => {
              const Icon = CATEGORY_ICON[e.category];
              const links = contactLinks(e);
              let timeAgo = "";
              try {
                timeAgo = formatDistanceToNow(new Date(e.createdAt), {
                  addSuffix: true,
                });
              } catch {
                /* noop */
              }
              return (
                <Card
                  key={`${e.category}-${e.id}`}
                  className="bg-white/5 border-white/10 overflow-hidden"
                >
                  <CardContent className="p-4 space-y-3">
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "w-9 h-9 rounded-lg flex items-center justify-center border",
                            CATEGORY_ACCENT[e.category]
                          )}
                        >
                          <Icon className="w-4 h-4" />
                        </span>
                        <div>
                          <p className="font-semibold text-white leading-tight">
                            {e.guestName}
                          </p>
                          <p className="text-[11px] font-mono text-slate-500">
                            {e.refId}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn("capitalize", statusBadge(e.status))}
                      >
                        {e.status.replace(/_/g, " ")}
                      </Badge>
                    </div>

                    {/* Detail */}
                    <div className="text-sm">
                      <p className="text-slate-200 font-medium">{e.summary}</p>
                      <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        {e.detail}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <Badge
                        variant="outline"
                        className={cn("text-[10px]", CATEGORY_ACCENT[e.category])}
                      >
                        {categoryLabel(e.category)}
                      </Badge>
                      <div className="flex items-center gap-3">
                        {e.amount ? (
                          <span className="text-slate-300 font-medium">
                            ₹{e.amount.toLocaleString("en-IN")}
                          </span>
                        ) : null}
                        <span>{timeAgo}</span>
                      </div>
                    </div>

                    {/* Contact actions */}
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                      {links.tel && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-white/10 text-slate-200 hover:text-white"
                          onClick={() => window.open(links.tel!, "_self")}
                        >
                          <Phone className="w-3.5 h-3.5 mr-1.5" />
                          Call
                        </Button>
                      )}
                      {links.whatsapp && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                          onClick={() => window.open(links.whatsapp!, "_blank")}
                        >
                          <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
                          WhatsApp
                        </Button>
                      )}
                      {links.email && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-white/10 text-slate-200 hover:text-white"
                          onClick={() => window.open(links.email!, "_blank")}
                        >
                          <Mail className="w-3.5 h-3.5 mr-1.5" />
                          Email
                        </Button>
                      )}
                      {e.category === "catering" &&
                        e.status.toLowerCase() !== "closed" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={updatingId === e.id}
                            className="text-slate-400 hover:text-white ml-auto"
                            onClick={() =>
                              handleCateringStatus(
                                e,
                                e.status.toLowerCase() === "contacted"
                                  ? "closed"
                                  : "contacted"
                              )
                            }
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                            {e.status.toLowerCase() === "contacted"
                              ? "Close"
                              : "Mark contacted"}
                          </Button>
                        )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </UnifiedAdminLayout>
  );
}
