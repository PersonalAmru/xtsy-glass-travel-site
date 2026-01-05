/**
 * Apple-style Admin Header Navigation
 * Horizontal nav bar replacing sidebar
 */

import { useState } from 'react';
import { useLocation, useNavigate, NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  BarChart3,
  CalendarDays,
  BedDouble,
  Activity,
  LogOut,
  ChevronLeft,
  MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AdminNotificationBell } from './AdminNotificationBell';
import { BookingChat } from '@/components/chat/BookingChat';

const navItems = [
  {
    id: 'overview',
    label: 'Overview',
    icon: LayoutDashboard,
    path: '/admin',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    path: '/admin/analytics',
  },
  {
    id: 'inventory',
    label: 'Inventory',
    icon: BedDouble,
    path: '/admin/inventory',
  },
  {
    id: 'calendar',
    label: 'Calendar',
    icon: CalendarDays,
    path: '/admin/calendar',
  },
  {
    id: 'activity',
    label: 'Live',
    icon: Activity,
    path: '/admin/activity',
  },
];

export function AdminHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const [chatBookingId, setChatBookingId] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to log out');
    }
  };

  const handleNotificationClick = (notification: any) => {
    if (notification.booking_id) {
      if (notification.type === 'new_message') {
        setChatBookingId(notification.booking_id);
        setChatOpen(true);
      } else {
        // For booking notifications, open chat
        setChatBookingId(notification.booking_id);
        setChatOpen(true);
      }
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-card/80 backdrop-blur-xl">
        <div className="flex h-14 items-center justify-between px-4 max-w-7xl mx-auto">
          {/* Logo & Back */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="h-8 w-8 rounded-lg hover:bg-muted"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-bold text-xs">X</span>
              </div>
              <span className="font-semibold text-sm hidden sm:block">XTSY Admin</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || 
                (item.path === '/admin' && location.pathname === '/admin/dashboard');

              return (
                <NavLink
                  key={item.id}
                  to={item.path}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                    'hover:bg-muted/80 active:scale-[0.98]',
                    isActive 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:inline">{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <AdminNotificationBell onNotificationClick={handleNotificationClick} />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Chat Modal for Admin */}
      {chatBookingId && (
        <BookingChat
          bookingId={chatBookingId}
          guestName="Admin"
          isOpen={chatOpen}
          onClose={() => {
            setChatOpen(false);
            setChatBookingId(null);
          }}
          isAdmin={true}
        />
      )}
    </>
  );
}
