/**
 * Apple-style Admin Sidebar Navigation
 * Modern collapsible sidebar with smooth animations
 */

import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  BarChart3,
  CalendarDays,
  BedDouble,
  Activity,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  {
    id: 'overview',
    label: 'Overview',
    icon: LayoutDashboard,
    section: 'overview',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    section: 'analytics',
  },
  {
    id: 'inventory',
    label: 'Inventory',
    icon: BedDouble,
    section: 'inventory',
  },
  {
    id: 'calendar',
    label: 'Calendar',
    icon: CalendarDays,
    section: 'calendar',
  },
  {
    id: 'activity',
    label: 'Live Activity',
    icon: Activity,
    section: 'activity',
  },
];

export function AdminSidebar({ collapsed, onToggle }: AdminSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get current section from URL hash or default to overview
  const currentSection = location.hash.replace('#', '') || 'overview';

  const handleNavClick = (section: string) => {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      window.history.replaceState(null, '', `#${section}`);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to log out');
    }
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen transition-all duration-300 ease-in-out',
        'bg-card/80 backdrop-blur-xl border-r border-border/50',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border/50">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold text-sm">X</span>
            </div>
            <span className="font-semibold text-sm">XTSY Admin</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className={cn(
            'h-8 w-8 rounded-lg hover:bg-muted',
            collapsed && 'mx-auto'
          )}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = currentSection === item.section;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.section)}
              className={cn(
                'w-full flex items-center gap-3 rounded-xl transition-all duration-200',
                'hover:bg-muted/80 active:scale-[0.98]',
                collapsed ? 'p-3 justify-center' : 'px-4 py-3',
                isActive && 'bg-primary/10 text-primary hover:bg-primary/15'
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={cn('w-5 h-5 flex-shrink-0', isActive && 'text-primary')} />
              {!collapsed && (
                <span className={cn('text-sm font-medium', isActive && 'text-primary')}>
                  {item.label}
                </span>
              )}
              {isActive && !collapsed && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-3 border-t border-border/50 space-y-1">
        <button
          onClick={() => navigate('/')}
          className={cn(
            'w-full flex items-center gap-3 rounded-xl transition-all duration-200',
            'hover:bg-muted/80 text-muted-foreground',
            collapsed ? 'p-3 justify-center' : 'px-4 py-3'
          )}
          title={collapsed ? 'Back to Site' : undefined}
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Back to Site</span>}
        </button>

        <button
          onClick={handleLogout}
          className={cn(
            'w-full flex items-center gap-3 rounded-xl transition-all duration-200',
            'hover:bg-destructive/10 text-destructive',
            collapsed ? 'p-3 justify-center' : 'px-4 py-3'
          )}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
