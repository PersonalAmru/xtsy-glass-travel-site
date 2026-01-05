/**
 * Admin OTA Connections Page
 * Manage OTA integrations like Booking.com, Airbnb, etc.
 */

import { useState, useEffect } from 'react';
import { UnifiedAdminLayout } from '@/layouts/UnifiedAdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  Link2,
  RefreshCw,
  Check,
  AlertTriangle,
  ExternalLink,
  Settings,
  Calendar,
} from 'lucide-react';

interface ICalConfig {
  id: string;
  room_type_id: string;
  ota_name: string;
  ical_import_url: string | null;
  is_active: boolean;
  last_sync_at: string | null;
  last_sync_status: string | null;
  last_sync_error: string | null;
}

const otaPlatforms = [
  { id: 'booking', name: 'Booking.com', color: 'bg-blue-500', logo: '🏨' },
  { id: 'airbnb', name: 'Airbnb', color: 'bg-rose-500', logo: '🏠' },
  { id: 'makemytrip', name: 'MakeMyTrip', color: 'bg-orange-500', logo: '✈️' },
  { id: 'goibibo', name: 'Goibibo', color: 'bg-red-500', logo: '🎯' },
  { id: 'agoda', name: 'Agoda', color: 'bg-purple-500', logo: '🌏' },
  { id: 'hostelworld', name: 'Hostelworld', color: 'bg-green-500', logo: '🎒' },
];

export default function AdminOTAs() {
  const [configs, setConfigs] = useState<ICalConfig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('ical_sync_configs')
        .select('*')
        .order('ota_name');

      if (error) throw error;
      setConfigs(data || []);
    } catch (error) {
      console.error('Error fetching OTA configs:', error);
      toast.error('Failed to load OTA configurations');
    } finally {
      setLoading(false);
    }
  };

  const toggleSync = async (config: ICalConfig) => {
    try {
      const { error } = await supabase
        .from('ical_sync_configs')
        .update({ is_active: !config.is_active })
        .eq('id', config.id);

      if (error) throw error;
      toast.success(`Sync ${config.is_active ? 'disabled' : 'enabled'} for ${config.ota_name}`);
      fetchConfigs();
    } catch (error) {
      console.error('Error toggling sync:', error);
      toast.error('Failed to update sync status');
    }
  };

  return (
    <UnifiedAdminLayout>
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Link2 className="w-6 h-6 text-primary" />
              OTA Connections
            </h1>
            <p className="text-sm text-muted-foreground">Manage channel manager and OTA integrations</p>
          </div>
          <Button variant="outline" size="sm" onClick={fetchConfigs} disabled={loading}>
            <RefreshCw className={cn('w-4 h-4 mr-2', loading && 'animate-spin')} />
            Refresh
          </Button>
        </header>

        {/* OTA Platforms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {otaPlatforms.map((platform) => {
            const platformConfigs = configs.filter(c => 
              c.ota_name.toLowerCase().includes(platform.id)
            );
            const hasConfig = platformConfigs.length > 0;
            const isActive = platformConfigs.some(c => c.is_active);
            const lastSync = platformConfigs.find(c => c.last_sync_at)?.last_sync_at;

            return (
              <Card key={platform.id} className={cn(
                'transition-all hover:shadow-md',
                hasConfig && isActive && 'border-primary/30'
              )}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center text-lg', platform.color)}>
                        {platform.logo}
                      </div>
                      <div>
                        <CardTitle className="text-base">{platform.name}</CardTitle>
                        <CardDescription className="text-xs">
                          {hasConfig ? `${platformConfigs.length} room(s) synced` : 'Not connected'}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant={hasConfig && isActive ? 'default' : 'secondary'}>
                      {hasConfig && isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {hasConfig ? (
                    <>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Auto Sync</span>
                        <Switch 
                          checked={isActive} 
                          onCheckedChange={() => {
                            const config = platformConfigs.find(c => c.is_active === isActive);
                            if (config) toggleSync(config);
                          }}
                        />
                      </div>
                      {lastSync && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          Last sync: {format(new Date(lastSync), 'MMM d, HH:mm')}
                        </div>
                      )}
                    </>
                  ) : (
                    <Button variant="outline" size="sm" className="w-full">
                      <Settings className="w-4 h-4 mr-2" />
                      Configure
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* iCal Sync Configurations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              iCal Sync Configurations
            </CardTitle>
            <CardDescription>
              Manage calendar sync with OTA platforms
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : configs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Link2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No iCal configurations found</p>
                <p className="text-sm">Add OTA connections to sync calendars</p>
              </div>
            ) : (
              <div className="space-y-3">
                {configs.map((config) => (
                  <div key={config.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'w-2 h-2 rounded-full',
                        config.is_active ? 'bg-emerald-500' : 'bg-muted-foreground'
                      )} />
                      <div>
                        <p className="font-medium text-sm">{config.ota_name}</p>
                        <p className="text-xs text-muted-foreground">Room: {config.room_type_id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {config.last_sync_status === 'success' ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : config.last_sync_status === 'error' ? (
                        <AlertTriangle className="w-4 h-4 text-destructive" />
                      ) : null}
                      <Switch 
                        checked={config.is_active} 
                        onCheckedChange={() => toggleSync(config)}
                      />
                    </div>
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
