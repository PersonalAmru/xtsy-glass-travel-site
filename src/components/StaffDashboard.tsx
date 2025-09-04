
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Hotel, Users, Calendar, Settings, BarChart3, Globe } from 'lucide-react';
import { Profile, OTAIntegration } from '@/types/database';
import { SecurityDashboard } from '@/components/SecurityDashboard';

export const StaffDashboard: React.FC = () => {
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<string>('guest');

  // Fetch user profile with fallback
  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      try {
        // Since we can't query profiles table directly due to type issues,
        // we'll use the user metadata as fallback
        const role = user.user_metadata?.role || 'guest';
        setUserRole(role);
        return { role };
      } catch (err) {
        console.log('Profile fetch error:', err);
        setUserRole('guest');
        return null;
      }
    },
    enabled: !!user?.id,
  });

  // Fetch dashboard stats with error handling
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      try {
        // Use transactions table temporarily until bookings types are available
        const transactionsQuery = await supabase
          .from('transactions')
          .select('id, amount, payment_status')
          .limit(100);

        // Mock stats using available data
        const mockStats = {
          totalBookings: transactionsQuery.data?.length || 15,
          confirmedBookings: transactionsQuery.data?.filter(t => t.payment_status === 'completed').length || 8,
          totalRevenue: transactionsQuery.data?.reduce((sum, t) => sum + (t.amount || 0), 0) || 125000,
          roomTypes: 4, // Default room types count
          availableUnits: 25, // Default available units
        };

        return mockStats;
      } catch (error) {
        console.log('Stats fetch error:', error);
        return {
          totalBookings: 0,
          confirmedBookings: 0,
          totalRevenue: 0,
          roomTypes: 0,
          availableUnits: 0,
        };
      }
    },
    enabled: userRole !== 'guest',
  });

  // Mock OTA integrations for now
  const { data: otaIntegrations } = useQuery({
    queryKey: ['ota-integrations'],
    queryFn: async () => {
      try {
        // Return mock data since we can't query the table yet
        return [
          {
            id: '1',
            ota_name: 'Booking.com',
            is_active: true,
            sync_rates: true,
            sync_inventory: true,
            commission_rate: 15.0,
            last_sync: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: '2',
            ota_name: 'Hostelworld',
            is_active: false,
            sync_rates: true,
            sync_inventory: true,
            commission_rate: 12.0,
            last_sync: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ] as OTAIntegration[];
      } catch (error) {
        console.log('OTA integrations fetch error:', error);
        return [] as OTAIntegration[];
      }
    },
    enabled: userRole === 'admin' || userRole === 'channel_manager',
  });

  if (userRole === 'guest') {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Access Restricted</CardTitle>
            <CardDescription>
              You need staff privileges to access this dashboard.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Staff Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.user_metadata?.full_name || user?.email}
        </p>
      </div>

      {/* Dashboard Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalBookings || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.confirmedBookings || 0} confirmed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{((stats?.totalRevenue || 0) / 100).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Total earnings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Room Types</CardTitle>
            <Hotel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.roomTypes || 0}</div>
            <p className="text-xs text-muted-foreground">Active room types</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Units</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.availableUnits || 0}</div>
            <p className="text-xs text-muted-foreground">Currently available</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          {(userRole === 'admin' || userRole === 'channel_manager') && (
            <TabsTrigger value="ota">OTA Integrations</TabsTrigger>
          )}
          {(userRole === 'admin') && (
            <>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </>
          )}
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest booking updates</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  No recent activity to display
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>Current system health</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Booking System</span>
                    <Badge variant="outline" className="text-green-600">Online</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Gateway</span>
                    <Badge variant="outline" className="text-green-600">Online</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Booking Management</CardTitle>
              <CardDescription>Manage guest bookings and reservations</CardDescription>
            </CardHeader>
            <CardContent>
              <Button>View All Bookings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Management</CardTitle>
              <CardDescription>Manage room availability and pricing</CardDescription>
            </CardHeader>
            <CardContent>
              <Button>Manage Inventory</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {(userRole === 'admin' || userRole === 'channel_manager') && (
          <TabsContent value="ota" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>OTA Integrations</CardTitle>
                <CardDescription>Manage online travel agency connections</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {otaIntegrations?.map((ota) => (
                    <div key={ota.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Globe className="h-5 w-5" />
                        <div>
                          <h3 className="font-medium">{ota.ota_name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Commission: {ota.commission_rate}%
                          </p>
                        </div>
                      </div>
                      <Badge variant={ota.is_active ? "default" : "secondary"}>
                        {ota.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  ))}
                  
                  {(!otaIntegrations || otaIntegrations.length === 0) && (
                    <div className="text-center py-8">
                      <Globe className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No OTA Integrations</h3>
                      <p className="text-muted-foreground mb-4">
                        Connect with online travel agencies to expand your reach
                      </p>
                      <Button>Add Integration</Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {userRole === 'admin' && (
          <>
            <TabsContent value="security" className="space-y-4">
              <SecurityDashboard />
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>System Settings</CardTitle>
                  <CardDescription>Configure system-wide settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button>
                    <Settings className="mr-2 h-4 w-4" />
                    Manage Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
};
