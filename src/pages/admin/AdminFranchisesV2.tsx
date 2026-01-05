/**
 * Admin Franchises Page - Franchise owner management
 */

import { useState, useEffect } from 'react';
import { AdminLayoutV2 } from '@/layouts/AdminLayoutV2';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Plus, Users, Building2, Mail, Loader2, Clock, Check, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';

interface FranchiseAssignment {
  id: string;
  user_id: string;
  property_id: string;
  is_active: boolean;
  assigned_at: string;
  properties: { name: string } | null;
  user_email?: string;
}

interface FranchiseInvite {
  id: string;
  email: string;
  property_id: string;
  expires_at: string;
  is_used: boolean;
  properties: { name: string } | null;
}

interface Property {
  id: string;
  name: string;
}

export default function AdminFranchises() {
  const [assignments, setAssignments] = useState<FranchiseAssignment[]>([]);
  const [invites, setInvites] = useState<FranchiseInvite[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newInvite, setNewInvite] = useState({
    email: '',
    property_id: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch franchise assignments
      const { data: assignmentsData } = await supabase
        .from('franchise_assignments')
        .select('*, properties(name)')
        .order('assigned_at', { ascending: false });

      // Fetch pending invites
      const { data: invitesData } = await supabase
        .from('franchise_invites')
        .select('*, properties(name)')
        .eq('is_used', false)
        .order('created_at', { ascending: false });

      // Fetch properties for dropdown
      const { data: propertiesData } = await supabase
        .from('properties')
        .select('id, name')
        .eq('is_active', true)
        .order('name');

      setAssignments(assignmentsData || []);
      setInvites(invitesData || []);
      setProperties(propertiesData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load franchise data');
    } finally {
      setLoading(false);
    }
  };

  const createInvite = async () => {
    if (!newInvite.email.trim() || !newInvite.property_id) {
      toast.error('Email and property are required');
      return;
    }

    setCreating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase.from('franchise_invites').insert({
        email: newInvite.email.toLowerCase().trim(),
        property_id: newInvite.property_id,
        invited_by: user?.id,
      });

      if (error) throw error;

      toast.success('Invite created. Share the login link with the franchise owner.');
      setDialogOpen(false);
      setNewInvite({ email: '', property_id: '' });
      fetchData();
    } catch (error: any) {
      console.error('Error creating invite:', error);
      toast.error('Failed to create invite');
    } finally {
      setCreating(false);
    }
  };

  const revokeAssignment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('franchise_assignments')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;
      toast.success('Franchise access revoked');
      fetchData();
    } catch (error) {
      toast.error('Failed to revoke access');
    }
  };

  const deleteInvite = async (id: string) => {
    try {
      const { error } = await supabase
        .from('franchise_invites')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Invite deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete invite');
    }
  };

  return (
    <AdminLayoutV2>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-white">Franchise Owners</h1>
            <p className="text-sm text-zinc-500">Manage franchise access</p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-indigo-500 hover:bg-indigo-600">
                <Plus className="w-4 h-4 mr-2" />
                Invite Owner
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-900 border-zinc-800">
              <DialogHeader>
                <DialogTitle className="text-white">Invite Franchise Owner</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label className="text-zinc-400">Email Address</Label>
                  <Input
                    type="email"
                    placeholder="owner@email.com"
                    value={newInvite.email}
                    onChange={(e) => setNewInvite(prev => ({ ...prev, email: e.target.value }))}
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-400">Assign to Property</Label>
                  <Select
                    value={newInvite.property_id}
                    onValueChange={(value) => setNewInvite(prev => ({ ...prev, property_id: value }))}
                  >
                    <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                      <SelectValue placeholder="Select property" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                      {properties.map((property) => (
                        <SelectItem key={property.id} value={property.id} className="text-white">
                          {property.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-xs text-zinc-500">
                  The owner will be automatically assigned when they sign up with this email.
                </p>
                <Button
                  onClick={createInvite}
                  disabled={creating}
                  className="w-full bg-indigo-500 hover:bg-indigo-600"
                >
                  {creating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Create Invite
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
          </div>
        ) : (
          <>
            {/* Pending Invites */}
            {invites.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-sm font-medium text-zinc-400">Pending Invites</h2>
                {invites.map((invite) => (
                  <Card key={invite.id} className="bg-amber-500/5 border-amber-500/20">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                            <Clock className="w-5 h-5 text-amber-400" />
                          </div>
                          <div>
                            <p className="font-medium text-white">{invite.email}</p>
                            <p className="text-xs text-zinc-500">
                              {invite.properties?.name} • Expires {format(new Date(invite.expires_at), 'MMM d, yyyy')}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteInvite(invite.id)}
                          className="text-zinc-400 hover:text-red-400"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Active Franchises */}
            <div className="space-y-3">
              <h2 className="text-sm font-medium text-zinc-400">Active Franchises</h2>
              {assignments.filter(a => a.is_active).length === 0 ? (
                <Card className="bg-zinc-900/50 border-zinc-800">
                  <CardContent className="py-12 text-center">
                    <Users className="w-12 h-12 mx-auto text-zinc-600 mb-4" />
                    <p className="text-zinc-400">No active franchise owners</p>
                    <p className="text-sm text-zinc-600 mt-1">Invite franchise owners to manage properties</p>
                  </CardContent>
                </Card>
              ) : (
                assignments.filter(a => a.is_active).map((assignment) => (
                  <Card key={assignment.id} className="bg-zinc-900/50 border-zinc-800">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                            <Check className="w-5 h-5 text-green-400" />
                          </div>
                          <div>
                            <p className="font-medium text-white">Franchise Owner</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Building2 className="w-3 h-3 text-zinc-500" />
                              <span className="text-xs text-zinc-500">{assignment.properties?.name}</span>
                            </div>
                            <p className="text-xs text-zinc-600 mt-1">
                              Since {format(new Date(assignment.assigned_at), 'MMM d, yyyy')}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => revokeAssignment(assignment.id)}
                          className="text-zinc-400 hover:text-red-400 text-xs"
                        >
                          Revoke
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </AdminLayoutV2>
  );
}
