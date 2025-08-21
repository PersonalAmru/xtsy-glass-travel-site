import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, Eye, Users, TrendingUp, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SecurityMetrics {
  total_bookings_24h: number;
  unique_users_24h: number;
  high_value_bookings_24h: number;
  suspicious_ratio: number;
  alert_level: 'LOW' | 'MEDIUM' | 'HIGH';
}

interface AuditLog {
  id: string;
  booking_id: string;
  action_type: string;
  user_email: string;
  user_ip: string;
  user_agent: string;
  accessed_fields: string[];
  created_at: string;
}

interface SuspiciousActivity {
  suspicious_indicators: string[];
  risk_score: number;
  recent_bookings_count: number;
}

const SecurityDashboardEnhanced: React.FC = () => {
  const [metrics, setMetrics] = useState<SecurityMetrics | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingEmail, setCheckingEmail] = useState('');
  const [suspiciousActivity, setSuspiciousActivity] = useState<SuspiciousActivity | null>(null);

  useEffect(() => {
    loadSecurityData();
  }, []);

  const loadSecurityData = async () => {
    setLoading(true);
    try {
      // Load security metrics
      const { data: metricsData } = await supabase.functions.invoke('security-monitoring', {
        body: { action: 'get_security_metrics' }
      });
      
      if (metricsData?.success) {
        setMetrics(metricsData.data);
      }

      // Load recent audit logs
      const { data: auditData } = await supabase.functions.invoke('security-monitoring', {
        body: { action: 'get_audit_logs' }
      });
      
      if (auditData?.success) {
        setAuditLogs(auditData.data);
      }
    } catch (error) {
      console.error('Error loading security data:', error);
    }
    setLoading(false);
  };

  const checkSuspiciousActivity = async () => {
    if (!checkingEmail) return;
    
    try {
      const { data } = await supabase.functions.invoke('security-monitoring', {
        body: { 
          action: 'check_suspicious_activity',
          email: checkingEmail,
          timeWindow: 24
        }
      });
      
      if (data?.success) {
        setSuspiciousActivity(data.data);
      }
    } catch (error) {
      console.error('Error checking suspicious activity:', error);
    }
  };

  const getAlertLevelColor = (level: string) => {
    switch (level) {
      case 'HIGH': return 'destructive';
      case 'MEDIUM': return 'default';
      case 'LOW': return 'secondary';
      default: return 'secondary';
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score >= 70) return 'text-red-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="h-6 w-6 text-orange-600" />
        <h1 className="text-2xl font-bold">Enhanced Security Dashboard</h1>
      </div>

      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">24h Bookings</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.total_bookings_24h || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.unique_users_24h || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Value Bookings</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.high_value_bookings_24h || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alert Level</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge variant={getAlertLevelColor(metrics?.alert_level || 'LOW')}>
              {metrics?.alert_level || 'LOW'}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Suspicious Activity Checker */}
      <Card>
        <CardHeader>
          <CardTitle>Check Suspicious Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <input
              type="email"
              placeholder="Enter email to check..."
              value={checkingEmail}
              onChange={(e) => setCheckingEmail(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-md"
            />
            <Button onClick={checkSuspiciousActivity}>
              Check Activity
            </Button>
          </div>

          {suspiciousActivity && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span>Risk Score:</span>
                    <span className={`font-bold ${getRiskScoreColor(suspiciousActivity.risk_score)}`}>
                      {suspiciousActivity.risk_score}/100
                    </span>
                  </div>
                  <div>Recent Bookings: {suspiciousActivity.recent_bookings_count}</div>
                  {suspiciousActivity.suspicious_indicators.length > 0 && (
                    <div>
                      <div className="font-medium">Suspicious Indicators:</div>
                      <ul className="list-disc list-inside">
                        {suspiciousActivity.suspicious_indicators.map((indicator, index) => (
                          <li key={index} className="text-sm">{indicator}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Recent Audit Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Recent Audit Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {auditLogs.length === 0 ? (
              <p className="text-muted-foreground">No audit logs found.</p>
            ) : (
              auditLogs.map((log) => (
                <div key={log.id} className="border-l-4 border-orange-200 pl-4 py-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{log.action_type}</Badge>
                      <span className="text-sm font-medium">{log.user_email}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {new Date(log.created_at).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    IP: {log.user_ip || 'Unknown'} | 
                    Fields: {log.accessed_fields?.join(', ') || 'None'}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Security Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Security Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                <div className="font-medium">Enhanced Security Measures Active:</div>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Rate limiting: Maximum 3 bookings per 15 minutes</li>
                  <li>Email pattern validation and suspicious email detection</li>
                  <li>Comprehensive audit logging of all booking operations</li>
                  <li>Input sanitization and validation</li>
                  <li>Booking amount and duration limits</li>
                </ul>
              </AlertDescription>
            </Alert>
            
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="font-medium">Additional Recommendations:</div>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Monitor high-value bookings closely</li>
                  <li>Review users with multiple bookings in short timeframes</li>
                  <li>Implement 2FA for high-value transactions</li>
                  <li>Consider email verification for new users</li>
                </ul>
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityDashboardEnhanced;