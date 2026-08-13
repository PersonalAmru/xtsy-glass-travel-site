/**
 * Franchise Login Page - Supabase Auth for franchise owners
 */

import { useState } from 'react';
import { useNavigate } from '@/lib/router-compat';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Building2, Loader2, Mail, Lock } from 'lucide-react';

export default function FranchiseLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please enter your email and password');
      return;
    }

    setLoading(true);

    try {
      // Sign out any existing session first to ensure clean franchise login
      await supabase.auth.signOut();
      
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        toast.error('Unable to sign in. Please check your credentials.');
        return;
      }

      if (authData.user) {
        // Verify franchise role
        const { data: isFranchise, error: roleError } = await supabase.rpc('has_role', {
          _user_id: authData.user.id,
          _role: 'franchise'
        });

        if (roleError) {
          await supabase.auth.signOut();
          toast.error('Unable to verify access.');
          return;
        }

        if (isFranchise) {
          // Store franchise session marker
          localStorage.setItem('xtsy_franchise_session', 'true');
          toast.success('Welcome back!');
          navigate('/franchise');
        } else {
          await supabase.auth.signOut();
          toast.error('Access denied. This portal is for franchise owners only.');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-500/10 mb-4">
            <Building2 className="w-8 h-8 text-blue-500" />
          </div>
          <h1 className="text-2xl font-semibold text-white">XTSY Franchise</h1>
          <p className="text-sm text-zinc-500 mt-1">Property Management Portal</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-zinc-400 text-sm">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input
                id="email"
                type="email"
                placeholder="you@property.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600"
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-zinc-400 text-sm">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600"
                disabled={loading}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        {/* Help Text */}
        <p className="text-center text-xs text-zinc-600 mt-6">
          Need access? Contact your XTSY administrator.
        </p>
      </div>
    </div>
  );
}
