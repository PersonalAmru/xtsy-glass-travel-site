/**
 * Unified Admin Layout - Single source admin control panel
 * Hamburger menu navigation with all admin functions
 */

import { ReactNode, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { AdminNotificationBell } from '@/components/admin/AdminNotificationBell';
import { BookingChat } from '@/components/chat/BookingChat';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  Menu,
  X,
  Home,
  BarChart3,
  Calendar,
  Building2,
  Users,
  Package,
  Link2,
  DollarSign,
  FileText,
  Star,
  ClipboardList,
  LogOut,
  Loader2,
  ChevronLeft,
  MessageSquare,
} from 'lucide-react';

interface UnifiedAdminLayoutProps {
  children: ReactNode;
}

const menuItems = [
  { id: 'overview', label: 'Overview', icon: Home, path: '/admin' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
  { id: 'bookings', label: 'Bookings Calendar', icon: Calendar, path: '/admin/bookings' },
  { id: 'chats', label: 'Guest Chats', icon: MessageSquare, path: '/admin/chats' },
  { id: 'properties', label: 'Properties', icon: Building2, path: '/admin/properties' },
  { id: 'franchises', label: 'Franchise Owners', icon: Users, path: '/admin/franchises' },
  { id: 'inventory', label: 'Inventory & Yield', icon: Package, path: '/admin/inventory' },
  { id: 'otas', label: 'OTA Connections', icon: Link2, path: '/admin/otas' },
  { id: 'finance', label: 'Finance & Settlements', icon: DollarSign, path: '/admin/finance' },
  { id: 'gst', label: 'GST & Compliance', icon: FileText, path: '/admin/gst' },
  { id: 'reviews', label: 'Reviews', icon: Star, path: '/admin/reviews' },
  { id: 'audit', label: 'Audit Logs', icon: ClipboardList, path: '/admin/audit' },
];

export function UnifiedAdminLayout({ children }: UnifiedAdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [chatBookingId, setChatBookingId] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          navigate('/admin-login');
          return;
        }

        // Check if admin email
        if (user.email !== 'xtsy.social@gmail.com') {
          const { data: hasRole } = await supabase.rpc('has_role', {
            _user_id: user.id,
            _role: 'admin',
          });

          if (!hasRole) {
            navigate('/');
            return;
          }
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

  const handleNotificationClick = (notification: any) => {
    if (notification.booking_id) {
      setChatBookingId(notification.booking_id);
      setChatOpen(true);
    }
    setMenuOpen(false);
  };

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
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="px-4 py-3 flex items-center justify-between">
          {/* Left: Menu + Back */}
          <div className="flex items-center gap-2">
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0 bg-background border-border">
                <SheetHeader className="p-4 border-b border-border">
                  <SheetTitle className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-bold text-sm">X</span>
                    </div>
                    <span className="font-semibold">XTSY Admin</span>
                  </SheetTitle>
                </SheetHeader>
                
                <nav className="flex-1 p-4 space-y-1 max-h-[calc(100vh-140px)] overflow-y-auto">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          navigate(item.path);
                          setMenuOpen(false);
                        }}
                        className={cn(
                          'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all',
                          'hover:bg-muted/80 active:scale-[0.98]',
                          isActive 
                            ? 'bg-primary/10 text-primary' 
                            : 'text-muted-foreground hover:text-foreground'
                        )}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                        {isActive && (
                          <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                        )}
                      </button>
                    );
                  })}
                </nav>
                
                <div className="p-4 border-t border-border space-y-1">
                  <button
                    onClick={() => {
                      navigate('/');
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    <span className="font-medium">Back to Site</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-destructive hover:bg-destructive/10 transition-all"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              </SheetContent>
            </Sheet>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="h-9 w-9"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </div>

          {/* Center: Title */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold text-xs">X</span>
            </div>
            <span className="font-semibold text-sm">XTSY Admin</span>
          </div>

          {/* Right: Notifications + Actions */}
          <div className="flex items-center gap-2">
            <AdminNotificationBell onNotificationClick={handleNotificationClick} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto">
        {children}
      </main>

      {/* Chat Modal */}
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
    </div>
  );
}
