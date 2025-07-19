
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

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, defaultTab = 'signin' }) => {
  const { signIn, signUp, resetPassword } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const [signInData, setSignInData] = useState({
    email: '',
    password: '',
  });

  const [signUpData, setSignUpData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    role: 'staff',
  });

  const [newsletterData, setNewsletterData] = useState({
    email: '',
    fullName: '',
    interests: [] as string[],
  });

  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');

  // Validate @xtsy.one domain for staff/admin
  const validateStaffEmail = (email: string) => {
    return email.endsWith('@xtsy.one');
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStaffEmail(signInData.email)) {
      toast({
        title: "Invalid Email Domain",
        description: "Staff/Admin login requires @xtsy.one email address",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    const { error } = await signIn(signInData.email, signInData.password);
    
    if (!error) {
      onClose();
      setSignInData({ email: '', password: '' });
    }
    
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStaffEmail(signUpData.email)) {
      toast({
        title: "Invalid Email Domain",
        description: "Staff/Admin signup requires @xtsy.one email address",
        variant: "destructive"
      });
      return;
    }
    
    if (signUpData.password !== signUpData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    const { error } = await signUp(
      signUpData.email,
      signUpData.password,
      {
        full_name: signUpData.fullName,
        role: signUpData.role
      }
    );
    
    if (!error) {
      // Notify admin about new staff signup
      try {
        await supabase.functions.invoke('notify-admin', {
          body: {
            type: 'new_staff_signup',
            email: signUpData.email,
            fullName: signUpData.fullName,
            role: signUpData.role
          }
        });
      } catch (notifyError) {
        console.error('Failed to notify admin:', notifyError);
      }

      toast({
        title: "Account Created",
        description: "Your staff account has been created. Admin has been notified.",
      });
      
      onClose();
      setSignUpData({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        role: 'staff',
      });
    }
    
    setLoading(false);
  };

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

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStaffEmail(forgotPasswordEmail)) {
      toast({
        title: "Invalid Email Domain",
        description: "Password reset requires @xtsy.one email address",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    await resetPassword(forgotPasswordEmail);
    setShowForgotPassword(false);
    setForgotPasswordEmail('');
    setLoading(false);
  };

  const toggleInterest = (interest: string) => {
    setNewsletterData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  if (showForgotPassword) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <Label htmlFor="reset-email">Staff Email (@xtsy.one)</Label>
              <Input
                id="reset-email"
                type="email"
                value={forgotPasswordEmail}
                onChange={(e) => setForgotPasswordEmail(e.target.value)}
                placeholder="your.name@xtsy.one"
                required
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Reset Email
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowForgotPassword(false)}
              >
                Back
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome to XTSY</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="signin" className="flex items-center gap-1">
              <UserCheck className="h-4 w-4" />
              Staff Login
            </TabsTrigger>
            <TabsTrigger value="signup" className="flex items-center gap-1">
              <UserCheck className="h-4 w-4" />
              Staff Signup
            </TabsTrigger>
            <TabsTrigger value="newsletter" className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              Guest Newsletter
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <Label htmlFor="signin-email">Staff Email (@xtsy.one)</Label>
                <Input
                  id="signin-email"
                  type="email"
                  value={signInData.email}
                  onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                  placeholder="your.name@xtsy.one"
                  required
                />
              </div>
              <div>
                <Label htmlFor="signin-password">Password</Label>
                <Input
                  id="signin-password"
                  type="password"
                  value={signInData.password}
                  onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
              <Button 
                type="button" 
                variant="link" 
                className="w-full"
                onClick={() => setShowForgotPassword(true)}
              >
                Forgot your password?
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <Label htmlFor="signup-name">Full Name</Label>
                <Input
                  id="signup-name"
                  type="text"
                  value={signUpData.fullName}
                  onChange={(e) => setSignUpData({ ...signUpData, fullName: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="signup-email">Staff Email (@xtsy.one)</Label>
                <Input
                  id="signup-email"
                  type="email"
                  value={signUpData.email}
                  onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                  placeholder="your.name@xtsy.one"
                  required
                />
              </div>
              <div>
                <Label htmlFor="signup-role">Role</Label>
                <Select value={signUpData.role} onValueChange={(value) => setSignUpData({ ...signUpData, role: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="staff">Staff</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  value={signUpData.password}
                  onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="signup-confirm">Confirm Password</Label>
                <Input
                  id="signup-confirm"
                  type="password"
                  value={signUpData.confirmPassword}
                  onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" disabled={loading || signUpData.password !== signUpData.confirmPassword} className="w-full">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Staff Account
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="newsletter">
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
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
