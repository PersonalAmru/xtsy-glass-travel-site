/**
 * Franchise Dashboard - Home page for franchise owners
 * Shows key metrics and quick actions
 */

import { useState, useEffect } from 'react';
import { FranchiseLayout } from '@/layouts/FranchiseLayout';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { TrendingUp, Calendar, DollarSign, Users } from 'lucide-react';

interface DashboardStats {
  totalBookings: number;
  occupancyRate: number;
  revenue: number;
  upcomingCheckIns: number;
}

export default function FranchiseDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    occupancyRate: 0,
    revenue: 0,
    upcomingCheckIns: 0,
  });
  const [loading, setLoading] = useState(true);
  const [propertyId, setPropertyId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Get assigned property
        const { data: assignment } = await supabase
          .from('franchise_assignments')
          .select('property_id')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .single();

        if (!assignment?.property_id) return;
        setPropertyId(assignment.property_id);

        const now = new Date();
        const monthStart = format(startOfMonth(now), 'yyyy-MM-dd');
        const monthEnd = format(endOfMonth(now), 'yyyy-MM-dd');
        const today = format(now, 'yyyy-MM-dd');

        // Fetch bookings for this month
        const { data: bookings, count } = await supabase
          .from('bookings')
          .select('*', { count: 'exact' })
          .eq('property_id', assignment.property_id)
          .gte('check_in', monthStart)
          .lte('check_in', monthEnd);

        // Fetch upcoming check-ins
        const { count: upcomingCount } = await supabase
          .from('bookings')
          .select('*', { count: 'exact' })
          .eq('property_id', assignment.property_id)
          .eq('check_in', today)
          .eq('booking_status', 'confirmed');

        // Calculate revenue
        const totalRevenue = bookings?.reduce((sum, b) => sum + (b.total_amount || 0), 0) || 0;

        setStats({
          totalBookings: count || 0,
          occupancyRate: 0, // Would need room inventory to calculate
          revenue: totalRevenue,
          upcomingCheckIns: upcomingCount || 0,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    {
      title: 'Bookings This Month',
      value: stats.totalBookings,
      icon: Calendar,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: "Today's Check-ins",
      value: stats.upcomingCheckIns,
      icon: Users,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Revenue (MTD)',
      value: `₹${stats.revenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
    },
    {
      title: 'Performance',
      value: 'Good',
      icon: TrendingUp,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
  ];

  return (
    <FranchiseLayout>
      <div className="p-4 space-y-6">
        {/* Welcome Section */}
        <div>
          <h2 className="text-xl font-semibold text-foreground">Dashboard</h2>
          <p className="text-sm text-muted-foreground">
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {statCards.map((stat) => (
            <Card key={stat.title} className="bg-zinc-900/50 border-zinc-800">
              <CardContent className="p-4">
                <div className={`inline-flex p-2 rounded-lg ${stat.bgColor} mb-2`}>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.title}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <button className="w-full text-left px-4 py-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors">
              <span className="text-sm text-foreground">View Today's Schedule</span>
            </button>
            <button className="w-full text-left px-4 py-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors">
              <span className="text-sm text-foreground">Update Availability</span>
            </button>
            <button className="w-full text-left px-4 py-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors">
              <span className="text-sm text-foreground">View Earnings Report</span>
            </button>
          </CardContent>
        </Card>
      </div>
    </FranchiseLayout>
  );
}
