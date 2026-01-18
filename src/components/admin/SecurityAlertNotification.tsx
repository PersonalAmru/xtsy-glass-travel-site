/**
 * Real-time Security Alert Notification Component
 * Shows popup alerts for critical security events
 */

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Shield, MapPin, Monitor, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface SecurityAlert {
  id: string;
  alert_title: string;
  alert_message: string;
  severity: string;
  created_at: string;
  is_read: boolean;
  security_intrusion_logs?: {
    email: string;
    ip_address: string;
    geo_location: {
      country?: string;
      city?: string;
      region?: string;
    };
    device_info: {
      browser?: string;
      os?: string;
      deviceType?: string;
    };
    event_type: string;
    device_fingerprint: string;
    created_at: string;
  };
}

export function SecurityAlertNotification() {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [expandedAlert, setExpandedAlert] = useState<string | null>(null);

  // Fetch initial unread alerts
  const fetchAlerts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('admin_security_alerts')
        .select('*, security_intrusion_logs:intrusion_log_id(*)')
        .eq('is_read', false)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('[SecurityAlerts] Fetch error:', error);
        return;
      }

      if (data && data.length > 0) {
        setAlerts(data as unknown as SecurityAlert[]);
      }
    } catch (e) {
      console.error('[SecurityAlerts] Exception:', e);
    }
  }, []);

  // Subscribe to real-time security alerts
  useEffect(() => {
    fetchAlerts();

    // Set up real-time subscription
    const channel = supabase
      .channel('security-alerts')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'admin_security_alerts',
        },
        async (payload) => {
          console.log('[SecurityAlerts] New alert received:', payload);
          
          // Fetch the full alert with related log
          const { data } = await supabase
            .from('admin_security_alerts')
            .select('*, security_intrusion_logs:intrusion_log_id(*)')
            .eq('id', payload.new.id)
            .single();

          if (data) {
            const newAlert = data as unknown as SecurityAlert;
            setAlerts((prev) => [newAlert, ...prev.slice(0, 9)]);
            
            // Show toast notification
            toast.error(
              <div className="flex flex-col gap-1">
                <span className="font-bold">{newAlert.alert_title}</span>
                <span className="text-sm">{newAlert.alert_message}</span>
              </div>,
              {
                duration: 10000,
                icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
              }
            );
            
            // Play alert sound (if available)
            try {
              const audio = new Audio('/alert-sound.mp3');
              audio.volume = 0.5;
              audio.play().catch(() => {});
            } catch {}
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchAlerts]);

  // Mark alert as read
  const dismissAlert = async (alertId: string) => {
    try {
      await supabase
        .from('admin_security_alerts')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('id', alertId);

      setAlerts((prev) => prev.filter((a) => a.id !== alertId));
    } catch (e) {
      console.error('[SecurityAlerts] Dismiss error:', e);
    }
  };

  // Acknowledge intrusion log
  const acknowledgeIntrusion = async (alertId: string, logId: string) => {
    try {
      await supabase
        .from('security_intrusion_logs')
        .update({ 
          is_acknowledged: true, 
          acknowledged_at: new Date().toISOString() 
        })
        .eq('id', logId);

      await dismissAlert(alertId);
      toast.success('Alert acknowledged');
    } catch (e) {
      console.error('[SecurityAlerts] Acknowledge error:', e);
    }
  };

  if (alerts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 max-w-md">
      <AnimatePresence mode="popLayout">
        {alerts.map((alert) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: 100, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`
              relative backdrop-blur-xl rounded-xl border shadow-2xl overflow-hidden
              ${alert.severity === 'critical' 
                ? 'bg-red-950/90 border-red-500/50' 
                : alert.severity === 'high'
                  ? 'bg-orange-950/90 border-orange-500/50'
                  : 'bg-yellow-950/90 border-yellow-500/50'
              }
            `}
          >
            {/* Animated border glow */}
            <div 
              className={`
                absolute inset-0 opacity-20 animate-pulse
                ${alert.severity === 'critical' 
                  ? 'bg-gradient-to-r from-red-500 via-transparent to-red-500' 
                  : 'bg-gradient-to-r from-orange-500 via-transparent to-orange-500'
                }
              `}
            />
            
            <div className="relative p-4">
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <div className={`
                    p-2 rounded-lg animate-pulse
                    ${alert.severity === 'critical' ? 'bg-red-500/20' : 'bg-orange-500/20'}
                  `}>
                    <Shield className={`
                      w-5 h-5
                      ${alert.severity === 'critical' ? 'text-red-400' : 'text-orange-400'}
                    `} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{alert.alert_title}</h4>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(alert.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => dismissAlert(alert.id)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Alert Message */}
              <p className="text-sm text-slate-300 mb-3">{alert.alert_message}</p>

              {/* Device Details (expandable) */}
              {alert.security_intrusion_logs && (
                <>
                  <button
                    onClick={() => setExpandedAlert(expandedAlert === alert.id ? null : alert.id)}
                    className="text-xs text-blue-400 hover:text-blue-300 mb-2"
                  >
                    {expandedAlert === alert.id ? 'Hide Details' : 'Show Full Details'}
                  </button>
                  
                  <AnimatePresence>
                    {expandedAlert === alert.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="bg-black/30 rounded-lg p-3 space-y-2 text-xs">
                          <div className="flex items-center gap-2 text-slate-400">
                            <MapPin className="w-4 h-4" />
                            <span>
                              {alert.security_intrusion_logs.geo_location?.city || 'Unknown'}, 
                              {' '}{alert.security_intrusion_logs.geo_location?.region || ''} 
                              {' '}{alert.security_intrusion_logs.geo_location?.country || 'Unknown'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-400">
                            <Monitor className="w-4 h-4" />
                            <span>
                              {alert.security_intrusion_logs.device_info?.browser || 'Unknown'} on{' '}
                              {alert.security_intrusion_logs.device_info?.os || 'Unknown'}{' '}
                              ({alert.security_intrusion_logs.device_info?.deviceType || 'unknown'})
                            </span>
                          </div>
                          <div className="pt-2 border-t border-white/10">
                            <span className="text-slate-500">Email:</span>
                            <span className="text-white ml-2 font-mono">
                              {alert.security_intrusion_logs.email || 'N/A'}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500">IP:</span>
                            <span className="text-white ml-2 font-mono">
                              {alert.security_intrusion_logs.ip_address || 'N/A'}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500">Fingerprint:</span>
                            <span className="text-white ml-2 font-mono text-[10px]">
                              {alert.security_intrusion_logs.device_fingerprint || 'N/A'}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}

              {/* Actions */}
              <div className="flex gap-2 mt-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => dismissAlert(alert.id)}
                  className="flex-1 text-xs h-8 border-white/20 hover:bg-white/10"
                >
                  Dismiss
                </Button>
                {alert.security_intrusion_logs && (
                  <Button
                    size="sm"
                    onClick={() => acknowledgeIntrusion(alert.id, (alert.security_intrusion_logs as any).id)}
                    className={`
                      flex-1 text-xs h-8
                      ${alert.severity === 'critical' 
                        ? 'bg-red-600 hover:bg-red-700' 
                        : 'bg-orange-600 hover:bg-orange-700'
                      }
                    `}
                  >
                    Acknowledge
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default SecurityAlertNotification;
