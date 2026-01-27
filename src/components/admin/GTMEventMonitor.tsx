/**
 * GTM Event Monitor - Admin Dashboard Component
 * 
 * Real-time visibility into all GTM events being routed.
 * This is the "Backend GA4 Brain" UI.
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Activity, 
  Zap, 
  Target, 
  Clock, 
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  MousePointer,
  Navigation,
  MessageSquare,
  FileText,
  BarChart3
} from 'lucide-react';
import { useGTMMonitor, GTMEventRecord } from '@/hooks/useGTMMonitor';

// Category icons
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  page_navigation: <Navigation className="h-4 w-4" />,
  button_action: <MousePointer className="h-4 w-4" />,
  engagement: <Activity className="h-4 w-4" />,
  conversion: <Target className="h-4 w-4" />,
  session_quality: <TrendingUp className="h-4 w-4" />,
  form_interaction: <FileText className="h-4 w-4" />,
  error: <AlertCircle className="h-4 w-4" />,
};

// Priority colors
const PRIORITY_COLORS: Record<string, string> = {
  critical: 'bg-red-500/20 text-red-400 border-red-500/30',
  high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  medium: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  low: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

const EventRow: React.FC<{ event: GTMEventRecord }> = ({ event }) => {
  const time = new Date(event.timestamp).toLocaleTimeString();
  
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg bg-background/50 border border-border/50 hover:bg-background/80 transition-colors">
      <div className="flex-shrink-0">
        {CATEGORY_ICONS[event.category] || <Activity className="h-4 w-4" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm text-foreground truncate">
            {event.eventName}
          </span>
          {event.isConversion && (
            <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
              Conversion
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground truncate">
          {event.pagePath}
        </p>
      </div>
      <Badge variant="outline" className={`text-xs ${PRIORITY_COLORS[event.priority]}`}>
        {event.priority}
      </Badge>
      <span className="text-xs text-muted-foreground whitespace-nowrap">
        {time}
      </span>
    </div>
  );
};

const GTMEventMonitor: React.FC = () => {
  const {
    recentEvents,
    totalEvents,
    conversionEvents,
    eventsByCategory,
    topEvents,
    topPages,
    isHealthy,
    lastEventTime,
    eventsPerMinute,
    registeredTriggers,
    conversionEventNames,
  } = useGTMMonitor();
  
  const [activeTab, setActiveTab] = useState('live');

  return (
    <div className="space-y-6">
      {/* Health Status Bar */}
      <div className="flex items-center justify-between p-4 rounded-lg bg-card border border-border">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {isHealthy ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-yellow-500" />
            )}
            <span className="font-medium text-foreground">
              GTM Router {isHealthy ? 'Active' : 'Idle'}
            </span>
          </div>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Zap className="h-4 w-4" />
            <span>{eventsPerMinute} events/min</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="text-center">
            <p className="font-bold text-foreground">{totalEvents}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-green-500">{conversionEvents}</p>
            <p className="text-xs text-muted-foreground">Conversions</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-foreground">{Object.keys(registeredTriggers).length}</p>
            <p className="text-xs text-muted-foreground">Triggers</p>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="live" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Live Stream
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Categories
          </TabsTrigger>
          <TabsTrigger value="triggers" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Triggers
          </TabsTrigger>
          <TabsTrigger value="conversions" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Conversions
          </TabsTrigger>
        </TabsList>

        {/* Live Event Stream */}
        <TabsContent value="live" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Real-time Event Stream
                <Badge variant="outline" className="ml-2 bg-green-500/20 text-green-400">
                  {recentEvents.length} events
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-2">
                  {recentEvents.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No events yet. Navigate around to see them appear.</p>
                    </div>
                  ) : (
                    recentEvents.map(event => (
                      <EventRow key={event.id} event={event} />
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Category Breakdown */}
        <TabsContent value="categories" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Events by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {eventsByCategory.map(cat => (
                    <div key={cat.category} className="flex items-center justify-between p-2 rounded-lg bg-background/50">
                      <div className="flex items-center gap-2">
                        {CATEGORY_ICONS[cat.category]}
                        <span className="capitalize text-foreground">{cat.category.replace('_', ' ')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm text-muted-foreground">
                          {cat.events.length} triggers
                        </span>
                        <Badge variant="secondary">{cat.count}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Top Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {topEvents.map((event, i) => (
                    <div key={event.name} className="flex items-center justify-between p-2 rounded-lg bg-background/50">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground w-4">#{i + 1}</span>
                        <span className="font-mono text-sm text-foreground">{event.name}</span>
                      </div>
                      <Badge variant="outline">{event.count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Registered Triggers */}
        <TabsContent value="triggers" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Registered GTM Triggers
                <Badge variant="outline">{Object.keys(registeredTriggers).length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {Object.entries(registeredTriggers).map(([name, config]) => (
                    <div key={name} className="p-3 rounded-lg border border-border bg-background/50">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-sm text-foreground">{name}</span>
                        <Badge variant="outline" className={PRIORITY_COLORS[config.priority]}>
                          {config.priority}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {CATEGORY_ICONS[config.category]}
                        <span className="capitalize">{config.category.replace('_', ' ')}</span>
                        {config.isConversion && (
                          <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                            Conversion
                          </Badge>
                        )}
                        {config.requiresValidation && (
                          <Badge variant="outline" className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                            Validated
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Conversion Events */}
        <TabsContent value="conversions" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="h-4 w-4" />
                Conversion Events
                <Badge variant="outline" className="bg-green-500/20 text-green-400">
                  {conversionEventNames.length} registered
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {conversionEventNames.map(name => {
                  const config = registeredTriggers[name];
                  const eventStats = topEvents.find(e => e.name === name);
                  
                  return (
                    <div key={name} className="p-4 rounded-lg border border-green-500/20 bg-green-500/5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-sm font-medium text-foreground">{name}</span>
                        <Badge variant="outline" className="bg-green-500/20 text-green-400">
                          {eventStats?.count || 0} fired
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>Multiplier: {config?.valueMultiplier || 1}x</span>
                        {config?.requiresValidation && <span>• Requires Validation</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border">
                <h4 className="font-medium text-foreground mb-2">GTM Conversion Flow</h4>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>User action triggers event in component</li>
                  <li>GTM Router validates & captures (Admin sees first)</li>
                  <li>Event pushed to dataLayer</li>
                  <li>GTM (GTM-5FXJ9QBK) routes to GA4 (G-SJY2WX6L4B)</li>
                  <li>Validated conversions sent to Google Ads (AW-17352497815)</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GTMEventMonitor;
