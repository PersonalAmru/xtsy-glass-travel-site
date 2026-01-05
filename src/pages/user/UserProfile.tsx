/**
 * User Profile Page - Supabase Auth
 * Modern Apple-grade UI for viewing and managing user profile
 * Shows bookings, tour packages, and reviews
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { 
  User,
  Mail,
  Calendar,
  LogOut,
  ChevronRight,
  Shield,
  Bell,
  HelpCircle,
  Settings,
  MapPin,
  Loader2,
  ArrowLeft,
  Bed,
  Package,
  Star,
  MessageCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { BookingChat } from '@/components/chat/BookingChat';

interface Booking {
  id: string;
  booking_id: string;
  room_type: string;
  check_in: string;
  check_out: string;
  total_amount: number;
  booking_status: string;
  created_at: string;
}

type ProfileTab = 'overview' | 'bookings' | 'tours' | 'settings';

export default function UserProfile() {
  const navigate = useNavigate();
  const { user, isLoading, signOut } = useUserAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [activeTab, setActiveTab] = useState<ProfileTab>('overview');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatBookingId, setChatBookingId] = useState<string | null>(null);

  // Fetch user bookings
  useEffect(() => {
    if (user?.id) {
      fetchBookings();
    }
  }, [user?.id]);

  const fetchBookings = async () => {
    if (!user?.id) return;
    
    setLoadingBookings(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('id, booking_id, room_type, check_in, check_out, total_amount, booking_status, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setIsSigningOut(false);
    }
  };

  const openChat = (bookingId: string) => {
    setChatBookingId(bookingId);
    setChatOpen(true);
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Get user info
  const displayName = user.displayName || user.email?.split('@')[0] || 'Traveller';
  const email = user.email || '';
  const photoURL = user.photoURL;
  const createdAt = user.metadata?.creationTime 
    ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
      })
    : null;
  const isGoogleUser = user.providerData?.some(p => p.providerId === 'google');

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: User },
    { id: 'bookings' as const, label: 'Bookings', icon: Bed, count: bookings.length },
    { id: 'settings' as const, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="px-4 py-3 flex items-center gap-4 max-w-2xl mx-auto">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Profile</h1>
        </div>
      </header>

      <main className="px-4 py-6 max-w-2xl mx-auto">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="bg-gradient-to-br from-card to-card/80 rounded-3xl p-6 border border-border/50 shadow-lg">
            {/* Avatar & Name */}
            <div className="flex items-center gap-4 mb-6">
              {photoURL ? (
                <img 
                  src={photoURL} 
                  alt={displayName}
                  className="w-20 h-20 rounded-full object-cover ring-4 ring-primary/20"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center ring-4 ring-primary/20">
                  <span className="text-2xl font-bold text-primary-foreground">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-foreground truncate">
                  {displayName}
                </h2>
                <div className="flex items-center gap-2 text-muted-foreground">
                  {isGoogleUser && (
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  )}
                  <span className="text-sm truncate">{email}</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-muted/50 rounded-2xl p-3 text-center">
                <p className="text-2xl font-bold text-foreground">{bookings.length}</p>
                <p className="text-xs text-muted-foreground">Bookings</p>
              </div>
              <div className="bg-muted/50 rounded-2xl p-3 text-center">
                <p className="text-2xl font-bold text-foreground">0</p>
                <p className="text-xs text-muted-foreground">Tours</p>
              </div>
              <div className="bg-muted/50 rounded-2xl p-3 text-center">
                <p className="text-2xl font-bold text-foreground">0</p>
                <p className="text-xs text-muted-foreground">Reviews</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 p-1 bg-muted/50 rounded-xl overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 min-w-[80px] py-2.5 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2",
                activeTab === tab.id 
                  ? "bg-background shadow-sm text-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <OverviewTab 
              key="overview" 
              createdAt={createdAt} 
              onNavigate={(tab) => setActiveTab(tab)} 
            />
          )}
          {activeTab === 'bookings' && (
            <BookingsTab 
              key="bookings" 
              bookings={bookings} 
              loading={loadingBookings}
              onOpenChat={openChat}
            />
          )}
          {activeTab === 'settings' && (
            <SettingsTab 
              key="settings" 
              onSignOut={handleSignOut}
              isSigningOut={isSigningOut}
              onNavigate={navigate}
            />
          )}
        </AnimatePresence>

        {/* Version Info */}
        <p className="text-center text-xs text-muted-foreground mt-8">
          XTSY Travellers App v1.0.0
        </p>
      </main>

      {/* Chat Modal */}
      {chatBookingId && (
        <BookingChat
          bookingId={chatBookingId}
          isOpen={chatOpen}
          onClose={() => setChatOpen(false)}
          isAdmin={false}
        />
      )}
    </div>
  );
}

