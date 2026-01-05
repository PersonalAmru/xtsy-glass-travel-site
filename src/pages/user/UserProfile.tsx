/**
 * User Profile Page
 * Modern Apple-grade UI for viewing and managing user profile
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from '@/contexts/UserAuthContext';
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
  ArrowLeft
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function UserProfile() {
  const navigate = useNavigate();
  const { user, isLoading, signOut } = useUserAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);

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
  const isGoogleUser = user.providerData?.some(p => p.providerId === 'google.com');

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="px-4 py-3 flex items-center gap-4 max-w-lg mx-auto">
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

      <main className="px-4 py-8 max-w-lg mx-auto">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
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
            <div className="grid grid-cols-2 gap-4">
              {createdAt && (
                <div className="bg-muted/50 rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs">Member since</span>
                  </div>
                  <p className="font-semibold text-foreground">{createdAt}</p>
                </div>
              )}
              <div className="bg-muted/50 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <MapPin className="w-4 h-4" />
                  <span className="text-xs">Location</span>
                </div>
                <p className="font-semibold text-foreground">Shillong, India</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Menu Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3"
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
            <MenuDivider />
            <MenuItem 
              icon={<Settings className="w-5 h-5" />}
              label="App Settings"
              sublabel="Theme, language"
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
              onClick={() => navigate('/faq')}
            />
          </MenuCard>
        </motion.div>

        {/* Sign Out Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <Button
            variant="outline"
            className="w-full h-14 rounded-2xl border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive gap-2"
            onClick={handleSignOut}
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
        </motion.div>

        {/* Version Info */}
        <p className="text-center text-xs text-muted-foreground mt-8">
          XTSY Travellers App v1.0.0
        </p>
      </main>
    </div>
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
