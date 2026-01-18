/**
 * Admin WhatsApp Templates Manager
 * Edit message templates with live preview and CTA button configuration
 */

import { useState, useEffect } from 'react';
import { UnifiedAdminLayout } from '@/layouts/UnifiedAdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { 
  MessageSquare, 
  Save, 
  RefreshCw, 
  Eye, 
  ExternalLink,
  Phone,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Send
} from 'lucide-react';
import { motion } from 'framer-motion';

interface WhatsAppTemplate {
  id: string;
  template_key: string;
  template_name: string;
  message_body: string;
  cta_button_text: string | null;
  cta_button_url: string | null;
  is_active: boolean;
  variables_hint: string | null;
  created_at: string;
  updated_at: string;
}

// Sample variables for preview
const sampleVariables: Record<string, string> = {
  guest_name: 'Rahul Sharma',
  check_in: '25 Jan 2026',
  check_out: '28 Jan 2026',
  room_type: 'Deluxe Private Room',
  guests: '2',
  total_amount: '8,500',
  booking_id: 'XTSY-2026-0125',
  amount: '8,500',
  transaction_id: 'TXN123456789',
};

function replaceVariables(text: string, variables: Record<string, string>): string {
  let result = text;
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    result = result.replace(regex, value);
  }
  return result;
}

