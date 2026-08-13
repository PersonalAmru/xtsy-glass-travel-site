/**
 * Franchise Layout - Professional, information-dense interface for property owners
 * Bottom tab navigation for mobile-first experience
 */

import { ReactNode, useState, useEffect } from 'react';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Home, Calendar, BarChart3, MessageSquare, MoreHorizontal, Loader2, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FranchiseLayoutProps {
  children: ReactNode;
}

const navItems = [
  { id: 'home', label: 'Home', icon: Home, path: '/franchise' },
  { id: 'bookings', label: 'Bookings', icon: Calendar, path: '/franchise/bookings' },
  { id: 'availability', label: 'Availability', icon: BarChart3, path: '/franchise/availability' },
  { id: 'messages', label: 'Messages', icon: MessageSquare, path: '/franchise/messages' },
  { id: 'more', label: 'More', icon: MoreHorizontal, path: '/franchise/more' },
];

export function FranchiseLayout({ children }: FranchiseLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isFranchise, setIsFranchise] = useState(false);
  const [propertyName, setPropertyName] = useState('');

  useEffect(() => {
    const checkFranchise = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          navigate('/franchise/login');
          return;
        }

        // Check if user has franchise role
        const { data: hasRole } = await supabase.rpc('has_role', {
          _user_id: user.id,
          _role: 'franchise',
        });

        if (!hasRole) {
          navigate('/franchise/login');
          return;
        }

        // Get assigned property
        const { data: assignments } = await supabase
          .from('franchise_assignments')
          .select('property_id, properties(name)')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .limit(1)
          .single();

        if (assignments?.properties) {
          setPropertyName((assignments.properties as any).name || 'Your Property');
        }

        setIsFranchise(true);
      } catch (error) {
        console.error('Franchise check failed:', error);
        navigate('/franchise/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkFranchise();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        navigate('/franchise/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-sm text-muted-foreground">Loading property...</p>
        </div>
      </div>
    );
  }

  if (!isFranchise) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-xs border-b border-border">
        <div className="px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-foreground">{propertyName}</h1>
            <p className="text-xs text-muted-foreground">Franchise Dashboard</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/franchise/install')}
              className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors"
            >
              <Download className="w-3 h-3" />
              Install
            </button>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500">
              Live
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xs border-t border-border safe-area-bottom">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path !== '/franchise' && location.pathname.startsWith(item.path));
            
            return (
              <NavLink
                key={item.id}
                to={item.path}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors",
                  isActive 
                    ? "text-blue-500" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive && "text-blue-500")} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
