/**
 * Admin GST & Compliance Page
 * Manage GST invoices, compliance, and tax reports
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
import { format, startOfMonth, endOfMonth } from 'date-fns';
import {
  FileText,
  Download,
  RefreshCw,
  Calendar,
  IndianRupee,
  Receipt,
  AlertTriangle,
  Check,
  ExternalLink,
} from 'lucide-react';

interface Invoice {
  id: string;
  invoice_number: string;
  guest_name: string;
  total_amount: number;
  gst_amount: number;
  status: string;
  created_at: string;
}

interface GSTMetrics {
  totalGST: number;
  monthlyGST: number;
  invoiceCount: number;
  pendingInvoices: number;
}

export default function AdminGST() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [metrics, setMetrics] = useState<GSTMetrics>({
    totalGST: 0,
    monthlyGST: 0,
    invoiceCount: 0,
    pendingInvoices: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGSTData();
  }, []);

  const fetchGSTData = async () => {
    setLoading(true);
    try {
      const monthStart = startOfMonth(new Date());
      const monthEnd = endOfMonth(new Date());

      const { data, error } = await supabase
        .from('booking_invoices')
        .select('id, invoice_number, guest_name, total_amount, gst_amount, status, created_at')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const allInvoices = data || [];
      const monthlyInvoices = allInvoices.filter(inv => {
        const date = new Date(inv.created_at ?? 0);
        return date >= monthStart && date <= monthEnd;
      });

      setMetrics({
        totalGST: allInvoices.reduce((sum, inv) => sum + (inv.gst_amount || 0), 0),
        monthlyGST: monthlyInvoices.reduce((sum, inv) => sum + (inv.gst_amount || 0), 0),
        invoiceCount: allInvoices.length,
        pendingInvoices: allInvoices.filter(inv => inv.status === 'pending').length,
      });

      setInvoices(allInvoices as Invoice[]);
    } catch (error) {
      console.error('Error fetching GST data:', error);
      toast.error('Failed to load GST data');
    } finally {
      setLoading(false);
    }
  };

  const metricCards = [
    {
      title: 'Total GST Collected',
      value: `₹${metrics.totalGST.toLocaleString()}`,
      icon: IndianRupee,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
    },
    {
      title: 'This Month',
      value: `₹${metrics.monthlyGST.toLocaleString()}`,
      icon: Calendar,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Total Invoices',
      value: metrics.invoiceCount.toString(),
      icon: Receipt,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      title: 'Pending',
      value: metrics.pendingInvoices.toString(),
      icon: AlertTriangle,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
    },
  ];

  return (
    <UnifiedAdminLayout>
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <FileText className="w-6 h-6 text-primary" />
              GST & Compliance
            </h1>
            <p className="text-sm text-muted-foreground">Manage invoices, GST reports, and tax compliance</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button variant="outline" size="sm" onClick={fetchGSTData} disabled={loading}>
              <RefreshCw className={cn('w-4 h-4 mr-2', loading && 'animate-spin')} />
              Refresh
            </Button>
          </div>
        </header>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metricCards.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className={cn('p-2 rounded-lg w-fit', metric.bgColor)}>
                    <Icon className={cn('w-5 h-5', metric.color)} />
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

        {/* GST Info Card */}
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">XTSY Travellers Hostel</h3>
                <p className="text-sm text-muted-foreground">GSTIN: 17AABCU9603R1ZM</p>
                <p className="text-sm text-muted-foreground mt-1">
                  GST Rate: 12% (CGST 6% + SGST 6%)
                </p>
              </div>
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                GST Portal
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Invoices Table */}
        <Card>
          <CardHeader>
            <CardTitle>GST Invoices</CardTitle>
            <CardDescription>All generated tax invoices</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : invoices.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Receipt className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No invoices found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {invoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-background rounded-lg">
                        <Receipt className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-sm font-mono">{invoice.invoice_number}</p>
                        <p className="text-xs text-muted-foreground">{invoice.guest_name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{invoice.total_amount?.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">
                        GST: ₹{invoice.gst_amount?.toLocaleString()}
                      </p>
                    </div>
                    <Badge variant={invoice.status === 'paid' ? 'default' : 'secondary'}>
                      {invoice.status === 'paid' ? (
                        <Check className="w-3 h-3 mr-1" />
                      ) : null}
                      {invoice.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </UnifiedAdminLayout>
  );
}
