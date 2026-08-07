/**
 * Admin Franchise Permissions Page - Granular control over franchise features
 */

import { useState, useEffect } from 'react';
import { UnifiedAdminLayout } from '@/layouts/UnifiedAdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Shield, Building2, Loader2, Save, ChevronRight, Users, Calendar, DollarSign, BarChart3, MessageSquare, Settings, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface FranchiseAssignment {
  id: string;
  user_id: string;
  property_id: string;
  is_active: boolean;
  permissions: FranchisePermissions;
  properties: { name: string } | null;
  user_email?: string;
}

interface FranchisePermissions {
  // Bookings
  view_bookings: boolean;
  manage_bookings: boolean;
  approve_bookings: boolean;
  
  // Inventory
  view_inventory: boolean;
  manage_inventory: boolean;
  block_dates: boolean;
  
  // Finance
  view_payouts: boolean;
  view_settlements: boolean;
  download_invoices: boolean;
  
  // Analytics
  view_analytics: boolean;
  view_demand_signals: boolean;
  
  // Communication
  chat_with_guests: boolean;
  send_notifications: boolean;
  
  // Settings
  update_property_info: boolean;
  manage_room_rates: boolean;
}

const DEFAULT_PERMISSIONS: FranchisePermissions = {
  view_bookings: true,
  manage_bookings: false,
  approve_bookings: false,
  view_inventory: true,
  manage_inventory: true,
  block_dates: true,
  view_payouts: true,
  view_settlements: false,
  download_invoices: true,
  view_analytics: true,
  view_demand_signals: false,
  chat_with_guests: true,
  send_notifications: false,
  update_property_info: false,
  manage_room_rates: false,
};

const PERMISSION_GROUPS = [
  {
    id: 'bookings',
    title: 'Bookings',
    icon: Calendar,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    permissions: [
      { key: 'view_bookings', label: 'View Bookings', description: 'See all property bookings' },
      { key: 'manage_bookings', label: 'Manage Bookings', description: 'Edit, cancel, or modify bookings' },
      { key: 'approve_bookings', label: 'Approve Bookings', description: 'Approve or reject booking requests' },
    ],
  },
  {
    id: 'inventory',
    title: 'Inventory',
    icon: Building2,
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    permissions: [
      { key: 'view_inventory', label: 'View Inventory', description: 'See room availability' },
      { key: 'manage_inventory', label: 'Manage Inventory', description: 'Update room counts' },
      { key: 'block_dates', label: 'Block Dates', description: 'Block specific dates' },
    ],
  },
  {
    id: 'finance',
    title: 'Finance',
    icon: DollarSign,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    permissions: [
      { key: 'view_payouts', label: 'View Payouts', description: 'See payout history' },
      { key: 'view_settlements', label: 'View Settlements', description: 'Access settlement details' },
      { key: 'download_invoices', label: 'Download Invoices', description: 'Download booking invoices' },
    ],
  },
  {
    id: 'analytics',
    title: 'Analytics',
    icon: BarChart3,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    permissions: [
      { key: 'view_analytics', label: 'View Analytics', description: 'Access property analytics' },
      { key: 'view_demand_signals', label: 'Demand Signals', description: 'See demand forecasting' },
    ],
  },
  {
    id: 'communication',
    title: 'Communication',
    icon: MessageSquare,
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/10',
    permissions: [
      { key: 'chat_with_guests', label: 'Guest Chat', description: 'Chat with guests' },
      { key: 'send_notifications', label: 'Send Notifications', description: 'Send push notifications to guests' },
    ],
  },
  {
    id: 'settings',
    title: 'Settings',
    icon: Settings,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    permissions: [
      { key: 'update_property_info', label: 'Update Property', description: 'Edit property details' },
      { key: 'manage_room_rates', label: 'Manage Rates', description: 'Update room pricing' },
    ],
  },
];