export default function AdminWhatsAppTemplates() {
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [testPhone, setTestPhone] = useState('');
  const [sendingTest, setSendingTest] = useState<string | null>(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('whatsapp_templates')
        .select('*')
        .order('template_key');

      if (error) throw error;
      setTemplates((data as WhatsAppTemplate[]) || []);
    } catch (error: any) {
      console.error('Error fetching templates:', error);
      toast.error('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const updateTemplate = async (template: WhatsAppTemplate) => {
    setSaving(template.id);
    try {
      const { error } = await supabase
        .from('whatsapp_templates')
        .update({
          message_body: template.message_body,
          cta_button_text: template.cta_button_text,
          cta_button_url: template.cta_button_url,
          is_active: template.is_active,
        })
        .eq('id', template.id);

      if (error) throw error;
      toast.success('Template saved successfully');
    } catch (error: any) {
      console.error('Error saving template:', error);
      toast.error('Failed to save template');
    } finally {
      setSaving(null);
    }
  };

  const handleFieldChange = (id: string, field: keyof WhatsAppTemplate, value: any) => {
    setTemplates(prev => 
      prev.map(t => t.id === id ? { ...t, [field]: value } : t)
    );
  };

  const sendTestMessage = async (template: WhatsAppTemplate) => {
    if (!testPhone) {
      toast.error('Enter a test phone number');
      return;
    }

    setSendingTest(template.id);
    try {
      const { data, error } = await supabase.functions.invoke('send-whatsapp', {
        body: {
          template_key: template.template_key,
          phone_number: testPhone,
          variables: sampleVariables,
        },
      });

      if (error) throw error;
      
      if (data?.success) {
        toast.success('Test message sent!');
      } else {
        toast.error(data?.error || 'Failed to send test message');
      }
    } catch (error: any) {
      console.error('Test message error:', error);
      toast.error(error.message || 'Failed to send test message');
    } finally {
      setSendingTest(null);
    }
  };

  if (loading) {
    return (
      <UnifiedAdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </UnifiedAdminLayout>
    );
  }

  return (
    <UnifiedAdminLayout>
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-primary" />
            WhatsApp Templates
          </h1>
          <p className="text-muted-foreground mt-1">
            Edit notification messages sent to guests via WhatsApp
          </p>
        </div>
        <Button onClick={fetchTemplates} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Test Phone Input */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Test Messages
          </CardTitle>
          <CardDescription>
            Enter your phone number to send test messages with sample data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Input
              placeholder="+91 98765 43210"
              value={testPhone}
              onChange={(e) => setTestPhone(e.target.value)}
              className="max-w-xs"
            />
            <Badge variant="secondary" className="whitespace-nowrap">
              Uses sample data
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Templates */}
      <Tabs defaultValue={templates[0]?.template_key} className="space-y-4">
        <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${templates.length}, 1fr)` }}>
          {templates.map((template) => (
            <TabsTrigger key={template.template_key} value={template.template_key} className="text-xs sm:text-sm">
              {template.template_name}
            </TabsTrigger>
          ))}
        </TabsList>

        {templates.map((template) => (
          <TabsContent key={template.template_key} value={template.template_key}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {template.template_name}
                        <Badge variant={template.is_active ? 'default' : 'secondary'}>
                          {template.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Key: <code className="bg-muted px-1 rounded">{template.template_key}</code>
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`active-${template.id}`} className="text-sm text-muted-foreground">
                        Active
                      </Label>
                      <Switch
                        id={`active-${template.id}`}
                        checked={template.is_active}
                        onCheckedChange={(checked) => handleFieldChange(template.id, 'is_active', checked)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Edit Panel */}
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor={`body-${template.id}`}>Message Body</Label>
                        <Textarea
                          id={`body-${template.id}`}
                          value={template.message_body}
                          onChange={(e) => handleFieldChange(template.id, 'message_body', e.target.value)}
                          rows={10}
                          className="mt-1.5 font-mono text-sm"
                        />
                        {template.variables_hint && (
                          <p className="text-xs text-muted-foreground mt-1.5">
                            {template.variables_hint}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`cta-text-${template.id}`}>CTA Button Text</Label>
                          <Input
                            id={`cta-text-${template.id}`}
                            value={template.cta_button_text || ''}
                            onChange={(e) => handleFieldChange(template.id, 'cta_button_text', e.target.value || null)}
                            placeholder="View Booking"
                            className="mt-1.5"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`cta-url-${template.id}`}>CTA Button URL</Label>
                          <Input
                            id={`cta-url-${template.id}`}
                            value={template.cta_button_url || ''}
                            onChange={(e) => handleFieldChange(template.id, 'cta_button_url', e.target.value || null)}
                            placeholder="https://xtsy.one/booking/{{booking_id}}"
                            className="mt-1.5"
                          />
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button 
                          onClick={() => updateTemplate(template)}
                          disabled={saving === template.id}
                        >
                          {saving === template.id ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Save className="w-4 h-4 mr-2" />
                          )}
                          Save Changes
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => sendTestMessage(template)}
                          disabled={sendingTest === template.id || !testPhone}
                        >
                          {sendingTest === template.id ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Send className="w-4 h-4 mr-2" />
                          )}
                          Send Test
                        </Button>
                      </div>
                    </div>

                    {/* Preview Panel */}
                    <div>
                      <Label className="flex items-center gap-2 mb-2">
                        <Eye className="w-4 h-4" />
                        Live Preview
                      </Label>
                      <div className="bg-[#0b141a] rounded-xl p-4 min-h-[300px]">
                        {/* WhatsApp Message Bubble */}
                        <div className="bg-[#005c4b] rounded-lg rounded-tl-none p-3 max-w-[85%] ml-auto">
                          <p className="text-white text-sm whitespace-pre-wrap">
                            {replaceVariables(template.message_body, sampleVariables)}
                          </p>
                          <p className="text-[10px] text-white/60 text-right mt-1">
                            {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>

                        {/* CTA Button Preview */}
                        {template.cta_button_text && template.cta_button_url && (
                          <div className="mt-2 max-w-[85%] ml-auto">
                            <a
                              href={replaceVariables(template.cta_button_url, sampleVariables)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-2 bg-[#005c4b]/80 hover:bg-[#005c4b] text-white text-sm py-2.5 px-4 rounded-lg transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                              {template.cta_button_text}
                            </a>
                          </div>
                        )}
                      </div>

                      {/* Status Indicators */}
                      <div className="flex items-center gap-4 mt-4 text-sm">
                        <div className="flex items-center gap-1.5">
                          {template.is_active ? (
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-muted-foreground" />
                          )}
                          <span className={template.is_active ? 'text-green-500' : 'text-muted-foreground'}>
                            {template.is_active ? 'Will be sent' : 'Disabled'}
                          </span>
                        </div>
                        <div className="text-muted-foreground">
                          Last updated: {new Date(template.updated_at).toLocaleDateString('en-IN')}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
    </UnifiedAdminLayout>
  );
}
