/**
 * Admin Layout with Apple-style Header Navigation
 * Provides the main structure for all admin pages
 */

import { ReactNode, useState, useEffect } from 'react';
import { useNavigate } from '@/lib/router-compat';
import { supabase } from '@/integrations/supabase/client';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Loader2 } from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          navigate('/admin-login');
          return;
        }

        const { data: hasRole } = await supabase.rpc('has_role', {
          _user_id: user.id,
          _role: 'admin',
        });

        if (!hasRole) {
          navigate('/');
          return;
        }

        setIsAdmin(true);
      } catch (error) {
        console.error('Admin check failed:', error);
        navigate('/admin-login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAdmin();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        navigate('/admin-login');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <main className="max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
}
