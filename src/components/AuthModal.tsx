
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Users, UserCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'signin' | 'signup' | 'newsletter';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, defaultTab = 'newsletter' }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [newsletterData, setNewsletterData] = useState({
    email: '',
    fullName: '',
    interests: [] as string[],
  });

  const handleNewsletterSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.functions.invoke('newsletter-signup', {
        body: {
          email: newsletterData.email,
          fullName: newsletterData.fullName,
          interests: newsletterData.interests
        }
      });

      if (error) throw error;

      toast({
        title: "Newsletter Subscription Successful!",
        description: "You'll receive seasonal offers and Meghalaya updates.",
      });

      onClose();
      setNewsletterData({ email: '', fullName: '', interests: [] });
    } catch (error: any) {
      toast({
        title: "Subscription Failed",
        description: error.message || "Please try again later",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };


  const toggleInterest = (interest: string) => {
    setNewsletterData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Join Our Newsletter</DialogTitle>
        </DialogHeader>
        <div className="w-full text-center space-y-4">
          <p className="text-muted-foreground">
            Join our WhatsApp broadcast channel to receive exclusive updates, travel offers, and Meghalaya insights directly to your phone!
          </p>
          <Button 
            onClick={() => {
              window.open('https://whatsapp.com/channel/0029VbAvWCF7DAWut48dtQ2f', '_blank');
              onClose();
            }}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            Join WhatsApp Channel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
