/**
 * GTM Status Widget
 * Real-time monitoring of GTM configuration health and conversion tracking
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  RefreshCw, 
  ChevronDown,
  ChevronUp,
  Activity,
  Shield,
  Tag,
  Zap
} from 'lucide-react';
import { useGTMAnalytics } from '@/hooks/useGTMAnalytics';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface LiveEvent {
  event: string;
  timestamp: string;
  [key: string]: unknown;
}

const CONVERSION_EVENTS = [
  { key: 'booking_confirmed', label: 'Bookings', icon: '🏨' },
  { key: 'whatsapp_engaged_validated', label: 'WhatsApp', icon: '💬' },
  { key: 'call_engaged_validated', label: 'Calls', icon: '📞' },
  { key: 'lead_qualified', label: 'Leads', icon: '🎯' },
];

export function GTMStatusWidget({ className }: { className?: string }) {
  const { gtmHealth, conversionMetrics, consentMetrics, liveEvents, refresh, loading } = useGTMAnalytics(1); // Last 24h
  const [expanded, setExpanded] = useState(false);
  const [recentEvents, setRecentEvents] = useState<LiveEvent[]>([]);

  // Listen to live dataLayer events
  useEffect(() => {
    const handleEvent = (e: CustomEvent<LiveEvent>) => {
      setRecentEvents(prev => [e.detail, ...prev].slice(0, 10));
    };

    window.addEventListener('datalayer-push' as any, handleEvent);
    return () => window.removeEventListener('datalayer-push' as any, handleEvent);
  }, []);

  const allEvents = [...recentEvents, ...liveEvents].slice(0, 15);
  const conversionEvents = allEvents.filter(e => 
    CONVERSION_EVENTS.some(ce => e.event === ce.key)
  );

  const getHealthColor = () => {
    if (!gtmHealth.containerActive) return 'text-red-500';
    if (gtmHealth.eventsInSession < 3) return 'text-amber-500';
    return 'text-emerald-500';
  };

  const getHealthLabel = () => {
    if (!gtmHealth.containerActive) return 'Inactive';
    if (gtmHealth.eventsInSession < 3) return 'Low Activity';
    return 'Healthy';
  };

  return (
    <div className={cn(
      'rounded-2xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden',
      className
    )}>
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center',
            gtmHealth.containerActive ? 'bg-emerald-500/10' : 'bg-red-500/10'
          )}>
            <Tag className={cn('w-5 h-5', getHealthColor())} />
          </div>
          <div>
            <h3 className="font-semibold text-sm">GTM Health Status</h3>
            <div className="flex items-center gap-2">
              <span className={cn('text-xs font-medium', getHealthColor())}>
                {getHealthLabel()}
              </span>
              <span className="text-xs text-muted-foreground">
                {gtmHealth.containerId}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={refresh}
            disabled={loading}
          >
            <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Consent Status Bar */}
      <div className="px-4 py-3 flex items-center gap-4 border-b border-border/50 bg-muted/30">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs font-medium">Consent:</span>
        </div>
        <div className="flex items-center gap-3">
          <Badge 
            variant={gtmHealth.consentState.analytics ? 'default' : 'secondary'}
            className={cn(
              'text-xs',
              gtmHealth.consentState.analytics 
                ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                : 'bg-muted text-muted-foreground'
            )}
          >
            Analytics {gtmHealth.consentState.analytics ? '✓' : '✗'}
          </Badge>
          <Badge 
            variant={gtmHealth.consentState.marketing ? 'default' : 'secondary'}
            className={cn(
              'text-xs',
              gtmHealth.consentState.marketing 
                ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' 
                : 'bg-muted text-muted-foreground'
            )}
          >
            Marketing {gtmHealth.consentState.marketing ? '✓' : '✗'}
          </Badge>
        </div>
        <div className="ml-auto text-xs text-muted-foreground">
          {consentMetrics.analyticsRate}% analytics consent rate
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 divide-x divide-border/50">
        {CONVERSION_EVENTS.map((event, idx) => {
          const count = event.key === 'booking_confirmed' ? conversionMetrics.bookings :
                        event.key === 'whatsapp_engaged_validated' ? conversionMetrics.whatsappEngaged :
                        event.key === 'call_engaged_validated' ? conversionMetrics.callsEngaged :
                        conversionMetrics.leadsQualified;
          
          return (
            <div key={event.key} className="p-3 text-center">
              <div className="text-lg mb-1">{event.icon}</div>
              <p className="text-lg font-bold">{count}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{event.label}</p>
            </div>
          );
        })}
      </div>

      {/* Expanded Section */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-border/50 overflow-hidden"
          >
            {/* Recent Events */}
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-4 h-4 text-primary" />
                <h4 className="text-sm font-semibold">Recent Events</h4>
                <Badge variant="outline" className="text-xs ml-auto">
                  {gtmHealth.eventsInSession} in session
                </Badge>
              </div>

              {allEvents.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground text-sm">
                  No events captured yet
                </div>
              ) : (
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {allEvents.slice(0, 8).map((event, idx) => {
                    const isConversion = CONVERSION_EVENTS.some(ce => ce.key === event.event);
                    const timeDiff = event.timestamp 
                      ? Math.round((Date.now() - new Date(event.timestamp).getTime()) / 1000)
                      : null;
                    
                    return (
                      <motion.div
                        key={`${event.event}-${idx}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className={cn(
                          'flex items-center gap-3 p-2 rounded-lg',
                          isConversion ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-muted/50'
                        )}
                      >
                        <div className={cn(
                          'w-2 h-2 rounded-full',
                          isConversion ? 'bg-emerald-500' : 'bg-muted-foreground'
                        )} />
                        <span className={cn(
                          'text-xs font-mono flex-1 truncate',
                          isConversion ? 'text-emerald-400' : 'text-muted-foreground'
                        )}>
                          {event.event}
                        </span>
                        {isConversion && (
                          <Zap className="w-3 h-3 text-emerald-500" />
                        )}
                        {timeDiff !== null && (
                          <span className="text-[10px] text-muted-foreground">
                            {timeDiff < 60 ? `${timeDiff}s ago` : `${Math.floor(timeDiff / 60)}m ago`}
                          </span>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Session Info */}
            <div className="px-4 pb-4">
              <div className="p-3 rounded-lg bg-muted/30 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Session Events</span>
                  <span className="font-medium">{gtmHealth.eventsInSession}</span>
                </div>
                <Progress 
                  value={Math.min(gtmHealth.eventsInSession * 5, 100)} 
                  className="h-1.5"
                />
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Last Event</span>
                  <span className="font-medium">
                    {gtmHealth.lastEventTime 
                      ? new Date(gtmHealth.lastEventTime).toLocaleTimeString()
                      : 'Never'
                    }
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default GTMStatusWidget;
