/**
 * Admin Layout v2 - Hamburger menu navigation (one function per page)
 * Calm, neutral, audit-friendly design
 */

import { ReactNode, useState, useEffect } from 'react';
import { useNavigate, NavLink } from '@/lib/router-compat';
import { supabase } from '@/integrations/supabase/client';
import { 
  Loader2, Menu, X, Building2, Users, Package, 
  Link2, Calendar, DollarSign, FileText, Star, 
  ClipboardList, LogOut, Home
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface AdminLayoutV2Props {
  children: ReactNode;
}

const menuItems = [
  { id: 'overview', label: 'Overview', icon: Home, path: '/admin' },
  { id: 'properties', label: 'Properties', icon: Building2, path: '/admin/properties' },
  { id: 'franchises', label: 'Franchise Owners', icon: Users, path: '/admin/franchises' },
  { id: 'inventory', label: 'Inventory & Yield', icon: Package, path: '/admin/inventory' },
  { id: 'otas', label: 'OTA Connections', icon: Link2, path: '/admin/otas' },
  { id: 'bookings', label: 'Bookings', icon: Calendar, path: '/admin/bookings' },
  { id: 'finance', label: 'Finance & Settlements', icon: DollarSign, path: '/admin/finance' },
  { id: 'gst', label: 'GST & Compliance', icon: FileText, path: '/admin/gst' },
  { id: 'reviews', label: 'Reviews (Read-only)', icon: Star, path: '/admin/reviews' },
  { id: 'audit', label: 'Audit Logs', icon: ClipboardList, path: '/admin/audit' },
];

export function AdminLayoutV2({ children }: AdminLayoutV2Props) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        navigate('/admin-login');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Signed out');
      navigate('/');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          <p className="text-sm text-zinc-500">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-zinc-950/95 backdrop-blur-sm border-b border-zinc-800">
        <div className="px-4 py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMenuOpen(true)}
            className="text-zinc-400 hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </Button>
          
          <div className="text-center">
            <h1 className="text-sm font-semibold text-white">XTSY Admin</h1>
          </div>

          <div className="w-9" /> {/* Spacer for alignment */}
        </div>
      </header>

      {/* Slide-out Menu */}
      {menuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="fixed left-0 top-0 bottom-0 z-50 w-72 bg-zinc-900 border-r border-zinc-800 overflow-y-auto">
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                  <span className="text-indigo-500 font-bold text-lg">X</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">XTSY Control</p>
                  <p className="text-xs text-zinc-500">Admin Panel</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMenuOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <nav className="p-2">
              {menuItems.map((item) => (
                <NavLink
                  key={item.id}
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-lg transition-colors mb-1",
                    location.pathname === item.path
                      ? "bg-indigo-500/10 text-indigo-400"
                      : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </NavLink>
              ))}
            </nav>

            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-zinc-800 bg-zinc-900">
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="w-full justify-start text-zinc-400 hover:text-white"
              >
                <LogOut className="w-4 h-4 mr-3" />
                Sign Out
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Main Content */}
      <main className="max-w-5xl mx-auto">
        {children}
      </main>
    </div>
  );
}