// Overview Tab
function OverviewTab({ 
  createdAt, 
  onNavigate 
}: { 
  createdAt: string | null;
  onNavigate: (tab: ProfileTab) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-2">
        Quick Actions
      </h3>
      
      <MenuCard>
        <MenuItem 
          icon={<Bed className="w-5 h-5" />}
          label="My Bookings"
          sublabel="View and manage your stays"
          onClick={() => onNavigate('bookings')}
        />
        <MenuDivider />
        <MenuItem 
          icon={<Package className="w-5 h-5" />}
          label="Tour Packages"
          sublabel="Your travel adventures"
          onClick={() => {}}
        />
        <MenuDivider />
        <MenuItem 
          icon={<Star className="w-5 h-5" />}
          label="My Reviews"
          sublabel="Share your experiences"
          onClick={() => {}}
        />
      </MenuCard>

      {createdAt && (
        <div className="mt-6 p-4 bg-muted/30 rounded-2xl">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">Member since {createdAt}</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// Bookings Tab
function BookingsTab({ 
  bookings, 
  loading,
  onOpenChat
}: { 
  bookings: Booking[];
  loading: boolean;
  onOpenChat: (bookingId: string) => void;
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="text-center py-12"
      >
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
          <Bed className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No bookings yet</h3>
        <p className="text-muted-foreground mb-4">Start your adventure by booking a stay!</p>
        <Button onClick={() => window.location.href = '/book'}>
          Book Now
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      {bookings.map((booking, index) => (
        <motion.div
          key={booking.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="bg-card rounded-2xl border border-border/50 overflow-hidden"
        >
          <div className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-mono text-xs text-primary mb-1">{booking.booking_id}</p>
                <h4 className="font-semibold text-foreground">{booking.room_type}</h4>
              </div>
              <span className={cn(
                "px-2 py-1 text-xs font-medium rounded-full",
                booking.booking_status === 'confirmed' 
                  ? "bg-green-500/10 text-green-500"
                  : booking.booking_status === 'pending'
                  ? "bg-amber-500/10 text-amber-500"
                  : "bg-muted text-muted-foreground"
              )}>
                {booking.booking_status}
              </span>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{format(new Date(booking.check_in), 'MMM d')} - {format(new Date(booking.check_out), 'MMM d')}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <p className="font-semibold text-foreground">₹{booking.total_amount.toLocaleString()}</p>
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-2"
                onClick={() => onOpenChat(booking.booking_id)}
              >
                <MessageCircle className="w-4 h-4" />
                Chat with Host
              </Button>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

// Settings Tab
function SettingsTab({ 
  onSignOut,
  isSigningOut,
  onNavigate
}: { 
  onSignOut: () => void;
  isSigningOut: boolean;
  onNavigate: (path: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-2">
        Account
      </h3>
      
      <MenuCard>
        <MenuItem 
          icon={<User className="w-5 h-5" />}
          label="Personal Information"
          sublabel="Name, email, phone"
          onClick={() => {}}
        />
        <MenuDivider />
        <MenuItem 
          icon={<Shield className="w-5 h-5" />}
          label="Security"
          sublabel="Password, 2FA"
          onClick={() => {}}
        />
      </MenuCard>

      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-2 mt-6">
        Preferences
      </h3>

      <MenuCard>
        <MenuItem 
          icon={<Bell className="w-5 h-5" />}
          label="Notifications"
          sublabel="Email, push, SMS"
          onClick={() => {}}
        />
      </MenuCard>

      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-2 mt-6">
        Support
      </h3>

      <MenuCard>
        <MenuItem 
          icon={<HelpCircle className="w-5 h-5" />}
          label="Help & Support"
          sublabel="FAQs, contact us"
          onClick={() => onNavigate('/faq')}
        />
      </MenuCard>

      {/* Sign Out Button */}
      <div className="mt-8">
        <Button
          variant="outline"
          className="w-full h-14 rounded-2xl border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive gap-2"
          onClick={onSignOut}
          disabled={isSigningOut}
        >
          {isSigningOut ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <LogOut className="w-5 h-5" />
              Sign Out
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}

// Menu Card Component
function MenuCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
      {children}
    </div>
  );
}

// Menu Item Component
interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  sublabel?: string;
  onClick: () => void;
  destructive?: boolean;
}

function MenuItem({ icon, label, sublabel, onClick, destructive }: MenuItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-4 p-4 text-left transition-colors",
        "hover:bg-muted/50 active:bg-muted",
        destructive && "text-destructive"
      )}
    >
      <div className={cn(
        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
        destructive ? "bg-destructive/10" : "bg-primary/10"
      )}>
        <span className={destructive ? "text-destructive" : "text-primary"}>
          {icon}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground">{label}</p>
        {sublabel && (
          <p className="text-sm text-muted-foreground">{sublabel}</p>
        )}
      </div>
      <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
    </button>
  );
}

// Menu Divider
function MenuDivider() {
  return <div className="h-px bg-border/50 mx-4" />;
}
