/**
 * User Profile Page - Apple-grade UI with invoice download
 * Modern premium design with full booking details and invoicing
 */

import { useState, useEffect } from 'react';
import { useNavigate } from '@/lib/router-compat';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { 
  User, Mail, Calendar, LogOut, ChevronRight, Shield, Bell,
  HelpCircle, Settings, MapPin, Loader2, ArrowLeft, Bed, Package,
  Star, MessageCircle, Download, FileText, Phone, Receipt, Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { BookingChat } from '@/components/chat/BookingChat';
import { toast } from 'sonner';
import { getInvoice, downloadInvoiceAsPDF } from '@/services/invoiceService';

interface Booking {
  id: string;
  booking_id: string;
  room_type: string;
  check_in: string;
  check_out: string;
  total_amount: number;
  subtotal: number;
  taxes: number;
  booking_status: string;
  created_at: string;
  guests: number;
  quantity: number;
  special_requests?: string;
  guest_name?: string;
  email?: string;
  whatsapp_number?: string;
  source?: 'booking' | 'enquiry';
}

interface Enquiry {
  id: string;
  enquiry_id: string;
  room_type: string;
  room_name: string;
  check_in: string;
  check_out: string;
  total_amount: number;
  subtotal: number;
  gst_amount: number;
  status: string;
  created_at: string;
  quantity: number;
  special_requests?: string;
  guest_name?: string;
  email?: string;
  phone?: string;
}

type ProfileTab = 'overview' | 'bookings' | 'settings';

export default function UserProfile() {
  const navigate = useNavigate();
  const { user, isLoading, signOut } = useUserAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [activeTab, setActiveTab] = useState<ProfileTab>('overview');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatBookingId, setChatBookingId] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id || user?.email) {
      fetchBookingsAndEnquiries();
    }
  }, [user?.id, user?.email]);

  const fetchBookingsAndEnquiries = async () => {
    if (!user?.id && !user?.email) return;
    
    setLoadingBookings(true);
    try {
      // Fetch bookings
      let bookingsQuery = supabase
        .from('bookings')
        .select('id, booking_id, room_type, check_in, check_out, total_amount, subtotal, taxes, booking_status, created_at, guests, quantity, special_requests, guest_name, email, whatsapp_number')
        .order('created_at', { ascending: false });
      
      if (user?.id && user?.email) {
        bookingsQuery = bookingsQuery.or(`user_id.eq.${user.id},email.eq.${user.email}`);
      } else if (user?.id) {
        bookingsQuery = bookingsQuery.eq('user_id', user.id);
      } else if (user?.email) {
        bookingsQuery = bookingsQuery.eq('email', user.email);
      }

      // Fetch enquiries
      let enquiriesQuery = supabase
        .from('enquiries')
        .select('id, enquiry_id, room_type, room_name, check_in, check_out, total_amount, subtotal, gst_amount, status, created_at, quantity, special_requests, guest_name, email, phone')
        .order('created_at', { ascending: false });
      
      if (user?.id && user?.email) {
        enquiriesQuery = enquiriesQuery.or(`user_id.eq.${user.id},email.eq.${user.email}`);
      } else if (user?.id) {
        enquiriesQuery = enquiriesQuery.eq('user_id', user.id);
      } else if (user?.email) {
        enquiriesQuery = enquiriesQuery.eq('email', user.email);
      }

      const [bookingsResult, enquiriesResult] = await Promise.all([
        bookingsQuery,
        enquiriesQuery
      ]);

      // Combine bookings and enquiries
      const bookingsData: Booking[] = (bookingsResult.data || []).map(b => ({
        ...b,
        source: 'booking' as const
      })) as unknown as Booking[];

      const enquiriesAsBookings: Booking[] = (enquiriesResult.data || []).map(e => ({
        id: e.id,
        booking_id: e.enquiry_id,
        room_type: e.room_name || e.room_type,
        check_in: e.check_in,
        check_out: e.check_out,
        total_amount: e.total_amount,
        subtotal: e.subtotal,
        taxes: e.gst_amount,
        booking_status: e.status,
        created_at: e.created_at,
        guests: e.quantity,
        quantity: e.quantity,
        special_requests: e.special_requests,
        guest_name: e.guest_name,
        email: e.email,
        whatsapp_number: e.phone,
        source: 'enquiry' as const
      })) as unknown as Booking[];

      // Combine and sort by date
      const combined = [...bookingsData, ...enquiriesAsBookings].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setBookings(combined);
    } catch (err) {
      console.error('Error fetching bookings and enquiries:', err);
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      localStorage.removeItem('xtsy_admin_session');
      localStorage.removeItem('xtsy_franchise_session');
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
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">Loading your profile...</p>
        </motion.div>
      </div>
    );
  }

  const displayName = user.displayName || user.email?.split('@')[0] || 'Traveller';
  const email = user.email || '';
  const photoURL = user.photoURL;
  const createdAt = user.metadata?.creationTime 
    ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : null;
  const isGoogleUser = user.providerData?.some(p => p.providerId === 'google');

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: User },
    { id: 'bookings' as const, label: 'Bookings', icon: Bed, count: bookings.length },
    { id: 'settings' as const, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="px-4 py-3 flex items-center gap-4 max-w-2xl mx-auto">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Profile</h1>
        </div>
      </header>

      <main className="px-4 py-6 max-w-2xl mx-auto">
        {/* Profile Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="bg-gradient-to-br from-card via-card to-card/80 rounded-3xl p-6 border border-border/50 shadow-xl">
            <div className="flex items-center gap-4 mb-6">
              {photoURL ? (
                <img src={photoURL} alt={displayName} className="w-20 h-20 rounded-full object-cover ring-4 ring-primary/20" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center ring-4 ring-primary/20">
                  <span className="text-2xl font-bold text-primary-foreground">{displayName.charAt(0).toUpperCase()}</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-foreground truncate">{displayName}</h2>
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
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: bookings.length, label: 'Bookings' },
                { value: 0, label: 'Tours' },
                { value: 0, label: 'Reviews' },
              ].map((stat) => (
                <div key={stat.label} className="bg-muted/50 rounded-2xl p-3 text-center">
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
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
                  ? "bg-background shadow-xs text-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-primary/10 text-primary text-xs rounded-full">{tab.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && <OverviewTab key="overview" createdAt={createdAt} onNavigate={(tab) => setActiveTab(tab)} />}
          {activeTab === 'bookings' && <BookingsTab key="bookings" bookings={bookings} loading={loadingBookings} onOpenChat={openChat} />}
          {activeTab === 'settings' && <SettingsTab key="settings" onSignOut={handleSignOut} isSigningOut={isSigningOut} onNavigate={navigate} />}
        </AnimatePresence>

        <p className="text-center text-xs text-muted-foreground mt-8">XTSY Travellers App v1.1.0</p>
      </main>

      {chatBookingId && <BookingChat bookingId={chatBookingId} isOpen={chatOpen} onClose={() => setChatOpen(false)} isAdmin={false} />}
    </div>
  );
}

// Overview Tab
function OverviewTab({ createdAt, onNavigate }: { createdAt: string | null; onNavigate: (tab: ProfileTab) => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-2">Quick Actions</h3>
      <MenuCard>
        <MenuItem icon={<Bed className="w-5 h-5" />} label="My Bookings" sublabel="View and manage your stays" onClick={() => onNavigate('bookings')} />
        <MenuDivider />
        <MenuItem icon={<Package className="w-5 h-5" />} label="Tour Packages" sublabel="Your travel adventures" onClick={() => {}} />
        <MenuDivider />
        <MenuItem icon={<Star className="w-5 h-5" />} label="My Reviews" sublabel="Share your experiences" onClick={() => {}} />
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
function BookingsTab({ bookings, loading, onOpenChat }: { bookings: Booking[]; loading: boolean; onOpenChat: (bookingId: string) => void }) {
  const [expandedBooking, setExpandedBooking] = useState<Booking | null>(null);
  const [downloadingInvoice, setDownloadingInvoice] = useState(false);

  const handleDownloadInvoice = async (booking: Booking) => {
    setDownloadingInvoice(true);
    try {
      const result = await getInvoice(booking.booking_id);
      if (result.success && result.invoice?.html_content) {
        downloadInvoiceAsPDF(result.invoice.html_content, booking.booking_id);
        toast.success('Invoice downloaded successfully');
      } else {
        toast.error('Invoice not available for this booking');
      }
    } catch (error) {
      toast.error('Failed to download invoice');
    } finally {
      setDownloadingInvoice(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center py-12">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
          <Bed className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No bookings yet</h3>
        <p className="text-muted-foreground mb-4">Start your adventure by booking a stay!</p>
        <Button onClick={() => window.location.href = '/'}>Book Now</Button>
      </motion.div>
    );
  }

  if (expandedBooking) {
    const nights = Math.ceil((new Date(expandedBooking.check_out).getTime() - new Date(expandedBooking.check_in).getTime()) / (1000 * 60 * 60 * 24));
    
    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
        <button onClick={() => setExpandedBooking(null)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4">
          <ChevronRight className="w-4 h-4 rotate-180" />
          <span className="text-sm font-medium">Back to Bookings</span>
        </button>

        {/* Booking Header */}
        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-2xl p-5 border border-primary/20">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="font-mono text-xs text-primary mb-1">{expandedBooking.booking_id}</p>
              <h3 className="text-xl font-bold text-foreground">{expandedBooking.room_type}</h3>
            </div>
            <span className={cn(
              "px-3 py-1.5 text-xs font-semibold rounded-full",
              expandedBooking.booking_status === 'confirmed' ? "bg-green-500/20 text-green-600" :
              expandedBooking.booking_status === 'pending' ? "bg-amber-500/20 text-amber-600" :
              expandedBooking.booking_status === 'cancelled' ? "bg-red-500/20 text-red-600" :
              "bg-muted text-muted-foreground"
            )}>
              {expandedBooking.booking_status.charAt(0).toUpperCase() + expandedBooking.booking_status.slice(1)}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-background/50 rounded-xl p-3">
              <p className="text-xs text-muted-foreground mb-1">Check-in</p>
              <p className="font-semibold text-foreground">{format(new Date(expandedBooking.check_in), 'EEE, MMM d')}</p>
            </div>
            <div className="bg-background/50 rounded-xl p-3">
              <p className="text-xs text-muted-foreground mb-1">Check-out</p>
              <p className="font-semibold text-foreground">{format(new Date(expandedBooking.check_out), 'EEE, MMM d')}</p>
            </div>
          </div>
        </div>

        {/* Guest Details */}
        <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
          <div className="p-4 border-b border-border/50 flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            <h4 className="font-semibold text-foreground">Guest Details</h4>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground flex items-center gap-2"><User className="w-4 h-4" /> Name</span>
              <span className="font-medium text-foreground">{expandedBooking.guest_name || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground flex items-center gap-2"><Mail className="w-4 h-4" /> Email</span>
              <span className="font-medium text-foreground">{expandedBooking.email || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground flex items-center gap-2"><Phone className="w-4 h-4" /> Phone</span>
              <span className="font-medium text-foreground">{expandedBooking.whatsapp_number || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Booking Details */}
        <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
          <div className="p-4 border-b border-border/50 flex items-center gap-2">
            <Bed className="w-4 h-4 text-primary" />
            <h4 className="font-semibold text-foreground">Booking Details</h4>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Room Type</span>
              <span className="font-medium text-foreground">{expandedBooking.room_type}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Duration</span>
              <span className="font-medium text-foreground">{nights} Night{nights > 1 ? 's' : ''}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Guests</span>
              <span className="font-medium text-foreground">{expandedBooking.guests || expandedBooking.quantity}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Quantity</span>
              <span className="font-medium text-foreground">{expandedBooking.quantity}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Booked on</span>
              <span className="font-medium text-foreground">{format(new Date(expandedBooking.created_at), 'MMM d, yyyy')}</span>
            </div>
            {expandedBooking.special_requests && (
              <div className="pt-2 border-t border-border/50">
                <p className="text-xs text-muted-foreground mb-1">Special Requests</p>
                <p className="text-sm text-foreground">{expandedBooking.special_requests}</p>
              </div>
            )}
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
          <div className="p-4 border-b border-border/50 flex items-center gap-2">
            <Receipt className="w-4 h-4 text-primary" />
            <h4 className="font-semibold text-foreground">Pricing</h4>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium text-foreground">₹{expandedBooking.subtotal?.toLocaleString() || '-'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Taxes & Fees</span>
              <span className="font-medium text-foreground">₹{expandedBooking.taxes?.toLocaleString() || '0'}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-border/50">
              <span className="font-semibold text-foreground">Total</span>
              <span className="font-bold text-lg text-primary">₹{expandedBooking.total_amount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 pt-2">
          <Button 
            className="w-full gap-2 h-12 rounded-xl"
            onClick={() => handleDownloadInvoice(expandedBooking)}
            disabled={downloadingInvoice || expandedBooking.booking_status !== 'confirmed'}
            variant={expandedBooking.booking_status === 'confirmed' ? 'default' : 'outline'}
          >
            {downloadingInvoice ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {expandedBooking.booking_status === 'confirmed' ? 'Download Invoice' : 'Invoice Available After Confirmation'}
          </Button>
          <Button variant="outline" className="w-full gap-2 h-12 rounded-xl" onClick={() => onOpenChat(expandedBooking.id)}>
            <MessageCircle className="w-4 h-4" />
            Chat with Host
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-3">
      {bookings.map((booking, index) => {
        const nights = Math.ceil((new Date(booking.check_out).getTime() - new Date(booking.check_in).getTime()) / (1000 * 60 * 60 * 24));
        
        return (
          <motion.div
            key={booking.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => setExpandedBooking(booking)}
            className="bg-card rounded-2xl border border-border/50 overflow-hidden cursor-pointer hover:border-primary/30 hover:shadow-lg transition-all active:scale-[0.98]"
          >
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-[10px] text-primary/80 mb-0.5">{booking.booking_id}</p>
                  <h4 className="font-semibold text-foreground truncate">{booking.room_type}</h4>
                </div>
                <span className={cn(
                  "px-2 py-0.5 text-[10px] font-medium rounded-full ml-2 shrink-0",
                  booking.booking_status === 'confirmed' ? "bg-green-500/10 text-green-600" :
                  booking.booking_status === 'pending' ? "bg-amber-500/10 text-amber-600" :
                  "bg-muted text-muted-foreground"
                )}>
                  {booking.booking_status}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{format(new Date(booking.check_in), 'MMM d')} - {format(new Date(booking.check_out), 'MMM d')}</span>
                </div>
                <span className="text-border">•</span>
                <span>{nights}N</span>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-bold text-foreground">₹{booking.total_amount.toLocaleString()}</p>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

// Settings Tab
function SettingsTab({ onSignOut, isSigningOut, onNavigate }: { onSignOut: () => void; isSigningOut: boolean; onNavigate: (path: string) => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-2">Account</h3>
      <MenuCard>
        <MenuItem icon={<User className="w-5 h-5" />} label="Personal Information" sublabel="Name, email, phone" onClick={() => {}} />
        <MenuDivider />
        <MenuItem icon={<Shield className="w-5 h-5" />} label="Security" sublabel="Password, 2FA" onClick={() => {}} />
      </MenuCard>

      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-2 mt-6">Preferences</h3>
      <MenuCard>
        <MenuItem icon={<Bell className="w-5 h-5" />} label="Notifications" sublabel="Email, push, SMS" onClick={() => {}} />
      </MenuCard>

      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-2 mt-6">Support</h3>
      <MenuCard>
        <MenuItem icon={<HelpCircle className="w-5 h-5" />} label="Help & Support" sublabel="FAQs, contact us" onClick={() => onNavigate('/faq')} />
      </MenuCard>

      <div className="mt-8">
        <Button
          variant="outline"
          className="w-full h-14 rounded-2xl border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive gap-2"
          onClick={onSignOut}
          disabled={isSigningOut}
        >
          {isSigningOut ? <Loader2 className="w-5 h-5 animate-spin" /> : <><LogOut className="w-5 h-5" />Sign Out</>}
        </Button>
      </div>
    </motion.div>
  );
}

function MenuCard({ children }: { children: React.ReactNode }) {
  return <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">{children}</div>;
}

function MenuItem({ icon, label, sublabel, onClick, destructive }: { icon: React.ReactNode; label: string; sublabel?: string; onClick: () => void; destructive?: boolean }) {
  return (
    <button onClick={onClick} className={cn("w-full flex items-center gap-4 p-4 text-left transition-colors hover:bg-muted/50 active:bg-muted", destructive && "text-destructive")}>
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", destructive ? "bg-destructive/10" : "bg-primary/10")}>
        <span className={destructive ? "text-destructive" : "text-primary"}>{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground">{label}</p>
        {sublabel && <p className="text-sm text-muted-foreground">{sublabel}</p>}
      </div>
      <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
    </button>
  );
}

function MenuDivider() {
  return <div className="h-px bg-border/50 mx-4" />;
}
