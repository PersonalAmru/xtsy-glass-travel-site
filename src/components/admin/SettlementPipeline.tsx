/**
 * Settlement Pipeline Component
 * Shows booking lifecycle and settlement status
 */

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  ArrowRight,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  RefreshCw,
  AlertTriangle,
  Banknote,
} from 'lucide-react';
import { transitionSettlementStatus, getPropertySettlementSummary } from '@/services/settlementService';
import type { SettlementStatus, SettlementSummary } from '@/types/commercial';

const STATUS_CONFIG: Record<SettlementStatus, { label: string; color: string; icon: React.ElementType }> = {
  initiated: { label: 'Initiated', color: 'bg-gray-500/10 text-gray-500', icon: Clock },
  confirmed: { label: 'Confirmed', color: 'bg-blue-500/10 text-blue-500', icon: CheckCircle2 },
  stayed: { label: 'Stayed', color: 'bg-emerald-500/10 text-emerald-500', icon: CheckCircle2 },
  cancelled: { label: 'Cancelled', color: 'bg-destructive/10 text-destructive', icon: XCircle },
  no_show: { label: 'No Show', color: 'bg-amber-500/10 text-amber-500', icon: AlertTriangle },
  refund_pending: { label: 'Refund Pending', color: 'bg-orange-500/10 text-orange-500', icon: Clock },
  refunded: { label: 'Refunded', color: 'bg-purple-500/10 text-purple-500', icon: Banknote },
  settled: { label: 'Settled', color: 'bg-emerald-500/10 text-emerald-500', icon: DollarSign },
};

interface BookingWithSettlement {
  id: string;
  booking_id: string;
  guest_name: string;
  total_amount: number;
  settlement_status: string | null;
  settlement_amount: number | null;
  check_in: string;
  check_out: string;
  property_id: string | null;
}

export function SettlementPipeline() {
  const [bookings, setBookings] = useState<BookingWithSettlement[]>([]);
  const [summary, setSummary] = useState<SettlementSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<string>('all');
  const [properties, setProperties] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    fetchData();
  }, [selectedProperty]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch properties
      const { data: propData } = await supabase.from('properties').select('id, name');
      setProperties(propData || []);

      // Fetch bookings with settlement info
      let query = supabase
        .from('bookings')
        .select('id, booking_id, guest_name, total_amount, settlement_status, settlement_amount, check_in, check_out, property_id')
        .order('created_at', { ascending: false })
        .limit(50);

      if (selectedProperty !== 'all') {
        query = query.eq('property_id', selectedProperty);
      }

      const { data, error } = await query;
      if (error) throw error;
      setBookings(data || []);

      // Fetch summary
      if (selectedProperty !== 'all') {
        const summaryData = await getPropertySettlementSummary(selectedProperty);
        setSummary(summaryData);
      } else {
        setSummary(null);
      }
    } catch (error) {
      console.error('Error fetching settlement data:', error);
      toast.error('Failed to load settlement data');
    } finally {
      setLoading(false);
    }
  };

  const handleTransition = async (bookingId: string, bookingRef: string, newStatus: SettlementStatus, amount: number) => {
    const result = await transitionSettlementStatus(bookingId, bookingRef, newStatus, amount);
    if (result.success) {
      toast.success(`Status updated to ${STATUS_CONFIG[newStatus].label}`);
      fetchData();
    } else {
      toast.error(result.error || 'Failed to update status');
    }
  };

  const getNextStates = (current: SettlementStatus | null): SettlementStatus[] => {
    if (!current) return ['initiated'];
    const transitions: Record<SettlementStatus, SettlementStatus[]> = {
      initiated: ['confirmed', 'cancelled'],
      confirmed: ['stayed', 'cancelled', 'no_show'],
      stayed: ['settled', 'refund_pending'],
      cancelled: ['refund_pending', 'refunded'],
      no_show: ['settled', 'refund_pending'],
      refund_pending: ['refunded'],
      refunded: ['settled'],
      settled: [],
    };
    return transitions[current] || [];
  };

  const pipelineStages: SettlementStatus[] = ['initiated', 'confirmed', 'stayed', 'settled'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-semibold">Settlement Pipeline</h2>
          <p className="text-sm text-muted-foreground">Track booking lifecycle and payouts</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedProperty} onValueChange={setSelectedProperty}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by property" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Properties</SelectItem>
              {properties.map(p => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
            <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold text-emerald-500">₹{summary.total_revenue.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Settled Revenue</p>
              <p className="text-2xl font-bold">₹{summary.settled_revenue.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Outstanding</p>
              <p className="text-2xl font-bold text-amber-500">₹{summary.outstanding_liability.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Payout Eligible</p>
              <p className="text-2xl font-bold text-blue-500">₹{summary.payout_eligible.toLocaleString()}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Pipeline Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pipeline Status</CardTitle>
          <CardDescription>Visual flow from booking to settlement</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between overflow-x-auto pb-2">
            {pipelineStages.map((stage, index) => {
              const config = STATUS_CONFIG[stage];
              const Icon = config.icon;
              const count = bookings.filter(b => b.settlement_status === stage).length;
              return (
                <div key={stage} className="flex items-center">
                  <div className="flex flex-col items-center min-w-[100px]">
                    <div className={cn('p-3 rounded-full', config.color)}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-medium mt-2">{config.label}</p>
                    <p className="text-2xl font-bold">{count}</p>
                  </div>
                  {index < pipelineStages.length - 1 && (
                    <ArrowRight className="w-5 h-5 text-muted-foreground mx-2" />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Bookings List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Bookings</CardTitle>
          <CardDescription>Click to transition settlement status</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : bookings.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No bookings found</p>
          ) : (
            <div className="space-y-2">
              {bookings.map((booking) => {
                const status = (booking.settlement_status || 'initiated') as SettlementStatus;
                const config = STATUS_CONFIG[status];
                const nextStates = getNextStates(status);
                const Icon = config.icon;

                return (
                  <div key={booking.id} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                    <div className={cn('p-2 rounded-lg shrink-0', config.color)}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-sm">{booking.guest_name}</span>
                        <Badge variant="outline" className="text-xs font-mono">{booking.booking_id}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(booking.check_in), 'MMM d')} - {format(new Date(booking.check_out), 'MMM d')}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-semibold">₹{booking.total_amount.toLocaleString()}</p>
                      <Badge className={cn('text-xs', config.color)}>{config.label}</Badge>
                    </div>
                    {nextStates.length > 0 && (
                      <Select onValueChange={(val) => handleTransition(booking.id, booking.booking_id, val as SettlementStatus, booking.total_amount)}>
                        <SelectTrigger className="w-32 shrink-0">
                          <SelectValue placeholder="Action" />
                        </SelectTrigger>
                        <SelectContent>
                          {nextStates.map((s) => (
                            <SelectItem key={s} value={s}>
                              → {STATUS_CONFIG[s].label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
