import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Activity, Eye, ShoppingCart, MapPin, Clock, Zap, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';

interface RealtimeEvent {
  id: string;
  visitor_id: string;
  event_type: string;
  event_category: string;
  event_action: string;
  event_label: string;
  page_path: string;
  country_code: string;
  created_at: string;
}

interface HighIntentTraveller {
  visitor_id: string;
  traveller_segment: string;
  spend_tier: string;
  booking_intent_score: number;
  last_page_viewed: string;
  last_seen_at: string;
}

interface RealtimeTravellerActivityProps {
  highIntentTravellers: HighIntentTraveller[];
  activeVisitors: number;
}

const EVENT_ICONS: Record<string, React.ReactNode> = {
  pageview: <Eye className="h-3 w-3" />,
  click: <Activity className="h-3 w-3" />,
  booking: <ShoppingCart className="h-3 w-3" />,
  search: <MapPin className="h-3 w-3" />,
};

const SEGMENT_COLORS: Record<string, string> = {
  loyal: '#10b981',
  luxury: '#8b5cf6',
  budget_explorer: '#f59e0b',
  solo: '#3b82f6',
  group_organizer: '#ec4899',
  high_intent: '#ef4444',
  new_explorer: '#6b7280',
};

const SPEND_BADGES: Record<string, { label: string; color: string }> = {
  high_value: { label: 'High Value', color: '#10b981' },
  medium: { label: 'Medium', color: '#f59e0b' },
  budget: { label: 'Budget', color: '#6b7280' },
};

export function RealtimeTravellerActivity({ highIntentTravellers, activeVisitors }: RealtimeTravellerActivityProps) {
  const [recentEvents, setRecentEvents] = useState<RealtimeEvent[]>([]);

  // Subscribe to real-time events
  useEffect(() => {
    const channel = supabase
      .channel('realtime-traveller-events')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'traveller_events' },
        (payload) => {
          const newEvent = payload.new as RealtimeEvent;
          setRecentEvents(prev => [newEvent, ...prev.slice(0, 49)]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Live Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card/50 backdrop-blur border-green-500/30 border-2">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Users className="h-10 w-10 text-green-500" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full animate-pulse" />
              </div>
              <div>
                <p className="text-3xl font-bold">{activeVisitors}</p>
                <p className="text-sm text-muted-foreground">Active Visitors</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur border-amber-500/30 border-2">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Zap className="h-10 w-10 text-amber-500" />
              </div>
              <div>
                <p className="text-3xl font-bold">{highIntentTravellers.length}</p>
                <p className="text-sm text-muted-foreground">High Intent</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Activity className="h-10 w-10 text-primary" />
              <div>
                <p className="text-3xl font-bold">{recentEvents.length}</p>
                <p className="text-sm text-muted-foreground">Recent Events</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* High Intent Travellers */}
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-500" />
              High Intent Travellers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-80">
              {highIntentTravellers.length > 0 ? (
                <div className="space-y-3">
                  {highIntentTravellers.map((traveller) => (
                    <div 
                      key={traveller.visitor_id}
                      className="p-3 bg-muted/30 rounded-lg border border-border/50 hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge 
                            style={{ backgroundColor: SEGMENT_COLORS[traveller.traveller_segment] || '#6b7280' }}
                            className="text-white text-xs"
                          >
                            {traveller.traveller_segment.replace('_', ' ')}
                          </Badge>
                          <Badge 
                            variant="outline"
                            style={{ borderColor: SPEND_BADGES[traveller.spend_tier]?.color }}
                            className="text-xs"
                          >
                            {SPEND_BADGES[traveller.spend_tier]?.label || traveller.spend_tier}
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDistanceToNow(new Date(traveller.last_seen_at), { addSuffix: true })}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground truncate max-w-[60%]">
                          {traveller.last_page_viewed || 'Homepage'}
                        </div>
                        <div className="flex items-center gap-1">
                          <Zap className="h-4 w-4 text-amber-500" />
                          <span className="font-bold text-amber-500">
                            {traveller.booking_intent_score}%
                          </span>
                        </div>
                      </div>

                      <code className="text-xs text-muted-foreground/60 block mt-1">
                        {traveller.visitor_id.slice(0, 12)}...
                      </code>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  <p>No high intent travellers detected yet</p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Live Event Stream */}
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Live Event Stream
              {recentEvents.length > 0 && (
                <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-80">
              {recentEvents.length > 0 ? (
                <div className="space-y-2">
                  {recentEvents.map((event) => (
                    <div 
                      key={event.id}
                      className="flex items-center gap-3 p-2 bg-muted/20 rounded-lg text-sm"
                    >
                      <div className="p-1.5 bg-primary/10 rounded">
                        {EVENT_ICONS[event.event_type] || <Activity className="h-3 w-3" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate">
                          <span className="font-medium capitalize">{event.event_action}</span>
                          {event.event_label && (
                            <span className="text-muted-foreground"> - {event.event_label}</span>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {event.page_path}
                        </p>
                      </div>
                      <div className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatDistanceToNow(new Date(event.created_at), { addSuffix: true })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                  <Activity className="h-12 w-12 mb-4 opacity-30" />
                  <p>Waiting for live events...</p>
                  <p className="text-xs mt-1">Events will appear here in real-time</p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}