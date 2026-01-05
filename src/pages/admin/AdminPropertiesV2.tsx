/**
 * Admin Properties Page - Property creation and management
 */

import { useState, useEffect } from 'react';
import { AdminLayoutV2 } from '@/layouts/AdminLayoutV2';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Plus, Building2, MapPin, Phone, Mail, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Property {
  id: string;
  name: string;
  slug: string;
  city: string | null;
  state: string | null;
  is_active: boolean;
  contact_email: string | null;
  contact_phone: string | null;
}

export default function AdminProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newProperty, setNewProperty] = useState({
    name: '',
    city: '',
    state: '',
    contact_email: '',
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const createProperty = async () => {
    if (!newProperty.name.trim()) {
      toast.error('Property name is required');
      return;
    }

    setCreating(true);
    try {
      const slug = newProperty.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      
      const { error } = await supabase.from('properties').insert({
        name: newProperty.name,
        slug,
        city: newProperty.city || null,
        state: newProperty.state || null,
        contact_email: newProperty.contact_email || null,
      });

      if (error) throw error;

      toast.success('Property created');
      setDialogOpen(false);
      setNewProperty({ name: '', city: '', state: '', contact_email: '' });
      fetchProperties();
    } catch (error: any) {
      console.error('Error creating property:', error);
      if (error.code === '23505') {
        toast.error('A property with this name already exists');
      } else {
        toast.error('Failed to create property');
      }
    } finally {
      setCreating(false);
    }
  };

  const togglePropertyStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('properties')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      toast.success(currentStatus ? 'Property deactivated' : 'Property activated');
      fetchProperties();
    } catch (error) {
      toast.error('Failed to update property status');
    }
  };

  return (
    <AdminLayoutV2>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-white">Properties</h1>
            <p className="text-sm text-zinc-500">Manage all XTSY properties</p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-indigo-500 hover:bg-indigo-600">
                <Plus className="w-4 h-4 mr-2" />
                Add Property
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-900 border-zinc-800">
              <DialogHeader>
                <DialogTitle className="text-white">Create New Property</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label className="text-zinc-400">Property Name</Label>
                  <Input
                    placeholder="XTSY Mumbai"
                    value={newProperty.name}
                    onChange={(e) => setNewProperty(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-zinc-400">City</Label>
                    <Input
                      placeholder="Mumbai"
                      value={newProperty.city}
                      onChange={(e) => setNewProperty(prev => ({ ...prev, city: e.target.value }))}
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-zinc-400">State</Label>
                    <Input
                      placeholder="Maharashtra"
                      value={newProperty.state}
                      onChange={(e) => setNewProperty(prev => ({ ...prev, state: e.target.value }))}
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-400">Contact Email</Label>
                  <Input
                    type="email"
                    placeholder="hello@property.com"
                    value={newProperty.contact_email}
                    onChange={(e) => setNewProperty(prev => ({ ...prev, contact_email: e.target.value }))}
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
                <Button
                  onClick={createProperty}
                  disabled={creating}
                  className="w-full bg-indigo-500 hover:bg-indigo-600"
                >
                  {creating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Create Property
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Properties List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
          </div>
        ) : properties.length === 0 ? (
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="py-12 text-center">
              <Building2 className="w-12 h-12 mx-auto text-zinc-600 mb-4" />
              <p className="text-zinc-400">No properties yet</p>
              <p className="text-sm text-zinc-600 mt-1">Create your first property to get started</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {properties.map((property) => (
              <Card key={property.id} className="bg-zinc-900/50 border-zinc-800">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-5 h-5 text-indigo-400" />
                      </div>
                      <div>
                        <h3 className="font-medium text-white">{property.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin className="w-3 h-3 text-zinc-500" />
                          <span className="text-xs text-zinc-500">
                            {property.city || 'No city'}{property.state ? `, ${property.state}` : ''}
                          </span>
                        </div>
                        {property.contact_email && (
                          <div className="flex items-center gap-2 mt-1">
                            <Mail className="w-3 h-3 text-zinc-500" />
                            <span className="text-xs text-zinc-500">{property.contact_email}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        property.is_active 
                          ? 'bg-green-500/10 text-green-400' 
                          : 'bg-zinc-700 text-zinc-400'
                      }`}>
                        {property.is_active ? 'Active' : 'Inactive'}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => togglePropertyStatus(property.id, property.is_active)}
                        className="text-zinc-400 hover:text-white text-xs"
                      >
                        {property.is_active ? 'Deactivate' : 'Activate'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayoutV2>
  );
}
