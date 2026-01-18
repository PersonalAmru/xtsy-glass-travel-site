/**
 * Live Traffic Command Center
 * Admin's primary analytics dashboard - SOURCE OF TRUTH
 * Real-time monitoring, session intelligence, and traffic defense
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Users,
  Eye,
  AlertTriangle,
  Shield,
  Smartphone,
  Monitor,
  Tablet,
  Globe,
  Clock,
  TrendingUp,
  TrendingDown,
  Target,
  Zap,
  Bot,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ChevronRight,
  MapPin,
  Flame,
  Sparkles,
} from 'lucide-react';
import { UnifiedAdminLayout } from '@/layouts/UnifiedAdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { AppleCard } from '@/components/admin/AppleCard';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { format, formatDistanceToNow } from 'date-fns';

// =============================================
// TYPE DEFINITIONS
// =============================================

interface LiveSession {
  id: string;
  session_id: string;
  visitor_id: string;
  device_type: 'mobile' | 'tablet' | 'desktop';
  operating_system: string;
  user_device_tier: 'premium' | 'standard' | 'neutral';
  browser: string;
  country: string;
  country_code: string;
  state: string;
  city: string;
  duration_seconds: number;
  page_views: number;
  max_scroll_depth: number;
  bot_likelihood_score: number;
  traffic_quality: 'high' | 'medium' | 'low' | 'junk';
  unified_intent_score: number;
  intent_category: 'junk' | 'low' | 'medium' | 'high' | 'hot';
  landing_page: string;
  exit_page: string | null;
  referrer_source: string;
  referrer_medium: string;
  created_at: string;
  last_activity_at: string;
  is_bounce: boolean;
}

interface TrafficStats {
  totalSessions: number;
  activeSessions: number;
  junkTraffic: number;
  validTraffic: number;
  avgIntentScore: number;
  hotLeads: number;
  botDetected: number;
  conversionRate: number;
}

interface GeoData {
  country: string;
  country_code: string;
  sessions: number;
  avgIntent: number;
}

// =============================================
// UTILITY FUNCTIONS
// =============================================

const formatDuration = (seconds: number): string => {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
};

const getDeviceIcon = (type: string) => {
  switch (type) {
    case 'mobile': return Smartphone;
    case 'tablet': return Tablet;
    default: return Monitor;
  }
};

const getIntentColor = (category: string) => {
  switch (category) {
    case 'hot': return 'text-orange-500 bg-orange-500/10';
    case 'high': return 'text-green-500 bg-green-500/10';
    case 'medium': return 'text-blue-500 bg-blue-500/10';
    case 'low': return 'text-yellow-500 bg-yellow-500/10';
    case 'junk': return 'text-red-500 bg-red-500/10';
    default: return 'text-muted-foreground bg-muted';
  }
};

const getQualityColor = (quality: string) => {
  switch (quality) {
    case 'high': return 'text-emerald-500';
    case 'medium': return 'text-blue-500';
    case 'low': return 'text-yellow-500';
    case 'junk': return 'text-red-500';
    default: return 'text-muted-foreground';
  }
};

const getTierBadge = (tier: string) => {
  switch (tier) {
    case 'premium': return { label: 'iOS', color: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' };
    case 'standard': return { label: 'Android', color: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' };
    default: return { label: 'Desktop', color: 'bg-slate-500/20 text-slate-600' };
  }
};

// =============================================
// COMPONENTS
// =============================================

const MetricCard: React.FC<{
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  trend?: { value: number; isPositive: boolean };
  color?: string;
  loading?: boolean;
}> = ({ title, value, subtitle, icon: Icon, trend, color = 'primary', loading }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="relative overflow-hidden rounded-2xl bg-card border border-border p-5"
  >
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        {loading ? (
          <Skeleton className="h-8 w-24 mt-1" />
        ) : (
          <p className="text-3xl font-bold mt-1">{value}</p>
        )}
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
        {trend && (
          <div className={`flex items-center gap-1 mt-2 text-xs ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {trend.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
      <div className={`w-12 h-12 rounded-xl bg-${color}/10 flex items-center justify-center`}>
        <Icon className={`w-6 h-6 text-${color}`} />
      </div>
    </div>
  </motion.div>
);

const SessionRow: React.FC<{ session: LiveSession; onSelect: (s: LiveSession) => void }> = ({ session, onSelect }) => {
  const DeviceIcon = getDeviceIcon(session.device_type);
  const tierBadge = getTierBadge(session.user_device_tier);
  const isActive = session.last_activity_at && 
    (Date.now() - new Date(session.last_activity_at).getTime()) < 5 * 60 * 1000;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      onClick={() => onSelect(session)}
      className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 cursor-pointer transition-all group border border-transparent hover:border-border"
    >
      {/* Status Indicator */}
      <div className="relative">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
          session.traffic_quality === 'junk' ? 'bg-red-500/10' : 'bg-muted'
        }`}>
          <DeviceIcon className={`w-5 h-5 ${getQualityColor(session.traffic_quality)}`} />
        </div>
        {isActive && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background animate-pulse" />
        )}
      </div>
      
      {/* Device Tier */}
      <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${tierBadge.color}`}>
        {tierBadge.label}
      </span>
      
      {/* Location */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium truncate">
            {session.city || session.state || 'Unknown'}
          </span>
          <span className="text-xs text-muted-foreground">
            {session.country_code || '??'}
          </span>
        </div>
        <p className="text-xs text-muted-foreground truncate">
          {session.landing_page}
        </p>
      </div>
      
      {/* Duration */}
      <div className="text-right">
        <p className="text-sm font-medium">{formatDuration(session.duration_seconds || 0)}</p>
        <p className="text-xs text-muted-foreground">{session.page_views || 0} pages</p>
      </div>
      
      {/* Intent Category */}
      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getIntentColor(session.intent_category)}`}>
        {session.intent_category?.toUpperCase() || 'LOW'}
      </span>
      
      {/* Bot Warning */}
      {session.bot_likelihood_score > 50 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Bot className="w-4 h-4 text-amber-500" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Bot likelihood: {session.bot_likelihood_score}%</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      
      <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
};

const SessionDrilldown: React.FC<{ session: LiveSession | null; onClose: () => void }> = ({ session, onClose }) => {
  if (!session) return null;
  
  const tierBadge = getTierBadge(session.user_device_tier);
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="h-full flex flex-col"
    >
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="font-semibold">Session Details</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>×</Button>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {/* Session Overview */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${tierBadge.color}`}>
                {tierBadge.label}
              </span>
              <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getIntentColor(session.intent_category)}`}>
                {session.intent_category?.toUpperCase()}
              </span>
              {session.bot_likelihood_score > 50 && (
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-500">
                  BOT RISK
                </span>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">Device</p>
                <p className="font-medium">{session.device_type} / {session.operating_system}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Browser</p>
                <p className="font-medium">{session.browser}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Location</p>
                <p className="font-medium">{session.city}, {session.state}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Country</p>
                <p className="font-medium">{session.country}</p>
              </div>
            </div>
          </div>
          
          {/* Scores */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-muted-foreground">Quality Scores</h4>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Intent Score</span>
                  <span className="font-semibold">{session.unified_intent_score || 0}/100</span>
                </div>
                <Progress value={session.unified_intent_score || 0} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Bot Likelihood</span>
                  <span className={`font-semibold ${session.bot_likelihood_score > 50 ? 'text-red-500' : ''}`}>
                    {session.bot_likelihood_score || 0}%
                  </span>
                </div>
                <Progress 
                  value={session.bot_likelihood_score || 0} 
                  className={`h-2 ${session.bot_likelihood_score > 50 ? '[&>div]:bg-red-500' : ''}`} 
                />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Scroll Depth</span>
                  <span className="font-semibold">{session.max_scroll_depth || 0}%</span>
                </div>
                <Progress value={session.max_scroll_depth || 0} className="h-2" />
              </div>
            </div>
          </div>
          
          {/* Journey */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-muted-foreground">Journey</h4>
            
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Target className="w-3 h-3 text-green-500" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Entry</p>
                  <p className="text-sm font-medium truncate">{session.landing_page}</p>
                </div>
              </div>
              
              {session.exit_page && session.exit_page !== session.landing_page && (
                <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                  <div className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center">
                    <XCircle className="w-3 h-3 text-red-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Exit</p>
                    <p className="text-sm font-medium truncate">{session.exit_page}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Source */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-muted-foreground">Traffic Source</h4>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-sm">
                <span className="font-medium">{session.referrer_source || 'Direct'}</span>
                <span className="text-muted-foreground"> / </span>
                <span>{session.referrer_medium || 'none'}</span>
              </p>
            </div>
          </div>
          
          {/* Timestamps */}
          <div className="space-y-2 text-xs text-muted-foreground">
            <p>Started: {session.created_at ? format(new Date(session.created_at), 'PPpp') : '-'}</p>
            <p>Last Activity: {session.last_activity_at ? formatDistanceToNow(new Date(session.last_activity_at), { addSuffix: true }) : '-'}</p>
          </div>
        </div>
      </ScrollArea>
    </motion.div>
  );
};

// =============================================
// MAIN COMPONENT
// =============================================

const LiveTrafficCommandCenter: React.FC = () => {
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<LiveSession | null>(null);
  const [stats, setStats] = useState<TrafficStats>({
    totalSessions: 0,
    activeSessions: 0,
    junkTraffic: 0,
    validTraffic: 0,
    avgIntentScore: 0,
    hotLeads: 0,
    botDetected: 0,
    conversionRate: 0,
  });
  const [geoData, setGeoData] = useState<GeoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  
  const fetchData = useCallback(async () => {
    try {
      // Fetch recent sessions (last 24 hours)
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('traffic_sessions')
        .select('*')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (sessionsError) {
        console.error('Error fetching sessions:', sessionsError);
        return;
      }
      
      const typedSessions = (sessionsData || []) as unknown as LiveSession[];
      setSessions(typedSessions);
      
      // Calculate stats
      const now = Date.now();
      const fiveMinAgo = now - 5 * 60 * 1000;
      
      const activeSessions = typedSessions.filter(s => 
        s.last_activity_at && new Date(s.last_activity_at).getTime() > fiveMinAgo
      ).length;
      
      const junkCount = typedSessions.filter(s => s.traffic_quality === 'junk').length;
      const hotCount = typedSessions.filter(s => s.intent_category === 'hot').length;
      const botCount = typedSessions.filter(s => s.bot_likelihood_score > 70).length;
      const avgIntent = typedSessions.length > 0
        ? Math.round(typedSessions.reduce((sum, s) => sum + (s.unified_intent_score || 0), 0) / typedSessions.length)
        : 0;
      
      setStats({
        totalSessions: typedSessions.length,
        activeSessions,
        junkTraffic: junkCount,
        validTraffic: typedSessions.length - junkCount,
        avgIntentScore: avgIntent,
        hotLeads: hotCount,
        botDetected: botCount,
        conversionRate: typedSessions.length > 0 ? Math.round((hotCount / typedSessions.length) * 100) : 0,
      });
      
      // Calculate geo data
      const geoMap = new Map<string, { sessions: number; totalIntent: number }>();
      typedSessions.forEach(s => {
        const key = s.country || 'Unknown';
        const existing = geoMap.get(key) || { sessions: 0, totalIntent: 0 };
        geoMap.set(key, {
          sessions: existing.sessions + 1,
          totalIntent: existing.totalIntent + (s.unified_intent_score || 0),
        });
      });
      
      const geoArr = Array.from(geoMap.entries())
        .map(([country, data]) => ({
          country,
          country_code: typedSessions.find(s => s.country === country)?.country_code || '??',
          sessions: data.sessions,
          avgIntent: Math.round(data.totalIntent / data.sessions),
        }))
        .sort((a, b) => b.sessions - a.sessions)
        .slice(0, 10);
      
      setGeoData(geoArr);
      setLastRefresh(new Date());
    } catch (err) {
      console.error('Error fetching traffic data:', err);
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel('traffic-sessions')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'traffic_sessions' },
        () => {
          fetchData();
        }
      )
      .subscribe();
    
    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [fetchData]);
  
  const junkPercentage = stats.totalSessions > 0 
    ? Math.round((stats.junkTraffic / stats.totalSessions) * 100) 
    : 0;
  
  return (
    <UnifiedAdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Live Traffic Command Center</h1>
          <p className="text-sm text-muted-foreground">Real-time traffic intelligence • Admin is SOURCE OF TRUTH</p>
        </div>
        
        {/* Top Bar - Live Stats */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-primary/5 via-transparent to-transparent border border-border">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Activity className="w-6 h-6 text-primary" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.activeSessions}</p>
              <p className="text-xs text-muted-foreground">Active Now</p>
            </div>
          </div>
          
          <div className="h-10 w-px bg-border" />
          
          <div className="flex items-center gap-2">
            <div className={`px-3 py-1.5 rounded-lg ${junkPercentage > 30 ? 'bg-red-500/10' : 'bg-green-500/10'}`}>
              <span className={`text-sm font-semibold ${junkPercentage > 30 ? 'text-red-500' : 'text-green-500'}`}>
                {100 - junkPercentage}% Valid
              </span>
            </div>
            <span className="text-xs text-muted-foreground">Traffic Quality</span>
          </div>
          
          <div className="h-10 w-px bg-border" />
          
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-500" />
            <div>
              <span className="text-lg font-bold">{stats.avgIntentScore}</span>
              <span className="text-xs text-muted-foreground ml-1">Avg Intent</span>
            </div>
          </div>
          
          <div className="flex-1" />
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Updated {formatDistanceToNow(lastRefresh, { addSuffix: true })}</span>
          </div>
          
          <Button variant="outline" size="sm" onClick={fetchData} className="gap-2">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        
        {/* Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard
            title="Total Sessions (24h)"
            value={stats.totalSessions}
            icon={Users}
            loading={loading}
          />
          <MetricCard
            title="Hot Leads"
            value={stats.hotLeads}
            subtitle="High intent visitors"
            icon={Flame}
            color="orange-500"
            loading={loading}
          />
          <MetricCard
            title="Bot Detected"
            value={stats.botDetected}
            subtitle="Flagged sessions"
            icon={Bot}
            color="amber-500"
            loading={loading}
          />
          <MetricCard
            title="Junk Traffic"
            value={`${junkPercentage}%`}
            subtitle={`${stats.junkTraffic} sessions`}
            icon={AlertTriangle}
            color="red-500"
            loading={loading}
          />
        </div>
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Live Sessions */}
          <div className="lg:col-span-2">
            <AppleCard className="h-[600px] flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Live Sessions</h3>
                  <Badge variant="outline" className="text-xs">
                    {sessions.length} total
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="gap-1">
                    <Sparkles className="w-3 h-3" />
                    Premium: {sessions.filter(s => s.user_device_tier === 'premium').length}
                  </Badge>
                </div>
              </div>
              
              <ScrollArea className="flex-1 p-2">
                {loading ? (
                  <div className="space-y-3 p-2">
                    {[...Array(8)].map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full rounded-xl" />
                    ))}
                  </div>
                ) : sessions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <Activity className="w-12 h-12 mb-3 opacity-50" />
                    <p className="text-sm">No sessions in the last 24 hours</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {sessions.map(session => (
                      <SessionRow
                        key={session.id}
                        session={session}
                        onSelect={setSelectedSession}
                      />
                    ))}
                  </div>
                )}
              </ScrollArea>
            </AppleCard>
          </div>
          
          {/* Right Panel - Session Drilldown or Geo Stats */}
          <div className="lg:col-span-1">
            <AnimatePresence mode="wait">
              {selectedSession ? (
                <AppleCard key="drilldown" className="h-[600px]">
                  <SessionDrilldown
                    session={selectedSession}
                    onClose={() => setSelectedSession(null)}
                  />
                </AppleCard>
              ) : (
                <AppleCard key="geo" className="h-[600px] flex flex-col">
                  <div className="flex items-center gap-3 p-4 border-b border-border">
                    <Globe className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold">Geographic Distribution</h3>
                  </div>
                  
                  <ScrollArea className="flex-1 p-4">
                    {geoData.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                        <MapPin className="w-12 h-12 mb-3 opacity-50" />
                        <p className="text-sm">No geographic data</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {geoData.map((geo, idx) => (
                          <div
                            key={geo.country}
                            className="flex items-center gap-3 p-3 rounded-xl bg-muted/30"
                          >
                            <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold">
                              {idx + 1}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{geo.country}</p>
                              <p className="text-xs text-muted-foreground">
                                {geo.sessions} sessions • Avg Intent: {geo.avgIntent}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold">{geo.sessions}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                  
                  {/* Traffic Defense Status */}
                  <div className="p-4 border-t border-border">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-green-500/10">
                      <Shield className="w-5 h-5 text-green-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-green-600">Traffic Defense Active</p>
                        <p className="text-xs text-green-500/80">3-layer protection enabled</p>
                      </div>
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    </div>
                  </div>
                </AppleCard>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </UnifiedAdminLayout>
  );
};

export default LiveTrafficCommandCenter;
