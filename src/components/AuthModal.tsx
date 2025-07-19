
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
        <div className="w-full">
            <form onSubmit={handleNewsletterSignup} className="space-y-4">
              <div>
                <Label htmlFor="newsletter-name">Full Name</Label>
                <Input
                  id="newsletter-name"
                  type="text"
                  value={newsletterData.fullName}
                  onChange={(e) => setNewsletterData({ ...newsletterData, fullName: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="newsletter-email">Email</Label>
                <Input
                  id="newsletter-email"
                  type="email"
                  value={newsletterData.email}
                  onChange={(e) => setNewsletterData({ ...newsletterData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Interests (Select all that apply)</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {['Seasonal Offers', 'Meghalaya Updates', 'Adventure Tours', 'Group Bookings'].map((interest) => (
                    <Button
                      key={interest}
                      type="button"
                      variant={newsletterData.interests.includes(interest) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleInterest(interest)}
                      className="text-xs"
                    >
                      {interest}
                    </Button>
                  ))}
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Subscribe to Newsletter
              </Button>
            </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
