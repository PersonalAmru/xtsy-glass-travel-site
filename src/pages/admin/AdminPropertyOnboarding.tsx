/**
 * Admin Property Onboarding Page
 * Complete property onboarding workflow with checklist
 */

import { useState, useEffect } from 'react';
import { UnifiedAdminLayout } from '@/layouts/UnifiedAdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Building2, Plus, Check, ChevronRight, MapPin, Phone, Mail,
  Bed, Image, FileText, CreditCard, ClipboardCheck, RefreshCw,
  Loader2, ArrowLeft, Sparkles
} from 'lucide-react';

interface Property {
  id: string;
  name: string;
  slug?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  property_type?: string;
  total_rooms?: number;
  total_beds?: number;
  contact_email?: string;
  contact_phone?: string;
  gst_number?: string;
  is_active?: boolean;
  created_at?: string;
}

// Use 'any' for checklist to handle flexible Supabase Json type
interface Onboarding {
  id: string;
  property_id: string;
  status?: string;
  onboarding_status?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  checklist?: any;
  readiness_score?: number;
  notes?: string;
  minimum_readiness_met?: boolean;
  started_at?: string;
  completed_at?: string;
}

const checklistItems = [
  { key: 'basic_info', label: 'Basic Information', icon: Building2, description: 'Property name, address, contact details' },
  { key: 'room_types', label: 'Room Types', icon: Bed, description: 'Define room categories and capacities' },
  { key: 'inventory_setup', label: 'Inventory Setup', icon: ClipboardCheck, description: 'Set up initial room inventory' },
  { key: 'pricing', label: 'Pricing', icon: CreditCard, description: 'Base rates and pricing rules' },
  { key: 'photos', label: 'Photos', icon: Image, description: 'Property and room images' },
  { key: 'policies', label: 'Policies', icon: FileText, description: 'Cancellation, check-in/out policies' },
  { key: 'bank_details', label: 'Bank Details', icon: CreditCard, description: 'Settlement account information' },
  { key: 'contract_signed', label: 'Contract', icon: Check, description: 'Signed partnership agreement' },
];

