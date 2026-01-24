/**
 * Analytics Debug Panel
 * Floating panel for developers to monitor dataLayer events in real-time
 * Only visible in development or when debug mode is enabled
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Minimize2,
  Maximize2,
  Trash2,
  Download,
  Filter,
  Bug,
  Zap,
  Eye,
  Shield,
  Tag,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

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
  page_view: <Eye className="w-3 h-3" />,
  consent_update: <Shield className="w-3 h-3" />,
  booking_confirmed: <Zap className="w-3 h-3" />,
  whatsapp_engaged_validated: <Zap className="w-3 h-3" />,
  call_engaged_validated: <Zap className="w-3 h-3" />,
  lead_qualified: <Zap className="w-3 h-3" />,
  default: <Tag className="w-3 h-3" />,
};

export function AnalyticsDebugPanel() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [events, setEvents] = useState<CapturedEvent[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Check if debug mode is enabled
  useEffect(() => {
    const checkDebugMode = () => {
      const isDebug = localStorage.getItem('xtsy_debug_mode') === 'true';
      const isDev = process.env.NODE_ENV === 'development';
      setIsVisible(isDebug || isDev);
    };

    checkDebugMode();
    
    // Listen for debug mode changes
    window.addEventListener('storage', checkDebugMode);
    window.addEventListener('xtsy-debug-toggle', checkDebugMode);
    
    return () => {
      window.removeEventListener('storage', checkDebugMode);
      window.removeEventListener('xtsy-debug-toggle', checkDebugMode);
    };
  }, []);

  // Keyboard shortcut (Ctrl+Shift+D)
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        const current = localStorage.getItem('xtsy_debug_mode') === 'true';
        localStorage.setItem('xtsy_debug_mode', (!current).toString());
        setIsVisible(!current);
        window.dispatchEvent(new CustomEvent('xtsy-debug-toggle'));
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, []);

  // Listen to dataLayer events
  useEffect(() => {
    if (!isVisible) return;

    const handleEvent = (e: CustomEvent<DataLayerEvent>) => {
      const capturedEvent: CapturedEvent = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        event: e.detail,
        capturedAt: Date.now(),
      };
      
      setEvents(prev => [capturedEvent, ...prev].slice(0, 100));
    };

    window.addEventListener('datalayer-push' as any, handleEvent);
    return () => window.removeEventListener('datalayer-push' as any, handleEvent);
  }, [isVisible]);

  // Auto-cleanup old events (older than 5 minutes)
  useEffect(() => {
    const cleanup = setInterval(() => {
      const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
      setEvents(prev => prev.filter(e => e.capturedAt > fiveMinutesAgo));
    }, 30000);

    return () => clearInterval(cleanup);
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
      ? events.filter(e => ['booking_confirmed', 'whatsapp_engaged_validated', 'call_engaged_validated', 'lead_qualified'].includes(e.event.event))
      : events.filter(e => e.event.event === filter);

  const getEventColor = (eventName: string) => {
    return EVENT_COLORS[eventName] || EVENT_COLORS.default;
  };

  const getEventIcon = (eventName: string) => {
    return EVENT_ICONS[eventName] || EVENT_ICONS.default;
  };

  const uniqueEventTypes = Array.from(new Set(events.map(e => e.event.event)));

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className={cn(
          'fixed bottom-4 right-4 z-[9999] bg-card/95 backdrop-blur-xl rounded-2xl border border-border shadow-2xl',
          isMinimized ? 'w-auto' : 'w-[400px]'
        )}
        style={{ maxHeight: isMinimized ? 'auto' : '500px' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-border/50">
          <div className="flex items-center gap-2">
            <Bug className="w-4 h-4 text-primary" />
            <span className="font-semibold text-sm">DataLayer Debug</span>
            <Badge variant="outline" className="text-xs">
              {events.length}
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            {!isMinimized && (
              <>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={clearEvents}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={exportEvents}>
                  <Download className="w-3.5 h-3.5" />
                </Button>
              </>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7"
              onClick={() => {
                localStorage.setItem('xtsy_debug_mode', 'false');
                setIsVisible(false);
                window.dispatchEvent(new CustomEvent('xtsy-debug-toggle'));
              }}
            >
              <X className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Filter */}
            <div className="p-2 border-b border-border/50">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="h-8 text-xs">
                  <Filter className="w-3 h-3 mr-2" />
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

            {/* Events List */}
            <ScrollArea className="h-[350px] p-2" ref={scrollRef}>
              {filteredEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <Bug className="w-8 h-8 mb-2 opacity-50" />
                  <p className="text-sm">No events captured</p>
                  <p className="text-xs">Events will appear here</p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {filteredEvents.map((captured) => {
                    const isExpanded = expandedEvent === captured.id;
                    const timeDiff = Math.round((Date.now() - captured.capturedAt) / 1000);
                    
                    return (
                      <motion.div
                        key={captured.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={cn(
                          'rounded-lg border overflow-hidden cursor-pointer transition-colors',
                          getEventColor(captured.event.event)
                        )}
                        onClick={() => setExpandedEvent(isExpanded ? null : captured.id)}
                      >
                        <div className="flex items-center gap-2 p-2">
                          <div className="flex-shrink-0">
                            {getEventIcon(captured.event.event)}
                          </div>
                          <span className="flex-1 font-mono text-xs truncate">
                            {captured.event.event}
                          </span>
                          <span className="text-[10px] opacity-70">
                            {timeDiff}s
                          </span>
                          <ChevronDown 
                            className={cn(
                              'w-3 h-3 transition-transform',
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
                              <pre className="p-2 text-[10px] bg-black/20 overflow-x-auto whitespace-pre-wrap break-all">
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

            {/* Footer */}
            <div className="p-2 border-t border-border/50 text-[10px] text-muted-foreground flex items-center justify-between">
              <span>Session: {events[0]?.event.session_id?.substring(0, 12) || 'N/A'}...</span>
              <span>Ctrl+Shift+D to toggle</span>
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export default AnalyticsDebugPanel;
