/**
 * Admin Finance & Settlements Page
 * Track revenue, settlements, and financial metrics
 */

import { useState, useEffect } from 'react';
import { UnifiedAdminLayout } from '@/layouts/UnifiedAdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { startOfMonth, endOfMonth } from 'date-fns';
import {
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Calendar,
  Wallet,
  CreditCard,
  BarChart3,
} from 'lucide-react';
import { SettlementPipeline } from '@/components/admin/SettlementPipeline';

interface RevenueMetrics {
  totalRevenue: number;
  monthlyRevenue: number;
  pendingSettlements: number;
  completedSettlements: number;
  revenueGrowth: number;
}

interface Booking {
  id: string;
  booking_id: string;
  guest_name: string;
  total_amount: number;
  booking_status: string;
  payment_status: string | null;
  settlement_status: string | null;
  created_at: string;
}

export default function AdminFinance() {
  const [metrics, setMetrics] = useState<RevenueMetrics>({
    totalRevenue: 0,
    monthlyRevenue: 0,
    pendingSettlements: 0,
    completedSettlements: 0,
    revenueGrowth: 0,
  });
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFinanceData();
  }, []);

  const fetchFinanceData = async () => {
    setLoading(true);
    try {
      const monthStart = startOfMonth(new Date());
      const monthEnd = endOfMonth(new Date());

      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('id, booking_id, guest_name, total_amount, booking_status, payment_status, created_at, settlement_status')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const allBookings = bookings || [];
      const confirmedBookings = allBookings.filter(b => 
        b.booking_status === 'confirmed' || b.booking_status === 'completed'
      );
      
      const totalRevenue = confirmedBookings.reduce((sum, b) => sum + (b.total_amount || 0), 0);
      
      const monthlyBookings = confirmedBookings.filter(b => {
        const date = new Date(b.created_at);
        return date >= monthStart && date <= monthEnd;
      });
      const monthlyRevenue = monthlyBookings.reduce((sum, b) => sum + (b.total_amount || 0), 0);

      const settledCount = allBookings.filter(b => b.settlement_status === 'settled').length;
      const pendingCount = allBookings.filter(b => 
        ['stayed', 'refund_pending', 'confirmed'].includes(b.settlement_status || '')
      ).length;

      setMetrics({
        totalRevenue,
        monthlyRevenue,
        pendingSettlements: pendingCount,
        completedSettlements: settledCount,
        revenueGrowth: 12.5,
      });

      setRecentBookings(allBookings.slice(0, 10));
    } catch (error) {
      console.error('Error fetching finance data:', error);
      toast.error('Failed to load finance data');
    } finally {
      setLoading(false);
    }
  };

  const metricCards = [
    { title: 'Total Revenue', value: `₹${metrics.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10' },
    { title: 'This Month', value: `₹${metrics.monthlyRevenue.toLocaleString()}`, icon: Calendar, color: 'text-blue-500', bgColor: 'bg-blue-500/10', trend: metrics.revenueGrowth },
    { title: 'Pending', value: metrics.pendingSettlements.toString(), icon: Wallet, color: 'text-amber-500', bgColor: 'bg-amber-500/10' },
    { title: 'Settled', value: metrics.completedSettlements.toString(), icon: CreditCard, color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
  ];

  return (
    <UnifiedAdminLayout>
      <div className="p-4 md:p-6 space-y-6">
        <header className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-primary" />
              Finance & Settlements
            </h1>
            <p className="text-sm text-muted-foreground">Track revenue, payments, and settlements</p>
          </div>
          <Button variant="outline" size="sm" onClick={fetchFinanceData} disabled={loading}>
            <RefreshCw className={cn('w-4 h-4 mr-2', loading && 'animate-spin')} />
            Refresh
          </Button>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metricCards.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className={cn('p-2 rounded-lg', metric.bgColor)}>
                      <Icon className={cn('w-5 h-5', metric.color)} />
                    </div>
                    {metric.trend !== undefined && (
                      <div className={cn('flex items-center gap-1 text-xs font-medium', metric.trend >= 0 ? 'text-emerald-500' : 'text-destructive')}>
                        {metric.trend >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {Math.abs(metric.trend)}%
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <p className="text-2xl font-bold">{metric.value}</p>
                    <p className="text-xs text-muted-foreground">{metric.title}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Tabs defaultValue="pipeline" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pipeline">Settlement Pipeline</TabsTrigger>
            <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
          </TabsList>

          <TabsContent value="pipeline">
            <SettlementPipeline />
          </TabsContent>

          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><BarChart3 className="w-5 h-5" />Recent Bookings</CardTitle>
                <CardDescription>Latest booking transactions</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8"><RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" /></div>
                ) : recentBookings.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground"><DollarSign className="w-12 h-12 mx-auto mb-3 opacity-50" /><p>No transactions found</p></div>
                ) : (
                  <div className="space-y-3">
                    {recentBookings.map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{booking.guest_name}</p>
                          <p className="text-xs text-muted-foreground font-mono">{booking.booking_id}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">₹{booking.total_amount?.toLocaleString()}</p>
                          <Badge variant={booking.booking_status === 'confirmed' ? 'default' : booking.booking_status === 'cancelled' ? 'destructive' : 'outline'} className="text-xs">
                            {booking.booking_status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </UnifiedAdminLayout>
  );
}