export default function AdminPropertyOnboarding() {
  const [properties, setProperties] = useState<(Property & { onboarding?: Onboarding })[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<(Property & { onboarding?: Onboarding }) | null>(null);
  const [showNewPropertyForm, setShowNewPropertyForm] = useState(false);
  const [saving, setSaving] = useState(false);

  // New property form state
  const [newProperty, setNewProperty] = useState({
    name: '',
    address: '',
    city: '',
    state: 'Meghalaya',
    pincode: '',
    property_type: 'hostel',
    total_rooms: 0,
    total_beds: 0,
    contact_email: '',
    contact_phone: '',
    gst_number: '',
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const { data: propertiesData, error: propError } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (propError) throw propError;

      const { data: onboardingData, error: onbError } = await supabase
        .from('property_onboarding')
        .select('*');

      if (onbError) throw onbError;

      const merged = (propertiesData || []).map(prop => ({
        ...prop,
        onboarding: onboardingData?.find(o => o.property_id === prop.id) as Onboarding | undefined
      }));

      setProperties(merged as (Property & { onboarding?: Onboarding })[]);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const createProperty = async () => {
    if (!newProperty.name || !newProperty.address) {
      toast.error('Please fill in required fields');
      return;
    }

    setSaving(true);
    try {
      // Create property
      const { data: property, error: propError } = await supabase
        .from('properties')
        .insert({
          ...newProperty,
          slug: newProperty.name.toLowerCase().replace(/\s+/g, '-'),
        })
        .select()
        .single();

      if (propError) throw propError;

      // Create onboarding record
      const { error: onbError } = await supabase
        .from('property_onboarding')
        .insert({
          property_id: property.id,
          status: 'in_progress',
          checklist: {
            basic_info: true, // Already filled
            room_types: false,
            inventory_setup: false,
            pricing: false,
            photos: false,
            policies: false,
            bank_details: false,
            contract_signed: false,
          },
        });

      if (onbError) throw onbError;

      toast.success('Property created successfully');
      setShowNewPropertyForm(false);
      setNewProperty({
        name: '', address: '', city: '', state: 'Meghalaya', pincode: '',
        property_type: 'hostel', total_rooms: 0, total_beds: 0,
        contact_email: '', contact_phone: '', gst_number: '',
      });
      fetchProperties();
    } catch (error) {
      console.error('Error creating property:', error);
      toast.error('Failed to create property');
    } finally {
      setSaving(false);
    }
  };

  const updateChecklistItem = async (key: string, value: boolean) => {
    if (!selectedProperty?.onboarding) return;

    try {
      const updatedChecklist = {
        ...selectedProperty.onboarding.checklist,
        [key]: value,
      };

      const { error } = await supabase
        .from('property_onboarding')
        .update({ checklist: updatedChecklist })
        .eq('id', selectedProperty.onboarding.id);

      if (error) throw error;

      // Update local state
      setSelectedProperty(prev => prev ? {
        ...prev,
        onboarding: {
          ...prev.onboarding!,
          checklist: updatedChecklist,
          readiness_score: Object.values(updatedChecklist).filter(Boolean).length * 12.5
        }
      } : null);

      toast.success(`${key.replace('_', ' ')} ${value ? 'completed' : 'uncompleted'}`);
    } catch (error) {
      console.error('Error updating checklist:', error);
      toast.error('Failed to update checklist');
    }
  };

  const updateOnboardingStatus = async (status: string) => {
    if (!selectedProperty?.onboarding) return;

    try {
      const { error } = await supabase
        .from('property_onboarding')
        .update({ 
          status,
          completed_at: status === 'live' ? new Date().toISOString() : null
        })
        .eq('id', selectedProperty.onboarding.id);

      if (error) throw error;

      toast.success(`Property status updated to ${status}`);
      fetchProperties();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'review': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'in_progress': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'suspended': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <UnifiedAdminLayout>
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            {selectedProperty && (
              <Button variant="ghost" size="icon" onClick={() => setSelectedProperty(null)} className="rounded-xl">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            )}
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                <Building2 className="w-6 h-6 text-primary" />
                {selectedProperty ? selectedProperty.name : 'Property Onboarding'}
              </h1>
              <p className="text-sm text-slate-400">
                {selectedProperty ? 'Manage onboarding checklist' : 'Add and manage property partners'}
              </p>
            </div>
          </div>
          {!selectedProperty && (
            <Button onClick={() => setShowNewPropertyForm(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Property
            </Button>
          )}
        </header>

        <AnimatePresence mode="wait">
          {/* New Property Form */}
          {showNewPropertyForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="bg-slate-900/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    New Property
                  </CardTitle>
                  <CardDescription>Add a new property to the XTSY network</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-300">Property Name *</Label>
                      <Input
                        value={newProperty.name}
                        onChange={e => setNewProperty(p => ({ ...p, name: e.target.value }))}
                        placeholder="XTSY Shillong"
                        className="bg-slate-800/50 border-slate-600"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-300">Property Type</Label>
                      <Select value={newProperty.property_type} onValueChange={v => setNewProperty(p => ({ ...p, property_type: v }))}>
                        <SelectTrigger className="bg-slate-800/50 border-slate-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hostel">Hostel</SelectItem>
                          <SelectItem value="hotel">Hotel</SelectItem>
                          <SelectItem value="villa">Villa</SelectItem>
                          <SelectItem value="resort">Resort</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label className="text-slate-300">Address *</Label>
                      <Textarea
                        value={newProperty.address}
                        onChange={e => setNewProperty(p => ({ ...p, address: e.target.value }))}
                        placeholder="Full property address"
                        className="bg-slate-800/50 border-slate-600"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-300">City</Label>
                      <Input
                        value={newProperty.city}
                        onChange={e => setNewProperty(p => ({ ...p, city: e.target.value }))}
                        placeholder="Shillong"
                        className="bg-slate-800/50 border-slate-600"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-300">Pincode</Label>
                      <Input
                        value={newProperty.pincode}
                        onChange={e => setNewProperty(p => ({ ...p, pincode: e.target.value }))}
                        placeholder="793001"
                        className="bg-slate-800/50 border-slate-600"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-300">Total Rooms</Label>
                      <Input
                        type="number"
                        value={newProperty.total_rooms}
                        onChange={e => setNewProperty(p => ({ ...p, total_rooms: parseInt(e.target.value) || 0 }))}
                        className="bg-slate-800/50 border-slate-600"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-300">Total Beds</Label>
                      <Input
                        type="number"
                        value={newProperty.total_beds}
                        onChange={e => setNewProperty(p => ({ ...p, total_beds: parseInt(e.target.value) || 0 }))}
                        className="bg-slate-800/50 border-slate-600"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-300">Contact Email</Label>
                      <Input
                        type="email"
                        value={newProperty.contact_email}
                        onChange={e => setNewProperty(p => ({ ...p, contact_email: e.target.value }))}
                        placeholder="property@xtsy.in"
                        className="bg-slate-800/50 border-slate-600"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-300">Contact Phone</Label>
                      <Input
                        value={newProperty.contact_phone}
                        onChange={e => setNewProperty(p => ({ ...p, contact_phone: e.target.value }))}
                        placeholder="+91 9876543210"
                        className="bg-slate-800/50 border-slate-600"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-300">GST Number</Label>
                      <Input
                        value={newProperty.gst_number}
                        onChange={e => setNewProperty(p => ({ ...p, gst_number: e.target.value }))}
                        placeholder="17AABCU9603R1ZM"
                        className="bg-slate-800/50 border-slate-600"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button variant="outline" onClick={() => setShowNewPropertyForm(false)}>Cancel</Button>
                    <Button onClick={createProperty} disabled={saving}>
                      {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                      Create Property
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Property Detail View */}
          {selectedProperty && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Status & Progress */}
              <Card className="bg-slate-900/50 border-slate-700/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Badge className={cn("border", getStatusColor(selectedProperty.onboarding?.status || 'pending'))}>
                        {selectedProperty.onboarding?.status || 'pending'}
                      </Badge>
                      <span className="text-slate-400 text-sm">
                        {selectedProperty.onboarding?.readiness_score || 0}% Complete
                      </span>
                    </div>
                    <Select value={selectedProperty.onboarding?.status} onValueChange={updateOnboardingStatus}>
                      <SelectTrigger className="w-40 bg-slate-800/50 border-slate-600">
                        <SelectValue placeholder="Update Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="review">Under Review</SelectItem>
                        <SelectItem value="live">Live</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Progress value={selectedProperty.onboarding?.readiness_score || 0} className="h-2" />
                </CardContent>
              </Card>

              {/* Checklist */}
              <Card className="bg-slate-900/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white">Onboarding Checklist</CardTitle>
                  <CardDescription>Complete all items to go live</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {checklistItems.map((item) => {
                    const isCompleted = selectedProperty.onboarding?.checklist?.[item.key as keyof typeof selectedProperty.onboarding.checklist];
                    const Icon = item.icon;
                    
                    return (
                      <motion.div
                        key={item.key}
                        className={cn(
                          "flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer",
                          isCompleted
                            ? "bg-emerald-500/10 border-emerald-500/30"
                            : "bg-slate-800/30 border-slate-700/50 hover:border-slate-600"
                        )}
                        onClick={() => updateChecklistItem(item.key, !isCompleted)}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center",
                          isCompleted ? "bg-emerald-500/20" : "bg-slate-700/50"
                        )}>
                          <Icon className={cn("w-5 h-5", isCompleted ? "text-emerald-400" : "text-slate-400")} />
                        </div>
                        <div className="flex-1">
                          <p className={cn("font-medium", isCompleted ? "text-emerald-400" : "text-white")}>
                            {item.label}
                          </p>
                          <p className="text-sm text-slate-500">{item.description}</p>
                        </div>
                        <Checkbox checked={!!isCompleted} className="pointer-events-none" />
                      </motion.div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Property Info */}
              <Card className="bg-slate-900/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white">Property Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-3 bg-slate-800/30 rounded-xl">
                      <p className="text-xs text-slate-500 mb-1">Type</p>
                      <p className="font-medium text-white capitalize">{selectedProperty.property_type}</p>
                    </div>
                    <div className="p-3 bg-slate-800/30 rounded-xl">
                      <p className="text-xs text-slate-500 mb-1">Rooms</p>
                      <p className="font-medium text-white">{selectedProperty.total_rooms}</p>
                    </div>
                    <div className="p-3 bg-slate-800/30 rounded-xl">
                      <p className="text-xs text-slate-500 mb-1">Beds</p>
                      <p className="font-medium text-white">{selectedProperty.total_beds}</p>
                    </div>
                    <div className="p-3 bg-slate-800/30 rounded-xl">
                      <p className="text-xs text-slate-500 mb-1">Location</p>
                      <p className="font-medium text-white">{selectedProperty.city || 'N/A'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Properties List */}
          {!selectedProperty && !showNewPropertyForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid gap-4"
            >
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : properties.length === 0 ? (
                <Card className="bg-slate-900/50 border-slate-700/50">
                  <CardContent className="py-12 text-center">
                    <Building2 className="w-12 h-12 mx-auto mb-4 text-slate-600" />
                    <p className="text-slate-400">No properties yet. Add your first property to get started.</p>
                  </CardContent>
                </Card>
              ) : (
                properties.map((property, index) => (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card
                      className="bg-slate-900/50 border-slate-700/50 hover:border-slate-600 transition-all cursor-pointer"
                      onClick={() => setSelectedProperty(property)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                              <Building2 className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-white">{property.name}</h3>
                              <p className="text-sm text-slate-400 flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {property.city || property.address || 'Location not set'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <Badge className={cn("border", getStatusColor(property.onboarding?.status || 'pending'))}>
                                {property.onboarding?.status || 'pending'}
                              </Badge>
                              <p className="text-xs text-slate-500 mt-1">
                                {property.onboarding?.readiness_score || 0}% ready
                              </p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-slate-500" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </UnifiedAdminLayout>
  );
}
