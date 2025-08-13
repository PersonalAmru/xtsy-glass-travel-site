import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { SecurityService, RoleUpdateRequest, SecurityAlert, AuditLogEntry } from '@/services/securityService';
import { Shield, AlertTriangle, Users, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const SecurityDashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [roleUpdateForm, setRoleUpdateForm] = useState<RoleUpdateRequest>({
    userId: '',
    newRole: '',
    adminEmail: user?.email || '',
    reason: ''
  });

  // Fetch audit log
  const { data: auditLog, isLoading: auditLoading } = useQuery({
    queryKey: ['audit-log'],
    queryFn: () => SecurityService.getAuditLog(50, 0),
    enabled: user?.user_metadata?.role === 'admin'
  });

  // Fetch security alerts
  const { data: securityAlerts, isLoading: alertsLoading } = useQuery({
    queryKey: ['security-alerts'],
    queryFn: () => SecurityService.getSecurityAlerts(20),
    enabled: user?.user_metadata?.role === 'admin'
  });

  // Role update mutation
  const roleUpdateMutation = useMutation({
    mutationFn: (request: RoleUpdateRequest) => SecurityService.updateUserRole(request),
    onSuccess: (result) => {
      if (result.success) {
        toast({
          title: "Role Updated",
          description: "User role has been updated successfully."
        });
        setRoleUpdateForm({
          userId: '',
          newRole: '',
          adminEmail: user?.email || '',
          reason: ''
        });
        queryClient.invalidateQueries({ queryKey: ['audit-log'] });
      } else {
        toast({
          title: "Update Failed",
          description: result.error || "Failed to update user role.",
          variant: "destructive"
        });
      }
    }
  });

  // Alert resolution mutation
  const resolveAlertMutation = useMutation({
    mutationFn: (alertId: string) => SecurityService.resolveSecurityAlert(alertId, user?.id || ''),
    onSuccess: () => {
      toast({
        title: "Alert Resolved",
        description: "Security alert has been resolved."
      });
      queryClient.invalidateQueries({ queryKey: ['security-alerts'] });
    }
  });

  // Apply security policies mutation
  const applyPoliciesMutation = useMutation({
    mutationFn: () => SecurityService.applySecurityPolicies(),
    onSuccess: (result) => {
      if (result.success) {
        toast({
          title: "Security Policies Applied",
          description: "All security policies have been successfully applied."
        });
      } else {
        toast({
          title: "Policy Application Failed",
          description: result.error || "Failed to apply security policies.",
          variant: "destructive"
        });
      }
    }
  });

  const handleRoleUpdate = () => {
    if (!roleUpdateForm.userId || !roleUpdateForm.newRole) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    roleUpdateMutation.mutate(roleUpdateForm);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  if (user?.user_metadata?.role !== 'admin') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Access Denied</CardTitle>
          <CardDescription>
            You need administrator privileges to access the security dashboard.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Security Dashboard</h2>
          <p className="text-muted-foreground">
            Monitor and manage security policies and user roles
          </p>
        </div>
        <Button 
          onClick={() => applyPoliciesMutation.mutate()}
          disabled={applyPoliciesMutation.isPending}
          className="flex items-center gap-2"
        >
          <Shield className="h-4 w-4" />
          Apply Security Policies
        </Button>
      </div>

      <Tabs defaultValue="alerts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="alerts">Security Alerts</TabsTrigger>
          <TabsTrigger value="roles">Role Management</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Security Alerts
              </CardTitle>
              <CardDescription>
                Monitor security events and threats
              </CardDescription>
            </CardHeader>
            <CardContent>
              {alertsLoading ? (
                <div className="text-center py-4">Loading alerts...</div>
              ) : securityAlerts?.alerts && securityAlerts.alerts.length > 0 ? (
                <div className="space-y-3">
                  {securityAlerts.alerts.map((alert) => (
                    <Alert key={alert.id} className="flex items-center justify-between">
                      <div className="flex-1">
                        <AlertTitle className="flex items-center gap-2">
                          {alert.alert_type.replace(/_/g, ' ').toUpperCase()}
                          <Badge variant={getSeverityColor(alert.severity)}>
                            {alert.severity}
                          </Badge>
                        </AlertTitle>
                        <AlertDescription>
                          <div className="mt-2">
                            <p>Created: {new Date(alert.created_at).toLocaleString()}</p>
                            {alert.details && (
                              <pre className="text-xs mt-1 bg-muted p-2 rounded">
                                {JSON.stringify(alert.details, null, 2)}
                              </pre>
                            )}
                          </div>
                        </AlertDescription>
                      </div>
                      {!alert.resolved && (
                        <Button
                          size="sm"
                          onClick={() => resolveAlertMutation.mutate(alert.id)}
                          disabled={resolveAlertMutation.isPending}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Resolve
                        </Button>
                      )}
                    </Alert>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Security Alerts</h3>
                  <p className="text-muted-foreground">
                    All systems are secure and functioning normally
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Role Management
              </CardTitle>
              <CardDescription>
                Securely update user roles with audit logging
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="userId">User ID</Label>
                  <Input
                    id="userId"
                    value={roleUpdateForm.userId}
                    onChange={(e) => setRoleUpdateForm({ ...roleUpdateForm, userId: e.target.value })}
                    placeholder="Enter user UUID"
                  />
                </div>
                
                <div>
                  <Label htmlFor="newRole">New Role</Label>
                  <Select
                    value={roleUpdateForm.newRole}
                    onValueChange={(value) => setRoleUpdateForm({ ...roleUpdateForm, newRole: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select new role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="guest">Guest</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                      <SelectItem value="channel_manager">Channel Manager</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="reason">Reason for Change</Label>
                  <Textarea
                    id="reason"
                    value={roleUpdateForm.reason}
                    onChange={(e) => setRoleUpdateForm({ ...roleUpdateForm, reason: e.target.value })}
                    placeholder="Enter reason for role change"
                    rows={3}
                  />
                </div>
                
                <Button 
                  onClick={handleRoleUpdate}
                  disabled={roleUpdateMutation.isPending}
                  className="w-full"
                >
                  {roleUpdateMutation.isPending ? 'Updating...' : 'Update Role'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Role Change Audit Log
              </CardTitle>
              <CardDescription>
                Track all role changes and security events
              </CardDescription>
            </CardHeader>
            <CardContent>
              {auditLoading ? (
                <div className="text-center py-4">Loading audit log...</div>
              ) : auditLog?.audit_log && auditLog.audit_log.length > 0 ? (
                <div className="space-y-3">
                  {auditLog.audit_log.map((entry) => (
                    <div key={entry.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant={entry.action === 'unauthorized_attempt' ? 'destructive' : 'default'}>
                          {entry.action.replace(/_/g, ' ').toUpperCase()}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(entry.created_at).toLocaleString()}
                        </span>
                      </div>
                      <div className="grid gap-2 text-sm">
                        <div>Admin: {entry.admin_email}</div>
                        {entry.target_user_id && (
                          <div>Target User: {entry.target_user_id}</div>
                        )}
                        {entry.old_role && entry.new_role && (
                          <div>Role Change: {entry.old_role} → {entry.new_role}</div>
                        )}
                        {entry.reason && (
                          <div>Reason: {entry.reason}</div>
                        )}
                        {entry.ip_address && (
                          <div>IP: {entry.ip_address}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Audit Entries</h3>
                  <p className="text-muted-foreground">
                    No role changes have been recorded yet
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};