export default function AdminFranchisePermissions() {
  const [assignments, setAssignments] = useState<FranchiseAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<FranchiseAssignment | null>(null);
  const [editedPermissions, setEditedPermissions] = useState<FranchisePermissions>(DEFAULT_PERMISSIONS);
  
  useEffect(() => {
    fetchAssignments();
  }, []);
  
  const fetchAssignments = async () => {
    try {
      const { data, error } = await supabase
        .from('franchise_assignments')
        .select('*, properties(name)')
        .eq('is_active', true)
        .order('assigned_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform data to include proper permissions
      const transformed = (data || []).map(item => {
        const perms = typeof item.permissions === 'object' && item.permissions !== null 
          ? item.permissions 
          : {};
        return {
          ...item,
          permissions: { ...DEFAULT_PERMISSIONS, ...perms } as FranchisePermissions,
        };
      });
      
      setAssignments(transformed as FranchiseAssignment[]);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      toast.error('Failed to load franchise data');
    } finally {
      setLoading(false);
    }
  };
  
  const openPermissionsDialog = (assignment: FranchiseAssignment) => {
    setSelectedAssignment(assignment);
    setEditedPermissions({ ...DEFAULT_PERMISSIONS, ...assignment.permissions });
  };
  
  const togglePermission = (key: keyof FranchisePermissions) => {
    setEditedPermissions(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };
  
  const savePermissions = async () => {
    if (!selectedAssignment) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('franchise_assignments')
        .update({ permissions: editedPermissions as any })
        .eq('id', selectedAssignment.id);
      
      if (error) throw error;
      
      toast.success('Permissions updated successfully');
      setSelectedAssignment(null);
      fetchAssignments();
    } catch (error) {
      console.error('Error saving permissions:', error);
      toast.error('Failed to update permissions');
    } finally {
      setSaving(false);
    }
  };
  
  const applyPreset = (preset: 'minimal' | 'standard' | 'full') => {
    const presets: Record<string, FranchisePermissions> = {
      minimal: {
        view_bookings: true,
        manage_bookings: false,
        approve_bookings: false,
        view_inventory: true,
        manage_inventory: false,
        block_dates: false,
        view_payouts: true,
        view_settlements: false,
        download_invoices: false,
        view_analytics: false,
        view_demand_signals: false,
        chat_with_guests: false,
        send_notifications: false,
        update_property_info: false,
        manage_room_rates: false,
      },
      standard: {
        view_bookings: true,
        manage_bookings: false,
        approve_bookings: false,
        view_inventory: true,
        manage_inventory: true,
        block_dates: true,
        view_payouts: true,
        view_settlements: false,
        download_invoices: true,
        view_analytics: true,
        view_demand_signals: false,
        chat_with_guests: true,
        send_notifications: false,
        update_property_info: false,
        manage_room_rates: false,
      },
      full: {
        view_bookings: true,
        manage_bookings: true,
        approve_bookings: true,
        view_inventory: true,
        manage_inventory: true,
        block_dates: true,
        view_payouts: true,
        view_settlements: true,
        download_invoices: true,
        view_analytics: true,
        view_demand_signals: true,
        chat_with_guests: true,
        send_notifications: true,
        update_property_info: true,
        manage_room_rates: true,
      },
    };
    
    setEditedPermissions(presets[preset]);
  };
  
  return (
    <UnifiedAdminLayout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl font-semibold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-400" />
            Franchise Permissions
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Control what each franchise owner can access
          </p>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
          </div>
        ) : assignments.length === 0 ? (
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="py-12 text-center">
              <Users className="w-12 h-12 mx-auto text-zinc-600 mb-4" />
              <p className="text-zinc-400">No active franchise owners</p>
              <p className="text-sm text-zinc-600 mt-1">
                Invite franchise owners first to manage their permissions
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {assignments.map((assignment) => {
              const enabledCount = Object.values(assignment.permissions).filter(Boolean).length;
              const totalCount = Object.keys(DEFAULT_PERMISSIONS).length;
              
              return (
                <Card 
                  key={assignment.id} 
                  className="bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer"
                  onClick={() => openPermissionsDialog(assignment)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{assignment.properties?.name || 'Unknown Property'}</p>
                          <p className="text-xs text-zinc-500 mt-0.5">
                            {enabledCount}/{totalCount} permissions enabled
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-zinc-600" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Permissions Dialog */}
      <Dialog open={!!selectedAssignment} onOpenChange={(open) => !open && setSelectedAssignment(null)}>
        <DialogContent className="bg-zinc-900 border-zinc-800 max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-indigo-400" />
              {selectedAssignment?.properties?.name} - Permissions
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 mt-4">
            {/* Presets */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => applyPreset('minimal')}
                className="border-zinc-700 text-zinc-400 hover:text-white"
              >
                Minimal
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => applyPreset('standard')}
                className="border-zinc-700 text-zinc-400 hover:text-white"
              >
                Standard
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => applyPreset('full')}
                className="border-zinc-700 text-zinc-400 hover:text-white"
              >
                Full Access
              </Button>
            </div>
            
            {/* Permission Groups */}
            {PERMISSION_GROUPS.map((group) => (
              <Card key={group.id} className="bg-zinc-800/50 border-zinc-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-white flex items-center gap-2">
                    <div className={`w-6 h-6 rounded ${group.bgColor} flex items-center justify-center`}>
                      <group.icon className={`w-3.5 h-3.5 ${group.color}`} />
                    </div>
                    {group.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  {group.permissions.map((perm) => (
                    <div key={perm.key} className="flex items-center justify-between">
                      <div className="flex-1">
                        <Label className="text-zinc-300 text-sm">{perm.label}</Label>
                        <p className="text-xs text-zinc-500">{perm.description}</p>
                      </div>
                      <Switch
                        checked={editedPermissions[perm.key as keyof FranchisePermissions]}
                        onCheckedChange={() => togglePermission(perm.key as keyof FranchisePermissions)}
                        className="data-[state=checked]:bg-indigo-500"
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
            
            {/* Save Button */}
            <Button
              onClick={savePermissions}
              disabled={saving}
              className="w-full bg-indigo-500 hover:bg-indigo-600"
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Save Permissions
                </span>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </UnifiedAdminLayout>
  );
}
