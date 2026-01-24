/**
 * Admin DataLayer Debug Page
 * Full-page view for monitoring dataLayer events in real-time
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trash2,
  Download,
  Filter,
  Bug,
  Zap,
  Eye,
  Shield,
  Tag,
  ChevronDown,
  RefreshCw,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import { UnifiedAdminLayout } from '@/layouts/UnifiedAdminLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useGTMAnalytics } from '@/hooks/useGTMAnalytics';

interface DataLayerEvent {
  event: string;
  timestamp: string;
  page_path?: string;
  session_id?: string;
  visitor_id?: string;
  [key: string]: unknown;
}

interface CapturedEvent {
  id: string;
  event: DataLayerEvent;
  capturedAt: number;
}

const EVENT_COLORS: Record<string, string> = {
  page_view: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  consent_update: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  booking_confirmed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  whatsapp_engaged_validated: 'bg-green-500/10 text-green-400 border-green-500/20',
  call_engaged_validated: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
  lead_qualified: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  session_quality_signal: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  scroll_depth: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  element_click: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  default: 'bg-muted text-muted-foreground border-border',
};

const EVENT_ICONS: Record<string, React.ReactNode> = {
  page_view: <Eye className="w-4 h-4" />,
  consent_update: <Shield className="w-4 h-4" />,
  booking_confirmed: <Zap className="w-4 h-4" />,
  whatsapp_engaged_validated: <Zap className="w-4 h-4" />,
  call_engaged_validated: <Zap className="w-4 h-4" />,
  lead_qualified: <Zap className="w-4 h-4" />,
  default: <Tag className="w-4 h-4" />,
};

const CONVERSION_EVENTS = ['booking_confirmed', 'whatsapp_engaged_validated', 'call_engaged_validated', 'lead_qualified'];

export default function AdminDataLayerDebug() {
  const [events, setEvents] = useState<CapturedEvent[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const { gtmHealth, conversionMetrics, consentMetrics } = useGTMAnalytics(1);

  // Listen to dataLayer events
  useEffect(() => {
    const handleEvent = (e: CustomEvent<DataLayerEvent>) => {
      const capturedEvent: CapturedEvent = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        event: e.detail,
        capturedAt: Date.now(),
      };
      setEvents(prev => [capturedEvent, ...prev].slice(0, 200));
    };

    window.addEventListener('datalayer-push' as any, handleEvent);
    return () => window.removeEventListener('datalayer-push' as any, handleEvent);
  }, []);

  // Also capture existing dataLayer events on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      const existingEvents = (window as any).dataLayer
        .filter((e: any) => e.event)
        .slice(-50)
        .map((e: any) => ({
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          event: e,
          capturedAt: new Date(e.timestamp || Date.now()).getTime(),
        }));
      setEvents(existingEvents.reverse());
    }
  }, []);

  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);

  const exportEvents = useCallback(() => {
    const data = JSON.stringify(events.map(e => e.event), null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `datalayer-events-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [events]);

  const filteredEvents = filter === 'all' 
    ? events 
    : filter === 'conversions'
      ? events.filter(e => CONVERSION_EVENTS.includes(e.event.event))
      : events.filter(e => e.event.event === filter);

  const getEventColor = (eventName: string) => EVENT_COLORS[eventName] || EVENT_COLORS.default;
  const getEventIcon = (eventName: string) => EVENT_ICONS[eventName] || EVENT_ICONS.default;
  const uniqueEventTypes = Array.from(new Set(events.map(e => e.event.event)));

  return (
    <UnifiedAdminLayout>
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Bug className="w-6 h-6 text-primary" />
              DataLayer Debug
            </h1>
            <p className="text-sm text-muted-foreground">Real-time GTM event monitoring</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={clearEvents}>
              <Trash2 className="w-4 h-4 mr-2" />
              Clear
            </Button>
            <Button variant="outline" size="sm" onClick={exportEvents}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </header>

        {/* GTM Status Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-card/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center',
                  gtmHealth.containerActive ? 'bg-emerald-500/10' : 'bg-destructive/10'
                )}>
                  <Tag className={cn(
                    'w-5 h-5',
                    gtmHealth.containerActive ? 'text-emerald-500' : 'text-destructive'
                  )} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">GTM Container</p>
                  <p className="font-semibold">{gtmHealth.containerId}</p>
                  <Badge variant={gtmHealth.containerActive ? 'default' : 'destructive'} className="text-[10px] mt-1">
                    {gtmHealth.containerActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Session Events</p>
                  <p className="text-2xl font-bold">{gtmHealth.eventsInSession}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Consent</p>
                  <div className="flex gap-2 mt-1">
                    <Badge variant={gtmHealth.consentState.analytics ? 'default' : 'secondary'} className="text-[10px]">
                      Analytics {gtmHealth.consentState.analytics ? '✓' : '✗'}
                    </Badge>
                    <Badge variant={gtmHealth.consentState.marketing ? 'default' : 'secondary'} className="text-[10px]">
                      Ads {gtmHealth.consentState.marketing ? '✓' : '✗'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Conversions (24h)</p>
                  <p className="text-2xl font-bold">{conversionMetrics.bookings + conversionMetrics.leadsQualified}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Events List */}
          <Card className="lg:col-span-2 bg-card/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Live Events</CardTitle>
                  <CardDescription>Real-time dataLayer pushes</CardDescription>
                </div>
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter events" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Events</SelectItem>
                    <SelectItem value="conversions">Conversions Only</SelectItem>
                    {uniqueEventTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                {filteredEvents.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full py-12 text-muted-foreground">
                    <Bug className="w-12 h-12 mb-3 opacity-50" />
                    <p className="text-sm font-medium">No events captured</p>
                    <p className="text-xs">Navigate the site to see events appear here</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredEvents.map((captured) => {
                      const isExpanded = expandedEvent === captured.id;
                      const isConversion = CONVERSION_EVENTS.includes(captured.event.event);
                      const timeDiff = Math.round((Date.now() - captured.capturedAt) / 1000);
                      
                      return (
                        <motion.div
                          key={captured.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={cn(
                            'rounded-xl border overflow-hidden cursor-pointer transition-colors',
                            getEventColor(captured.event.event)
                          )}
                          onClick={() => setExpandedEvent(isExpanded ? null : captured.id)}
                        >
                          <div className="flex items-center gap-3 p-3">
                            <div className="flex-shrink-0">
                              {getEventIcon(captured.event.event)}
                            </div>
                            <span className="flex-1 font-mono text-sm truncate">
                              {captured.event.event}
                            </span>
                            {isConversion && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            )}
                            <span className="text-xs opacity-70">
                              {timeDiff < 60 ? `${timeDiff}s ago` : `${Math.floor(timeDiff / 60)}m ago`}
                            </span>
                            <ChevronDown 
                              className={cn(
                                'w-4 h-4 transition-transform',
                                isExpanded && 'rotate-180'
                              )} 
                            />
                          </div>
                          
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: 'auto' }}
                                exit={{ height: 0 }}
                                className="overflow-hidden"
                              >
                                <pre className="p-3 text-xs bg-background/50 overflow-x-auto whitespace-pre-wrap break-all border-t border-border/50">
                                  {JSON.stringify(captured.event, null, 2)}
                                </pre>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Conversion Summary */}
          <Card className="bg-card/50">
            <CardHeader>
              <CardTitle className="text-lg">Conversion Summary</CardTitle>
              <CardDescription>Last 24 hours</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🏨</span>
                    <span className="text-sm">Bookings</span>
                  </div>
                  <span className="text-xl font-bold">{conversionMetrics.bookings}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">💬</span>
                    <span className="text-sm">WhatsApp</span>
                  </div>
                  <span className="text-xl font-bold">{conversionMetrics.whatsappEngaged}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📞</span>
                    <span className="text-sm">Calls</span>
                  </div>
                  <span className="text-xl font-bold">{conversionMetrics.callsEngaged}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🎯</span>
                    <span className="text-sm">Qualified Leads</span>
                  </div>
                  <span className="text-xl font-bold">{conversionMetrics.leadsQualified}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <h4 className="text-sm font-semibold mb-3">Consent Rates</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Analytics</span>
                    <span className="font-medium">{consentMetrics.analyticsRate}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Marketing</span>
                    <span className="font-medium">{consentMetrics.marketingRate}%</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <h4 className="text-sm font-semibold mb-3">Session Info</h4>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <p>Session: {events[0]?.event.session_id?.toString().substring(0, 16) || 'N/A'}...</p>
                  <p>Visitor: {events[0]?.event.visitor_id?.toString().substring(0, 16) || 'N/A'}...</p>
                  <p>Last Event: {gtmHealth.lastEventTime ? new Date(gtmHealth.lastEventTime).toLocaleTimeString() : 'Never'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </UnifiedAdminLayout>
  );
}
