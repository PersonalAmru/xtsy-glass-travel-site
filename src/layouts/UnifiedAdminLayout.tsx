/**
 * Unified Admin Layout - Apple-grade Admin Control Panel
 * Hamburger menu navigation with premium glassmorphic design
 * SECURITY: Includes real-time security alert notifications
 */

import { ReactNode, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { AdminNotificationBell } from '@/components/admin/AdminNotificationBell';
import { SecurityAlertNotification } from '@/components/admin/SecurityAlertNotification';
import { AdminUnreadPromptModal } from '@/components/admin/AdminUnreadPromptModal';
import { BookingChat } from '@/components/chat/BookingChat';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
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
  Sparkles,
  MessageCircle,
  Activity,
  Download,
  Shield,
  Search,
} from 'lucide-react';

interface UnifiedAdminLayoutProps {
  children: ReactNode;
}

// Streamlined admin menu
const menuItems = [
  { id: 'overview', label: 'Dashboard', icon: Home, path: '/admin' },
  { id: 'traffic', label: 'Live Traffic', icon: Activity, path: '/admin/traffic' },
  { id: 'bookings', label: 'Bookings Calendar', icon: Calendar, path: '/admin/bookings' },
  { id: 'inventory', label: 'Inventory', icon: Package, path: '/admin/inventory' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
  { id: 'search', label: 'Search Console', icon: Search, path: '/admin/analytics/search' },
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
          localStorage.removeItem('xtsy_admin_session');
          navigate('/admin-login');
          return;
        }

        // SECURITY: Always verify admin role server-side via has_role RPC.
        // The localStorage session marker is a UX hint only and must NEVER
        // be used as a security gate (it is client-controllable).
        const { data: hasRole, error: roleError } = await supabase.rpc('has_role', {
          _user_id: user.id,
          _role: 'admin',
        });

        if (roleError || !hasRole) {
          localStorage.removeItem('xtsy_admin_session');
          navigate('/admin-login');
          return;
        }

        setIsAdmin(true);
      } catch (error) {
        console.error('Admin check failed:', error);
        localStorage.removeItem('xtsy_admin_session');
        navigate('/admin-login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAdmin();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        localStorage.removeItem('xtsy_admin_session');
        navigate('/admin-login');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      // Clear admin session marker
      localStorage.removeItem('xtsy_admin_session');
      await supabase.auth.signOut();
      toast.success('Signed out from Admin Portal');
      navigate('/admin-login');
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

  // Get current page title
  const currentMenuItem = menuItems.find(item => item.path === location.pathname);
  const pageTitle = currentMenuItem?.label || 'Admin';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center backdrop-blur-xl border border-white/10">
              <Sparkles className="w-8 h-8 text-primary animate-pulse" />
            </div>
            <div className="absolute -inset-2 bg-primary/20 rounded-3xl blur-xl animate-pulse" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <p className="text-sm text-slate-400">Verifying access...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Subtle grid pattern overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />
      
      {/* Gradient orbs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[128px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[128px] pointer-events-none" />
      
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/5">
        <div className="backdrop-blur-xl bg-slate-950/80 px-4 py-3 flex items-center justify-between">
          {/* Left: Menu + Back */}
          <div className="flex items-center gap-1">
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-10 w-10 rounded-xl hover:bg-white/5 text-slate-300 hover:text-white transition-all"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="left" 
                className="w-80 p-0 bg-gradient-to-b from-slate-950 to-slate-900 border-white/10"
              >
                <SheetHeader className="p-5 border-b border-white/5">
                  <SheetTitle className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/25">
                        <span className="text-white font-bold text-lg">X</span>
                      </div>
                      <div className="absolute -inset-1 bg-primary/30 rounded-xl blur-md -z-10" />
                    </div>
                    <div>
                      <span className="font-semibold text-white block">XTSY Admin</span>
                      <span className="text-xs text-slate-500">Control Panel</span>
                    </div>
                  </SheetTitle>
                </SheetHeader>
                
                <nav className="flex-1 p-3 space-y-0.5 max-h-[calc(100vh-180px)] overflow-y-auto">
                  {menuItems.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    
                    return (
                      <motion.button
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        onClick={() => {
                          navigate(item.path);
                          setMenuOpen(false);
                        }}
                        className={cn(
                          'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                          'hover:bg-white/5 active:scale-[0.98]',
                          isActive 
                            ? 'bg-primary/10 text-primary border border-primary/20' 
                            : 'text-slate-400 hover:text-white'
                        )}
                      >
                        <div className={cn(
                          'w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
                          isActive ? 'bg-primary/20' : 'bg-white/5'
                        )}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="font-medium text-sm">{item.label}</span>
                        {isActive && (
                          <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        )}
                      </motion.button>
                    );
                  })}
                </nav>
                
                <div className="p-3 border-t border-white/5 space-y-0.5">
                  <button
                    onClick={() => {
                      navigate('/admin/install');
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-blue-400 hover:bg-blue-500/10 transition-all group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                      <Download className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-sm">Install App</span>
                  </button>
                  <button
                    onClick={() => {
                      navigate('/');
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white transition-all"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                      <ChevronLeft className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-sm">Back to Site</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                      <LogOut className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-sm">Logout</span>
                  </button>
                </div>
              </SheetContent>
            </Sheet>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="h-10 w-10 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </div>

          {/* Center: Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="text-white font-bold text-sm">X</span>
              </div>
            </div>
            <div className="hidden sm:block">
              <span className="font-semibold text-white text-sm">{pageTitle}</span>
            </div>
          </div>

          {/* Right: Notifications */}
          <div className="flex items-center gap-2">
            <AdminNotificationBell onNotificationClick={handleNotificationClick} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Security Alert Notifications - Real-time intrusion alerts */}
      <SecurityAlertNotification />

      {/* Once-per-session prompt for unread bookings/messages */}
      <AdminUnreadPromptModal />

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
